<script lang="ts" setup>
import { defineProps } from 'vue';

const emit = defineEmits(['close-dialog']);

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    required: false,
  },
});

const closeDialog = (closed: boolean) => {
  emit('close-dialog', closed);
};
</script>

<template>
  <v-dialog
    :width="width || '500'"
    transition="dialog-bottom-transition"
    v-model="$props.modelValue"
    hide-overlay
    @update:modelValue="(val:boolean) => closeDialog(val)"
  >
    <v-toolbar color="primary" height="48" :title="title">
      <v-spacer></v-spacer>
      <div class="d-flex justify-end align-end">
        <v-btn class="mr-1" icon @click="() => $emit('close-dialog', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <slot name="body" />
      </v-card-text>

      <v-divider class="mt-4 mb-2" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="btn-action" />
        <v-btn variant="tonal" color="error" text="Close" @click="closeDialog(false)"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
