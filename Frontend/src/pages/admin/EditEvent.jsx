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
  Loader2,
  Save,
  Ticket,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  getAdminEvent,
  updateEvent,
} from "../../api/adminApi";

import {
  getImageUrl,
} from "../../utils/imageUrl";


const EditEvent = () => {

  const {
    eventId,
  } = useParams();

  const navigate =
    useNavigate();


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  const [formData, setFormData] =
    useState({

      event_name: "",

      event_mode: "CONCERT",

      total_Seats: "",

      Price: "",

      localDateTime: "",

      imageUrl: "",

    });


  /*
   * Load event
   */

  useEffect(() => {

    const loadEvent =
      async () => {

        try {

          setLoading(true);


          const data =
            await getAdminEvent(
              eventId
            );


          /*
           * Backend returns:
           *
           * {
           *   event: {...},
           *   response: "..."
           * }
           */

          const event =
            data?.event ||
            data;


          setFormData({

            event_name:
              event?.event_name ||
              "",

            event_mode:
              event?.event_mode ||
              "CONCERT",

            total_Seats:
              event?.total_Seats ??
              "",

            Price:
              event?.price ??
              event?.Price ??
              "",

            localDateTime:
              event?.localDateTime
                ? formatDateTimeLocal(
                    event.localDateTime
                  )
                : "",

            imageUrl:
              event?.imageUrl ||
              "",

          });


        } catch (error) {

          console.error(
            error
          );


          toast.error(
            "Unable to load event"
          );


          navigate(
            "/admin/events"
          );


        } finally {

          setLoading(false);

        }

      };


    loadEvent();

  }, [
    eventId,
    navigate,
  ]);


  /*
   * Convert backend datetime
   * to datetime-local value.
   */

  function formatDateTimeLocal(
    value
  ) {

    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "";

    }


    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    const hours =
      String(
        date.getHours()
      ).padStart(
        2,
        "0"
      );


    const minutes =
      String(
        date.getMinutes()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}T${hours}:${minutes}`;

  }


  /*
   * Handle input
   */

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;


      setFormData(
        (previous) => ({

          ...previous,

          [name]:
            value,

        })
      );

    };


  /*
   * Update event
   */

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      if (
        !formData.event_name.trim()
      ) {

        toast.error(
          "Event name is required"
        );

        return;

      }


      if (
        !formData.total_Seats ||
        Number(
          formData.total_Seats
        ) <= 0
      ) {

        toast.error(
          "Enter a valid number of seats"
        );

        return;

      }


      if (
        formData.Price === "" ||
        Number(
          formData.Price
        ) < 0
      ) {

        toast.error(
          "Enter a valid ticket price"
        );

        return;

      }


      if (
        !formData.localDateTime
      ) {

        toast.error(
          "Please select event date and time"
        );

        return;

      }


      try {

        setSaving(true);


        /*
         * Current backend accepts
         * Event as @RequestBody.
         *
         * Keep imageUrl as it is.
         */

        const updatedEvent = {

          event_name:
            formData.event_name.trim(),

          event_mode:
            formData.event_mode,

          total_Seats:
            Number(
              formData.total_Seats
            ),

          Price:
            Number(
              formData.Price
            ),

          localDateTime:
            formData.localDateTime,

          imageUrl:
            formData.imageUrl,

        };


        const result =
          await updateEvent(
            eventId,
            updatedEvent
          );


        toast.success(
          result?.response ||
          result?.Response ||
          "Event updated successfully"
        );


        navigate(
          "/admin/events"
        );


      } catch (error) {

        console.error(
          "Update event error:",
          error
        );


        const message =
          error.response?.data;


        toast.error(

          typeof message ===
          "string"

            ? message

            : message?.response
              ? message.response
              : "Unable to update event"

        );


      } finally {

        setSaving(false);

      }

    };


  /*
   * Loading
   */

  if (loading) {

    return (

      <div className="admin-dashboard-loading">

        <Loader2
          size={22}
          className="spin"
        />

        Loading event...

      </div>

    );

  }


  return (

    <main className="admin-add-event-page">

      <div className="admin-event-container">


        {/* HEADER */}

        <div className="admin-event-header">

          <div>

            <button
              type="button"
              className="admin-back-button"
              onClick={() =>
                navigate(
                  "/admin/events"
                )
              }
            >

              <ArrowLeft
                size={15}
              />

              Back to events

            </button>


            <div className="admin-page-eyebrow">

              <Ticket
                size={13}
              />

              EVENT MANAGEMENT

            </div>


            <h1>
              Edit event
            </h1>


            <p>
              Update your event
              information.
            </p>

          </div>

        </div>


        <form
          className="admin-event-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* LEFT */}

          <div className="admin-event-form-left">


            {/* EVENT INFORMATION */}

            <section className="admin-form-section">

              <div className="admin-form-section-heading">

                <div>

                  <span>
                    01
                  </span>

                  <h2>
                    Event information
                  </h2>

                </div>

              </div>


              {/* NAME */}

              <div className="admin-form-field">

                <label htmlFor="event_name">

                  Event name

                  <span>
                    *
                  </span>

                </label>


                <input
                  id="event_name"
                  name="event_name"
                  type="text"
                  value={
                    formData.event_name
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={120}
                />

              </div>


              {/* MODE */}

              <div className="admin-form-field">

                <label>

                  Event type

                  <span>
                    *
                  </span>

                </label>


                <div className="event-mode-grid">

                  {[
                    "CONCERT",
                    "CINEMA",
                    "SHOW",
                  ].map(
                    (mode) => (

                      <button
                        key={mode}
                        type="button"
                        className={
                          `event-mode-option ${
                            formData.event_mode ===
                            mode
                              ? "selected"
                              : ""
                          }`
                        }
                        onClick={() =>
                          setFormData(
                            (previous) => ({
                              ...previous,
                              event_mode:
                                mode,
                            })
                          )
                        }
                      >

                        <span>
                          {mode}
                        </span>


                        {formData.event_mode ===
                          mode && (

                          <span className="event-mode-check">
                            ✓
                          </span>

                        )}

                      </button>

                    )
                  )}

                </div>

              </div>

            </section>


            {/* CAPACITY */}

            <section className="admin-form-section">

              <div className="admin-form-section-heading">

                <div>

                  <span>
                    02
                  </span>

                  <h2>
                    Capacity & pricing
                  </h2>

                </div>

              </div>


              <div className="admin-form-two-columns">


                {/* SEATS */}

                <div className="admin-form-field">

                  <label htmlFor="total_Seats">

                    Total seats

                    <span>
                      *
                    </span>

                  </label>


                  <div className="admin-input-with-icon">

                    <Ticket
                      size={16}
                    />

                    <input
                      id="total_Seats"
                      name="total_Seats"
                      type="number"
                      min="1"
                      value={
                        formData.total_Seats
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>


                {/* PRICE */}

                <div className="admin-form-field">

                  <label htmlFor="Price">

                    Ticket price

                    <span>
                      *
                    </span>

                  </label>


                  <div className="admin-input-with-prefix">

                    <span>
                      Rs.
                    </span>

                    <input
                      id="Price"
                      name="Price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.Price
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

              </div>

            </section>


            {/* SCHEDULE */}

            <section className="admin-form-section">

              <div className="admin-form-section-heading">

                <div>

                  <span>
                    03
                  </span>

                  <h2>
                    Schedule
                  </h2>

                </div>

              </div>


              <div className="admin-form-field">

                <label htmlFor="localDateTime">

                  Event date & time

                  <span>
                    *
                  </span>

                </label>


                <div className="admin-input-with-icon">

                  <CalendarDays
                    size={16}
                  />

                  <input
                    id="localDateTime"
                    name="localDateTime"
                    type="datetime-local"
                    value={
                      formData.localDateTime
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>


                <small>

                  Change the date or
                  starting time.

                </small>

              </div>

            </section>


          </div>


          {/* RIGHT */}

          <div className="admin-event-form-right">


            {/* CURRENT IMAGE */}

            <section className="admin-form-section image-section">

              <div className="admin-form-section-heading">

                <div>

                  <span>
                    04
                  </span>

                  <h2>
                    Event artwork
                  </h2>

                </div>

              </div>


              {formData.imageUrl ? (

                <div className="event-image-preview">

                  <img
                    src={
                      getImageUrl(
                        formData.imageUrl
                      )
                    }
                    alt={
                      formData.event_name
                    }
                  />


                  <div className="event-image-overlay">

                    <div>

                      <strong>
                        Current image
                      </strong>

                      <span>
                        Image will remain
                        unchanged
                      </span>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="event-image-no-preview">

                  <Ticket
                    size={25}
                  />

                  <span>
                    No event image
                  </span>

                </div>

              )}


              <p className="admin-image-note">

                The current backend update
                endpoint does not accept a
                new image. The existing image
                will be kept.

              </p>

            </section>


            {/* PREVIEW */}

            <section className="admin-event-preview-card">

              <span>
                EVENT PREVIEW
              </span>


              <h3>

                {formData.event_name ||
                  "Your event name"}

              </h3>


              <div className="admin-preview-meta">

                <div>

                  <Ticket
                    size={13}
                  />

                  {formData.event_mode}

                </div>


                <div>

                  <CalendarDays
                    size={13}
                  />

                  {formData.localDateTime
                    ? new Date(
                        formData.localDateTime
                      ).toLocaleDateString(
                        "en-PK",
                        {
                          day:
                            "numeric",
                          month:
                            "short",
                          year:
                            "numeric",
                        }
                      )
                    : "Date"}

                </div>


                <div>

                  <Clock3
                    size={13}
                  />

                  {formData.localDateTime
                    ? new Date(
                        formData.localDateTime
                      ).toLocaleTimeString(
                        "en-PK",
                        {
                          hour:
                            "numeric",
                          minute:
                            "2-digit",
                        }
                      )
                    : "Time"}

                </div>

              </div>


              <div className="admin-preview-bottom">

                <div>

                  <span>
                    Seats
                  </span>

                  <strong>
                    {
                      formData.total_Seats ||
                      "0"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Price
                  </span>

                  <strong>

                    Rs.{" "}

                    {Number(
                      formData.Price ||
                      0
                    ).toLocaleString()}

                  </strong>

                </div>

              </div>

            </section>


            {/* ACTIONS */}

            <div className="admin-event-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={() =>
                  navigate(
                    "/admin/events"
                  )
                }
                disabled={saving}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="admin-create-button"
                disabled={saving}
              >

                {saving ? (

                  <>

                    <Loader2
                      size={15}
                      className="spin"
                    />

                    Saving...

                  </>

                ) : (

                  <>

                    <Save
                      size={15}
                    />

                    Save changes

                  </>

                )}

              </button>

            </div>

          </div>


        </form>

      </div>

    </main>

  );

};


export default EditEvent;