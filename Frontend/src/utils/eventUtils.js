// ======================================================
// EVENT UTILITIES
// ======================================================

// ======================================================
// AVAILABLE SEATS
// ======================================================

export const getAvailableSeats = (event) => {
  if (!event) return 0;

  // If backend already sends available seats
  const directAvailable =
    event.availableSeats ??
    event.available_seats ??
    event.remainingSeats ??
    event.remaining_seats;

  if (
    directAvailable !== undefined &&
    directAvailable !== null
  ) {
    return Math.max(0, Number(directAvailable) || 0);
  }

  // Total seats
  const totalSeats =
    event.totalSeats ??
    event.total_seats ??
    event.capacity ??
    event.seats ??
    null;

  // Reserved seats
  const reservedSeats =
    event.reservedSeats ??
    event.reserved_seats ??
    event.bookedSeats ??
    event.booked_seats ??
    0;

  // If both values exist
  if (
    totalSeats !== null &&
    totalSeats !== undefined
  ) {
    const total = Number(totalSeats) || 0;
    const reserved = Number(reservedSeats) || 0;

    return Math.max(0, total - reserved);
  }

  // Fallback
  return 0;
};


// ======================================================
// EVENT DATE/TIME
// ======================================================

export const getEventDateTime = (event) => {
  if (!event) return null;

  const rawDate =
    event.eventAt ??
    event.event_at ??
    event.localDateTime ??
    event.dateTime ??
    event.eventDateTime ??
    event.eventDate ??
    null;

  if (!rawDate) {
    return null;
  }

  if (rawDate instanceof Date) {
    return isNaN(rawDate.getTime())
      ? null
      : rawDate;
  }

  const value = String(rawDate).trim();

  if (!value) {
    return null;
  }

  // Backend format:
  // 30-08-2026 10-00 pm

  const match = value.match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2})-(\d{2})\s+(am|pm)$/i
  );

  if (match) {
    const day = Number(match[1]);
    const month = Number(match[2]) - 1;
    const year = Number(match[3]);

    let hour = Number(match[4]);
    const minute = Number(match[5]);

    const period = match[6].toLowerCase();

    if (period === "pm" && hour !== 12) {
      hour += 12;
    }

    if (period === "am" && hour === 12) {
      hour = 0;
    }

    const date = new Date(
      year,
      month,
      day,
      hour,
      minute,
      0,
      0
    );

    return isNaN(date.getTime())
      ? null
      : date;
  }

  // ISO format
  const isoDate = new Date(value);

  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  return null;
};


// ======================================================
// PARSE EVENT DATE
// ======================================================

export const parseEventDate = (date) => {
  if (!date) {
    return null;
  }

  if (date instanceof Date) {
    return isNaN(date.getTime())
      ? null
      : date;
  }

  const parsed = new Date(date);

  return isNaN(parsed.getTime())
    ? null
    : parsed;
};