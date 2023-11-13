<template>
  <div class="d-flex fill-height justify-center align-center w-100" v-if="isLoading">
    <v-progress-circular color="primary" indeterminate :size="160" :width="3"> Check user role... </v-progress-circular>
  </div>
  <div class="fill-height d-flex" v-else>
    <div class="d-flex justify-center align-center w-100" v-if="isAdminUser">
      <register-form />
    </div>
    <div v-else class="w-100">
      <v-alert
        class="mt-2"
        title="Oops! It seems like you're not authorized to perform this action."
        type="error"
        variant="tonal"
      >
        This page is exclusively for admins. Let's head back
        <router-link to="/">home, shall we</router-link>
        ?
        <router-link to="/login">Admin Login Page</router-link>
        ?
      </v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserApiProvider } from '@/api/users';
import { onMounted, ref } from 'vue';
import RegisterForm from './register_form.vue';
import { defineComponent } from 'vue';

const isAdminUser = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const user = new UserApiProvider();

onMounted(async () => {
  isLoading.value = true;
  if (user.isAuthenticated()) {
    isAdminUser.value = await user.isAdmin();
  }
  isLoading.value = false;
});
</script>

<script lang="ts">
export default defineComponent({
  components: { RegisterForm },
});
</script>
