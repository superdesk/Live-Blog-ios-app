$(function() {

	window.TweetModel = Backbone.Model.extend({
    });


    window.SessionModel = Backbone.Model.extend({
        defaults: {
            session: "",
            token: "",
            host: "",
            blog: 0
        }



    });

});