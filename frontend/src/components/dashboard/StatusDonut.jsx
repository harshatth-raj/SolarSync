import React from "react";

function StatusDonut({ data = [] }) {

    const total = data.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
    );

    if (total === 0) {
        return (
            <div className="status-donut">

                <h3>Maintenance Ticket Status</h3>

                <div className="donut-empty">
                    No Ticket Data
                </div>

            </div>
        );
    }

    let currentPercentage = 0;

    const gradientParts = data.map((item) => {

        const percentage =
            (Number(item.value || 0) / total) * 100;

        const start = currentPercentage;

        currentPercentage += percentage;

        return `${item.color} ${start}% ${currentPercentage}%`;

    });

    return (
        <div className="status-donut">

            <h3>Maintenance Ticket Status</h3>

            <div className="donut-container">

                <div
                    className="donut"
                    style={{
                        background: `conic-gradient(
                            ${gradientParts.join(", ")}
                        )`
                    }}
                >

                    <div className="donut-center">
                        {total}
                    </div>

                </div>

            </div>

            <div className="donut-legend">

                {data.map((item) => (

                    <p key={item.label}>

                        <span
                            className="legend-dot"
                            style={{
                                backgroundColor: item.color
                            }}
                        ></span>

                        {item.label}: {item.value}

                    </p>

                ))}

            </div>

        </div>
    );
}

export default StatusDonut;