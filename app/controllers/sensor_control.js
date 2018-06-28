let sensor = {};
var time = require('time');
var moment = require('moment');

sensor.insertData = async (application, request, response) => {

    var now = new time.Date()
    now.setTimezone("America/Sao_Paulo");

    let date = new Date();
    date = moment(date).format("YYYY-MM-DD HH:mm:ss");

    let data = {
        _id: `hd${application.app.utils.helpers.uniqueIdGenerator()}pivii`,
        hardware_number: request.body.hardware_number,
        created: date,
        ax: request.body.ax,
        ay: request.body.ay,
        az: request.body.az,
        rx: request.body.ry,
        ry: request.body.rx,

    }
    console.log('ax -', data.ax, 'ay - ', data.ay, 'az - ', data.az, '\trx - ', data.rx, 'ry - ', data.ry)
    // let promise = new Promise((resolve, reject) => {
    application.app.models.database.insertData(data, (error, success) => {
        if (error) throw error;
        else return success;
    });
    let deviceUpdate = {
        _id: request.body.hardware_number,
        update: date
    }


    application.app.models.database.deviceLastUpdate(deviceUpdate, (error, success) => {
        if (error) throw error
        else { };
    })
    // }).then((result) => {
    // application.app.utils.analyzer.riskAssesment(application, request, response);
    // });

    // try {
    // let result = await promise;

    response.send({ code: 200 });
    // } catch (error) {
    // throw error
    // }


}

sensor.lastUpdate = async (application, request, response) => {

}

module.exports = sensor; 