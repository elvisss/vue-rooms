<template>
  <router-view />
</template>

<script>
export default {
  beforeCreate() {
    this.$store.dispatch('FETCH_USER', { id: '38St7Q8Zi2N1SPa5ahzssq9kbyp1' })
  },
}
</script>

<style lang="postcss" src="./assets/tailwind.postcss"></style>
<style lang="css" src="./assets/main.css"></style>
