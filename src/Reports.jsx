import { useEffect, useState } from "react";
import "./Reports.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Reports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchReports() {
    try {
      const response = await fetch(
        `${API_URL}/api/reports`
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to load reports.");
      }

      // The backend returns { success: true, reports: [...] }
      setReports(Array.isArray(data.reports) ? data.reports : []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load reports. Check your backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API_URL}/api/reports/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Status update failed.");
      }

      await fetchReports();
    } catch (err) {
      alert(err.message || "Status update failed.");
    }
  }

  return (
    <div className="reports-container">
      <h1>Road Damage Reports</h1>
      <h3>Total Reports: {reports.length}</h3>

      {loading && <p>Loading reports...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <p>No reports found yet.</p>
      )}

      {reports.map((report) => (
        <div className="report-card" key={report._id}>
          <h3>{report.damageType}</h3>

          {report.imagePath && (
            <img
              src={`${API_URL}${report.imagePath}`}
              alt={`Road damage: ${report.damageType}`}
              style={{
                width: "100%",
                maxWidth: "350px",
                borderRadius: "8px",
              }}
            />
          )}

          <p>Latitude: {report.latitude}</p>
          <p>Longitude: {report.longitude}</p>
          <p>Status: {report.status || "Reported"}</p>
          <p>
            Reported on:{" "}
            {report.createdAt
              ? new Date(report.createdAt).toLocaleString()
              : "Date unavailable"}
          </p>

          <label>
            Update Status:{" "}
            <select
              value={report.status || "Reported"}
              onChange={(event) =>
                updateStatus(report._id, event.target.value)
              }
            >
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}

export default Reports;
