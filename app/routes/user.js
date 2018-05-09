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
     * Register device. 
     * 
     */ 
    application.post("/register-device", (req, res) => {
        application.app.controllers.registerDevice(application, req, res);
    });



    application.post("/login", (req, res) => {
        application.app.controllers.login.openSession(application, req, res);
    });


    application.get("/", (req, res) => {
        application.app.controllers.login.verifySession(application, req, res);
    });


    // //Crodity
    // application.post("/api/crodity/feed/profile/", (req, res) => {
    //     application.app.controllers.crodity.getProfileFeed(application, req, res);
    // });
    // application.post("/api/crodity/feed/timeline/", (req, res) => {
    //     application.app.controllers.crodity.getTimelineFeed(application, req, res);
    // });

    // //Facebook
    // application.post("/api/facebook/feed/profile/", (req, res) => {
    //     application.app.controllers.facebook.getProfileFeed(application, req, res);
    // });
    // application.post("/api/facebook/feed/timeline/", (req, res) => {
    //     application.app.controllers.facebook.getTimelineFeed(application, req, res);
    // });

    // //Twitter
    // application.post("/api/twitter/feed/profile/", (req, res) => {
    //     application.app.controllers.twitter.getProfileFeed(application, req, res);
    // });
    // application.post("/api/twitter/feed/timeline/", (req, res) => {
    //     application.app.controllers.twitter.getTimelineFeed(application, req, res);
    // });
}