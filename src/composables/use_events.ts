import { ref, onMounted } from 'vue';
import BoatsProvider from '@/api/boats';
import { EventInput } from '@fullcalendar/core';

const boats = new BoatsProvider();

export default function useEvents() {
  const getEvents = ref<EventInput[]>([]);

  const setEvents = async () => {
    getEvents.value = await boats.getBoats();
  };

  const createEvent = async (event: EventInput) => {
    return await boats.postBoat(event);
  };

  const updateEvent = async (event: EventInput, eventID: number) => {
    return await boats.updateBoat(event, eventID);
  };

  const getEvent = async (eventID: number) => {
    return await boats.getBoat(eventID);
  };

  const deleteEvent = async (eventID: number) => {
    return await boats.deleteBoat(eventID);
  };

  onMounted(setEvents);

  return {
    getEvents,
    createEvent,
    updateEvent,
    getEvent,
    deleteEvent,
  };
}
