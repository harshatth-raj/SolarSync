import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchSites } from "../../store/slices/siteSlice";

import { fetchPanelsBySite } from "../../store/slices/panelSlice";

import { createTicket } from "../../store/slices/ticketSlice";


function MaintenanceTicketForm({ onClose }) {

    const dispatch = useDispatch();


    const sites = useSelector(
        state => state.sites.items || []
    );

    const panels = useSelector(
        state => state.panels.items || []
    );

    const siteError = useSelector(
        state => state.sites.error
    );

    const panelError = useSelector(
        state => state.panels.error
    );

    const ticketError = useSelector(
        state => state.tickets.error
    );


    const [siteId, setSiteId] =
        useState("");

    const [panelId, setPanelId] =
        useState("");

    const [priority, setPriority] =
        useState("LOW");

    const [issueDescription, setIssueDescription] =
        useState("");

    const [loadingPanels, setLoadingPanels] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);


    /* =========================================
       LOAD SITES
    ========================================= */

    useEffect(() => {

        dispatch(fetchSites());

    }, [dispatch]);


    /* =========================================
       LOAD PANELS AFTER SITE SELECTION
    ========================================= */

    useEffect(() => {

        if (!siteId) {

            setPanelId("");

            return;
        }


        setPanelId("");

        setLoadingPanels(true);


        dispatch(
            fetchPanelsBySite(
                Number(siteId)
            )
        ).finally(() => {

            setLoadingPanels(false);

        });

    }, [dispatch, siteId]);


    /* =========================================
       SUBMIT
    ========================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!siteId) {

            alert(
                "Please select a solar site."
            );

            return;
        }


        if (!panelId) {

            alert(
                "Please select a solar panel."
            );

            return;
        }


        if (!issueDescription.trim()) {

            alert(
                "Please enter the issue description."
            );

            return;
        }


        setSubmitting(true);


        try {

            const ticketData = {

                siteId: Number(siteId),

                panelId: Number(panelId),

                issueDescription:
                    issueDescription.trim(),

                priority: priority

            };


            const result = await dispatch(
                createTicket(ticketData)
            );


            if (
                createTicket.fulfilled.match(result)
            ) {

                onClose();

            }

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="ticket-form">

            {/* HEADER */}

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
                >
                    ×
                </button>

            </div>


            <form onSubmit={handleSubmit}>

                {/* =================================
                    SITE
                ================================= */}

                <div className="form-group">

                    <label>
                        Solar Site
                    </label>


                    <select
                        value={siteId}
                        onChange={(e) =>
                            setSiteId(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select Solar Site
                        </option>


                        {sites.map(site => (

                            <option
                                key={site.id}
                                value={site.id}
                            >
                                {site.siteName}
                            </option>

                        ))}

                    </select>


                    {sites.length === 0 &&
                        !siteError && (

                        <small
                            style={{
                                color: "#94a3b8"
                            }}
                        >
                            No solar sites available.
                        </small>

                    )}


                    {siteError && (

                        <small
                            style={{
                                color: "#f87171"
                            }}
                        >
                            Unable to load solar sites:
                            {" "}
                            {siteError}
                        </small>

                    )}

                </div>


                {/* =================================
                    PANEL
                ================================= */}

                <div className="form-group">

                    <label>
                        Solar Panel
                    </label>


                    <select
                        value={panelId}
                        onChange={(e) =>
                            setPanelId(
                                e.target.value
                            )
                        }
                        disabled={
                            !siteId ||
                            loadingPanels
                        }
                        required
                    >

                        <option value="">

                            {!siteId
                                ? "Select Solar Site first"
                                : loadingPanels
                                    ? "Loading panels..."
                                    : panels.length === 0
                                        ? "No panels available for this site"
                                        : "Select Solar Panel"}

                        </option>


                        {panels.map(panel => (

                            <option
                                key={panel.id}
                                value={panel.id}
                            >

                                {panel.serialNumber}
                                {" - "}
                                {panel.modelType}

                            </option>

                        ))}

                    </select>


                    {panelError && (

                        <small
                            style={{
                                color: "#f87171"
                            }}
                        >
                            Unable to load panels:
                            {" "}
                            {panelError}
                        </small>

                    )}

                </div>


                {/* =================================
                    PRIORITY
                ================================= */}

                <div className="form-group">

                    <label>
                        Priority
                    </label>


                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(
                                e.target.value
                            )
                        }
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


                {/* =================================
                    DESCRIPTION
                ================================= */}

                <div className="form-group">

                    <label>
                        Issue Description
                    </label>


                    <textarea
                        value={issueDescription}
                        onChange={(e) =>
                            setIssueDescription(
                                e.target.value
                            )
                        }
                        placeholder="Describe the fault in detail"
                        rows="5"
                        required
                    />

                </div>


                {/* ERROR */}

                {ticketError && (

                    <div className="ticket-form-error">
                        {ticketError}
                    </div>

                )}


                {/* BUTTONS */}

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
                            !siteId ||
                            !panelId
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


export default MaintenanceTicketForm;