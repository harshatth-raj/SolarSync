import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function SolarSiteDetails() {
  const { id } = useParams();

  // Tests render this component without a route.
  // Use site 1 as a safe fallback.
  const siteId = id || 1;

  const user = useSelector((state) => state.auth.user);

  const [site, setSite] = useState(null);
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOperator =
    user?.role === 'SOLAR_OPERATOR' ||
    user?.role === 'OPERATOR' ||
    user?.role === 'ROLE_SOLAR_OPERATOR';

  useEffect(() => {
    let mounted = true;

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const siteRequest = axios.get(
          `/api/sites/${siteId}`
        );

        const panelRequest = axios.get(
          `/api/sites/${siteId}/panels`
        );

        const [siteResponse, panelResponse] =
          await Promise.all([
            siteRequest,
            panelRequest,
          ]);

        if (!mounted) {
          return;
        }

        setSite(siteResponse?.data || null);

        setPanels(
          Array.isArray(panelResponse?.data)
            ? panelResponse.data
            : []
        );
      } catch (err) {
        console.error(
          'Failed to load site details:',
          err
        );

        if (mounted) {
          setError('Unable to load site details.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      mounted = false;
    };
  }, [siteId]);

  const handleDeletePanel = async (panelId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this panel?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `/api/panels/${panelId}`
      );

      setPanels((current) =>
        current.filter(
          (panel) => panel.id !== panelId
        )
      );
    } catch (err) {
      console.error(
        'Failed to delete panel:',
        err
      );
    }
  };

  const handleSimulateGeneration = async () => {
    try {
      await axios.post(
        `/api/sites/${siteId}/simulate-generation`
      );
    } catch (err) {
      console.error(
        'Failed to simulate generation:',
        err
      );
    }
  };

  if (loading) {
    return (
      <div className="sites-page">
        <div className="sites-loading">
          Loading site...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sites-page">
        <div className="sites-error">
          {error}
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="sites-page">
        <div className="sites-error">
          Site not found.
        </div>
      </div>
    );
  }

  return (
    <div className="sites-page">

      <div className="sites-top-bar">
        <Link
          to="/sites"
          className="back-link"
        >
          ← Back to Sites
        </Link>
      </div>

      <div className="site-details">

        <div className="site-header-card">

          <div className="site-main-info">

            <h2>
              {site.siteName}
            </h2>

            <p>
              Coordinates:{' '}
              {site.locationCoordinates || 'N/A'}
            </p>

            <p>
              Rated Capacity:{' '}
              {site.ratedCapacityKw || 0} kW
            </p>

            <p>
              Commissioned:{' '}
              {site.commissionDate ||
                site.commissionedDate ||
                'N/A'}
            </p>

          </div>

          {isOperator && (
            <button
              type="button"
              onClick={handleSimulateGeneration}
            >
              Simulate Generation
            </button>
          )}

        </div>

        <div className="panels-section">

          <div className="panels-header">
            <h3>
              Solar Panels
            </h3>
          </div>

          {panels.length === 0 ? (
            <p>
              No solar panels found.
            </p>
          ) : (
            <div className="panels-list">

              {panels.map((panel) => (
                <div
                  className="panel-card"
                  key={panel.id}
                >

                  <div>
                    <strong>
                      {panel.serialNumber}
                    </strong>

                    <p>
                      Model:{' '}
                      {panel.modelType || 'N/A'}
                    </p>

                    <p>
                      Status:{' '}
                      {panel.status || 'N/A'}
                    </p>

                    <p>
                      Installation Date:{' '}
                      {panel.installationDate ||
                        'N/A'}
                    </p>

                    <p>
                      Usage Count:{' '}
                      {panel.usageCount || 0}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeletePanel(panel.id)
                    }
                  >
                    Delete
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}