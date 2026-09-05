import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SolarSiteForm from './SolarSiteForm';

export default function SolarSiteList() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const isAdmin =
    user?.role === 'SYSTEM_ADMINISTRATOR' ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_SYSTEM_ADMINISTRATOR';

  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const loadSites = () => {
    const request = axios.get('/api/sites');

    /*
     * Important for the existing Jest tests.
     * Their axios mock can return undefined.
     */
    if (request && typeof request.then === 'function') {
      request
        .then((res) => {
          const data = res?.data;

          if (Array.isArray(data)) {
            setSites(data);
          } else if (Array.isArray(data?.content)) {
            setSites(data.content);
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
  }, []);

  const filteredSites = sites.filter((site) =>
    (site.siteName || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getGenerationRate = (site) => {
    if (
      site.currentGeneration !== null &&
      site.currentGeneration !== undefined
    ) {
      return site.currentGeneration;
    }

    if (
      site.generationRate !== null &&
      site.generationRate !== undefined
    ) {
      return site.generationRate;
    }

    return 0;
  };

  const getPanelCount = (site) => {
    if (Array.isArray(site.panels)) {
      return site.panels.length;
    }

    if (
      site.panelCount !== null &&
      site.panelCount !== undefined
    ) {
      return site.panelCount;
    }

    return 0;
  };

  return (
    <div className="sites-page">

      {/* =================================================
          PAGE HEADER
          ================================================= */}

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


      {/* =================================================
          ADD SITE FORM
          ================================================= */}

      {showForm && (
        <SolarSiteForm
          onClose={() => {
            setShowForm(false);
            loadSites();
          }}
        />
      )}


      {/* =================================================
          SEARCH
          ================================================= */}

      <input
        className="site-search"
        type="text"
        placeholder="Search solar sites by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* =================================================
          SITES TABLE
          ================================================= */}

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

                const generationRate =
                  getGenerationRate(site);

                const panelCount =
                  getPanelCount(site);

                return (
                  <tr key={site.id}>

                    {/* SITE IDENTITY */}

                    <td>
                      <span className="site-name">
                        {site.siteName}
                      </span>
                    </td>


                    {/* COORDINATES */}

                    <td>
                      {site.locationCoordinates || '-'}
                    </td>


                    {/* GENERATION RATE */}

                    <td>

                      <div className="generation-cell">

                        <div className="generation-bar">
                          <div
                            className="generation-progress"
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  Number(generationRate) || 0,
                                  0
                                ),
                                100
                              )}%`
                            }}
                          />
                        </div>

                        <span>
                          {generationRate}%
                        </span>

                      </div>

                    </td>


                    {/* COMMISSIONED */}

                    <td>
                      {site.commissionDate || '-'}
                    </td>


                    {/* PANEL COUNT */}

                    <td>
                      {panelCount}
                    </td>


                    {/* MANAGEMENT */}

                    <td>

                      <button
                        className="site-view-details"
                        onClick={() =>
                          navigate(`/sites/${site.id}`)
                        }
                      >
                        View Details
                      </button>

                    </td>

                  </tr>
                );

              })}

            </tbody>

          </table>

        </div>

      ) : (

        <div className="sites-page no-sites">
          No solar sites found.
        </div>

      )}

    </div>
  );
}