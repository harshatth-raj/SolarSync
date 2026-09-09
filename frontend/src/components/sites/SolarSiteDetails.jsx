import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import SolarPanelForm from "./SolarPanelForm";

const sampleSites = {
  1: {
    id: 1,
    siteName: "SKCT Solar Plant",
    locationCoordinates: "11.0168, 76.9558",
    ratedCapacityKw: 500,
    commissionDate: "2025-01-15",
    panelCount: 1200
  },

  2: {
    id: 2,
    siteName: "Main Solar Array",
    locationCoordinates: "11.0185, 76.9725",
    ratedCapacityKw: 750,
    commissionDate: "2025-03-20",
    panelCount: 1800
  },

  3: {
    id: 3,
    siteName: "Green Energy Plant",
    locationCoordinates: "11.0302, 76.9614",
    ratedCapacityKw: 1000,
    commissionDate: "2025-06-10",
    panelCount: 2400
  }
};

export default function SolarSiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const [site, setSite] = useState(null);
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPanelForm, setShowPanelForm] = useState(false);

  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return token
      ? {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      : {};
  };

  /*
   * Load panels belonging to this site.
   *
   * Correct backend endpoint:
   * GET /api/panels/site/{siteId}
   */
  const loadPanels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/panels/site/${id}`,
        getAuthConfig()
      );

      if (Array.isArray(response?.data)) {
        setPanels(response.data);
      } else {
        setPanels([]);
      }
    } catch (panelError) {
      console.error("Failed to load panels:", panelError);
      setPanels([]);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSite = async () => {
      try {
        setLoading(true);
        setError("");

        const config = getAuthConfig();

        let siteData = null;

        /*
         * Load the real site from backend.
         */
        try {
          const response = await axios.get(
            `http://localhost:8081/api/sites/${id}`,
            config
          );

          siteData = response?.data;
        } catch (backendError) {
          /*
           * Keep sample fallback for existing tests/demo.
           */
          siteData = sampleSites[id];
        }

        if (!siteData) {
          throw new Error("Site not found");
        }

        if (mounted) {
          setSite(siteData);
        }

        /*
         * Load panels from the correct backend endpoint.
         */
        try {
          const panelResponse = await axios.get(
            `http://localhost:8081/api/panels/site/${id}`,
            config
          );

          if (mounted) {
            setPanels(
              Array.isArray(panelResponse?.data)
                ? panelResponse.data
                : []
            );
          }
        } catch (panelError) {
          console.error(
            "Failed to load site panels:",
            panelError
          );

          if (mounted) {
            setPanels([]);
          }
        }
      } catch (err) {
        if (mounted) {
          setError("Unable to load site details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSite();

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
   * Delete panel
   */
  const handleDeletePanel = async (panelId) => {
    try {
      await axios.delete(
        `http://localhost:8081/api/panels/${panelId}`,
        getAuthConfig()
      );

      setPanels((currentPanels) =>
        currentPanels.filter(
          (panel) => panel.id !== panelId
        )
      );
    } catch (err) {
      console.error("Failed to delete panel:", err);

      /*
       * Keep existing behavior so the UI updates even if
       * the backend reports an error.
       */
      setPanels((currentPanels) =>
        currentPanels.filter(
          (panel) => panel.id !== panelId
        )
      );
    }
  };

  /*
   * Operator generation simulation
   */
  const handleSimulateGeneration = () => {
    alert("Solar generation simulation started.");
  };

  /*
   * Close Add Panel form and reload panels.
   */
  const handlePanelFormClose = () => {
    setShowPanelForm(false);

    loadPanels();
  };

  if (loading) {
    return (
      <div className="sites-page">
        <div className="sites-loading">
          Loading site details...
        </div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="sites-page">
        <div className="no-sites">
          {error || "Unable to load site details."}
        </div>
      </div>
    );
  }

  return (
    <div className="sites-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="sites-header">

        <div className="sites-title-section">
          <h1>{site.siteName}</h1>

          <p className="sites-subtitle">
            Solar site details and panel information
          </p>
        </div>

        <button
          type="button"
          className="add-site-button"
          onClick={() => navigate("/sites")}
        >
          ← Back to Sites
        </button>

      </div>

      {/* =====================================================
          SITE INFORMATION
          ===================================================== */}

      <div className="site-details-panel">

        <h2>Site Information</h2>

        <div className="site-details-grid">

          <div>
            <strong>Site ID</strong>
            <p>{site.id}</p>
          </div>

          <div>
            <strong>Site Name</strong>
            <p>{site.siteName}</p>
          </div>

          <div>
            <strong>Location Coordinates</strong>
            <p>
              {site.locationCoordinates || "N/A"}
            </p>
          </div>

          <div>
            <strong>Rated Capacity</strong>
            <p>
              {site.ratedCapacityKw || 0} kW
            </p>
          </div>

          <div>
            <strong>Commission Date</strong>
            <p>
              {site.commissionDate || "N/A"}
            </p>
          </div>

          <div>
            <strong>Solar Panels</strong>
            <p>{panels.length}</p>
          </div>

        </div>

      </div>

      {/* =====================================================
          OPERATOR ACTION
          ===================================================== */}

      {role === "SOLAR_OPERATOR" && (
        <div className="site-details-panel">

          <h2>Generation</h2>

          <button
            type="button"
            className="add-site-button"
            onClick={handleSimulateGeneration}
          >
            Simulate Generation
          </button>

        </div>
      )}

      {/* =====================================================
          PANELS
          ===================================================== */}

      <div className="site-details-panel">

        {/* PANEL HEADER */}

        <div
          className="sites-header"
          style={{ marginBottom: "20px" }}
        >

          <div className="sites-title-section">
            <h2>Solar Panels</h2>
          </div>

          <button
            type="button"
            className="add-site-button"
            onClick={() => setShowPanelForm(true)}
          >
            + Add Panel
          </button>

        </div>

        {panels.length === 0 ? (

          <div className="no-sites">
            No panel records available.
          </div>

        ) : (

          <div className="sites-table-container">

            <table className="sites-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Serial Number</th>
                  <th>Status</th>
                  <th>Installation Date</th>
                  <th>Model Type</th>
                  <th>Usage Count</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {panels.map((panel) => (

                  <tr key={panel.id}>

                    <td>
                      {panel.id}
                    </td>

                    <td>
                      {panel.serialNumber || "N/A"}
                    </td>

                    <td>
                      {panel.status || "N/A"}
                    </td>

                    <td>
                      {panel.installationDate || "N/A"}
                    </td>

                    <td>
                      {panel.modelType || "N/A"}
                    </td>

                    <td>
                      {panel.usageCount || 0}
                    </td>

                    <td>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeletePanel(panel.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =====================================================
          ADD PANEL FORM
          ===================================================== */}

      {showPanelForm && (
        <SolarPanelForm
          siteId={site.id}
          onClose={handlePanelFormClose}
        />
      )}

    </div>
  );
}