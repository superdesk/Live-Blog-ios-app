var session;

$(function() {

	window.TweetModel = Backbone.Model.extend({
    });


    window.SessionModel = Backbone.Model.extend({
        defaults: {
            userId: 0,
            session: "",
            token: "",
            host: "",
            blog: 0
        }



    });

    session = new window.SessionModel;

});