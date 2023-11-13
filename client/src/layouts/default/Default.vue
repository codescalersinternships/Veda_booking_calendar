<template>
  <v-app>
    <default-bar v-if="user.isAuthenticated()" />
    <div class="d-flex" v-else>
      <v-alert type="warning" variant="tonal">
        You are not authenticated!, <router-link to="/login">Login</router-link>?
      </v-alert>
    </div>

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue';
import DefaultView from './View.vue';
import { UserApiProvider } from '@/api/users';

const user = new UserApiProvider();
</script>
