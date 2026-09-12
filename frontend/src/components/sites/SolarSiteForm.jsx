import React, { useState } from "react";
import api from "../../services/api";

export default function SolarSiteForm({ onClose }) {
  const [siteName, setSiteName] = useState("");
  const [locationCoordinates, setLocationCoordinates] = useState("");
  const [ratedCapacityKw, setRatedCapacityKw] = useState("");
  const [commissionedDate, setCommissionedDate] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const coordinatePattern = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    if (!coordinatePattern.test(locationCoordinates)) {
      setError("Coordinates must be in format: 34.05, -118.24");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(
        "/api/sites",
        {
          siteName,
          locationCoordinates,
          ratedCapacityKw: Number(ratedCapacityKw),
          commissionDate: commissionedDate,
        },
        { headers: getAuthHeaders() }
      );
      onClose();
    } catch (err) {
      console.error("Failed to create site:", err);
      setError(err.response?.data?.message || "Unable to create site.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card modal-card--site">

        <div className="modal-header">
          <div className="modal-header-icon">☀️</div>
          <div>
            <h2>Register New Solar Site</h2>
            <p className="modal-subtitle">Fill in the details to commission a new site</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="modal-field-group">
            <label>Site Name</label>
            <input
              type="text"
              placeholder="e.g. Desert Oasis Alpha"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
            />
          </div>

          <div className="modal-field-group">
            <label>Location Coordinates</label>
            <input
              type="text"
              placeholder="e.g. 34.05, -118.24"
              value={locationCoordinates}
              onChange={(e) => setLocationCoordinates(e.target.value)}
              required
            />
            <span className="modal-field-hint">Latitude, Longitude</span>
          </div>

          <div className="modal-row">
            <div className="modal-field-group">
              <label>Rated Capacity (kW)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={ratedCapacityKw}
                onChange={(e) => setRatedCapacityKw(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="modal-field-group">
              <label>Commission Date</label>
              <input
                type="date"
                value={commissionedDate}
                onChange={(e) => setCommissionedDate(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="register-error">{error}</div>
          )}

          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Commissioning…" : "✓ Commission Site"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
