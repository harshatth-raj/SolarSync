import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "./services/api";
import SolarSiteForm from "./SolarSiteForm";

export default function SolarSiteList() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const role = String(
    user?.role ||
      user?.roles?.[0] ||
      user?.authorities?.[0]?.authority ||
      user?.authorities?.[0] ||
      ""
  )
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  const hideAddSite = role === "SOLAR_OPERATOR";

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

        const response = await api.get("/api/sites", config);

        if (!mounted) return;

        if (Array.isArray(response?.data)) {
          setSites(response.data);
        } else {
          setSites([]);
        }
      } catch (error) {
        console.error("Failed to load solar sites:", error);

        if (mounted) {
          setSites([]);
        }
      }
    };

    loadSites();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredSites = sites.filter((site) => {
    const search = searchTerm.toLowerCase();

    return (
      String(site.id).includes(search) ||
      String(site.siteName || "")
        .toLowerCase()
        .includes(search) ||
      String(site.locationCoordinates || "")
        .toLowerCase()
        .includes(search)
    );
  });

  return (
    <div className="sites-page">

      {/* HEADER */}

      <div className="sites-header">

        <div className="sites-title-section">
          <h1>Solar Sites</h1>

          <p className="sites-subtitle">
            View and manage your solar energy sites.
          </p>
        </div>

        {!hideAddSite && (
          <button
            type="button"
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}

      </div>

      {/* SEARCH */}

      <input
        type="text"
        className="site-search"
        placeholder="Search solar sites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* SITE LIST */}

      {filteredSites.length === 0 ? (

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

                  <td>
                    {site.id}
                  </td>

                  <td>
                    <strong>
                      {site.siteName}
                    </strong>
                  </td>

                  <td>
                    {site.locationCoordinates || "N/A"}
                  </td>

                  <td>
                    {site.ratedCapacityKw || 0} kW
                  </td>

                  <td>
                    {site.commissionDate || "N/A"}
                  </td>

                  <td>
                    {Array.isArray(site.panels)
                      ? site.panels.length
                      : 0}
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

      {/* ADD SITE FORM */}

      {showForm && (
        <SolarSiteForm
          onClose={() => {
            setShowForm(false);

            // Reload the page data after adding a site
            window.location.reload();
          }}
        />
      )}

    </div>
  );
}