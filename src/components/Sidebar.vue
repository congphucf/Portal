<template lang="pug">
aside.sidebar
    nav.sidebar__nav
        div.app_name 
            Text(as="h1", variant="headingLg") Recommendation
        ul.sidebar__list
            li.sidebar__item(v-for="item in menuItems" :key="item.name")
                RouterLink(:to="item.path" class="sidebar__link") {{ item.name }}
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { RouterLink } from 'vue-router';

interface MenuItem {
    name: string;
    path: string;
}

const props = defineProps<{ menuItems: MenuItem[] }>();
</script>

<style scoped lang="scss">
.sidebar {

  width: 250px;              
  background-color: #2c3e50; 
  color: #ecf0f1;           
  overflow-y: auto;         

  &__nav {
    display: flex;
    flex-direction: column;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 10px;
  }

  &__link {
    color: #ecf0f1;
    text-decoration: none;
    padding: 10px;
    display: block;
    border-radius: 5px;
    transition: background 0.3s;

    &:hover {
      background-color: #34495e;
    }
  }
}

.app_name {
    height: 100px;
    display: flex;           
    justify-content: center;  
    align-items: center;
}
</style>
    