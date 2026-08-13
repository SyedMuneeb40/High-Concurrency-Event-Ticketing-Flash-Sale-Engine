import { useEffect, useState } from "react";
import { Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";

import { getAdminEvents } from "../../api/adminApi";
import { createBooking } from "../../api/bookingApi";

import EventCard, {
  getAvailableSeats,
  getEventDateTime,
} from "../../components/EventCard";

import BookingModal from "../../components/BookingModal";

import "../../components/EventCard.css";
import "../../components/BookingModal.css";

// ============================================================
// CHECK ADMIN ROLE
// ============================================================

const checkAdmin = () => {
  // ----------------------------------------------------------
  // Check localStorage role
  // ----------------------------------------------------------

  const roleValues = [
    localStorage.getItem("role"),
    localStorage.getItem("userRole"),
    localStorage.getItem("user_role"),
    localStorage.getItem("userType"),
  ];

  const localAdmin = roleValues.some((role) => {
    if (!role) {
      return false;
    }

    return (
      String(role)
        .toUpperCase()
        .replace("ROLE_", "")
        .trim() === "ADMIN"
    );
  });

  if (localAdmin) {
    return true;
  }

  // ----------------------------------------------------------
  // Check JWT
  // ----------------------------------------------------------

  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt_token") ||
    localStorage.getItem("jwtToken");

  if (!token) {
    return false;
  }

  try {
    const cleanToken = token.replace(/^Bearer\s+/i, "");

    const parts = cleanToken.split(".");

    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(
      atob(
        parts[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    const roles = [];

    if (payload.role) {
      roles.push(payload.role);
    }

    if (payload.roles) {
      if (Array.isArray(payload.roles)) {
        roles.push(...payload.roles);
      } else {
        roles.push(payload.roles);
      }
    }

    if (payload.authorities) {
      if (Array.isArray(payload.authorities)) {
        roles.push(...payload.authorities);
      } else {
        roles.push(payload.authorities);
      }
    }

    return roles.some((role) => {
      if (!role) {
        return false;
      }

      return (
        String(role)
          .toUpperCase()
          .replace("ROLE_", "")
          .trim() === "ADMIN"
      );
    });
  } catch (error) {
    console.error("Admin role check error:", error);

    return false;
  }
};

// ============================================================
// HOME
// ============================================================

function Home() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [seats, setSeats] = useState(1);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  // ==========================================================
  // ADMIN
  // ==========================================================

  const isAdmin = checkAdmin();

  // ==========================================================
  // LOAD EVENTS
  // ==========================================================

  const loadEvents = async () => {
    try {
      setLoading(true);

      const response = await getAdminEvents();

      console.log("EVENTS RESPONSE:", response);

      const allEvents = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
        ? response.data
        : [];

      // ------------------------------------------------------
      // Only upcoming events
      // ------------------------------------------------------

      const upcomingEvents = allEvents.filter(
        (event) => {
          const eventDate =
            getEventDateTime(event);

          // If date is invalid,
          // keep the event visible.
          if (!eventDate) {
            return true;
          }

          return (
            eventDate.getTime() >
            Date.now()
          );
        }
      );

      console.log(
        "UPCOMING EVENTS:",
        upcomingEvents
      );

      setEvents(upcomingEvents);
    } catch (error) {
      console.error(
        "Events loading error:",
        error
      );

      const data =
        error?.response?.data;

      let message =
        "Unable to load events";

      if (typeof data === "string") {
        message = data;
      } else if (data?.message) {
        message = data.message;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadEvents();
  }, []);

  // ==========================================================
  // OPEN BOOKING MODAL
  // ==========================================================

  const handleBook = (event) => {
    console.log(
      "BOOK NOW CLICKED:",
      event
    );

    // --------------------------------------------------------
    // Admin cannot book
    // --------------------------------------------------------

    if (isAdmin) {
      return;
    }

    // --------------------------------------------------------
    // Login check
    // --------------------------------------------------------

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("jwt_token") ||
      localStorage.getItem("jwtToken");

    if (!token) {
      toast.error(
        "Please login first"
      );

      window.location.href =
        "/login";

      return;
    }

    // --------------------------------------------------------
    // Available seats
    // --------------------------------------------------------

    const availableSeats =
      getAvailableSeats(event);

    console.log(
      "AVAILABLE SEATS:",
      availableSeats
    );

    if (availableSeats <= 0) {
      toast.error(
        "All seats are already booked"
      );

      return;
    }

    // --------------------------------------------------------
    // Open modal
    // --------------------------------------------------------

    setSelectedEvent(event);

    setSeats(1);
  };

  // ==========================================================
  // CLOSE BOOKING MODAL
  // ==========================================================

  const handleCloseModal = () => {
    if (bookingLoading) {
      return;
    }

    setSelectedEvent(null);

    setSeats(1);
  };

  // ==========================================================
  // CONFIRM BOOKING
  // ==========================================================

  const handleConfirmBooking =
    async () => {
      // ------------------------------------------------------
      // No event
      // ------------------------------------------------------

      if (!selectedEvent) {
        toast.error(
          "No event selected"
        );

        return;
      }

      // ------------------------------------------------------
      // Quantity validation
      // ------------------------------------------------------

      if (seats <= 0) {
        toast.error(
          "Please select at least 1 ticket"
        );

        return;
      }

      // ------------------------------------------------------
      // Available seats
      // ------------------------------------------------------

      const availableSeats =
        getAvailableSeats(
          selectedEvent
        );

      if (availableSeats <= 0) {
        toast.error(
          "All seats are already booked"
        );

        setSelectedEvent(null);

        return;
      }

      // ------------------------------------------------------
      // User cannot book more seats
      // ------------------------------------------------------

      if (seats > availableSeats) {
        toast.error(
          `Only ${availableSeats} seats are available`
        );

        setSeats(availableSeats);

        return;
      }

      // ------------------------------------------------------
      // CREATE BOOKING
      // ------------------------------------------------------

      try {
        setBookingLoading(true);

        console.log(
          "Creating booking:",
          {
            eventId:
              selectedEvent.id,
            seats,
          }
        );

        /*
         * Backend endpoint:
         *
         * POST /user/booking
         *
         * Body:
         * {
         *   eventId: selectedEvent.id,
         *   seats: seats
         * }
         */

        const response =
          await createBooking(
            selectedEvent.id,
            seats
          );

        console.log(
          "BOOKING SUCCESS:",
          response
        );

        toast.success(
          "Booking confirmed successfully!"
        );

        // ----------------------------------------------------
        // Close modal
        // ----------------------------------------------------

        setSelectedEvent(null);

        setSeats(1);

        // ----------------------------------------------------
        // Reload events
        // remaining seats update
        // ----------------------------------------------------

        await loadEvents();
      } catch (error) {
        console.error(
          "Booking error:",
          error
        );

        console.error(
          "Booking response:",
          error?.response
        );

        const data =
          error?.response?.data;

        let message =
          "Booking failed. Please try again.";

        if (typeof data === "string") {
          message = data;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.response) {
          message = data.response;
        } else if (data?.Response) {
          message = data.Response;
        }

        toast.error(message);
      } finally {
        setBookingLoading(false);
      }
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main className="home-page">

      {/* ======================================================
          HERO
         ====================================================== */}

      <section className="hero-section">

        <div className="home-container">

          <div className="hero-content">

            <span className="section-label">
              WHAT'S ON
            </span>

            <h1>
              Experience more.
              <br />

              <span>
                Book your moment.
              </span>
            </h1>

            <p>
              Discover concerts, cinema
              and shows happening around
              you. Book your tickets
              quickly and securely.
            </p>

            <a
              href="#events"
              className="hero-button"
            >
              Explore events

              <Ticket size={16} />
            </a>

          </div>

        </div>

      </section>


      {/* ======================================================
          EVENTS
         ====================================================== */}

      <section
        className="events-section"
        id="events"
      >

        <div className="home-container">

          {/* ==================================================
              HEADER
             ================================================== */}

          <div className="events-header">

            <div>

              <span className="section-label">
                WHAT'S ON
              </span>

              <h2>
                Upcoming events
              </h2>

              <p>
                Find something worth
                remembering.
              </p>

            </div>


            <div className="event-count">

              <strong>
                {events.length} 
              </strong>

              <span>
                Events
              </span>

            </div>

          </div>


          {/* ==================================================
              LOADING
             ================================================== */}

          {loading ? (

            <div className="events-loading">

              <Loader2
                size={22}
                className="spin"
              />

              Loading events...

            </div>

          ) : events.length === 0 ? (

            <div className="events-empty">

              <Ticket size={30} />

              <h3>
                No upcoming events
              </h3>

              <p>
                Check back soon for
                new events.
              </p>

            </div>

          ) : (

            <div className="events-grid">

              {events.map(
                (event) => (

                  <EventCard
                    key={event.id}
                    event={event}
                    onBook={handleBook}
                    isAdmin={isAdmin}
                  />

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* ======================================================
          BOOKING MODAL
         ====================================================== */}

      {!isAdmin &&
        selectedEvent && (

          <BookingModal
            event={selectedEvent}
            seats={seats}
            setSeats={setSeats}
            onClose={
              handleCloseModal
            }
            onConfirm={
              handleConfirmBooking
            }
            loading={
              bookingLoading
            }
          />

        )}

    </main>
  );
}

export default Home;