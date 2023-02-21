<script setup>
import { provide, inject, onMounted, onUnmounted } from 'vue'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'

const map = inject('map')
const vectorSource = new VectorSource({
  features: [],
})

const vectorLayer = new VectorLayer({
  source: vectorSource,
})
onMounted(() => {
  map.addLayer(vectorLayer)
})

onUnmounted(() => {
  map.removeLayer(vectorLayer)
})

provide('vectorSource', vectorSource)

defineExpose({
  vectorSource,
  vectorLayer,
})
</script>
<template><slot></slot></template>
