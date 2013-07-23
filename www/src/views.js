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
			$("#t_" + this.model.get("id")).fadeIn();
		}
	});



	window.LoginView = Backbone.View.extend({
		render: function() {
			var tweet = _.template( $("#tweet_template").html(), this.model.toJSON());
			$("#tweets").append(tweet);
			$("#t_" + this.model.get("id")).fadeIn();
		}
	});



});