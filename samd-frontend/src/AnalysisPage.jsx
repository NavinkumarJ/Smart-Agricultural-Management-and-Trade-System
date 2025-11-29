import { useState } from "react";

function AnalysisPage() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const analyzeImage = async () => {
    const fd = new FormData();
    fd.append("file", image);

    const res = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Crop Analysis</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button onClick={analyzeImage}>Analyze</button>

      {result && (
        <div>
          <p>Health: {result.health_status}</p>
          <p>Harvest: {result.harvest_readiness}</p>
          <p>Yield: {result.expected_yield}</p>
        </div>
      )}
    </div>
  );
}

export default AnalysisPage;
