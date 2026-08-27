import React from "react";

function EmptyState({
    message = "No records found",
    action,
    actionText = "Add New"
}) {

    return (
        <div className="empty-state">

            <div className="empty-icon">
                📋
            </div>

            <p>{message}</p>

            {action && (
                <button
                    className="btn-primary"
                    onClick={action}
                >
                    {actionText}
                </button>
            )}

        </div>
    );
}

export default EmptyState;