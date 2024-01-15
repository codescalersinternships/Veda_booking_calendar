<script setup lang="ts">
import { AuthenticationApiProvider } from '@/api/auth';
import BoatsApiProvider from '@/api/boats';
import { BoatApiData, RequestAPIData } from '@/utils/types';
import { PropType, onMounted, ref } from 'vue';

const props = defineProps({
  request: {
    type: Object as PropType<RequestAPIData>,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(['update:select-boat']);

onMounted(async () => {
  if (window.env.isProd) {
    await loadBoats();
  } else {
    await loadDummeyBoats();
  }
});

const isLoadingBoats = ref<boolean>();
const boats = ref<BoatApiData[]>([]);

const isErrorLoadingBoats = ref<boolean>();
const errorMessage = ref<string>();

const loadDummeyBoats = async () => {
  isLoadingBoats.value = true;
  errorMessage.value = undefined;
  isErrorLoadingBoats.value = false;
  boats.value = new BoatsApiProvider().dev.boats.all();
  isLoadingBoats.value = false;
};

const loadBoats = async () => {
  isLoadingBoats.value = true;
  errorMessage.value = undefined;
  isErrorLoadingBoats.value = false;
  if (AuthenticationApiProvider.isAuthenticated()) {
    const response = await BoatsApiProvider.all();
    if (response.isError) {
      errorMessage.value = response.message;
      isErrorLoadingBoats.value = response.isError;
    } else {
      boats.value = response.data!;
    }
  }
  isLoadingBoats.value = false;
};

const isLoadingCheckAvilable = ref<boolean>(false);

const checkAvailability = (selectedItem: string) => {
  emit('update:select-boat', selectedItem);
  isLoadingCheckAvilable.value = true;
  setTimeout(() => {
    isLoadingCheckAvilable.value = false;
  }, 2000);
};
</script>

<template>
  <v-select
    :item-color="request.boat.color"
    :base-color="request.boat.color"
    :color="request.boat.color"
    class="mt-4"
    variant="outlined"
    hide-details
    label="Boat"
    :items="boats"
    :model-value="request.boat.title"
    @update:model-value="checkAvailability"
    :disabled="isLoadingBoats || isLoadingCheckAvilable"
    :messages="'This is a meesage'"
    :loading="isLoadingBoats || isLoadingCheckAvilable"
    :readonly="readonly"
  >
    <template v-slot:append>
      <v-icon :color="request.boat.color">mdi-ferry</v-icon>
    </template>
  </v-select>

  <div v-if="isLoadingCheckAvilable" class="check-available pt-1 d-flex justify-space-between align-center">
    <small class="text-grey-darken-3 ml-1 mt-0 pt-0">
      Checking the availability of the {{ $props.request.boat.title?.toLocaleUpperCase() }} boat...
    </small>
  </div>

  <v-alert v-if="isErrorLoadingBoats" type="error" variant="tonal" class="mt-3">{{ errorMessage }}</v-alert>

  <div
    v-if="readonly == undefined && request.boat.title?.length && !isLoadingCheckAvilable && request.boat.isAvailable"
    class="check-available pt-1 d-flex justify-space-between align-center"
  >
    <small>
      <strong class="text-green-darken-1 ml-1 mt-0 pt-0"> {{ $props.request.boat.title }} is available. </strong>
    </small>
    <v-icon icon="mdi-checkbox-marked-circle-outline" color="green-lighten-1" />
  </div>

  <div
    v-else-if="
      readonly == undefined && request.boat.title?.length && !isLoadingCheckAvilable && !request.boat.isAvailable
    "
    class="check-available pt-1 d-flex justify-space-between align-center"
  >
    <small>
      <strong class="text-red-lighten-2 ml-1 mt-0 pt-0">{{ $props.request.boat.title }} is not available.</strong>
    </small>
    <v-icon icon="mdi-close-circle-outline" color="red-lighten-3" />
  </div>
</template>
