import React, { useState } from "react";
import api from "../../services/api";

export default function SolarPanelForm({
  onClose,
  siteId,
  panelToEdit,
}) {
  const [serialNumber, setSerialNumber] = useState(
    panelToEdit?.serialNumber || ""
  );

  const [modelType, setModelType] = useState(
    panelToEdit?.modelType || ""
  );

  const [installationDate, setInstallationDate] = useState(
    panelToEdit?.installationDate || ""
  );

  const [status, setStatus] = useState(
    panelToEdit?.status || "ACTIVE"
  );

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (panelToEdit) {
        await api.put(`/api/panels/${panelToEdit.id}`, { serialNumber, modelType, installationDate, status });
      } else {
        await api.post("/api/panels", {
          site: { id: Number(siteId) },
          serialNumber, modelType, status, installationDate,
          usageCount: 0, capacity: 5.5,
        });
      }
      onClose();
    } catch (err) {
      console.error("Panel save failed:", err);
      setError(err.response?.data?.message || "Unable to save panel.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>
          {panelToEdit
            ? "Edit Panel"
            : "Add Panel"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Serial Number */}
          <input
            type="text"
            placeholder="e.g. SN-12345"
            value={serialNumber}
            onChange={(e) =>
              setSerialNumber(e.target.value)
            }
            required
          />

          {/* Model Type */}
          <input
            type="text"
            placeholder="Model Type"
            value={modelType}
            onChange={(e) =>
              setModelType(e.target.value)
            }
            required
          />

          {/* Installation Date */}
          <input
            type="date"
            value={installationDate}
            onChange={(e) =>
              setInstallationDate(e.target.value)
            }
            required
          />

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            required
          >
            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>

            <option value="MAINTENANCE">
              MAINTENANCE
            </option>
          </select>

          {/* Error */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="modal-actions">

            <button type="submit">
              Save Panel
            </button>

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}