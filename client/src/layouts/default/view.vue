<template>
  <v-main :class="isAuthRoute ? 'v-main-background-image' : ''">
    <router-view />
  </v-main>
</template>

<script lang="ts" setup>
import { checkRoute } from '@/utils/helpers';
import { onMounted, ref, defineComponent, watch } from 'vue';
import { useRoute } from 'vue-router';

const isAuthRoute = ref<boolean>(false);
const route = useRoute();

onMounted(() => {
  isAuthRoute.value = checkRoute(route);
});

watch(
  route,
  () => {
    isAuthRoute.value = checkRoute(route);
  },
  { deep: true },
);
</script>

<script lang="ts">
export default defineComponent({});
</script>

<style scoped>
.v-main-background-image {
  background-image: url('../../assets/wallpaper-calendar.jpg') !important;
  background-repeat: no-repeat !important;
  background-size: cover !important;
}
</style>
