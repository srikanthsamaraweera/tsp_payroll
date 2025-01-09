"use client"
import { useState } from "react";

export default function AnalyzePage() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const analyzeData = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setAnswer("");

        try {
            const response = await fetch("/api/openapi/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            setAnswer(data.answer || "No response available.");
        } catch (error) {
            console.error("Error:", error);
            setAnswer("Error occurred while analyzing data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Database Analysis</h1>
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the database..."
                rows="4"
                cols="50"
            ></textarea>
            <br />
            <button onClick={analyzeData} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
            </button>
            {answer && (
                <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
                    <h3>AI Response:</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}
