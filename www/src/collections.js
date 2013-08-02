$(function() {

	window.Tweets = Backbone.Collection.extend({
        model: TweetModel
    });

    window.blogsCollection = Backbone.Collection.extend({
        model: BlogItemModel,
        url: function() {
            console.log('http://'+app.session.get("host")+'/resources/HR/User/'+app.session.get("userId")+'/Blog/Live.json');
            return 'http://'+app.session.get("host")+'/resources/HR/User/'+app.session.get("userId")+'/Blog/Live.json?X-Filter=Id,Title';
          },
          parse: function(response) {
                  console.log('parsing ...');
                  console.log(JSON.stringify(response.BlogList));
                  return response.BlogList;
              }
    });

});

