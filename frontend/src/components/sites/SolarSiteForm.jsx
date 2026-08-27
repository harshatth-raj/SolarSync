import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
    createSite
} from "../../store/slices/siteSlice";

function SolarSiteForm({ onClose }) {

    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        siteName: "",
        locationCoordinates: "",
        ratedCapacityKw: "",
        commissionDate: ""
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
            createSite({
                siteName: formData.siteName,
                locationCoordinates:
                    formData.locationCoordinates,
                ratedCapacityKw:
                    Number(formData.ratedCapacityKw),
                commissionDate:
                    formData.commissionDate
            })
        );

        if (createSite.fulfilled.match(result)) {
            onClose();
        }
    };

    return (
        <div className="modal-card">

            <h2>Register New Solar Site</h2>

            <form onSubmit={handleSubmit}>

                <input
                    name="siteName"
                    placeholder="Site Name"
                    value={formData.siteName}
                    onChange={handleChange}
                    required
                />

                <input
                    name="locationCoordinates"
                    placeholder="11.0168,76.9558"
                    value={
                        formData.locationCoordinates
                    }
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="ratedCapacityKw"
                    placeholder="500"
                    value={
                        formData.ratedCapacityKw
                    }
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="commissionDate"
                    value={
                        formData.commissionDate
                    }
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="btn-primary"
                >
                    Submit
                </button>

                <button
                    type="button"
                    onClick={onClose}
                >
                    Cancel
                </button>

            </form>

        </div>
    );
}

export default SolarSiteForm;