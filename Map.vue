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
import { drawPolygon } from './helper/drawPolygon'
const props = defineProps({
  center: {
    type: Array,
    default: [120, 36],
  },
  zoom: {
    type: Number,
    default: 10,
  },
  minZoom: {
    type: Number,
    default: 0,
  },
  maxZoom: {
    type: Number,
    default: 19,
  },
  loadingDefaultLayers: {
    type: Boolean,
    default: true,
  },
  singleClick: Function,
  contextMenu: Function,
})

const view = new View({
  projection,
  center: props.center,
  zoom: props.zoom,
  minZoom: props.minZoom,
  maxZoom: props.maxZoom,
  smoothResolutionConstraint: false, // 禁用平滑缩放
})

if (!props.loadingDefaultLayers) {
  vecLayer.getLayers().clear();
  imgLayer.getLayers().clear();
}

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
  return new Promise((resolve, reject) => {
    let found = false; // 标记是否找到特征
    map.forEachFeatureAtPixel(pixel, (feature) => {
      found = true; // 找到特征，设置标记为true
      resolve(feature); // 解决Promise
    });
    if (!found) {
      console.warn('No feature found at pixel. This error is an message, not affect operation.'); // 如果没有找到特征，打印警告
    }
  });
}


if (props.singleClick) {
  map.on('singleclick', props.singleClick)
}
if (props.contextMenu) {
  map.on('contextmenu', props.contextMenu);
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
  drawPolygon,
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
