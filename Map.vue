<template>
  <div class="m-map-wrapper" ref="mapRef">
    <div class="map-toolbar" v-if="showToolbar">
      <el-tooltip content="放大" placement="left">
        <div class="toolbar-item" @click="zoomIn">
          <el-icon><Plus /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="缩小" placement="left">
        <div class="toolbar-item" @click="zoomOut">
          <el-icon><Minus /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="定位/坐标拾取" placement="left">
        <div class="toolbar-item" :class="[clickType == 'coordinate' ? 'on' : '']" @click="startCoordinatePicker('coordinate')">
          <el-icon><location /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="测量距离" placement="left">
        <div class="toolbar-item" :class="[clickType == 'LineString' ? 'on' : '']" @click="mapMeasure('LineString')">
          <img src="@/assets/images/tool_length.png" alt="" />
        </div>
      </el-tooltip>
      <el-tooltip content="测量面积" placement="left">
        <div class="toolbar-item" :class="[clickType == 'Polygon' ? 'on' : '']" @click="mapMeasure('Polygon')">
          <el-icon><crop /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="清除" placement="left">
        <div class="toolbar-item" @click="clearClick()">
          <el-icon><Delete /></el-icon>
        </div>
      </el-tooltip>
    </div>
    <!-- 坐标拾取对话框 -->
    <position-box v-model="positionDialogVisible" :map="map"/>
    <slot />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { Location, Crop } from '@element-plus/icons-vue'
import projection from './helper/projection'
import { vecLayer, imgLayer } from './helper/baselayer'
import { measure, cancelMeasure } from './helper/measure'
import { drawPolygon } from './helper/drawPolygon'
import PositionBox from './components/PositionBox.vue'

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
  showToolbar: {
    type: Boolean,
    default: true,
  },
  loadingDefaultLayers: {
    type: Boolean,
    default: true,
  },
  singleClick: Function,
  contextMenu: Function,
})

// 工具栏功能实现
const clickType = ref(null)
let positionDialogVisible = ref(false);

const view = new View({
  projection,
  center: props.center,
  zoom: props.zoom,
  minZoom: props.minZoom,
  maxZoom: props.maxZoom,
  smoothResolutionConstraint: false,
})

if (!props.loadingDefaultLayers) {
  vecLayer.getLayers().clear();
  imgLayer.getLayers().clear();
}

const scale = ref(null);
const scaleControl = new ScaleLine({
  target: scale.value,
  units: 'metric',
  bar: true,
  steps: 4,
  text: true,
  minWidth: 100,
});

const controls = defaultControls({
  zoom: false // 禁用缩放控件
});
const map = new Map({
  view,
  renderer: 'webgl',
  layers: [vecLayer, imgLayer],
  controls: controls.extend([scaleControl])
})

const mapRef = ref(null)
onMounted(() => {
  map.setTarget(mapRef.value)
})

provide('map', map)

const zoomIn = () => {
  const currentZoom = view.getZoom();
  view.setZoom(currentZoom + 0.5);
}

const zoomOut = () => {
  const currentZoom = view.getZoom();
  view.setZoom(currentZoom - 0.5);
}

const startCoordinatePicker = (type) => {
  // 先取消任何现有的交互
  positionDialogVisible.value = !positionDialogVisible.value
  if (clickType.value == type) {
    clickType.value = null
    return
  }
  clickType.value = type
}
watch(positionDialogVisible, (newVal) => {
  if (!newVal) clearClick()
})

const mapMeasure = (type) => {
  cancelMeasure(map);
  if (clickType.value == type) {
    clickType.value = null
    return
  }
  clickType.value = type
  measure(map, type)
}

function clearClick() {
  clickType.value = null;
  positionDialogVisible.value = false
  cancelMeasure(map)
}

function setCenter(lnglat) {
  view.setCenter(lnglat)
}

function getFeatureByPixel(pixel) {
  return new Promise((resolve, reject) => {
    let found = false;
    map.forEachFeatureAtPixel(pixel, (feature) => {
      found = true;
      resolve(feature);
    });
    if (!found) {
      console.warn('No feature found at pixel. This error is an message, not affect operation.');
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
  scale
})
</script>

<style>
.m-map-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-scale {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  border-radius: 4px;
}

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

.map-toolbar {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: rgba(30, 60, 100, 0.8);
  color: #ffffff;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  .on {
    background-color: #5db7ff;
  }
}

.toolbar-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}
.toolbar-item img {
  width: 17px;
  height: 17px;
}

.toolbar-item:hover {
  background-color: #409eff;
  /* color: #409eff; */
}

.map-scale {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  border-radius: 4px;
}

.helper-tip {
  color: #ffffff;
}


</style>