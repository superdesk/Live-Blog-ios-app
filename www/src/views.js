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

	window.TweetView = Backbone.View.extend({
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
			$(".page").fadeOut();
			this.$el.css("display", "block");
		},

		events: {
			"submit form":    "loginHandler"
		},

		loginHandler: function(e){
			e.preventDefault();
			this.$el.fadeOut();
			$("#loading").css("display", "block");
			var formData = this.$el.find("form").serializeObject();
			gap.addUser(formData.login, formData.pass, formData.host);

			auth.login();





		}
	});



});