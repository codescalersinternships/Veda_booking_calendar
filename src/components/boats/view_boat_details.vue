<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
// import { BoatObject } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
import { defineComponent } from 'vue';

const emit = defineEmits(['close-dialog']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  // boat: {
  //   type: Object as PropType<BoatObject>,
  //   required: true,
  // },
});
</script>

<template>
  <!-- :title="$props.boat.title + ' ' + 'booking details'" -->
  <custom-dialog title="" :modelValue="modelValue" @close-dialog="(closed: boolean) => emit('close-dialog', closed)">
    <template #body>
      <v-card color="blue-lighten-5" class="pa-4">
        <v-row>
          <v-col>
            <v-text-field
              color="black"
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="true"
              label="From"
            />
            <!-- v-model="$props.boat.startStr" -->
          </v-col>
          <v-col>
            <v-text-field variant="outlined" hide-details append-icon="mdi-calendar" :disabled="true" label="To" />
            <!-- v-model="$props.boat.endStr" -->
          </v-col>
        </v-row>
      </v-card>
    </template>
  </custom-dialog>
</template>

<script lang="ts">
export default defineComponent({
  components: { customDialog },
});
</script>
