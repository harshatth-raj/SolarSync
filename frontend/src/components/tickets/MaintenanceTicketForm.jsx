import React, { useEffect, useState } from "react";

import api from "../../services/api";

export default function MaintenanceTicketForm({ onClose }) {

    const [description, setDescription] =
        useState("");

    const [sites, setSites] =
        useState([]);

    const [panels, setPanels] =
        useState([]);

    const [selectedSite, setSelectedSite] =
        useState("");

    const [selectedPanel, setSelectedPanel] =
        useState("");

    const [priority, setPriority] =
        useState("LOW");

    const [loadingSites, setLoadingSites] =
        useState(true);

    const [loadingPanels, setLoadingPanels] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD SOLAR SITES
    ===================================================== */

    useEffect(() => {

        let mounted = true;

        const loadSites = async () => {

            try {

                const response =
                    await api.get("/api/sites");

                if (!mounted) {
                    return;
                }

                const siteData =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                setSites(siteData);

                /*
                 * Do NOT automatically select the first site.
                 * Let the user choose the site.
                 */

                setSelectedSite("");
                setSelectedPanel("");

            } catch (err) {

                if (mounted) {

                    setSites([]);

                    setError(
                        err.response?.data?.message ||
                        "Unable to load solar sites."
                    );
                }

            } finally {

                if (mounted) {
                    setLoadingSites(false);
                }

            }
        };


        loadSites();


        return () => {
            mounted = false;
        };

    }, []);


    /* =====================================================
       LOAD PANELS FOR SELECTED SITE
    ===================================================== */

    useEffect(() => {

        let mounted = true;


        if (!selectedSite) {

            setPanels([]);

            setSelectedPanel("");

            return;
        }


        const loadPanels = async () => {

            try {

                setLoadingPanels(true);

                setError("");


                const response =
                    await api.get(
                        `/api/panels/site/${selectedSite}`
                    );


                if (!mounted) {
                    return;
                }


                const panelData =
                    Array.isArray(response.data)
                        ? response.data
                        : [];


                setPanels(panelData);

                setSelectedPanel("");

            } catch (err) {

                if (mounted) {

                    setPanels([]);

                    setSelectedPanel("");

                    setError(
                        err.response?.data?.message ||
                        "Unable to load panels for this site."
                    );
                }

            } finally {

                if (mounted) {
                    setLoadingPanels(false);
                }

            }

        };


        loadPanels();


        return () => {
            mounted = false;
        };

    }, [selectedSite]);


    /* =====================================================
       SUBMIT TICKET
    ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        /* -------------------------------
           Validate Site
        -------------------------------- */

        if (!selectedSite) {

            setError(
                "Please select a solar site."
            );

            return;
        }


        /* -------------------------------
           Validate Panel
        -------------------------------- */

        if (!selectedPanel) {

            setError(
                "Please select a solar panel."
            );

            return;
        }


        /* -------------------------------
           Validate Description
        -------------------------------- */

        if (!description.trim()) {

            setError(
                "Issue description is required."
            );

            return;
        }


        setSubmitting(true);


        try {

            /*
             * This matches your backend:
             *
             * TicketService.createTicket()
             * uses dto.getPanelId()
             *
             * siteId is also included because
             * it belongs to TicketRequestDto.
             */

            const payload = {

                siteId:
                    Number(selectedSite),

                panelId:
                    Number(selectedPanel),

                issueDescription:
                    description.trim(),

                priority:
                    priority
            };


            /*
             * IMPORTANT:
             *
             * Use api.post(), NOT axios.post().
             *
             * api.js automatically attaches:
             *
             * Authorization: Bearer <JWT>
             */

            await api.post(
                "/api/tickets",
                payload
            );


            /*
             * Successful creation
             */

            onClose();


        } catch (err) {

            console.error(
                "Create ticket error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to create maintenance ticket."
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="ticket-form">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="ticket-form-header">

                <div>

                    <h2>
                        Report Issue
                    </h2>

                    <p>
                        Report a maintenance
                        problem with a solar panel.
                    </p>

                </div>


                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    disabled={submitting}
                >
                    ×
                </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

                {/* ============================
                    SOLAR SITE
                ============================ */}

                <div className="form-group">

                    <label htmlFor="ticket-site">
                        Solar Site
                    </label>


                    <select
                        id="ticket-site"
                        value={selectedSite}
                        onChange={(e) => {

                            setSelectedSite(
                                e.target.value
                            );

                            setSelectedPanel("");

                            setError("");

                        }}
                        disabled={
                            loadingSites ||
                            submitting
                        }
                        required
                    >

                        <option value="">

                            {loadingSites
                                ? "Loading sites..."
                                : "Select Solar Site"}

                        </option>


                        {sites.map((site) => (

                            <option
                                key={site.id}
                                value={site.id}
                            >
                                {site.siteName}
                            </option>

                        ))}

                    </select>

                </div>


                {/* ============================
                    SOLAR PANEL
                ============================ */}

                <div className="form-group">

                    <label htmlFor="ticket-panel">
                        Solar Panel
                    </label>


                    <select
                        id="ticket-panel"
                        value={selectedPanel}
                        onChange={(e) => {

                            setSelectedPanel(
                                e.target.value
                            );

                            setError("");

                        }}
                        disabled={
                            !selectedSite ||
                            loadingPanels ||
                            submitting
                        }
                        required
                    >

                        <option value="">

                            {!selectedSite
                                ? "Select Solar Site first"
                                : loadingPanels
                                    ? "Loading panels..."
                                    : panels.length === 0
                                        ? "No panels available for this site"
                                        : "Select Solar Panel"}

                        </option>


                        {panels.map((panel) => (

                            <option
                                key={panel.id}
                                value={panel.id}
                            >

                                Panel #{panel.id}

                                {panel.serialNumber
                                    ? ` - ${panel.serialNumber}`
                                    : ""}

                            </option>

                        ))}

                    </select>


                    {selectedSite &&
                        !loadingPanels &&
                        panels.length === 0 && (

                        <small className="ticket-form-help">
                            No panels are available
                            for this site.
                        </small>

                    )}

                </div>


                {/* ============================
                    PRIORITY
                ============================ */}

                <div className="form-group">

                    <label htmlFor="ticket-priority">
                        Priority
                    </label>


                    <select
                        id="ticket-priority"
                        value={priority}
                        onChange={(e) =>
                            setPriority(
                                e.target.value
                            )
                        }
                        disabled={submitting}
                    >

                        <option value="LOW">
                            LOW
                        </option>

                        <option value="MEDIUM">
                            MEDIUM
                        </option>

                        <option value="HIGH">
                            HIGH
                        </option>

                        <option value="CRITICAL">
                            CRITICAL
                        </option>

                    </select>

                </div>


                {/* ============================
                    DESCRIPTION
                ============================ */}

                <div className="form-group">

                    <label htmlFor="ticket-description">
                        Issue Description
                    </label>


                    <textarea
                        id="ticket-description"
                        placeholder="Describe the fault in detail"
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        rows={5}
                        disabled={submitting}
                        required
                    />

                </div>


                {/* ============================
                    ERROR
                ============================ */}

                {error && (

                    <div className="ticket-form-error">
                        {error}
                    </div>

                )}


                {/* ============================
                    ACTIONS
                ============================ */}

                <div className="ticket-form-actions">

                    <button
                        type="button"
                        className="ticket-cancel-button"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="ticket-submit-button"
                        disabled={
                            submitting ||
                            !selectedSite ||
                            !selectedPanel
                        }
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Ticket"}

                    </button>

                </div>

            </form>

        </div>
    );
}