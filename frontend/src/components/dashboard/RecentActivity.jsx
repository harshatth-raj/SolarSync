import React from 'react';

export default function RecentActivity({ metrics = [] }) {

    if (metrics.length === 0) {
        return (
            <div className="empty-activity">
                No recent activity
            </div>
        );
    }

    return (
        <div className="recent-activity">

            {metrics.map((m, index) => (

                <div
                    className="activity-item"
                    key={m.id || index}
                >

                    <div className="activity-time">

                        {m.timestamp
                            ? new Date(
                                m.timestamp
                            ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                            : '--:--'
                        }

                    </div>


                    <div className="activity-panel">

                        <strong>
                            Panel #
                            {m.panel?.id || m.panelId || "N/A"}
                        </strong>

                    </div>


                    <div className="activity-value">

                        <span>
                            Generation
                        </span>

                        <strong>
                            {Number(
                                m.generationKwh || 0
                            ).toFixed(2)} KWh
                        </strong>

                    </div>


                    <div className="activity-value">

                        <span>
                            Grid Consumption
                        </span>

                        <strong>
                            {Number(
                                m.gridConsumptionKwh || 0
                            ).toFixed(2)} KWh
                        </strong>

                    </div>

                </div>

            ))}

        </div>
    );
}