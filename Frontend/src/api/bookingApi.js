import api from "./axiosConfig";

// ======================================================
// CREATE BOOKING
// ======================================================

export const createBooking = async (eventId, seats) => {
  const response = await api.post("/user/booking", {
    eventId: eventId,
    seats: seats,
  });

  return response.data;
};


// ======================================================
// GET MY BOOKINGS
// ======================================================

export const getMyBookings = async () => {
  const response = await api.get("/user/getbookings");

  return response.data;
};


// ======================================================
// CANCEL BOOKING
// ======================================================

export const cancelBooking = async (bookingId) => {
  const response = await api.patch(
    `/user/cancelBooking/${bookingId}`
  );

  return response.data;
};