<script lang="ts" setup>
import { PropType, defineComponent, ref, watch } from 'vue';
import { BoatApiData, RequestAPIData } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
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
    if (
      props.isOpen &&
      props.request.boat.id === 0 &&
      props.request.companyName.length === 0 &&
      props.request.contactPerson.length === 0
    ) {
      // That means the modal dialog is opened for the first time, we need to do do this condition to avoid making multiple requests to the backend.
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
    !props.request.boat.isAvailable ||
    props.request.contactPerson === undefined ||
    props.request.contactPerson.length === 0 ||
    props.request.companyName === undefined ||
    props.request.companyName.length === 0
  );
};
</script>

<template>
  <custom-dialog
    :title="`Booking ${request.boat.title || 'Boat'}`"
    :modelValue="isOpen"
    :header-color="request.boat.color || 'primary'"
    width="600"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <div v-if="AuthenticationApiProvider.isAuthenticated()">
        <v-card elevation="0" variant="outlined" :color="request.boat.color || 'primary'" class="pa-4">
          <div class="mt-3">
            <v-text-field
              :color="request.boat.color || 'primary'"
              :item-color="request.boat.color || 'primary'"
              :base-color="request.boat.color || 'primary'"
              variant="outlined"
              hide-details="auto"
              label="From"
              v-model="$props.request.startStr"
              :readonly="true"
            >
              <template v-slot:append>
                <v-icon :color="request.boat.color || 'primary'">mdi-calendar</v-icon>
              </template>
            </v-text-field>
          </div>

          <div class="mt-3">
            <v-text-field
              :color="request.boat.color || 'primary'"
              :item-color="request.boat.color || 'primary'"
              :base-color="request.boat.color || 'primary'"
              v-model="$props.request.endStr"
              :readonly="true"
              variant="outlined"
              hide-details="auto"
              label="To"
            >
              <template v-slot:append>
                <v-icon :color="request.boat.color || 'primary'">mdi-calendar</v-icon>
              </template>
            </v-text-field>
          </div>
          <v-select
            class="mt-4"
            variant="outlined"
            hide-details
            label="Boat"
            :items="boats"
            @update:model-value="checkAvailability"
            :disabled="isLoadingBoats || isLoadingCheckAvilable"
            :messages="'This is a meesage'"
            :item-color="request.boat.color || 'primary'"
            :base-color="request.boat.color || 'primary'"
            :color="request.boat.color || 'primary'"
            :loading="isLoadingBoats || isLoadingCheckAvilable"
          >
            <template v-slot:append>
              <v-icon :color="request.boat.color || 'primary'">mdi-ferry</v-icon>
            </template>
          </v-select>

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
              <strong class="text-green-darken-1 ml-1 mt-0 pt-0">
                {{ $props.request.boat.title }} is available.
              </strong>
            </small>
            <v-icon icon="mdi-checkbox-marked-circle-outline" color="green-lighten-1" />
          </div>

          <div
            v-else-if="$props.selectedboat?.id != 0 && !isLoadingCheckAvilable && !request.boat.isAvailable"
            class="check-available pt-1 d-flex justify-space-between align-center"
          >
            <small>
              <strong class="text-red-lighten-2 ml-1 mt-0 pt-0"
                >{{ $props.request.boat.title }} is not available.</strong
              >
            </small>
            <v-icon icon="mdi-close-circle-outline" color="red-lighten-3" />
          </div>

          <div class="mt-3">
            <v-text-field
              :item-color="request.boat.color || 'primary'"
              :base-color="request.boat.color || 'primary'"
              :color="request.boat.color || 'primary'"
              variant="outlined"
              label="Company Name"
              v-model="$props.request.companyName"
              hide-details="auto"
              :hint="`In case there is no company and it's a personal reservation, please type the person's name.`"
            >
              <template v-slot:append>
                <v-icon :color="request.boat.color || 'primary'">mdi-domain</v-icon>
              </template>
            </v-text-field>
          </div>

          <div class="mt-3">
            <v-text-field
              :item-color="request.boat.color || 'primary'"
              :base-color="request.boat.color || 'primary'"
              :color="request.boat.color || 'primary'"
              variant="outlined"
              hide-details="auto"
              label="Contact Person"
              v-model="$props.request.contactPerson"
              :hint="`The contact person should be a phone number or email, to be used when need to contact the reservation person.`"
            >
              <template v-slot:append>
                <v-icon :color="request.boat.color || 'primary'">mdi-account-box-outline</v-icon>
              </template>
            </v-text-field>
          </div>
        </v-card>
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
        v-if="AuthenticationApiProvider.isAuthenticated()"
        :disabled="isBookButtonDisabled()"
        text="Book"
        :loading="isLoadingCheckAvilable"
        variant="outlined"
        :color="request.boat.color || 'primary'"
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
