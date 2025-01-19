import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState(""); // for text input
  const [audioFile, setAudioFile] = useState(null); // for audio file
  const [streamedText, setStreamedText] = useState(""); // to store the streaming response
  const [isStreaming, setIsStreaming] = useState(false); // to track streaming state

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStreamedText(""); // Clear previous streamed text
    setIsStreaming(true); // Set streaming to true

    const formData = new FormData();

    // Add input text or audio file to the form data
    if (input) {
      formData.append("input_string", input);
    }
    if (audioFile) {
      formData.append("audio_file", audioFile);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/", {
        method: "POST",
        body: formData,
      });

      if (!response.body) {
        throw new Error("No response body from the server");
      }

      // Read the streamed response
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        // Decode and append streamed chunks to `streamedText`
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          setStreamedText((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error("Error fetching streamed tasks:", error);
      setStreamedText("An error occurred while streaming tasks.");
    } finally {
      setIsStreaming(false); // Stop streaming state
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        {/* Text input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a string"
          style={{ padding: "8px", marginRight: "8px" }}
        />

        {/* Audio file input */}
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
          style={{ padding: "8px", marginRight: "8px" }}
        />

        <button type="submit" style={{ padding: "8px 16px" }}>
          Submit
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h2>Streaming Response</h2>
        {isStreaming ? (
          <p style={{ fontStyle: "italic", color: "blue" }}>Loading...</p>
        ) : null}
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "4px",
            marginTop: "10px",
          }}
        >
          {streamedText || "No response yet. Enter a string or upload an audio file!"}
        </pre>
      </div>
    </div>
  );
}

export default App;
