import React from "react";

function RecentActivity({ metrics }) {

    return (
        <div className="recent-activity">

            <h3>Recent Activity</h3>

            {metrics?.length === 0 && (
                <p>No recent activity</p>
            )}

            {metrics?.map(metric => (

                <div
                    className="activity-item"
                    key={metric.id}
                >

                    <p>
                        Time: {
                            new Date(
                                metric.readingTimestamp
                            ).toLocaleString()
                        }
                    </p>

                    <p>
                        Panel: {
                            metric.panel?.id
                        }
                    </p>

                    <p>
                        Generated: {
                            Number(
                                metric.energyGeneratedKwh || 0
                            ).toFixed(2)
                        } KWh
                    </p>

                </div>

            ))}

        </div>
    );
}

export default RecentActivity;