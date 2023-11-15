<script lang="ts" setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { onMounted, reactive, ref, watch, capitalize } from 'vue';

import ViewRequest from '@/components/requests/view_request.vue';
import NewRequest from '@/components/requests/request.vue';
import { BoatApiData, BookingStatus, BookingStatusColor, RequestAPIData } from '@/utils/types';
import { handelDates } from '@/utils/helpers';
import RequestBoatAPIProvider from '@/api/request';
import { requestData, boatData } from '@/api/dummy_data';
import { UserApiProvider } from '@/api/users';
import { AuthenticationApiProvider } from '@/api/auth';
import BoatsApiProvider from '@/api/boats';

const userAPIProvider = new UserApiProvider();

const isLoading = ref<boolean>(false);
const isPostRequest = ref<boolean>(false);
const refreshBoats = ref<boolean>(true);
const isViewRequest = ref<boolean>(false);

const request = ref<RequestAPIData>(requestData);
const boat = ref<BoatApiData>(boatData);

const requests = ref<RequestAPIData[]>([]);
const boats = ref<BoatApiData[]>([]);

// Load the requests and boat from the server and display them in the calendar.
onMounted(async () => {
  isLoading.value = true;
  const user = await userAPIProvider.getRequestedUser();

  if (user.isError) {
    // Unauthorized user, user should login again.
    AuthenticationApiProvider.logout();
  } else {
    const loadBoats = await BoatsApiProvider.all();
    boats.value = loadBoats.data!;
  }

  const loadRequests = await RequestBoatAPIProvider.all();
  const requestsData = loadRequests.data!;

  for (const __request of requestsData) {
    const dates = handelDates({
      end: __request.end,
      start: __request.start,
      endStr: __request.endStr,
      startStr: __request.startStr,
      add: true,
    });

    const event = {
      title: normalizeRequestTitle(__request),
      color: __request.boat.color,
      start: dates.start,
      startStr: dates.startStr,
      endStr: dates.endStr,
      end: dates.end,
      backgroundColor: __request.boat.color,
      boat: __request.boat,
      id: __request.id,
      allDay: true,
      duration: '02:00',
    };

    options.events = [...options.events, event];
  }

  requests.value = requestsData;
  isLoading.value = false;
});

const setRequestStatus = (status: string): BookingStatus => {
  switch (status) {
    case BookingStatus.Request:
      return BookingStatus.Request;
    case BookingStatus.Tentative:
      return BookingStatus.Tentative;
    case BookingStatus.Deposit:
      return BookingStatus.Deposit;
    default:
      return BookingStatus.NotSet;
  }
};

const updateRequestStatus = (status: string) => {
  status = status.toLocaleLowerCase().replaceAll(' ', '_');
  console.log('setRequestStatus(status)', setRequestStatus(status));
  request.value.status = setRequestStatus(status);
  console.log('request.value.status', request.value.status);

  request.value.requestStatusColor = setRequestBackground(request.value);
  console.log('request.value', request.value);
};

const setRequestBackground = (request: RequestAPIData): BookingStatusColor => {
  switch (request.status) {
    case BookingStatus.Request:
      return BookingStatusColor.Request;
    case BookingStatus.Tentative:
      return BookingStatusColor.Tentative;
    case BookingStatus.Deposit:
      return BookingStatusColor.Deposit;
    default:
      return BookingStatusColor.NotSet;
  }
};

const onClick = async (arg: EventClickArg) => {
  const __request = requests.value.filter(request => request.id === +arg.event.id)[0];
  __request.requestStatusColor = setRequestBackground(__request);
  request.value = __request;
  isViewRequest.value = true;
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
  const calendar = arg.view.calendar;
  const validated: boolean = validateDate(arg.start);

  if (validated) {
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
      companyName: '',
      contactPerson: '',
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

const onSelectBoat = async (boatName: string) => {
  const thisBoat = boats.value.filter(boat => boat.title === boatName);
  request.value.boat = thisBoat[0];
  boat.value = request.value.boat;
};

const updateRequest = async (_request: RequestAPIData, update?: boolean) => {
  const request_: RequestAPIData = {
    boat: request.value.boat.id as unknown as BoatApiData,
    companyName: request.value.companyName,
    contactPerson: request.value.contactPerson,
    end: request.value.end,
    endStr: request.value.endStr,
    start: request.value.start,
    startStr: request.value.startStr,
    status: request.value.status,
    id: request.value.id,
    requestStatusColor: request.value.requestStatusColor,
  };

  if (update) {
    RequestBoatAPIProvider.put(request_);
  } else {
    RequestBoatAPIProvider.post(request_);
  }

  request.value = _request;
  requests.value.push(request.value);

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
  return `${capitalize(request.boat.title || 'Boat')} | ${capitalize(request.status.replace('_', ' '))}`;
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
    <view-request
      v-if="isViewRequest"
      @update:status-color="updateRequestStatus"
      @close-dialog="isViewRequest = false"
      @update:select-boat="onSelectBoat"
      @update:request="updateRequest"
      :is-open="isViewRequest"
      :request="request"
    />

    <!-- reserve new boat -->
    <new-request
      @update:select-boat="onSelectBoat"
      @close-dialog="
        () => {
          resetRequest();
          isPostRequest = false;
        }
      "
      @update:request="updateRequest"
      :is-open="isPostRequest"
      :request="request"
      :selectedBoat="boat"
    />
  </v-container>
</template>

<script lang="ts">
export default {
  // viewBoatDetailsComponent,
  components: { NewRequest, ViewRequest },
};
</script>
