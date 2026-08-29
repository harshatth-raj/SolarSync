import React, {
    useEffect,
    useMemo
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    useNavigate
} from "react-router-dom";

import {
    fetchSites,
    setSearchQuery
} from "../../store/slices/siteSlice";


function SolarSiteList() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        items,
        loading,
        searchQuery
    } = useSelector(
        state => state.sites
    );

    const user = useSelector(
        state => state.auth.user
    );


    useEffect(() => {

        dispatch(fetchSites());

    }, [dispatch]);


    const filteredSites = useMemo(() => {

        return items.filter(site =>
            site.siteName
                ?.toLowerCase()
                .includes(
                    searchQuery.toLowerCase()
                )
        );

    }, [items, searchQuery]);


    const handleSiteClick = (siteId) => {

        navigate(`/sites/${siteId}`);

    };


    return (
        <div className="container">

            <div className="page-header">

                <h1>
                    Solar Sites
                </h1>


                {user?.role ===
                    "SYSTEM_ADMINISTRATOR" && (

                    <button
                        className="btn-primary"
                    >
                        + Add Site
                    </button>

                )}

            </div>


            <input
                type="text"
                placeholder="Search solar sites by name..."
                value={searchQuery}
                onChange={(e) =>
                    dispatch(
                        setSearchQuery(
                            e.target.value
                        )
                    )
                }
            />


            {loading ? (

                <p>
                    Loading sites...
                </p>

            ) : (

                <div className="site-list">

                    {filteredSites.map(
                        site => (

                        <div
                            className="site-card"
                            key={site.id}
                            onClick={() =>
                                handleSiteClick(
                                    site.id
                                )
                            }
                        >

                            <h3>
                                {site.siteName}
                            </h3>

                            <p>
                                Location:{" "}
                                {
                                    site.locationCoordinates
                                }
                            </p>

                            <p>
                                Capacity:{" "}
                                {
                                    site.ratedCapacityKw
                                } KW
                            </p>

                            <p>
                                Commissioned:{" "}
                                {
                                    site.commissionDate
                                }
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}


export default SolarSiteList;