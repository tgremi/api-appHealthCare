var bcrypt = require('bcrypt');
module.exports.createUser = async (application, req, res) => {

    // req.assert("user_id", "user_id can't be empty.").notEmpty();
    let hashPass;
    let errors = req.validationErrors();
    if (errors) res.send(errors);
    // Definimos uma Hash para a armazenar a senha do usuário. 
    hashPass = bcrypt.hashSync(req.body.password, 10);
    let promiseUsers = new Promise((resolve, reject) => {
        let data = {
            _id: application.app.utils.helpers.uniqueIdGenerator(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            age: req.body.age,
            password: hashPass,
            elderly: {
                name: '',
                age: '',
                weight: '',
                height: '',
            },
            contacts: [
                {
                    name: '',
                    celphone: '',
                }
            ]

        };
        application.app.models.database.insertUsers(data, (getUsersError, users) => {
            if (getUsersError)
                reject(getUsersError);
            else resolve(data);
        });
    });

    try {
        let result = await promiseUsers;
        res.json(result);
    } catch (error) {
        console.log(error)
        throw error;
    }
}


