<template></template>
<script setup>
import { inject, onMounted, onUnmounted, watch } from 'vue'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import axios from 'axios'

const props = defineProps({
  url: String,
  params: Object,
  properties: {
    type: Object,
    default: () => ({}),
  },
})

const { url, params, properties } = props
if (params.VIEWPARAMS) {
  const validParams = params.VIEWPARAMS
    .split(';')
    .filter(pair => {
      const [, value] = pair.split(':');
      return value !== 'null';
    });
    const vp = validParams.length > 0 ? validParams.join(';') : undefined;
    params.VIEWPARAMS = vp;
}
const map = inject('map')

const wms = new TileWMS({
  url,
  params,
})
const layer = new TileLayer({
  source: wms,
  ...properties,
})

onMounted(() => {
  map.addLayer(layer)
})

onUnmounted(() => {
  map.removeLayer(layer)
})

watch(() => props.params, (newParams) => {
  if (newParams.VIEWPARAMS) {
    const validParams = newParams.VIEWPARAMS
      .split(';')
      .filter(pair => {
        const [, value] = pair.split(':');
        return value !== 'null';
      });
      const vp = validParams.length > 0 ? validParams.join(';') : undefined;
      newParams.VIEWPARAMS = vp || null;
  }
  wms.updateParams(newParams)
})

function getFatureInfoByCoodinate(coordinate) {
  return new Promise((resolve, reject) => {
    const url = wms.getFeatureInfoUrl(coordinate, map.getView().getResolution(), params.srs || params.SRS, {
      INFO_FORMAT: params.info_format || params.INFO_FORMAT || 'application/json',
      QUERY_LAYERS: params.LAYERS || params.layers,
      FORMAT: params.format || params.FORMAT || 'application/json',
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
