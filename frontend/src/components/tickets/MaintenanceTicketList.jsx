import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MaintenanceTicketForm from "./MaintenanceTicketForm";

export default function MaintenanceTicketList() {
  const { user } = useSelector((state) => state.auth);

  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  const isOperator = role === "SOLAR_OPERATOR";

  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD TICKETS
     ========================================================= */

  const loadTickets = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const response = await axios.get(
        "http://localhost:8081/api/tickets",
        config
      );

      if (Array.isArray(response?.data)) {
        setTickets(response.data);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error("Failed to load maintenance tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  /* =========================================================
     FORM CLOSED
     ========================================================= */

  const handleFormClose = () => {
    setShowForm(false);
    loadTickets();
  };

  /* =========================================================
     RESOLVE TICKET
     ========================================================= */

  const handleResolveTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      await axios.patch(
        `http://localhost:8081/api/tickets/${ticketId}/resolve`,
        {},
        config
      );

      await loadTickets();
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
      alert("Failed to resolve ticket.");
    }
  };

  /* =========================================================
     DISPLAY HELPERS
     ========================================================= */

  const getSiteName = (ticket) => {
    /*
     * Current backend response does not include panel.site.
     * For now, use the site name if the API provides it.
     */
    return (
      ticket?.site?.siteName ||
      ticket?.panel?.site?.siteName ||
      "N/A"
    );
  };

  const getPanelId = (ticket) => {
    return ticket?.panel?.id || ticket?.panelId || "N/A";
  };

  const getTechnician = (ticket) => {
    return (
      ticket?.assignedTechnician?.username ||
      ticket?.technician?.username ||
      ticket?.technician?.name ||
      "Not Assigned"
    );
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="maintenance-ticket-list">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="tickets-list-header">

        <div />

        {isOperator && (
          <button
            type="button"
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Report Issue
          </button>
        )}

      </div>

      {/* =====================================================
          LOADING
          ===================================================== */}

      {loading ? (
        <div className="no-sites">
          Loading maintenance tickets...
        </div>
      ) : tickets.length === 0 ? (

        /* ===================================================
           EMPTY STATE
           =================================================== */

        <div className="no-sites">
          No maintenance tickets found.
        </div>

      ) : (

        /* ===================================================
           TICKET TABLE
           =================================================== */

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

              {tickets.map((ticket) => {

                const status = String(
                  ticket.status || ""
                ).toUpperCase();

                const isClosed =
                  status === "CLOSED" ||
                  status === "RESOLVED";

                return (
                  <tr key={ticket.id}>

                    {/* SITE */}

                    <td>
                      {getSiteName(ticket)}
                    </td>

                    {/* PANEL */}

                    <td>
                      #{getPanelId(ticket)}
                    </td>

                    {/* DESCRIPTION */}

                    <td>
                      {ticket.issueDescription || "N/A"}
                    </td>

                    {/* PRIORITY */}

                    <td>
                      <span
                        className={`ticket-priority priority-${String(
                          ticket.priority || ""
                        ).toLowerCase()}`}
                      >
                        {ticket.priority || "N/A"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`ticket-status status-${String(
                          ticket.status || ""
                        ).toLowerCase()}`}
                      >
                        {ticket.status || "N/A"}
                      </span>
                    </td>

                    {/* TECHNICIAN */}

                    <td>
                      {getTechnician(ticket)}
                    </td>

                    {/* ACTIONS */}

                    <td>

                      {(role === "MAINTENANCE_TECHNICIAN" ||
                        role === "SYSTEM_ADMINISTRATOR") &&
                        !isClosed && (

                          <button
                            type="button"
                            className="ticket-action-button"
                            onClick={() =>
                              handleResolveTicket(ticket.id)
                            }
                          >
                            Resolve Ticket
                          </button>

                        )}

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      )}

      {/* =====================================================
          REPORT ISSUE FORM
          ===================================================== */}

      {showForm && (
        <MaintenanceTicketForm
          onClose={handleFormClose}
        />
      )}

    </div>
  );
}