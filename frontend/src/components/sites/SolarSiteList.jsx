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
    axios
      .get('http://localhost:8081/api/sites')
      .then((res) => {
        setSites(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setSites([]);
      });
  }, []);

  return (
    <div className="site-list">

      <div className="page-header">
        <div>
          <h1>Solar Sites</h1>
          <p>View and manage your solar energy sites.</p>
        </div>

        {isAdmin && (
          <button onClick={() => setShowForm(true)}>
            + Add Site
          </button>
        )}
      </div>

      {showForm && (
        <SolarSiteForm
          onClose={() => setShowForm(false)}
        />
      )}

      {sites.length === 0 ? (
        <div className="empty-state">
          <h2>No Solar Sites Found</h2>
          <p>
            There are currently no solar sites available.
          </p>
        </div>
      ) : (
        <div className="site-grid">
          {sites.map((s) => (
            <div className="site-card" key={s.id}>

              <h2>{s.siteName}</h2>

              <p>
                <strong>Location:</strong>{' '}
                {s.locationCoordinates}
              </p>

              <p>
                <strong>Rated Capacity:</strong>{' '}
                {s.ratedCapacityKw} kW
              </p>

              <a href={`/sites/${s.id}`}>
                View Details
              </a>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}