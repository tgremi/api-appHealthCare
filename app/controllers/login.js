let bcrypt = require('bcrypt');
let uniqueIdGenerator = require('../utils/helpers').uniqueIdGenerator
let login = {};
let session;
login.openSession = async (application, request, response) => {
    let responseFromPromiseGetUser;
    let responseFromPassVerify
    let promiseGetUser = new Promise((resolve, reject) => {
        application.app.models.database.getUsers(request.body.email, (error, success) => {
            if (error) {
                reject(error);
            } else {
                resolve(success);
            }
        })
    })

    try {
        responseFromPromiseGetUser = await promiseGetUser;
    } catch (error) {
        throw Error(error);
    }
    let promisePassVerify = new Promise((resolve, reject) => {
        bcrypt.compare(request.body.password, responseFromPromiseGetUser.password, (error, success) => {
            if (error) {
                let errorObj = {
                    details: error,
                    reason: '',
                    error: 'Login system failed, please try again later'
                }
                reject(error);
            } else {
                resolve(success);
            }
        })
    })

    try {
        responseFromPassVerify = await promisePassVerify;
        session = request.session;
        session._id = `pi${uniqueIdGenerator()}vii`;
        response.json(responseFromPassVerify);
    } catch (error) {
        throw Error(error);
    }


};

login.verifySession = (application, request, response) => {
    return request.session._id
}


module.exports = login; 