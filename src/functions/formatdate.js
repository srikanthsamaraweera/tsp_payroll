export default function FormatDate(dateval) {

    if (!dateval) return ""; // Return an empty string if the date is null/undefined
    const d = new Date(dateval);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Add leading zero
    const day = String(d.getDate()).padStart(2, "0"); // Add leading zero
    return `${year}-${month}-${day}`;

}