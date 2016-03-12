'use strict';

angular.module('PortoApp', ['ionic']);

angular.module('PortoApp').run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


angular.module('PortoApp').controller('PortoCTRL', ['$scope', function($scope){

  document.addEventListener("deviceready", onDeviceReady, false);

  angular.extend($scope, {
    styleArrow: {},
    meters: 0
  });

  //Global Configurations
  var destinationPosition;
  var destinationBearing;
  var positionId;
  var headingId;
  var currentPosition;
  var currentHeading;

  function onDeviceReady() {
    init();
  }

  function init(){
    getOrientation();
    getPosition();
    destinationPosition = new LatLon("-26.4657703", "-49.1132184");
    updateScreen();
  }

  function refreshModel(){
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  };

  function getOrientation(){
    if(headingId) navigator.compass.clearWatch(headingId);
    headingId = navigator.compass.watchHeading(onSuccessOrientation, onError, {
      frequency: 1000
    });
  };

  function getPosition(){
    if(positionId) navigator.geolocation.clearWatch(positionId);
    positionId = navigator.geolocation.watchPosition(onSuccessPosition, onError, {
      enableHighAccuracy: true,
      timeout: 2000,
      maxiumumAge: 0
    });
  };

  function updateScreen(){
    destinationBearing = Math.round(currentPosition.bearingTo(destinationPosition));
    $scope.meters = Math.round(currentPosition.distanceTo(destinationPosition)*1000);
    $scope.styleArrow = {
      "-webkit-transform": "rotate(" + (destinationBearing - currentHeading) + "deg)"
    };
  };

  function onSuccessPosition(heading) {
    currentPosition = new LatLon(heading.coords.latitude, heading.coords.longitude);
    updateScreen();
    refreshModel();
  };

  function onSuccessOrientation(heading) {
    currentHeading = Math.round(heading.magneticHeading);
    updateScreen();
    refreshModel();
  };

  function onError(error) {
    console.log(error.message);
  };

}]);