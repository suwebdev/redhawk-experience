// Ionic Starter App

var baseFirebaseURL = 'https://redhawk-experience.firebaseio.com/';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('rhx', ['ionic', 'firebase'])

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
/**
 * The Categories factory handles saving and loading categories
 * from local storage, and also lets us save and load the
 * last active category index.
 */
.factory('Categories', function($firebase) {
  return {
    all: function() {
      return $firebase(new Firebase(baseFirebaseURL+'experienceSource'));
    },
    save: function(categories) {
      window.localStorage['categories'] = angular.toJson(categories);
    },
    newCategory: function(categoryTitle) {
      // Add a new category
      return {
        title: categoryTitle,
        experiences: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveCategory']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveCategory'] = index;
    }
  }
})

.controller('ExperienceCtrl', function($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate, $firebase) {
  // A utility function for creating a new category
  // with the given categoryTitle
  var createCategory = function(categoryTitle) {
    var newCategory = Categories.newCategory(categoryTitle);
    $scope.categories.push(newCategory);
    Categories.save($scope.categories);
    $scope.selectCategory(newCategory, $scope.categories.length-1);
  };

  // Load or initialize categories
  $scope.categories = Categories.all();

  // Called to create a new category
  $scope.newCategory = function() {
    var categoryTitle = prompt('Category name');
    if(categoryTitle) {
      createCategory(categoryTitle);
    }
  };

  // Called to select the given category
  $scope.selectCategory = function(category, index) {
    if (category != null){
      $scope.activeCategory = category;
      Categories.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
    } else {
      console.log('trying to set category at load')
      var activeCatRef = $firebase(new Firebase(baseFirebaseURL+'experienceSource/'+index));
      activeCatRef.$on('value', function(cat) {
        if(cat.snapshot === null) {
          console.log('Category does not exist.');
        } else {
          $scope.activeCategory = cat.snapshot.value;
          Categories.setLastActiveIndex(index);
          $ionicSideMenuDelegate.toggleLeft(false);
        }
      });
    }

  };

  // Create and load Modal
  $ionicModal.fromTemplateUrl('new-experience.html', function(modal) {
    $scope.experienceModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.toggleMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.showDetails = function(experience) {
    if ($scope.displayDetails === experience){
      $scope.displayDetails = null;
    } else {
      $scope.displayDetails = experience;
    }
  };

  // Try to create the first category, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    var lastActive = Categories.getLastActiveIndex();
    $scope.selectCategory(null, lastActive);
  });
});
