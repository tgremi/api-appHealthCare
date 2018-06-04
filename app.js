let app = require("./config/server.js");

//Set the available port or 3000
let server_port = process.env.YOUR_PORT || process.env.PORT || 4000;
//Set the available host
let server_host = process.env.YOUR_HOST || '0.0.0.0';

try {
    app.listen(server_port, server_host, () => {
    }).on("error", (error) => {
        console.log("api-pivii server error =", error);
    }).on("listening", () => {
        console.log("api-pivii online");
    }).on("request", (request) => {
        console.log("api-pivii received a new request.");
        //console.log("request =", request.headers);
    });

} catch (error) {
    console.log("Error on api-pivii, error =", error);
}
