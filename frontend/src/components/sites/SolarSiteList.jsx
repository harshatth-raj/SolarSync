return (
  <div className="sites-list-section">

    {/* TOP ROW */}
    <div className="sites-list-header">

      <h2>Solar Sites</h2>

      {isAdmin && (
        <button
          className="add-site-button"
          onClick={() => setShowForm(true)}
        >
          + Add Site
        </button>
      )}

    </div>

    {/* SEARCH */}
    <input
      className="site-search"
      type="text"
      placeholder="Search solar sites by name..."
    />

    {/* FORM */}
    {showForm && (
      <SolarSiteForm
        onClose={() => setShowForm(false)}
      />
    )}

    {/* SITES */}
    {sites.length === 0 ? (
      <div className="no-sites">
        No solar sites found.
      </div>
    ) : (
      <div className="sites-table-container">

        <table className="sites-table">

          <thead>
            <tr>
              <th>Site Details</th>
              <th>Coordinates</th>
              <th>Generation</th>
              <th>Commissioned</th>
              <th>Panel Assets</th>
              <th>Management</th>
            </tr>
          </thead>

          <tbody>

            {sites.map((site) => (
              <tr key={site.id}>

                <td>
                  <span className="site-table-name">
                    {site.siteName}
                  </span>
                </td>

                <td>
                  {site.locationCoordinates}
                </td>

                <td>
                  <div className="generation-cell">

                    <div className="generation-bar">
                      <div
                        className="generation-progress"
                        style={{
                          width: "70%"
                        }}
                      />
                    </div>

                    <span>
                      {site.ratedCapacityKw} kW
                    </span>

                  </div>
                </td>

                <td>
                  {site.commissionedDate}
                </td>

                <td>
                  {site.panelCount ?? 0}
                </td>

                <td>
                  <a
                    className="site-view-details"
                    href={`/sites/${site.id}`}
                  >
                    View Details
                  </a>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    )}

  </div>
);