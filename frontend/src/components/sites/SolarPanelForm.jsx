import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
    createPanel,
    updatePanel
} from "../../store/slices/panelSlice";

function SolarPanelForm({
    siteId,
    panelToEdit,
    onClose
}) {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        serialNumber:
            panelToEdit?.serialNumber || "",

        modelType:
            panelToEdit?.modelType || "",

        status:
            panelToEdit?.status || "ACTIVE",

        installationDate:
            panelToEdit?.installationDate || "",

        usageCount:
            panelToEdit?.usageCount || 0
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const panelData = {
            site: {
                id: siteId
            },

            serialNumber:
                formData.serialNumber,

            modelType:
                formData.modelType,

            status:
                formData.status,

            installationDate:
                formData.installationDate,

            usageCount:
                Number(formData.usageCount)
        };

        let result;

        if (panelToEdit) {

            result = await dispatch(
                updatePanel({
                    id: panelToEdit.id,
                    panelData
                })
            );

        } else {

            result = await dispatch(
                createPanel(panelData)
            );

        }

        if (
            updatePanel.fulfilled.match(result) ||
            createPanel.fulfilled.match(result)
        ) {
            onClose();
        }
    };

    return (
        <div className="modal-card">

            <h2>
                {panelToEdit
                    ? "Edit Solar Panel"
                    : "Add New Solar Panel"}
            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="serialNumber"
                    placeholder="SP-12345"
                    value={
                        formData.serialNumber
                    }
                    onChange={handleChange}
                    required
                />

                <input
                    name="modelType"
                    placeholder="Monocrystalline 400W"
                    value={
                        formData.modelType
                    }
                    onChange={handleChange}
                    required
                />

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="ACTIVE">
                        ACTIVE
                    </option>

                    <option value="FAULTY">
                        FAULTY
                    </option>

                    <option value="MAINTENANCE_REQUIRED">
                        MAINTENANCE_REQUIRED
                    </option>

                    <option value="UNDER_MAINTENANCE">
                        UNDER_MAINTENANCE
                    </option>
                </select>

                <input
                    type="date"
                    name="installationDate"
                    value={
                        formData.installationDate
                    }
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="btn-primary"
                >
                    {panelToEdit
                        ? "Update Panel"
                        : "Register Panel"}
                </button>

            </form>

        </div>
    );
}

export default SolarPanelForm;