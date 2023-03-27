import Draw from 'ol/interaction/Draw'
import Overlay from 'ol/Overlay'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { LineString, Polygon } from 'ol/geom'
// import { Vector as VectorSource } from 'ol/source'
// import { Vector as VectorLayer } from 'ol/layer'
import { getArea, getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
// import {transform} from 'ol/proj';

var helpTooltipElement = null
var feature = null
var helpTooltip = null
var draw = null
var measureTooltipElement = null
var measureTooltip = null
var listener = null
var mapMouseMove = null
var drawLayers = []
var drawElements = []
// 测距
export function measure(map, type) {
  let source = new VectorSource()
  const layer = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 4,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  })

  mapMouseMove = map.on('pointermove', (ev) => {
    let helpMsg = '点击开始测量'
    if (feature) {
      helpMsg = '双击结束测量'
    }
    helpTooltipElement.innerHTML = helpMsg
    helpTooltip.setPosition(ev.coordinate)
    helpTooltipElement.classList.remove('hidden')
  })

  map.getViewport().addEventListener('mouseout', function () {
    helpTooltipElement.classList.add('hidden')
  })

  draw = new Draw({
    source,
    type: type || 'LineString',
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 4,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
      }),
    }),
  })

  // 开始坚挺绘制
  draw.on('drawstart', (evt) => {
    feature = evt.feature
    let tooltipCoord = evt.coordinate
    listener = feature.getGeometry().on('change', function (evt) {
      const geom = evt.target
      let output
      if (geom instanceof Polygon) {
        output = formatArea(geom)
        tooltipCoord = geom.getInteriorPoint().getCoordinates()
      } else if (geom instanceof LineString) {
        output = formatLength(geom)
        tooltipCoord = geom.getLastCoordinate()
      }
      measureTooltipElement.innerHTML = output
      measureTooltip.setPosition(tooltipCoord)
    })
  })

  // 双击绘制完成
  draw.on('drawend', () => {
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
    measureTooltip.setOffset([0, -7])
    feature = null
    measureTooltipElement = null
    createMeasureTooltip(map)
    unByKey(listener)
  })

  // 格式化长度
  const formatLength = function (line) {
    const length = getLength(line, { projection: 'EPSG:4326' })
    let output
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm'
    }
    return output
  }
  //格式化测量面积
  const formatArea = function (polygon) {
    const area = getArea(polygon, { projection: 'EPSG:4326' })
    let output
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>'
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>'
    }
    return output
  }
  createHelpTooltip(map)
  createMeasureTooltip(map)
  map.addLayer(layer)
  drawLayers.push(layer)
  map.addInteraction(draw)
}

// 取消绘制
export function cancelMeasure(map) {
  for (let i = 0; i < drawLayers.length; i++) {
    map.removeLayer(drawLayers[i])
  }
  for (let i = 0; i < drawElements.length; i++) {
    map.removeOverlay(drawElements[i])
  }
  drawLayers = []
  drawElements = []
  feature = null
  if (helpTooltipElement && helpTooltipElement.parentNode) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement)
  }
  map.removeInteraction(draw)
  unByKey(mapMouseMove)
}

function createMeasureTooltip(map) {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement)
  }
  measureTooltipElement = document.createElement('div')
  measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
  measureTooltip = new Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center',
    stopEvent: false,
    insertFirst: false,
  })
  drawElements.push(measureTooltip)
  map.addOverlay(measureTooltip)
}

function createHelpTooltip(map) {
  if (helpTooltipElement && helpTooltipElement.parentNode) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement)
  }
  helpTooltipElement = document.createElement('div')
  helpTooltipElement.className = 'ol-tooltip hidden'
  helpTooltip = new Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left',
  })
  map.addOverlay(helpTooltip)
}
