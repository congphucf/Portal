<template lang="pug">
div
  Form(@submit="submit")
    FormLayout
      TextField(
        v-model="shop"
        placeholder="you_shopify_domain.myshopify.com",
      )
        template(#label) Hello
      Button(submit)
        Spinner(v-if="isProcessing.value")
        span Login
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

// Ref
const isProcessing = ref(false);

// React
const loginData = {
  shop: '',
};

/**
* Methods
*/
const submit = (): void => {
  alert(1);
  doLogin();
  return false;
};

const doLogin = (): void => {
  isProcessing.value = true;
  setTimeout(() => {
    console.log('login success');
    isProcessing.value = false;
  }, 2000);
};
</script>
