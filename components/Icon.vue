<script setup>
import { toRefs, inject, onMounted, onUnmounted, watchEffect } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Icon, Text, Fill, Stroke } from 'ol/style'
import imgUrl from '../assets/Marker.svg'

const props = defineProps({
  coordinate: Array,
  src: String,
  iconText: String,
  infoObj: Object
})

const { coordinate, src, iconText, infoObj } = toRefs(props)
console.log(infoObj)
const vectorSource = inject('vectorSource')
const icon = new Feature({
  geometry: new Point(coordinate.value),
  infoObj: infoObj || ''
})

icon.setStyle(
  new Style({
    image: new Icon({
      src: src.value || imgUrl,
    }),
    text: iconText.value ? new Text({
      text: iconText.value,
      offsetY: 25,
      scale: 1.3,
      fill: new Fill({
        color: '#666666',
      }),
      stroke: new Stroke({
        color: '#ffffff',
        width: 1.5,
      }),
    }) : undefined
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
