<script lang="ts" setup>
import { PropType, defineComponent, capitalize } from 'vue';
import customDialog from '@/components/ui/custom_dialog.vue';
import { BookingStatus, RequestAPIData } from '@/utils/types';
import { AuthenticationApiProvider } from '@/api/auth';
import { UserApiProvider } from '@/api/users';

const emit = defineEmits(['close-dialog']);

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  request: {
    type: Object as PropType<RequestAPIData>,
    required: true,
  },
});
</script>

<template>
  <custom-dialog
    :title="`View ${capitalize(request.boat.title || '')} Request`"
    :modelValue="isOpen"
    :header-color="request.boat.color || 'primary'"
    width="600"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <v-card variant="outlined" :color="request.boat.color || 'primary'" class="pa-4">
        <div class="mt-5">
          <v-text-field
            :color="request.boat.color || 'primary'"
            :item-color="request.boat.color || 'primary'"
            :base-color="request.boat.color || 'primary'"
            variant="outlined"
            hide-details="auto"
            append-icon="mdi-calendar"
            label="From"
            :readonly="true"
            v-model="$props.request.startStr"
            hint="Request start date, usually selected from the calendar."
          />
        </div>

        <div class="mt-5">
          <v-text-field
            :color="request.boat.color || 'primary'"
            :item-color="request.boat.color || 'primary'"
            :base-color="request.boat.color || 'primary'"
            v-model="$props.request.endStr"
            variant="outlined"
            hide-details="auto"
            append-icon="mdi-calendar"
            :readonly="true"
            label="To"
            hint="Request end date, usually selected from the calendar."
          />
        </div>

        <v-select
          :item-color="request.boat.color || 'primary'"
          :base-color="request.boat.color || 'primary'"
          :color="request.boat.color || 'primary'"
          class="mt-5"
          variant="outlined"
          hide-details="auto"
          append-icon="mdi-ferry"
          label="Boat"
          :readonly="true"
          :model-value="request.boat.title"
          :bg-color="'blue-lighten-5'"
          :hint="`This request on ${request.boat.title} boat.`"
        />

        <div class="mt-5">
          <v-text-field
            :item-color="request.boat.color || 'primary'"
            :base-color="request.boat.color || 'primary'"
            :color="request.boat.color || 'primary'"
            variant="outlined"
            label="Company Name"
            v-model="$props.request.companyName"
            hide-details="auto"
            append-icon="mdi-domain"
            :readonly="true"
            hint="The company/person of the reservation."
          />
        </div>

        <div class="mt-5">
          <v-text-field
            :item-color="request.boat.color || 'primary'"
            :base-color="request.boat.color || 'primary'"
            :color="request.boat.color || 'primary'"
            variant="outlined"
            hide-details="auto"
            label="Contact Person"
            v-model="$props.request.contactPerson"
            :hint="`The reservation company/person contact details.`"
          >
            <template v-slot:append>
              <v-icon :color="request.boat.color || 'primary'">mdi-account-box-outline</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="mt-5">
          <v-text-field
            :item-color="request.boat.color || 'primary'"
            :base-color="request.boat.color || 'primary'"
            :color="request.boat.color || 'primary'"
            variant="outlined"
            hide-details="auto"
            label="Request Status"
            :model-value="capitalize(request.status)"
            :hint="`Request status`"
          >
            <template v-slot:append>
              <div class="dot" :style="{ backgroundColor: request.requestStatusColor }"></div>
            </template>
          </v-text-field>
        </div>

        <div class="mt-5" v-if="request.status === BookingStatus.deposit">
          <v-row>
            <v-col>
              <v-text-field
                :item-color="request.boat.color || 'primary'"
                :base-color="request.boat.color || 'primary'"
                :color="request.boat.color || 'primary'"
                variant="outlined"
                hide-details="auto"
                label="Total fee"
                v-model="$props.request.fee!.total"
                :hint="`Total reservation amount.`"
              />
            </v-col>
            <v-col>
              <v-text-field
                :item-color="request.boat.color || 'primary'"
                :base-color="request.boat.color || 'primary'"
                :color="request.boat.color || 'primary'"
                variant="outlined"
                hide-details="auto"
                label="Deposit fee"
                append-icon="mdi-currency-usd"
                v-model="$props.request.fee!.total"
                :hint="`Deposit paid.`"
              />
            </v-col>
          </v-row>
        </div>
      </v-card>
    </template>
    <template #btn-action v-if="AuthenticationApiProvider.isAuthenticated() && UserApiProvider.isAdmin()">
      <v-btn append-icon="mdi-brush" variant="outlined" color="primary">Update this request</v-btn>
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
