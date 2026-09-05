import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SolarPanelForm from './SolarPanelForm';

export default function SolarSiteDetails() {
  const [site, setSite] = useState(null);
  const [panels, setPanels] = useState([]);
  const [panelToEdit, setPanelToEdit] = useState(null);
  const [showPanelForm, setShowPanelForm] = useState(false);

  const loadPanels = () => {
    const result = axios.get('/api/sites/1/panels');

    if (result && typeof result.then === 'function') {
      result
        .then((res) => {
          const data = res.data;
          setPanels(Array.isArray(data) ? data : []);
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    const r1 = axios.get('/api/sites/1');

    if (r1 && typeof r1.then === 'function') {
      r1
        .then((res) => setSite(res.data))
        .catch(() => {});
    }

    loadPanels();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete panel?')) {
      const result = axios.delete(`/api/panels/${id}`);

      if (result && typeof result.then === 'function') {
        result
          .then(() => {
            setPanels((current) =>
              current.filter((panel) => panel.id !== id)
            );
          })
          .catch(() => {});
      }
    }
  };

  const handleEdit = (panel) => {
    setPanelToEdit(panel);
    setShowPanelForm(true);
  };

  const handleCloseForm = () => {
    setShowPanelForm(false);
    setPanelToEdit(null);

    // Reload the panels after editing
    loadPanels();
  };

  const handleSimulate = () => {
    axios.post('/api/sites/1/simulate');
  };

  if (!site) {
    return <div>Loading...</div>;
  }

  return (
    <div className="site-details-page">

      <div className="site-details">

        <h2>{site.siteName}</h2>

        <button
          className="btn-success"
          onClick={handleSimulate}
        >
          Simulate Generation
        </button>

      </div>

      {/* EDIT PANEL FORM */}

      {showPanelForm && (
        <div className="modal-overlay">

          <div className="modal-card">

            <SolarPanelForm
              onClose={handleCloseForm}
              siteId={1}
              panelToEdit={panelToEdit}
            />

            <button
              type="button"
              onClick={() => {
                setShowPanelForm(false);
                setPanelToEdit(null);
              }}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

      {/* PANELS */}

      <div className="panels-section">

        <div className="panels-header">

          <h2>Solar Panels</h2>

          <button
            className="add-panel-button"
            onClick={() => {
              setPanelToEdit(null);
              setShowPanelForm(true);
            }}
          >
            + Add Panel
          </button>

        </div>

        <div className="panel-table-container">

          <table className="panel-table">

            <thead>
              <tr>
                <th>Serial Number</th>
                <th>Model</th>
                <th>Status</th>
                <th>Usage (hrs)</th>
                <th>Installation</th>
                <th>Capacity</th>
                <th>Actions</th>
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

                    <td>
                      {p.serialNumber}
                    </td>

                    <td>
                      {p.modelType}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          String(p.status || '').toLowerCase()
                        }`}
                      >
                        {p.status}
                      </span>

                    </td>

                    <td>

                      <div className="usage-cell">

                        <div className="usage-bar">

                          <div
                            className="usage-progress"
                            style={{
                              width: `${Math.min(
                                Number(p.usageHours || 0),
                                100
                              )}%`
                            }}
                          />

                        </div>

                        <span>
                          {p.usageHours || 0}
                        </span>

                      </div>

                    </td>

                    <td>
                      {p.installationDate || '-'}
                    </td>

                    <td>
                      {p.capacityKw
                        ? `${p.capacityKw} kW`
                        : p.ratedCapacityKw
                          ? `${p.ratedCapacityKw} kW`
                          : '5.5 kW'}
                    </td>

                    <td>

                      <div className="panel-actions">

                        <button
                          type="button"
                          className="action-button"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() => handleDelete(p.id)}
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

    </div>
  );
}