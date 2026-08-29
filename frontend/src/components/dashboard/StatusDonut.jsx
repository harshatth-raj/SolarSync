import React from "react";

function StatusDonut({ tickets = [] }) {

    const total = tickets.length;

    const resolved = tickets.filter(
        ticket =>
            String(ticket.status).toUpperCase() === "RESOLVED"
    ).length;

    const open = tickets.filter(
        ticket =>
            String(ticket.status).toUpperCase() === "OPEN"
    ).length;

    const other = total - resolved - open;

    const resolvedPercentage =
        total > 0 ? (resolved / total) * 100 : 0;

    const openPercentage =
        total > 0 ? (open / total) * 100 : 0;

    return (
        <div className="status-donut">

            <h3>Maintenance Distribution</h3>

            <div
                className="donut"
                style={{
                    background: `conic-gradient(
                        #ef4444 0% ${openPercentage}%,
                        #22c55e ${openPercentage}% ${openPercentage + resolvedPercentage}%,
                        #f59e0b ${openPercentage + resolvedPercentage}% 100%
                    )`
                }}
            >

                <div className="donut-center">
                    {total}
                </div>

            </div>

            <div className="donut-legend">

                <div>
                    <span className="legend-dot open"></span>
                    Open: {open}
                </div>

                <div>
                    <span className="legend-dot resolved"></span>
                    Resolved: {resolved}
                </div>

                <div>
                    <span className="legend-dot other"></span>
                    Other: {other}
                </div>

            </div>

        </div>
    );
}

export default StatusDonut;