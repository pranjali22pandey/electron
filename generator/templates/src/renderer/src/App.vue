<template>
  <div id="app">
    <TemplateLayout />
    <div id="alert-container"></div> 
  </div>
</template>

<script setup>
import TemplateLayout from "./components/TemplateLayout.vue";
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: white;
  height: auto;
  position: relative; 
}

#alert-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  z-index: 1000; 
}

ifx-alert {
  display: block;
  margin: 0 auto;
  max-width: 500px; 
  font-size: 14px; 
}
</style>
