<!-- Home-page Component -->

<template>
  <div id="hello-world">
    Hello ! {{ user }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userName: String,
});

const user = computed(() => {
  return props.userName || 'User';
});
</script>

<style lang="scss">
#hello-world {
  font-size: 100px;
  margin-top: 20px;
  background: #EEEDED;
  color: #9C216E;
  padding: 100px;
  font-weight: lighter;
}
</style>