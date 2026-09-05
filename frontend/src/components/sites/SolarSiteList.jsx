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
   * Get the role from Redux.
   * Handles:
   * ADMIN
   * SYSTEM_ADMINISTRATOR
   * SYSTEM ADMINISTRATOR
   * ROLE_SYSTEM_ADMINISTRATOR
   */
  const rawRole =
    user?.role ||
    user?.roles?.[0] ||
    user?.authorities?.[0]?.authority ||
    user?.authorities?.[0] ||
    "";

  const role = String(rawRole)
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  const canAddSite =
    role === "ADMIN" ||
    role === "SYSTEM_ADMINISTRATOR" ||
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
      console.error(
        "Failed to load solar sites:",
        error
      );

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
      String(site?.siteName || "")
        .toLowerCase()
        .includes(search) ||
      String(site?.locationCoordinates || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="sites-page">

      {/* =========================================
          HEADER
         ========================================= */}

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


      {/* =========================================
          SEARCH
         ========================================= */}

      <input
        type="text"
        className="site-search"
        placeholder="Search solar sites..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />


      {/* =========================================
          LOADING
         ========================================= */}

      {loading && (
        <div className="sites-loading">
          Loading solar sites...
        </div>
      )}


      {/* =========================================
          EMPTY
         ========================================= */}

      {!loading && filteredSites.length === 0 && (
        <div className="no-sites">
          No solar sites found.
        </div>
      )}


      {/* =========================================
          SITE LIST
         ========================================= */}

      {!loading && filteredSites.length > 0 && (

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

                  {/* SITE ID */}

                  <td>
                    <strong>
                      {site.id}
                    </strong>
                  </td>


                  {/* SITE NAME */}

                  <td>
                    <strong>
                      {site.siteName || "-"}
                    </strong>
                  </td>


                  {/* COORDINATES */}

                  <td>
                    {site.locationCoordinates || "-"}
                  </td>


                  {/* CAPACITY */}

                  <td>
                    {site.ratedCapacityKw != null
                      ? `${site.ratedCapacityKw} kW`
                      : "-"}
                  </td>


                  {/* COMMISSION DATE */}

                  <td>
                    {site.commissionDate || "-"}
                  </td>


                  {/* PANELS */}

                  <td>
                    {Array.isArray(site.panels)
                      ? site.panels.length
                      : site.panelCount ?? 0}
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


      {/* =========================================
          EXISTING SOLAR SITE FORM
         ========================================= */}

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