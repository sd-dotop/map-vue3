<script setup>
import { toRefs, inject, onMounted, onUnmounted, watchEffect } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon } from 'ol/style'
import imgUrl from '../assets/Marker.svg'

const props = defineProps({
  coordinate: Array,
  src: String,
})

const { coordinate, src } = toRefs(props)

const vectorSource = inject('vectorSource')
const icon = new Feature({
  geometry: new Point(coordinate.value),
})

icon.setStyle(
  new Style({
    image: new Icon({
      src: src.value || imgUrl,
    }),
  })
)

watchEffect(() => {
  icon.setGeometry(new Point(coordinate.value))
})

onMounted(() => {
  vectorSource.addFeatures([icon])
})

onUnmounted(() => {
  vectorSource.removeFeature(icon)
})

defineExpose({
  icon,
})
</script>
<template></template>
