$(function() {

	window.Tweets = Backbone.Collection.extend({
        model: TweetModel
    });

    window.blogsCollection = Backbone.Collection.extend({
        model: BlogItemModel,
        url: function() {
            console.log('http://'+app.session.get("host")+'/resources/HR/User/'+app.session.get("userId")+'/Blog/Live.json');
            return 'http://'+app.session.get("host")+'/resources/HR/User/'+app.session.get("userId")+'/Blog/Live.json';
          },
          parse: function(response) {
                  console.log('parsing ...')
                  return response.results;
              }
    });

});

