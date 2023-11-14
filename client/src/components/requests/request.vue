<script lang="ts" setup>
import { PropType, defineComponent, ref, watch } from 'vue';
import { BoatApiData, RequestAPIData } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
import { UserApiProvider } from '@/api/users';
import BoatsApiProvider from '@/api/boats';
import { AuthenticationApiProvider } from '@/api/auth';

const emit = defineEmits(['close-dialog', 'update:request', 'update:select-boat']);
const isLoadingBoats = ref<boolean>();
const boats = ref<BoatApiData[]>([]);
const isErrorLoadingBoats = ref<boolean>();
const errorMessage = ref<string>();

const loadBoats = async () => {
  isLoadingBoats.value = true;
  errorMessage.value = undefined;
  isErrorLoadingBoats.value = false;
  console.log(AuthenticationApiProvider.isAuthenticated());
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

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  request: {
    type: Object as PropType<RequestAPIData>,
    required: true,
  },
  selectedboat: {
    type: Object as PropType<BoatApiData>,
    required: false,
  },
});

watch(
  props,
  async () => {
    if (props.isOpen) {
      await loadBoats();
    }
  },
  { deep: true },
);

const isLoadingCheckAvilable = ref<boolean>(false);
const checkAvailability = (selectedItem: string) => {
  emit('update:select-boat', selectedItem);
  isLoadingCheckAvilable.value = true;
  setTimeout(() => {
    isLoadingCheckAvilable.value = false;
  }, 2000);
};

const isBookButtonDisabled = () => {
  return (
    props.request.boat.title === undefined ||
    props.request.boat.title.length === 0 ||
    isLoadingCheckAvilable.value ||
    !props.request.boat.isAvailable
  );
};
</script>

<template>
  <custom-dialog
    :title="`Booking ${request.boat.title}`"
    :modelValue="isOpen"
    :header-color="request.boat.color"
    width="600"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <div v-if="UserApiProvider.isAuthenticated()">
        <v-card elevation="0" color="blue-lighten-5" class="pa-4">
          <v-row>
            <v-col>
              <v-text-field
                color="black"
                variant="outlined"
                hide-details
                append-icon="mdi-calendar"
                label="From"
                :disabled="true"
                v-model="$props.request.startStr"
              />
            </v-col>

            <v-col>
              <v-text-field
                :disabled="true"
                v-model="$props.request.endStr"
                variant="outlined"
                hide-details
                append-icon="mdi-calendar"
                label="To"
              />
            </v-col>
          </v-row>
        </v-card>

        <v-select
          class="mt-4"
          variant="outlined"
          hide-details
          append-icon="mdi-ferry"
          label="Boat"
          :items="boats"
          @update:model-value="checkAvailability"
          :disabled="isLoadingBoats || isLoadingCheckAvilable"
          :messages="'This is a meesage'"
          :item-color="request.boat.color"
          :base-color="request.boat.color"
          :color="request.boat.color"
          :loading="isLoadingBoats || isLoadingCheckAvilable"
        />

        <div v-if="isLoadingCheckAvilable" class="check-available pt-1 d-flex justify-space-between align-center">
          <small class="text-grey-darken-3 ml-1 mt-0 pt-0">
            Checking the availability of the {{ $props.request.boat.title?.toLocaleUpperCase() }} boat...
          </small>
        </div>
        <v-alert v-if="isErrorLoadingBoats" type="error" variant="tonal" class="mt-3">{{ errorMessage }}</v-alert>
        <div
          v-if="$props.selectedboat?.id != 0 && !isLoadingCheckAvilable && request.boat.isAvailable"
          class="check-available pt-1 d-flex justify-space-between align-center"
        >
          <small>
            <strong class="text-green-darken-1 ml-1 mt-0 pt-0"> {{ $props.request.boat.title }} is available. </strong>
          </small>
          <v-icon icon="mdi-checkbox-marked-circle-outline" color="green-lighten-1" />
        </div>

        <div
          v-else-if="$props.selectedboat?.id != 0 && !isLoadingCheckAvilable && !request.boat.isAvailable"
          class="check-available pt-1 d-flex justify-space-between align-center"
        >
          <small>
            <strong class="text-red-lighten-2 ml-1 mt-0 pt-0">{{ $props.request.boat.title }} is not available.</strong>
          </small>
          <v-icon icon="mdi-close-circle-outline" color="red-lighten-3" />
        </div>
      </div>
      <div v-else>
        <v-alert title="Oops! It seems like you're not authorized to perform this action." type="error" variant="tonal">
          Admins have the power to post requests. Ready to access the
          <router-link to="/login">Admin Login Page</router-link>?
        </v-alert>
      </div>
    </template>

    <template #btn-action>
      <v-btn
        v-if="UserApiProvider.isAuthenticated()"
        :disabled="isBookButtonDisabled()"
        text="Book"
        :loading="isLoadingCheckAvilable"
        variant="outlined"
        :color="request.boat.color"
        @click="emit('update:request', request)"
      ></v-btn>
    </template>
  </custom-dialog>
</template>

<script lang="ts">
export default defineComponent({
  components: { customDialog },
});
</script>
