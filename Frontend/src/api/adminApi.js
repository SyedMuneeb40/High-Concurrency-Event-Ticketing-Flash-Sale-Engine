import api from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL EVENTS
|--------------------------------------------------------------------------
*/
export const getAdminEvents = async () => {
  const response = await api.get("/admin/events");

  console.log("ADMIN EVENTS API RESPONSE:", response.data);

  return response.data;
};


/*
|--------------------------------------------------------------------------
| GET SINGLE EVENT
|--------------------------------------------------------------------------
*/
export const getAdminEvent = async (eventId) => {
  const response = await api.get(`/admin/event/${eventId}`);

  return response.data;
};


/*
|--------------------------------------------------------------------------
| ADD EVENT
|--------------------------------------------------------------------------
*/
export const addEvent = async (eventData, image) => {
  const formData = new FormData();

  const totalSeatsValue = Number(
    eventData.total_Seats ||
      eventData.totalSeats ||
      eventData.total_seats ||
      0
  );


  /*
  |--------------------------------------------------------------------------
  | LOCAL DATE TIME FORMATTER
  |--------------------------------------------------------------------------
  */

  const formatToLocalDateTime = (rawDate) => {
    if (!rawDate) {
      return "";
    }

    let str = String(rawDate).trim();

    // Convert:
    // 2026-08-20 20:00
    // into:
    // 2026-08-20T20:00

    str = str.replace(" ", "T");

    // Remove timezone Z if present
    str = str.replace("Z", "");

    // LocalDateTime expects YYYY-MM-DDTHH:mm
    return str.substring(0, 16);
  };


  /*
  |--------------------------------------------------------------------------
  | IMPORTANT:
  | Support eventAt because AdminEvents.jsx sends eventAt
  |--------------------------------------------------------------------------
  */

  const rawEventDate =
    eventData.eventAt ||
    eventData.event_at ||
    eventData.localDateTime ||
    eventData.local_datetime ||
    eventData.dateTime ||
    eventData.date_time ||
    "";


  const formattedEventData = {
    event_name:
      eventData.event_name ||
      eventData.eventName ||
      "",

    event_mode:
      eventData.event_mode ||
      eventData.eventMode ||
      "CONCERT",

    total_Seats: totalSeatsValue,

    reserved_seats: totalSeatsValue,

    Price: Number(
      eventData.Price ||
        eventData.price ||
        eventData.ticket_price ||
        0
    ),

    imageUrl:
      eventData.imageUrl ||
      "",

    localDateTime:
      formatToLocalDateTime(rawEventDate),
  };


  console.log(
    "EVENT DATA SENT TO BACKEND:",
    formattedEventData
  );


  const eventBlob = new Blob(
    [JSON.stringify(formattedEventData)],
    {
      type: "application/json",
    }
  );


  formData.append(
    "event",
    eventBlob
  );


  if (image) {
    formData.append(
      "image",
      image
    );
  }


  /*
  |--------------------------------------------------------------------------
  | AUTH TOKEN
  |--------------------------------------------------------------------------
  */

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt_token") ||
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("accessToken");


  const authHeader = token
    ? token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`
    : "";


  const response = await api.post(
    "/admin/addEvent",
    formData,
    {
      headers: {
        Authorization: authHeader,
        "Content-Type": undefined,
      },
    }
  );


  return response.data;
};


/*
|--------------------------------------------------------------------------
| UPDATE EVENT
|--------------------------------------------------------------------------
*/
export const updateEvent = async (
  eventId,
  eventData
) => {

  const formattedEventData = {
    ...eventData,

    // Make sure backend gets the correct field
    eventAt:
      eventData.eventAt ||
      eventData.event_at ||
      eventData.localDateTime ||
      eventData.local_datetime ||
      eventData.dateTime ||
      "",
  };


  console.log(
    "UPDATE EVENT DATA:",
    formattedEventData
  );


  const response = await api.put(
    `/admin/update/${eventId}`,
    formattedEventData
  );


  return response.data;
};


/*
|--------------------------------------------------------------------------
| DELETE EVENT
|--------------------------------------------------------------------------
*/
export const deleteEvent = async (eventId) => {

  const response = await api.delete(
    `/admin/delete/${eventId}`
  );

  return response.data;
};