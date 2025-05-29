// import Map from 'ol/Map';
// import View from 'ol/View';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import Overlay from 'ol/Overlay'
// import { Draw } from 'ol/interaction';
// import { Vector as VectorLayer } from 'ol/layer';
// import { Vector as VectorSource } from 'ol/source';
// import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
// import { Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { LineString, Polygon } from 'ol/geom'
// import { Vector as VectorSource } from 'ol/source'
// import { Vector as VectorLayer } from 'ol/layer'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { getArea, getLength } from 'ol/sphere'
import { unByKey } from 'ol/Observable'
// import {transform} from 'ol/proj';

let draw = null
let source = null
export function drawPolygon(map, color, color_, initialCoordinates = null, callback) {
  if(source) {
    source.clear();
    map.removeInteraction(draw);
  }
  
  source = new VectorSource();
  const vector = new VectorLayer({
    source: source,
    style: new Style({
      fill: new Fill({
        color: color_ || 'rgba(255, 51, 51, 0.33)'
      }),
      stroke: new Stroke({
        color: color || 'rgba(255, 51, 51, 1)',
        width: 2
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: 'rgba(255, 51, 51, 0.33)'
        })
      })
    })
  });
  map.addLayer(vector);

  // 如果有初始坐标，直接创建多边形
  if (initialCoordinates) {
    const polygon = new Polygon(initialCoordinates);
    const feature = new Feature({
      geometry: polygon
    });
    source.addFeature(feature);
  }
  if (!callback) {
    return;
  }

  draw = new Draw({
    source: source,
    type: 'Polygon'
  });
  map.addInteraction(draw);
  
  draw.on("drawend", (evt) => {
    const geo = evt.feature.getGeometry();
    const t = geo.getType();
    if (t === "Polygon") {
      const points = geo.getCoordinates();
      console.warn(points, "绘制结束，点坐标");
      map.removeInteraction(draw);
      callback(draw, source, points);
    }
  });
}