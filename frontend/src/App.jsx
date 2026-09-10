import { useState } from "react";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }

  async function handleSearch() {
    if (!selectedFile) {
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/search",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("SEARCH RESULT:", data);

      setResult(data);

    } catch (error) {
      console.error(error);

      setResult({
        status: "ERROR",
        candidates: [],
      });

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">

      <header className="header">
        <h1>Missing Person Finder</h1>

        <p>
          AI-assisted face search for missing-person investigations
        </p>
      </header>

      <main className="container">

        {/* Upload Section */}
        <section className="upload-card">

          <h2>Search for a Missing Person</h2>

          <p className="description">
            Upload a photograph to search for potential matches
            in the registered missing-person database.
          </p>

          <label className="upload-area">

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <span>
              Click to select an image
            </span>

          </label>


          {/* Query Image */}
          {preview && (
            <div className="preview-section">

              <h3>Query Image</h3>

              <img
                src={preview}
                alt="Query"
                className="preview-image"
              />

            </div>
          )}


          {/* Search Button */}
          {selectedFile && (
            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search for Matches"}
            </button>
          )}


          {/* Results */}
          {result && (

            <section className="results-section">

              <h2>Search Results</h2>

              <div className="status">
                <strong>Status:</strong>{" "}
                {result.status}
              </div>


              {result.candidates &&
                result.candidates.length > 0 && (

                <div className="candidates">

                  {result.candidates.map((candidate) => (

                    <div
                      className={`candidate-card ${
                        candidate.rank === 1
                          ? "top-candidate"
                          : ""
                      }`}
                      key={candidate.person.person_id}
                    >

                      {/* Top Candidate Badge */}
                      {candidate.rank === 1 && (
                        <div className="top-badge">
                          🥇 Top Candidate
                        </div>
                      )}


                      {/* Person Information */}
                      <div className="candidate-header">

                        <h3>
                          {candidate.person.name}
                        </h3>

                        <span>
                          Rank #{candidate.rank}
                        </span>

                      </div>


                      {/* Image Comparison */}
                      {candidate.match.best_photo_id && (

                        <div className="comparison">

                          {/* Query Image */}
                          <div className="image-box">

                            <h4>
                              Query Image
                            </h4>

                            <img
                              src={preview}
                              alt="Query"
                              className="comparison-image"
                            />

                          </div>


                          {/* Database Image */}
                          <div className="image-box">

                            <h4>
                              Matched Database Image
                            </h4>

                            <img
                              src={`http://127.0.0.1:8000/photo/${candidate.match.best_photo_id}`}
                              alt={`Matched photo of ${candidate.person.name}`}
                              className="comparison-image"
                            />

                          </div>

                        </div>

                      )}


                      {/* Person Details */}
                      <div className="candidate-details">

                        <p>
                          <strong>Person ID:</strong>{" "}
                          {candidate.person.person_id}
                        </p>

                        <p>
                          <strong>Age:</strong>{" "}
                          {candidate.person.age}
                        </p>

                        <p>
                          <strong>Gender:</strong>{" "}
                          {candidate.person.gender}
                        </p>

                        <p>
                          <strong>Last Seen:</strong>{" "}
                          {candidate.person.last_seen_location}
                        </p>

                      </div>


                      {/* Match Information */}
                      <div className="match-details">

                        <div className="distance-item">

                          <strong>
                            Best Face Distance
                          </strong>

                          <span>
                            {candidate.match.best_distance.toFixed(4)}
                          </span>

                        </div>


                        <div className="distance-item">

                          <strong>
                            Average Face Distance
                          </strong>

                          <span>
                            {candidate.match.average_distance.toFixed(4)}
                          </span>

                        </div>

                      </div>


                      <p className="distance-note">
                        Lower distance indicates greater facial
                        similarity.
                      </p>

                    </div>

                  ))}

                </div>
              )}


              {(!result.candidates ||
                result.candidates.length === 0) && (

                <p className="no-results">
                  No potential matches found.
                </p>

              )}

            </section>
          )}

        </section>

      </main>

    </div>
  );
}

export default App;