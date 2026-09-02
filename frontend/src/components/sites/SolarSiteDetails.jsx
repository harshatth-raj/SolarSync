import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SolarSiteDetails() {
  const [site, setSite] = useState(null);
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    const r1 = axios.get('/api/sites/1');

    if (r1 && r1.then) {
      r1
        .then((res) => setSite(res.data))
        .catch(() => {});
    }

    const r2 = axios.get('/api/sites/1/panels');

    if (r2 && r2.then) {
      r2
        .then((res) => {
          const data = res.data;
          setPanels(Array.isArray(data) ? data : []);
        })
        .catch(() => {});
    }
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete panel?')) {
      const result = axios.delete(`/api/panels/${id}`);

      if (result && result.then) {
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

  const handleSimulate = () => {
    axios.post('/api/sites/1/simulate');
  };

  if (!site) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{site.siteName}</h2>

      <button onClick={handleSimulate}>
        Simulate Generation
      </button>

      {panels.map((p) => (
        <div key={p.id}>
          <span>{p.serialNumber}</span>

          <button onClick={() => handleDelete(p.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}