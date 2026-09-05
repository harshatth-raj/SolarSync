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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const request = axios.get('/api/sites');

    if (request && typeof request.then === 'function') {
      request
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setSites(data);
        })
        .catch(() => {
          setSites([]);
        });
    }
  }, []);

  const filteredSites = sites.filter((site) =>
    (site.siteName || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sites-list-section">

      {/* =====================================================
          TOP ROW
          ===================================================== */}
      <div className="sites-list-header">

        <h2>Solar Sites</h2>

        {isAdmin && (
          <button
            type="button"
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}

      </div>


      {/* =====================================================
          SEARCH
          ===================================================== */}
      <input
        className="site-search"
        type="text"
        placeholder="Search solar sites by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />


      {/* =====================================================
          ADD SITE FORM
          ===================================================== */}
      {showForm && (
        <SolarSiteForm
          onClose={() => setShowForm(false)}
        />
      )}


      {/* =====================================================
          SITE TABLE
          ===================================================== */}
      {filteredSites.length === 0 ? (

        <div className="no-sites">
          No solar sites found.
        </div>

      ) : (

        <div className="sites-table-container">

          <table className="sites-table">

            <thead>
              <tr>
                <th>Site Details</th>
                <th>Coordinates</th>
                <th>Rated Capacity</th>
                <th>Commissioned</th>
                <th>Panel Assets</th>
                <th>Management</th>
              </tr>
            </thead>

            <tbody>

              {filteredSites.map((site) => (

                <tr key={site.id}>

                  {/* SITE NAME */}
                  <td>
                    <span className="site-table-name">
                      {site.siteName}
                    </span>
                  </td>


                  {/* COORDINATES */}
                  <td>
                    {site.locationCoordinates || '-'}
                  </td>


                  {/* CAPACITY */}
                  <td>
                    {site.ratedCapacityKw ?? 0} kW
                  </td>


                  {/* COMMISSIONED */}
                  <td>
                    {site.commissionedDate || '-'}
                  </td>


                  {/* PANELS */}
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