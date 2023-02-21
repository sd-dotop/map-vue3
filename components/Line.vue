<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import { Style, Stroke } from 'ol/style'

const props = defineProps({
  coordinates: {
    type: Array,
  },
})

const vectorSource = inject('vectorSource')
const line = new Feature(new LineString(props.coordinates))
line.setStyle(
  new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 3,
    }),
  })
)

onMounted(() => {
  vectorSource.addFeatures([line])
})

onUnmounted(() => {
  vectorSource.removeFeature(line)
})

defineExpose({
  line,
})
</script>
<template></template>
