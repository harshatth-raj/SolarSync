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

import MaintenanceTicketForm
    from "./MaintenanceTicketForm";


function MaintenanceTicketList() {

    const dispatch = useDispatch();

    const [showForm, setShowForm] =
        useState(false);

    const [search, setSearch] =
        useState("");


    /* =========================================
       REDUX STATE
    ========================================= */

    const {
        items = [],
        loading,
        error
    } = useSelector(
        state => state.tickets
    );


    const user = useSelector(
        state => state.auth.user
    );


    /* =========================================
       ROLE PERMISSIONS
    ========================================= */

    const role = String(
        user?.role || ""
    ).toUpperCase();


    const canReportIssue =
        role === "SYSTEM_ADMINISTRATOR" ||
        role === "SOLAR_OPERATOR" ||
        role === "MAINTENANCE_TECHNICIAN";


    const canResolve =
        role === "SYSTEM_ADMINISTRATOR" ||
        role === "MAINTENANCE_TECHNICIAN";


    /* =========================================
       LOAD TICKETS
    ========================================= */

    useEffect(() => {

        dispatch(fetchTickets());

    }, [dispatch]);


    /* =========================================
       FILTER TICKETS
    ========================================= */

    const filteredTickets = useMemo(() => {

        const query =
            search
                .toLowerCase()
                .trim();


        if (!query) {
            return items;
        }


        return items.filter(ticket => {

            const siteName =
                ticket.siteName || "";


            const panelId =
                ticket.panelId || "";


            const description =
                ticket.issueDescription || "";


            const priority =
                ticket.priority || "";


            const status =
                ticket.status || "";


            const technician =
                ticket.assignedTechnician || "";


            return (
                String(siteName)
                    .toLowerCase()
                    .includes(query)

                ||

                String(panelId)
                    .toLowerCase()
                    .includes(query)

                ||

                String(description)
                    .toLowerCase()
                    .includes(query)

                ||

                String(priority)
                    .toLowerCase()
                    .includes(query)

                ||

                String(status)
                    .toLowerCase()
                    .includes(query)

                ||

                String(technician)
                    .toLowerCase()
                    .includes(query)
            );

        });

    }, [items, search]);


    /* =========================================
       RESOLVE TICKET
    ========================================= */

    const handleResolve = async (ticketId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to resolve this ticket?"
            );


        if (!confirmed) {
            return;
        }


        const result =
            await dispatch(
                resolveTicket(ticketId)
            );


        if (
            resolveTicket.fulfilled.match(result)
        ) {

            dispatch(fetchTickets());

        }

    };


    /* =========================================
       PRIORITY CLASS
    ========================================= */

    const getPriorityClass = (priority) => {

        switch (
            String(priority || "")
                .toUpperCase()
        ) {

            case "CRITICAL":
                return "critical";

            case "HIGH":
                return "high";

            case "MEDIUM":
                return "medium";

            case "LOW":
            default:
                return "low";
        }

    };


    /* =========================================
       STATUS CLASS
    ========================================= */

    const getStatusClass = (status) => {

        const value =
            String(status || "")
                .toUpperCase();


        if (value === "CLOSED") {
            return "resolved";
        }


        if (value === "IN_PROGRESS") {
            return "progress";
        }


        return "open";
    };


    /* =========================================
       FORMAT STATUS
    ========================================= */

    const formatStatus = (status) => {

        const value =
            String(status || "OPEN")
                .toUpperCase();


        if (value === "IN_PROGRESS") {
            return "IN PROGRESS";
        }


        if (value === "CLOSED") {
            return "CLOSED";
        }


        return value;
    };


    return (

        <div className="ticket-page">


            {/* =====================================
                PAGE HEADER
            ===================================== */}

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


                {canReportIssue && (

                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        + Report Issue
                    </button>

                )}

            </div>


            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="ticket-search">

                <input
                    type="text"
                    placeholder="Search maintenance tickets..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="ticket-error">
                    {error}
                </div>

            )}


            {/* =====================================
                LOADING
            ===================================== */}

            {loading ? (

                <div className="ticket-loading">
                    Loading tickets...
                </div>

            ) : filteredTickets.length === 0 ? (

                <div className="ticket-empty">

                    <h3>
                        No maintenance tickets found.
                    </h3>

                    <p>
                        {canReportIssue
                            ? 'Click "Report Issue" to create a ticket.'
                            : "There are currently no maintenance tickets."}
                    </p>

                </div>

            ) : (

                /* =================================
                   TICKET TABLE
                ================================= */

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

                                {canResolve && (

                                    <th>
                                        ACTION
                                    </th>

                                )}

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTickets.map(
                                ticket => (

                                    <tr
                                        key={ticket.id}
                                    >

                                        {/* SITE */}

                                        <td>
                                            {ticket.siteName ||
                                                "—"}
                                        </td>


                                        {/* PANEL */}

                                        <td>
                                            {ticket.panelId ||
                                                "—"}
                                        </td>


                                        {/* DESCRIPTION */}

                                        <td
                                            className="description-cell"
                                        >
                                            {
                                                ticket.issueDescription ||
                                                "—"
                                            }
                                        </td>


                                        {/* PRIORITY */}

                                        <td>

                                            <span
                                                className={
                                                    `ticket-priority ${getPriorityClass(
                                                        ticket.priority
                                                    )}`
                                                }
                                            >
                                                {
                                                    ticket.priority ||
                                                    "LOW"
                                                }
                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    `ticket-status ${getStatusClass(
                                                        ticket.status
                                                    )}`
                                                }
                                            >
                                                {
                                                    formatStatus(
                                                        ticket.status
                                                    )
                                                }
                                            </span>

                                        </td>


                                        {/* TECHNICIAN */}

                                        <td>
                                            {
                                                ticket.assignedTechnician ||
                                                "—"
                                            }
                                        </td>


                                        {/* ACTION */}

                                        {canResolve && (

                                            <td>

                                                {String(
                                                    ticket.status || ""
                                                ).toUpperCase()
                                                !== "CLOSED" && (

                                                    <button
                                                        type="button"
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

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =====================================
                REPORT ISSUE MODAL
            ===================================== */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal-card ticket-modal">

                        <MaintenanceTicketForm

                            onClose={() => {

                                setShowForm(false);

                                /*
                                 * Reload tickets after
                                 * closing the form so a newly
                                 * created ticket appears.
                                 */

                                dispatch(
                                    fetchTickets()
                                );

                            }}

                        />

                    </div>

                </div>

            )}

        </div>
    );
}


export default MaintenanceTicketList;