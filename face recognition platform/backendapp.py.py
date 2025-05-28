from flask import Flask, jsonify, request
from flask_cors import CORS
import face_recognition
import numpy as np
import sqlite3
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# Initialize database
def init_db():
    conn = sqlite3.connect('faces.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS faces
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT NOT NULL,
                  encoding BLOB NOT NULL,
                  timestamp TEXT NOT NULL)''')
    conn.commit()
    conn.close()

@app.route('/register', methods=['POST'])
def register_face():
    data = request.get_json()
    image_data = np.array(data['image'])
    name = data['name']
    
    rgb_image = image_data[:, :, ::-1]
    face_locations = face_recognition.face_locations(rgb_image)
    face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
    
    if len(face_encodings) == 0:
        return jsonify({"status": "error", "message": "No face detected"})
    
    conn = sqlite3.connect('faces.db')
    c = conn.cursor()
    encoding_bytes = face_encodings[0].tobytes()
    c.execute("INSERT INTO faces (name, encoding, timestamp) VALUES (?, ?, ?)",
              (name, encoding_bytes, datetime.now().isoformat()))
    conn.commit()
    conn.close()
    
    return jsonify({"status": "success", "message": f"Face registered as {name}"})

if __name__ == '__main__':
    init_db()
    app.run(port=5000)