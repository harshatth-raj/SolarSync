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
    fetchTickets,
    resolveTicket
} from "../../store/slices/ticketSlice";


function MaintenanceTicketList() {

    const dispatch = useDispatch();

    const {
        items,
        loading,
        error
    } = useSelector(
        state => state.tickets
    );

    const user = useSelector(
        state => state.auth.user
    );

    const [search, setSearch] =
        useState("");


    /* --------------------------------
       Fetch tickets
    -------------------------------- */

    useEffect(() => {

        dispatch(fetchTickets());

    }, [dispatch]);


    /* --------------------------------
       Search
    -------------------------------- */

    const filteredTickets = useMemo(() => {

        const query =
            search.toLowerCase();

        return items.filter(ticket => {

            const siteName =
                ticket.site?.siteName ||
                ticket.siteName ||
                "";

            const panelNumber =
                ticket.panel?.serialNumber ||
                ticket.panel?.id ||
                ticket.panelId ||
                "";

            const description =
                ticket.issueDescription ||
                ticket.description ||
                "";

            const priority =
                ticket.priority ||
                "";

            const status =
                ticket.status ||
                "";

            return (
                String(siteName)
                    .toLowerCase()
                    .includes(query) ||

                String(panelNumber)
                    .toLowerCase()
                    .includes(query) ||

                String(description)
                    .toLowerCase()
                    .includes(query) ||

                String(priority)
                    .toLowerCase()
                    .includes(query) ||

                String(status)
                    .toLowerCase()
                    .includes(query)
            );
        });

    }, [items, search]);


    /* --------------------------------
       Resolve ticket
    -------------------------------- */

    const handleResolve = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to resolve this ticket?"
            );

        if (!confirmed) {
            return;
        }

        dispatch(resolveTicket(id));
    };


    /* --------------------------------
       Status class
    -------------------------------- */

    const getStatusClass = (status) => {

        const value =
            String(status || "")
                .toUpperCase();

        if (value === "RESOLVED") {
            return "ticket-status resolved";
        }

        if (
            value === "IN_PROGRESS" ||
            value === "IN PROGRESS"
        ) {
            return "ticket-status progress";
        }

        return "ticket-status open";
    };


    /* --------------------------------
       Priority class
    -------------------------------- */

    const getPriorityClass = (priority) => {

        const value =
            String(priority || "")
                .toUpperCase();

        if (value === "CRITICAL") {
            return "ticket-priority critical";
        }

        if (value === "HIGH") {
            return "ticket-priority high";
        }

        if (value === "MEDIUM") {
            return "ticket-priority medium";
        }

        return "ticket-priority low";
    };


    return (

        <div className="ticket-page">

            {/* ==================================
                HEADER
            ================================== */}

            <div className="ticket-page-header">

                <div>

                    <h1>
                        Maintenance Tickets
                    </h1>

                    <p>
                        Track and manage maintenance
                        issues across solar panels.
                    </p>

                </div>

            </div>


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="ticket-search">

                <input
                    type="text"
                    placeholder="Search maintenance tickets..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="ticket-error">
                    {error}
                </div>

            )}


            {/* ==================================
                LOADING
            ================================== */}

            {loading ? (

                <div className="ticket-loading">
                    Loading tickets...
                </div>

            ) : filteredTickets.length === 0 ? (

                <div className="ticket-empty">

                    <h3>
                        No Maintenance Tickets
                    </h3>

                    <p>
                        There are currently no
                        maintenance tickets to display.
                    </p>

                </div>

            ) : (

                /* ==================================
                   TABLE
                ================================== */

                <div className="ticket-table-wrapper">

                    <table className="ticket-table">

                        <thead>

                            <tr>

                                <th>
                                    SITE
                                </th>

                                <th>
                                    PANEL ID
                                </th>

                                <th>
                                    DESCRIPTION
                                </th>

                                <th>
                                    PRIORITY
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    TECHNICIAN
                                </th>

                                {user?.role ===
                                    "MAINTENANCE_TECHNICIAN" && (
                                    <th>
                                        ACTION
                                    </th>
                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTickets.map(
                                (ticket) => {

                                    const siteName =
                                        ticket.site?.siteName ||
                                        ticket.siteName ||
                                        "—";

                                    const panel =
                                        ticket.panel?.serialNumber ||
                                        ticket.panel?.id ||
                                        ticket.panelId ||
                                        "—";

                                    const description =
                                        ticket.issueDescription ||
                                        ticket.description ||
                                        "—";

                                    const technician =
                                        ticket.technician?.username ||
                                        ticket.technician?.name ||
                                        ticket.technician ||
                                        "—";

                                    return (

                                        <tr
                                            key={ticket.id}
                                        >

                                            <td>
                                                <strong>
                                                    {siteName}
                                                </strong>
                                            </td>

                                            <td>
                                                {panel}
                                            </td>

                                            <td className="description-cell">
                                                {description}
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        getPriorityClass(
                                                            ticket.priority
                                                        )
                                                    }
                                                >
                                                    {ticket.priority ||
                                                        "LOW"}
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        getStatusClass(
                                                            ticket.status
                                                        )
                                                    }
                                                >
                                                    {ticket.status ||
                                                        "OPEN"}
                                                </span>

                                            </td>

                                            <td>
                                                {technician}
                                            </td>


                                            {user?.role ===
                                                "MAINTENANCE_TECHNICIAN" && (

                                                <td>

                                                    {ticket.status !==
                                                        "RESOLVED" && (

                                                        <button
                                                            className="resolve-ticket-btn"
                                                            onClick={() =>
                                                                handleResolve(
                                                                    ticket.id
                                                                )
                                                            }
                                                        >
                                                            Resolve
                                                        </button>

                                                    )}

                                                </td>

                                            )}

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}


export default MaintenanceTicketList;