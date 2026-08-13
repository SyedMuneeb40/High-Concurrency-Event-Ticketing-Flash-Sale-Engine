
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  ImagePlus,
  Upload,
  X,
  Loader2,
  Ticket,
  Sparkles,
} from "lucide-react";

import {
  toast,
} from "sonner";

import {
  useNavigate,
} from "react-router-dom";

import {
  addEvent,
} from "../../api/adminApi";


const AddEvent = () => {

  const navigate =
    useNavigate();

  const fileInputRef =
    useRef(null);


  const [formData, setFormData] =
    useState({

      event_name: "",

      event_mode: "CONCERT",

      total_Seats: "",

      Price: "",

      localDateTime: "",

    });


  const [image, setImage] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /*
   * Cleanup image preview
   */

  useEffect(() => {

    return () => {

      if (imagePreview) {

        URL.revokeObjectURL(
          imagePreview
        );

      }

    };

  }, [imagePreview]);


  /*
   * Input change
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
          [name]: value,
        })
      );

    };


  /*
   * Image selection
   */

  const handleImageChange =
    (file) => {

      if (!file) {
        return;
      }


      /*
       * Only images
       */

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        toast.error(
          "Please select a valid image"
        );

        return;

      }


      /*
       * 5 MB limit
       */

      if (
        file.size >
        5 * 1024 * 1024
      ) {

        toast.error(
          "Image must be smaller than 5 MB"
        );

        return;

      }


      /*
       * Remove old preview
       */

      if (imagePreview) {

        URL.revokeObjectURL(
          imagePreview
        );

      }


      setImage(file);

      setImagePreview(
        URL.createObjectURL(
          file
        )
      );

    };


  /*
   * File input
   */

  const handleFileInput =
    (e) => {

      const file =
        e.target.files?.[0];

      handleImageChange(
        file
      );

    };


  /*
   * Remove image
   */

  const removeImage = () => {

    if (imagePreview) {

      URL.revokeObjectURL(
        imagePreview
      );

    }


    setImage(null);

    setImagePreview("");


    if (fileInputRef.current) {

      fileInputRef.current.value =
        "";

    }

  };


  /*
   * Submit
   */

  const handleSubmit =
    async (e) => {

      e.preventDefault();


      /*
       * Validation
       */

      if (
        !formData.event_name.trim()
      ) {

        toast.error(
          "Event name is required"
        );

        return;

      }


      if (
        !formData.event_mode
      ) {

        toast.error(
          "Please select event mode"
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
        !formData.Price ||
        Number(
          formData.Price
        ) < 0
      ) {

        toast.error(
          "Enter a valid price"
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


      if (!image) {

        toast.error(
          "Please select an event image"
        );

        return;

      }


      try {

        setLoading(true);


        /*
         * Convert numeric fields
         * before sending to backend.
         */

        const eventData = {

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

        };


        await addEvent(
          eventData,
          image
        );


        toast.success(
          "Event added successfully"
        );


        /*
         * Go back to event list
         */

        navigate(
          "/admin/events"
        );


      } catch (error) {

        console.error(
          "Add event error:",
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

              : "Unable to add event"

        );


      } finally {

        setLoading(false);

      }

    };


  return (

    <main className="admin-add-event-page">

      <div className="admin-event-container">


        {/* PAGE HEADER */}

        <div className="admin-event-header">

          <div>

            <div className="admin-page-eyebrow">

              <Sparkles
                size={13}
              />

              EVENT MANAGEMENT

            </div>


            <h1>
              Create event
            </h1>


            <p>
              Add a new experience to
              Flash Ticket.
            </p>

          </div>


          <div className="admin-event-header-icon">

            <Ticket
              size={22}
            />

          </div>

        </div>


        {/* FORM */}

        <form
          className="admin-event-form"
          onSubmit={
            handleSubmit
          }
        >


          {/* LEFT */}

          <div className="admin-event-form-left">


            {/* BASIC INFORMATION */}

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


              {/* EVENT NAME */}

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
                  placeholder="e.g. Coke Studio Live"
                  value={
                    formData.event_name
                  }
                  onChange={
                    handleChange
                  }
                  maxLength={120}
                />

              </div>


              {/* EVENT MODE */}

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


            {/* VENUE / CAPACITY */}

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
                      placeholder="500"
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
                      placeholder="2500"
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


            {/* DATE */}

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
                  Select when the event
                  starts.
                </small>

              </div>

            </section>


          </div>


          {/* RIGHT */}

          <div className="admin-event-form-right">


            {/* IMAGE */}

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


              {!imagePreview ? (

                <button
                  type="button"
                  className="event-image-upload"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >

                  <div className="event-image-upload-icon">

                    <ImagePlus
                      size={24}
                    />

                  </div>


                  <strong>
                    Upload event image
                  </strong>


                  <span>
                    PNG, JPG or WEBP
                  </span>


                  <small>
                    Maximum 5 MB
                  </small>


                  <div className="event-image-upload-action">

                    <Upload
                      size={14}
                    />

                    Choose image

                  </div>

                </button>

              ) : (

                <div className="event-image-preview">

                  <img
                    src={
                      imagePreview
                    }
                    alt="Event preview"
                  />


                  <div className="event-image-overlay">

                    <div>

                      <strong>
                        {image?.name}
                      </strong>

                      <span>
                        {image
                          ? (
                            image.size /
                            1024 /
                            1024
                          ).toFixed(2)
                          : "0"}{" "}
                        MB
                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                    >

                      <X
                        size={15}
                      />

                    </button>

                  </div>

                </div>

              )}


              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={
                  handleFileInput
                }
                hidden
              />

            </section>


            {/* PREVIEW SUMMARY */}

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
                disabled={loading}
              >

                Cancel

              </button>


              <button
                type="submit"
                className="admin-create-button"
                disabled={loading}
              >

                {loading ? (

                  <>

                    <Loader2
                      size={15}
                      className="spin"
                    />

                    Creating...

                  </>

                ) : (

                  <>

                    <Sparkles
                      size={15}
                    />

                    Create event

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


export default AddEvent;

