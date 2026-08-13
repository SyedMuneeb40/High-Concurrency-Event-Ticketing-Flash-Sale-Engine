import api from "./axios";

export const getAllEvents = async () => {
  const response = await api.get(
    "/admin/events"
  );

  return response.data;
};

export const getEvent = async (eventId) => {
  const response = await api.get(
    `/admin/event/${eventId}`
  );

  return response.data;
};

export const addEvent = async (
  eventData,
  image
) => {
  const formData = new FormData();

  const eventBlob = new Blob(
    [JSON.stringify(eventData)],
    {
      type: "application/json",
    }
  );

  formData.append(
    "event",
    eventBlob
  );

  formData.append(
    "image",
    image
  );

  const response = await api.post(
    "/admin/addEvent",
    formData
  );

  return response.data;
};

export const updateEvent = async (
  eventId,
  event
) => {
  const response = await api.put(
    `/admin/update/${eventId}`,
    event
  );

  return response.data;
};

export const deleteEvent = async (
  eventId
) => {
  const response = await api.delete(
    `/admin/delete/${eventId}`
  );

  return response.data;
};