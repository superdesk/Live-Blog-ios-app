$(function() {

	window.Tweets = Backbone.Collection.extend({
        model: TweetModel
    });

    window.blogsCollection = Backbone.Collection.extend({
        model: BlogItemModel
    });

});