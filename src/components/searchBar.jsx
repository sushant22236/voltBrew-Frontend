import { useState } from "react";
import axios from "axios";

function ImeiSearch() {
  const [imeiNumber, setImeiNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError("");
      setResult(null);

      const res = await axios.get(`http://localhost:3000/api/search?imeiNumber=${imeiNumber}`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        placeholder="Enter IMEI number"
        value={imeiNumber}
        onChange={(e) => setImeiNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>IMEI: {result.imeiNumber}</h3>
          <h4>Associated SIMs:</h4>
          <ul>
            {result.sims.map((sim) => (
              <li key={sim._id}>{sim.simNumber}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ImeiSearch;
