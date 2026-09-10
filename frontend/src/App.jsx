import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW: selected candidate for detailed verification
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setSelectedCandidate(null);
  }

  async function handleSearch() {
    if (!selectedFile) {
      return;
    }

    setLoading(true);
    setResult(null);
    setSelectedCandidate(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        body: formData,
      });

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

  function getStatusLabel(status) {
    switch (status) {
      case "POTENTIAL_MATCH":
        return "Potential Match Found";

      case "NO_RELIABLE_MATCH":
        return "No Reliable Match";

      case "NO_FACE":
        return "No Face Detected";

      case "MULTIPLE_FACES":
        return "Multiple Faces Detected";

      case "NO_DATABASE_RECORDS":
        return "No Database Records";

      default:
        return status;
    }
  }

  function getStatusClass(status) {
    switch (status) {
      case "POTENTIAL_MATCH":
        return "status-success";

      case "NO_RELIABLE_MATCH":
        return "status-warning";

      default:
        return "status-neutral";
    }
  }

  function formatDistance(distance) {
    if (distance === null || distance === undefined) {
      return "—";
    }

    return distance.toFixed(4);
  }

  const topCandidate =
    result?.candidates?.length > 0 ? result.candidates[0] : null;

  const otherCandidates =
    result?.candidates?.length > 1 ? result.candidates.slice(1) : [];

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="header-inner">

          <div className="brand">

            <div className="brand-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 3a7 7 0 0 0-7 7v3a7 7 0 0 0 14 0v-3a7 7 0 0 0-7-7Z" />

                <path d="M8.5 11.5c.8.7 1.9 1 3.5 1s2.7-.3 3.5-1" />

                <circle
                  cx="9"
                  cy="9"
                  r=".7"
                  fill="currentColor"
                />

                <circle
                  cx="15"
                  cy="9"
                  r=".7"
                  fill="currentColor"
                />

              </svg>

            </div>

            <div>

              <h1>Missing Person Finder</h1>

              <span>
                AI-assisted identification system
              </span>

            </div>

          </div>

          <div className="system-status">

            <span className="status-dot"></span>

            System Online

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="container">

        {/* ================= SEARCH PANEL ================= */}

        <section className="search-panel">

          <div className="section-heading">

            <div>

              <span className="section-label">
                STEP 01
              </span>

              <h3>
                Upload a photograph
              </h3>

              <p>
                Select a clear image containing one person's face.
              </p>

            </div>

          </div>


          {/* ================= UPLOAD ================= */}

          <label className="upload-area">

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="upload-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 16V4" />

                <path d="m7 9 5-5 5 5" />

                <path d="M5 20h14" />

              </svg>

            </div>

            <strong>
              {selectedFile
                ? selectedFile.name
                : "Choose an image to search"}
            </strong>

            <span>
              JPG, JPEG or PNG
            </span>

          </label>


          {/* ================= QUERY PREVIEW ================= */}

          {preview && (

            <div className="query-preview">

              <div className="query-preview-header">

                <div>

                  <span className="section-label">
                    SELECTED IMAGE
                  </span>

                  <h4>
                    Query photograph
                  </h4>

                </div>

                <span className="image-ready">
                  ✓ Ready
                </span>

              </div>


              <div className="query-image-wrapper">

                <img
                  src={preview}
                  alt="Selected query"
                  className="query-image"
                />

              </div>

            </div>

          )}


          {/* ================= SEARCH BUTTON ================= */}

          {selectedFile && (

            <button
              className="search-button"
              onClick={handleSearch}
              disabled={loading}
            >

              {loading ? (

                <>
                  <span className="spinner"></span>

                  Analyzing face...
                </>

              ) : (

                <>
                  Search Database

                  <span className="button-arrow">
                    →
                  </span>
                </>

              )}

            </button>

          )}

        </section>


        {/* ================= RESULTS ================= */}

        {result && (

          <section className="results-section">

            <div className="results-header">

              <div>

                <span className="section-label">
                  STEP 02
                </span>

                <h3>
                  Search results
                </h3>

              </div>


              {/* ================= RESULT STATUS ================= */}

              <div
                className={`result-status ${getStatusClass(
                  result.status
                )}`}
              >

                <span className="result-status-dot"></span>

                <div className="status-content">

                  <strong>
                    {getStatusLabel(result.status)}
                  </strong>

                  <p>

                    {result.status === "POTENTIAL_MATCH"

                      ? "A possible match was found in the missing-person database. Please review the candidate below."

                      : result.status === "NO_RELIABLE_MATCH"

                        ? "No sufficiently similar person was found in the current missing-person database."

                        : result.status === "NO_FACE"

                          ? "No clear face was detected in the uploaded photograph."

                          : result.status === "MULTIPLE_FACES"

                            ? "Multiple faces were detected. Please upload an image containing one person."

                            : "The search could not be completed."}

                  </p>

                </div>

              </div>

            </div>


            {/* ================= TOP CANDIDATE ================= */}

            {topCandidate && (

              <div className="top-result">

                <div className="top-result-header">

                  <div className="rank-badge">

                    <span>
                      01
                    </span>

                    TOP CANDIDATE

                  </div>

                  <span className="rank-text">
                    Rank #1
                  </span>

                </div>


                <div className="top-result-content">

                  <div className="candidate-title">

                    <div>

                      <span className="candidate-label">
                        POTENTIAL MATCH
                      </span>

                      <h4>
                        {topCandidate.person.name}
                      </h4>

                    </div>

                    <div className="person-id">

                      ID #{topCandidate.person.person_id}

                    </div>

                  </div>


                  {/* ================= IMAGE COMPARISON ================= */}

                  <div className="comparison-large">

                    <div className="comparison-card">

                      <div className="comparison-label">

                        <span>
                          QUERY
                        </span>

                        <small>
                          Uploaded photograph
                        </small>

                      </div>

                      <img
                        src={preview}
                        alt="Query"
                        className="large-comparison-image"
                      />

                    </div>


                    <div className="comparison-arrow">

                      <span>
                        ↔
                      </span>

                    </div>


                    <div className="comparison-card">

                      <div className="comparison-label">

                        <span>
                          MATCHED RECORD
                        </span>

                        <small>
                          Database photograph
                        </small>

                      </div>

                      <img
                        src={`${API_URL}/photo/${topCandidate.match.best_photo_id}`}
                        alt={`Matched ${topCandidate.person.name}`}
                        className="large-comparison-image"
                      />

                    </div>

                  </div>


                  {/* ================= PERSON INFORMATION ================= */}

                  <div className="person-info">

                    <div className="info-item">

                      <span>
                        Age
                      </span>

                      <strong>
                        {topCandidate.person.age ?? "Not provided"}
                      </strong>

                    </div>


                    <div className="info-item">

                      <span>
                        Gender
                      </span>

                      <strong>
                        {topCandidate.person.gender ?? "Not provided"}
                      </strong>

                    </div>


                    <div className="info-item">

                      <span>
                        Last Seen
                      </span>

                      <strong>
                        {topCandidate.person.last_seen_location ??
                          "Not provided"}
                      </strong>

                    </div>


                    <div className="info-item">

                      <span>
                        Reference Photos
                      </span>

                      <strong>
                        {topCandidate.match.reference_photos}
                      </strong>

                    </div>

                  </div>


                  {/* ================= DISTANCE METRICS ================= */}

                  <div className="metrics">

                    <div className="metric">

                      <span>
                        Best Face Distance
                      </span>

                      <strong>
                        {formatDistance(
                          topCandidate.match.best_distance
                        )}
                      </strong>

                      <small>
                        Closest reference
                      </small>

                    </div>


                    <div className="metric">

                      <span>
                        Average Face Distance
                      </span>

                      <strong>
                        {formatDistance(
                          topCandidate.match.average_distance
                        )}
                      </strong>

                      <small>
                        Across reference photos
                      </small>

                    </div>

                  </div>


                  {/* ================= VERIFICATION NOTICE ================= */}

                  <div className="verification-notice">

                    <div className="notice-icon">
                      !
                    </div>

                    <div>

                      <strong>
                        Human verification required
                      </strong>

                      <p>
                        AI ranking identifies potential candidates.
                        Final identification should be verified by
                        a human investigator.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            )}


            {/* ================= OTHER CANDIDATES ================= */}

            {otherCandidates.length > 0 && (

              <div className="other-results">

                <div className="other-results-heading">

                  <div>

                    <span className="section-label">
                      ADDITIONAL RESULTS
                    </span>

                    <h4>
                      Other potential candidates
                    </h4>

                  </div>

                  <span className="candidate-count">

                    {otherCandidates.length} candidates

                  </span>

                </div>


                <div className="candidate-list">

                  {otherCandidates.map((candidate) => (

                    <div
                      className="candidate-row"
                      key={candidate.person.person_id}

                      // NEW: clicking opens verification modal
                      onClick={() =>
                        setSelectedCandidate(candidate)
                      }

                      role="button"
                      tabIndex={0}

                      onKeyDown={(event) => {

                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          setSelectedCandidate(candidate);
                        }

                      }}

                    >

                      <div className="candidate-rank">

                        #{String(candidate.rank).padStart(2, "0")}

                      </div>


                      <img
                        src={`${API_URL}/photo/${candidate.match.best_photo_id}`}
                        alt={candidate.person.name}
                        className="candidate-thumbnail"
                      />


                      <div className="candidate-summary">

                        <strong>
                          {candidate.person.name}
                        </strong>

                        <span>
                          Person ID #{candidate.person.person_id}
                        </span>

                      </div>


                      <div className="candidate-distance">

                        <span>
                          Best distance
                        </span>

                        <strong>
                          {formatDistance(
                            candidate.match.best_distance
                          )}
                        </strong>

                      </div>


                      <div className="candidate-average">

                        <span>
                          Average
                        </span>

                        <strong>
                          {formatDistance(
                            candidate.match.average_distance
                          )}
                        </strong>

                      </div>


                      {/* NEW: visual hint */}
                      <div
                        className="candidate-open"
                        aria-hidden="true"
                      >
                        →
                      </div>

                    </div>

                  ))}

                </div>

              </div>

            )}


            {/* ================= NO RESULTS ================= */}

            {!topCandidate && (

              <div className="empty-result">

                <div className="empty-icon">
                  ×
                </div>

                <h4>
                  No potential matches found
                </h4>

                <p>
                  The uploaded image did not produce a reliable
                  candidate in the current database.
                </p>

              </div>

            )}

          </section>

        )}

      </main>


      {/* =====================================================
          CANDIDATE VERIFICATION MODAL
      ===================================================== */}

      {selectedCandidate && (

        <div
          className="verification-modal-overlay"

          onClick={() =>
            setSelectedCandidate(null)
          }
        >

          <div
            className="verification-modal"

            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ================= MODAL HEADER ================= */}

            <div className="verification-modal-header">

              <div>

                <span className="section-label">
                  CANDIDATE VERIFICATION
                </span>

                <h3>
                  {selectedCandidate.person.name}
                </h3>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setSelectedCandidate(null)
                }
                aria-label="Close verification"
              >
                ×
              </button>

            </div>


            {/* ================= RANK ================= */}

            <div className="verification-rank">

              <span>
                RANK #{selectedCandidate.rank}
              </span>

              <span>
                PERSON ID #{selectedCandidate.person.person_id}
              </span>

            </div>


            {/* ================= LARGE COMPARISON ================= */}

            <div className="verification-comparison">

              <div className="verification-image-card">

                <div className="verification-image-title">

                  <strong>
                    Query Image
                  </strong>

                  <span>
                    Uploaded photograph
                  </span>

                </div>

                <img
                  src={preview}
                  alt="Query photograph"
                />

              </div>


              <div className="verification-arrow">
                ↔
              </div>


              <div className="verification-image-card">

                <div className="verification-image-title">

                  <strong>
                    Database Image
                  </strong>

                  <span>
                    Best matching reference
                  </span>

                </div>

                <img
                  src={`${API_URL}/photo/${selectedCandidate.match.best_photo_id}`}
                  alt={`Database record for ${selectedCandidate.person.name}`}
                />

              </div>

            </div>


            {/* ================= PERSON DETAILS ================= */}

            <div className="verification-details">

              <div>

                <span>
                  Name
                </span>

                <strong>
                  {selectedCandidate.person.name}
                </strong>

              </div>


              <div>

                <span>
                  Person ID
                </span>

                <strong>
                  #{selectedCandidate.person.person_id}
                </strong>

              </div>


              <div>

                <span>
                  Age
                </span>

                <strong>
                  {selectedCandidate.person.age ??
                    "Not provided"}
                </strong>

              </div>


              <div>

                <span>
                  Gender
                </span>

                <strong>
                  {selectedCandidate.person.gender ??
                    "Not provided"}
                </strong>

              </div>


              <div>

                <span>
                  Last Seen
                </span>

                <strong>
                  {selectedCandidate.person.last_seen_location ??
                    "Not provided"}
                </strong>

              </div>


              <div>

                <span>
                  Reference Photos
                </span>

                <strong>
                  {selectedCandidate.match.reference_photos}
                </strong>

              </div>

            </div>


            {/* ================= MATCH METRICS ================= */}

            <div className="verification-metrics">

              <div>

                <span>
                  Best Face Distance
                </span>

                <strong>
                  {formatDistance(
                    selectedCandidate.match.best_distance
                  )}
                </strong>

                <small>
                  Closest reference photo
                </small>

              </div>


              <div>

                <span>
                  Average Face Distance
                </span>

                <strong>
                  {formatDistance(
                    selectedCandidate.match.average_distance
                  )}
                </strong>

                <small>
                  Across all reference photos
                </small>

              </div>

            </div>


            {/* ================= WARNING ================= */}

            <div className="verification-modal-notice">

              <span>
                !
              </span>

              <div>

                <strong>
                  Human verification required
                </strong>

                <p>
                  This is an AI-generated candidate ranking,
                  not a confirmed identification. Compare the
                  photographs and verify the person's identity
                  using appropriate evidence.
                </p>

              </div>

            </div>


            {/* ================= CLOSE ================= */}

            <button
              className="verification-close-button"
              onClick={() =>
                setSelectedCandidate(null)
              }
            >
              Close Verification
            </button>

          </div>

        </div>

      )}


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <span>
          Missing Person Finder
        </span>

        <span>
          AI-assisted search • Human verification required
        </span>

      </footer>

    </div>
  );
}

export default App;