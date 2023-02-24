<template>
  <div class="ol-map-overlay" ref="overlayRef">
    <slot></slot>
  </div>
</template>
<script setup>
import { ref, toRefs, inject, onMounted, watchEffect } from 'vue'
import Overlay from 'ol/Overlay'

const props = defineProps({
  coordinate: Array,
  positioning: {
    type: String,
    default: 'bottom-center',
  },
})

const { coordinate, positioning } = toRefs(props)
const map = inject('map')
const overlayRef = ref(null)

const overlay = new Overlay({
  positioning: positioning.value,
})

map.addOverlay(overlay)

function setPosition(coordinate) {
  overlay.setPosition(coordinate)
}

watchEffect(() => {
  setPosition(coordinate.value)
})

onMounted(() => {
  overlay.setElement(overlayRef.value)
  overlay.setPosition(coordinate.value)
})

defineExpose({
  overlay,
  setPosition,
})
</script>
