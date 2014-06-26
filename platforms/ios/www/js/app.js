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
/**
 * The Categories factory handles saving and loading categories
 * from local storage, and also lets us save and load the
 * last active category index.
 */
.factory('Categories', function() {
  return {
    all: function() {
      var categoryString = window.localStorage['categories'];
      if(categoryString) {
        return angular.fromJson(categoryString);
      }
      return [];
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

.controller('ExperienceCtrl', function($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate) {
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
    $scope.activeCategory = category;
    Categories.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
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
  }

  // Try to create the first category, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.categories.length === 0) {
      var initialCategories = [
        { title: 'Academic Excellence', experiences: [
          { title: 'Explore majors' },
          { title: 'Declare a major' },
          { title: 'Work with a professor on research' },
          { title: 'Learning Assistance programs' },
          { title: 'Learning communities' },
          { title: 'Take the State of the Undergraduate Student Survey' }

        ]},
        { title: 'Care/Play', experiences: [
          { title: 'Take an outdoor adventure trip with OAR' },
          { title: 'Participate in the Wellness Challenge' },
          { title: 'Work out at the Eisiminger Fitness Center' },
          { title: 'Visit Seattle area parks' },
          { title: 'RecFest' },
          { title: 'Get a food map of all the edible foods on campus and pick them' },
          { title: 'DJ a show on KSUB' }

        ]},
        { title: 'Diversity', experiences: [
          { title: 'Attend an SU cultural festival, event or celebration' },
          { title: 'Attend the MLK Jr. Celebration lecture' },
          { title: 'Go to the annual International Dinner' },
          { title: 'Attend the SU Drag Show' }
        ]},
        { title: 'Justice/Service', experiences: [
          { title: 'Swishes for Wishes' },
          { title: 'Participate in the Eco-Challenge' },
          { title: 'Volunteer your time with the Seattle University Youth Initiative ' },
          { title: 'Show off your moves @ Dance Marathon' }
        ]},
        { title: 'Spirituality/Faith', experiences: [
          { title: 'Attend a convocation' },
          { title: 'Attend a Campus Ministry retreat' },
          { title: 'Visit the Chapel of St. Ignatius' }
        ]},
        { title: 'Leadership', experiences: [
          { title: 'Support student club events' },
          { title: 'Participate in Leadership Blitz' },
          { title: 'Participate in a rally or march' },
          { title: 'Apply for a leadership position' },
          { title: 'Run for student government' },
          { title: 'Submit an issue to SGSU using We the Redhawk petition' }
        ]},
        { title: 'Pride and Traditions ', experiences: [
          { title: 'Attend a match or game for each SU athletics team' },
          { title: 'Wear red on Fridays' },
          { title: 'Take your picture with Rudy the Redhawk' },
          { title: 'Learn the SU fight song' },
          { title: 'Attend Quadstock' },
          { title: 'Sing carols at the Christmas Tree Lighting' },
          { title: 'Cheer on SU at Homecoming' },
          { title: 'Go to Midnight Madness' },
          { title: 'Read the Spectator every week' }
        ]},
        { title: 'Career Planning', experiences: [
          { title: 'Attend networking events' },
          { title: 'Set up Informational Interviews' },
          { title: 'Reflect on your strengths and skills' },
          { title: 'Get a part-time job or internship' }
        ]}
      ];
      Categories.save(initialCategories);
      $scope.selectCategory(initialCategories[0], 0);
      $scope.categories = Categories.all();
    } else {
      var lastActive = Categories.getLastActiveIndex();
      $scope.selectCategory($scope.categories[lastActive], lastActive);
    }
  });
});
