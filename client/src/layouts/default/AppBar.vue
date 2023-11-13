<template>
  <v-app-bar :elevation="2" flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      Veda Booking System
    </v-app-bar-title>

    <template v-slot:append>
      <v-tooltip text="Search boats">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-magnify"></v-btn>
        </template>
      </v-tooltip>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-dots-vertical" />
        </template>
        <v-list class="mt-2" width="150px">
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
  { title: 'Settings', onClick: () => router.push('/settings') },
  {
    title: 'Logout',
    onClick: () => {
      localStorage.removeItem('vedaAccessToken');
      window.location.reload();
    },
  },
];
</script>

<script lang="ts">
export default defineComponent({});
</script>
