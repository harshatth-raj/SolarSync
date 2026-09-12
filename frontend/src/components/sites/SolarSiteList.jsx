import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../../services/api";
import SolarSiteForm from "./SolarSiteForm";

export default function SolarSiteList() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const loadSites = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/sites");
      setSites(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to load solar sites:", error);
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const handleFormClose = async () => {
    setShowForm(false);
    await loadSites();
  };

  const filteredSites = sites.filter((site) => {
    const search = searchTerm.toLowerCase();
    return (
      String(site.id).includes(search) ||
      String(site.siteName || "").toLowerCase().includes(search) ||
      String(site.locationCoordinates || "").toLowerCase().includes(search)
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
        placeholder="🔍  Search by name, ID or coordinates…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* SITE LIST */}
      {loading ? (
        <div className="sites-loading">Loading sites…</div>
      ) : filteredSites.length === 0 ? (
        <div className="no-sites">No solar sites found.</div>
      ) : (
        <div className="sites-table-container">
          <table className="sites-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Site Name</th>
                <th>Coordinates</th>
                <th>Capacity</th>
                <th>Commission Date</th>
                <th>Panels</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => (
                <tr key={site.id}>
                  <td>{site.id}</td>
                  <td>
                    <strong>{site.siteName}</strong>
                  </td>
                  <td>{site.locationCoordinates || "N/A"}</td>
                  <td>
                    <span className="capacity-badge">
                      {site.ratedCapacityKw || 0} kW
                    </span>
                  </td>
                  <td>{site.commissionDate || "N/A"}</td>
                  <td>
                    <span className="panel-count-badge">
                      {Array.isArray(site.panels) ? site.panels.length : 0}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/sites/${site.id}`}
                      className="site-view-details"
                    >
                      View Details →
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
        <SolarSiteForm onClose={handleFormClose} />
      )}

    </div>
  );
}
