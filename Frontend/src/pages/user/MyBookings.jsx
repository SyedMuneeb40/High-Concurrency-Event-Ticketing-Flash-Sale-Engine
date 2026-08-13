import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Ticket,
  Tag,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { getMyBookings } from "../../api/bookingApi";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await getMyBookings();

      const data = response?.data ?? response;

      console.log("BOOKINGS API RESPONSE:", data);

      let bookingData = [];

      /*
        Backend response:

        BookingResponse {
            Booking booking;
            String Response;
        }

        Actual booking:

        data.booking
      */

      if (Array.isArray(data)) {
        bookingData = data;
      } else if (Array.isArray(data?.content)) {
        bookingData = data.content;
      } else if (Array.isArray(data?.data)) {
        bookingData = data.data;
      } else if (data?.booking) {
        bookingData = [data];
      }

      /*
        BookingResponse -> Booking
      */

      const mappedBookings = bookingData
        .map((item) => item?.booking ?? item)
        .filter(Boolean);

      console.log(
        "MAPPED BOOKINGS:",
        mappedBookings
      );

      setBookings(mappedBookings);

    } catch (error) {
      console.error(
        "Failed to load bookings:",
        error
      );

      toast.error(
        "Failed to load your bookings"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadBookings();
  }, []);


  // =====================================================
  // GET EVENT DATE
  // =====================================================

  const getEventDate = (booking) => {
    return booking?.event?.eventAt ?? null;
  };


  // =====================================================
  // PARSE EVENT DATE
  //
  // Backend format:
  //
  // 30-08-2026 10-00 pm
  //
  // DD-MM-YYYY HH-MM am/pm
  // =====================================================

  const parseEventDate = (value) => {
    if (!value) {
      return null;
    }

    const text = String(value).trim();

    /*
      Match:

      30-08-2026 10-00 pm

      Groups:

      1 = day
      2 = month
      3 = year
      4 = hour
      5 = minute
      6 = am/pm
    */

    const match = text.match(
      /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2})-(\d{2})\s+(am|pm)$/i
    );

    if (!match) {
      console.error(
        "Invalid eventAt format:",
        value
      );

      return null;
    }

    const [
      ,
      day,
      month,
      year,
      hourString,
      minuteString,
      period,
    ] = match;

    let hour = Number(hourString);

    const minute = Number(minuteString);

    const amPm = period.toLowerCase();


    // =============================================
    // 12 HOUR -> 24 HOUR
    // =============================================

    if (amPm === "pm" && hour !== 12) {
      hour += 12;
    }

    if (amPm === "am" && hour === 12) {
      hour = 0;
    }


    // =============================================
    // CREATE DATE
    // =============================================

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      hour,
      minute
    );


    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
  };


  // =====================================================
  // FORMAT EVENT DATE
  // =====================================================

  const formatDate = (value) => {
    const date = parseEventDate(value);

    if (!date) {
      return "--";
    }

    return date.toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =====================================================
  // FORMAT EVENT TIME
  // =====================================================

  const formatTime = (value) => {
    const date = parseEventDate(value);

    if (!date) {
      return "--";
    }

    return date.toLocaleTimeString(
      "en-PK",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };


  // =====================================================
  // EVENT NAME
  // =====================================================

  const getEventName = (booking) => {
    return (
      booking?.event?.eventName ||
      "Event"
    );
  };


  // =====================================================
  // EVENT TYPE
  // =====================================================

  const getEventType = (booking) => {
    return (
      booking?.event?.event_mode?.eventType ||
      "Event"
    );
  };


  // =====================================================
  // TICKET PRICE
  // =====================================================

  const getTicketPrice = (booking) => {
    return Number(
      booking?.event?.ticket_price ?? 0
    );
  };


  // =====================================================
  // TICKET QUANTITY
  // =====================================================

  const getQuantity = (booking) => {
    return Number(
      booking?.seatQuantity ?? 0
    );
  };


  // =====================================================
  // TOTAL
  // =====================================================

  const getTotal = (booking) => {
    const price =
      getTicketPrice(booking);

    const quantity =
      getQuantity(booking);

    return price * quantity;
  };


  // =====================================================
  // BOOKING STATUS
  // =====================================================

  const getBookingStatus = (booking) => {
    return (
      booking?.bookingStatus ||
      "CONFIRMED"
    );
  };


  // =====================================================
  // OPEN RECEIPT
  // =====================================================

const openReceipt = (booking) => {
  navigate(`/receipt/${booking.id}`, {
    state: {
      booking: booking,
      paymentMethod:
        booking?.paymentMethod ??
        booking?.payment_method ??
        "CASH",
    },
  });
};


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="my-bookings-page">

      <div className="my-bookings-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="my-bookings-header">

          <div>

            <span className="section-label">
              YOUR TICKETS
            </span>

            <h1>
              My bookings
            </h1>

            <p>
              View all your booked events.
            </p>

          </div>


          <Link
            to="/"
            className="browse-events-button"
          >
            Browse events
          </Link>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="bookings-loading">
            Loading bookings...
          </div>

        ) : bookings.length === 0 ? (

          /* =================================================
             NO BOOKINGS
          ================================================= */

          <div className="no-bookings">

            <Ticket size={35} />

            <h2>
              No bookings yet
            </h2>

            <p>
              You haven't booked any events yet.
            </p>

            <Link to="/">
              Browse events
            </Link>

          </div>

        ) : (

          /* =================================================
             BOOKINGS LIST
          ================================================= */

          <div className="bookings-list">

            {bookings.map((booking) => {

              const eventDate =
                getEventDate(booking);

              const eventName =
                getEventName(booking);

              const eventType =
                getEventType(booking);

              const quantity =
                getQuantity(booking);

              const ticketPrice =
                getTicketPrice(booking);

              const total =
                getTotal(booking);

              const status =
                getBookingStatus(booking);


              return (

                <article
                  className="booking-card"
                  key={booking.id}
                >

                  {/* =================================================
                      CARD CONTENT
                  ================================================= */}

                  <div className="booking-card-content">

                    <div className="booking-card-main">

                      {/* ===============================
                          STATUS
                      =============================== */}

                      <span
                        className={`booking-status ${String(
                          status
                        ).toLowerCase()}`}
                      >

                        <CheckCircle2
                          size={13}
                        />

                        {status}

                      </span>


                      {/* ===============================
                          EVENT NAME
                      =============================== */}

                      <h2 className="booking-card-title">
                        {eventName}
                      </h2>


                      {/* ===============================
                          EVENT TYPE
                      =============================== */}

                      <div className="booking-event-type">

                        <Tag size={15} />

                        <span>
                          {eventType}
                        </span>

                      </div>


                      {/* ===============================
                          EVENT INFORMATION
                      =============================== */}

                      <div className="booking-card-meta">

                        {/* DATE */}

                        <div className="booking-meta-item">

                          <CalendarDays
                            size={16}
                          />

                          <div>

                            <small>
                              Event date
                            </small>

                            <strong>
                              {formatDate(
                                eventDate
                              )}
                            </strong>

                          </div>

                        </div>


                        {/* TIME */}

                        <div className="booking-meta-item">

                          <Clock3
                            size={16}
                          />

                          <div>

                            <small>
                              Event time
                            </small>

                            <strong>
                              {formatTime(
                                eventDate
                              )}
                            </strong>

                          </div>

                        </div>


                        {/* TICKETS */}

                        <div className="booking-meta-item">

                          <Ticket
                            size={16}
                          />

                          <div>

                            <small>
                              Tickets
                            </small>

                            <strong>
                              {quantity} ticket
                              {quantity !== 1
                                ? "s"
                                : ""}
                            </strong>

                          </div>

                        </div>

                      </div>

                    </div>


                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <div className="booking-card-total">

                      <span>
                        Total
                      </span>

                      <strong>
                        Rs.{" "}
                        {total.toLocaleString()}
                      </strong>

                      <small>
                        Rs.{" "}
                        {ticketPrice.toLocaleString()}
                        {" "}per ticket
                      </small>

                    </div>

                  </div>


                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <div className="booking-card-footer">

                    {/* BOOKING ID */}

                    <div className="booking-id">

                      <Hash size={14} />

                      <span>
                        Booking #{booking.id}
                      </span>

                    </div>


                    {/* RECEIPT */}

                    <button
                        type="button"
                        className="view-receipt-button"
                        onClick={() => openReceipt(booking)}
                      >
                        View receipt
                    </button>

                  </div>

                </article>

              );
            })}

          </div>

        )}

      </div>

    </main>
  );
};

export default MyBookings;