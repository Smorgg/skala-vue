<script setup>
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import SampleOne from './components/practices/basic/SmapleOne.vue'
import DirectiveHtml from './components/practices/basic/DirectiveHtml.vue'
import DirectiveText from './components/practices/basic/DirectiveText.vue';
import DirectiveBind from './components/practices/basic/DirectiveBind.vue';
import DirectiveBindC from './components/practices/basic/DirectiveBindC.vue';
import StyleBind from './components/practices/basic/StyleBind.vue';
import EventHandler from './components/practices/basic/EventHandler.vue';
import EventModifier from './components/practices/basic/EventModifier.vue';
import EventObject from './components/practices/basic/EventObject.vue';
import TwoWay from './components/practices/basic/TwoWay.vue';
import FormBind from './components/practices/basic/FormBind.vue';
import BindModifier from './components/practices/basic/BindModifier.vue';
import VueStyle from './components/practices/basic/VueStyle.vue';
</script>

<template>
  <div>
    <SampleOne></SampleOne>
    <SampleTwo></SampleTwo>
    <DirectiveHtml></DirectiveHtml>
    <DirectiveText></DirectiveText>
    <DirectiveBind></DirectiveBind>
    <DirectiveBindC></DirectiveBindC>
    <StyleBind></StyleBind>
    <EventHandler></EventHandler>
    <EventObject></EventObject>
    <EventModifier></EventModifier>
    <TwoWay></TwoWay>
    <FormBind></FormBind>
    <BindModifier></BindModifier>
    <VueStyle></VueStyle>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
