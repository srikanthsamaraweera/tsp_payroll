import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default async function CanvasGen(element, savefilename) {
    //element should be passed as : document.getElementbyID('id') through the calling component. 
    //savefilename is a String


    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${savefilename}.pdf`);

}