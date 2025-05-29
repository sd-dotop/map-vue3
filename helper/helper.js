import { easeOut } from 'ol/easing'; // 添加这行导入
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { Style, Circle, Fill, Stroke } from 'ol/style'

/**
 * 定位到指定位置
 * @param {*} map 
 * @param {*} coordinate 
 * @param {*} customZoom default 18
 * @returns 
 */
export function flyTo(map, coordinate, customZoom = 18, duration = 2500) {
  if (!map) return;

  const view = map.getView();

  view.animate({
    zoom: customZoom,
    center: coordinate,
    duration: duration,
    easing: easeOut
  });
};

export function createMarker(map, coordinate) {
  // 1. 清除旧的标记图层（如果存在）
  const oldLayer = map.getLayers().getArray().find(layer => {
    return layer.get('name') === 'marker-layer'; // 根据图层名称查找
  });
  if (oldLayer) {
    map.removeLayer(oldLayer); // 移除旧图层
  }
  // 2. 创建新标记
  const marker = new Feature({
    geometry: new Point(coordinate),
  });

  // 3. 设置图标样式（替换为你的图标路径）
  marker.setStyle(
    new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: '#ff3333' }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 2,
        }),
      }),
    })
  );

  // 4. 创建矢量图层并添加到地图
  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [marker],
    }),
    name: 'marker-layer', // 给图层命名以便后续操作
  });

  map.addLayer(vectorLayer);
}

