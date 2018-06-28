module.exports = (application) => {
   
    /* 
     * 
     *  Create User
     * 
     */
    application.post("/register-user/", (req, res) => {
        application.app.controllers.users.createUser(application, req, res);
    });


    /*
     *
     *  Update User
     * 
     */

    application.post('/register-elderly', (req, res) => {
        application.app.controllers.users.updateElderlyField(application, req, res);
    })

    application.post('/add-contacts', (req, res) => {
        application.app.controllers.users.addContacts(application, req, res);
    })


    /* 
     *
     * Device control
     * 
     */
    application.post("/insert-device", (req, res) => {
        application.app.controllers.device.insertDevice(application, req, res);
    });

    application.post("/register-device", (req, res) => {
        application.app.controllers.device.registerDevices(application, req, res);
    });

    application.post("/login", (req, res) => {
        application.app.controllers.login.openSession(application, req, res);
    });

    application.post('/data-sensor', (req, res) => {
        application.app.controllers.sensor_control.insertData(application, req, res);
    });

    application.get("/", (req, res) => {
    });


    application.get('/getUser/:email', (req, res) => {
        application.app.controllers.users.getUser(application, req, res);
    })

    application.get('/get-notification/:email', (req, res) => {
        console.log('GetNotification!')
        application.app.controllers.notifier.getNotification(application, req, res);
    })


    application.post('/confirm-notify', (req, res) => {
        application.app.controllers.notifier.updateNotification(application, req, res);
    })


}