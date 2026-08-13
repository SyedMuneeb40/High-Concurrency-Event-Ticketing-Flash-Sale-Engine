import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/jwt";
import { getImageUrl } from "../utils/imageUrl";

// ======================================================
// AVAILABLE / REMAINING SEATS
// Backend mein reserved_seats = remaining seats
// ======================================================

export const getAvailableSeats = (event) => {
  if (!event) return 0;

  const seats =
    event.reserved_seats ??
    event.reservedSeats ??
    event.availableSeats ??
    event.available_seats ??
    0;

  const number = Number(seats);

  return Number.isFinite(number) ? number : 0;
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

  if (!rawDate) return null;

  if (rawDate instanceof Date) {
    return isNaN(rawDate.getTime()) ? null : rawDate;
  }

  const value = String(rawDate).trim();

  if (!value) return null;

  // Backend:
  // 12-08-2026 01-38 pm

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

    return isNaN(date.getTime()) ? null : date;
  }

  // ISO format
  const isoDate = new Date(value);

  return isNaN(isoDate.getTime()) ? null : isoDate;
};

// ======================================================
// PARSE EVENT DATE
// ======================================================

export const parseEventDate = (date) => {
  if (!date) return null;

  if (date instanceof Date) {
    return isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(date);

  return isNaN(parsed.getTime()) ? null : parsed;
};

// ======================================================
// EVENT TYPE
// ======================================================

const getEventType = (event) => {
  const mode =
    event?.event_mode ??
    event?.eventMode;

  if (!mode) return "Event";

  if (typeof mode === "string") {
    return mode;
  }

  if (
    typeof mode.eventType === "object" &&
    mode.eventType !== null
  ) {
    return (
      mode.eventType.eventType ||
      mode.eventType.event_type ||
      "Event"
    );
  }

  if (typeof mode.eventType === "string") {
    return mode.eventType;
  }

  return "Event";
};

// ======================================================
// EVENT CARD
// ======================================================

function EventCard({
  event,
  onEdit,
  onDelete,
  isAdmin = false,
  onBook,
}) {
  const navigate = useNavigate();

  // ====================================================
  // ROLE
  // ====================================================

  const role = getUserRole();

  const admin =
    isAdmin === true ||
    role === "ADMIN" ||
    role === "ROLE_ADMIN";

  // ====================================================
  // EVENT DATA
  // ====================================================

  const title =
    event?.eventName ||
    event?.event_name ||
    event?.title ||
    event?.name ||
    "Untitled event";

  const eventType = getEventType(event);

  const price = Number(
    event?.Price ??
    event?.price ??
    event?.ticket_price ??
    event?.ticketPrice ??
    0
  );

  // IMPORTANT:
  // Same helper used everywhere
  const availableSeats = getAvailableSeats(event);

  const eventDate = getEventDateTime(event);

  const validDate =
    eventDate &&
    !isNaN(eventDate.getTime());

  const isExpired =
    validDate &&
    eventDate.getTime() <= Date.now();

  const soldOut = availableSeats <= 0;

  // ====================================================
  // IMAGE
  // ====================================================

  const imageUrl = event?.imageUrl
    ? getImageUrl(event.imageUrl)
    : null;

  // ====================================================
  // DATE
  // ====================================================

  const formattedDate = validDate
    ? eventDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  // ====================================================
  // TIME
  // ====================================================

  const formattedTime = validDate
    ? eventDate.toLocaleTimeString("en-PK", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Time unavailable";

  // ====================================================
  // BOOK NOW
  // ====================================================

  const handleBookNow = () => {
    if (admin) return;

    if (isExpired) return;

    if (soldOut) return;

    // If Home passes onBook, open modal
    if (typeof onBook === "function") {
      onBook(event);
      return;
    }

    // Fallback
    navigate(`/booking/${event.id}`);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="event-card">

      {/* IMAGE */}

      <div className="event-image">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
          />
        ) : (
          <div className="no-image">
            {eventType}
          </div>
        )}

        <span className="event-badge">
          {eventType}
        </span>

      </div>

      {/* INFORMATION */}

      <div className="event-info">

        <h3>
          {title}
        </h3>

        <div className="event-meta">

          <p>
            <span>📅</span>
            <span>{formattedDate}</span>
          </p>

          <p>
            <span>⏰</span>
            <span>{formattedTime}</span>
          </p>

          <p>
            <span>🎟️</span>

            {soldOut ? (
              <strong className="sold-out-text">
                All slots booked
              </strong>
            ) : (
              <span>
                {availableSeats} seats available
              </span>
            )}

          </p>

        </div>

        <div className="event-bottom">

          <div className="event-price">

            <span>
              From
            </span>

            <strong>
              Rs. {price.toLocaleString()}
            </strong>

          </div>

          {/* ADMIN */}

          {admin ? (

            <div className="card-actions">

              <button
                type="button"
                className="edit-btn"
                onClick={() =>
                  onEdit && onEdit(event)
                }
              >
                Edit
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={() =>
                  onDelete &&
                  onDelete(event.id)
                }
              >
                Delete
              </button>

            </div>

          ) : isExpired ? (

            <button
              type="button"
              className="expired-btn"
              disabled
            >
              Event Ended
            </button>

          ) : soldOut ? (

            <button
              type="button"
              className="expired-btn"
              disabled
            >
              All Slots Booked
            </button>

          ) : (

            <button
              type="button"
              className="book-btn"
              onClick={handleBookNow}
            >
              Book Now
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

export default EventCard;