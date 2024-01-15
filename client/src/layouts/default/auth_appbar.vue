<template>
  <v-app-bar :elevation="1" flat :color="'black'">
    <v-app-bar-title class="w-100">
      <v-row>
        <v-col cols="6">
          <v-btn class="mr-2" variant="tonal" color="primary" to="/">
            <v-icon class="mr-1" icon="mdi-keyboard-backspace" />
            Home
          </v-btn>

          <v-btn variant="tonal" color="primary" to="/login">
            <v-icon class="mr-1" icon="mdi-login" />
            Login
          </v-btn>
        </v-col>
        <v-col cols="6" class="d-flex justify-end"> </v-col>
      </v-row>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
</script>

<script lang="ts">
export default defineComponent({});
</script>
