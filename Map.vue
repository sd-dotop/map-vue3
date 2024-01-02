<template>
  <div class="m-map-wrapper" ref="mapRef">
    <slot />
  </div>
</template>
<script setup>
import { ref, provide, onMounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import projection from './helper/projection'
import { vecLayer, imgLayer } from './helper/baselayer'
import { measure, cancelMeasure } from './helper/measure'
// import { drawPolygon } from './helper/drawPolygon'
const props = defineProps({
  center: {
    type: Array,
    default: [120, 36],
  },
  zoom: {
    type: Number,
    default: 10,
  },
  singleClick: Function,
})

const view = new View({
  projection,
  center: props.center,
  zoom: props.zoom,
})

const map = new Map({
  view,
  renderer: 'webgl',
  layers: [vecLayer, imgLayer],
})

const mapRef = ref(null)
onMounted(() => {
  map.setTarget(mapRef.value)
})

provide('map', map)

function setCenter(lnglat) {
  view.setCenter(lnglat)
}
function getFeatureByPixel(pixel) {
  return new Promise((resolve) => {
    map.forEachFeatureAtPixel(pixel, (feature) => {
      resolve(feature)
    })
  })
}

if (props.singleClick) {
  map.on('singleclick', props.singleClick)
}

defineExpose({
  setCenter,
  map,
  view,
  vecLayer,
  imgLayer,
  getFeatureByPixel,
  measure,
  cancelMeasure,
  // drawPolygon,
})
</script>
<style>
.m-map-wrapper {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
:deep(.ol-tooltip) {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}

:deep(.ol-tooltip-measure) {
  opacity: 1;
  font-weight: bold;
}

:deep(.ol-tooltip-static) {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}

:deep(.ol-tooltip-measure:before),
:deep(.ol-tooltip-static:before) {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: '';
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}

:deep(.ol-tooltip-static:before) {
  border-top-color: #ffcc33;
}
</style>
