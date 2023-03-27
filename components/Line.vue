<script setup>
import { toRefs, inject, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import LineString from 'ol/geom/LineString'
import { Style, Stroke } from 'ol/style'

const props = defineProps({
  coordinates: {
    type: Array,
  },
  strokeColor: {
    type: String,
    default: '#0000ff',
  },
  strokeWidth: {
    type: Number,
    default: 3,
  },
})

const { coordinates, strokeColor, strokeWidth } = toRefs(props)

const vectorSource = inject('vectorSource')
const line = new Feature(new LineString(coordinates.value))
line.setStyle(
  new Style({
    stroke: new Stroke({
      color: strokeColor.value,
      width: strokeWidth.value,
    }),
  })
)

watchEffect(() => {
  line.setGeometry(new LineString(coordinates.value))
})

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
