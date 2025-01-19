import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState(""); // for text input
  const [audioFile, setAudioFile] = useState(null); // for audio file
  const [tasks, setTasks] = useState([]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input, audioFile);
    
    const formData = new FormData();
    
    // If there's text input, add it to the form data
    if (input) {
      formData.append("input_string", input);
    }

    // If there's an audio file, add it to the form data
    if (audioFile) {
      formData.append("audio_file", audioFile);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // If the response is a valid JSON object, use it directly
      const parsedTasks = JSON.parse(response.data) || [];
      setTasks(parsedTasks);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); // Reset tasks to an empty array in case of an error
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
        <h2>Tasks</h2>
        {tasks && tasks.length === 0 ? (
          <p>No tasks yet. Enter a string or upload an audio file!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((task, index) => (
              <li
                key={index}
                style={{
                  background: "#f9f9f9",
                  padding: "10px",
                  margin: "8px 0",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <strong>Task:</strong> {task.task} <br />
                <strong>Status:</strong> {task.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;

