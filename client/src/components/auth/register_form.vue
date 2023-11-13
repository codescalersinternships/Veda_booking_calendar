<script setup lang="ts">
import { ref, defineComponent } from 'vue';
import validator from 'email-validator';
import router from '@/router';
import { AuthenticationApiProvider } from '@/api/auth';
import { UserRegisterForm, UserRole } from '@/utils/types';
import { containsSpecialChars, containsNumbers } from '@/utils/helpers';

const email = ref<string>();
const firstName = ref<string>();
const lastName = ref<string>();
const password = ref<string>();
const userRole = ref<UserRole>(UserRole.USER);

const isLoadingForm = ref<boolean>();

const isErrorResponse = ref<boolean>();
const isSuccessResponse = ref<boolean>();
const show = ref<boolean>();

const errorMessage = ref<string>();
const successMessage = ref<string>();

const passwordErrorMessage = ref<string>('');
const isValidPassword = (password: string) => {
  if (password && password.trim().length === 0) {
    passwordErrorMessage.value = 'The password is required.';
    return false;
  } else if (password && password.length < 5) {
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

const fNameErrorMessage = ref<string>('');
const isValidFirstName = (name: string) => {
  if (name && name.trim().length === 0) {
    fNameErrorMessage.value = 'The first name is required.';
    return false;
  } else if (name && name.length < 3) {
    fNameErrorMessage.value = 'The first name must be at least 3 chars.';
    return false;
  } else if (containsSpecialChars(name)) {
    fNameErrorMessage.value = 'The first name cannot contain special chars.';
    return false;
  } else if (containsNumbers(name)) {
    fNameErrorMessage.value = 'The first name cannot contain numbers.';
    return false;
  }
  fNameErrorMessage.value = '';
  return true;
};

const lNameErrorMessage = ref<string>('');
const isValidLastName = (name: string) => {
  if (name && name.trim().length === 0) {
    lNameErrorMessage.value = 'The last name is required.';
    return false;
  } else if (name && name.length < 3) {
    lNameErrorMessage.value = 'The last name must be at least 3 chars.';
    return false;
  } else if (containsSpecialChars(name)) {
    lNameErrorMessage.value = 'The last name cannot contain special chars.';
    return false;
  } else if (containsNumbers(name)) {
    lNameErrorMessage.value = 'The last name cannot contain numbers.';
    return false;
  }
  lNameErrorMessage.value = '';
  return true;
};

const emailErrorMessage = ref<string>('');
const isValidEmail = (email: string): boolean => {
  if (email !== undefined && email.trim().length === 0) {
    emailErrorMessage.value = 'The email is required.';
    return false;
  } else if (!validator.validate(email)) {
    emailErrorMessage.value = 'Please make sure that you entered a valid email address.';
    return false;
  }
  emailErrorMessage.value = '';
  return true;
};

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
  } else if (!firstName.value) {
    isErrorResponse.value = true;
    errorMessage.value = 'First name is undefined';
  } else if (!lastName.value) {
    isErrorResponse.value = true;
    errorMessage.value = 'Last name is undefined';
  } else if (!userRole.value) {
    isErrorResponse.value = true;
    errorMessage.value = 'User role is undefined';
  } else {
    isErrorResponse.value = false;
    isSuccessResponse.value = false;
    errorMessage.value = '';
    successMessage.value = '';

    const auth = new AuthenticationApiProvider();
    const userRegisterForm: UserRegisterForm = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      role: userRole.value,
    };

    const register = await auth.register(userRegisterForm);
    if (register.isError) {
      isErrorResponse.value = register.isError;
      errorMessage.value = register.message;
      isLoadingForm.value = false;
    } else {
      isSuccessResponse.value = true;
      successMessage.value = register.message;
      // router.push('/');
      isLoadingForm.value = false;
    }
  }
};
</script>

<template>
  <v-card class="pt-6 pb-4" width="600" elevation="4" tag="section">
    <v-card-title class="text-center pb-6">
      <v-layout class="align-center justify-center">
        <h3 class="headline">New User Registration</h3>
      </v-layout>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <p class="mb-4">
        Please take a few moments to register. You will need this information to
        <strong class="text-info">access your account</strong> in the future.
      </p>
      <v-form @submit="submit" class="pb-2">
        <v-text-field
          :disabled="isLoadingForm"
          outline
          label="First Name"
          type="text"
          class="mb-2"
          v-model="firstName"
          hide-details="auto"
          :error-messages="firstName != undefined ? fNameErrorMessage : undefined"
          :rules="[isValidFirstName]"
        />

        <v-text-field
          :disabled="isLoadingForm"
          outline
          label="Last Name"
          type="text"
          class="mb-2"
          v-model="lastName"
          hide-details="auto"
          :error-messages="lastName != undefined ? lNameErrorMessage : undefined"
          :rules="[isValidLastName]"
        />

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

        <v-select
          class="mt-4"
          variant="outlined"
          hide-details
          append-icon="mdi-account-question"
          label="Boat"
          :items="[UserRole.ADMIN, UserRole.USER]"
          :disabled="isLoadingForm"
          v-model="userRole"
        />
      </v-form>
      <v-alert v-if="isErrorResponse" variant="tonal" type="error">{{ errorMessage }}</v-alert>
      <v-alert v-if="isSuccessResponse" variant="tonal" type="success">{{ successMessage }}</v-alert>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-3">
      <v-btn
        :disabled="isLoadingForm"
        color="primary"
        flat
        style="font-size: 13px"
        @click="() => router.push('/login')"
      >
        Already Registered User? Click here to login
      </v-btn>
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
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
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
