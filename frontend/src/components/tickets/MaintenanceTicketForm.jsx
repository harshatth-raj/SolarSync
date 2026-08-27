import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
    createTicket
} from "../../store/slices/ticketSlice";

function MaintenanceTicketForm({
    sites = [],
    technicians = [],
    onClose
}) {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        siteId: "",
        panelId: "",
        issueDescription: "",
        priority: "MEDIUM",
        technicianId: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await dispatch(
            createTicket({
                siteId: Number(formData.siteId),
                panelId: Number(formData.panelId),
                issueDescription:
                    formData.issueDescription,
                priority: formData.priority,
                technicianId:
                    Number(formData.technicianId)
            })
        );

        if (createTicket.fulfilled.match(result)) {
            onClose();
        }
    };

    return (
        <div className="modal-card">

            <h2>
                Report Maintenance Issue
            </h2>

            <form onSubmit={handleSubmit}>

                <select
                    name="siteId"
                    value={formData.siteId}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select Site
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

                <input
                    type="number"
                    name="panelId"
                    placeholder="Panel ID"
                    value={formData.panelId}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="issueDescription"
                    placeholder="Describe the issue"
                    value={
                        formData.issueDescription
                    }
                    onChange={handleChange}
                    required
                />

                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
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

                <select
                    name="technicianId"
                    value={
                        formData.technicianId
                    }
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        Select Technician
                    </option>

                    {technicians.map(
                        technician => (

                            <option
                                key={technician.id}
                                value={technician.id}
                            >
                                {technician.username}
                            </option>

                        )
                    )}
                </select>

                <button
                    type="submit"
                    className="btn-primary"
                >
                    Submit Ticket
                </button>

            </form>

        </div>
    );
}

export default MaintenanceTicketForm;