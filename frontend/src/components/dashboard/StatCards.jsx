import React from "react";

function StatCards({ stats }) {

    if (!stats) {
        return null;
    }

    const cards = [
        {
            title: "Daily Generation",
            value: `${Number(
                stats.totalGeneration || 0
            ).toFixed(2)} KWh`
        },
        {
            title: "Grid Consumption",
            value: `${Number(
                stats.totalConsumption || 0
            ).toFixed(2)} KWh`
        },
        {
            title: "System Efficiency",
            value: `${Number(
                stats.efficiencyRatio || 0
            ).toFixed(2)}%`
        },
        {
            title: "Active Panels",
            value: stats.totalActivePanels || 0
        },
        {
            title: "Open Tickets",
            value: stats.openTickets || 0
        }
    ];

    return (
        <div className="stat-cards">

            {cards.map((card) => (

                <div
                    className="stat-card"
                    key={card.title}
                >

                    <h3>{card.title}</h3>

                    <p>{card.value}</p>

                </div>

            ))}

        </div>
    );
}

export default StatCards;