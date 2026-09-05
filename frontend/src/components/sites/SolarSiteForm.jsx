import React, { useState } from 'react';
import axios from 'axios';

export default function SolarSiteForm({
  onClose,
}) {
  const [siteName, setSiteName] =
    useState('');

  const [locationCoordinates, setLocationCoordinates] =
    useState('');

  const [ratedCapacityKw, setRatedCapacityKw] =
    useState('');

  const [commissionedDate, setCommissionedDate] =
    useState('');

  const [error, setError] =
    useState('');

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

    try {
      await axios.post(
        '/api/sites',
        {
          siteName,
          locationCoordinates,
          ratedCapacityKw: Number(
            ratedCapacityKw
          ),
          commissionedDate,
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
          Add Solar Site
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Site Name"
            value={siteName}
            onChange={(e) =>
              setSiteName(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Coordinates e.g. 11.0168,76.9558"
            value={locationCoordinates}
            onChange={(e) =>
              setLocationCoordinates(
                e.target.value
              )
            }
            required
          />

          <input
            type="number"
            placeholder="Rated Capacity (kW)"
            value={ratedCapacityKw}
            onChange={(e) =>
              setRatedCapacityKw(
                e.target.value
              )
            }
            required
          />

          <input
            type="date"
            value={commissionedDate}
            onChange={(e) =>
              setCommissionedDate(
                e.target.value
              )
            }
            required
          />

          {error && (
            <div className="register-error">
              {error}
            </div>
          )}

          <div className="modal-actions">

            <button type="submit">
              Add Site
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