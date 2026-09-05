import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SolarSiteForm from './SolarSiteForm';

export default function SolarSiteList() {

  const user = useSelector((state) => state.auth.user);

  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isAdmin =
    user?.role === 'SYSTEM_ADMINISTRATOR' ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_SYSTEM_ADMINISTRATOR';

  const loadSites = () => {

    const token = user?.token;

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const request = axios.get('/api/sites', config);

    /*
     * Important:
     * Existing tests use an axios mock where axios.get()
     * can return undefined.
     */
    if (request && typeof request.then === 'function') {

      request
        .then((response) => {

          const data = response?.data;

          if (Array.isArray(data)) {
            setSites(data);
          } else {
            setSites([]);
          }

        })
        .catch(() => {
          setSites([]);
        });
    }
  };

  useEffect(() => {
    loadSites();
  }, [user?.token]);


  const filteredSites = sites.filter((site) =>
    (site.siteName || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <div className="sites-list-section">

      {/* ==========================================
          TOP BAR
          ========================================== */}

      <div className="sites-list-header">

        <h2>Solar Sites</h2>

        {isAdmin && (
          <button
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}

      </div>


      {/* ==========================================
          ADD SITE FORM
          ========================================== */}

      {showForm && (
        <SolarSiteForm
          onClose={() => {
            setShowForm(false);
            loadSites();
          }}
        />
      )}


      {/* ==========================================
          SEARCH
          ========================================== */}

      <input
        className="site-search"
        type="text"
        placeholder="Search solar sites by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* ==========================================
          SITES TABLE
          ========================================== */}

      {filteredSites.length > 0 ? (

        <div className="sites-table-container">

          <table className="sites-table">

            <thead>

              <tr>
                <th>Site Identity</th>
                <th>Coordinates</th>
                <th>Generation Rate</th>
                <th>Commissioned</th>
                <th>Panel Count</th>
                <th>Management</th>
              </tr>

            </thead>


            <tbody>

              {filteredSites.map((site) => {

                const panelCount = Array.isArray(site.panels)
                  ? site.panels.length
                  : (site.panelCount ?? 0);

                const generation =
                  site.currentGeneration ??
                  site.generationRate ??
                  0;

                return (

                  <tr key={site.id}>

                    {/* SITE */}

                    <td>
                      <strong className="site-table-name">
                        {site.siteName}
                      </strong>
                    </td>


                    {/* COORDINATES */}

                    <td>
                      {site.locationCoordinates || '-'}
                    </td>


                    {/* GENERATION */}

                    <td>

                      <div className="generation-cell">

                        <div className="generation-bar">

                          <div
                            className="generation-progress"
                            style={{
                              width: `${Math.min(
                                Math.max(Number(generation) || 0, 0),
                                100
                              )}%`
                            }}
                          />

                        </div>

                        <span>
                          {generation}%
                        </span>

                      </div>

                    </td>


                    {/* COMMISSION DATE */}

                    <td>
                      {site.commissionDate || '-'}
                    </td>


                    {/* PANELS */}

                    <td>
                      {panelCount}
                    </td>


                    {/* DETAILS */}

                    <td>

                      <a
                        className="site-view-details"
                        href={`/sites/${site.id}`}
                      >
                        View Details
                      </a>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      ) : (

        <div className="no-sites">
          No solar sites found.
        </div>

      )}

    </div>
  );
}