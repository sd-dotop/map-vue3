import 'ol/ol.css'
import Map from './Map.vue'
import VectorLayer from './components/VectorLayer.vue'
import Line from './components/Line.vue'
import Point from './components/Point.vue'
import Icon from './components/Icon.vue'
import Polygon from './components/Polygon.vue'
import WMS from './components/WMS.vue'

export default {
  install(Vue) {
    Vue.component('Map', Map)
    Vue.component('VectorLayer', VectorLayer)
    Vue.component('Line', Line)
    Vue.component('Point', Point)
    Vue.component('Icon', Icon)
    Vue.component('Polygon', Polygon)
    Vue.component('WMS', WMS)
  },
}
