<script lang="ts" setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarApi, CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { onMounted, reactive, ref, capitalize, watch } from 'vue';

import ViewRequest from '@/components/requests/view_request.vue';
import NewRequest from '@/components/requests/request.vue';
import { BoatApiData, BookingStatus, BookingStatusColor, RequestAPIData, RequestPaymentFee } from '@/utils/types';
import { handelDates } from '@/utils/helpers';
import RequestBoatAPIProvider from '@/api/request';
import { requestData, boatData } from '@/api/dummy_data';
import { UserApiProvider } from '@/api/users';
import { AuthenticationApiProvider } from '@/api/auth';
import BoatsApiProvider from '@/api/boats';
import { Notification } from '@/utils/toast';
import { v4 as uuidv4 } from 'uuid';

const currentDate = ref<Date>(new Date());

const toast = ref<{
  close: () => void;
}>({ close() {} });

const userAPIProvider = new UserApiProvider();

const isLoading = ref<boolean>(false);
const isPostRequest = ref<boolean>(false);
const isViewRequest = ref<boolean>(false);
const calendar = ref<CalendarApi>();

const request = ref<RequestAPIData>(requestData);
const boat = ref<BoatApiData>(boatData);

const requests = ref<RequestAPIData[]>([]);
const boats = ref<BoatApiData[]>([]);

const loadRequests = async () => {
  requests.value = [];
  const loadRequests = await RequestBoatAPIProvider.all({
    year: currentDate.value.getFullYear(),
    month: currentDate.value.getMonth() + 1,
  });
  if (loadRequests.isError) {
    toast.value = Notification.error(`${loadRequests.message}: The server might be down.`, {});
  }
  requests.value = loadRequests.data || [];
  for (const __request of requests.value) {
    pushEvent(__request);
  }
};

// Load the requests and boat from the server and display them in the calendar.
onMounted(async () => {
  console.info('Backend server on: ', window.env.VEDA_SERVER_DOMAIN);

  isLoading.value = true;
  console.info('Connecting...');
  const user = await userAPIProvider.getRequestedUser();

  if (user.isError) {
    // Unauthorized user, user should login again.
    console.warn('Error while trying to connect to the server, the requested user is not authenticated.', user.message);
    if (user.message === 'Network Error') {
      toast.value = Notification.error(`${user.message}: The server might be down.`, {});
    } else if (user.message) {
      console.info('signing out...');
      AuthenticationApiProvider.logout();
      toast.value = Notification.warn(user.message, {});
    }
    console.info('Connected.');
  } else {
    const loadBoats = await BoatsApiProvider.all();
    boats.value = loadBoats.data!;
  }

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
  request.value.status = setRequestStatus(status);
  request.value.requestStatusColor = setRequestBackground(request.value);
  updateRequestFee({ total: 0, deposit: 0 });
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
  toast.value.close();
  request.value = requests.value.filter(request => request.id === arg.event.id)[0];
  calendar.value = arg.view.calendar;
  request.value.requestStatusColor = setRequestBackground(request.value);
  document.querySelector('.fc-popover')?.classList.add('d-none');
  isViewRequest.value = true;
};

const validateDate = (startDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison

  if (startDate < today) {
    toast.value = Notification.warn('Start date cannot be in the past.', {});
    return false;
  }

  return true;
};

const onSelect = async (arg: DateSelectArg) => {
  resetRequest();
  toast.value.close();
  calendar.value = arg.view.calendar;
  const dates = handelDates({
    end: arg.end,
    start: arg.start,
    endStr: arg.endStr,
    startStr: arg.startStr,
    cut: true,
  });

  request.value.start = dates.start;
  request.value.end = dates.end;
  request.value.startStr = dates.startStr;
  request.value.endStr = dates.endStr;

  const validated: boolean = validateDate(arg.start);
  if (validated) {
    isPostRequest.value = true;
  } else {
    calendar.value.unselect();
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
  datesSet: arg => (currentDate.value = arg.view.currentStart),
});

const onSelectBoat = async (boatName: string) => {
  const loadBoats = await BoatsApiProvider.all();
  boats.value = loadBoats.data!;
  const thisBoat = boats.value.filter(boat => boat.title === boatName);
  if (thisBoat.length) {
    request.value.boat = thisBoat[0];
    request.value.boatId = thisBoat[0].id!;
  }

  boat.value = request.value.boat;
};

const updateRequest = async (_request: RequestAPIData, update?: boolean) => {
  if (calendar.value) {
    if (update) {
      if (request.value.status !== BookingStatus.Deposit) {
        delete request.value.fee;
      } else {
        if (request.value.fee) {
          request.value.fee = { total: +request.value.fee.total, deposit: +request.value.fee.deposit };
        }
      }

      const response = await RequestBoatAPIProvider.put(request.value);
      if (response.isError) {
        Notification.error(response.message!, {});
        return;
      }

      request.value.start = new Date(request.value.startStr);
      request.value.end = new Date(request.value.endStr);

      pushEvent(_request);
    } else {
      request.value.id = uuidv4();
      request.value.status = BookingStatus.Request;
      const response = await RequestBoatAPIProvider.post(request.value);
      if (response.isError) {
        Notification.error(response.message!, {});
        return;
      }

      pushEvent(_request);
      requests.value.push(_request);
      isPostRequest.value = false;
      calendar.value.unselect();
    }
  }
};

const resetRequest = () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  boat.value = {
    id: '',
    title: undefined,
    description: undefined,
    color: '',
    isAvailable: false,
  };

  request.value = {
    id: '',
    boat: boat.value,
    end: today,
    endStr: todayStr,
    start: today,
    startStr: todayStr,
    status: BookingStatus.NotSet,
    requestStatusColor: BookingStatusColor.NotSet,
    companyName: '',
    contactPerson: '',
    boatId: '',
  };
};

const normalizeRequestTitle = (request: RequestAPIData) => {
  return `${capitalize(request.boat.title || 'Boat')} | ${capitalize(request.status.replaceAll('_', ' '))}`;
};

const pushEvent = (_request: RequestAPIData) => {
  const dates = handelDates({
    end: _request.end,
    start: _request.start,
    endStr: _request.endStr,
    startStr: _request.startStr,
    add: true,
  });

  const event = {
    title: normalizeRequestTitle(_request),
    color: _request.boat.color,
    start: dates.start,
    startStr: dates.startStr,
    endStr: dates.endStr,
    end: dates.end,
    backgroundColor: _request.boat.color,
    boat: _request.boat,
    id: _request.id,
    allDay: true,
  };
  options.events = [...(options.events as []), event];
};

const updateRequestFee = (fee: RequestPaymentFee) => {
  request.value.fee = fee;
};

watch(currentDate, () => loadRequests(), { deep: true });
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
      v-if="isViewRequest && request"
      @close-dialog="isViewRequest = false"
      @update:status-color="updateRequestStatus"
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
<style>
.past-date {
  background: #a9a9a969;
  cursor: not-allowed;
}
.d-none {
  display: none !important;
}
</style>
