

$(function() {

	var Router = Backbone.Router.extend({
		routes: {
		    "": "showList",
		    "login":"login",
		    "blogsList": "blogsList"
		},
		showList: function() {

		},

		login: function(){
			console.log("login router");

			loginView.render();
		},

		blogsList: function(){

		}

	});


	window.router = new Router();

	Backbone.history.start();

});