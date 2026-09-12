import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function MaintenanceTicketForm({ onClose }) {
  const [description, setDescription] = useState("");
  const [sites, setSites] = useState([]);
  const [panels, setPanels] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedPanel, setSelectedPanel] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingPanels, setLoadingPanels] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("jwt") ||
      localStorage.getItem("accessToken");
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  useEffect(() => {
    let mounted = true;
    const loadSites = async () => {
      try {
        const response = await api.get("/api/sites", getAuthConfig());
        if (!mounted) return;
        const siteData = Array.isArray(response?.data) ? response.data : [];
        setSites(siteData);
        if (siteData.length > 0) setSelectedSite(String(siteData[0].id));
      } catch { if (mounted) setSites([]); }
      finally { if (mounted) setLoadingSites(false); }
    };
    loadSites();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!selectedSite) { setPanels([]); setSelectedPanel(""); return; }
    const loadPanels = async () => {
      try {
        setLoadingPanels(true);
        const response = await api.get(`/api/panels/site/${selectedSite}`, getAuthConfig());
        if (!mounted) return;
        const panelData = Array.isArray(response?.data) ? response.data : [];
        setPanels(panelData);
        setSelectedPanel(panelData.length > 0 ? String(panelData[0].id) : "");
      } catch { if (mounted) { setPanels([]); setSelectedPanel(""); } }
      finally { if (mounted) setLoadingPanels(false); }
    };
    loadPanels();
    return () => { mounted = false; };
  }, [selectedSite]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!description.trim()) { setError("Issue description is required."); return; }
    setSubmitting(true);
    try {
      await api.post("/api/tickets", {
        panelId: selectedPanel ? Number(selectedPanel) : null,
        issueDescription: description.trim(),
        priority,
      }, getAuthConfig());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create maintenance ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">

        <div className="modal-header">
          <div className="modal-header-icon">🔧</div>
          <div>
            <h2>Report Issue</h2>
            <p className="modal-subtitle">Report a maintenance problem with a solar panel</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="modal-row">
            <div className="modal-field-group">
              <label>Solar Site</label>
              <select
                value={selectedSite}
                onChange={(e) => { setSelectedSite(e.target.value); setSelectedPanel(""); }}
                disabled={loadingSites}
              >
                <option value="">{loadingSites ? "Loading…" : "Select site"}</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.siteName}</option>
                ))}
              </select>
            </div>

            <div className="modal-field-group">
              <label>Solar Panel</label>
              <select
                value={selectedPanel}
                onChange={(e) => setSelectedPanel(e.target.value)}
                disabled={!selectedSite || loadingPanels}
              >
                <option value="">{loadingPanels ? "Loading…" : "Select panel"}</option>
                {panels.map((p) => (
                  <option key={p.id} value={p.id}>
                    Panel #{p.id}{p.serialNumber ? ` — ${p.serialNumber}` : ""}
                  </option>
                ))}
              </select>
              {selectedSite && !loadingPanels && panels.length === 0 && (
                <span className="modal-field-hint">No panels for this site.</span>
              )}
            </div>
          </div>

          <div className="modal-field-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="modal-field-group">
            <label>Issue Description</label>
            <textarea
              placeholder="Describe the fault in detail…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ resize: "vertical" }}
            />
          </div>

          {error && <div className="register-error">{error}</div>}

          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "✓ Submit Ticket"}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
}
