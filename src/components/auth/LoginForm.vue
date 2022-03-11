<template lang="pug">
div
  Form(@submit.stop.prevent="submit")
    FormLayout
      TextField(
        v-model="loginData.shop"
        placeholder="you_shopify_domain.myshopify.com",
      )
        template(#label) Myshopify domain
      Button(
        submit,
        primary,
        :loading="isProcessing"
      ) Login
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
