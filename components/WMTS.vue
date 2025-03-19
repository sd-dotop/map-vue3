<template></template>

<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { getWidth, getTopLeft } from 'ol/extent.js'
import TileLayer from 'ol/layer/Tile'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get as getProjection } from 'ol/proj'
import axios from 'axios'

const props = defineProps({
  url: String,
  layer: String,
  matrixSet: String,
  srs: String,
  version: String,
  format: String,
  style: String,
  maxZoom: Number,
  prefix: String, // 瓦片 matrixIds 前缀
})

const { url, layerName, matrixSet, format, srs, style, maxZoom, prefix } = props

const map = inject('map')
const projection = getProjection(srs || 'EPSG:4326')
const projectionExtent = projection.getExtent() || [-180, -90, 180, 90]
const tileSizeMtrs = getWidth(projectionExtent) / 256
const resolutions = new Array(maxZoom)
const matrixIds = new Array(maxZoom)
for (let z = 0; z < maxZoom; ++z) {
  resolutions[z] = tileSizeMtrs / Math.pow(2, z)
  matrixIds[z] = prefix && prefix + z || z;
}
const tileGrid = new WMTSTileGrid({
  origin: getTopLeft(projectionExtent),
  resolutions: resolutions,
  matrixIds: matrixIds,
})

const wmts = new WMTS({
  url,
  layer: layerName,
  matrixSet,
  format: format || 'image/png',
  style: style || 'default',
  projection: projection,
  tileGrid: tileGrid
})

const layer = new TileLayer({
  source: wmts,
})

onMounted(() => {
  if (map) {
    map.addLayer(layer)
  }
})

onUnmounted(() => {
  if (map && map.getLayers().getArray().includes(layer)) {
    map.removeLayer(layer)
  }
})

function getFeatureInfoByCoordinate(coordinate) {
  console.log('自己实现吧')
  // return new Promise((resolve, reject) => {
  //   const viewResolution = map.getView().getResolution()
  //   const url = `${url}?SERVICE=WMTS&REQUEST=GetFeatureInfo&VERSION=${version}&LAYER=${layerName}&STYLE=${style}&TILEMATRIXSET=${matrixSet}&TILEMATRIX=${tileGrid.matrixIds.indexOf(viewResolution)}&TILEROW=${Math.floor((coordinate[1] - tileGrid.origin[1]) / (viewResolution * 256))}&TILECOL=${Math.floor((coordinate[0] - tileGrid.origin[0]) / (viewResolution * 256))}&I=${coordinate[0]}&J=${coordinate[1]}&INFO_FORMAT=application/json`

  //   axios
  //     .get(url)
  //     .then((res) => {
  //       if (res.data) {
  //         resolve(res.data)
  //       } else {
  //         reject(res)
  //       }
  //     })
  //     .catch((e) => {
  //       reject(e)
  //     })
  // })
}

defineExpose({
  wmts,
  layer,
  getFeatureInfoByCoordinate,
})
</script>

<style scoped>
</style>