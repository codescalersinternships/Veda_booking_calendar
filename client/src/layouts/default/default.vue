<template>
  <v-app>
    <default-bar v-if="user.isAuthenticated() && !isAuthRoute" />
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
const route = useRoute();

onMounted(() => {
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
