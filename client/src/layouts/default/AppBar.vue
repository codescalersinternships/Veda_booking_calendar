<template>
  <v-app-bar :elevation="2" flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-4" />
      Veda Booking System
    </v-app-bar-title>

    <template v-slot:append>
      <!-- <v-tooltip text="Book new boat">
        <template v-slot:activator="{ props }">
          <v-btn @click="() => (displayeReserveBoat = true)" v-bind="props" icon="mdi-plus" />
        </template>
      </v-tooltip> -->

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
            <v-list-item-title>{{ route }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>

  <!-- reserve new boat
  <reserve-boat-component
    @close-dialog="displayeReserveBoat = false"
    :modelValue="displayeReserveBoat"
    :boat="reserveBoatInitializer"
    @event-reserved="(event: EventDetails) => {
      eventReserved(event)
      displayeReserveBoat = false
    }"
    :enable-calendar="true"
  /> -->
</template>

<script lang="ts" setup>
// import reserveBoatComponent from '@/components/boats/reserve_boat.vue';
import { defineComponent } from 'vue';
// import { eventReserved } from '@/utils/book_boat';
// import { EventDetails, reserveBoatInitializer } from '@/utils/types';

const routes = ['Settings', 'Logout'];
// const displayeReserveBoat = ref<boolean>(false);
</script>

<script lang="ts">
export default defineComponent({
  // components: { reserveBoatComponent },
});
</script>
