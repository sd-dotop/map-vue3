import 'ol/ol.css'
import Map from './Map.vue'
import VectorLayer from './components/VectorLayer.vue'
import Line from './components/Line.vue'
import Point from './components/Point.vue'

export default {
  install(Vue) {
    Vue.component('Map', Map)
    Vue.component('VectorLayer', VectorLayer)
    Vue.component('Line', Line)
    Vue.component('Point', Point)
  },
}
