import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SolarSiteForm from './SolarSiteForm';

export default function SolarSiteList() {
  const user = useSelector((s) => s.auth.user);

  const isAdmin =
    user?.role === 'SYSTEM_ADMINISTRATOR' ||
    user?.role === 'ADMIN' ||
    user?.role === 'ROLE_SYSTEM_ADMINISTRATOR';

  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('accessToken');

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  const loadSites = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/api/sites', {
        headers: getAuthHeaders(),
      });

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      setSites(data);
    } catch (error) {
      console.error('Failed to load solar sites:', error);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const filteredSites = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return sites;
    }

    return sites.filter((site) => {
      const name = String(site.siteName || '').toLowerCase();
      const coordinates = String(
        site.locationCoordinates || ''
      ).toLowerCase();

      return (
        name.includes(value) ||
        coordinates.includes(value)
      );
    });
  }, [sites, search]);

  return (
    <div className="sites-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="sites-header">

        <div className="sites-title-section">
          <h1>Solar Sites</h1>

          <p className="sites-subtitle">
            View and manage your solar energy sites.
          </p>
        </div>

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


      {/* =========================================
          ADD SITE FORM
          ========================================= */}

      {showForm && (
        <SolarSiteForm
          onClose={() => {
            setShowForm(false);
            loadSites();
          }}
        />
      )}


      {/* =========================================
          SEARCH
          ========================================= */}

      <input
        type="text"
        className="site-search"
        placeholder="Search solar sites by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* =========================================
          SITES TABLE
          ========================================= */}

      {loading ? (
        <div className="sites-table-container">
          <div className="sites-loading">
            Loading solar sites...
          </div>
        </div>
      ) : filteredSites.length === 0 ? (
        <div className="sites-table-container">
          <div className="no-sites">
            No solar sites found.
          </div>
        </div>
      ) : (
        <div className="sites-table-container">

          <table className="sites-table">

            <thead>
              <tr>
                <th>Site Name</th>
                <th>Coordinates</th>
                <th>Capacity</th>
                <th>Commissioned</th>
                <th>Panel Count</th>
                <th>Management</th>
              </tr>
            </thead>

            <tbody>

              {filteredSites.map((site) => (

                <tr key={site.id}>

                  <td>
                    <strong>
                      {site.siteName || '-'}
                    </strong>
                  </td>

                  <td>
                    {site.locationCoordinates || '-'}
                  </td>

                  <td>
                    {site.ratedCapacityKw != null
                      ? `${site.ratedCapacityKw} kW`
                      : '-'}
                  </td>

                  <td>
                    {site.commissionedDate ||
                      site.commissionDate ||
                      '-'}
                  </td>

                  <td>
                    {site.panelCount ??
                      site.panelsCount ??
                      (Array.isArray(site.panels)
                        ? site.panels.length
                        : 0)}
                  </td>

                  <td>
                    <Link
                      className="site-view-details"
                      to={`/sites/${site.id}`}
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

    </div>
  );
}