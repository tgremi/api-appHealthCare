let sensor = {};

sensor.insertData = async (application, request, response) => {
    let data = {
        _id: `hd${application.app.utils.helpers.uniqueIdGenerator()}pivii`,
        hardware_number: request.body.hardware_number,
        created: new Date(),
        ax: request.body.ax,
        ay: request.body.ay,
        az: request.body.az,
        rx: (isNaN(request.body.rx) ? '' : request.body.rx),
        ry: (isNaN(request.body.ry) ? '' : request.body.ry),

    }
console.log(data)
    let promise = new Promise((resolve, reject) => {
        application.app.models.database.insertData(data, (error, success) => {
            if (error) reject(error);
            else resolve(success);
        });
    });

    try {
        let result = await promise;
        application.app.utils.analyzer.riskAssesment(application, request, response);
        response.send({ code: 200, response: result });
    } catch (error) {
        throw error
    }


}

module.exports = sensor; 