import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import MaintenanceTicketForm from "./MaintenanceTicketForm";

const POLL_INTERVAL = 10000;

const fmt = (dt) => {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

export default function MaintenanceTicketList() {
  const { user } = useSelector((state) => state.auth);
  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
  const isOperator = role === "SOLAR_OPERATOR";
  const canResolve = role === "MAINTENANCE_TECHNICIAN" || role === "SYSTEM_ADMINISTRATOR";

  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [newIds, setNewIds] = useState(new Set());
  const prevIdsRef = useRef(new Set());

  const loadTickets = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get("/api/tickets");
      const data = Array.isArray(res?.data) ? res.data : [];

      // detect new tickets for flash
      const incoming = new Set(data.map((t) => t.id));
      const added = [...incoming].filter((id) => !prevIdsRef.current.has(id));
      if (added.length > 0 && prevIdsRef.current.size > 0) {
        setNewIds(new Set(added));
        setTimeout(() => setNewIds(new Set()), 2500);
      }
      prevIdsRef.current = incoming;

      setTickets(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    const interval = setInterval(() => loadTickets(true), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadTickets]);

  const handleResolve = async (ticketId) => {
    try {
      await api.patch(`/api/tickets/${ticketId}/resolve`, {});
      loadTickets(true);
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  const getSiteName   = (t) => t?.siteName || "N/A";
  const getPanelId    = (t) => t?.panelId || "N/A";
  const getTechnician = (t) => t?.assignedTechnician || "Not Assigned";

  const counts = {
    OPEN:        tickets.filter((t) => String(t.status).toUpperCase() === "OPEN").length,
    IN_PROGRESS: tickets.filter((t) => String(t.status).toUpperCase() === "IN_PROGRESS").length,
    CLOSED:      tickets.filter((t) => String(t.status).toUpperCase() === "CLOSED").length,
    ALL:         tickets.length,
  };

  const filtered = filter === "ALL"
    ? tickets
    : tickets.filter((t) => String(t.status).toUpperCase() === filter);

  return (
    <div className="tickets-page">

      {/* HEADER */}
      <div className="sites-header">
        <div className="sites-title-section">
          <h1>Maintenance Tickets</h1>
          <p className="sites-subtitle">Track and manage solar panel maintenance issues.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {lastUpdated && (
            <span className="tickets-live-badge">
              <span className="live-pulse-dot" style={{ width: 7, height: 7 }} />
              LIVE · {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
          {isOperator && (
            <button type="button" className="add-site-button" onClick={() => setShowForm(true)}>
              + Report Issue
            </button>
          )}
        </div>
      </div>

      {/* STATS ROW */}
      <div className="ticket-stats-row">
        <div
          className={`ticket-stat ticket-stat--open${filter === "OPEN" ? " ticket-stat--active" : ""}`}
          onClick={() => setFilter(filter === "OPEN" ? "ALL" : "OPEN")}
          style={{ cursor: "pointer" }}
        >
          <span>{counts.OPEN}</span>
          <label>Open</label>
        </div>
        <div
          className={`ticket-stat ticket-stat--progress${filter === "IN_PROGRESS" ? " ticket-stat--active" : ""}`}
          onClick={() => setFilter(filter === "IN_PROGRESS" ? "ALL" : "IN_PROGRESS")}
          style={{ cursor: "pointer" }}
        >
          <span>{counts.IN_PROGRESS}</span>
          <label>In Progress</label>
        </div>
        <div
          className={`ticket-stat ticket-stat--resolved${filter === "CLOSED" ? " ticket-stat--active" : ""}`}
          onClick={() => setFilter(filter === "CLOSED" ? "ALL" : "CLOSED")}
          style={{ cursor: "pointer" }}
        >
          <span>{counts.CLOSED}</span>
          <label>Resolved</label>
        </div>
        <div
          className={`ticket-stat ticket-stat--total${filter === "ALL" ? " ticket-stat--active" : ""}`}
          onClick={() => setFilter("ALL")}
          style={{ cursor: "pointer" }}
        >
          <span>{counts.ALL}</span>
          <label>All Tickets</label>
        </div>
      </div>

      {/* FILTER LABEL */}
      {filter !== "ALL" && (
        <div className="tickets-filter-bar">
          Showing: <strong>{filter.replace("_", " ")}</strong> tickets
          <button type="button" className="tickets-filter-clear" onClick={() => setFilter("ALL")}>
            ✕ Clear filter
          </button>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="no-sites">Loading maintenance tickets…</div>
      ) : filtered.length === 0 ? (
        <div className="no-sites">
          {filter === "ALL" ? "No maintenance tickets found." : `No ${filter.replace("_", " ").toLowerCase()} tickets.`}
        </div>
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
                <th>Created</th>
                <th>Resolved</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => {
                const status = String(ticket.status || "").toUpperCase();
                const isClosed = status === "CLOSED";
                const isNew = newIds.has(ticket.id);
                const statusClass = `status-${String(ticket.status || "").toLowerCase()}`;

                return (
                  <tr key={ticket.id} className={isNew ? "ticket-row--new" : ""}>
                    <td>{ticket.id}</td>
                    <td><strong>{getSiteName(ticket)}</strong></td>
                    <td>#{getPanelId(ticket)}</td>
                    <td className="ticket-desc-cell">{ticket.issueDescription || "N/A"}</td>
                    <td>
                      <span className={`ticket-priority priority-${String(ticket.priority || "").toLowerCase()}`}>
                        {ticket.priority || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={`ticket-status ${statusClass}`}>
                        {isClosed ? "Resolved" : (ticket.status || "N/A").replace("_", " ")}
                      </span>
                    </td>
                    <td>{getTechnician(ticket)}</td>
                    <td className="ticket-date-cell">{fmt(ticket.createdAt)}</td>
                    <td className="ticket-date-cell">{fmt(ticket.resolvedAt)}</td>
                    <td>
                      {canResolve && !isClosed && (
                        <button
                          type="button"
                          className="ticket-action-button"
                          onClick={() => handleResolve(ticket.id)}
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

      {showForm && <MaintenanceTicketForm onClose={() => { setShowForm(false); loadTickets(true); }} />}
    </div>
  );
}
