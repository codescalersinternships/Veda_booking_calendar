<template>
  <v-app>
    <default-bar v-if="AuthenticationApiProvider.isAuthenticated() && !isAuthRoute" />
    <div class="d-flex">
      <v-alert v-if="!isAuthRoute && isProd" type="warning" variant="tonal">
        You are not authenticated!, <router-link to="/login">Login</router-link>?
      </v-alert>
      <auth-bar v-else />
    </div>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, defineComponent } from 'vue';
import DefaultBar from './default_appbar.vue';
import AuthBar from './auth_appbar.vue';
import DefaultView from './view.vue';
import { AuthenticationApiProvider } from '@/api/auth';
import { useRoute } from 'vue-router';
import { checkRoute } from '@/utils/helpers';

const isAuthRoute = ref<boolean>(false);
const isProd = ref<boolean>(window.env.isProd);
const route = useRoute();

onMounted(async () => {
  isAuthRoute.value = checkRoute(route);
});

watch(
  route,
  () => {
    isAuthRoute.value = checkRoute(route);
  },
  { deep: true },
);
</script>

<script lang="ts">
export default defineComponent({});
</script>
