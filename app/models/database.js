let MongoClient = require("mongodb").MongoClient;
let models = {};
const mongo = require("../../config/database");

//users Collection
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
                        console.log("User inserted in users collection.");
                        if (typeof callbackFunction === "function")
                            callbackFunction(undefined, success.ops[0]._id);
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

models.updateUsers = (users, callbackFunction) => {
    try {
        let db = mongo.getDB();
        db.collection("users", (error, collection) => {
            if (!error) {
                console.log("Collection users found.");
                collection.replaceOne({ "_id": users._id }, users, (error, success) => {
                    if (error) {
                        console.warn("Error on colletion users insert method =", error);
                        if (typeof callbackFunction === "function")
                            callbackFunction({ statusCode: 503, error: "Couldn't update users on database.", reason: "", details: error }, undefined);
                    }
                    else {
                        console.log("User updated in users collection.");
                        if (typeof callbackFunction === "function")
                            callbackFunction(undefined, success.ops[0]._id);
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
        console.warn("Error on getUsers =", error);
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

module.exports = models;
