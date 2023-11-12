<template>
  <v-app>
    <default-bar v-if="user.isAuthenticated()" />

    <default-view />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue';
import DefaultView from './View.vue';
import { UserApiProvider } from '@/api/users';

const user = new UserApiProvider();
</script>
