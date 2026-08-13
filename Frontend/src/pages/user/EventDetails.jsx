import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Ticket,
  Minus,
  Plus,
  MapPin,
  Loader2,
  Check,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  getEvent,
} from "../../api/eventApi";

import {
  createBooking,
} from "../../api/bookingApi";

import {
  getImageUrl,
} from "../../utils/imageUrl";


const EventDetails = () => {

  const {
    eventId,
  } = useParams();

  const navigate =
    useNavigate();


  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [booking, setBooking] =
    useState(false);

  const [seats, setSeats] =
    useState(1);


  const loadEvent =
    async () => {

      try {

        setLoading(true);

        const data =
          await getEvent(
            eventId
          );

        /*
         * EventResponse:
         *
         * {
         *   event: {...},
         *   response: "..."
         * }
         */

        setEvent(
          data?.event || data
        );

      } catch (error) {

        console.error(error);

        toast.error(
          "Unable to load event"
        );

        navigate("/");

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    loadEvent();

  }, [eventId]);


  const increaseSeats = () => {

    const maxSeats =
      Number(
        event?.total_Seats || 1
      );


    if (
      seats < maxSeats
    ) {

      setSeats(
        seats + 1
      );

    }

  };


  const decreaseSeats = () => {

    if (seats > 1) {

      setSeats(
        seats - 1
      );

    }

  };


  const handleBooking =
    async () => {

      try {

        setBooking(true);


        const result =
          await createBooking(
            Number(eventId),
            seats
          );


        toast.success(
          result?.response ||
          result?.Response ||
          "Booking successful"
        );


        /*
         * BookingResponse contains:
         *
         * booking
         * response
         *
         * We send user to
         * My Bookings.
         */

        navigate(
          "/my-bookings"
        );


      } catch (error) {

        console.error(error);

        const message =
          error.response?.data;

        toast.error(
          typeof message === "string"
            ? message
            : "Booking failed"
        );

      } finally {

        setBooking(false);

      }

    };


  if (loading) {

    return (

      <div className="details-loading">

        <Loader2
          size={23}
          className="spin"
        />

        Loading event...

      </div>

    );

  }


  if (!event) {

    return null;

  }


  const date =
    event.localDateTime
      ? new Date(
          event.localDateTime
        )
      : null;


  const price =
    Number(
      event.price || 0
    );


  const total =
    price * seats;


  return (

    <main className="event-details-page">

      <div className="details-container">


        {/* BACK */}

        <button
          className="back-button"
          onClick={() =>
            navigate(-1)
          }
        >

          <ArrowLeft
            size={15}
          />

          Back to events

        </button>


        {/* MAIN */}

        <section className="details-layout">


          {/* IMAGE */}

          <div className="details-image">

            {event.imageUrl ? (

              <img
                src={
                  getImageUrl(
                    event.imageUrl
                  )
                }
                alt={
                  event.event_name
                }
              />

            ) : (

              <div className="details-no-image">

                <Ticket size={50} />

              </div>

            )}


            <span className="details-mode">

              {event.event_mode}

            </span>

          </div>


          {/* CONTENT */}

          <div className="details-content">

            <span className="details-label">
              {event.event_mode}
            </span>


            <h1>
              {event.event_name}
            </h1>


            <p className="details-description">

              Get your tickets and
              experience this event
              live. Choose your seats
              and complete your booking
              in seconds.

            </p>


            {/* INFO */}

            <div className="details-info-grid">

              <div className="details-info">

                <div className="details-info-icon">

                  <CalendarDays
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    DATE
                  </span>

                  <strong>
                    {date
                      ? date.toLocaleDateString(
                          "en-PK",
                          {
                            day:
                              "numeric",
                            month:
                              "long",
                            year:
                              "numeric",
                          }
                        )
                      : "--"}
                  </strong>

                </div>

              </div>


              <div className="details-info">

                <div className="details-info-icon">

                  <Clock3
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    TIME
                  </span>

                  <strong>
                    {date
                      ? date.toLocaleTimeString(
                          "en-PK",
                          {
                            hour:
                              "numeric",
                            minute:
                              "2-digit",
                          }
                        )
                      : "--"}
                  </strong>

                </div>

              </div>


              <div className="details-info">

                <div className="details-info-icon">

                  <Ticket
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    SEATS
                  </span>

                  <strong>
                    {event.total_Seats}
                    {" "}available
                  </strong>

                </div>

              </div>


              <div className="details-info">

                <div className="details-info-icon">

                  <MapPin
                    size={16}
                  />

                </div>

                <div>

                  <span>
                    TYPE
                  </span>

                  <strong>
                    {event.event_mode}
                  </strong>

                </div>

              </div>

            </div>


            {/* BOOKING CARD */}

            <div className="booking-box">

              <div className="booking-price">

                <span>
                  PRICE PER TICKET
                </span>

                <strong>
                  Rs.{" "}
                  {price.toLocaleString()}
                </strong>

              </div>


              <div className="booking-divider" />


              <div className="seat-row">

                <div>

                  <span>
                    Tickets
                  </span>

                  <small>
                    Select quantity
                  </small>

                </div>


                <div className="quantity-control">

                  <button
                    onClick={
                      decreaseSeats
                    }
                    disabled={
                      seats <= 1
                    }
                  >

                    <Minus size={14} />

                  </button>


                  <strong>
                    {seats}
                  </strong>


                  <button
                    onClick={
                      increaseSeats
                    }
                    disabled={
                      seats >=
                      Number(
                        event.total_Seats
                      )
                    }
                  >

                    <Plus size={14} />

                  </button>

                </div>

              </div>


              <div className="booking-total">

                <span>
                  Total
                </span>

                <strong>
                  Rs.{" "}
                  {total.toLocaleString()}
                </strong>

              </div>


              <button
                className="book-button"
                onClick={
                  handleBooking
                }
                disabled={booking}
              >

                {booking ? (

                  <>
                    <Loader2
                      size={15}
                      className="spin"
                    />

                    Booking...

                  </>

                ) : (

                  <>
                    <Check
                      size={15}
                    />

                    Book {seats}{" "}
                    {seats === 1
                      ? "ticket"
                      : "tickets"}

                  </>

                )}

              </button>

            </div>

          </div>

        </section>

      </div>

    </main>

  );
};


export default EventDetails;