// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'Parse'])

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
  });
})

.config(function (ParseProvider) {
  ParseProvider.initialize("2xAlBo53moTE5vcLDnNimzyvVcsaklaIf0GEd4QW", "fLNaqKqodXknzCWPQEI26ecBvKKAhKvoyFbP1Brj");
})

.factory('Person', function(Parse) {
  // yes this code is strange it's coffee's class .. extends Parse.model
  var Person,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) {
          child[key] = parent[key];
        }
      }

      function ctor() {
        this.constructor = child;
      }

      ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child;
    };

  Person = (function(_super) {
    __extends(Person, _super);

    function Person() {
      return Person.__super__.constructor.apply(this, arguments);
    }

    Person.configure('Person', 'deviceId', 'lastDetection');
    Person.customClassMethod = function(arg) {};
    Person.prototype.customInstanceMethod = function(arg) {};

    return Person;

  })(Parse.Model);

  return Person;
})

.controller('homeCtrl',function($ionicPlatform, $scope, Person){
    
  $scope.nbUserInMeetingRoom = 0;

  $scope.refreshNbUser = function() { 
    console.log('in refreshNbUser');
    //TODO: call server to get nb user in meeting room
    Person.query().then(function (result) {
      console.log(result);
      var nb = 0;
      for (var i = result.length - 1; i >= 0; i--) {
        console.log(Date.now()-result[i].lastDetection);
        if ( result[i].lastDetection > Date.now()-1000*1*60 ) {
          nb += 1;
        }
      };
      $scope.nbUserInMeetingRoom = nb;
    })
  };
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    var userDeveiceId = device.uuid;
    $scope.currentDeviceId = userDeveiceId;
    estimote.beacons.startRangingBeaconsInRegion(
      {}, // Empty region matches all beacons.
      function(result) {
          console.log('*** Beacons ranged ***');
          console.log(result);
          //estimote.printObject(result);

          for (var i = result.beacons.length - 1; i >= 0; i--) {
             //if( result.beacons[i].major == 53832 && result.beacons[i].minor==19603) {
             if( result.beacons[i].major == 53832 && result.beacons[i].minor==19603) {
                //console.log('found meeting room beacon '+result.beacons[i].distance+' meters away');
                $scope.userDistanceToMeetingRoom = result.beacons[i].distance; 
                if(result.beacons[i].distance<4) {
                  console.log('User '+userDeveiceId+' is now in the meeting room!');
                  //TODO: indicates to server you are in the meeting room
                  //Check if user allready exists in base
                  Person.query().then(function (result) {
                    console.log(result);
                    var person = null;
                    for (var i = result.length - 1; i >= 0; i--) {
                     if ( result[i].deviceId == userDeveiceId ) {
                        person = result[i];
                        person.lastDetection = Date.now();
                     }
                    };
                    if(!person) {
                      person = new Person({
                        deviceId: userDeveiceId,
                        lastDetection: Date.now()
                      });
                    }
                    person.save().then(function (_person) {
                      console.log(_person);
                    })
                  })
                }
             } 
           }; 
        },
      function(errorMessage) { console.log('Ranging error: ' + errorMessage) }
    );
  });
})
