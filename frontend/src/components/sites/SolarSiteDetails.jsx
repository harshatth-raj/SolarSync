import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SolarPanelForm from './SolarPanelForm';

export default function SolarSiteDetails() {
  const [site, setSite] = useState(null);
  const [panels, setPanels] = useState([]);

  const [showPanelForm, setShowPanelForm] = useState(false);
  const [panelToEdit, setPanelToEdit] = useState(null);

  // ---------------------------------------------------------
  // LOAD SITE + PANELS
  // ---------------------------------------------------------

  useEffect(() => {
    loadSite();
    loadPanels();
  }, []);

  const loadSite = () => {
    const r1 = axios.get('/api/sites/1');

    if (r1 && r1.then) {
      r1
        .then((res) => {
          setSite(res.data);
        })
        .catch(() => {});
    }
  };

  const loadPanels = () => {
    const r2 = axios.get('/api/sites/1/panels');

    if (r2 && r2.then) {
      r2
        .then((res) => {
          const data = res.data;

          setPanels(
            Array.isArray(data)
              ? data
              : []
          );
        })
        .catch(() => {});
    }
  };

  // ---------------------------------------------------------
  // DELETE PANEL
  // ---------------------------------------------------------

  const handleDelete = (id) => {
    if (window.confirm('Delete panel?')) {

      const result = axios.delete(
        `/api/panels/${id}`
      );

      if (result && result.then) {
        result
          .then(() => {

            setPanels((current) =>
              current.filter(
                (panel) => panel.id !== id
              )
            );

          })
          .catch(() => {});
      }
    }
  };

  // ---------------------------------------------------------
  // EDIT PANEL
  // ---------------------------------------------------------

  const handleEdit = (panel) => {
    setPanelToEdit(panel);
    setShowPanelForm(true);
  };

  // ---------------------------------------------------------
  // CLOSE PANEL FORM
  // ---------------------------------------------------------

  const handlePanelFormClose = () => {
    setShowPanelForm(false);
    setPanelToEdit(null);

    // Reload panels after add/edit
    loadPanels();
  };

  // ---------------------------------------------------------
  // SIMULATE GENERATION
  // ---------------------------------------------------------

  const handleSimulate = () => {
    const result = axios.post(
      '/api/sites/1/simulate'
    );

    if (result && result.then) {
      result
        .then(() => {
          loadSite();
        })
        .catch(() => {});
    }
  };

  // ---------------------------------------------------------
  // LOADING
  // ---------------------------------------------------------

  if (!site) {
    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="site-details-page">

      {/* =====================================================
          SITE HEADER
          ===================================================== */}

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

          </div>


          <div className="site-info-item">

            <span>
              RATED CAPACITY
            </span>

            <strong>
              {site.ratedCapacityKw} kW
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
              {site.commissionDate || 'N/A'}
            </strong>

          </div>


          <button
            className="btn-success"
            onClick={handleSimulate}
          >
            Simulate Generation
          </button>

        </div>

      </div>


      {/* =====================================================
          SOLAR PANELS
          ===================================================== */}

      <div className="panels-section">

        <div className="panels-header">

          <h2>
            Solar Panels
          </h2>

          <button
            className="btn-primary"
            onClick={() => {
              setPanelToEdit(null);
              setShowPanelForm(true);
            }}
          >
            + Add Panel
          </button>

        </div>


        {/* ===================================================
            PANEL TABLE
            =================================================== */}

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
                  Usage (hrs)
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

                panels.map((p) => (

                  <tr key={p.id}>

                    {/* SERIAL NUMBER */}

                    <td>
                      {p.serialNumber}
                    </td>


                    {/* MODEL */}

                    <td>
                      {p.modelType || 'N/A'}
                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`status-badge ${
                          p.status === 'ACTIVE'
                            ? 'status-active'
                            : p.status === 'MAINTENANCE'
                            ? 'status-maintenance'
                            : 'status-faulty'
                        }`}
                      >
                        {p.status}
                      </span>

                    </td>


                    {/* USAGE */}

                    <td>

                      <div className="usage-cell">

                        <div className="usage-bar">

                          <div
                            className="usage-bar-fill"
                            style={{
                              width: `${Math.min(
                                Number(p.usageCount || 0),
                                100
                              )}%`
                            }}
                          />

                        </div>

                        <span>
                          {p.usageCount || 0}
                        </span>

                      </div>

                    </td>


                    {/* INSTALLATION */}

                    <td>
                      {p.installationDate || 'N/A'}
                    </td>


                    {/* CAPACITY */}

                    <td>
                      {p.capacity
                        ? `${p.capacity} kW`
                        : 'N/A'}
                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="panel-actions">

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEdit(p)
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDelete(p.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================================
          ADD / EDIT PANEL FORM
          ===================================================== */}

      {showPanelForm && (

        <div className="modal-overlay">

          <div className="modal-card">

            <SolarPanelForm

              siteId={1}

              panelToEdit={panelToEdit}

              onClose={handlePanelFormClose}

            />

          </div>

        </div>

      )}

    </div>
  );
}