<script lang="ts" setup>
import { PropType, defineComponent, capitalize } from 'vue';
import customDialog from '@/components/ui/custom_dialog.vue';
import { RequestAPIData } from '@/utils/types';

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
  <!-- :title="$props.boat.title + ' ' + 'booking details'" -->
  <custom-dialog
    :title="`View ${capitalize(request.boat.title)} Request`"
    :modelValue="isOpen"
    :header-color="request.boat.color"
    width="600"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <v-card class="pa-4">
        <v-row>
          <v-col>
            <v-text-field
              color="black"
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="true"
              label="From"
              v-model="$props.request.startStr"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="$props.request.endStr"
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="true"
              label="To"
            />
          </v-col>
        </v-row>
        <v-select
          class="mt-4"
          variant="outlined"
          hide-details
          append-icon="mdi-ferry"
          label="Boat"
          :disabled="true"
          :model-value="request.boat.title"
          :bg-color="'blue-lighten-5'"
          :color="request.boat.color"
        />
        <div class="status mt-5">
          <v-row>
            <v-col class="d-flex justify-start align-center" cols="6">
              <p>Request Status</p>
            </v-col>
            <v-col class="d-flex justify-end align-center">
              <div class="dot" :style="{ backgroundColor: request.requestStatusColor }"></div>
              <p>
                {{ capitalize(request.status) }}
              </p>
            </v-col>
          </v-row>
        </div>
      </v-card>
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
  padding: 8px;
  border-radius: 50px;
  margin-right: 5px;
}
</style>
