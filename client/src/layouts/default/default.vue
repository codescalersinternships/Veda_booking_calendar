<template>
  <v-app>
    <default-bar v-if="isAuthenticated && !isAuthRoute" />
    <div class="d-flex" v-else>
      <v-alert v-if="!isAuthRoute" type="warning" variant="tonal">
        You are not authenticated!, <router-link to="/login">Login</router-link>?
      </v-alert>
      <auth-bar v-else />
    </div>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import DefaultBar from './default_appbar.vue';
import AuthBar from './auth_appbar.vue';
import DefaultView from './view.vue';
import { UserApiProvider } from '@/api/users';
import { useRoute } from 'vue-router';
import { checkRoute } from '@/utils/helpers';

const user = new UserApiProvider();
const isAuthRoute = ref<boolean>(false);
const isAuthenticated = ref<boolean>(false);

const route = useRoute();

onMounted(async () => {
  isAuthRoute.value = checkRoute(route);
  isAuthenticated.value = await user.isAuthenticated();
  if (!isAuthenticated.value) {
    localStorage.removeItem('vedaAccessToken');
  }
});

watch(
  route,
  () => {
    isAuthRoute.value = checkRoute(route);
  },
  { deep: true },
);
</script>
