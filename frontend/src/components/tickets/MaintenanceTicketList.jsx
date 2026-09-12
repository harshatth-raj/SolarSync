import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
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

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/tickets", getAuthConfig());
      setTickets(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load maintenance tickets:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTickets(); }, []);

  const handleFormClose = () => { setShowForm(false); loadTickets(); };

  const handleResolveTicket = async (ticketId) => {
    try {
      await api.patch(`/api/tickets/${ticketId}/resolve`, {}, getAuthConfig());
      await loadTickets();
    } catch (error) {
      console.error("Failed to resolve ticket:", error);
    }
  };

  const getSiteName  = (t) => t?.site?.siteName || t?.panel?.site?.siteName || "N/A";
  const getPanelId   = (t) => t?.panel?.id || t?.panelId || "N/A";
  const getTechnician = (t) =>
    t?.assignedTechnician?.username ||
    t?.technician?.username ||
    t?.technician?.name ||
    "Not Assigned";

  return (
    <div className="tickets-page">

      {/* PAGE HEADER */}
      <div className="sites-header">
        <div className="sites-title-section">
          <h1>Maintenance Tickets</h1>
          <p className="sites-subtitle">
            Track and manage solar panel maintenance issues.
          </p>
        </div>

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

      {/* STATS ROW */}
      {!loading && tickets.length > 0 && (
        <div className="ticket-stats-row">
          <div className="ticket-stat ticket-stat--open">
            <span>{tickets.filter(t => String(t.status).toUpperCase() === "OPEN").length}</span>
            <label>Open</label>
          </div>
          <div className="ticket-stat ticket-stat--progress">
            <span>{tickets.filter(t => String(t.status).toUpperCase().includes("PROGRESS")).length}</span>
            <label>In Progress</label>
          </div>
          <div className="ticket-stat ticket-stat--resolved">
            <span>{tickets.filter(t => ["RESOLVED","CLOSED"].includes(String(t.status).toUpperCase())).length}</span>
            <label>Resolved</label>
          </div>
          <div className="ticket-stat ticket-stat--total">
            <span>{tickets.length}</span>
            <label>Total</label>
          </div>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="no-sites">Loading maintenance tickets…</div>
      ) : tickets.length === 0 ? (
        <div className="no-sites">No maintenance tickets found.</div>
      ) : (
        <div className="sites-table-container">
          <table className="sites-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Site</th>
                <th>Panel</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const status = String(ticket.status || "").toUpperCase();
                const isClosed = status === "CLOSED" || status === "RESOLVED";

                return (
                  <tr key={ticket.id}>
                    <td>{ticket.id}</td>
                    <td><strong>{getSiteName(ticket)}</strong></td>
                    <td>#{getPanelId(ticket)}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ticket.issueDescription || "N/A"}
                    </td>
                    <td>
                      <span className={`ticket-priority priority-${String(ticket.priority || "").toLowerCase()}`}>
                        {ticket.priority || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={`ticket-status status-${String(ticket.status || "").toLowerCase().replace(/\s+/g,"_")}`}>
                        {ticket.status || "N/A"}
                      </span>
                    </td>
                    <td>{getTechnician(ticket)}</td>
                    <td>
                      {(role === "MAINTENANCE_TECHNICIAN" || role === "SYSTEM_ADMINISTRATOR") && !isClosed && (
                        <button
                          type="button"
                          className="ticket-action-button"
                          onClick={() => handleResolveTicket(ticket.id)}
                        >
                          Resolve
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

      {showForm && <MaintenanceTicketForm onClose={handleFormClose} />}
    </div>
  );
}
