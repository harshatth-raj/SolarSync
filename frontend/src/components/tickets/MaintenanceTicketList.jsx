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


    const {
        items,
        loading,
        error
    } = useSelector(
        state => state.tickets
    );


    useEffect(() => {

        dispatch(fetchTickets());

    }, [dispatch]);


    /* =====================================
       SEARCH
    ===================================== */

    const filteredTickets =
        useMemo(() => {

            const query =
                search
                    .toLowerCase()
                    .trim();


            if (!query) {
                return items;
            }


            return items.filter(ticket => {

                return (

                    String(
                        ticket.siteName || ""
                    )
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(
                        ticket.panelId || ""
                    )
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(
                        ticket.issueDescription ||
                        ""
                    )
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(
                        ticket.priority || ""
                    )
                        .toLowerCase()
                        .includes(query)

                    ||

                    String(
                        ticket.status || ""
                    )
                        .toLowerCase()
                        .includes(query)

                );

            });

        }, [items, search]);


    /* =====================================
       RESOLVE
    ===================================== */

    const handleResolve = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to resolve this ticket?"
            );


        if (!confirmed) {
            return;
        }


        await dispatch(
            resolveTicket(id)
        );

    };


    /* =====================================
       PRIORITY CLASS
    ===================================== */

    const getPriorityClass =
        (priority) => {

            switch (
                String(priority)
                    .toUpperCase()
            ) {

                case "CRITICAL":
                    return "critical";

                case "HIGH":
                    return "high";

                case "MEDIUM":
                    return "medium";

                default:
                    return "low";
            }

        };


    /* =====================================
       STATUS CLASS
    ===================================== */

    const getStatusClass =
        (status) => {

            const value =
                String(status || "")
                    .toUpperCase();


            if (value === "CLOSED") {
                return "resolved";
            }


            if (
                value === "IN_PROGRESS"
            ) {
                return "progress";
            }


            return "open";
        };


    return (

        <div className="ticket-page">

            {/* =================================
                HEADER
            ================================= */}

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


                <button
                    className="btn-primary"
                    onClick={() =>
                        setShowForm(true)
                    }
                >
                    + Report Issue
                </button>

            </div>


            {/* =================================
                SEARCH
            ================================= */}

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


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="ticket-error">
                    {error}
                </div>

            )}


            {/* =================================
                LOADING
            ================================= */}

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
                        Click "Report Issue" to
                        create your first ticket.
                    </p>

                </div>

            ) : (

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

                                <th>
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTickets.map(
                                ticket => (

                                    <tr
                                        key={ticket.id}
                                    >

                                        <td>
                                            {ticket.siteName ||
                                                "—"}
                                        </td>


                                        <td>
                                            {ticket.panelId ||
                                                "—"}
                                        </td>


                                        <td
                                            className="description-cell"
                                        >
                                            {
                                                ticket.issueDescription ||
                                                "—"
                                            }
                                        </td>


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


                                        <td>

                                            <span
                                                className={
                                                    `ticket-status ${getStatusClass(
                                                        ticket.status
                                                    )}`
                                                }
                                            >
                                                {
                                                    ticket.status ||
                                                    "OPEN"
                                                }
                                            </span>

                                        </td>


                                        <td>
                                            {
                                                ticket.technicianName ||
                                                ticket.techName ||
                                                "—"
                                            }
                                        </td>


                                        <td>

                                            {String(
                                                ticket.status
                                            ).toUpperCase()
                                                !== "CLOSED" && (

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

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =================================
                REPORT ISSUE MODAL
            ================================= */}

            {showForm && (

                <div className="modal-overlay">

                    <div className="modal-card ticket-modal">

                        <MaintenanceTicketForm
                            onClose={() => {

                                setShowForm(false);

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