import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  Ticket,
  Users,
  DollarSign,
  CalendarDays,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminEvents, addEvent } from "../../api/adminApi";

const EVENT_MODES = ["CONCERT", "CINEMA", "SHOW"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAdminEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Unable to load events data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Safe Metric Calculations
  const totalEvents = events.length;
  
  const totalSeats = events.reduce((acc, item) => {
    const seats = item?.total_Seats ?? item?.totalSeats ?? item?.total_seats ?? item?.l_seats ?? 0;
    return acc + Number(seats);
  }, 0);

  const totalRevenue = events.reduce((acc, item) => {
    const price = Number(item?.Price ?? item?.price ?? item?.ticket_price ?? item?.ticketPrice ?? 0);
    const seats = Number(item?.total_Seats ?? item?.totalSeats ?? item?.total_seats ?? item?.l_seats ?? 0);
    return acc + price * seats;
  }, 0);

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <Loader2 size={24} className="spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-hero">
        <div>
          <span className="admin-eyebrow">OVERVIEW</span>
          <h1>Admin Dashboard</h1>
          <p>Manage your events, seats, and view overall platform performance.</p>
        </div>

        <button
          type="button"
          className="admin-primary-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          <span>Create event</span>
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <Ticket size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Events</span>
            <strong className="stat-value">{totalEvents}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <Users size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Capacity</span>
            <strong className="stat-value">{totalSeats.toLocaleString()} seats</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <DollarSign size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Est. Total Revenue</span>
            <strong className="stat-value">Rs. {totalRevenue.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        <div className="admin-quick-actions-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions-list">
            <button
              type="button"
              className="quick-action-btn"
              onClick={() => setIsAddModalOpen(true)}
            >
              <div className="action-icon">
                <Plus size={18} />
              </div>
              <div className="action-details">
                <strong>Add New Event</strong>
                <small>Create and publish a new event</small>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </button>

            <button
              type="button"
              className="quick-action-btn"
              onClick={() => navigate("/admin/events")}
            >
              <div className="action-icon">
                <CalendarDays size={18} />
              </div>
              <div className="action-details">
                <strong>View All Events</strong>
                <small>Manage existing events list</small>
              </div>
              <ArrowRight size={16} className="action-arrow" />
            </button>
          </div>
        </div>

        <div className="admin-recent-events-card">
          <div className="card-header">
            <h2>Recent Events</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/admin/events")}
            >
              See all
            </button>
          </div>

          {events.length === 0 ? (
            <div className="empty-events">No events created yet.</div>
          ) : (
            <div className="recent-events-list">
              {events.slice(0, 4).map((event, idx) => {
                const title = event?.event_name || event?.eventName || event?.title || "Untitled Event";
                const price = Number(event?.Price ?? event?.price ?? event?.ticket_price ?? 0);
                const seats = event?.total_Seats ?? event?.totalSeats ?? event?.total_seats ?? 0;
                const mode = typeof event?.event_mode === "object" 
                  ? event?.event_mode?.eventType?.eventType || event?.event_mode?.eventType 
                  : event?.event_mode || "N/A";

                return (
                  <div key={event.id || idx} className="recent-event-item">
                    <div className="event-main-info">
                      <strong>{title}</strong>
                      <span>{mode}</span>
                    </div>
                    <div className="event-meta-info">
                      <span>{seats} Seats</span>
                      <strong>Rs. {price.toLocaleString()}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <CreateEventModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={async () => {
            setIsAddModalOpen(false);
            await loadEvents();
          }}
        />
      )}
    </div>
  );
};

/* =====================================================
   CREATE EVENT MODAL COMPONENT
===================================================== */
const CreateEventModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    event_name: "",
    event_mode: "CONCERT",
    total_Seats: "",
    price: "",
    localDateTime: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.event_name.trim()) {
      toast.error("Event name is required");
      return;
    }

    if (!EVENT_MODES.includes(form.event_mode)) {
      toast.error("Please select a valid event type");
      return;
    }

    if (!form.total_Seats || Number(form.total_Seats) <= 0) {
      toast.error("Enter a valid number of seats");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      toast.error("Enter a valid ticket price");
      return;
    }

    if (!form.localDateTime) {
      toast.error("Please select event date and time");
      return;
    }

    if (!image) {
      toast.error("Please select an event image");
      return;
    }

    try {
      setSaving(true);

      const eventData = {
        event_name: form.event_name.trim(),
        event_mode: form.event_mode,
        total_Seats: Number(form.total_Seats),
        Price: Number(form.price),
        localDateTime: form.localDateTime,
      };

      await addEvent(eventData, image);
      toast.success("Event created successfully");
      await onSuccess();
    } catch (error) {
      console.error("Save event error:", error);
      const responseData = error.response?.data;
      let message = "Unable to save event";

      if (typeof responseData === "string") {
        message = responseData;
      } else if (responseData?.response) {
        message = responseData.response;
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="event-modal">
        <div className="modal-header">
          <div>
            <span>NEW EVENT</span>
            <h2>Create event</h2>
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

        <form className="event-form" onSubmit={handleSubmit}>
          <div className="image-upload">
            <label>Event image</label>
            <div className={`image-upload-box ${preview ? "has-preview" : ""}`}>
              {preview ? (
                <img src={preview} alt="Event preview" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={22} />
                  <span>Click to upload image</span>
                  <small>JPG, PNG or WEBP · Max 5 MB</small>
                </div>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Event name</label>
            <input
              name="event_name"
              value={form.event_name}
              onChange={handleChange}
              placeholder="e.g. Coke Studio Live"
              maxLength={120}
              disabled={saving}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Event mode</label>
              <select
                name="event_mode"
                value={form.event_mode}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="CONCERT">Concert</option>
                <option value="CINEMA">Cinema</option>
                <option value="SHOW">Show</option>
              </select>
            </div>

            <div className="form-field">
              <label>Total seats</label>
              <input
                name="total_Seats"
                type="number"
                min="1"
                value={form.total_Seats}
                onChange={handleChange}
                placeholder="500"
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Ticket price</label>
            <div className="price-input-wrapper">
              <span>Rs.</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="2500"
                disabled={saving}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Event date & time</label>
            <div className="datetime-input-wrapper">
              <CalendarDays size={16} />
              <input
                name="localDateTime"
                type="datetime-local"
                value={form.localDateTime}
                onChange={handleChange}
                disabled={saving}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="modal-submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={14} className="spin" />
                  Saving...
                </>
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

export default AdminDashboard;