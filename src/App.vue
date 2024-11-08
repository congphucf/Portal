<template lang="pug">
AppProvider(:i18n="locales")
  div.app-layout
    Sidebar(:menuItems="menuItems")
    main.content
      router-view
</template>


<script setup lang="ts">
import locales from '@ownego/polaris-vue/dist/locales/en.json';
import Sidebar from '@/components/Sidebar.vue';
import { inject } from 'vue';
  
const menuItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Auto Recommend', path: '/auto-recommend' },
  { name: 'Manual Recommend', path: '/manual-recommend' },
  { name: 'Analytics', path: '/analytic' },
];


const account = inject('account');
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;       
  height: 100vh;      
}

.content {
  flex: 1;              
  overflow-y: auto;     
}
</style>