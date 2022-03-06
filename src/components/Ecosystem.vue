<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { ref } from 'vue';

const count = ref(1);
const options = ref(['list', 'of', 'options']);
const value = [];
</script>
<template>
  <div class="ecosystem">
    <h2> Ecosystem </h2>
    <pre style="color: #fff">
      {{ count }}
      {{ options }}
      {{ value }}
    </pre>
    <multiselect v-model="value" :options="options" :multiple="true"></multiselect>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
