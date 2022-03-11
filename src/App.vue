<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<style lang="scss">
  @import './scss/app.scss';
</style>
