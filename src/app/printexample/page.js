"use client"
import React, { useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PrintPage = () => {
    const componentRef = useRef();

    // Print Handler using jsPDF
    const handlePrint = () => {
        const pdf = new jsPDF();
        const content = componentRef.current;

        // Add content to PDF
        pdf.html(content, {
            callback: (doc) => {
                doc.save("report.pdf"); // Save the PDF file
            },
            x: 10,
            y: 10,
        });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Printable Report Example</h1>
            <p>Click the button below to generate a PDF report.</p>
            <button
                onClick={handlePrint}
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    background: "#007BFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Generate PDF
            </button>

            {/* Content to be printed */}
            <div
                ref={componentRef}
                style={{
                    padding: "20px",
                    border: "1px solid black",
                    background: "#f9f9f9",
                }}
            >
                <h1>Report Title</h1>
                <p>This is a sample report generated using jsPDF.</p>
                <ul>
                    <li>Data Point 1</li>
                    <li>Data Point 2</li>
                    <li>Data Point 3</li>
                </ul>
                <table style={{ width: "100%", marginTop: "20px" }} border="1">
                    <thead>
                        <tr>
                            <th>Header 1</th>
                            <th>Header 2</th>
                            <th>Header 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Value 1</td>
                            <td>Value 2</td>
                            <td>Value 3</td>
                        </tr>
                        <tr>
                            <td>Value A</td>
                            <td>Value B</td>
                            <td>Value C</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PrintPage;
