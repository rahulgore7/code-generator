"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./codes.css";

const Code = () => {
  const [inputCode, setInputCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to refresh and get a new code
  const refreshCode = async () => {
    try {
      // Fetch new code using Axios
      const response = await axios.get("http://localhost:4000/api/codes");
      const newCode = response.data.code;

      // Set the new code to the state
      setGeneratedCode(newCode);
      setSuccessMessage("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error refreshing code:", error);
    }
  };

  // Function to handle code submission
  const submitCode = async () => {
    try {
      // Send a request to your API endpoint with the entered code using Axios
      const response = await axios.post("http://localhost:4000/api/codes/use", {
        code: inputCode,
      });
      const data = response.data;

      // Check if the response contains an error or a success message
      const message = data.message;
      setSuccessMessage(message);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`${error.response.data.error}. Please Refresh.`);
      setSuccessMessage("");
    }
  };

  // useEffect to fetch a new code when the component mounts
  useEffect(() => {
    refreshCode();
  }, []);

  return (
    <div className="container">
      <h1>Code Generator</h1>
      <h2>{generatedCode}</h2>
      <input
        type="text"
        id="text"
        placeholder="Enter your code"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
      />
      <button id="go" onClick={submitCode}>
        Submit
      </button>
      <br />
      <button id="go" onClick={refreshCode}>
        Refresh
      </button>
      {errorMessage && <h2>{errorMessage}</h2>}
      {successMessage && <h2>{successMessage}</h2>}
    </div>
  );
};

export default Code;
