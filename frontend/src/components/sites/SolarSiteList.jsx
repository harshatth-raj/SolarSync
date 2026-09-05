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

  /*
   * Normalize the role so values such as:
   * SYSTEM_ADMINISTRATOR
   * SYSTEM ADMINISTRATOR
   * system_administrator
   * ADMIN
   * admin
   * are handled correctly.
   */
  const role = String(user?.role || "")
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();

  const canAddSite =
    role === "SYSTEM_ADMINISTRATOR" ||
    role === "ADMIN" ||
    role === "SYSTEM_ADMIN";

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/sites"
      );

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setSites(data);
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
      String(site?.id || "")
        .toLowerCase()
        .includes(search) ||
      site?.siteName
        ?.toLowerCase()
        .includes(search) ||
      site?.locationCoordinates
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
          SITES LIST
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
                <th>Site ID</th>
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

                  {/* SITE ID FROM BACKEND */}
                  <td>
                    {site.id}
                  </td>

                  {/* SITE NAME FROM BACKEND */}
                  <td>
                    <strong>
                      {site.siteName || "-"}
                    </strong>
                  </td>

                  {/* COORDINATES FROM BACKEND */}
                  <td>
                    {site.locationCoordinates || "-"}
                  </td>

                  {/* CAPACITY FROM BACKEND */}
                  <td>
                    {site.ratedCapacityKw != null
                      ? `${site.ratedCapacityKw} kW`
                      : "-"}
                  </td>

                  {/* COMMISSION DATE FROM BACKEND */}
                  <td>
                    {site.commissionDate || "-"}
                  </td>

                  {/* PANEL COUNT */}
                  <td>
                    {site.panels?.length ??
                      site.panelCount ??
                      0}
                  </td>

                  {/* DETAILS */}
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
            setLoading(true);
            loadSites();
          }}
        />
      )}

    </div>
  );
}