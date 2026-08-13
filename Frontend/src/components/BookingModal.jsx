import {
  CalendarDays,
  Clock3,
  Loader2,
  Minus,
  Plus,
  Ticket,
  X,
} from "lucide-react";

import {
  getAvailableSeats,
  getEventDateTime,
} from "./EventCard";

import { getImageUrl } from "../utils/imageUrl";

import "./BookingModal.css";

// ============================================================
// EVENT NAME
// ============================================================

const getEventName = (event) => {
  return (
    event?.eventName ||
    event?.event_name ||
    event?.title ||
    event?.name ||
    "Untitled event"
  );
};

// ============================================================
// EVENT TYPE
// ============================================================

const getEventType = (event) => {
  const mode =
    event?.event_mode ??
    event?.eventMode;

  if (!mode) {
    return "Event";
  }

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

// ============================================================
// PRICE
// ============================================================

const getEventPrice = (event) => {
  return Number(
    event?.Price ??
    event?.price ??
    event?.ticket_price ??
    event?.ticketPrice ??
    0
  );
};

// ============================================================
// BOOKING MODAL
// ============================================================

function BookingModal({
  event,
  seats,
  setSeats,
  onClose,
  onConfirm,
  loading,
}) {
  if (!event) {
    return null;
  }

  // ==========================================================
  // EVENT DATE
  // ==========================================================

  const eventDate = getEventDateTime(event);

  // ==========================================================
  // AVAILABLE SEATS
  // SAME HELPER AS EVENT CARD
  // ==========================================================

  const availableSeats = getAvailableSeats(event);

  // ==========================================================
  // PRICE
  // ==========================================================

  const price = getEventPrice(event);

  // ==========================================================
  // TOTAL
  // ==========================================================

  const total = price * Number(seats || 0);

  // ==========================================================
  // INCREASE
  // ==========================================================

  const increaseSeats = () => {
    if (
      !loading &&
      seats < availableSeats
    ) {
      setSeats((previous) => previous + 1);
    }
  };

  // ==========================================================
  // DECREASE
  // ==========================================================

  const decreaseSeats = () => {
    if (
      !loading &&
      seats > 1
    ) {
      setSeats((previous) => previous - 1);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className="booking-overlay"
      onMouseDown={onClose}
    >

      <div
        className="booking-modal"
        onMouseDown={(e) =>
          e.stopPropagation()
        }
      >

        {/* CLOSE */}

        <button
          type="button"
          className="booking-close-button"
          onClick={onClose}
          disabled={loading}
        >
          <X size={18} />
        </button>

        {/* IMAGE */}

        <div className="booking-modal-image">

          {event?.imageUrl ? (

            <img
              src={getImageUrl(event.imageUrl)}
              alt={getEventName(event)}
            />

          ) : (

            <div className="booking-modal-no-image">
              <Ticket size={38} />
            </div>

          )}

        </div>

        {/* BODY */}

        <div className="booking-modal-body">

          {/* TYPE */}

          <span className="booking-modal-type">
            {getEventType(event)}
          </span>

          {/* TITLE */}

          <h2>
            {getEventName(event)}
          </h2>

          {/* DATE / TIME */}

          <div className="booking-info-row">

            {/* DATE */}

            <div className="booking-info-item">

              <CalendarDays size={17} />

              <div>

                <small>
                  Date
                </small>

                <strong>
                  {eventDate
                    ? eventDate.toLocaleDateString(
                        "en-PK",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : "Unavailable"}
                </strong>

              </div>

            </div>

            {/* TIME */}

            <div className="booking-info-item">

              <Clock3 size={17} />

              <div>

                <small>
                  Time
                </small>

                <strong>
                  {eventDate
                    ? eventDate.toLocaleTimeString(
                        "en-PK",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )
                    : "Unavailable"}
                </strong>

              </div>

            </div>

          </div>

          {/* AVAILABLE SEATS */}

          <div className="available-seats-box">

            <Ticket size={17} />

            <span>

              <strong>
                {availableSeats}
              </strong>{" "}

              seats available

            </span>

          </div>

          {/* NO SEATS */}

          {availableSeats <= 0 ? (

            <div className="booking-sold-out">
              All slots are booked.
            </div>

          ) : (

            <>

              {/* TICKET SELECTION */}

              <div className="ticket-selection">

                <div className="ticket-selection-info">

                  <strong>
                    Tickets
                  </strong>

                  <span>
                    Select quantity
                  </span>

                </div>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={decreaseSeats}
                    disabled={
                      loading ||
                      seats <= 1
                    }
                  >
                    <Minus size={15} />
                  </button>

                  <span>
                    {seats}
                  </span>

                  <button
                    type="button"
                    onClick={increaseSeats}
                    disabled={
                      loading ||
                      seats >= availableSeats
                    }
                  >
                    <Plus size={15} />
                  </button>

                </div>

              </div>

              {/* TOTAL */}

              <div className="booking-total-row">

                <span>
                  Total
                </span>

                <strong>
                  Rs. {total.toLocaleString()}
                </strong>

              </div>

              {/* CONFIRM */}

              <button
                type="button"
                className="confirm-booking-button"
                onClick={onConfirm}
                disabled={
                  loading ||
                  seats <= 0 ||
                  seats > availableSeats
                }
              >

                {loading ? (

                  <>
                    <Loader2
                      size={17}
                      className="booking-spinner"
                    />

                    Processing...
                  </>

                ) : (

                  <>
                    <Ticket size={17} />

                    Confirm booking
                  </>

                )}

              </button>

            </>

          )}

          {/* CANCEL */}

          <button
            type="button"
            className="cancel-booking-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default BookingModal;