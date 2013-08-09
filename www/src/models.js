

$(function() {



    window.BlogItemModel = Backbone.Model.extend({
    });

    window.EntryItemModel = Backbone.Model.extend({
        idAttribute: 'Id',
        services: {
            'flickr': true,
            'google': true,
            'twitter': true,
            'facebook': true,
            'youtube': true
        },

        /**
        * Get css class based on type
        *
        * @return {string}
        */
        getClass: function() {
         switch (this.get('Type').Key) {
             case 'wrapup':
             return 'wrapup';
             break;

             case 'quote':
             return 'quotation';
             break;

             case 'advertisement':
             return 'advertisement';
             break;

             default:
             if (this.isService()) {
                 return 'service';
             }

             return 'normal';
         }
     },
       /**
       * Test if post is from service
       *
       * @return {bool}
       */
       isService: function() {
          return this.get('AuthorName') in this.services;
      }
  });


    window.SessionModel = Backbone.Model.extend({
        defaults: {
            userId: 0,
            session: "",
            token: "",
            host: "",
            blog: 0,
            blogTitle: ""
        }



    });



});