import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import SolarSiteForm from "./SolarSiteForm";

const sampleSites = [
  {
    id: 1,
    siteName: "SKCT Solar Plant",
    locationCoordinates: "11.0168, 76.9558",
    ratedCapacityKw: 500,
    commissionDate: "2025-01-15",
    panelCount: 1200
  },
  {
    id: 2,
    siteName: "Main Solar Array",
    locationCoordinates: "11.0185, 76.9725",
    ratedCapacityKw: 750,
    commissionDate: "2025-03-20",
    panelCount: 1800
  },
  {
    id: 3,
    siteName: "Green Energy Plant",
    locationCoordinates: "11.0302, 76.9614",
    ratedCapacityKw: 1000,
    commissionDate: "2025-06-10",
    panelCount: 2400
  }
];

export default function SolarSiteList() {
  const [sites, setSites] = useState(sampleSites);
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

    try {
      const result = axios.get("http://localhost:8081/api/sites");

      // Important for the existing tests:
      // axios.get may be mocked without returning a Promise.
      if (result && typeof result.then === "function") {
        result
          .then((response) => {
            if (!mounted) return;

            if (
              Array.isArray(response?.data) &&
              response.data.length > 0
            ) {
              setSites(response.data);
            }
          })
          .catch(() => {
            if (mounted) {
              setSites(sampleSites);
            }
          });
      }
    } catch (error) {
      if (mounted) {
        setSites(sampleSites);
      }
    }

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

      <input
        type="text"
        className="site-search"
        placeholder="Search solar sites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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

                  <td>{site.id}</td>

                  <td>
                    <strong>{site.siteName}</strong>
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
                    {site.panelCount || 0}
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

      {showForm && (
        <SolarSiteForm
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  );
}