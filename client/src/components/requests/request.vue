<script lang="ts" setup>
import { PropType, defineComponent, ref } from 'vue';
import { BoatApiData, RequestAPIData } from '@/utils/types';
import customDialog from '@/components/ui/custom_dialog.vue';
import { AuthenticationApiProvider } from '@/api/auth';
import BoatCard from '@/components/requests/boat_card.vue';

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

const isProd = window.env.isProd;
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
      <boat-card
        :request="request"
        :is-prod="isProd"
        @update:select-boat="(selectedItem: string) => emit('update:select-boat', selectedItem)"
      />
    </template>

    <template #btn-action>
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
