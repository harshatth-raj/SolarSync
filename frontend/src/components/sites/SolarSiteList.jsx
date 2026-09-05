import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import SolarSiteForm from './SolarSiteForm';

export default function SolarSiteList() {
  const user = useSelector((state) => state.auth.user);

  const [sites, setSites] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const role = user?.role?.toString()?.toUpperCase();

  const isAdmin =
    role === 'SYSTEM_ADMINISTRATOR' ||
    role === 'ADMIN' ||
    role === 'ROLE_SYSTEM_ADMINISTRATOR';

  useEffect(() => {
    const loadSites = async () => {
      try {
        const token = user?.token;

        const response = await axios.get(
          'http://localhost:8081/api/sites',
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {}
        );

        setSites(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error('Failed to load sites:', error);
        setSites([]);
      }
    };

    loadSites();
  }, [user]);

  const filteredSites = sites.filter((site) =>
    site.siteName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="sites-page">

      {/* TOP HEADER */}
      <div className="sites-header">

        <div>
          <h1>Solar Sites</h1>

          <p className="sites-subtitle">
            View and manage your solar energy sites.
          </p>
        </div>

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


      {/* SEARCH */}
      <input
        className="site-search"
        type="text"
        placeholder="Search solar sites by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* SITE TABLE */}
      {filteredSites.length > 0 ? (

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
                      {site.siteName}
                    </strong>
                  </td>

                  <td>
                    {site.locationCoordinates || '-'}
                  </td>

                  <td>
                    {site.ratedCapacityKw
                      ? `${site.ratedCapacityKw} kW`
                      : '-'}
                  </td>

                  <td>
                    {site.commissionedDate ||
                      site.commissioningDate ||
                      '-'}
                  </td>

                  <td>
                    {site.panelCount ??
                      site.panels?.length ??
                      0}
                  </td>

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

      ) : (

        <div className="no-sites">
          No solar sites found.
        </div>

      )}

    </div>
  );
}