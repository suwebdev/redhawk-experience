// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('rhx', ['ionic'])

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

.controller('ExperienceCtrl', function($scope) {
  $scope.experiences = [
    { title: 'Work with a professor on research.'},
    { title: 'Attend an SU cultural festival, event or celebration'},
    { title: 'Attend the MLK Jr. Celebration lecture'},
    { title: 'Learning Assistance programs'},
    { title: 'Learning communities'},
    { title: 'Declare a major'},
    { title: 'Attend networking events'},
    { title: 'Set up Informational Interviews'},
    { title: 'Reflect on your strengths and skills'},
    { title: 'Explore majors'},
    { title: 'Get a part-time job or internship'}
  ];
});
