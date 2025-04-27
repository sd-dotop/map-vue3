import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { addProjection } from 'ol/proj';
import Projection from 'ol/proj/Projection';
import { get as getProjection } from 'ol/proj'

export function initEPSG4490() {
  const projection = getProjection('EPSG:4490')
  console.log('projection', projection)
  if (projection) {
    console.log('Projection EPSG:4490 is registered.')
    const projectionExtent = projection.getExtent() || [-180, -90, 180, 90]
    console.log('projectionExtent', projectionExtent)
    return
  }
  
  // 定义并注册 EPSG:4490 投影
  proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs');
  register(proj4);
  // 添加投影定义
  const epsg4490 = new Projection({
    code: 'EPSG:4490',
    extent: [-180, -90, 180, 90],
    worldExtent: [-180, -90, 180, 90],
    axisOrientation: 'enu'
  });
  addProjection(epsg4490);
}