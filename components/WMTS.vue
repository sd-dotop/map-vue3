<template></template>

<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { getWidth, getTopLeft } from 'ol/extent.js'
import TileLayer from 'ol/layer/Tile'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { get as getProjection } from 'ol/proj'
import { initEPSG4490 } from '../helper/proj'

import axios from 'axios'

initEPSG4490();

const props = defineProps({
  url: String,
  layer: String,
  matrixSet: String,
  srs: String,
  version: String,
  format: String,
  style: String,
  minZoom: Number,
  maxZoom: Number,
  prefix: String, // 瓦片 matrixIds 前缀
  token: String, // 令牌
})

const { url, layer, matrixSet, srs, version, format, style, minZoom, maxZoom, prefix, token } = props

const map = inject('map')
const projection = getProjection(srs || 'EPSG:4326')
const projectionExtent = projection.getExtent() || [-180, -90, 180, 90]
const tileSizeMtrs = getWidth(projectionExtent) / 256
const resolutions = new Array()
const matrixIds = new Array()
for (let z = minZoom; z < maxZoom; ++z) {
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
  layer: layer,
  version: version || '1.0.0',
  matrixSet,
  format: format || 'image/png',
  style: style || 'default',
  // projection: projection,
  tileGrid: tileGrid,
  tileLoadFunction(tile, src) {
    if(token) {
      tile.getImage().src = src + '&tk=' + token
    } else {
      tile.getImage().src = src
    }
    
  },
})

const layerObj = new TileLayer({
  source: wmts,
})

onMounted(() => {
  if (map) {
    map.addLayer(layerObj)
  }
})

onUnmounted(() => {
  if (map && map.getLayers().getArray().includes(layerObj)) {
    map.removeLayer(layerObj)
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
  layerObj,
  getFeatureInfoByCoordinate,
})
</script>

<style scoped>
</style>