import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function MaintenanceTicketList() {
  const { user } = useSelector((state) => state.auth);

  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  const isOperator = role === "SOLAR_OPERATOR";
  const canResolve =
    role === "MAINTENANCE_TECHNICIAN" ||
    role === "SYSTEM_ADMINISTRATOR";

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadTickets = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          : {};

        const response = await axios.get(
          "http://localhost:8081/api/tickets",
          config
        );

        if (mounted && Array.isArray(response?.data)) {
          setTickets(response.data);
        }
      } catch (error) {
        if (mounted) {
          setTickets([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTickets();

    return () => {
      mounted = false;
    };
  }, []);

  const handleResolveTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : {};

      const response = await axios.patch(
        `http://localhost:8081/api/tickets/${ticketId}/resolve`,
        {},
        config
      );

      if (response?.data) {
        setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
            ticket.id === ticketId ? response.data : ticket
          )
        );
      } else {
        setTickets((currentTickets) =>
          currentTickets.map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, status: "RESOLVED" }
              : ticket
          )
        );
      }
    } catch (error) {
      // Keep the current ticket list if resolving fails.
    }
  };

  const getPriorityClass = (priority) => {
    return String(priority || "").toLowerCase();
  };

  const getStatusClass = (status) => {
    return String(status || "").toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="sites-page">

      {/* HEADER */}
      <div className="sites-header">

        <div className="sites-title-section">
          <h1>Maintenance Tickets</h1>

          <p className="sites-subtitle">
            View and manage your maintenance issues.
          </p>
        </div>

        {isOperator && (
          <button
            type="button"
            className="add-site-button"
          >
            + Report Issue
          </button>
        )}

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="sites-loading">
          Loading maintenance tickets...
        </div>

      ) : tickets.length === 0 ? (

        <div className="no-sites">
          No maintenance tickets found.
        </div>

      ) : (

        /* TICKET TABLE */
        <div className="sites-table-container">

          <table className="sites-table">

            <thead>
              <tr>
                <th>Site</th>
                <th>Panel ID</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {tickets.map((ticket) => (

                <tr key={ticket.id}>

                  {/* SITE */}
                  <td>
                    <strong>
                      {ticket.site?.siteName || "N/A"}
                    </strong>
                  </td>

                  {/* PANEL */}
                  <td>
                    {ticket.panel?.id
                      ? `#${ticket.panel.id}`
                      : "N/A"}
                  </td>

                  {/* DESCRIPTION */}
                  <td>
                    {ticket.issueDescription || "N/A"}
                  </td>

                  {/* PRIORITY */}
                  <td>
                    <span
                      className={`ticket-priority ${getPriorityClass(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority || "N/A"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`ticket-status ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status || "N/A"}
                    </span>
                  </td>

                  {/* TECHNICIAN */}
                  <td>
                    {ticket.technician?.username || "N/A"}
                  </td>

                  {/* ACTION */}
                  <td>

                    {canResolve &&
                    String(ticket.status || "").toUpperCase() !==
                      "RESOLVED" ? (

                      <button
                        type="button"
                        className="ticket-resolve-button"
                        onClick={() =>
                          handleResolveTicket(ticket.id)
                        }
                      >
                        Resolve Ticket
                      </button>

                    ) : (

                      <span className="ticket-resolved">
                        {String(ticket.status || "").toUpperCase() ===
                        "RESOLVED"
                          ? "Resolved"
                          : "—"}
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}