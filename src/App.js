import React, { useState } from "react";
import axios from "axios";


const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-gray-800 font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
};

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

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Results</h2>
        
        {/* Transcription Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Transcription:</h3>
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600 italic">{result.transcription}</p>
          </div>
        </div>

        {/* Evaluation Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Evaluation:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(result.evaluation).map(([key, value]) => (
              <div key={key} className="flex-1 min-w-[120px] p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, " ")}</p>
                <p className="text-xl font-bold text-blue-600">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Suggestions:</h3>
          <div className="space-y-4">
            {Object.entries(result.suggestions).map(([key, value]) => (
              <div key={key} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="font-medium text-gray-700 capitalize mb-1">{key.replace(/_/g, " ")}</p>
                <p className="text-sm text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-blue-600">English Oral Exam Practice</h1>
          <p className="text-sm text-gray-500 mt-2">by Omar</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="question" className="block text-gray-700 font-medium mb-1">Question:</label>
            <input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Describe a person you admire."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-gray-700 font-medium mb-1">Level (3, 4, 5):</label>
            <input
              id="level"
              type="number"
              min="3"
              max="5"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="audio-upload" className="block text-gray-700 font-medium mb-1">Upload Audio:</label>
            <label htmlFor="audio-upload" className="block w-full p-4 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200">
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <span className="text-gray-500 font-medium">
                {file ? file.name : "Click to select a file"}
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-lg font-bold text-lg transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          }`}
        >
          {loading ? "Uploading..." : "Upload Audio"}
        </button>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {renderResult()}
      </div>

      {showAlert && (
        <CustomAlert
          message="Please select an audio file to upload."
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default App;

