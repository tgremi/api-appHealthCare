let analyzer = {};
let flagForAlert = false;
let getLastUpdatedDevice = require('../models/database').getLastUpdatedDevice;
let sensorDataWatch = require('../models/database').sensorDataWatch;
let updateVerify = require('../models/database').updateVerify;
let app = require('../controllers/notifier').app; 
let moment = require('moment');

analyzer.riskAssesment = async (timer) => {
    


    let promise = new Promise((resolve, reject) => {
        getLastUpdatedDevice(timer, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        })
    })
    try {
        let result = await promise;
        let promises = [];
        // result.map(())

        result.map((elem, i) => {
            
            let data = {
                hardware_number: elem._id
            }
            sensorDataWatch(data, (error, success) => {
                let contadorQueda = 0;
                let contadorSubida = 0;
                success.data.map((value, i) => {
                    if ((parseFloat(value.ax) <= -8 && parseFloat(value.rx) >= 30 && parseFloat(value.ry) <= 15) || (parseFloat(value.ax) >= 9 && parseFloat(value.rx) <= 30) ||
                        (parseFloat(value.az) <= -9 && parseFloat(value.rx) <= 30) || (parseFloat(value.az) >= 9 && parseFloat(value.rx) <= 30)) {
                        contadorQueda++;

                    }

                    if ((parseFloat(value.ax) >= -7 && parseFloat(value.rx) <= 60) || (parseFloat(value.ax) <= 7 && parseFloat(value.rx) >= 60) ||
                        (parseFloat(value.az) >= -7 && parseFloat(value.rx) >= 60) || (parseFloat(value.az) <= 7 && parseFloat(value.rx) >= 60)) {
                        contadorSubida++;
                    }

                 
                    //Borda de descida
                    if (contadorQueda == 5 && elem.verify == 1) {
                        console.log("Caiu!");
                        flagForAlert = true;
                        let dvc = {
                            _id: data.hardware_number,
                            verify: 0
                        }

                        //Atualiza a última data de verificação
                        updateVerify(dvc, (error, success) => {
                            console.log("Borda de descida - updateVerify");
                        });

                        let notification = {
                            hardware: data.hardware_number,
                        }
                        app(notification, (error, success) => {
                            if (error) throw error; 
                            else console.log('Notificado!!!'); 
                        })
                    }

                    //Borda de subida
                    if (contadorSubida == 5 && elem.verify == 0) {
                        let dvc = {
                            _id: data.hardware_number,
                            verify: 1
                        }

                        //Atualiza a última data de verificação
                        updateVerify(dvc, (error, success) => {
                            console.log("Borda de subida - updateVerify");
                        });
                    }
                    return;
                })
            })
        })
    } catch (error) {
        throw error
    }

}

module.exports = analyzer;