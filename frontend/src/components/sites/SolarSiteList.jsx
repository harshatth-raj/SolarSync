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
  const [loading, setLoading] = useState(true);


  /* =========================================================
     LOAD SOLAR SITES
     ========================================================= */

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
      .catch((error) => {

        console.error('Failed to load solar sites:', error);

        setSites([]);

      })
      .finally(() => {

        setLoading(false);

      });

  }, []);


  return (

    <div className="dashboard-page">

      {/* =====================================================
          NAVBAR
          ===================================================== */}

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


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="dashboard-content">

        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>
              Solar Sites
            </h1>

            <p className="dashboard-status">
              View and manage your registered solar sites.
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


        {/* ===================================================
            ADD SITE FORM
            =================================================== */}

        {showForm && (

          <SolarSiteForm
            onClose={() => setShowForm(false)}
          />

        )}


        {/* ===================================================
            LOADING
            =================================================== */}

        {loading && (

          <div className="loading">
            Loading solar sites...
          </div>

        )}


        {/* ===================================================
            EMPTY STATE
            =================================================== */}

        {!loading && sites.length === 0 && (

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

        )}


        {/* ===================================================
            SITE CARDS
            =================================================== */}

        {!loading && sites.length > 0 && (

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
                  {site.locationCoordinates || 'Not available'}
                </p>

                <p>
                  <strong>Capacity:</strong>{' '}
                  {site.ratedCapacityKw || 0} kW
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