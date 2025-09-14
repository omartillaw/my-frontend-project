import React, { useState } from "react";
import axios from "axios";

const n8n_webhook_url = "https://omar1tillawy.app.n8n.cloud/webhook/Tauga_project";

const ProgressBar = ({ label, score }) => {
  // Ensure score is within 0-100 range
  const displayScore = Math.max(0, Math.min(100, score || 0));

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-700 font-semibold">{label}</span>
        <span className="text-sm font-bold text-gray-800">{displayScore}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${displayScore}%` }}
        ></div>
      </div>
    </div>
  );
};


function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState("5");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  const handleUpload = async () => {
   if (!file) {
      setError("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("audio", file); 
    formData.append("question", question);
    formData.append("level", level);

    try {
      setLoading(true);
      setError("");
      setResult(null);
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

   const getFeedbackImage = () => {
    if (!result || !result.evaluation) return null;

    const scores = Object.values(result.evaluation);
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    const averageScore = sum / scores.length;

    if (averageScore > 75) 
      return "/Images/great-job.png"; 
     else if (averageScore >= 50) 
      return "/Images/keep-practicing.png"; 
     else 
      return "/Images/try-again.png"; 
    
  };

  return (
    
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
      
      
      {result && (
        <img 
          src={getFeedbackImage()} 
          alt="Feedback Image" 
          className="mb-8 rounded-full shadow-lg"
          style={{ width: '200px', height: '200px' }}
        />
      )}

      <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6">
            English Oral Exam Practice, By omar
          </h1>
          
          <div className="space-y-6">
            <div className="relative">
              <label htmlFor="question" className="text-gray-700 font-medium mb-1 block">
                Question:
              </label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="level" className="text-gray-700 font-medium mb-1 block">
                Level (3, 4, 5):
              </label>
              <input
                id="level"
                type="number"
                min="3"
                max="5"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label 
                htmlFor="audio-file" 
                className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                Choose File
              </label>
              <input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden" 
              />
              <span className="text-sm text-gray-500 truncate">
                {file ? file.name : "No file chosen"}
              </span>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-lg text-white transition-all duration-300 ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg"
              }`}
            >
              {loading ? "Uploading..." : "Upload Audio"}
            </button>
          </div>
        </div>
        
        
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gray-50 flex flex-col justify-center">
          {!result && !loading && (
            <p className="text-center text-gray-500 italic">
              Your results will appear here after you submit an audio file.
            </p>
          )}

          {loading && (
            <div className="flex justify-center items-center">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-lg text-gray-600">Analyzing...</span>
            </div>
          )}

          {result && (
            <div className="space-y-8">
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Transcription</h2>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm max-h-48 overflow-y-auto">
                  <p className="text-gray-700">{result.transcription}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4 space-x-2">
                  <span className="text-lg font-bold text-gray-800">Audio Length:</span>
                  <span className="text-gray-700">{result.length}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Evaluation</h2>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  {result.evaluation && (
                    <>
                      <ProgressBar label="Vocabulary" score={result.evaluation.vocabularyRichness} />
                      <ProgressBar label="Fluency" score={result.evaluation.fluency} />
                      <ProgressBar label="Clarity of Expression" score={result.evaluation.clarityOfExpression} />
                      <ProgressBar label="Accent Similarity" score={result.evaluation.accentSimilarityToAmericanEnglish} />
                      <ProgressBar label="Audio Quality" score={result.evaluation.audioQuality} />
                      <ProgressBar label="Grammar and Syntax" score={result.evaluation.grammarAndSyntax} />
                      <ProgressBar label="Answer Relevance" score={result.evaluation.answerRelevance} />
                    </>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Suggestions</h2>
                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <p className="text-gray-700">{result.suggestions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

