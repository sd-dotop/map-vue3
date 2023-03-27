<script setup>
import { toRefs, inject, onMounted, onUnmounted, watchEffect } from 'vue'
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

const { coordinates, strokeColor, strokeWidth, fillColor } = toRefs(props)

const vectorSource = inject('vectorSource')

const polygon = new Feature(new Polygon(coordinates.value))

polygon.setStyle(
  new Style({
    stroke: new Stroke({
      color: strokeColor.value,
      width: strokeWidth.value,
    }),
    fill: new Fill({
      color: fillColor.value,
    }),
  })
)

watchEffect(() => {
  polygon.setGeometry(new Polygon(coordinates.value))
})

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
