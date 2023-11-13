<script lang="ts" setup>
import { PropType, defineComponent, ref } from 'vue';
import { BoatApiData, RequestAPIData } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
import { boats } from '@/api/dummy_data';
import { UserApiProvider } from '@/api/users';

const emit = defineEmits(['close-dialog', 'update:request', 'update:select-boat']);
const user = new UserApiProvider();

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

const isLoadingCheckAvilable = ref<boolean>(false);
const checkAvailability = (selectedItem: string) => {
  emit('update:select-boat', selectedItem);
  isLoadingCheckAvilable.value = true;
  setTimeout(() => {
    isLoadingCheckAvilable.value = false;
  }, 2000);
};

// const boats: string[] = [BoatNames.Veda1, BoatNames.Veda2, BoatNames.Veda3, BoatNames.Veda4];

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
      <div v-if="user.isAuthenticated()">
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
          :disabled="isLoadingCheckAvilable"
          :loading="isLoadingCheckAvilable"
          :messages="'This is a meesage'"
          :item-color="request.boat.color"
          :base-color="request.boat.color"
          :color="request.boat.color"
        />

        <div v-if="isLoadingCheckAvilable" class="check-available pt-1 d-flex justify-space-between align-center">
          <small class="text-grey-darken-3 ml-1 mt-0 pt-0">
            Checking the availability of the {{ $props.request.boat.title?.toLocaleUpperCase() }} boat...
          </small>
        </div>

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
        <v-alert title="You don't have permission to preform this action" type="error" variant="tonal">
          Admins have the power to post requests. Ready to access the
          <router-link to="/login">Admin Login Page</router-link>?
        </v-alert>
      </div>
    </template>

    <template #btn-action>
      <v-btn
        v-if="user.isAuthenticated()"
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
