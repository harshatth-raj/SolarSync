import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import SolarSiteForm from "./SolarSiteForm";

export default function SolarSiteList() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state) => state.auth.user);

  /*
   * Get the user's role.
   */
  const rawRole =
    user?.role ||
    user?.roles?.[0] ||
    user?.authorities?.[0]?.authority ||
    user?.authorities?.[0] ||
    "";

  const role = String(rawRole)
    .replace(/^ROLE_/i, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();

  /*
   * IMPORTANT:
   *
   * Only SOLAR_OPERATOR is prevented from adding sites.
   *
   * This also allows the Add Site button to appear when
   * the login response has not supplied a role yet.
   */
  const canAddSite = role !== "SOLAR_OPERATOR";


  useEffect(() => {
    loadSites();
  }, []);


  const loadSites = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/sites"
      );

      if (Array.isArray(response?.data)) {
        setSites(response.data);
      } else {
        setSites([]);
      }

    } catch (error) {
      console.error(
        "Failed to load solar sites:",
        error
      );

      setSites([]);

    } finally {
      setLoading(false);
    }
  };


  const filteredSites = sites.filter((site) => {
    const search = searchTerm.toLowerCase();

    return (
      String(site?.id || "")
        .toLowerCase()
        .includes(search) ||

      String(site?.siteName || "")
        .toLowerCase()
        .includes(search) ||

      String(site?.locationCoordinates || "")
        .toLowerCase()
        .includes(search)
    );
  });


  return (
    <div className="sites-page">

      {/* =========================================
          HEADER
         ========================================= */}

      <div className="sites-header">

        <div className="sites-title-section">

          <h1>
            Solar Sites
          </h1>

          <p className="sites-subtitle">
            View and manage your solar energy sites.
          </p>

        </div>


        {/* =====================================
            ADD SITE BUTTON
           ===================================== */}

        {canAddSite && (
          <button
            type="button"
            className="add-site-button"
            onClick={() => setShowForm(true)}
          >
            + Add Site
          </button>
        )}

      </div>


      {/* =========================================
          SEARCH
         ========================================= */}

      <input
        type="text"
        className="site-search"
        placeholder="Search solar sites..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />


      {/* =========================================
          LOADING
         ========================================= */}

      {loading && (
        <div className="sites-loading">
          Loading solar sites...
        </div>
      )}


      {/* =========================================
          EMPTY STATE
         ========================================= */}

      {!loading &&
        filteredSites.length === 0 && (
          <div className="no-sites">
            No solar sites found.
          </div>
        )}


      {/* =========================================
          SITE TABLE
         ========================================= */}

      {!loading &&
        filteredSites.length > 0 && (

          <div className="sites-table-container">

            <table className="sites-table">

              <thead>

                <tr>

                  <th>
                    Site ID
                  </th>

                  <th>
                    Site Name
                  </th>

                  <th>
                    Coordinates
                  </th>

                  <th>
                    Rated Capacity
                  </th>

                  <th>
                    Commission Date
                  </th>

                  <th>
                    Panels
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredSites.map((site) => (

                  <tr key={site.id}>

                    <td>
                      <strong>
                        {site.id}
                      </strong>
                    </td>


                    <td>
                      <strong>
                        {site.siteName || "-"}
                      </strong>
                    </td>


                    <td>
                      {site.locationCoordinates || "-"}
                    </td>


                    <td>
                      {site.ratedCapacityKw != null
                        ? `${site.ratedCapacityKw} kW`
                        : "-"}
                    </td>


                    <td>
                      {site.commissionDate || "-"}
                    </td>


                    <td>
                      {Array.isArray(site.panels)
                        ? site.panels.length
                        : site.panelCount ?? 0}
                    </td>


                    <td>

                      <Link
                        to={`/sites/${site.id}`}
                        className="site-view-details"
                      >
                        View Details
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


      {/* =========================================
          EXISTING SOLAR SITE FORM
         ========================================= */}

      {showForm && (

        <SolarSiteForm
          onClose={() => {
            setShowForm(false);
            loadSites();
          }}
        />

      )}

    </div>
  );
}