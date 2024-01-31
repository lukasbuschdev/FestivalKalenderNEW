// #######################################################################
// LOADING PAGE
// #######################################################################

async function init() {
    loadHeader();
    loadContent();
    loadFooter();
}



// #######################################################################
// GET DATASET
// #######################################################################

const datasets = [
    "../FestivalKalenderData.xlsx.csv"
];



// #######################################################################
// GET DATASET AND CONVERT .CSV TO .JSON
// #######################################################################

async function getData() {
    const promises = datasets.map(dataset => fetchAndParseCSV(dataset));
    const results = await Promise.all(promises);
    const data = results.flat();
    const updatedData = data.map((festival, index) => {
        return {
            ...festival,
            id: index + 1
        };
    });
    return updatedData;
}

async function fetchAndParseCSV(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();

        const jsonData = CSVtoJSON(text);
        // log(jsonData) 
        return jsonData;
    } catch (error) {
        error("Error fetching or parsing the file:", error);
    }
}

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