// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    estimote.beacons.startRangingBeaconsInRegion(
      {}, // Empty region matches all beacons.
      function(result) {
          console.log('*** Beacons ranged ***');
          console.log(result);
          //estimote.printObject(result);

          for (var i = result.beacons.length - 1; i >= 0; i--) {
             if( result.beacons[i].major == 53832 && result.beacons[i].minor==19603) {
                console.log('found meeting room beacon '+result.beacons[i].distance+' meters away');
                if(result.beacons[i].distance<2) {
                  //Get user phone UUID
                  var uuidString = device.uuid;
                  console.log('User '+uuidString+' is now in the meeting room!');
                  //TODO: indicates to server you are in the meeting room
                }
             } 
           }; 
        },
      function(errorMessage) {
          console.log('Ranging error: ' + errorMessage) });
    
  });
})
.controller('homeCtrl',function($scope){
  
  $scope.nbUserInMeetingRoom = 0;

  $scope.refreshNbUser = function() { 
    console.log('in refreshNbUser');
    //TODO: call server to get nb user in meeting room
    $scope.nbUserInMeetingRoom += 1;
  };
})
