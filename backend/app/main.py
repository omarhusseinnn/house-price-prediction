from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os

app = FastAPI(
    title="House Price Prediction API",
    description="API for predicting house prices",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "models",
    "house_price_model.pkl"
)

saved_data = joblib.load(MODEL_PATH)

model = saved_data["model"]
feature_columns = saved_data["feature_columns"]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(data: dict):

    input_df = pd.DataFrame([data])

    # Keep only the features used by the model
    input_df = input_df[feature_columns]

    # Convert all inputs to numbers
    for column in feature_columns:
        input_df[column] = pd.to_numeric(
            input_df[column],
            errors="coerce"
        )

    # Fill missing values using the model's expected numeric input
    input_df = input_df.fillna(0)

    # Prediction
    prediction = model.predict(input_df)

    return {
        "predicted_price": float(prediction[0])
    }