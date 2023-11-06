<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { BoatObject } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
import { defineComponent } from 'vue';

const emit = defineEmits(['close-dialog']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  boat: {
    type: Object as PropType<BoatObject>,
    required: true,
  },
});
</script>

<template>
  <custom-dialog
    :title="$props.boat.title + ' ' + 'booking details'"
    :modelValue="modelValue"
    @close-dialog="(closed: boolean) => emit('close-dialog', closed)"
  >
    <template #body>
      <v-card color="blue-lighten-5" class="pa-4">
        $props.boat.status = ? {{ $props.boat.status }}
        $props.boat.status = ? {{ $props.boat.end }}
        <v-row>
          <v-col>
            <v-text-field
              color="black"
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="true"
              v-model="$props.boat.startStr"
              label="From"
            />
          </v-col>
          <v-col>
            <v-text-field
              variant="outlined"
              hide-details
              append-icon="mdi-calendar"
              :disabled="true"
              v-model="$props.boat.endStr"
              label="To"
            />
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
