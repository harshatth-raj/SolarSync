import React, { useState } from "react";
import axios from "axios";

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

  const [installationDate, setInstallationDate] =
    useState(
      panelToEdit?.installationDate || ""
    );

  const [status, setStatus] = useState(
    panelToEdit?.status || "ACTIVE"
  );

  const [error, setError] = useState("");

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      if (panelToEdit) {
        // -----------------------------
        // EDIT EXISTING PANEL
        // -----------------------------
        const data = {
          serialNumber,
          modelType,
          installationDate,
          status,
        };

        await axios.put(
          `/api/panels/${panelToEdit.id}`,
          data,
          {
            headers: getAuthHeaders(),
          }
        );
      } else {
        // -----------------------------
        // CREATE NEW PANEL
        // -----------------------------
        const data = {
          site: {
            id: Number(siteId),
          },
          serialNumber,
          modelType,
          status,
          installationDate,
          usageCount: 0,
          capacity: 5.5,
        };

        await axios.post(
          "/api/panels",
          data,
          {
            headers: getAuthHeaders(),
          }
        );
      }

      onClose();

    } catch (err) {
      console.error("Panel save failed:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save panel."
      );
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

          <input
            placeholder="e.g. SN-12345"
            value={serialNumber}
            onChange={(e) =>
              setSerialNumber(e.target.value)
            }
            required
          />

          <input
            placeholder="Model Type"
            value={modelType}
            onChange={(e) =>
              setModelType(e.target.value)
            }
            required
          />

          <input
            type="date"
            value={installationDate}
            onChange={(e) =>
              setInstallationDate(e.target.value)
            }
            required
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
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

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

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