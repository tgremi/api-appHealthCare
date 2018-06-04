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
        console.log('Chegou aqui no post')
        application.app.controllers.users.updateElderlyField(application, req, res);
    })

    application.post('/add-contacts', (req, res) => {
        console.log('Chegou aqui no post')
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
        // let plivo = require('plivo');
        // let client = new plivo.Client('MAOGVIMZY0YJBHNTEZZT', 'MGFkMmU0ZmIzNjA5MmNlZDdiZTZjOWMzOWI3NTBm');
        // client.messages.create(
        //     '5511981957059',
        //     '5511940027216',
        //     `HealthCareApp avisa: Parece ter acontecido algum imprevisto com o usuário[${'Thalles Gremi'}], entre em contato urgente.`
        // ).then(function (message_created) {
        //     console.log(message_created)
        // });

        // var clockwork = require('clockwork')({ key: 'e79deb7f0a5d4538ee184f5c5ec2646b8eaebd03' });
        // clockwork.sendSms({ To: '5511940027216', Content: 'O vovo caiu corre la!!!!!' },
        //     function (error, resp) {
        //         if (error) {
        //             console.log('Something went wrong', error);
        //         } else {
        //             console.log(resp);

        //             console.log('Message sent', resp.responses[0].id);
        //         }
        //     });
        res.send('Ola mundo')
    });


    application.get('/getUser/:email', (req, res) => {
        application.app.controllers.users.getUser(application, req, res);
    })

}