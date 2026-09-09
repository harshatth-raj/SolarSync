import React, { useState } from 'react';
import axios from 'axios';

export default function SolarSiteForm({ onClose }) {
  const [siteName, setSiteName] = useState('');
  const [locationCoordinates, setLocationCoordinates] =
    useState('');
  const [ratedCapacityKw, setRatedCapacityKw] =
    useState('');
  const [commissionedDate, setCommissionedDate] =
    useState('');
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    // Validate coordinates
    // Example: 34.05, -118.24
    const coordinatePattern =
      /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;

    if (!coordinatePattern.test(locationCoordinates)) {
      setError('Invalid coordinates');
      return;
    }

    try {
      await axios.post(
        '/api/sites',
        {
          siteName,
          locationCoordinates,
          ratedCapacityKw: Number(ratedCapacityKw),
          commissionDate: commissionedDate,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      onClose();
    } catch (err) {
      console.error(
        'Failed to create site:',
        err
      );

      setError(
        err.response?.data?.message ||
          'Unable to create site.'
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>
          Register New Solar Site
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Site Name */}
          <input
            type="text"
            placeholder="Desert Oasis Alpha"
            value={siteName}
            onChange={(e) =>
              setSiteName(e.target.value)
            }
            required
          />

          {/* Coordinates */}
          <input
            type="text"
            placeholder="34.05, -118.24"
            value={locationCoordinates}
            onChange={(e) =>
              setLocationCoordinates(
                e.target.value
              )
            }
            required
          />

          {/* Rated Capacity */}
          <input
            type="number"
            placeholder="500.0"
            value={ratedCapacityKw}
            onChange={(e) =>
              setRatedCapacityKw(
                e.target.value
              )
            }
            required
          />

          {/* Commissioned Date */}
          <input
            type="date"
            name="commissionDate"
            value={commissionedDate}
            onChange={(e) =>
              setCommissionedDate(
                e.target.value
              )
            }
            required
          />

          {/* Error */}
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="modal-actions">

            <button type="submit">
              Commission Site
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