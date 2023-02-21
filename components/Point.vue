<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'

const props = defineProps({
  coordinates: Array,
})

const vectorSource = inject('vectorSource')
const point = new Feature({
  geometry: new Point(props.coordinates),
})

point.setStyle(
  new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({ color: 'red' }),
      stroke: new Stroke({
        color: 'white',
        width: 2,
      }),
    }),
  })
)
onMounted(() => {
  vectorSource.addFeatures([point])
})

onUnmounted(() => {
  vectorSource.removeFeature(point)
})

defineExpose({
  point,
})
</script>
