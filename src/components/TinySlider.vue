<template>
  <div class="slider-wrapper">
    <slot></slot>
  </div>
</template>

<script>
import { tns } from 'tiny-slider/src/tiny-slider'
import 'tiny-slider/dist/tiny-slider.css'
export default {
  name: 'TinySlider',
  data() {
    return {
      $slider: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // $el es el tag raíz o padre del elemento, slider-wrapper
      const settings = {
        container: this.$el,
        mode: 'gallery',
      }
      this.slider = tns(settings)
    },
  },
  beforeUnmount() {
    if (this.slider) {
      this.slider.destroy()
    }
  },
}
</script>
