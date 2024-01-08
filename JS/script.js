async function init() {
    loadHeader();
    loadFooter();
    loadContent();
}

async function getData() {
    const dataSets = ['/FestivalKalenderAT.xlsx', '/FestivalKalenderDE.xlsx', '/FestivalKalenderCH.xlsx'];
    const promises = dataSets.map(dataset => fetchAndParseXLSX(dataset));
    const results = await Promise.all(promises);
    return results.flat();
}


async function fetchAndParseXLSX(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log(jsonData);
        return jsonData;
    } catch (error) {
        console.error("Error fetching or parsing the file:", error);
    }
}