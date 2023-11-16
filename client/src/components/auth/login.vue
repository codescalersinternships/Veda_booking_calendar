<script setup lang="ts">
import { onMounted, defineComponent, ref } from 'vue';
import validator from 'email-validator';
import router from '@/router';
import { AuthenticationApiProvider } from '@/api/auth';
import { UserLoginForm } from '@/utils/types';
import { containsNumbers, containsSpecialChars } from '@/utils/helpers';

const email = ref<string>();
const password = ref<string>();

const isLoadingForm = ref<boolean>();

const isErrorResponse = ref<boolean>();
const isSuccessResponse = ref<boolean>();
const show = ref<boolean>();

const errorMessage = ref<string>();
const successMessage = ref<string>();

const emailErrorMessage = ref<string>('');
const isValidEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    emailErrorMessage.value = 'The email is required.';
    return false;
  } else if (!validator.validate(email)) {
    emailErrorMessage.value = 'Please make sure that you entered a valid email address.';
    return false;
  }
  emailErrorMessage.value = '';
  return true;
};

const passwordErrorMessage = ref<string>('');
const isValidPassword = (password: string) => {
  if (!password || password.trim().length === 0) {
    passwordErrorMessage.value = 'The password is required.';
    return false;
  } else if (password.length < 5) {
    passwordErrorMessage.value = 'The password must be at least 5 chars.';
    return false;
  } else if (!containsSpecialChars(password)) {
    passwordErrorMessage.value = 'The password should contain at least one special char.';
    return false;
  } else if (!containsNumbers(password)) {
    passwordErrorMessage.value = 'The password should contain at least one digit.';
    return false;
  }
  passwordErrorMessage.value = '';
  return true;
};

onMounted(async () => {
  if (AuthenticationApiProvider.isAuthenticated()) {
    router.push('/');
  }
});

const submit = async () => {
  isLoadingForm.value = true;
  isSuccessResponse.value = false;
  isErrorResponse.value = false;

  if (!email.value) {
    isErrorResponse.value = true;
    errorMessage.value = 'Email is undefined';
  } else if (!password.value) {
    isErrorResponse.value = true;
    errorMessage.value = 'Password is undefined';
  } else {
    const auth = new AuthenticationApiProvider();
    const userForm: UserLoginForm = { email: email.value, password: password.value };
    const loggedIn = await auth.login(userForm);
    if (loggedIn.isError) {
      isErrorResponse.value = loggedIn.isError;
      errorMessage.value = loggedIn.message;
      isLoadingForm.value = false;
    } else {
      isSuccessResponse.value = true;
      successMessage.value = loggedIn.message;
      router.push('/');
      isLoadingForm.value = false;
    }
  }
};
</script>

<template>
  <v-container class="fill-height bg-cli">
    <div class="d-flex justify-center align-center w-100">
      <v-card class="pt-6 pb-4" width="600" elevation="4" tag="section">
        <v-card-title class="text-center pb-6">
          <v-layout class="align-center justify-center">
            <h3 class="headline">Welcome. You are not signed in.</h3>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p class="mb-4">
            To access your account, please identify yourself by providing the information requested in the fields below,
            then click <strong class="text-info">Login</strong>. If you are not registered yet, click
            <strong class="text-info">New user</strong> and follow the instructions to create an account.
          </p>
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
            />

            <v-text-field
              :disabled="isLoadingForm"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append-inner="show = !show"
              outline
              label="Password"
              class="mb-2"
              v-model="password"
              hide-details="auto"
              :error-messages="password != undefined ? passwordErrorMessage : undefined"
              :rules="[isValidPassword]"
            />
          </v-form>
          <v-alert v-if="isErrorResponse" variant="tonal" type="error">{{ errorMessage }}</v-alert>
          <v-alert v-if="isSuccessResponse" variant="tonal" type="success">{{ successMessage }}</v-alert>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-3">
          <v-btn @click="router.push('/register-user')" :disabled="isLoadingForm" color="primary" flat>
            New User?
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            @click="submit"
            :loading="isLoadingForm"
            :disabled="emailErrorMessage.length !== 0 || passwordErrorMessage.length !== 0"
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

<script lang="ts">
export default defineComponent({});
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
