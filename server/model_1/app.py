from flask import Flask, request, jsonify
import os
import pandas as pd
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and assets using pickle
with open('heart_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('label_encoders.pkl', 'rb') as f:
    metadata = pickle.load(f, encoding='latin1')
    encoders = metadata['encoders']
    feature_order = metadata['feature_order']

@app.route('/predict', methods=['POST'])
def predict_heart_disease():
    data = request.json
    inputs = {}

    # Validation and encoding logic remains identical
    for feature in feature_order:
        if feature in encoders:
            encoder = encoders[feature]
            value = data.get(feature)
            if value not in encoder.classes_:
                return jsonify({"error": f"Invalid value for {feature}"}), 400
            inputs[feature] = encoder.transform([value])[0]
        else:
            try:
                inputs[feature] = float(data.get(feature))
            except ValueError:
                return jsonify({"error": f"Invalid numerical value for {feature}"}), 400

    user_data = pd.DataFrame([inputs], columns=feature_order)
    prediction = model.predict(user_data)
    risk = "High risk" if prediction[0][0] > 0.5 else "Low risk"
    confidence = float(prediction[0][0] * 100)

    return jsonify({
        "risk": risk,
        "confidence": confidence
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
