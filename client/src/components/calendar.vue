<script lang="ts" setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { onMounted, reactive, ref, watch, capitalize } from 'vue';
import viewBoatDetailsComponent from '@/components/boats/view_boat_details.vue';
import reserveBoatComponent from '@/components/boats/reserve_boat.vue';
import { BoatApiData, BookingStatus, BookingStatusColor, RequestAPIData } from '@/utils/types';
import { handelDates } from '@/utils/helpers';
import BoatsProvider from '@/api/boats';
import RequestBoatAPIProvider from '@/api/request';
import { requestData, boatData } from '@/api/dummy_data';
import { UserApiProvider } from '@/api/users';
import router from '@/router';

const boatAPIProvider = new BoatsProvider();
const requestAPIProvider = new RequestBoatAPIProvider();
const user = new UserApiProvider();

const isLoading = ref<boolean>(false);
const isPostRequest = ref<boolean>(false);
const isViewRequest = ref<boolean>(false);

const request = ref<RequestAPIData>(requestData);
const boat = ref<BoatApiData>(boatData);

const requests = ref<RequestAPIData[]>([]);
const boats = ref<BoatApiData[]>([]);
const today = new Date();

// Load the requests and boat from the server and display them in the calendar.
onMounted(async () => {
  isLoading.value = true;
  if (user.isAuthenticated()) {
    const loadRequests = await requestAPIProvider.all();
    const loadBoats = await boatAPIProvider.all();
    requests.value = loadRequests;
    boats.value = loadBoats;

    if (options.events) {
      for (const _request of requests.value) {
        const dates = handelDates({
          end: _request.end,
          start: _request.start,
          endStr: _request.endStr,
          startStr: _request.startStr,
          add: true,
        });

        options.events.push({
          id: _request.id,
          title: normalizeRequestTitle(_request),
          start: dates.start,
          end: dates.end,
          startStr: dates.startStr,
          endStr: dates.endStr,
          color: _request.boat.color,
          boat: _request.boat,
        });
      }
    }
    isLoading.value = false;
  } else {
    router.push('/login');
  }
});

const onClick = async (arg: EventClickArg) => {
  const _request = await requestAPIProvider.get(+arg.event.id);
  request.value = _request;
  isViewRequest.value = true;
  document.querySelector('.fc-popover')?.classList.add('d-none');
};
const validateDate = (startDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison

  if (startDate < today) {
    alert('Start date cannot be in the past.');
    return false;
  }

  return true;
};

const onSelect = async (arg: DateSelectArg) => {
  const validated: boolean = validateDate(arg.start);
  const calendar = arg.view.calendar;

  if (validated) {
    arg.view.type = 'disabled';
    // console.log(calendar.off());
    const dates = handelDates({
      end: arg.end,
      start: arg.start,
      endStr: arg.endStr,
      startStr: arg.startStr,
      cut: true,
    });

    const _request: RequestAPIData = {
      id: requests.value.length + 1,
      requestStatusColor: BookingStatusColor.NotSet,
      status: BookingStatus.NotSet,
      start: dates.start,
      end: dates.end,
      startStr: dates.startStr,
      endStr: dates.endStr,
      boat: boatData,
      calendar: calendar,
    };

    request.value = _request;
    isPostRequest.value = true;
  } else {
    calendar.unselect();
  }
};

const options = reactive<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  // dayMaxEventRows: true,
  dayMaxEvents: true,
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,listDay',
  },
  selectable: true,
  weekends: true,
  select: onSelect,
  eventClick: onClick,
  events: [],
  editable: false,
});

const onSelectBoat = (boatName: string) => {
  const thisBoat = boats.value.filter(boat => boat.title === boatName);
  request.value.boat = thisBoat[0];
  boat.value = request.value.boat;
};

const updateRequest = async (_request: RequestAPIData) => {
  _request.status = BookingStatus.Request;
  _request.requestStatusColor = BookingStatusColor.Request;

  request.value = _request;
  requestAPIProvider.post(_request);

  if (request.value.calendar) {
    request.value.calendar.addEvent(request);
    isPostRequest.value = false;
    request.value.calendar.unselect();
  }
};

const resetRequest = () => {
  request.value = requestData;
  boat.value = boatData;
};

const normalizeRequestTitle = (request: RequestAPIData) => {
  return `${capitalize(request.boat.title)} | ${capitalize(request.status)}`;
};

watch(
  requests,
  () => {
    if (options.events && request.value.calendar) {
      const dates = handelDates({
        end: request.value.end,
        start: request.value.start,
        endStr: request.value.endStr,
        startStr: request.value.startStr,
        add: true,
      });

      const event = {
        title: normalizeRequestTitle(request.value),
        color: request.value.boat.color,
        start: dates.start,
        startStr: dates.startStr,
        endStr: dates.endStr,
        end: dates.end,
        backgroundColor: request.value.boat.color,
        boat: request.value.boat,
        id: request.value.id,
        allDay: true,
        duration: '02:00',
      };

      request.value.calendar.addEvent(event as unknown as EventInput);
      options.events = [...options.events, event];
      resetRequest();
    }
  },
  { deep: true },
);
</script>

<template>
  <v-container class="fill-height">
    <div class="d-flex justify-center align-center w-100" v-if="isLoading">
      <v-progress-circular color="primary" indeterminate :size="160" :width="3">Loading events...</v-progress-circular>
    </div>
    <div class="w-100" v-else>
      <FullCalendar :options="options">
        <template v-slot:eventContent="arg">
          <b>{{ arg.event.title }}</b>
        </template>
      </FullCalendar>
    </div>

    <!-- Boat details -->
    <view-boat-details-component @close-dialog="isViewRequest = false" :is-open="isViewRequest" :request="request" />

    <!-- reserve new boat -->
    <reserve-boat-component
      @update:select-boat="onSelectBoat"
      @close-dialog="isPostRequest = false"
      @update:request="updateRequest"
      :is-open="isPostRequest"
      :request="request"
      :selectedboat="boat"
    />
  </v-container>
</template>

<script lang="ts">
export default {
  // viewBoatDetailsComponent,
  components: { reserveBoatComponent },
};
</script>

<style>
.past-date {
  background: #a9a9a969;
  cursor: not-allowed;
}
.d-none {
  display: none !important;
}
</style>