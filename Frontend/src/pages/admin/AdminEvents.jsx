import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  CalendarDays,
  Clock3,
  Ticket,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  addEvent,
  getAdminEvents,
  deleteEvent,
  updateEvent,
} from "../../api/adminApi";
import { getImageUrl } from "../../utils/imageUrl";

const EVENT_MODES = ["CONCERT", "CINEMA", "SHOW"];

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data = await getAdminEvents();

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load events error:", error);
      toast.error("Unable to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      await deleteEvent(eventId);

      toast.success("Event deleted successfully");

      await loadEvents();
    } catch (error) {
      console.error("Delete event error:", error);

      const message = error.response?.data;

      toast.error(
        typeof message === "string" ? message : "Unable to delete event"
      );
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleModalSuccess = async () => {
    closeModal();
    await loadEvents();
  };

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <span className="section-label">ADMIN PANEL</span>

            <h1>Event management</h1>

            <p>
              Create, update and manage your Flash Ticket events.
            </p>
          </div>

          <button
            type="button"
            className="admin-add-button"
            onClick={openAddModal}
          >
            <Plus size={15} />
            Add event
          </button>
        </div>

        {/* STATS */}
        <div className="admin-stats">

          <div className="admin-stat">
            <div className="admin-stat-icon">
              <Ticket size={17} />
            </div>

            <div>
              <span>Total events</span>
              <strong>{events.length}</strong>
            </div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-icon">
              <CalendarDays size={17} />
            </div>

            <div>
              <span>Published</span>
              <strong>{events.length}</strong>
            </div>
          </div>

        </div>

        {/* EVENTS */}
        {loading ? (
          <div className="admin-loading">
            <Loader2 size={22} className="spin" />
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="admin-empty">
            <div>
              <Ticket size={27} />
            </div>

            <h3>No events yet</h3>

            <p>
              Create your first event to start selling tickets.
            </p>

            <button
              type="button"
              onClick={openAddModal}
            >
              <Plus size={14} />
              Create event
            </button>
          </div>
        ) : (
          <div className="admin-events-grid">

            {events.map((event, idx) => (
              <AdminEventCard
                key={event?.id || idx}
                event={event}
                onDelete={handleDelete}
                onEdit={openEditModal}
              />
            ))}

          </div>
        )}

      </div>

      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={closeModal}
          onSuccess={handleModalSuccess}
        />
      )}
    </main>
  );
};


/* =====================================================
   EVENT CARD
===================================================== */

const AdminEventCard = ({ event, onDelete, onEdit }) => {

  // Event title
  const title =
    event?.eventName ||
    event?.event_name ||
    "Untitled event";

  // Ticket price
  const price = Number(
    event?.ticket_price ??
    event?.price ??
    0
  );

  // Total seats
  const seats =
    event?.total_seats ??
    event?.total_Seats ??
    event?.totalSeats ??
    0;


  /* =====================================================
     DATE / TIME PARSER
  ===================================================== */
const parseJavaDate = (value) => {
  if (!value) return null;

  try {
    const str = String(value).trim();

    /*
     * Backend format:
     * 12-08-2026 01-38 pm
     */

    const match = str.match(
      /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2})-(\d{2})\s+(am|pm)$/i
    );

    if (match) {
      const [, day, month, year, hour, minute, period] = match;

      let hours = Number(hour);
      const minutes = Number(minute);

      // Convert 12-hour time to 24-hour time
      if (period.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
      }

      if (period.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }

      const dateObj = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        hours,
        minutes
      );

      return isNaN(dateObj.getTime())
        ? null
        : dateObj;
    }

    /*
     * Fallback for ISO / normal Java date formats
     */

    const formatted = str.replace(" ", "T");
    const dateObj = new Date(formatted);

    return isNaN(dateObj.getTime())
      ? null
      : dateObj;

  } catch (error) {
    console.error("Date parsing error:", error);
    return null;
  }
};


  /* =====================================================
     SUPPORT ALL POSSIBLE BACKEND FIELD NAMES
  ===================================================== */

  const eventDateTime =
    event?.eventAt ||
    event?.event_at ||
    event?.localDateTime ||
    event?.local_datetime ||
    event?.dateTime ||
    event?.date_time ||
    event?.eventDateTime ||
    event?.event_date_time ||
    null;


  const date = parseJavaDate(eventDateTime);


  /* =====================================================
     EVENT BADGE
  ===================================================== */

  const renderBadge = () => {

    const mode = event?.event_mode;

    if (typeof mode === "object" && mode !== null) {
      return (
        mode?.eventType ||
        mode?.name ||
        "EVENT"
      );
    }

    return mode || "EVENT";
  };


  return (
    <article className="admin-event-card">

      {/* EVENT IMAGE */}
      <div className="admin-event-image">

        {event?.imageUrl ? (
          <img
            src={getImageUrl(event.imageUrl)}
            alt={title}
          />
        ) : (
          <div>
            <Ticket size={30} />
          </div>
        )}

        <span>
          {renderBadge()}
        </span>

      </div>


      {/* EVENT CONTENT */}
      <div className="admin-event-content">

        {/* TITLE + PRICE */}
        <div className="admin-event-title">

          <h3>
            {title}
          </h3>

          <strong>
            Rs. {price.toLocaleString()}
          </strong>

        </div>


        {/* EVENT META */}
        <div className="admin-event-meta">

          {/* DATE */}
          <span>

            <CalendarDays size={13} />

            {date ? (
              date.toLocaleDateString("en-PK", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            ) : (
              "Date not available"
            )}

          </span>


          {/* TIME */}
          <span>

            <Clock3 size={13} />

            {date ? (
              date.toLocaleTimeString("en-PK", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            ) : (
              "Time not available"
            )}

          </span>


          {/* SEATS */}
          <span>

            <Ticket size={13} />

            {seats} seats

          </span>

        </div>


        {/* ACTIONS */}
        <div className="admin-event-actions">

          <button
            type="button"
            className="edit-event-button"
            onClick={() => onEdit(event)}
          >
            <Pencil size={13} />
            Edit
          </button>


          <button
            type="button"
            className="delete-event-button"
            onClick={() => onDelete(event.id)}
          >
            <Trash2 size={13} />
            Delete
          </button>

        </div>

      </div>

    </article>
  );
};


/* =====================================================
   ADD / EDIT MODAL
===================================================== */

const EventModal = ({ event, onClose, onSuccess }) => {

  const isEdit = Boolean(event);


  /* =====================================================
     FORMAT DATE FOR DATETIME-LOCAL INPUT
  ===================================================== */

  function formatForInput(str) {

    if (!str) return "";

    try {

      const formatted =
        typeof str === "string"
          ? str.replace(" ", "T")
          : str;

      const dateObj = new Date(formatted);

      if (isNaN(dateObj.getTime())) {
        return "";
      }


      const year =
        dateObj.getFullYear();

      const month =
        String(dateObj.getMonth() + 1)
          .padStart(2, "0");

      const day =
        String(dateObj.getDate())
          .padStart(2, "0");

      const hours =
        String(dateObj.getHours())
          .padStart(2, "0");

      const minutes =
        String(dateObj.getMinutes())
          .padStart(2, "0");


      return `${year}-${month}-${day}T${hours}:${minutes}`;

    } catch (error) {

      console.error(
        "Date input formatting error:",
        error
      );

      return "";
    }
  }


  /* =====================================================
     GET EXISTING EVENT DATE
  ===================================================== */

  const existingEventDate =
    event?.eventAt ||
    event?.event_at ||
    event?.localDateTime ||
    event?.local_datetime ||
    event?.dateTime ||
    event?.date_time ||
    event?.eventDateTime ||
    event?.event_date_time ||
    "";


  /* =====================================================
     FORM STATE
  ===================================================== */

  const [form, setForm] = useState({

    eventName:
      event?.eventName ||
      event?.event_name ||
      "",

    event_mode:
      typeof event?.event_mode === "string"
        ? event?.event_mode
        : event?.event_mode?.eventType ||
          event?.event_mode?.name ||
          "CONCERT",

    total_seats:
      event?.total_seats ??
      event?.totalSeats ??
      "",

    ticket_price:
      event?.ticket_price ??
      event?.price ??
      "",

    eventAt:
      formatForInput(existingEventDate),
  });


  const [image, setImage] =
    useState(null);


  const [preview, setPreview] =
    useState(
      event?.imageUrl
        ? getImageUrl(event.imageUrl)
        : null
    );


  const [saving, setSaving] =
    useState(false);


  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =====================================================
     HANDLE IMAGE
  ===================================================== */

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;


    if (!file.type.startsWith("image/")) {

      toast.error(
        "Please select an image file"
      );

      return;
    }


    if (file.size > 5 * 1024 * 1024) {

      toast.error(
        "Image must be smaller than 5 MB"
      );

      return;
    }


    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };


  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    /* EVENT NAME */

    if (!form.eventName.trim()) {

      toast.error(
        "Event name is required"
      );

      return;
    }


    /* EVENT MODE */

    if (!EVENT_MODES.includes(form.event_mode)) {

      toast.error(
        "Please select a valid event type"
      );

      return;
    }


    /* SEATS */

    if (
      !form.total_seats ||
      Number(form.total_seats) <= 0
    ) {

      toast.error(
        "Enter a valid number of seats"
      );

      return;
    }


    /* PRICE */

    if (
      form.ticket_price === "" ||
      Number(form.ticket_price) < 0
    ) {

      toast.error(
        "Enter a valid ticket price"
      );

      return;
    }


    /* DATE / TIME */

    if (!form.eventAt) {

      toast.error(
        "Please select event date and time"
      );

      return;
    }


    /* IMAGE */

    if (!isEdit && !image) {

      toast.error(
        "Please select an event image"
      );

      return;
    }


    try {

      setSaving(true);


      /* =================================================
         EVENT DATA SENT TO BACKEND
      ================================================= */

      const eventData = {

        eventName:
          form.eventName.trim(),

        event_mode:
          form.event_mode,

        total_seats:
          Number(form.total_seats),

        ticket_price:
          Number(form.ticket_price),

        eventAt:
          form.eventAt,

      };


      /* UPDATE */

      if (isEdit) {

        await updateEvent(
          event.id,
          eventData
        );

        toast.success(
          "Event updated successfully"
        );

      }

      /* CREATE */

      else {

        await addEvent(
          eventData,
          image
        );

        toast.success(
          "Event created successfully"
        );
      }


      await onSuccess();

    } catch (error) {

      console.error(
        "Save event error:",
        error
      );


      const responseData =
        error.response?.data;

      let message =
        "Unable to save event";


      if (
        typeof responseData === "string"
      ) {

        message =
          responseData;

      } else if (
        responseData?.response
      ) {

        message =
          responseData.response;

      } else if (
        error.message
      ) {

        message =
          error.message;
      }


      toast.error(message);

    } finally {

      setSaving(false);

    }
  };


  /* =====================================================
     MODAL UI
  ===================================================== */

  return (

    <div
      className="modal-overlay"
      onMouseDown={(e) => {

        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div className="event-modal">

        {/* MODAL HEADER */}
        <div className="modal-header">

          <div>

            <span>
              {isEdit
                ? "UPDATE EVENT"
                : "NEW EVENT"}
            </span>

            <h2>
              {isEdit
                ? "Edit event"
                : "Create event"}
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="modal-close"
            disabled={saving}
          >
            <X size={18} />
          </button>

        </div>


        {/* FORM */}
        <form
          className="event-form"
          onSubmit={handleSubmit}
        >

          {/* IMAGE */}
          <div className="image-upload">

            <label>
              Event image
            </label>

            <div
              className={`image-upload-box ${
                preview
                  ? "has-preview"
                  : ""
              }`}
            >

              {preview ? (

                <img
                  src={preview}
                  alt="Event preview"
                />

              ) : (

                <div className="upload-placeholder">

                  <Upload size={22} />

                  <span>
                    Click to upload image
                  </span>

                  <small>
                    JPG, PNG or WEBP · Max 5 MB
                  </small>

                </div>

              )}


              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                disabled={saving}
              />

            </div>


            {isEdit && (

              <small className="edit-image-note">
                Current image will be kept.
              </small>

            )}

          </div>


          {/* EVENT NAME */}
          <div className="form-field">

            <label>
              Event name
            </label>

            <input
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              placeholder="e.g. Coke Studio Live"
              maxLength={120}
              disabled={saving}
            />

          </div>


          {/* EVENT MODE + SEATS */}
          <div className="form-row">

            <div className="form-field">

              <label>
                Event mode
              </label>

              <select
                name="event_mode"
                value={form.event_mode}
                onChange={handleChange}
                disabled={saving}
              >

                <option value="CONCERT">
                  Concert
                </option>

                <option value="CINEMA">
                  Cinema
                </option>

                <option value="SHOW">
                  Show
                </option>

              </select>

            </div>


            <div className="form-field">

              <label>
                Total seats
              </label>

              <input
                name="total_seats"
                type="number"
                min="1"
                value={form.total_seats}
                onChange={handleChange}
                placeholder="500"
                disabled={saving}
              />

            </div>

          </div>


          {/* PRICE */}
          <div className="form-field">

            <label>
              Ticket price
            </label>

            <div className="price-input-wrapper">

              <span>
                Rs.
              </span>

              <input
                name="ticket_price"
                type="number"
                min="0"
                step="0.01"
                value={form.ticket_price}
                onChange={handleChange}
                placeholder="2500"
                disabled={saving}
              />

            </div>

          </div>


          {/* DATE + TIME */}
          <div className="form-field">

            <label>
              Event date & time
            </label>

            <div className="datetime-input-wrapper">

              <CalendarDays size={16} />

              <input
                name="eventAt"
                type="datetime-local"
                value={form.eventAt}
                onChange={handleChange}
                disabled={saving}
              />

            </div>

          </div>


          {/* MODAL ACTIONS */}
          <div className="modal-actions">

            <button
              type="button"
              className="modal-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="modal-submit"
              disabled={saving}
            >

              {saving ? (

                <>
                  <Loader2
                    size={14}
                    className="spin"
                  />

                  Saving...
                </>

              ) : isEdit ? (

                "Update event"

              ) : (

                "Create event"

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default AdminEvents;