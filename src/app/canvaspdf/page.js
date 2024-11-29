"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function GeneratePDF() {
    const generatePdf = async () => {
        const element = document.getElementById("pdf-content");
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("document.pdf");
    };

    return (
        <div>
            <div id="pdf-content">
                <h1>Content to Generate PDF</h1>
                <p>This content will be included in the PDF.</p>
            </div>
            <button onClick={generatePdf}>Generate PDF</button>
        </div>
    );
}
