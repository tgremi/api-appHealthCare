// import { NORMAL, ATTENTION, DANGER } from './actions'; 
// let socket = require('socket.io');
const io = require('socket.io-client');

let analyzer = {};

analyzer.riskAssesment = async (application, request, response) => {
    let flagForAlert = false;
    let promise = new Promise((resolve, reject) => {
        application.app.models.database.sensorDataWatch(request.body.hardware_number, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        })
    })
    try {
        let result = await promise;
        // console.log(isArray(result))
        result.data.map((elem, i) => {
            if (parseFloat(elem.ax) <= -7 && parseFloat(elem.rx) >= 60) {
                flagForAlert = true;
            }
        })

        if (flagForAlert) {
            console.log('flagAlert === ', flagForAlert)
            setTimeout(() => {
                result.data.map((elem, i) => {
                    if (parseFloat(elem.ax) <= -7 && parseFloat(elem.rx) >= 60) {
                        let plivo = require('plivo');
                        let client = new plivo.Client('MAOGVIMZY0YJBHNTEZZT', 'MGFkMmU0ZmIzNjA5MmNlZDdiZTZjOWMzOWI3NTBm');
                        client.messages.create(
                            '5511981957059',
                            '5511940027216',
                            `HealthCareApp avisa: Parece ter acontecido algum imprevisto com o usuário[${'Thalles Gremi'}], entre em contato urgente.`
                        ).then(function (message_created) {
                            console.log(message_created)
                        });
                        flagForAlert = false;
                        return
                    } else {
                        flagForAlert = false;
                    }
                })
            }, 5000)
        }
    } catch (error) {
        throw error
    }




}

module.exports = analyzer;