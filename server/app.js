let express = require('express');
let fs = require('fs');
let app = express();



app.use((req, res, next) => {
    // write your logging code here
    let agent = req.headers['user-agent'].replace(',', '') + ',';
    let time = new Date().toISOString() + ',';
    let method = req.method + ',';
    let resource = req.url + ',';
    let version = 'HTTP/' + req.httpVersion + ',';
    let status = res.statusCode + '/n';
    let saved = (agent + time + method + resource + version + status);

    fs.appendFile('log.csv', saved, (err) => {
        if (err) throw err;
        console.log(saved);

        next();
    });
});

app.get('/', (req, res, next) => {
    // write your code to respond "ok" here
    res.send('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return the CSV file to json object containing the log data here
    fs.readFile('server/log.csv', 'utf-8', function(err, data) {

        function csvJSON(csv) {
            let lines = csv.split("\n");
            let result = [];
            let headers = lines[0].split(",");

            for (let i = 1; i < lines.length; i++) {
                let obj = {};
                let currentline = lines[i].split(",");

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            return result;
        }
        res.json(csvJSON(data));
        res.end();
    });
});
module.exports = app;