let MongoClient = require("mongodb").MongoClient;
let models = {};
const mongo = require("../../config/database");

models.updateElderlyField = (user, callbackFunction) => {
    try {
        console.log(user)
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                console.log("Collection users found.");
                collection.updateOne({ "email": user.email }, {
                    $set: {
                        'elderly.first_name': user.first_name,
                        'elderly.last_name': user.last_name,
                        'elderly.birth_day': user.birth_day,
                        'elderly.height': user.heigth,
                        'elderly.weight': user.weight,
                    }
                }, (error, success) => {
                    if (error) {
                        console.warn("Error on colletion users insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't update users on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        console.log("User updated in users collection.");
                        if (typeof callbackFunction === "function")
                            callbackFunction(undefined, success);
                    }
                });
            } else callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn("Error on updateUsers =", error);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on updateUsers.", undefined);
    }
}

models.getLastUpdatedDevice = (timer, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("devices", (error, collection) => {
            if (!error) {
                collection.find({ update: { $gte: timer } }).toArray((error, devices) => {
                    if (error) {
                        console.warn("Error on collection devices find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find devices on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function") {
                        callbackFunction(undefined, devices);
                    }
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find devices collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.addContacts = (user, callbackFunction) => {
    try {
        console.log(user)
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                console.log("Collection users found.");
                collection.updateOne({ "email": user.email }, {
                    $set: { 'contacts': user.contacts }
                }, (error, success) => {
                    if (error) {
                        console.warn("Error on colletion users insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't update users on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        console.log("User updated in users collection.");
                        if (typeof callbackFunction === "function")
                            callbackFunction(undefined, success);
                    }
                });
            } else callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn("Error on updateUsers =", error);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on updateUsers.", undefined);
    }
}

models.getUsers = (email, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                console.log("Collection users found.");
                collection.findOne({ "email": email }, (error, users) => {
                    if (error) {
                        console.warn("Error on collection users find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find users on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function")
                        callbackFunction(undefined, users);
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.removeUsers = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                collection.aggregate([options], (err, cursor) => {
                    cursor.toArray((error, documents) => {
                        let promises = []
                        documents.map((document, i) => {
                            promises.push(new Promise((resolve, reject) => {
                                collection.remove({ "_id": document._id }, (error, success) => {
                                    if (error) reject(error);
                                    else resolve(success);
                                });
                            }));
                        });

                        //Maps all promises.
                        Promise.all(
                            promises.map(p => p.catch((error) => {
                                console.log(error)
                            })))
                            .then((promisesResults) => {
                                if (typeof callbackFunction === "function")
                                    callbackFunction(undefined, "success");
                            }).catch((error) => {
                                if (typeof callbackFunction === "function")
                                    callbackFunction("Error while removing documents from users collection.", undefined);
                            });;
                    });
                }
                );
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn("Error on removeUsers =", error);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on removeUsers.", undefined);
    }
}

models.getSerieNumberDevice = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection('devices', (error, collection) => {
            if (!error) {
                collection.findOne(options, (error, success) => {
                    if (error) {
                        console.warn('Error on collection devices find method = ', error);
                        if (typeof callbackFunction === 'function') {
                            callbackFunction({ statusCode: 404, error: `Couldn't find devices on database`, reason: '', details: error }, undefined);
                        }
                    }
                    else if (typeof callbackFunction == 'function') {
                        callbackFunction(undefined, success);
                    }
                });
            }
            else if (typeof callbackFunction == 'function') {
                callbackFunction({ statusCode: 503, error: `Couldn't find devices on collection`, reason: '', details: error }, undefined);
            }
        })
    } catch (error) {
        console.warn('Error on getSerieNumberDevice [', error, ']')
        if (typeof callbackFunction === 'function') {
            callbackFunction('Error on getSerieNumberDevice', undefined);
        }
    }
}

models.insertUsers = (users, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                console.log("Collection users found.");
                collection.insert(users, (error, success) => {
                    if (error) {
                        console.warn("Error on colletion users insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't insert users on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        console.log("User inserted in users collection.", success.ops[0]._id);
                        if (typeof callbackFunction === "function") {
                            let successObj = {
                                code: 200,
                                user: { _id: success.ops[0]._id, email: users.email }
                            }
                            callbackFunction(undefined, successObj);
                        }
                    }
                });
            } else callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn("Error on insertUsers =", error);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on insertUsers.", undefined);
    }
}

models.insertDevice = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection('devices', (error, collection) => {
            if (!error) {
                collection.insert(options, (error, success) => {
                    if (error) {
                        console.warn(`Error on collection devices insert method [${error}]`);
                        if (typeof callbackFunction == 'function') {
                            callbackFunction({ statusCode: 503, error: `Couldn't insert devices on database.`, reason: '', details: error }, undefined);
                        }
                        else {
                            console.log(`Device inserted on database.`);
                            if (typeof callbackFunction == 'function') {
                                callbackFunction(undefined, success.ops[0]._id);
                            }
                        }
                    }
                })
            }
        })
    } catch (error) {
        console.warn(`Error on insert device [${error}]`);
        if (typeof callbackFunction == `function`) {
            callbackFunction(`Error on insertDevice`, undefined);
        }
    }
}

models.registerDevices = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection('devices', (error, collection) => {
            if (!error) {
                collection.updateOne({ '_id': options.hdw }, {
                    $set: {
                        'linked': true,
                        'linked_to': options.user,
                        'verify': 1
                    }
                })
            }
        }, (error, success) => {
            if (error) {
                console.warn(`Couldn't update device on database  (RegisterDevice)\t error [${error}]`)
                if (typeof callbackFunction == 'function') {
                    callbackFunction({ statusCode: 503, error: "Couldn't update device on database.", reason: "", details: error }, undefined)
                }
            }
            else {
                console.log("Device updated in devices collection.");
                if (typeof callbackFunction === "function")
                    callbackFunction(undefined, success);
            }
        });

        db.collection('users', (error, collection) => {
            collection.update({ 'email': options.user }, {
                $set: {
                    'devices': options.hdw
                }
            }, (error, success) => {
                if (error) {
                    console.warn(`Couldn't update user on register device \t error[${error}]`);
                    if (typeof callbackFunction == 'function')
                        callbackFunction({ statusCode: 503, error: "Couldn't update user on register device", reason: "", details: error }, undefined)
                } else {
                    console.log("User updated in users collection. (RegisterDevice)");
                    if (typeof callbackFunction === "function")
                        callbackFunction(undefined, success);
                }
            })
        })


    } catch (error) {
        console.warn(`Error on register Device [${error}]`);
        if (typeof callbackFunction == 'function')
            callbackFunction(`Error on register Device [${error}]`, undefined);
    }
}

models.updateVerify = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("devices", (error, collection) => {
            if (!error) {
                collection.updateOne({ "_id": options._id }, {
                    $set: {
                        'verify': options.verify
                    }
                }, (error, success) => {
                    if (error) {
                        console.warn("Error on collection devices find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find devices on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function") {

                        callbackFunction(undefined, success);
                    }
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find devices collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.deviceLastUpdate = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("devices", (error, collection) => {
            if (!error) {
                collection.updateOne({ "_id": options._id }, {
                    $set: {
                        'update': options.update
                    }
                }, (error, success) => {
                    if (error) {
                        console.warn("Error on collection devices find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find devices on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function") {

                        callbackFunction(undefined, success);
                    }
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find devices collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.getDevices = (options, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("devices", (error, collection) => {
            if (!error) {
                console.log("Collection devices found.");
                collection.findOne({ "_id": options.hdw }, (error, users) => {
                    if (error) {
                        console.warn("Error on collection devices find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find devices on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function")
                        callbackFunction(undefined, users);
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find devices collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.insertData = (data, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("sensors_data", (error, collection) => {
            if (!error) {
                // console.log("Collection sensors_data found.");
                collection.insert(data, (error, success) => {
                    if (error) {
                        console.warn("Error on colletion sensors_data insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't insert sensors_data on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        // console.log("Data inserted in sensors_data collection.", success.ops[0]._id);
                        if (typeof callbackFunction === "function") {
                            let successObj = {
                                code: 200,
                                data: { _id: success.ops[0]._id }
                            }
                            callbackFunction(undefined, successObj);
                        }
                    }
                });
            } else callbackFunction({ statusCode: 503, error: "Couldn't find sensors_data collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on insertData ${error}`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on insertData.", undefined);
    }
}

models.sensorDataWatch = (data, callbackFunction) => {

    try {
        let db = mongo.getDB();
        db.collection('sensors_data', (error, collection) => {
            if (!error) {
                collection.find({ 'hardware_number': data.hardware_number }, { sort: { created: -1 }, limit: 5 }).toArray((error, data) => {
                    if (error) {
                        console.warn("Error on colletion sensors_data insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't insert sensors_data on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        // console.log("Data inserted in sensors_data collection.");
                        if (typeof callbackFunction === "function") {
                            let successObj = {
                                code: 200,
                                data: data
                            }
                            callbackFunction(undefined, successObj);
                        }
                    }
                });
            } else callbackFunction({ statusCode: 503, error: "Couldn't find sensors_data collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on insertData ${error}`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on insertData.", undefined);
    }
}

models.insertDataNotification = (data, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("notifications", (error, collection) => {
            if (!error) {
                // console.log("Collection sensors_data found.");
                collection.insert(data, (error, success) => {
                    if (error) {
                        console.warn("Error on colletion notification insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't insert sensors_data on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        // console.log("Data inserted in sensors_data collection.", success.ops[0]._id);
                        if (typeof callbackFunction === "function") {
                            let successObj = {
                                code: 200,
                                data: { _id: success.ops[0]._id }
                            }
                            callbackFunction(undefined, successObj);
                        }
                    }
                });
            } else callbackFunction({ statusCode: 503, error: "Couldn't find notification collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on insertData ${error}`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on insertData.", undefined);
    }
}

models.getUsersWithDeviceSerieNumber = (device, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                console.log("Collection users found.");
                collection.findOne({ "device": device }, (error, users) => {
                    if (error) {
                        console.warn("Error on collection users find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find users on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function")
                        callbackFunction(undefined, users);
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.getNotificationWithDeviceNumber = (device, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("notification", (error, collection) => {
            if (!error) {
                collection.findOne({ "device": device }, { sort: { created: -1 } }, (error, users) => {
                    if (error) {
                        console.warn("Error on collection users find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find users on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function")
                        callbackFunction(undefined, users);
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

models.getNotificationWithEmail = (email, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("notifications", (error, collection) => {
            if (!error) {
                collection.find({ "email": email }, { sort: { created: -1 }, limit: 1 }).toArray((error, users) => {
                    if (error) {
                        console.warn("Error on collection users find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find users on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function") {
                        console.log(users)
                        callbackFunction(undefined, users);
                    }
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}


models.updateNotificationWithEmail = (data, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("notifications", (error, collection) => {
            if (!error) {
                console.log(data)
                collection.updateOne({ "_id": data._id }, {
                    $set: {
                        message: data.message,
                        alert_viewer: true
                    }
                }, (error, users) => {
                    if (error) {
                        console.warn("Error on collection users find() method = ", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 404, error: "Couldn't find users on database.", reason: "", details: error }, undefined);
                    }
                    else if (typeof callbackFunction === "function") {
                        callbackFunction(undefined, users);
                    }
                });
            } else if (typeof callbackFunction === "function")
                callbackFunction({ statusCode: 503, error: "Couldn't find users collection.", reason: "", details: error }, undefined);
        });
    } catch (error) {
        console.warn(`Error on getUsers [${error}]`);
        if (typeof callbackFunction === "function")
            callbackFunction("Error on getUsers.", undefined);
    }
}

module.exports = models;
