<template>
  <router-view />
</template>

<script>
import store from './store'
export default {
  beforeCreate() {
    if (store.state.authId) {
      this.$store.dispatch('FETCH_USER', { id: store.state.authId })
    }
  },
}
</script>

<style lang="postcss" src="./assets/tailwind.postcss"></style>
<style lang="css" src="./assets/main.css"></style>
