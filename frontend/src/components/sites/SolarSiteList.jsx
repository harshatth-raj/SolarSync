import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import SolarSiteForm from "./SolarSiteForm";

export default function SolarSiteList() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.user);

  const role = user?.role;

  const canAddSite =
    role === "SYSTEM_ADMINISTRATOR" ||
    role === "ADMIN";

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/sites"
      );

      if (Array.isArray(response?.data)) {
        setSites(response.data);
      } else {
        setSites([]);
      }
    } catch (error) {
      console.error("Failed to load solar sites:", error);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sites.filter((site) => {
    const search = searchTerm.toLowerCase();

    return (
      site.siteName?.toLowerCase().includes(search) ||
      site.locationCoordinates
        ?.toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="sites-page">

      {/* =========================
          SITES HEADER
         ========================= */}

      <div className="sites-header">

        <div className="sites-title-section">
          <h1>Solar Sites</h1>

          <p className="sites-subtitle">
            View and manage your solar energy sites.
          </p>
        </div>

        {canAddSite && (
          <button
            type="button"
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}

      </div>


      {/* =========================
          SEARCH
         ========================= */}

      <input
        type="text"
        className="site-search"
        placeholder="Search solar sites..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />


      {/* =========================
          SITES
         ========================= */}

      {loading ? (
        <div className="sites-loading">
          Loading solar sites...
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="no-sites">
          No solar sites found.
        </div>
      ) : (
        <div className="sites-table-container">

          <table className="sites-table">

            <thead>
              <tr>
                <th>Site Name</th>
                <th>Coordinates</th>
                <th>Rated Capacity</th>
                <th>Commission Date</th>
                <th>Panels</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredSites.map((site) => (
                <tr key={site.id}>

                  <td>
                    <strong>
                      {site.siteName}
                    </strong>
                  </td>

                  <td>
                    {site.locationCoordinates || "-"}
                  </td>

                  <td>
                    {site.ratedCapacityKw != null
                      ? `${site.ratedCapacityKw} kW`
                      : "-"}
                  </td>

                  <td>
                    {site.commissionDate || "-"}
                  </td>

                  <td>
                    {site.panels?.length ??
                      site.panelCount ??
                      0}
                  </td>

                  <td>
                    <Link
                      to={`/sites/${site.id}`}
                      className="site-view-details"
                    >
                      View Details
                    </Link>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}


      {/* =========================
          EXISTING ADD SITE FORM
         ========================= */}

      {showForm && (
        <SolarSiteForm
          onClose={() => {
            setShowForm(false);
            loadSites();
          }}
        />
      )}

    </div>
  );
}