import React from "react";

function StatusDonut({ analytics }) {

    const active =
        analytics?.totalActivePanels || 0;

    const open =
        analytics?.openTickets || 0;

    const maintenance =
        analytics?.maintenancePanels || 0;

    const total =
        active + open + maintenance;

    const getPercentage = (value) => {

        if (total === 0) {
            return 0;
        }

        return (value / total) * 100;
    };

    return (
        <div className="dashboard-card">

            <h2>
                Maintenance Distribution
            </h2>

            <div className="donut-container">

                <div
                    className="donut"
                    style={{
                        background: `conic-gradient(
                            #ef4444 0% ${getPercentage(open)}%,
                            #22c55e ${getPercentage(open)}% ${getPercentage(open) + getPercentage(active)}%,
                            #f59e0b ${getPercentage(open) + getPercentage(active)}% 100%
                        )`
                    }}
                >

                    <div className="donut-center">
                        {total}
                    </div>

                </div>

            </div>

            <div className="donut-legend">

                <p>
                    <span className="legend-dot red"></span>
                    Open: {open}
                </p>

                <p>
                    <span className="legend-dot green"></span>
                    Active: {active}
                </p>

                <p>
                    <span className="legend-dot orange"></span>
                    Maintenance: {maintenance}
                </p>

            </div>

        </div>
    );
}

export default StatusDonut;