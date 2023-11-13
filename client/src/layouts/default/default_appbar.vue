<template>
  <v-app-bar :elevation="2" flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      Veda Booking System
    </v-app-bar-title>

    <v-btn @click="displayNewBoat = true" variant="tonal" color="" class="me-2">
      New Boat
      <v-icon class="ml-1 mr-1">mdi-plus-circle</v-icon>
    </v-btn>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="tonal" color="" class="me-2">
            More
            <v-icon class="">mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list class="mt-4" width="220px">
          <v-list-item v-for="(route, index) in routes" :key="index" :value="index">
            <v-list-item-title @click="route.onClick">{{ route.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>

  <!-- New Boat -->
  <new-boat @close-dialog="displayNewBoat = false" :displayNewBoat="displayNewBoat" />
</template>

<script lang="ts" setup>
import router from '@/router';
import { defineComponent, ref } from 'vue';
import NewBoat from '@/components/boats/new_boat.vue';
import { AuthenticationApiProvider } from '@/api/auth';

const displayNewBoat = ref<boolean>(false);
const auth = new AuthenticationApiProvider();

type Route = {
  title: string;
  onClick: () => void;
};

const routes: Route[] = [
  { title: 'Register New User', onClick: () => router.push('/register-user') },
  {
    title: 'Logout',
    onClick: () => {
      auth.logout();
      router.push('/login');
    },
  },
];
</script>

<script lang="ts">
export default defineComponent({
  components: { NewBoat },
});
</script>
