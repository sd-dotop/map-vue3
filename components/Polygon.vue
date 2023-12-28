<script setup>
import { toRefs, inject, onMounted, onUnmounted, watchEffect } from 'vue'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { Style, Fill, Stroke, Text } from 'ol/style'
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
  polygonName: {
    type: String,
    default: '',
  },
  polygonIndex: {
    type: Number,
    default: 3,
  },
  nameColor: {
    type: String,
    default: '',
  },
})
const { coordinates, strokeColor, strokeWidth, fillColor, polygonName, polygonIndex, nameColor } = toRefs(props)
console.log('polygonName', polygonName)
const vectorSource = inject('vectorSource')

const polygon = new Feature(new Polygon(coordinates.value))
console.log(polygon.getGeometry().getInteriorPoint().getCoordinates())

polygon.setStyle(
  new Style({
    stroke: new Stroke({
      color: strokeColor.value,
      width: strokeWidth.value,
    }),
    fill: new Fill({
      color: fillColor.value,
    }),
    text: polygonName.value
      ? new Text({
          text: polygonName.value,
          scale: 1.3,
          fill: new Fill({
            color: '#000000',
          }),
          stroke: new Stroke({
            color: strokeColor.value,
            width: 3.5,
          }),
        })
      : undefined,
  })
)

watchEffect(() => {
  polygon.setGeometry(new Polygon(coordinates.value))
  polygon.setStyle(
    new Style({
      zIndex: polygonIndex.value,
      stroke: new Stroke({
        color: strokeColor.value,
        width: strokeWidth.value,
      }),
      fill: new Fill({
        color: fillColor.value,
      }),
      text: polygonName.value
        ? new Text({
            text: polygonName.value,
            font: '12px sans-serif',
            // scale: 1.3,
            fill: new Fill({
              color: '#000000',
            }),
            stroke: new Stroke({
              color: nameColor.value || strokeColor.value,
              width: 3.5,
            }),
          })
        : undefined,
    })
  )
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
