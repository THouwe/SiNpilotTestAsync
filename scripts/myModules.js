require("dotenv").config();
var Dropbox = require("dropbox").Dropbox;
const fetch = require("node-fetch");

const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;

// https://www.dropbox.com/developers/documentation/javascript#tutorial
const dbx = new Dropbox({
  accessToken: process.env.DROPBOXACCESSTOKEN,
  fetch: fetch
});

saveDropbox = function(content, filename) {
  let status = undefined;
  if (filename.size > UPLOAD_FILE_SIZE_LIMIT) {
    console.error("File too big");
    return 403;
  }
  dbx.filesUpload({ path: "/" + filename, contents: content })
    .then(function(response) {
       console.log(response.name + ' - ' + response.id);
       status = 200;
    })
    .catch(function(error) {
       console.error(error.error_summary);
       status = 409;
    });
    return status;
};

// https://gist.github.com/maciejjankowski/2db91642fb9eaa771111f2c0538e4560
// https://gist.github.com/jeffhuangtw/54b6947a37c1f1c7dd6bc720179181d3
function json2csv(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var line = '';
  var result = '';
  var columns = [];

  var i = 0;
  for (var j = 0; j < array.length; j++) {
    for (var key in array[j]) {
      var keyString = key + "";
      keyString  = '"' + keyString.replace(/"/g, '""') + '",';
      if (!columns.includes(key)) {
        columns[i] = key;
        line += keyString;
        i++;
      }
    }
  }

  line = line.slice(0, -1);
  result += line + '\r\n';

  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var j = 0; j < columns.length; j++) {
        var value = (typeof array[i][columns[j]] === 'undefined') ? '' :  array[i][columns[j]];
        var valueString = value + "";
        line += '"' + valueString.replace(/"/g, '""') + '",';
      }
        // line += '"' + valueString.replace(searchValue: /"/g, replaceValue: '""') + '",';

      line = line.slice(0, -1);
      result += line + '\r\n';
    }

    return result;
}


require('dotenv').config({silent: true});

module.exports = {
        DBX_API_DOMAIN: 'https://api.dropboxapi.com',
        DBX_OAUTH_DOMAIN: 'https://www.dropbox.com',
        DBX_OAUTH_PATH: '/oauth2/authorize',
        DBX_TOKEN_PATH: '/oauth2/token',
        DBX_LIST_FOLDER_PATH:'/2/files/list_folder',
        DBX_LIST_FOLDER_CONTINUE_PATH:'/2/files/list_folder/continue',
        DBX_GET_TEMPORARY_LINK_PATH:'/2/files/get_temporary_link',
        DBX_APP_KEY:process.env.DBX_APP_KEY,
        DBX_APP_SECRET:process.env.DBX_APP_SECRET,
        OAUTH_REDIRECT_URL:process.env.OAUTH_REDIRECT_URL,
        SESSION_ID_SECRET:process.env.SESSION_ID_SECRET,
}


module.exports.saveDropbox = saveDropbox;
module.exports.json2csv = json2csv;
