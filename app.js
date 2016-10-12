var app=angular.module('navbar',['ngMaterial']);

app.run(function( $mdSidenav,$rootScope){
$rootScope.open= function(){

  $mdSidenav("right").toggle()
      .then(function () {
          console.log("open")
          });
}

$rootScope.close=function(){
  $mdSidenav("right").toggle()
      .then(function () {
          console.log("open")
          });
}
})
