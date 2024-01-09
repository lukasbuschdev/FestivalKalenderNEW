async function init() {
    loadHeader();
    loadFooter();
    loadContent();
}

const datasets = [
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSsSjrEn4kV5e875u9VohZRBDSVfFLWg-RjYoUqCEqge6fJ1rHIf_pRHb4y8JFK4w/pub?output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSw8XGlB5WV5_K2mQwpyM_f5KfsQjdySGtDYlKHTDr-xw2emJiGUehC9DWGgVciWw/pub?output=csv",
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQM-ynHikWhurk83pnauFp45Fhcp7kxMlQbYWIBEd3CIUMCWdZ4znudGGkHDEonVA/pub?output=csv"
]

async function fetchAndParseCSV(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    try {
        const response = await fetch(proxyUrl + url);
        const text = await response.text();
        const jsonData = CSVtoJSON(text); 
        return jsonData;
    } catch (error) {
        console.error("Error fetching or parsing the file:", error);
    }
}


// async function fetchAndParseCSV(url) {
//     try {
//         const response = await fetch(url);
//         const text = await response.text();
//         const jsonData = CSVtoJSON(text); 
//         return jsonData;
//     } catch (error) {
//         console.error("Error fetching or parsing the file:", error);
//     }
// }

function CSVtoJSON(csv, delimiter = ',') {
    const lines = csv.split('\n');
    const headers = lines[0].split(delimiter);

    return lines.slice(1).map(line => {
        const values = line.split(delimiter);
        return headers.reduce((object, header, index) => {
            header = header.trim();
            object[header] = values[index].trim();
            return object;
        }, {});
    }).filter(obj => Object.keys(obj).length > 0);
}

async function getData() {
    const promises = datasets.map(dataset => fetchAndParseCSV(dataset));
    const results = await Promise.all(promises);
    return results.flat();
}
































// async function fetchAndParseXLSX(url) {
//     try {
//         const response = await fetch(url);
//         const arrayBuffer = await response.arrayBuffer();
//         const data = new Uint8Array(arrayBuffer);
//         const workbook = XLSX.read(data, { type: "array" });

//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const jsonData = XLSX.utils.sheet_to_json(worksheet);
//         // console.log(jsonData);
//         return jsonData;
//     } catch (error) {
//         console.error("Error fetching or parsing the file:", error);
//     }
// }