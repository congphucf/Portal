<template lang="pug">
.page-auth
  span Loading...
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { ILoginOAuthData } from '@/models/auth';

const isProcessing = ref(false);
const route = useRoute();

const doAuth = async (): Promise<void> => {
  isProcessing.value = true;
  try {
    await auth();
  } catch (error) {
    console.error(error);
  }
  isProcessing.value = false;
};

const auth = async (): Promise<void> => {
  const { token } = route.query;
  const payload: ILoginOAuthData = {
    token,
  }

  await useAuthStore().login(payload);
  await useAuthStore().getUser();
  // await new Promise((resolve) => setTimeout(resolve, 1000));
};

onMounted(() => {
  doAuth();
});
</script>
