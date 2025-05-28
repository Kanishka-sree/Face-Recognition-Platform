import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('register');

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('register')}>Register</button>
        <button onClick={() => setActiveTab('recognize')}>Recognize</button>
      </div>
      
      {activeTab === 'register' && (
        <div className="register">
          <h2>Face Registration</h2>
          <video id="video" width="640" height="480" autoPlay></video>
          <input type="text" placeholder="Enter your name" />
          <button onClick={registerFace}>Register Face</button>
        </div>
      )}
      
      {activeTab === 'recognize' && (
        <div className="recognize">
          <h2>Face Recognition</h2>
          <video id="video" width="640" height="480" autoPlay></video>
        </div>
      )}
    </div>
  );
}

export default App;