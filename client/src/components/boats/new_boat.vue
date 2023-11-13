<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import customDialog from '@/components/ui/custom_dialog.vue';
import { UserApiProvider } from '@/api/users';
import { BoatApiData } from '@/utils/types';
import { onMounted } from 'vue';

const emit = defineEmits(['close-dialog']);
const user = new UserApiProvider();
const boat = ref<BoatApiData>({
  id: 0,
  title: '',
  color: '',
  isAvailable: false,
  description: '',
});

defineProps({
  displayNewBoat: {
    type: Boolean,
    required: true,
  },
});

function generateRandomHexColor() {
  boat.value.color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
}

const closedDialog = (closed: boolean) => {
  emit('close-dialog', closed);
  setTimeout(() => {
    boat.value.color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
  }, 500);
};

onMounted(generateRandomHexColor);
</script>

<template>
  <custom-dialog
    :title="`Register New Boat`"
    :modelValue="$props.displayNewBoat"
    :header-color="boat.color"
    width="600"
    @close-dialog="(closed: boolean) => closedDialog(closed)"
  >
    <template #body>
      <div v-if="user.isAuthenticated()">
        <v-card elevation="0" class="pa-4">
          <v-row>
            <v-col cols="12">
              <v-text-field
                :disabled="false"
                v-model="boat.title"
                color="black"
                hide-details="auto"
                variant="outlined"
                append-icon="mdi-ferry"
                label="Boat Title"
                hint="The boat name, this name will be displayed in the calendar."
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                :disabled="false"
                v-model="boat.description"
                variant="outlined"
                hide-details="auto"
                append-icon="mdi-comment-text-outline"
                label="Short Description"
                hint="This field is not required, it's a simple description of the boat, you can ignore it if you prefer."
              />
            </v-col>

            <v-col cols="12">
              <v-alert variant="tonal" :color="boat.color" title="Boat Color">
                <v-color-picker
                  class="mb-2 mt-2"
                  v-model="boat.color"
                  width="500"
                  show-swatches
                  hide-canvas
                  hide-sliders
                  hide-inputs
                />
                <small>
                  This field is fully optional, in case you ignored it, we'll generate a random color for you.
                </small>
              </v-alert>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </template>

    <template #btn-action>
      <v-btn
        v-if="user.isAuthenticated()"
        :disabled="boat.title.length === 0"
        text="New Boat"
        :loading="false"
        variant="outlined"
        :color="boat.color"
      ></v-btn>
    </template>
  </custom-dialog>
</template>

<script lang="ts">
export default defineComponent({});
</script>
