<template>
  <v-app-bar :elevation="2" flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      Veda Booking System
    </v-app-bar-title>

    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-dots-vertical" />
        </template>
        <v-list class="mt-2" width="220px">
          <v-list-item v-for="(route, index) in routes" :key="index" :value="index">
            <v-list-item-title @click="route.onClick">{{ route.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import router from '@/router';
import { defineComponent } from 'vue';

type Route = {
  title: string;
  onClick: () => void;
};

const routes: Route[] = [
  { title: 'Register New User', onClick: () => router.push('/register-user') },
  {
    title: 'Logout',
    onClick: () => {
      localStorage.removeItem('vedaAccessToken');
      router.push('/login');
    },
  },
];
</script>

<script lang="ts">
export default defineComponent({});
</script>
