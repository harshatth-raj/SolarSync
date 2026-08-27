import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    fetchSites,
    setSearchQuery
} from "../../store/slices/siteSlice";

function SolarSiteList({ onSelect }) {

    const dispatch = useDispatch();

    const {
        items,
        loading,
        searchQuery
    } = useSelector(state => state.sites);

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

    return (
        <div className="container">

            <div className="page-header">

                <h1>Solar Sites</h1>

                {user?.role ===
                    "SYSTEM_ADMINISTRATOR" && (

                    <button className="btn-primary">
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
                <p>Loading sites...</p>
            ) : (

                <div className="site-list">

                    {filteredSites.map(site => (

                        <div
                            className="site-card"
                            key={site.id}
                            onClick={() =>
                                onSelect(site.id)
                            }
                        >

                            <h3>
                                {site.siteName}
                            </h3>

                            <p>
                                Location: {
                                    site.locationCoordinates
                                }
                            </p>

                            <p>
                                Capacity: {
                                    site.ratedCapacityKw
                                } KW
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default SolarSiteList;