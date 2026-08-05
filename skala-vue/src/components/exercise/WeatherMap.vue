<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  locations: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-location', 'view-detail'])

const configStore = useConfigStore()
const mapElement = ref(null)
const activeLayer = ref('precipitation_new')

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const hasApiKey = computed(() => Boolean(OPENWEATHER_API_KEY))

const weatherLayers = [
  { value: 'precipitation_new', label: '강수', icon: 'mdi-weather-rainy' },
  { value: 'clouds_new', label: '구름', icon: 'mdi-weather-cloudy' },
  { value: 'temp_new', label: '기온', icon: 'mdi-thermometer' },
  { value: 'wind_new', label: '바람', icon: 'mdi-weather-windy' },
  { value: 'pressure_new', label: '기압', icon: 'mdi-gauge' },
]

// OpenWeather Maps 1.0 공식 기본 팔레트와 값 범위를 사용합니다.
const mapLegends = {
  precipitation_new: {
    title: '강수량',
    unit: 'mm',
    ticks: [0, 1, 10, 50, 140],
    maxPlus: true,
    gradient:
      'linear-gradient(90deg, rgba(225, 200, 100, 0) 0%, rgba(110, 110, 205, 0.3) 25%, rgba(80, 80, 225, 0.7) 55%, rgba(20, 20, 255, 0.9) 100%)',
  },
  clouds_new: {
    title: '구름량',
    unit: '%',
    ticks: [0, 25, 50, 75, 100],
    gradient:
      'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(247, 247, 255, 0.5) 50%, rgba(244, 244, 255, 1) 75%, rgba(240, 240, 255, 1) 100%)',
  },
  temp_new: {
    title: '기온',
    unit: '°C',
    ticks: [-40, -20, 0, 10, 20, 30],
    gradient:
      'linear-gradient(90deg, rgb(130, 22, 146) 0%, rgb(32, 140, 236) 28%, rgb(35, 221, 221) 50%, rgb(194, 255, 40) 67%, rgb(255, 240, 40) 80%, rgb(252, 128, 20) 100%)',
  },
  wind_new: {
    title: '풍속',
    unit: 'm/s',
    ticks: [1, 5, 15, 25, 50, 100],
    maxPlus: true,
    gradient:
      'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(238, 206, 206, 0.4) 20%, rgba(179, 100, 188, 0.7) 45%, rgba(63, 33, 59, 0.8) 65%, rgba(116, 76, 172, 0.9) 82%, rgb(70, 0, 175) 100%)',
  },
  pressure_new: {
    title: '해수면 기압',
    unit: 'hPa',
    ticks: [940, 980, 1010, 1040, 1080],
    gradient:
      'linear-gradient(90deg, rgb(0, 115, 255) 0%, rgb(75, 208, 214) 28%, rgb(176, 247, 32) 50%, rgb(240, 184, 0) 68%, rgb(251, 85, 21) 84%, rgb(198, 0, 0) 100%)',
  },
}

const activeLayerLabel = computed(
  () => weatherLayers.find((layer) => layer.value === activeLayer.value)?.label || '',
)

const activeLegend = computed(() => {
  const legend = mapLegends[activeLayer.value]
  if (activeLayer.value !== 'temp_new' || configStore.unit !== 'fahrenheit') return legend

  return {
    ...legend,
    unit: '°F',
    ticks: legend.ticks.map((temperature) => Math.round((temperature * 9) / 5 + 32)),
  }
})

const legendTickLabels = computed(() =>
  activeLegend.value.ticks.map((tick, index, ticks) =>
    activeLegend.value.maxPlus && index === ticks.length - 1 ? `${tick}+` : `${tick}`,
  ),
)

let map = null
let weatherTileLayer = null
let locationLayer = null
let pinnedLocationMarker = null
let popupCloseTimer = null

const handleMapClick = ({ latlng }) => {
  emit('select-location', {
    lat: latlng.lat,
    lon: latlng.lng,
  })
}

const convertTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') return Math.round((temperature * 9) / 5 + 32)
  return Math.round(temperature)
}

const createLocationPopup = (location) => {
  const wrapper = document.createElement('div')
  const title = document.createElement('strong')
  const description = document.createElement('div')

  wrapper.className = 'weather-location-window'
  title.className = 'weather-location-title'
  description.className = 'weather-location-description'
  title.textContent = location.name
  description.textContent = `${location.status} · ${convertTemperature(location.temp)}${configStore.unitSymbol}`
  wrapper.append(title, description)

  if (location.query) {
    const detailButton = document.createElement('button')
    detailButton.className = 'weather-location-detail'
    detailButton.type = 'button'
    detailButton.textContent = '상세보기'
    detailButton.addEventListener('click', (event) => {
      L.DomEvent.stopPropagation(event)
      emit('view-detail', location)
    })
    wrapper.append(detailButton)
  }

  L.DomEvent.disableClickPropagation(wrapper)
  return wrapper
}

const updateLocations = () => {
  if (!map || !locationLayer) return

  if (popupCloseTimer) clearTimeout(popupCloseTimer)
  popupCloseTimer = null
  pinnedLocationMarker = null
  locationLayer.clearLayers()
  const validLocations = props.locations.filter(
    (location) => Number.isFinite(location.lat) && Number.isFinite(location.lon),
  )

  if (!validLocations.length) {
    map.setView([36.5, 127.8], 6)
    return
  }

  const bounds = []
  validLocations.forEach((location) => {
    const point = [location.lat, location.lon]
    bounds.push(point)

    const marker = L.circleMarker(point, {
      radius: 8,
      weight: 3,
      color: '#ffffff',
      fillColor: '#1976d2',
      fillOpacity: 0.95,
      bubblingMouseEvents: false,
    })
      .bindPopup(createLocationPopup(location), {
        className: 'weather-location-popup',
        closeButton: true,
        maxWidth: 280,
        offset: [0, -5],
        autoPan: false,
      })
      .addTo(locationLayer)

    const cancelPopupClose = () => {
      if (!popupCloseTimer) return
      clearTimeout(popupCloseTimer)
      popupCloseTimer = null
    }

    const schedulePopupClose = () => {
      cancelPopupClose()
      popupCloseTimer = setTimeout(() => {
        if (pinnedLocationMarker !== marker) marker.closePopup()
        popupCloseTimer = null
      }, 160)
    }

    marker.on('mouseover', () => {
      cancelPopupClose()
      if (!pinnedLocationMarker) marker.openPopup()
    })

    marker.on('mouseout', schedulePopupClose)

    marker.on('click', (event) => {
      if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent)
      cancelPopupClose()
      if (pinnedLocationMarker && pinnedLocationMarker !== marker) {
        pinnedLocationMarker.closePopup()
      }
      pinnedLocationMarker = marker
      marker.openPopup()
    })

    marker.on('popupopen', ({ popup }) => {
      const popupElement = popup.getElement()
      if (!popupElement) return
      popupElement.onmouseenter = cancelPopupClose
      popupElement.onmouseleave = schedulePopupClose
    })

    marker.on('popupclose', () => {
      cancelPopupClose()
      if (pinnedLocationMarker === marker) pinnedLocationMarker = null
    })
  })

  if (bounds.length === 1) {
    const zoom = validLocations[0].preserveView ? map.getZoom() : 8
    map.setView(bounds[0], zoom)
  } else {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 })
  }
}

const updateWeatherLayer = () => {
  if (!map || !hasApiKey.value) return
  if (weatherTileLayer) map.removeLayer(weatherTileLayer)

  weatherTileLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/${activeLayer.value}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
    {
      attribution: '&copy; OpenWeather',
      maxZoom: 18,
      opacity: 0.68,
    },
  ).addTo(map)
}

onMounted(async () => {
  await nextTick()
  if (!mapElement.value) return

  map = L.map(mapElement.value, {
    attributionControl: true,
    zoomControl: false,
  }).setView([36.5, 127.8], 6)

  if (props.selectable) map.on('click', handleMapClick)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map)
  L.control.zoom({ position: 'bottomright' }).addTo(map)

  locationLayer = L.layerGroup().addTo(map)
  updateWeatherLayer()
  updateLocations()

  requestAnimationFrame(() => map?.invalidateSize())
})

watch(activeLayer, updateWeatherLayer)
watch(
  [() => props.locations, () => configStore.unit],
  () => {
    updateLocations()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (popupCloseTimer) clearTimeout(popupCloseTimer)
  popupCloseTimer = null
  pinnedLocationMarker = null
  map?.remove()
  map = null
  weatherTileLayer = null
  locationLayer = null
})
</script>

<template>
  <v-card
    class="mb-4 overflow-hidden"
    :class="{ 'weather-map-card--expanded': expanded }"
    color="surface"
    elevation="1"
    rounded="xl"
  >
    <v-card-item class="pa-5 pb-2">
      <template #prepend>
        <v-icon color="primary" icon="mdi-map-outline" />
      </template>
      <v-card-title class="font-weight-bold">실시간 기상 지도</v-card-title>
      <v-card-subtitle>
        지도 위에 현재 {{ activeLayerLabel }} 레이어를 표시합니다.
        <span v-if="selectable">지도를 클릭하면 해당 위치를 선택합니다.</span>
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="px-5 pb-5">
      <v-chip-group v-model="activeLayer" class="mb-3 layer-selector" mandatory>
        <v-chip
          v-for="layer in weatherLayers"
          :key="layer.value"
          color="primary"
          :prepend-icon="layer.icon"
          :text="layer.label"
          :value="layer.value"
          variant="tonal"
        />
      </v-chip-group>

      <v-alert v-if="!hasApiKey" color="warning" icon="mdi-key-alert-outline" variant="tonal">
        OpenWeather API 키가 없어 기상 지도를 표시할 수 없습니다.
      </v-alert>

      <div v-else class="map-frame position-relative">
        <v-progress-linear v-if="loading" class="map-progress" color="primary" indeterminate />
        <div
          ref="mapElement"
          aria-label="OpenWeather 실시간 기상 지도"
          class="weather-map"
          :class="{ 'weather-map--selectable': selectable }"
          role="region"
        />
        <div class="map-legend" :aria-label="`${activeLegend.title} 범례`">
          <div class="mb-1 d-flex align-center justify-space-between ga-3">
            <strong class="text-caption">{{ activeLegend.title }}</strong>
            <span class="text-caption text-medium-emphasis">{{ activeLegend.unit }}</span>
          </div>
          <div class="legend-gradient" :style="{ backgroundImage: activeLegend.gradient }" />
          <div class="legend-ticks d-flex justify-space-between">
            <span v-for="tick in legendTickLabels" :key="tick">{{ tick }}</span>
          </div>
        </div>
      </div>

      <p class="mt-2 text-caption text-medium-emphasis">
        지도: CARTO Positron · 기상 레이어: OpenWeather Maps 1.0
      </p>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.layer-selector {
  overflow-x: auto;
}

.map-frame,
.weather-map {
  width: 100%;
  height: 420px;
}

.map-frame {
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  border-radius: 18px;
}

.weather-map {
  z-index: 0;
}

.weather-map--selectable {
  cursor: crosshair;
}

.weather-map-card--expanded .map-frame,
.weather-map-card--expanded .weather-map {
  height: min(68vh, 680px);
  min-height: 560px;
}

.map-progress {
  position: absolute;
  z-index: 500;
  top: 0;
  right: 0;
  left: 0;
}

.map-legend {
  position: absolute;
  z-index: 450;
  bottom: 18px;
  left: 16px;
  width: min(340px, calc(100% - 88px));
  padding: 10px 12px 8px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.14);
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.92);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
}

.legend-gradient {
  height: 10px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 999px;
  background-color: rgba(var(--v-theme-on-surface), 0.08);
}

.legend-ticks {
  margin-top: 3px;
  font-size: 0.625rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
}

:deep(.weather-location-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px;
  color: rgb(var(--v-theme-on-surface));
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
}

:deep(.weather-location-popup .leaflet-popup-tip) {
  background: rgb(var(--v-theme-surface));
}

:deep(.weather-location-popup .leaflet-popup-content) {
  min-width: 180px;
  margin: 14px 18px;
}

:deep(.weather-location-title) {
  display: block;
  margin-bottom: 2px;
  font-size: 0.925rem;
}

:deep(.weather-location-description) {
  color: rgba(var(--v-theme-on-surface), 0.72);
  font-size: 0.8rem;
}

:deep(.weather-location-detail) {
  width: 100%;
  margin-top: 10px;
  padding: 7px 12px;
  border: 0;
  border-radius: 8px;
  color: rgb(var(--v-theme-on-primary));
  background: rgb(var(--v-theme-primary));
  font: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

:deep(.weather-location-detail:hover) {
  filter: brightness(1.08);
}

:deep(.weather-location-detail:focus-visible) {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

@media (max-width: 599px) {
  .map-frame,
  .weather-map {
    height: 320px;
  }

  .weather-map-card--expanded .map-frame,
  .weather-map-card--expanded .weather-map {
    height: 480px;
    min-height: 480px;
  }

  .map-legend {
    bottom: 24px;
    left: 10px;
    width: calc(100% - 64px);
    padding: 8px 10px 6px;
  }
}
</style>
