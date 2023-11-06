<script lang="ts" setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import { reactive, ref } from 'vue';
import useEvents from '@/composables/use_events';
import { watch } from 'vue';
import viewBoatDetailsComponent from '@/components/boats/view_boat_details.vue';
import reserveBoatComponent from '@/components/boats/reserve_boat.vue';
import { BoatObject, EventDetails, reserveBoatInitializer } from '@/utils/types';
import { eventReserved } from '@/utils/book_boat';
import { handelDates } from '@/utils/helpers';

const { getEvents, createEvent, updateEvent, deleteEvent } = useEvents();

const id = ref<number>(1);
const displayeViewBoat = ref<boolean>(false);
const displayeReserveBoat = ref<boolean>(false);
const boatIntity = ref<BoatObject>({});

const createNewEvent = (eventInputs: EventInput) => createEvent(eventInputs);
const updateExactingEvent = (eventInputs: EventInput, id: number) => updateEvent(eventInputs, id);
const deleteExactingEvent = (eventID: number) => deleteEvent(eventID);

const onClick = (arg: EventClickArg) => {
  const dates = handelDates({
    end: arg.event.end!,
    start: arg.event.start!,
    endStr: arg.event.endStr,
    startStr: arg.event.startStr,
    cut: true,
  });
  boatIntity.value = {
    title: arg.event.title,
    id: arg.event.id,
    start: dates.start || new Date(),
    end: dates.end || new Date(),
    endStr: dates.endStr,
    startStr: dates.startStr,
  };
  displayeViewBoat.value = true;

  // if (arg.event) {
  //   arg.event.remove();
  // }
};

const onSelect = (arg: DateSelectArg) => {
  id.value += 1;
  const calendar = arg.view.calendar;
  const dates = handelDates({ end: arg.end, start: arg.start, endStr: arg.endStr, startStr: arg.startStr, cut: true });
  const date = new Date();
  const boatDetails: EventDetails = {
    start: dates.start || date,
    end: dates.end || date,
    startStr: dates.startStr || '',
    endStr: dates.endStr || '',
    calendar: calendar,
    boat: {},
  };

  reserveBoatInitializer.value = boatDetails;
  displayeReserveBoat.value = true;

  calendar.unselect();
};

const options = reactive<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,listDay',
  },
  editable: true,
  selectable: true,
  weekends: true,
  select: onSelect,
  eventBackgroundColor: 'black',
  eventClick: onClick,
  events: [],
  eventAdd: args => createNewEvent(args),
  eventChange: args => updateExactingEvent(args, +args.event.id),
  eventRemove: args => deleteExactingEvent(+args.event.id),
});

options.events = getEvents.value;

watch(getEvents, () => {
  options.events = getEvents.value;
});
</script>

<template>
  <v-container>
    <FullCalendar :options="options">
      <template v-slot:eventContent="arg">
        <b>{{ arg.event.title }}</b>
      </template>
    </FullCalendar>

    <!-- Boat details -->
    <view-boat-details-component
      @close-dialog="displayeViewBoat = false"
      :modelValue="displayeViewBoat"
      :boat="boatIntity"
    />

    <!-- reserve new boat -->
    <reserve-boat-component
      @close-dialog="displayeReserveBoat = false"
      :modelValue="displayeReserveBoat"
      :boat="reserveBoatInitializer"
      @event-reserved="(event: EventDetails) => {
        eventReserved(event)
        displayeReserveBoat = false
      }"
    />
  </v-container>
</template>

<script lang="ts">
export default {
  components: { viewBoatDetailsComponent, reserveBoatComponent },
};
</script>
