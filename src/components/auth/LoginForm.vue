<template lang="pug">
div
  h2 Login
  //Form(@submit="submit")
  //FormLayout
    // TODO TextField
  form.login-form(
    novalidate,
    method="post",
    @submit.prevent="submit"
  )
    input(
      type="text",
      placeholder="you_shopify_domain.myshopify.com",
      v-model="shop"
    )
    button(type="submit")
      span.mr-2(
        v-if="isProcessing.value",
      ) loading..
      span Submit
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { Spinner } from '@qikify/polaris-vue';

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
  // TODO
  doLogin();
};

const doLogin = (): void => {
  isProcessing.value = true;
  setTimeout(() => {
    console.log('login success');
    isProcessing.value = false;
  }, 2000);
};
</script>
