import { getWidth, getTopLeft } from 'ol/extent.js'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import TileLayer from 'ol/layer/Tile'
import WMTS from 'ol/source/WMTS'
import LayerGroup from 'ol/layer/Group'
import Collection from 'ol/Collection'
import projection from './projection'
const tileSizePixels = 256
const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels
const resolutions = []
const matrixIds = []
const maxZoom = 19

for (let res = 0; res < maxZoom; res++) {
  matrixIds[res] = res
  resolutions[res] = tileSizeMtrs / Math.pow(2, res)
}

const tileGrid = new WMTSTileGrid({
  origin: getTopLeft(projection.getExtent()),
  resolutions,
  matrixIds,
})

export const vecLayer = new LayerGroup({
  layers: new Collection([
    new TileLayer({
      source: new WMTS({
        url: 'http://t0.tianditu.gov.cn/vec_c/wmts',
        layer: 'vec',
        version: '1.0.0',
        matrixSet: 'c',
        format: 'tile',
        style: 'default',
        tileGrid,
        tileLoadFunction(tile, src) {
          tile.getImage().src = src + '&tk=58816ea4979438d2271c266ab21c17bd'
        },
      }),
    }),
    new TileLayer({
      source: new WMTS({
        url: 'http://t0.tianditu.gov.cn/cva_c/wmts',
        layer: 'cva',
        version: '1.0.0',
        matrixSet: 'c',
        format: 'tile',
        style: 'default',
        tileGrid,
        tileLoadFunction(tile, src) {
          tile.getImage().src = src + '&tk=58816ea4979438d2271c266ab21c17bd'
        },
      }),
    }),
  ]),
})
export const imgLayer = new LayerGroup({
  layers: new Collection([
    new TileLayer({
      source: new WMTS({
        url: 'http://t0.tianditu.gov.cn/img_c/wmts',
        layer: 'img',
        version: '1.0.0',
        matrixSet: 'c',
        format: 'tile',
        style: 'default',
        tileGrid,
        tileLoadFunction(tile, src) {
          tile.getImage().src = src + '&tk=58816ea4979438d2271c266ab21c17bd'
        },
      }),
    }),
    new TileLayer({
      source: new WMTS({
        url: 'http://t0.tianditu.gov.cn/cia_c/wmts',
        layer: 'cia',
        version: '1.0.0',
        matrixSet: 'c',
        format: 'tile',
        style: 'default',
        tileGrid,
        tileLoadFunction(tile, src) {
          tile.getImage().src = src + '&tk=58816ea4979438d2271c266ab21c17bd'
        },
      }),
    }),
  ]),
})
