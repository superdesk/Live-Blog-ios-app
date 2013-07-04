$(function() {

	var Router = Backbone.Router.extend({
		routes: {
		    "": "showList",
		    "login":"login"
		},
		showList: function() {
			var listView = new window.ListView;
		},

		login: function(){
			var loginView = new window.LoginView;
		}

	});


	window.router = new Router();

	Backbone.history.start();

});