import React, { useEffect } from "react";

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
        loading
    } = useSelector(
        state => state.tickets
    );

    const user = useSelector(
        state => state.auth.user
    );

    useEffect(() => {
        dispatch(fetchTickets());
    }, [dispatch]);

    const handleResolve = (id) => {

        if (
            window.confirm(
                "Are you sure you want to resolve this ticket?"
            )
        ) {
            dispatch(resolveTicket(id));
        }

    };

    return (
        <div className="container">

            <h1>Maintenance Tickets</h1>

            {loading && (
                <p>Loading tickets...</p>
            )}

            {items.map(ticket => (

                <div
                    className="ticket-card"
                    key={ticket.id}
                >

                    <h3>
                        Ticket #{ticket.id}
                    </h3>

                    <p>
                        Site: {
                            ticket.site?.siteName
                        }
                    </p>

                    <p>
                        Panel: {
                            ticket.panel?.serialNumber
                        }
                    </p>

                    <p>
                        Issue: {
                            ticket.issueDescription
                        }
                    </p>

                    <p>
                        Priority: {
                            ticket.priority
                        }
                    </p>

                    <p>
                        Status: {
                            ticket.status
                        }
                    </p>

                    {user?.role ===
                        "MAINTENANCE_TECHNICIAN" &&
                        ticket.status !== "RESOLVED" && (

                        <button
                            onClick={() =>
                                handleResolve(
                                    ticket.id
                                )
                            }
                        >
                            Resolve Ticket
                        </button>

                    )}

                </div>

            ))}

        </div>
    );
}

export default MaintenanceTicketList;