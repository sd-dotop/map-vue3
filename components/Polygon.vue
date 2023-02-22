<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { Style, Fill, Stroke } from 'ol/style'

const props = defineProps({
  coordinates: Array,
  strokeColor: {
    type: String,
    default: '#ff3333',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
  fillColor: {
    type: String,
    default: '#ff333355',
  },
})

const { coordinates, strokeColor, strokeWidth, fillColor } = props

const vectorSource = inject('vectorSource')

const polygon = new Feature(new Polygon(coordinates))

polygon.setStyle(
  new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: strokeWidth,
    }),
    fill: new Fill({
      color: fillColor,
    }),
  })
)

onMounted(() => {
  vectorSource.addFeatures([polygon])
})

onUnmounted(() => {
  vectorSource.removeFeature(polygon)
})

defineExpose({
  polygon,
})
</script>
<template></template>
