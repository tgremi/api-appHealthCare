let app = require("./config/server.js");
let moment = require('moment')
var time = require('time');

//Set the available port or 3000
let server_port = process.env.YOUR_PORT || process.env.PORT || 4000;
//Set the available host
let server_host = process.env.YOUR_HOST || '172.20.10.6';
let analyzer = require('./app/utils/analyzer');
let timestamp = 0;
let timerAnalyzer = () => {
    console.log('chamou')
    setInterval(() => {
        analyzer.riskAssesment(timestamp)
    }, 2000);
    let date = new Date();
    date = moment(date).format("YYYY-MM-DD HH:mm:ss");
    timestamp = date;
}
try {
    app.listen(server_port, server_host, () => {
    }).on("error", (error) => {
        console.log("api-pivii server error =", error);
    }).on("listening", () => {
        var now = new time.Date()
        now.setTimezone("America/Sao_Paulo");
        // setTimeout()
        let date = new Date();
        date = moment(date).format("YYYY-MM-DD HH:mm:ss");
        timestamp = date;
        timerAnalyzer();
        let datep = new Date();
        datep = moment(datep).format("YYYY-MM-DD HH:mm:ss");
        console.log(datep)
    }).on("request", (request) => {
        // console.log("api-pivii received a new request.");
        //console.log("request =", request.headers);
    });

} catch (error) {
    console.log("Error on api-pivii, error =", error);
}
