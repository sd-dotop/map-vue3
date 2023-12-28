import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay'
import { Draw, Modify, Snap } from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'
import { Polygon } from 'ol/geom';

let draw = null
let source = null
export function drawPolygon(map,color,color_,callback) {
  if(source){
   source.clear()
   map.removeInteraction(draw)
  }
  source = new VectorSource()
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
 
  draw = new Draw({
    source: source,
    type: 'Polygon'
  });
  map.addInteraction(draw)
  draw.on("drawend", (evt)=> {
    const geo = evt.feature.getGeometry();
    const t = geo.getType();
    if (t === "Polygon") {
      // 获取坐标点
      const points = geo.getCoordinates();
      console.warn(points, "绘制结束，点坐标")
      map.removeInteraction(draw); // 移除绘制
      callback(points)
    }
  });
}