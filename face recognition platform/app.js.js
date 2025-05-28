import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize camera
  useEffect(() => {
    if (activeTab === 'register' || activeTab === 'recognize') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setMessage("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const registerFace = async () => {
    if (!name) {
      setMessage("Please enter a name");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          name: name
        }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error registering face");
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button 
          className={activeTab === 'register' ? 'active' : ''}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
        <button 
          className={activeTab === 'recognize' ? 'active' : ''}
          onClick={() => setActiveTab('recognize')}
        >
          Recognize
        </button>
      </div>
      
      {activeTab === 'register' && (
        <div className="register">
          <h2>Face Registration</h2>
          <video ref={videoRef} width="640" height="480" autoPlay muted />
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={registerFace}>Register Face</button>
          {message && <p className="message">{message}</p>}
        </div>
      )}
      
      {activeTab === 'recognize' && (
        <div className="recognize">
          <h2>Face Recognition</h2>
          <video ref={videoRef} width="640" height="480" autoPlay muted />
          <canvas ref={canvasRef} width="640" height="480" />
        </div>
      )}
    </div>
  );
}

export default App;