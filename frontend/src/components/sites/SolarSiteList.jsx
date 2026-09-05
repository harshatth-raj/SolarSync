import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SolarSiteForm from "./SolarSiteForm";

export default function SolarSiteList() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.user);

  const role = user?.role;

  const canAddSite =
    role === "SYSTEM_ADMINISTRATOR" ||
    role === "ADMIN" ||
    !role;

  // Sample solar sites for displaying the Sites page
  const sites = [
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

  const filteredSites = sites.filter((site) => {
    const search = searchTerm.toLowerCase();

    return (
      site.siteName.toLowerCase().includes(search) ||
      site.locationCoordinates.toLowerCase().includes(search) ||
      String(site.id).includes(search)
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
                    {site.locationCoordinates}
                  </td>

                  <td>
                    {site.ratedCapacityKw} kW
                  </td>

                  <td>
                    {site.commissionDate}
                  </td>

                  <td>
                    {site.panelCount}
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


      {/* EXISTING ADD SITE FORM */}
      {showForm && (
        <SolarSiteForm
          onClose={() => setShowForm(false)}
        />
      )}

    </div>
  );
}