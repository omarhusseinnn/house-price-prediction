import { useState } from "react";
import "./App.css";

const fields = [
  "location",
  "Carpet Area",
  "Status",
  "Floor",
  "Transaction",
  "Furnishing",
  "facing",
  "overlooking",
  "Society",
  "Bathroom",
  "Balcony",
  "Car Parking",
  "Ownership",
  "Super Area",
];

function App() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setPrediction(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const result = await response.json();

      setPrediction(result.predicted_price);
    } catch (err) {
      setError("حدث خطأ أثناء التنبؤ. تأكدي أن الـ Backend شغال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>House Price Prediction</h1>

      <p className="subtitle">
        Enter the property details to predict its price.
      </p>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div className="field" key={field}>
            <label htmlFor={field}>{field}</label>

            <input
              id={field}
              type="text"
              value={formData[field] || ""}
              onChange={(event) =>
                handleChange(field, event.target.value)
              }
              required
            />
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Price"}
        </button>
      </form>

      {prediction !== null && (
        <div className="result">
          <h2>Predicted Price</h2>
          <p>{prediction.toLocaleString()}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;