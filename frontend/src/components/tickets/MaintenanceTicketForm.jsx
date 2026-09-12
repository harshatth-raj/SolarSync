import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function MaintenanceTicketForm({ onClose }) {
  const [description, setDescription] = useState("");
  const [sites, setSites] = useState([]);
  const [panels, setPanels] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [loadingSites, setLoadingSites] =
    useState(true);

  const [loadingPanels, setLoadingPanels] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =========================================================
     LOAD SOLAR SITES
     ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadSites = async () => {
      try {
        const response =
          await api.get("/api/sites");

        if (!mounted) return;

        const siteData =
          Array.isArray(response?.data)
            ? response.data
            : [];

        setSites(siteData);

        /*
         * Automatically select the first site
         * when sites are available.
         */

        if (siteData.length > 0) {
          setSelectedSite(
            String(siteData[0].id)
          );
        }
      } catch (err) {
        console.error(
          "Failed to load solar sites:",
          err
        );

        if (mounted) {
          setSites([]);
        }
      } finally {
        if (mounted) {
          setLoadingSites(false);
        }
      }
    };

    loadSites();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     LOAD PANELS FOR SELECTED SITE
     ========================================================= */

  useEffect(() => {
    let mounted = true;

    if (!selectedSite) {
      setPanels([]);
      setSelectedPanel("");
      return;
    }

    const loadPanels = async () => {
      try {
        setLoadingPanels(true);

        const response =
          await api.get(
            `/api/panels/site/${selectedSite}`
          );

        if (!mounted) return;

        const panelData =
          Array.isArray(response?.data)
            ? response.data
            : [];

        setPanels(panelData);

        /*
         * Automatically select the first panel
         * when panels are available.
         */

        if (panelData.length > 0) {
          setSelectedPanel(
            String(panelData[0].id)
          );
        } else {
          setSelectedPanel("");
        }
      } catch (err) {
        console.error(
          "Failed to load solar panels:",
          err
        );

        if (mounted) {
          setPanels([]);
          setSelectedPanel("");
        }
      } finally {
        if (mounted) {
          setLoadingPanels(false);
        }
      }
    };

    loadPanels();

    return () => {
      mounted = false;
    };
  }, [selectedSite]);

  /* =========================================================
     SUBMIT TICKET
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /* ---------------------------------------------
       DESCRIPTION VALIDATION
       --------------------------------------------- */

    if (!description.trim()) {
      setError(
        "Issue description is required."
      );
      return;
    }

    /* ---------------------------------------------
       PANEL VALIDATION
       --------------------------------------------- */

    if (!selectedPanel) {
      setError(
        "Please select a solar panel."
      );
      return;
    }

    setSubmitting(true);

    try {
      await api.post(
        "/api/tickets",
        {
          panelId: Number(selectedPanel),
          issueDescription:
            description.trim(),
          priority,
        }
      );

      /*
       * Tell the parent component that
       * the ticket was successfully created.
       */

      onClose();

    } catch (err) {
      console.error(
        "Failed to create maintenance ticket:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to create maintenance ticket."
      );

    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     STYLES
     ========================================================= */

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "24px",

    background:
      "rgba(15, 23, 42, 0.72)",

    backdropFilter:
      "blur(4px)",

    overflowY: "auto",
  };

  const modalStyle = {
    width: "100%",
    maxWidth: "620px",

    maxHeight: "calc(100vh - 48px)",

    overflowY: "auto",

    background: "#ffffff",

    borderRadius: "16px",

    boxShadow:
      "0 25px 60px rgba(0, 0, 0, 0.30)",

    padding: "28px",

    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",

    marginBottom: "26px",
  };

  const iconStyle = {
    width: "46px",
    height: "46px",

    flexShrink: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "12px",

    background: "#eff6ff",

    fontSize: "22px",
  };

  const titleStyle = {
    margin: 0,

    fontSize: "26px",

    fontWeight: "700",

    color: "#111827",

    lineHeight: "1.2",
  };

  const subtitleStyle = {
    margin: "6px 0 0",

    fontSize: "14px",

    color: "#6b7280",

    lineHeight: "1.5",
  };

  const closeButtonStyle = {
    marginLeft: "auto",

    width: "36px",
    height: "36px",

    border: "none",

    borderRadius: "8px",

    background: "#f3f4f6",

    color: "#374151",

    fontSize: "18px",

    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    flexShrink: 0,
  };

  const fieldStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",

    marginBottom: "8px",

    fontSize: "14px",

    fontWeight: "600",

    color: "#374151",
  };

  const inputStyle = {
    width: "100%",

    height: "44px",

    padding: "0 12px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    background: "#ffffff",

    color: "#111827",

    fontSize: "14px",

    outline: "none",

    boxSizing: "border-box",
  };

  const textareaStyle = {
    width: "100%",

    minHeight: "120px",

    padding: "12px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    background: "#ffffff",

    color: "#111827",

    fontSize: "14px",

    lineHeight: "1.5",

    outline: "none",

    resize: "vertical",

    boxSizing: "border-box",

    fontFamily: "inherit",
  };

  const actionsStyle = {
    display: "flex",

    justifyContent: "flex-end",

    gap: "12px",

    marginTop: "8px",

    paddingTop: "20px",

    borderTop:
      "1px solid #e5e7eb",
  };

  const cancelButtonStyle = {
    height: "44px",

    padding: "0 20px",

    border:
      "1px solid #d1d5db",

    borderRadius: "8px",

    background: "#ffffff",

    color: "#374151",

    fontSize: "14px",

    fontWeight: "600",

    cursor: "pointer",
  };

  const submitButtonStyle = {
    height: "44px",

    padding: "0 22px",

    border: "none",

    borderRadius: "8px",

    background: "#2563eb",

    color: "#ffffff",

    fontSize: "14px",

    fontWeight: "600",

    cursor: submitting
      ? "not-allowed"
      : "pointer",

    opacity: submitting
      ? 0.7
      : 1,
  };

  const errorStyle = {
    marginBottom: "16px",

    padding: "11px 13px",

    borderRadius: "8px",

    background: "#fef2f2",

    border:
      "1px solid #fecaca",

    color: "#b91c1c",

    fontSize: "13px",

    lineHeight: "1.4",
  };

  const hintStyle = {
    display: "block",

    marginTop: "6px",

    fontSize: "12px",

    color: "#6b7280",
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div
      className="modal-overlay"
      style={overlayStyle}
      onClick={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div
        className="modal-card"
        style={modalStyle}
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <div
          className="modal-header"
          style={headerStyle}
        >

          <div
            className="modal-header-icon"
            style={iconStyle}
          >
            🔧
          </div>

          <div>
            <h2 style={titleStyle}>
              Report Issue
            </h2>

            <p
              className="modal-subtitle"
              style={subtitleStyle}
            >
              Report a maintenance problem
              with a solar panel.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            style={closeButtonStyle}
            aria-label="Close"
          >
            ✕
          </button>

        </div>

        {/* =================================================
            FORM
            ================================================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* ===============================================
              SOLAR SITE
              =============================================== */}

          <div
            className="modal-field-group"
            style={fieldStyle}
          >

            <label
              htmlFor="ticket-site"
              style={labelStyle}
            >
              Solar Site
            </label>

            <select
              id="ticket-site"
              value={selectedSite}
              onChange={(e) => {

                setSelectedSite(
                  e.target.value
                );

                setSelectedPanel("");

                setError("");

              }}
              disabled={loadingSites}
              style={inputStyle}
            >

              <option value="">
                {loadingSites
                  ? "Loading sites…"
                  : "Select Solar Site"}
              </option>

              {sites.map((site) => (

                <option
                  key={site.id}
                  value={site.id}
                >
                  {site.siteName ||
                    site.name ||
                    `Site #${site.id}`}
                </option>

              ))}

            </select>

          </div>

          {/* ===============================================
              SOLAR PANEL
              =============================================== */}

          <div
            className="modal-field-group"
            style={fieldStyle}
          >

            <label
              htmlFor="ticket-panel"
              style={labelStyle}
            >
              Solar Panel
            </label>

            <select
              id="ticket-panel"
              value={selectedPanel}
              onChange={(e) => {

                setSelectedPanel(
                  e.target.value
                );

                setError("");

              }}
              disabled={
                !selectedSite ||
                loadingPanels
              }
              style={{
                ...inputStyle,

                backgroundColor:
                  !selectedSite ||
                  loadingPanels
                    ? "#f3f4f6"
                    : "#ffffff",

                color:
                  !selectedSite ||
                  loadingPanels
                    ? "#9ca3af"
                    : "#111827",

                cursor:
                  !selectedSite ||
                  loadingPanels
                    ? "not-allowed"
                    : "pointer",
              }}
            >

              <option value="">
                {loadingPanels
                  ? "Loading panels…"
                  : "Select Solar Panel"}
              </option>

              {panels.map((panel) => (

                <option
                  key={panel.id}
                  value={panel.id}
                >

                  Panel #{panel.id}

                  {panel.serialNumber
                    ? ` — ${panel.serialNumber}`
                    : ""}

                </option>

              ))}

            </select>

            {selectedSite &&
              !loadingPanels &&
              panels.length === 0 && (

                <span
                  style={hintStyle}
                  className="modal-field-hint"
                >
                  No panels are available
                  for this solar site.
                </span>

              )}

          </div>

          {/* ===============================================
              PRIORITY
              =============================================== */}

          <div
            className="modal-field-group"
            style={fieldStyle}
          >

            <label
              htmlFor="ticket-priority"
              style={labelStyle}
            >
              Priority
            </label>

            <select
              id="ticket-priority"
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value
                )
              }
              style={inputStyle}
            >

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

            </select>

          </div>

          {/* ===============================================
              DESCRIPTION
              =============================================== */}

          <div
            className="modal-field-group"
            style={fieldStyle}
          >

            <label
              htmlFor="ticket-description"
              style={labelStyle}
            >
              Issue Description
            </label>

            <textarea
              id="ticket-description"
              placeholder="Describe the fault in detail…"
              value={description}
              onChange={(e) => {

                setDescription(
                  e.target.value
                );

                setError("");

              }}
              rows={5}
              style={textareaStyle}
            />

          </div>

          {/* ===============================================
              ERROR
              =============================================== */}

          {error && (

            <div
              className="register-error"
              style={errorStyle}
            >
              {error}
            </div>

          )}

          {/* ===============================================
              ACTION BUTTONS
              =============================================== */}

          <div
            className="modal-actions"
            style={actionsStyle}
          >

            <button
              type="button"
              onClick={onClose}
              style={cancelButtonStyle}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                !selectedPanel
              }
              style={submitButtonStyle}
            >

              {submitting
                ? "Submitting…"
                : "✓ Submit Ticket"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}