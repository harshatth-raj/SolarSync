import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SolarSiteForm from './SolarSiteForm';

export default function SolarSiteList() {
  const user = useSelector((s) => s.auth.user);

  const isAdmin =
    user?.role === 'SYSTEM_ADMINISTRATOR' ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_SYSTEM_ADMINISTRATOR';

  const [sites, setSites] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const request = axios.get('/api/sites', {
      headers: user?.token
        ? {
            Authorization: `Bearer ${user.token}`
          }
        : {}
    });

    if (request && typeof request.then === 'function') {
      request
        .then((res) => {
          setSites(
            Array.isArray(res.data)
              ? res.data
              : []
          );
        })
        .catch(() => {
          setSites([]);
        });
    }
  }, [user]);

  return (
    <div className="sites-page">

      {/* TOP ACTION */}

      <div className="sites-top-bar">
        <a href="/sites" className="back-link">
          ← Back to Sites
        </a>

        {isAdmin && (
          <button
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}
      </div>

      {/* ADD SITE FORM */}

      {showForm && (
        <SolarSiteForm
          onClose={() => setShowForm(false)}
        />
      )}

      {/* SITE DETAILS */}

      {sites.map((site) => (
        <div className="site-details" key={site.id}>

          {/* SITE HEADER CARD */}

          <div className="site-header-card">

            <div className="site-main-info">

              <h2>{site.siteName}</h2>

              <p>
                Coordinates: {site.locationCoordinates}
              </p>

            </div>

            <div className="site-info-item">
              <span>RATED CAPACITY</span>
              <strong>
                {site.ratedCapacityKw} kW
              </strong>
            </div>

            <div className="site-info-item">
              <span>PANELS</span>
              <strong>
                {site.panels?.length || 0}
              </strong>
            </div>

            <div className="site-info-item">
              <span>COMMISSIONED</span>
              <strong>
                {site.commissionDate}
              </strong>
            </div>

            <a
              href={`/sites/${site.id}`}
              className="view-details-button"
            >
              View Details
            </a>

          </div>

          {/* PANELS SECTION */}

          <div className="panels-section">

            <div className="panels-header">

              <h2>Solar Panels</h2>

              {isAdmin && (
                <button className="add-panel-button">
                  + Add Panel
                </button>
              )}

            </div>

            {/* PANEL TABLE */}

            <div className="panel-table-container">

              <table className="panel-table">

                <thead>
                  <tr>
                    <th>Serial Number</th>
                    <th>Model</th>
                    <th>Status</th>
                    <th>Usage (hrs)</th>
                    <th>Installation</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {site.panels &&
                  site.panels.length > 0 ? (

                    site.panels.map((panel) => (

                      <tr key={panel.id}>

                        <td>
                          {panel.serialNumber}
                        </td>

                        <td>
                          {panel.modelType}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${String(
                              panel.status || ''
                            ).toLowerCase()}`}
                          >
                            {panel.status}
                          </span>
                        </td>

                        <td>
                          <div className="usage-cell">
                            <div className="usage-bar">
                              <div
                                className="usage-progress"
                                style={{
                                  width: `${Math.min(
                                    panel.usageCount || 0,
                                    100
                                  )}%`
                                }}
                              />
                            </div>

                            <span>
                              {panel.usageCount || 0}
                            </span>
                          </div>
                        </td>

                        <td>
                          {panel.installationDate}
                        </td>

                        <td>
                          {panel.capacity} kW
                        </td>

                        <td>

                          <button className="action-button">
                            Edit
                          </button>

                          <button className="delete-button">
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td
                        colSpan="7"
                        className="no-panels"
                      >
                        No solar panels found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      ))}

      {/* NO SITES */}

      {sites.length === 0 && (
        <div className="no-sites">
          No solar sites found.
        </div>
      )}

    </div>
  );
}