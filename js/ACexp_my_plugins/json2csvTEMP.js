function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    // header
    var head = array[0];
    for (var index in array[0]) {
        var value = index + "";
        line += '"' + value.replace(/"/g, '""') + '",';
    }
    line = line.slice(0, -1);
    str += line + '\r\n';

    // data
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            var value = array[i][index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }
        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;
}

$(function() {
    $("#btnDownloadCSV").click(function() {
        var json = <%- JSON.stringify(eventDatas) %>
        var csv = JSON2CSV(json);
        // download link
        var a = document.createElement("a");
        a.style = "display: none";
        // Data URI
        var bom = decodeURIComponent("%EF%BB%BF");// "\uFEFF\n";
        var byteArray = [];
        csv = bom + csv;
        csvA = new Uint16Array(csv.split('').map( function(k, v){
          return k.charCodeAt(0);
        }));
        var blob = new Blob([csvA],{type:'text/csv;charset=UTF-16LE;'});
        var blobUrl=URL.createObjectURL(blob);
        a.href = blobUrl;
        a.download = "report.csv";
        document.body.appendChild(a);
        a.click();
    });
});
