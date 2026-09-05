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
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const request = axios.get('/api/sites');

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
  }, []);

  const filteredSites = sites.filter((site) => {
    const query = searchQuery.toLowerCase();

    return (
      String(site.siteName || '')
        .toLowerCase()
        .includes(query) ||
      String(site.locationCoordinates || '')
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="sites-page">

      {/* PAGE HEADER */}

      <div className="sites-page-header">

        <h1>Solar Sites</h1>

        {isAdmin && (
          <button
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}

      </div>

      {/* SEARCH */}

      <input
        className="site-search"
        type="text"
        placeholder="Search solar sites by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* ADD SITE FORM */}

      {showForm && (
        <div className="modal-overlay">

          <div className="modal-card">

            <SolarSiteForm
              onClose={() => setShowForm(false)}
            />

          </div>

        </div>
      )}

      {/* SITE TABLE */}

      {filteredSites.length === 0 ? (

        <div className="no-sites">
          No solar sites found.
        </div>

      ) : (

        <div className="sites-table-container">

          <table className="sites-table">

            <thead>

              <tr>
                <th>Site Identifier</th>
                <th>Coordinates</th>
                <th>Capacity (kW)</th>
                <th>Generation Rate</th>
                <th>Commissioned Date</th>
                <th>Panel Count</th>
                <th>Management</th>
              </tr>

            </thead>

            <tbody>

              {filteredSites.map((site) => (

                <tr key={site.id}>

                  {/* SITE NAME */}

                  <td>
                    <strong className="site-name">
                      {site.siteName}
                    </strong>
                  </td>

                  {/* COORDINATES */}

                  <td>
                    {site.locationCoordinates || '-'}
                  </td>

                  {/* CAPACITY */}

                  <td>
                    {site.ratedCapacityKw || 0}
                  </td>

                  {/* GENERATION RATE */}

                  <td>

                    <div className="generation-cell">

                      <div className="generation-bar">

                        <div
                          className="generation-progress"
                          style={{
                            width: `${Math.min(
                              Number(site.generationRate || 0),
                              100
                            )}%`
                          }}
                        />

                      </div>

                      <span>
                        {site.generationRate || 0}%
                      </span>

                    </div>

                  </td>

                  {/* COMMISSIONED */}

                  <td>
                    {site.commissionedDate || '-'}
                  </td>

                  {/* PANEL COUNT */}

                  <td>
                    {site.panelCount ?? 0}
                  </td>

                  {/* MANAGEMENT */}

                  <td>

                    <a
                      className="site-view-details"
                      href={`/sites/${site.id}`}
                    >
                      View Details
                    </a>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}