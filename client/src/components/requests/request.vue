<script lang="ts" setup>
import { PropType, defineComponent } from 'vue';
import { BoatApiData, RequestAPIData } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
import { AuthenticationApiProvider } from '@/api/auth';
import SelectBoat from '../boats/select_boat.vue';

const emit = defineEmits(['close-dialog', 'update:request', 'update:select-boat']);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  request: {
    type: Object as PropType<RequestAPIData>,
    required: true,
  },
  selectedBoat: {
    type: Object as PropType<BoatApiData>,
    required: false,
  },
});

const isBookButtonDisabled = () => {
  return (
    props.request.boat.title === undefined ||
    props.request.boat.title.length === 0 ||
    // isLoadingCheckAvilable.value ||
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

          <div class="mt-3">
            <select-boat
              :readonly="undefined"
              :request="request"
              @update:select-boat="(selectedItem: string) => emit('update:select-boat', selectedItem)"
            />
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
      <!-- :loading="isLoadingCheckAvilable" -->
      <v-btn
        v-if="AuthenticationApiProvider.isAuthenticated()"
        :disabled="isBookButtonDisabled()"
        text="Book"
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
