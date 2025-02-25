<template></template>

<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue'
import TileLayer from 'ol/layer/Tile'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import axios from 'axios'

const props = defineProps({
  url: String,
  version: String,
  layerName: String,
  matrixSet: String,
  format: String,
  epsg: String,
  tileGrid: Object,
  style: String,
})

const { url, layerName, matrixSet, format, epsg, tileGrid, style } = props

const map = inject('map')

const wmtsSource = new WMTS({
  url,
  layer: layerName,
  matrixSet,
  format,
  epsg,
  tileGrid: new WMTSTileGrid({
    origin: tileGrid.origin,
    resolutions: tileGrid.resolutions,
    matrixIds: tileGrid.matrixIds,
  }),
  style: style || 'default',
  wrapX: true,
  requestEncoding: 'KVP',
  attributions: '© <a href="your-attribution-link">Your Attribution</a>',
})

const wmtsLayer = new TileLayer({
  source: wmtsSource,
})

onMounted(() => {
  if (map) {
    map.addLayer(wmtsLayer)
  }
})

onUnmounted(() => {
  if (map && map.getLayers().getArray().includes(wmtsLayer)) {
    map.removeLayer(wmtsLayer)
  }
})

function getFeatureInfoByCoordinate(coordinate) {
  return new Promise((resolve, reject) => {
    const viewResolution = map.getView().getResolution()
    const url = `${url}?SERVICE=WMTS&REQUEST=GetFeatureInfo&VERSION=${version}&LAYER=${layerName}&STYLE=${style}&TILEMATRIXSET=${matrixSet}&TILEMATRIX=${tileGrid.matrixIds.indexOf(viewResolution)}&TILEROW=${Math.floor((coordinate[1] - tileGrid.origin[1]) / (viewResolution * 256))}&TILECOL=${Math.floor((coordinate[0] - tileGrid.origin[0]) / (viewResolution * 256))}&I=${coordinate[0]}&J=${coordinate[1]}&INFO_FORMAT=application/json`

    axios
      .get(url)
      .then((res) => {
        if (res.data) {
          resolve(res.data)
        } else {
          reject(res)
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

defineExpose({
  wmtsLayer,
  wmtsSource,
  getFeatureInfoByCoordinate,
})
</script>

<style scoped>
</style>