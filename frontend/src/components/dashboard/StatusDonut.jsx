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

    const openPercentage = getPercentage(open);
    const activePercentage = getPercentage(active);

    return (
        <div className="status-donut">

            <h3>
                Maintenance Distribution
            </h3>

            <div className="donut-container">

                <div
                    className="donut"
                    style={{
                        background:
                            total === 0
                                ? "#334155"
                                : `conic-gradient(
                                    #ef4444 0% ${openPercentage}%,
                                    #22c55e ${openPercentage}% ${openPercentage + activePercentage}%,
                                    #f59e0b ${openPercentage + activePercentage}% 100%
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
                    <span className="legend-dot open"></span>
                    Open: {open}
                </p>

                <p>
                    <span className="legend-dot resolved"></span>
                    Active: {active}
                </p>

                <p>
                    <span className="legend-dot other"></span>
                    Maintenance: {maintenance}
                </p>

            </div>

        </div>
    );
}

export default StatusDonut;