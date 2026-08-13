import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  Printer,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";


const Receipt = () => {

  const location = useLocation();


  // =====================================================
  // DATA FROM MY BOOKINGS
  // =====================================================

  const receipt =
    location.state?.receipt;

  const booking =
    location.state?.booking;

  const paymentMethod =
    location.state?.paymentMethod ||
    receipt?.paymentMethod ||
    receipt?.payment_method ||
    "CASH";


  // =====================================================
  // NO DATA
  // =====================================================

  if (!booking && !receipt) {

    return (
      <main className="receipt-page">

        <div className="receipt-empty">

          <div className="receipt-empty-icon">
            <Ticket size={28} />
          </div>

          <h1>
            Receipt not found
          </h1>

          <p>
            This receipt is no longer available
            in the current session.
          </p>

          <Link to="/">
            Browse events
          </Link>

        </div>

      </main>
    );
  }


  // =====================================================
  // EVENT
  // =====================================================

  const event =
    booking?.event;


  // =====================================================
  // BOOKING ID
  // =====================================================

  const bookingId =
    booking?.id ||
    receipt?.booking?.id ||
    receipt?.bookingId ||
    "--";


  // =====================================================
  // EVENT NAME
  // =====================================================

  const eventName =
    event?.eventName ||
    event?.event_name ||
    event?.title ||
    "Event";


  // =====================================================
  // EVENT MODE
  // =====================================================

  const eventMode =
    event?.event_mode?.eventType ||
    event?.event_mode?.event_type ||
    event?.eventType ||
    event?.event_type ||
    "--";


  // =====================================================
  // EVENT DATE/TIME
  // Backend format:
  //
  // 30-08-2026 10-00 pm
  // =====================================================

  const eventAt =
    event?.eventAt ||
    event?.event_at ||
    null;


  // =====================================================
  // QUANTITY
  // =====================================================

  const seatQuantity =
    Number(
      booking?.seatQuantity ??
      booking?.seat_quantity ??
      booking?.quantity ??
      0
    );


  // =====================================================
  // TICKET PRICE
  // =====================================================

  const ticketPrice =
    Number(
      event?.ticket_price ??
      event?.ticketPrice ??
      event?.price ??
      0
    );


  // =====================================================
  // TOTAL
  // =====================================================

  const total =
    ticketPrice * seatQuantity;


  // =====================================================
  // FORMAT EVENT DATE
  //
  // Input:
  // 30-08-2026 10-00 pm
  //
  // Output:
  // Sunday, August 30, 2026
  // =====================================================

  const formatDate = (value) => {

    if (!value) {
      return "--";
    }


    try {

      const match =
        String(value).match(
          /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2})-(\d{2})\s*(am|pm)$/i
        );


      if (!match) {
        return "--";
      }


      const day =
        Number(match[1]);

      const month =
        Number(match[2]);

      const year =
        Number(match[3]);


      const date =
        new Date(
          year,
          month - 1,
          day
        );


      if (
        isNaN(
          date.getTime()
        )
      ) {
        return "--";
      }


      return date.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      );

    } catch (error) {

      console.error(
        "Date formatting error:",
        error
      );

      return "--";
    }
  };


  // =====================================================
  // FORMAT EVENT TIME
  //
  // Input:
  // 30-08-2026 10-00 pm
  //
  // Output:
  // 10:00 PM
  // =====================================================

  const formatTime = (value) => {

    if (!value) {
      return "--";
    }


    try {

      const match =
        String(value).match(
          /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2})-(\d{2})\s*(am|pm)$/i
        );


      if (!match) {
        return "--";
      }


      let hour =
        Number(match[4]);

      const minute =
        Number(match[5]);

      const period =
        match[6].toLowerCase();


      if (
        hour < 1 ||
        hour > 12 ||
        minute < 0 ||
        minute > 59
      ) {
        return "--";
      }


      if (period === "pm" && hour !== 12) {
        hour += 12;
      }


      if (period === "am" && hour === 12) {
        hour = 0;
      }


      const formattedHour =
        hour % 12 === 0
          ? 12
          : hour % 12;


      const formattedMinute =
        String(minute).padStart(2, "0");


      return `${formattedHour}:${formattedMinute} ${
        period.toUpperCase()
      }`;

    } catch (error) {

      console.error(
        "Time formatting error:",
        error
      );

      return "--";
    }
  };


  // =====================================================
  // PAYMENT METHOD
  // =====================================================

  const getPaymentName = (method) => {

    switch (
      String(method || "").toUpperCase()
    ) {

      case "JAZZCASH":
        return "JazzCash";

      case "EASYPAISA":
        return "EasyPaisa";

      case "BANK_TRANSFER":
        return "Bank Transfer";

      case "CARD":
        return "Card";

      case "CASH":
        return "Cash";

      default:
        return method || "Cash";
    }
  };


  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = () => {

    window.print();

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <main className="receipt-page">


      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="receipt-topbar">

        <Link
          to="/my-bookings"
          className="receipt-back"
        >

          <ArrowLeft size={16} />

          <span>
            My bookings
          </span>

        </Link>


        <button
          type="button"
          className="print-button"
          onClick={handlePrint}
        >

          <Printer size={15} />

          <span>
            Print receipt
          </span>

        </button>

      </div>



      {/* =================================================
          RECEIPT CONTAINER
      ================================================= */}

      <section className="receipt-container">


        {/* =================================================
            SUCCESS
        ================================================= */}

        <div className="receipt-success">

          <div className="success-icon">

            <CheckCircle2 size={28} />

          </div>


          <span>
            BOOKING CONFIRMED
          </span>


          <h1>
            You're all set!
          </h1>


          <p>
            Your ticket has been successfully
            reserved.
          </p>

        </div>



        {/* =================================================
            TICKET
        ================================================= */}

        <div className="ticket-receipt">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="ticket-header">

            <div className="ticket-brand">

              <span>
                FLASH
              </span>

              <strong>
                TICKET
              </strong>

            </div>


            <div className="booking-number">

              <small>
                BOOKING
              </small>

              <strong>
                #{bookingId}
              </strong>

            </div>

          </div>



          {/* =================================================
              EVENT
          ================================================= */}

          <div className="ticket-event">

            <span className="ticket-label">
              EVENT
            </span>


            <h2>
              {eventName}
            </h2>


            {/* IMPORTANT:
                event_mode is an OBJECT
            */}

            <span className="ticket-mode">

              {eventMode}

            </span>

          </div>



          {/* =================================================
              EVENT INFORMATION
          ================================================= */}

          <div className="ticket-info-grid">


            {/* DATE */}

            <div className="ticket-info">

              <CalendarDays size={17} />

              <div>

                <span>
                  Date
                </span>

                <strong>

                  {formatDate(
                    eventAt
                  )}

                </strong>

              </div>

            </div>



            {/* TIME */}

            <div className="ticket-info">

              <Clock3 size={17} />

              <div>

                <span>
                  Time
                </span>

                <strong>

                  {formatTime(
                    eventAt
                  )}

                </strong>

              </div>

            </div>



            {/* MODE */}

            <div className="ticket-info">

              <MapPin size={17} />

              <div>

                <span>
                  Mode
                </span>

                <strong>

                  {eventMode}

                </strong>

              </div>

            </div>



            {/* TICKETS */}

            <div className="ticket-info">

              <Ticket size={17} />

              <div>

                <span>
                  Tickets
                </span>

                <strong>

                  {seatQuantity}

                </strong>

              </div>

            </div>

          </div>



          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="ticket-divider">

            <span />
            <span />
            <span />
            <span />
            <span />

          </div>



          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="ticket-payment">


            {/* PAYMENT METHOD */}

            <div>

              <span>
                Payment method
              </span>

              <strong>

                <CreditCard size={14} />

                {getPaymentName(
                  paymentMethod
                )}

              </strong>

            </div>



            {/* TICKET PRICE */}

            <div>

              <span>
                Ticket price
              </span>

              <strong>

                Rs.{" "}

                {ticketPrice.toLocaleString()}

              </strong>

            </div>



            {/* QUANTITY */}

            <div>

              <span>
                Quantity
              </span>

              <strong>

                × {seatQuantity}

              </strong>

            </div>

          </div>



          {/* =================================================
              TOTAL
          ================================================= */}

          <div className="ticket-total">

            <span>
              Total paid
            </span>

            <strong>

              Rs.{" "}

              {total.toLocaleString()}

            </strong>

          </div>



          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="ticket-footer">

            <div className="barcode">

              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />

            </div>


            <small>

              Booking ID: {bookingId}

            </small>

          </div>

        </div>



        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="receipt-actions">


          <Link
            to="/my-bookings"
            className="receipt-primary"
          >

            View my bookings

          </Link>


          <Link
            to="/"
            className="receipt-secondary"
          >

            Browse more events

          </Link>

        </div>

      </section>

    </main>
  );
};


export default Receipt;