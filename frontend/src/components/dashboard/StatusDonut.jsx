import React from "react";

function StatusDonut({ data = [] }) {

    const total = data.reduce(
        (sum, item) =>
            sum + Number(item.value || 0),
        0
    );

    if (total === 0) {

        return (

            <section className="status-donut">

                <h3>
                    Maintenance Distribution
                </h3>

                <div className="donut-empty">
                    No Ticket Data
                </div>

            </section>

        );
    }

    let current = 0;

    const gradient = data.map((item) => {

        const percentage =
            (Number(item.value || 0) / total) * 100;

        const start = current;

        current += percentage;

        return `${item.color} ${start}% ${current}%`;

    }).join(", ");

    return (

        <section className="status-donut">

            <h3>
                Maintenance Distribution
            </h3>

            <div className="donut-container">

                <div
                    className="donut"
                    style={{
                        background:
                            `conic-gradient(${gradient})`
                    }}
                >

                    <div className="donut-center">
                        {total}
                    </div>

                </div>

            </div>


            <div className="donut-legend">

                {data.map((item) => (

                    <div
                        className="donut-legend-item"
                        key={item.label}
                    >

                        <span
                            className="legend-dot"
                            style={{
                                backgroundColor:
                                    item.color
                            }}
                        />

                        <span>
                            {item.label}: {item.value}
                        </span>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default StatusDonut;