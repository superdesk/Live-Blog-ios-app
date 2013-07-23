
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
          if(results.rows.length>0){
           user = results.rows.item(0);
         }else{
           user = '{}';
         }

         callback(user);
       }
       );
     }
     );



 },

 addUser: function(login, pass, host) {
   this.db.transaction(
     function(tx) {
       var sql = "DELETE FROM users";


       tx.executeSql(sql);

     },
     this.txErrorHandler
     );

   this.db.transaction(
     function(tx) {
       var sql = 'INSERT INTO user(login, pass, host) VALUES("'+login+'", "'+pass+'", "'+host+'")';

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








var appinit = function(){

 new FastClick(document.body);


 snapper = new Snap({
  element: document.getElementById('content'),
  disable: 'right'
});


 $('#toggle-left').bind('click', function(){
   if( snapper.state().state=="left" ){
     snapper.close();
   } else {
     snapper.open('left');
   }
 });




 gap.initialize(function() {

  gap.getUser(function(user){

    if(user=="{}"){
      router.navigate("login", {trigger: true});
    }else{

      router.navigate("blogsList", {trigger: true});

    }

  });
});

};

appinit();



