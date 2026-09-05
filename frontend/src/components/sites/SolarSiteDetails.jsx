import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import SolarPanelForm from './SolarPanelForm';

export default function SolarSiteDetails() {
  const { id } = useParams();

  const [site, setSite] = useState(null);
  const [panels, setPanels] = useState([]);

  const [showPanelForm, setShowPanelForm] =
    useState(false);

  const [panelToEdit, setPanelToEdit] =
    useState(null);

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

  const loadSite = async () => {
    try {
      const response = await axios.get(
        `/api/sites/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setSite(response.data);
    } catch (error) {
      console.error(
        'Failed to load site:',
        error
      );
    }
  };

  const loadPanels = async () => {
    try {
      const response = await axios.get(
        `/api/sites/${id}/panels`,
        {
          headers: getAuthHeaders(),
        }
      );

      setPanels(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(
        'Failed to load panels:',
        error
      );

      setPanels([]);
    }
  };

  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      loadSite(),
      loadPanels(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleDelete = async (panelId) => {
    const confirmed = window.confirm(
      'Delete panel?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `/api/panels/${panelId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      setPanels((current) =>
        current.filter(
          (panel) => panel.id !== panelId
        )
      );
    } catch (error) {
      console.error(
        'Failed to delete panel:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Unable to delete panel.'
      );
    }
  };

  const handleEdit = (panel) => {
    setPanelToEdit(panel);
    setShowPanelForm(true);
  };

  const handleAddPanel = () => {
    setPanelToEdit(null);
    setShowPanelForm(true);
  };

  const handlePanelFormClose = () => {
    setShowPanelForm(false);
    setPanelToEdit(null);
    loadPanels();
  };

  const handleSimulate = async () => {
    try {
      await axios.post(
        `/api/sites/${id}/simulate`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      alert(
        'Generation simulation completed.'
      );
    } catch (error) {
      console.error(
        'Simulation failed:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Unable to simulate generation.'
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

  if (!site) {
    return (
      <div className="sites-page">

        <Link
          to="/sites"
          className="back-link"
        >
          ← Back to Sites
        </Link>

        <div className="no-sites">
          Site not found.
        </div>

      </div>
    );
  }

  return (
    <div className="sites-page">

      {/* =========================================
          TOP BAR
          ========================================= */}

      <div className="sites-top-bar">

        <Link
          to="/sites"
          className="back-link"
        >
          ← Back to Sites
        </Link>

      </div>


      {/* =========================================
          SITE INFORMATION
          ========================================= */}

      <div className="site-header-card">

        <div className="site-main-info">

          <h2>
            {site.siteName}
          </h2>

          <p>
            Coordinates:{' '}
            {site.locationCoordinates || '-'}
          </p>

        </div>


        <div className="site-info-item">

          <span>
            RATED CAPACITY
          </span>

          <strong>
            {site.ratedCapacityKw != null
              ? `${site.ratedCapacityKw} kW`
              : '-'}
          </strong>

        </div>


        <div className="site-info-item">

          <span>
            PANELS
          </span>

          <strong>
            {panels.length}
          </strong>

        </div>


        <div className="site-info-item">

          <span>
            COMMISSIONED
          </span>

          <strong>
            {site.commissionedDate ||
              site.commissionDate ||
              '-'}
          </strong>

        </div>


        <button
          type="button"
          className="simulate-button"
          onClick={handleSimulate}
        >
          Simulate Generation
        </button>

      </div>


      {/* =========================================
          PANELS
          ========================================= */}

      <section className="panels-section">

        <div className="panels-header">

          <h2>
            Solar Panels
          </h2>

          <button
            type="button"
            className="add-panel-button"
            onClick={handleAddPanel}
          >
            + Add Panel
          </button>

        </div>


        <div className="panel-table-container">

          <table className="panel-table">

            <thead>

              <tr>

                <th>
                  Serial Number
                </th>

                <th>
                  Model
                </th>

                <th>
                  Status
                </th>

                <th>
                  Usage (Hrs)
                </th>

                <th>
                  Installation
                </th>

                <th>
                  Capacity
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {panels.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="no-panels"
                  >
                    No solar panels found.
                  </td>

                </tr>

              ) : (

                panels.map((panel) => (

                  <tr key={panel.id}>

                    <td>
                      {panel.serialNumber || '-'}
                    </td>

                    <td>
                      {panel.modelType || '-'}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          String(
                            panel.status || ''
                          ).toLowerCase()
                        }`}
                      >
                        {panel.status || '-'}
                      </span>

                    </td>

                    <td>

                      <div className="usage-cell">

                        <div className="usage-bar">

                          <div
                            className="usage-progress"
                            style={{
                              width: `${Math.min(
                                Number(
                                  panel.usageHours ||
                                  panel.usageHrs ||
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                        <span>
                          {
                            panel.usageHours ??
                            panel.usageHrs ??
                            0
                          }
                        </span>

                      </div>

                    </td>

                    <td>
                      {
                        panel.installationDate ||
                        '-'
                      }
                    </td>

                    <td>
                      {panel.capacityKw != null
                        ? `${panel.capacityKw} kW`
                        : '-'}
                    </td>

                    <td>

                      <button
                        type="button"
                        className="action-button"
                        onClick={() =>
                          handleEdit(panel)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(panel.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>


      {/* =========================================
          PANEL FORM
          ========================================= */}

      {showPanelForm && (

        <SolarPanelForm
          siteId={id}
          panelToEdit={panelToEdit}
          onClose={
            handlePanelFormClose
          }
        />

      )}

    </div>
  );
}