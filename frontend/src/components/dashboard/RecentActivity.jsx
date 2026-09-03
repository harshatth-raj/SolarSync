import React from 'react';

export default function RecentActivity({
    metrics = []
}) {

    if (metrics.length === 0) {

        return (
            <div className="activity-empty">
                No recent activity
            </div>
        );
    }

    return (

        <div className="recent-activity-list">

            {metrics.map((m, index) => (

                <div
                    className="activity-row"
                    key={m.id || index}
                >

                    <div className="activity-info">

                        <span className="activity-time">

                            {m.timestamp
                                ? new Date(
                                    m.timestamp
                                ).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : '--:--'
                            }

                        </span>

                        <span className="activity-panel">

                            Panel #
                            {m.panel?.id ||
                                m.panelId ||
                                "N/A"}

                        </span>

                    </div>


                    <div className="activity-values">

                        <span className="generation-value">

                            ⚡
                            {Number(
                                m.generationKwh || 0
                            ).toFixed(2)} KWh

                        </span>


                        <span className="consumption-value">

                            ▼
                            {Number(
                                m.gridConsumptionKwh || 0
                            ).toFixed(2)} KWh

                        </span>

                    </div>

                </div>

            ))}

        </div>
    );
}