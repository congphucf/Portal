<template lang="pug">
AppProvider
  template(v-if="isReady")
    BaseLayout
      RouterView
  .vh-100.d-flex.align-items-center.justify-content-center(v-else)
    div(v-if="hasError")
      p There is an error while initializing application
      p.mt-5 What should I do?
      div
        Button(
          primary,
          @click="reload"
        ) Reload browser
        | &nbsp;
        a.btn.btn-secondary(href="https://support.subscription.com") Contact support
    div(v-else)
      Spinner(message="Initializing...")
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AuthConfig from '@/configs/auth';
import BaseLayout from '@/components/layouts/BaseLayout.vue';

const isReady = ref(false);
const hasError = ref(false);
const isAuthenticatedRouter = ref(false);
const route = useRoute();
const auth = useAuthStore();

const reload = () => {
  // Clear token and reload the page
  localStorage.removeItem(AuthConfig.TOKEN);
  window.location.reload();
};

const appInit = async (): Promise<void> => {
  try {
    await auth.refresh();
    await auth.getUser();
    doRefreshToken();
  } catch (error) {
    console.log('Cannot start subscription portal', err); //eslint-disable-line
    throw error;
  }
};

const checkReadyState = (): void => {
  isReady.value = auth.isReady(route);
}

const updateRouterState = (): void => {
  isAuthenticatedRouter.value = !(route.meta && route.meta.auth === false);
}

const doRefreshToken = (): void => {
  const timeout = auth.timeout;
  setTimeout(() => {
    // First time
    auth.refreshToken();

    // Refresh token in interval
    setInterval(async () => {
      await auth.refreshToken();
    }, AuthConfig.INTERVAL_REFRESH * 1000 * 60);
  }, timeout);
}

watch(() => route.fullPath, () => {
  updateRouterState();
  checkReadyState();
});

// On create
onMounted(() => {
  // console.log('query', useRoute().query);
  updateRouterState();
  if (isAuthenticatedRouter.value) {
    appInit()
      .then(() => {
        checkReadyState();
      })
      .catch(() => {
        hasError.value = true;
      });
  } else {
    checkReadyState();
  }
});
</script>

<style lang="scss">
  @import './scss/app.scss';
</style>
