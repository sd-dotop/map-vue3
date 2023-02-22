<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon } from 'ol/style'
import imgUrl from '../assets/Marker.svg'

const props = defineProps({
  coordinates: Array,
  src: String,
})

const { coordinates, src } = props

const vectorSource = inject('vectorSource')
const icon = new Feature({
  geometry: new Point(coordinates),
})

icon.setStyle(
  new Style({
    image: new Icon({
      src: src || imgUrl,
    }),
  })
)
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
