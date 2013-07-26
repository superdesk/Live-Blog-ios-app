

$(function() {

	window.Router = Backbone.Router.extend({
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

			app.loginView.render();
		},

		blogsList: function(){
			console.log("blogsList router");
			app.blogsListView.render();
		}

	});




	Backbone.history.start();

});