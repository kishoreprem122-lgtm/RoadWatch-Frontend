import { useState } from "react";
import "./Report.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Report() {
  const [damageType, setDamageType] = useState("Pothole");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  function getLocation() {
    if (!navigator.geolocation) {
      setMessage("GPS is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude));
        setLongitude(String(position.coords.longitude));
        setMessage("GPS location captured!");
      },
      () => setMessage("Please allow location access.")
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!image) {
      setMessage("Please select a road damage image.");
      return;
    }

    if (!latitude || !longitude) {
      setMessage("Please capture your GPS location first.");
      return;
    }

    const formData = new FormData();
    formData.append("damageType", damageType);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("image", image);

    try {
      const response = await fetch(
        `${API_URL}/api/reports`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      setMessage("Report submitted successfully!");
    } catch (error) {
      setMessage(
        error.message || "Could not submit report. Check the backend."
      );
    }
  }

  return (
    <div className="report-container">
      <h1>Report Road Damage</h1>
      <p>Upload a photo and capture the road location.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="damageType">Damage Type</label>
        <select
          id="damageType"
          value={damageType}
          onChange={(event) => setDamageType(event.target.value)}
        >
          <option value="Pothole">Pothole</option>
          <option value="Crack">Crack</option>
          <option value="Road Surface Damage">Road Surface Damage</option>
          <option value="Waterlogging">Waterlogging</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="damageImage">Road Damage Image</label>
        <input
          id="damageImage"
          type="file"
          accept="image/*"
          onChange={(event) =>
            setImage(event.target.files?.[0] || null)
          }
        />

        {image && (
          <div>
            <p>Selected image: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Selected road damage"
              style={{ width: "100%", maxWidth: "350px" }}
            />
          </div>
        )}

        <button type="button" onClick={getLocation}>
          Capture GPS Location
        </button>

        <p>Latitude: {latitude || "Not captured"}</p>
        <p>Longitude: {longitude || "Not captured"}</p>

        <button type="submit">Submit Report</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Report;
