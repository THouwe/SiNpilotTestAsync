function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // Retrieve file from experiment
    csvFile = new Blob([csv], {type: 'text/csv'});

    // Download link
    downloadLink = document.createElement(tagName = "a");

    // Retrieve filename
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide downloadLink
    downloadLink.style.display = 'none';

    // Add link to the DOM
    document.body.appendChild(downloadLink);

    downloadLink.click();
}
