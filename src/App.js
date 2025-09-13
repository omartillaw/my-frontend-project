import React, { useState } from "react";
import axios from "axios";

const n8n_webhook_url = "https://omar1tillawy.app.n8n.cloud/webhook/Tauga_project";

function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  const handleUpload = async () => {
    if (!file) return alert("Please select an audio file");

    const formData = new FormData();
    formData.append("audio", file); 
    formData.append("question", question);
    formData.append("level", level);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        n8n_webhook_url,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Error uploading file. Make sure n8n is running.");
      setResult(null);
    } finally {
      setLoading(false);
    
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        backgroundColor: "#f0f8ff", 
        borderRadius: "10px"      
      }}
    >
      <h1>English Oral Exam Practice, By omar</h1>

      <label>
        Question:
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "100%", margin: "5px 0" }}
        />
      </label>

      <label>
        Level (3,4,5):
        <input
          type="number"
          min="3"
          max="5"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ width: "100%", margin: "5px 0" }}
        />
      </label>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ margin: "10px 0" }}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          backgroundColor: "#007bff", 
          color: "white",          
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        {loading ? "Uploading..." : "Upload Audio"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        >
          
          <h2>Transcription:</h2>
          <p>{result.transcription}</p>

          <h2>Evaluation:</h2>
          
          <pre>{JSON.stringify(result.evaluation, null, 2)}</pre>

          <h2>Suggestions:</h2>
         
          <pre>{JSON.stringify(result.suggestions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

