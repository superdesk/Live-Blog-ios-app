$(function() {

  window.gap =  {



   initialize: function(callback) {

     var self = this;

     this.db = window.openDatabase("mobileliveblog", "1.0", "mobileliveblog", 2 * 1024 * 1024);


     this.db.transaction(

       function(tx) {
         tx.executeSql(
           "SELECT name FROM sqlite_master WHERE type='table' AND name='user'",

           this.txErrorHandler,

           function(tx, results) {
             if (results.rows.length != 1) {

               self.createTables();
             }
           }
           );
       }
       );

     callback();

   },

   createTables: function() {
     this.db.transaction(
       function(tx) {

         tx.executeSql('CREATE TABLE IF NOT EXISTS user(login VARCHAR(250), pass VARCHAR(500), host VARCHAR(1000))');

       },

       this.txErrorHandler
       );
   },








   getUser: function(callback) {



     this.db.transaction(
       function(tx) {
         var sql = "SELECT * FROM user LIMIT 1";


         tx.executeSql(sql, this.txErrorHandler,
           function(tx, results) {
            results.rows.length>0 ? user = results.rows.item(0) : user = {};

            callback(user);
          }
          );
       }
       );




   },

   addUser: function(login, pass, host) {
     this.db.transaction(
       function(tx) {
         var sql = "DELETE FROM user";


         tx.executeSql(sql);

       },
       this.txErrorHandler
       );

     this.db.transaction(
       function(tx) {
         var sql = 'INSERT INTO user(login, pass, host) VALUES("'+login+'", "'+new jsSHA(pass, "ASCII")+'", "'+host+'")';

         tx.executeSql(sql);
       },
       this.txErrorHandler
       );

   },




   deleteUser: function(callback) {


     this.db.transaction(
       function(tx) {
         var sql = 'DELETE FROM user';

         tx.executeSql(sql,
           this.txErrorHandler,

           function(tx, results) {
             callback();
           });
       },
       this.txErrorHandler
       );

   },




   txErrorHandler: function(tx) {
     alert("There was an error. Please try again");
   }
 };



 window.auth = {

   login: function(callback){

     gap.getUser(function(user){

      if(_.isEmpty(user)){
        router.navigate("login", {trigger: true});
        return false;
      }



      var req = { userName: user.login  };

      try{
      $.ajax({
        url: user.host+'/resources/Security/Authentication.json',
        type: 'POST',
        data: req,
        dataType: "json",
        done: function(data) {

          console.log(data.Token);
          window.SessionModel.set("token", data.Token);
          window.SessionModel.set("host", user.host);
          auth.authorize(user, function(){
            console.log("brawo rondio");
          });



        },
        fail: function(data) {

          router.navigate("login", {trigger: true});

        }
      });
    }
    catch(err){
      router.navigate("login", {trigger: true});
    }

    });

   },

   authorize: function(user, callback){

    var token = window.SessionModel.get("token");

    shaPassword = user.pass;
    shaStep1 = new jsSHA(shaPassword.getHash("SHA-512", "HEX"), "ASCII");
    shaStep2 = new jsSHA(token, "ASCII");
    hash = shaStep1.getHMAC(user.login, "ASCII", "SHA-512", "HEX");
    hash = shaStep2.getHMAC(hash, "ASCII", "SHA-512", "HEX");

    var req = { Token: token, HashedToken: hash , UserName: user.login };



    try{
    $.ajax({
      url: user.host+'/resources/Security/Authentication/Login.json',
      type: 'POST',
      data: req,
      dataType: "json",
      done: function(data) {
        console.log(JSON.stringify(data));
        window.SessionModel.set("session", data.Session);
        callback();

      },
      fail: function(data) {

        router.navigate("login", {trigger: true});

      }
    });
  }
  catch(err){
    router.navigate("login", {trigger: true});
  }

  }

};




var appinit = function(){

 // alert("appinit");

 new FastClick(document.body);


 snapper = new Snap({
  element: document.getElementById('content'),
  disable: 'right'
});


 $(".toggle-left").bind('click', function(){
   snapper.state().state=="left" ? snapper.close() : snapper.open('left');
 });




 gap.initialize(function() {
  auth.login();
});

};

appinit();



});