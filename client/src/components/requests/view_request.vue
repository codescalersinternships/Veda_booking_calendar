<script lang="ts" setup>
import { PropType, defineComponent, capitalize, ref, Ref } from 'vue';
import customDialog from '@/components/ui/custom_dialog.vue';
import { BookingStatus, RequestAPIData } from '@/utils/types';
import { AuthenticationApiProvider } from '@/api/auth';
import { UserApiProvider } from '@/api/users';
import SelectBoat from '../boats/select_boat.vue';

const emit = defineEmits(['close-dialog', 'update:statusColor', 'update:select-boat', 'update:request']);
const startDateErrorMessage = ref<string>('');
const endDateErrorMessage = ref<string>('');

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  request: {
    type: Object as PropType<RequestAPIData>,
    required: true,
  },
});

function isValidDate(dateString: string, errorMessage: Ref<string>) {
  errorMessage.value = '';

  const datePattern = /^\d{4}-(0[1-9]|1[0-2]|[1-9])-(0[1-9]|[1-2][0-9]|3[0-1]|[1-9])$/;
  if (!datePattern.test(dateString)) {
    errorMessage.value = `The date should match this pattern: 'yyyy-mm-dd'.`;
    return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    errorMessage.value = 'Please enter a valid date.';
    return false;
  }

  return true;
}

const isValidStartDate = (dateString: string) => isValidDate(dateString, startDateErrorMessage);
const isValidEndDate = (dateString: string) => isValidDate(dateString, endDateErrorMessage);

const isEdit = ref<boolean | undefined>(true);

const items = ref<string[]>([
  capitalize(BookingStatus.NotSet).replaceAll('_', ' '),
  capitalize(BookingStatus.Request).replaceAll('_', ' '),
  capitalize(BookingStatus.Tentative).replaceAll('_', ' '),
  capitalize(BookingStatus.Deposit).replaceAll('_', ' '),
]);

const item = ref<string>(capitalize(props.request.status.replaceAll('_', ' ')));

const handleStatus = (value: string) => {
  item.value = capitalize(value.replaceAll('_', ' '));
  emit('update:statusColor', value);
};
</script>

<template>
  <custom-dialog
    :title="`View ${capitalize(request.boat.title || '')} Request`"
    :modelValue="isOpen"
    :header-color="request.boat.color"
    width="600"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <v-card variant="outlined" :color="request.boat.color" class="pa-4">
        <div class="mt-5">
          <v-text-field
            :color="request.boat.color"
            :item-color="request.boat.color"
            :base-color="request.boat.color"
            variant="outlined"
            hide-details="auto"
            append-icon="mdi-calendar"
            label="From"
            :readonly="isEdit"
            v-model="$props.request.startStr"
            hint="Request start date, usually selected from the calendar."
            :rules="[isValidStartDate]"
            :error-messages="startDateErrorMessage != undefined ? startDateErrorMessage : undefined"
          />
        </div>

        <div class="mt-5">
          <v-text-field
            :color="request.boat.color"
            :item-color="request.boat.color"
            :base-color="request.boat.color"
            v-model="$props.request.endStr"
            variant="outlined"
            hide-details="auto"
            append-icon="mdi-calendar"
            :readonly="isEdit"
            label="To"
            :rules="[isValidEndDate]"
            :error-messages="endDateErrorMessage != undefined ? endDateErrorMessage : undefined"
            hint="Request end date, usually selected from the calendar."
          />
        </div>

        <div class="mt-5">
          <select-boat
            :readonly="isEdit"
            :request="request"
            @update:select-boat="(selectedItem: string) => emit('update:select-boat', selectedItem)"
          />
        </div>

        <div class="mt-5">
          <v-text-field
            :item-color="request.boat.color"
            :base-color="request.boat.color"
            :color="request.boat.color"
            variant="outlined"
            label="Company Name"
            v-model="$props.request.companyName"
            hide-details="auto"
            append-icon="mdi-domain"
            :readonly="isEdit"
            hint="The company/person of the reservation."
          />
        </div>

        <div class="mt-5">
          <v-text-field
            :item-color="request.boat.color"
            :base-color="request.boat.color"
            :color="request.boat.color"
            variant="outlined"
            hide-details="auto"
            label="Contact Person"
            :readonly="isEdit"
            v-model="$props.request.contactPerson"
            :hint="`The reservation company/person contact details.`"
          >
            <template v-slot:append>
              <v-icon :color="request.boat.color">mdi-account-box-outline</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="mt-5">
          <v-select
            :item-color="request.boat.color"
            :base-color="request.boat.color"
            :color="request.boat.color"
            variant="outlined"
            :items="items"
            hide-details="auto"
            label="Request Status"
            :readonly="isEdit"
            @update:model-value="handleStatus"
            :model-value="item"
            :bg-color="'blue-lighten-5'"
            :hint="`This request has (${capitalize(request.status.replaceAll('_', ' '))}) status.`"
          >
            <template v-slot:append>
              <div class="dot" :style="{ backgroundColor: request.requestStatusColor }"></div>
            </template>
          </v-select>
        </div>

        <div class="mt-5" v-if="request.status === BookingStatus.Deposit && request.fee">
          <v-row>
            <v-col>
              <v-text-field
                type="number"
                :item-color="request.boat.color"
                :base-color="request.boat.color"
                :color="request.boat.color"
                variant="outlined"
                hide-details="auto"
                label="Total fee"
                :readonly="isEdit"
                v-model="$props.request.fee!.total"
                :hint="`Total reservation amount.`"
              />
            </v-col>

            <v-col>
              <v-text-field
                type="number"
                :item-color="request.boat.color"
                :base-color="request.boat.color"
                :color="request.boat.color"
                variant="outlined"
                hide-details="auto"
                :readonly="isEdit"
                label="Deposit fee"
                append-icon="mdi-currency-usd"
                v-model="$props.request.fee!.deposit"
                :hint="`Deposit paid.`"
              />
            </v-col>
          </v-row>
        </div>
        <div class="mt-5" v-if="!isEdit">
          <v-row>
            <v-btn
              class="ma-3"
              @click="
                () => {
                  isEdit = false;
                  emit('update:request', request, true);
                }
              "
              append-icon="mdi-brush"
              variant="outlined"
              color="primary"
            >
              Update
            </v-btn>
            <v-btn class="mt-3" @click="isEdit = true" append-icon="mdi-cancel" variant="outlined" color="error">
              Cancel
            </v-btn>
          </v-row>
        </div>
      </v-card>
    </template>
    <template #btn-action v-if="AuthenticationApiProvider.isAuthenticated() && UserApiProvider.isAdmin()">
      <v-btn v-if="isEdit" append-icon="mdi-brush" variant="outlined" color="primary" @click="isEdit = undefined">
        Update this request
      </v-btn>
      <v-btn append-icon="mdi-trash-can" variant="outlined" color="error">Delete this request</v-btn>
    </template>
  </custom-dialog>
</template>

<script lang="ts">
export default defineComponent({
  components: { customDialog },
});
</script>

<style scoped>
.dot {
  width: 10px;
  height: 10px;
  padding: 10px;
  border-radius: 50px;
  margin: 0 auto;
  opacity: 0.8;
  border: solid 2px white;
}
</style>
