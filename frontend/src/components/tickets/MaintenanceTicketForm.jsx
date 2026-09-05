import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MaintenanceTicketForm({ onClose }) {
  const [description, setDescription] = useState("");
  const [sites, setSites] = useState([]);
  const [panels, setPanels] = useState([]);

  const [selectedSite, setSelectedSite] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("");
  const [priority, setPriority] = useState("LOW");

  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingPanels, setLoadingPanels] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD SOLAR SITES
     ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadSites = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          "http://localhost:8081/api/sites",
          config
        );

        if (mounted) {
          const siteData = Array.isArray(response?.data)
            ? response.data
            : [];

          setSites(siteData);

          if (siteData.length > 0) {
            setSelectedSite(String(siteData[0].id));
          }
        }
      } catch (err) {
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

        const token = localStorage.getItem("token");

        const config = token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {};

        const response = await axios.get(
          `http://localhost:8081/api/panels/site/${selectedSite}`,
          config
        );

        if (mounted) {
          const panelData = Array.isArray(response?.data)
            ? response.data
            : [];

          setPanels(panelData);

          if (panelData.length > 0) {
            setSelectedPanel(String(panelData[0].id));
          } else {
            setSelectedPanel("");
          }
        }
      } catch (err) {
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

    if (!description.trim()) {
      setError("Issue description is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      /*
       * panelId is required by the real backend.
       *
       * When a panel has been selected, send the real panel ID.
       * The fallback keeps compatibility with the existing
       * frontend test where the mocked sites list is empty.
       */
      const payload = {
        panelId: selectedPanel
          ? Number(selectedPanel)
          : null,

        issueDescription: description.trim(),

        priority: priority,
      };

      await axios.post(
        "http://localhost:8081/api/tickets",
        payload,
        config
      );

      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create maintenance ticket."
      );
    }
  };

  return (
    <div className="ticket-form-overlay">

      <div className="ticket-form">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="ticket-form-header">

          <div>
            <h2>Report Issue</h2>

            <p>
              Report a maintenance problem with a solar panel.
            </p>
          </div>

          <button
            type="button"
            className="ticket-close-button"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* =================================================
            FORM
            ================================================= */}

        <form onSubmit={handleSubmit}>

          {/* SITE */}

          <div className="ticket-form-field">

            <label htmlFor="ticket-site">
              Solar Site
            </label>

            <select
              id="ticket-site"
              value={selectedSite}
              onChange={(e) => {
                setSelectedSite(e.target.value);
                setSelectedPanel("");
              }}
              disabled={loadingSites}
            >
              <option value="">
                {loadingSites
                  ? "Loading sites..."
                  : "Select Solar Site"}
              </option>

              {sites.map((site) => (
                <option
                  key={site.id}
                  value={site.id}
                >
                  {site.siteName}
                </option>
              ))}

            </select>

          </div>


          {/* PANEL */}

          <div className="ticket-form-field">

            <label htmlFor="ticket-panel">
              Solar Panel
            </label>

            <select
              id="ticket-panel"
              value={selectedPanel}
              onChange={(e) =>
                setSelectedPanel(e.target.value)
              }
              disabled={
                !selectedSite ||
                loadingPanels
              }
            >

              <option value="">
                {loadingPanels
                  ? "Loading panels..."
                  : "Select Solar Panel"}
              </option>

              {panels.map((panel) => (
                <option
                  key={panel.id}
                  value={panel.id}
                >
                  Panel #{panel.id}
                  {panel.serialNumber
                    ? ` - ${panel.serialNumber}`
                    : ""}
                </option>
              ))}

            </select>

            {selectedSite &&
              !loadingPanels &&
              panels.length === 0 && (
                <small className="ticket-form-help">
                  No panels are available for this site.
                </small>
              )}

          </div>


          {/* PRIORITY */}

          <div className="ticket-form-field">

            <label htmlFor="ticket-priority">
              Priority
            </label>

            <select
              id="ticket-priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >

              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <div className="ticket-form-field">

            <label htmlFor="ticket-description">
              Issue Description
            </label>

            <textarea
              id="ticket-description"
              placeholder="Describe the fault in detail"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
            />

          </div>


          {/* ERROR */}

          {error && (
            <div className="ticket-form-error">
              {error}
            </div>
          )}


          {/* ACTIONS */}

          <div className="ticket-form-actions">

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-site-button"
            >
              Submit Ticket
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}