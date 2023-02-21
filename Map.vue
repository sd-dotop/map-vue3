<template>
  <div class="m-map-wrapper" ref="mapRef">
    <slot />
  </div>
</template>
<script setup>
import { ref, provide, onMounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import projection from './helper/projection'
import { vecLayer, imgLayer } from './helper/baselayer'

const props = defineProps({
  center: {
    type: Array,
    default: [120, 36],
  },
  zoom: {
    type: Number,
    default: 10,
  },
})

const view = new View({
  projection,
  center: props.center,
  zoom: props.zoom,
})

const map = new Map({
  view,
  renderer: 'webgl',
  layers: [vecLayer, imgLayer],
})

const mapRef = ref(null)

onMounted(() => {
  map.setTarget(mapRef.value)
})

provide('map', map)

function setCenter(lnglat) {
  view.setCenter(lnglat)
}

defineExpose({
  setCenter,
  map,
  view,
  vecLayer,
  imgLayer,
})
</script>
<style>
.m-map-wrapper {
  width: 100%;
  height: 100%;
}
</style>
