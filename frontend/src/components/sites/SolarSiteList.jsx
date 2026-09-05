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
    const result = axios.get('http://localhost:8081/api/sites');

    if (result && result.then) {
      result
        .then((res) => {
          setSites(Array.isArray(res.data) ? res.data : []);
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div>

      {isAdmin && (
        <button onClick={() => setShowForm(true)}>
          + Add Site
        </button>
      )}

      {showForm && (
        <SolarSiteForm
          onClose={() => setShowForm(false)}
        />
      )}

      {sites.map((s) => (
        <div key={s.id}>

          <span>
            {s.siteName}
          </span>

          <span>
            {s.locationCoordinates}
          </span>

          <a href={`/sites/${s.id}`}>
            View Details
          </a>

        </div>
      ))}

    </div>
  );
}