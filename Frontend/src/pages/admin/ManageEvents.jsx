import { useEffect, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Eye,
  Plus,
  Trash2,
  Ticket,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "sonner";

import Navbar from "../../components/Navbar";

import {
  deleteEvent,
  getAllEvents,
} from "../../api/eventApi";

import { getImageUrl } from "../../utils/imageUrl";

const ManageEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] =
    useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const data =
        await getAllEvents();

      setEvents(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Unable to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    eventId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this event?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(eventId);

      const response =
        await deleteEvent(eventId);

      toast.success(
        response.response ||
          response.Response ||
          "Event deleted successfully"
      );

      setEvents((previous) =>
        previous.filter(
          (event) =>
            event.id !== eventId
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete event"
      );
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container manage-page">

        <div className="manage-header">

          <div>
            <span>
              EVENT MANAGEMENT
            </span>

            <h1>
              Manage events
            </h1>

            <p>
              View and manage all available events.
            </p>
          </div>

          <Link
            to="/admin/add-event"
            className="admin-primary-button"
          >
            <Plus size={18} />
            Add Event
          </Link>

        </div>

        {loading ? (
          <div className="loading">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="admin-empty large-empty">
            <Ticket size={42} />

            <h3>
              No events found
            </h3>

            <p>
              Create your first event to get
              started.
            </p>

            <Link
              to="/admin/add-event"
              className="admin-primary-button"
            >
              <Plus size={16} />
              Create Event
            </Link>
          </div>
        ) : (
          <div className="manage-events-grid">

            {events.map((event) => (
              <div
                className="manage-event-card"
                key={event.id}
              >

                <div className="manage-event-image">

                  <img
                    src={getImageUrl(
                      event.imageUrl
                    )}
                    alt={event.event_name}
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                  <span>
                    {event.event_mode}
                  </span>

                </div>

                <div className="manage-event-body">

                  <h3>
                    {event.event_name}
                  </h3>

                  <div className="manage-event-info">

                    <span>
                      <CalendarDays
                        size={14}
                      />

                      {event.localDateTime
                        ? new Date(
                            event.localDateTime
                          ).toLocaleDateString()
                        : "Date TBA"}
                    </span>

                    <span>
                      <Ticket size={14} />

                      {event.total_Seats} seats
                    </span>

                  </div>

                  <div className="manage-event-bottom">

                    <strong>
                      Rs.{" "}
                      {Number(
                        event.price || 0
                      ).toLocaleString()}
                    </strong>

                    <div className="event-actions">

                      <button
                        title="View"
                        onClick={() =>
                          navigate(
                            `/event/${event.id}`
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() =>
                          navigate(
                            `/admin/events/edit/${event.id}`
                          )
                        }
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        title="Delete"
                        className="delete-action"
                        disabled={
                          deleting === event.id
                        }
                        onClick={() =>
                          handleDelete(
                            event.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </>
  );
};

export default ManageEvents;