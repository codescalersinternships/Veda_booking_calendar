<template>
  <v-container class="fill-height">
    <div class="d-flex justify-center align-center w-100">
      <v-card class="pt-6 pb-4" width="450" elevation="4" tag="section">
        <v-card-title class="text-center pb-6">
          <v-layout class="align-center justify-center">
            <h3 class="headline">Veda Booking System</h3>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <!-- <p class="mb-4">Please sign in with your email and password</p> -->
          <v-form @submit="submit" class="pb-2">
            <v-text-field
              :disabled="isLoadingForm"
              outline
              label="Email"
              type="email"
              class="mb-2"
              v-model="email"
              hide-details="auto"
              :error-messages="email != undefined ? emailErrorMessage : undefined"
              :rules="[isValidEmail]"
            ></v-text-field>
            <v-text-field
              :disabled="isLoadingForm"
              outline
              hide-details
              label="Password"
              type="password"
              v-model="password"
            ></v-text-field>
          </v-form>
          <v-alert v-if="isErrorResponse" variant="tonal" type="error">This is an error message.</v-alert>
          <v-alert v-if="isSuccessResponse" variant="tonal" type="success">This is an error message.</v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-3">
          <v-btn :disabled="isLoadingForm" color="primary" flat> Forgot password? </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="submit"
            :loading="isLoadingForm"
            :disabled="emailErrorMessage.length !== 0"
            color="primary"
            variant="tonal"
          >
            <v-icon v-if="emailErrorMessage.length === 0" left>mdi-lock-open</v-icon>
            <v-icon v-else left>mdi-lock</v-icon>
            Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import validator from 'email-validator';
import { UserApiProvider } from '@/api/users';
import { onMounted } from 'vue';
import router from '@/router';

const user = new UserApiProvider();

const email = ref<string>();
const password = ref<string>();

const emailErrorMessage = ref<string>('');
const isLoadingForm = ref<boolean>();

const isErrorResponse = ref<boolean>();
const isSuccessResponse = ref<boolean>();

const isValidEmail = (email: string): boolean => {
  if (!validator.validate(email)) {
    emailErrorMessage.value = 'Please make sure that you entered a valid email address.';
    return false;
  }
  emailErrorMessage.value = '';
  return true;
};

onMounted(() => {
  if (user.isAuthenticated()) {
    router.push('/');
  }
});

const submit = () => {
  isLoadingForm.value = true;
  if (email.value) {
    localStorage.setItem('veda_access_token', email.value);
    router.push('/');
  } else {
    alert('Email is undefined');
  }
};
</script>

<style>
.v-btn,
.v-card {
  border-radius: 4px;
}
.v-card__title {
  text-transform: uppercase;
}
</style>
