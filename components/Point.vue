<script setup>
import { toRefs, inject, onMounted, onUnmounted, watchEffect } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'

const props = defineProps({
  coordinate: Array,
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

const { coordinate } = toRefs(props)

const { radius, fillColor, strokeColor, strokeWidth } = props

const vectorSource = inject('vectorSource')
const point = new Feature({
  geometry: new Point(coordinate.value),
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

watchEffect(() => {
  point.setGeometry(new Point(coordinate.value))
})

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
