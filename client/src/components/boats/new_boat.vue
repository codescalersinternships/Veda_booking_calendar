<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import customDialog from '@/components/ui/custom_dialog.vue';
import { BoatApiData } from '@/utils/types';
import BoatsApiProvider from '@/api/boats';

const emit = defineEmits(['close-dialog']);
const isErrorResponse = ref<boolean>();
const errorMessage = ref<string>();

const isSuccessResponse = ref<boolean>();
const successMessage = ref<string>();

const isFormLoading = ref<boolean>(false);

const boat = ref<BoatApiData>({
  title: '',
  color: '#004D40',
  isAvailable: true,
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
  // setTimeout(() => {
  //   boat.value.color = '#' + ((Math.random() * 0xffffff) << 0).toString(16);
  // }, 500);
};

const boatApiService = new BoatsApiProvider();

const submit = async () => {
  isFormLoading.value = true;
  isErrorResponse.value = false;
  isSuccessResponse.value = false;

  errorMessage.value = undefined;
  successMessage.value = undefined;

  // Generate color.
  if (boat.value.color === '#004D40') {
    generateRandomHexColor();
  }

  const response = await boatApiService.post(boat.value);
  if (response.isError) {
    isErrorResponse.value = response.isError;
    errorMessage.value = response.message;
  } else {
    isSuccessResponse.value = true;
    successMessage.value = response.message;
  }
  isFormLoading.value = false;
};
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
      <div>
        <v-card elevation="0" class="pa-4">
          <v-form @submit="submit" class="pb-2">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  :disabled="isFormLoading"
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
                  :disabled="isFormLoading"
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
                    :disabled="isFormLoading"
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
              <v-col cols="12">
                <v-alert v-if="isErrorResponse" variant="tonal" type="error">{{ errorMessage }}</v-alert>
                <v-alert v-if="isSuccessResponse" variant="tonal" type="success">{{ successMessage }}</v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </div>
    </template>

    <template #btn-action>
      <v-btn
        :disabled="!boat.title || boat.title.length === 0"
        @click="submit"
        text="New Boat"
        :loading="isFormLoading"
        variant="outlined"
        :color="boat.color"
      ></v-btn>
    </template>
  </custom-dialog>
</template>

<script lang="ts">
export default defineComponent({});
</script>
