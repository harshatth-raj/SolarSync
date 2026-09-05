import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SolarSiteForm from './SolarSiteForm';
import axios from 'axios';

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

        setSites(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      })
      .catch(() => {
        setSites([]);
      });

  }, []);

  return (

    <div className="dashboard-page">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          SolarSync
        </div>

        <div className="dashboard-nav-links">

          <a href="/">
            Home
          </a>

          <a href="/sites">
            Sites
          </a>

          <a href="/tickets">
            Tickets
          </a>

        </div>

        <div className="dashboard-user">

          <span>
            {user?.username}
          </span>

        </div>

      </nav>


      {/* CONTENT */}

      <main className="dashboard-content">

        <div className="page-header">

          <div>

            <h1>
              Solar Sites
            </h1>

            <p className="dashboard-status">
              View and manage registered solar sites.
            </p>

          </div>


          {isAdmin && (

            <button
              className="btn-success"
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


        {/* SITES */}

        {sites.length === 0 ? (

          <div className="empty-state">

            <h3>
              No Solar Sites Found
            </h3>

            <p>
              There are currently no registered solar sites.
            </p>

            {isAdmin && (

              <button
                className="btn-success"
                style={{ marginTop: '15px' }}
                onClick={() => setShowForm(true)}
              >
                + Add Site
              </button>

            )}

          </div>

        ) : (

          <div className="site-list">

            {sites.map((site) => (

              <div
                className="site-card"
                key={site.id}
              >

                <h3>
                  {site.siteName}
                </h3>

                <p>
                  <strong>Location:</strong>{' '}
                  {site.locationCoordinates}
                </p>

                <p>
                  <strong>Capacity:</strong>{' '}
                  {site.ratedCapacityKw} kW
                </p>

                <a
                  href={`/sites/${site.id}`}
                  className="btn-primary"
                  style={{
                    display: 'inline-block',
                    marginTop: '10px'
                  }}
                >
                  View Details
                </a>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>

  );
}