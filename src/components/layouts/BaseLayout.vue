<template lang="pug">
.base-layout(
  :class="routerClass"
)
  nav.navbar.navbar-light
    .container-fluid
      a.navbar-brand(
        href="#"
        @click="$router.push('/')"
      ) Subscriptions
  .wrapper
    aside.sidebar
      .sidebar-body
        ul.nav.sidebar-nav
          li.nav-item(v-for="item in sidebarItems" :key="item.name")
            router-link.nav-link(:to="{ name: item.name }")
              Icon(:source="item.icon")
              span {{ item.label }}
        // Frame
          span Inside a frame
    main.main
      .main-content
        slot
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HomeMajor from '@shopify/polaris-icons/dist/svg/HomeMajor.svg';
import ProductsMajor from '@shopify/polaris-icons/dist/svg/ProductsMajor.svg';
import ProfileMajor from '@shopify/polaris-icons/dist/svg/ProfileMajor.svg';
import SettingsMajor from '@shopify/polaris-icons/dist/svg/SettingsMajor.svg';
import CustomersMajor from '@shopify/polaris-icons/dist/svg/CustomersMajor.svg';

const route = useRoute();
const routerClass = computed(() => route.matched.map(m => `page--${m.name}`));

const sidebarItems = [
  {
    name: 'home',
    label: 'Home',
    icon: HomeMajor,
  },
  {
    name: 'products',
    label: 'Products',
    icon: ProductsMajor,
  },
  {
    name: 'profile',
    label: 'Subscribers',
    icon: CustomersMajor,
  },
  {
    name: 'profile',
    label: 'Settings',
    icon: SettingsMajor,
  },
];
</script>
