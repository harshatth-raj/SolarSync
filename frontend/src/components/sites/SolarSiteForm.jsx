import React, { useState } from 'react';
import axios from 'axios';

const COORD_REGEX = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;

export default function SolarSiteForm({ onClose, siteToEdit }) {
  const [siteName, setSiteName] = useState(
    siteToEdit?.siteName || ''
  );

  const [locationCoordinates, setLocationCoordinates] = useState(
    siteToEdit?.locationCoordinates || ''
  );

  const [ratedCapacityKw, setRatedCapacityKw] = useState(
    siteToEdit?.ratedCapacityKw || ''
  );

  const [commissionDate, setCommissionDate] = useState(
    siteToEdit?.commissionDate || ''
  );

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!COORD_REGEX.test(locationCoordinates)) {
      setError('Invalid coordinates format');
      return;
    }

    try {
      if (siteToEdit) {
        await axios.put(
          `/api/sites/${siteToEdit.id}`,
          {
            siteName,
            locationCoordinates,
            ratedCapacityKw,
            commissionDate
          }
        );
      } else {
        await axios.post(
          '/api/sites',
          {
            siteName,
            locationCoordinates,
            ratedCapacityKw,
            commissionDate
          }
        );
      }

      if (onClose) {
        onClose();
      }
    } catch (error) {
      // Keep the form open if the API request fails.
    }
  };

  return (
    <div>
      <h2>Register New Solar Site</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Desert Oasis Alpha"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />

        <input
          placeholder="34.05, -118.24"
          value={locationCoordinates}
          onChange={(e) =>
            setLocationCoordinates(e.target.value)
          }
        />

        <input
          placeholder="500.0"
          value={ratedCapacityKw}
          onChange={(e) =>
            setRatedCapacityKw(e.target.value)
          }
        />

        <input
          name="commissionDate"
          type="date"
          value={commissionDate}
          onChange={(e) =>
            setCommissionDate(e.target.value)
          }
        />

        <button type="submit">
          Commission Site
        </button>
      </form>
    </div>
  );
}