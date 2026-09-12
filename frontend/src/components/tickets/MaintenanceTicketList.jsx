import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import { useSelector } from "react-redux";

import api from "../../services/api";

import MaintenanceTicketForm from "./MaintenanceTicketForm";

/* =========================================================
   LIVE POLLING INTERVAL
   ========================================================= */

const POLL_INTERVAL = 10000;

/* =========================================================
   DATE / TIME FORMATTER
   ========================================================= */

const fmt = (dt) => {

  if (!dt) {
    return "—";
  }

  const d = new Date(dt);

  if (Number.isNaN(d.getTime())) {
    return "—";
  }

  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

/* =========================================================
   STATUS NORMALIZER
   ========================================================= */

const normalizeStatus = (status) => {

  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
};

/* =========================================================
   COMPONENT
   ========================================================= */

export default function MaintenanceTicketList() {

  const { user } = useSelector(
    (state) => state.auth
  );

  /* =======================================================
     ROLE
     ======================================================= */

  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  const isOperator =
    role === "SOLAR_OPERATOR";

  const canResolve =
    role === "MAINTENANCE_TECHNICIAN" ||
    role === "SYSTEM_ADMINISTRATOR";

  /* =======================================================
     STATE
     ======================================================= */

  const [tickets, setTickets] = useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("ALL");

  const [lastUpdated, setLastUpdated] =
    useState(null);

  const [newIds, setNewIds] =
    useState(new Set());

  const prevIdsRef =
    useRef(new Set());

  /* =======================================================
     LOAD TICKETS
     ======================================================= */

  const loadTickets = useCallback(
    async (silent = false) => {

      try {

        if (!silent) {
          setLoading(true);
        }

        const response =
          await api.get(
            "/api/tickets"
          );

        const data =
          Array.isArray(response?.data)
            ? response.data
            : [];

        /* -----------------------------------------------
           DETECT NEW TICKETS
           ----------------------------------------------- */

        const incomingIds =
          new Set(
            data
              .map((ticket) => ticket?.id)
              .filter(
                (id) =>
                  id !== undefined &&
                  id !== null
              )
          );

        const addedIds =
          [...incomingIds].filter(
            (id) =>
              !prevIdsRef.current.has(id)
          );

        if (
          addedIds.length > 0 &&
          prevIdsRef.current.size > 0
        ) {

          setNewIds(
            new Set(addedIds)
          );

          setTimeout(() => {
            setNewIds(new Set());
          }, 2500);

        }

        prevIdsRef.current =
          incomingIds;

        /* -----------------------------------------------
           UPDATE TICKETS
           ----------------------------------------------- */

        setTickets(data);

        /* -----------------------------------------------
           UPDATE LAST UPDATED
           ----------------------------------------------- */

        setLastUpdated(
          new Date()
        );

      } catch (error) {

        console.error(
          "Failed to load tickets:",
          error
        );

      } finally {

        setLoading(false);

      }

    },
    []
  );

  /* =======================================================
     INITIAL LOAD + CONTINUOUS POLLING
     ======================================================= */

  useEffect(() => {

    loadTickets();

    const interval =
      setInterval(() => {

        loadTickets(true);

      }, POLL_INTERVAL);

    return () => {

      clearInterval(
        interval
      );

    };

  }, [loadTickets]);

  /* =======================================================
     RESOLVE TICKET
     ======================================================= */

  const handleResolve = async (
    ticketId
  ) => {

    try {

      await api.patch(
        `/api/tickets/${ticketId}/resolve`,
        {}
      );

      /*
       * Immediately reload the ticket list
       * after resolving.
       */

      await loadTickets(true);

    } catch (error) {

      console.error(
        "Failed to resolve ticket:",
        error
      );

    }

  };

  /* =======================================================
     GET SITE NAME
     ======================================================= */

  const getSiteName = (ticket) => {

    /*
     * Backend structure:
     *
     * ticket.panel.site.name
     */

    if (
      ticket?.panel?.site?.name
    ) {

      return ticket.panel.site.name;

    }

    /*
     * Fallback in case backend
     * sends siteName directly.
     */

    if (ticket?.siteName) {

      return ticket.siteName;

    }

    return "N/A";

  };

  /* =======================================================
     GET PANEL ID
     ======================================================= */

  const getPanelId = (ticket) => {

    /*
     * Backend structure:
     *
     * ticket.panel.id
     */

    if (
      ticket?.panel?.id !== undefined &&
      ticket?.panel?.id !== null
    ) {

      return ticket.panel.id;

    }

    /*
     * Fallback if API sends panelId.
     */

    if (
      ticket?.panelId !== undefined &&
      ticket?.panelId !== null
    ) {

      return ticket.panelId;

    }

    return "N/A";

  };

  /* =======================================================
     GET TECHNICIAN
     ======================================================= */

  const getTechnician = (ticket) => {

    /*
     * Backend structure:
     *
     * ticket.assignedTechnician.username
     */

    if (
      ticket?.assignedTechnician?.username
    ) {

      return (
        ticket.assignedTechnician.username
      );

    }

    /*
     * Fallback if API sends
     * technician username directly.
     */

    if (
      typeof ticket?.assignedTechnician ===
      "string"
    ) {

      return ticket.assignedTechnician;

    }

    return "Not Assigned";

  };

  /* =======================================================
     TICKET COUNTS
     ======================================================= */

  const counts = {

    OPEN:
      tickets.filter(
        (ticket) =>
          normalizeStatus(
            ticket?.status
          ) === "OPEN"
      ).length,

    IN_PROGRESS:
      tickets.filter(
        (ticket) =>
          normalizeStatus(
            ticket?.status
          ) === "IN_PROGRESS"
      ).length,

    RESOLVED:
      tickets.filter(
        (ticket) => {

          const status =
            normalizeStatus(
              ticket?.status
            );

          return (
            status === "RESOLVED" ||
            status === "CLOSED"
          );

        }
      ).length,

    ALL:
      tickets.length,

  };

  /* =======================================================
     FILTER TICKETS
     ======================================================= */

  const filtered =
    filter === "ALL"
      ? tickets
      : tickets.filter(
          (ticket) => {

            const status =
              normalizeStatus(
                ticket?.status
              );

            if (
              filter === "RESOLVED"
            ) {

              return (
                status === "RESOLVED" ||
                status === "CLOSED"
              );

            }

            return status === filter;

          }
        );

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="tickets-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="sites-header">

        <div className="sites-title-section">

          <h1>
            Maintenance Tickets
          </h1>

          <p className="sites-subtitle">
            Track and manage solar panel
            maintenance issues.
          </p>

        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >

          {/* ---------------------------------------------
              LIVE INDICATOR
              --------------------------------------------- */}

          {lastUpdated && (

            <span className="tickets-live-badge">

              <span
                className="live-pulse-dot"
                style={{
                  width: 7,
                  height: 7,
                }}
              />

              LIVE ·{" "}
              {lastUpdated.toLocaleTimeString(
                "en-GB",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              )}

            </span>

          )}

          {/* ---------------------------------------------
              REPORT ISSUE
              --------------------------------------------- */}

          {isOperator && (

            <button
              type="button"
              className="add-site-button"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Report Issue
            </button>

          )}

        </div>

      </div>

      {/* ===================================================
          STATS ROW
          =================================================== */}

      <div className="ticket-stats-row">

        {/* OPEN */}

        <div
          className={
            `ticket-stat ticket-stat--open` +
            (
              filter === "OPEN"
                ? " ticket-stat--active"
                : ""
            )
          }
          onClick={() =>
            setFilter(
              filter === "OPEN"
                ? "ALL"
                : "OPEN"
            )
          }
          style={{
            cursor: "pointer",
          }}
        >

          <span>
            {counts.OPEN}
          </span>

          <label>
            Open
          </label>

        </div>

        {/* IN PROGRESS */}

        <div
          className={
            `ticket-stat ticket-stat--progress` +
            (
              filter === "IN_PROGRESS"
                ? " ticket-stat--active"
                : ""
            )
          }
          onClick={() =>
            setFilter(
              filter === "IN_PROGRESS"
                ? "ALL"
                : "IN_PROGRESS"
            )
          }
          style={{
            cursor: "pointer",
          }}
        >

          <span>
            {counts.IN_PROGRESS}
          </span>

          <label>
            In Progress
          </label>

        </div>

        {/* RESOLVED */}

        <div
          className={
            `ticket-stat ticket-stat--resolved` +
            (
              filter === "RESOLVED"
                ? " ticket-stat--active"
                : ""
            )
          }
          onClick={() =>
            setFilter(
              filter === "RESOLVED"
                ? "ALL"
                : "RESOLVED"
            )
          }
          style={{
            cursor: "pointer",
          }}
        >

          <span>
            {counts.RESOLVED}
          </span>

          <label>
            Resolved
          </label>

        </div>

        {/* ALL */}

        <div
          className={
            `ticket-stat ticket-stat--total` +
            (
              filter === "ALL"
                ? " ticket-stat--active"
                : ""
            )
          }
          onClick={() =>
            setFilter("ALL")
          }
          style={{
            cursor: "pointer",
          }}
        >

          <span>
            {counts.ALL}
          </span>

          <label>
            All Tickets
          </label>

        </div>

      </div>

      {/* ===================================================
          FILTER LABEL
          =================================================== */}

      {filter !== "ALL" && (

        <div className="tickets-filter-bar">

          Showing:{" "}

          <strong>
            {filter.replace(
              "_",
              " "
            )}
          </strong>{" "}

          tickets

          <button
            type="button"
            className="tickets-filter-clear"
            onClick={() =>
              setFilter("ALL")
            }
          >
            ✕ Clear filter
          </button>

        </div>

      )}

      {/* ===================================================
          TABLE
          =================================================== */}

      {loading ? (

        <div className="no-sites">
          Loading maintenance tickets…
        </div>

      ) : filtered.length === 0 ? (

        <div className="no-sites">

          {filter === "ALL"
            ? "No maintenance tickets found."
            : `No ${filter
                .replace(
                  "_",
                  " "
                )
                .toLowerCase()} tickets.`}

        </div>

      ) : (

        <div className="sites-table-container">

          <table className="sites-table">

            <thead>

              <tr>

                <th>#</th>

                <th>
                  Site
                </th>

                <th>
                  Panel
                </th>

                <th>
                  Description
                </th>

                <th>
                  Priority
                </th>

                <th>
                  Status
                </th>

                <th>
                  Technician
                </th>

                <th>
                  Created
                </th>

                <th>
                  Resolved
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(
                (ticket) => {

                  const status =
                    normalizeStatus(
                      ticket?.status
                    );

                  const isResolved =
                    status ===
                      "RESOLVED" ||
                    status ===
                      "CLOSED";

                  const isNew =
                    newIds.has(
                      ticket?.id
                    );

                  const statusClass =
                    `status-${String(
                      ticket?.status ||
                        ""
                    ).toLowerCase()}`;

                  return (

                    <tr
                      key={
                        ticket?.id
                      }
                      className={
                        isNew
                          ? "ticket-row--new"
                          : ""
                      }
                    >

                      {/* ID */}

                      <td>
                        {ticket?.id}
                      </td>

                      {/* SITE */}

                      <td>

                        <strong>
                          {getSiteName(
                            ticket
                          )}
                        </strong>

                      </td>

                      {/* PANEL */}

                      <td>
                        #
                        {getPanelId(
                          ticket
                        )}
                      </td>

                      {/* DESCRIPTION */}

                      <td className="ticket-desc-cell">

                        {ticket?.issueDescription ||
                          "N/A"}

                      </td>

                      {/* PRIORITY */}

                      <td>

                        <span
                          className={
                            `ticket-priority priority-` +
                            String(
                              ticket?.priority ||
                                ""
                            ).toLowerCase()
                          }
                        >

                          {ticket?.priority ||
                            "N/A"}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            `ticket-status ${statusClass}`
                          }
                        >

                          {isResolved
                            ? "Resolved"
                            : (
                                ticket?.status ||
                                "N/A"
                              ).replace(
                                "_",
                                " "
                              )}

                        </span>

                      </td>

                      {/* TECHNICIAN */}

                      <td>
                        {getTechnician(
                          ticket
                        )}
                      </td>

                      {/* CREATED */}

                      <td className="ticket-date-cell">

                        {fmt(
                          ticket?.createdAt
                        )}

                      </td>

                      {/* RESOLVED */}

                      <td className="ticket-date-cell">

                        {fmt(
                          ticket?.resolvedAt
                        )}

                      </td>

                      {/* ACTION */}

                      <td>

                        {canResolve &&
                          !isResolved && (

                            <button
                              type="button"
                              className="ticket-action-button"
                              onClick={() =>
                                handleResolve(
                                  ticket.id
                                )
                              }
                            >
                              Resolve
                            </button>

                          )}

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

      {/* ===================================================
          REPORT ISSUE FORM
          =================================================== */}

      {showForm && (

        <MaintenanceTicketForm
          onClose={() => {

            setShowForm(false);

            loadTickets(true);

          }}
        />

      )}

    </div>
  );
}