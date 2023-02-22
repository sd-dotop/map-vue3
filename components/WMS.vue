<template></template>
<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import axios from 'axios'

const props = defineProps({
  url: String,
  params: Object,
})

const { url, params } = props

const map = inject('map')

const layer = new TileLayer()

const wms = new TileWMS({
  url,
  params,
})

layer.setSource(wms)

onMounted(() => {
  map.addLayer(layer)
})

onUnmounted(() => {
  map.removeLayer(layer)
})

function getFatureInfoByCoodinate(coordinate) {
  return new Promise((resolve, reject) => {
    const url = wms.getFeatureInfoUrl(coordinate, map.getView().getResolution(), params.srs || params.SRS, {
      INFO_FORMAT: 'application/json',
      QUERY_LAYERS: params.LAYERS || params.layers,
      FORMAT: 'application/json',
    })
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
  layer,
  wms,
  getFatureInfoByCoodinate,
})
</script>
