let devices = {};

devices.insertDevice = async (application, request, response) => {
    let errors = request.validationErrors();
    if (errors) response.send(errors);

    let promiseInsertDevice = new Promise((resolve, reject) => {
        let data = {
            _id: request.body.serie,
            linked: false,
            linked_to: '',
        }

        application.app.models.database.insertDevice(data, (insertDeviceErrors, device) => {
            if (insertDeviceErrors) {
                reject(insertDeviceErrors);
            } else {
                resolve(data);
            }
        });
    });

    try {
        let result = await promiseInsertDevice;
        res.json(result);
    } catch (error) {
        console.warn(error);
        throw error;
    }
}


devices.getDevices = async (application, request, response) => {
    let errors = request.validationErrors();
    if (errors) response.send(errors);

    let promise = new Promise((resolve, reject) => {
        let data = request.param.hdw;
        application.app.models.database.getDevices(data, (error, device) => {
            if (error) {
                reject(error);
            } else {
                resolve(device);
            }
        });
    });


    try {
        let result = await promise;
        response.send({ code: 200, hardware: result });
    } catch (error) {
        throw error;
    }
}

devices.registerDevices = async (application, request, response) => {
    let responseGetDevice = '';
    let errors = request.validationErrors();
    if (errors) response.send(errors);

    let promiseGetDevice = new Promise((resolve, reject) => {
        let data = {
            user: request.body.email,
            hdw: request.body.device.toUpperCase()
        }
        application.app.models.database.getDevices(data, (error, success) => {
            if (error) reject(error);
            else resolve(success);
        });
    });

    try {
        responseGetDevice = await promiseGetDevice;
    } catch (error) {
        throw error;
    }

    if (responseGetDevice.linked) {
        response.send({ code: 204, message: `O dispositivo ${responseGetDevice._id} está vinculado a outra conta!` })
    } else {
        let promise = new Promise((resolve, reject) => {
            let data = {
                user: request.body.email,
                hdw: request.body.device.toUpperCase(),
            }
            application.app.models.database.registerDevices(data, (error, success) => {
                if (error) reject(error)
                else resolve(success)
            });
        });

        try {
            let result = await promise
            response.send({ code: 200, success: result })
        } catch (error) {
            throw error;
        }
    }
}

module.exports = devices; 