<script setup>
import { provide, inject, onMounted, onUnmounted } from 'vue'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'

const props = defineProps({
  zIndex: Number,
  opacity: {
    type: Number,
    defualt: 1,
  },
  minZoom: Number,
  maxZoom: Number,
})

const { zIndex, minZoom, maxZoom, opacity } = props

const map = inject('map')
const vectorSource = new VectorSource({
  features: [],
})

const vectorLayer = new VectorLayer({
  zIndex,
  opacity,
  minZoom,
  maxZoom,
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
