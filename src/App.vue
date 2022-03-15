<template lang="pug">
AppProvider
  BaseLayout
    RouterView
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import BaseLayout from '@/components/layouts/BaseLayout.vue';
</script>

<style lang="scss">
  @import './scss/app.scss';
</style>
