

$(function() {

	var Router = Backbone.Router.extend({
		routes: {
		    "": "blogsList",
		    "blogsList": "blogsList",
		    "login":"login",
		    "entriesList": "entriesList"
		},
		entriesList: function() {

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