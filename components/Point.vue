<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'

const props = defineProps({
  coordinates: Array,
  radius: {
    type: Number,
    default: 10,
  },
  fillColor: {
    type: String,
    default: '#ff3333',
  },
  strokeColor: {
    type: String,
    default: '#ffffff',
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
})

const { coordinates, radius, fillColor, strokeColor, strokeWidth } = props

const vectorSource = inject('vectorSource')
const point = new Feature({
  geometry: new Point(coordinates),
})

point.setStyle(
  new Style({
    image: new Circle({
      radius,
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({
        color: strokeColor,
        width: strokeWidth,
      }),
    }),
  })
)
onMounted(() => {
  vectorSource.addFeatures([point])
})

onUnmounted(() => {
  vectorSource.removeFeature(point)
})

defineExpose({
  point,
})
</script>
<template></template>
