<script lang="ts" setup>
import { defineProps, PropType, defineComponent, ref } from 'vue';
import { BoatNames, EventDetails } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';

const emit = defineEmits(['close-dialog', 'event-reserved']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  boat: {
    type: Object as PropType<EventDetails>,
    required: true,
  },
  enableCalendar: {
    type: Boolean,
    required: false,
  },
});

const boats: string[] = [BoatNames.Veda1, BoatNames.Veda2, BoatNames.Veda3, BoatNames.Veda4];
const isLoadingCheckAvilable = ref<boolean>(false);
const availableMessage = ref<string>('');
const isNotAvailableMessage = ref<string>('');

const checkAvailability = (selectedItem: string) => {
  availableMessage.value = '';
  isNotAvailableMessage.value = '';

  isLoadingCheckAvilable.value = true;

  setTimeout(() => {
    availableMessage.value = `${selectedItem} is available.`;
    isNotAvailableMessage.value = `${selectedItem} is not available.`;
    isLoadingCheckAvilable.value = false;
  }, 2000);
};

const isBookButtonDisabled = () => {
  return props.boat.boat.title === undefined || props.boat.boat.title.length === 0 || isLoadingCheckAvilable.value;
};
</script>

<template>
  <custom-dialog
    :title="'Book a boat'"
    :modelValue="modelValue"
    width="600"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <v-card color="blue-lighten-5" class="pa-4">
        <div class="text-start mb-4">
          <small v-if="$props.enableCalendar">
            Please ensure you select valid dates. You can either manually input the dates or click on the start date in
            the calendar and drag to the end date for a quicker selection.
          </small>
        </div>

        <v-row>
          <v-col>
            <v-text-field
              color="black"
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="!$props.enableCalendar"
              v-model="$props.boat.startStr"
              label="From"
            />
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="!$props.enableCalendar"
              v-model="$props.boat.endStr"
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
        v-model="$props.boat.boat.title"
        label="Boat"
        :items="boats"
        @update:model-value="checkAvailability"
        :disabled="isLoadingCheckAvilable"
      />

      <div v-if="isLoadingCheckAvilable" class="check-available pt-3 d-flex justify-space-between align-center">
        <small>
          <strong>Checking the availability of the {{ $props.boat.boat.title?.toLocaleUpperCase() }} boat.</strong>
        </small>
        <v-progress-circular color="blue-lighten-3" indeterminate></v-progress-circular>
      </div>

      <div v-if="availableMessage.length" class="check-available pt-3 d-flex justify-space-between align-center">
        <small>
          <strong class="text-green-lighten-2">{{ availableMessage }}</strong>
        </small>
        <v-icon icon="mdi-checkbox-marked-circle-outline" color="green-lighten-3" />
      </div>

      <div v-if="isNotAvailableMessage.length" class="check-available pt-3 d-flex justify-space-between align-center">
        <small>
          <strong class="text-red-lighten-2">{{ isNotAvailableMessage }}</strong>
        </small>
        <v-icon icon="mdi-close-circle-outline" color="red-lighten-3" />
      </div>
    </template>

    <template #btn-action>
      <v-btn
        text="Book"
        :loading="isLoadingCheckAvilable"
        :disabled="isBookButtonDisabled()"
        variant="tonal"
        color="primary"
        @click="emit('event-reserved', boat)"
      ></v-btn>
    </template>
  </custom-dialog>
</template>

<script lang="ts">
export default defineComponent({
  components: { customDialog },
});
</script>
