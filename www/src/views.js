$(function() {

	window.ListView = Backbone.View.extend({
		el: $("#search_form"),
		search_twitter: function(e) {
			e.preventDefault();
			var self = this;
			$.getJSON("http://search.twitter.com/search.json?callback=?",{
				q: $("#q").val()
			}, function(data) {
				$("#tweets li").fadeOut();
				for(var i in data.results) {
					var tweet = new Tweet(data.results[i]);
					console.log(data.results[i]);
					var tweetView = new TweetView({model: TweetModel});
					tweetView.render();
				}
			});
		},
		events: {
			"submit": "search_twitter"
		}
	});

	window.blogsListView = Backbone.View.extend({
		render: function() {
			var tweet = _.template( $("#tweet_template").html(), this.model.toJSON());
			$("#tweets").append(tweet);
			$("#t_" + this.model.get("id")).css("display", "block");
		}
	});



	window.LoginView = Backbone.View.extend({

		el: '#loginView',

		render: function() {

			$("#loading").css("display", "none");

			console.log(this.el);
			console.log("loginView render");

			this.$el.css("display", "block");

			},

		events: {
			"submit":    "loginHandler"
		},

		loginHandler: function(e){
			e.preventDefault();
			$(".page").css("display", "none");
			console.log("loginView loginHandler");
			$("#loading").css("display", "block");
			var formData = this.$el.find("form").serializeObject();
			gap.addUser(formData.login, formData.pass, formData.host);

			auth.login();


			return false;


		}
	});

	window.loginView = new window.LoginView;
	window.listView = new window.ListView;
	window.blogsListView = new window.blogsListView;

});