import React from "react";

function CapacityBar({ current, total }) {

    const percentage =
        total > 0
            ? Math.min(
                (current / total) * 100,
                100
            )
            : 0;

    return (
        <div className="capacity-container">

            <div className="capacity-label">

                <span>
                    {Number(current).toFixed(1)} KW
                </span>

                <span>
                    {Number(total).toFixed(1)} KW
                </span>

            </div>

            <div className="capacity-bar">

                <div
                    className="capacity-fill"
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

            <span>
                {percentage.toFixed(0)}%
            </span>

        </div>
    );
}

export default CapacityBar;