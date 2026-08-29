import React, {
    useEffect
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    fetchSiteById
} from "../../store/slices/siteSlice";

import {
    fetchPanelsBySite
} from "../../store/slices/panelSlice";


function SolarSiteDetails() {

    const {
        id
    } = useParams();

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const site = useSelector(
        state => state.sites.selectedItem
    );

    const {
        items: panels,
        loading
    } = useSelector(
        state => state.panels
    );


    useEffect(() => {

        if (id) {

            dispatch(
                fetchSiteById(id)
            );

            dispatch(
                fetchPanelsBySite(id)
            );

        }

    }, [dispatch, id]);


    if (!site) {

        return (
            <div className="container">

                <p>
                    Loading site details...
                </p>

            </div>
        );

    }


    return (
        <div className="container">

            <button
                onClick={() =>
                    navigate("/sites")
                }
            >
                ← Back to Sites
            </button>


            <div className="page-header">

                <h1>
                    {site.siteName}
                </h1>

            </div>


            <div className="site-details-card">

                <h2>
                    Site Information
                </h2>

                <p>
                    <strong>
                        Site Name:
                    </strong>{" "}
                    {site.siteName}
                </p>

                <p>
                    <strong>
                        Location:
                    </strong>{" "}
                    {site.locationCoordinates}
                </p>

                <p>
                    <strong>
                        Capacity:
                    </strong>{" "}
                    {site.ratedCapacityKw} KW
                </p>

                <p>
                    <strong>
                        Commission Date:
                    </strong>{" "}
                    {site.commissionDate}
                </p>

            </div>


            <div className="site-details-card">

                <h2>
                    Solar Panels
                </h2>


                {loading ? (

                    <p>
                        Loading panels...
                    </p>

                ) : panels.length === 0 ? (

                    <p>
                        No panels registered
                        for this site.
                    </p>

                ) : (

                    <div className="panel-list">

                        {panels.map(
                            panel => (

                            <div
                                className="panel-card"
                                key={panel.id}
                            >

                                <h3>
                                    {
                                        panel.serialNumber
                                    }
                                </h3>

                                <p>
                                    Model:{" "}
                                    {
                                        panel.modelType
                                    }
                                </p>

                                <p>
                                    Status:{" "}
                                    {
                                        panel.status
                                    }
                                </p>

                                <p>
                                    Capacity:{" "}
                                    {
                                        panel.capacity
                                    } KW
                                </p>

                                <p>
                                    Installation Date:{" "}
                                    {
                                        panel.installationDate
                                    }
                                </p>

                                <p>
                                    Usage Count:{" "}
                                    {
                                        panel.usageCount
                                    }
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}


export default SolarSiteDetails;