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
.controller('ExperienceCtrl', function($scope, $timeout, $ionicModal, Categories, $ionicSideMenuDelegate, $firebase, $firebaseSimpleLogin) {
  // Initialize user
  // Handle login/id stuff
  var loginDataRef = new Firebase("https://redhawk-experience.firebaseio.com/");
  $scope.loginObj = $firebaseSimpleLogin(loginDataRef);
  $scope.loginData = {};
  $scope.loginObj.$getCurrentUser().then(function(user) {
    if(!user){
      console.log('No current user found');
      // Might already be handled by logout event below
      $scope.openLogin();
    } else {
      console.log('Found current user: ', user);
    }
  }, function(err) {
    console.log('Error happened loading current user: ', err);
  });
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

  // Experiencing Stuff
  $scope.commentDataObj = new Firebase(baseFirebaseURL + 'comments/');
  $scope.commentData = {};
  $scope.submitComment = function() {
    var commentFBData = {};
    commentFBData[$scope.commentData.category.slug] = {};
    commentFBData[$scope.commentData.category.slug][$scope.commentData.experience.id] = {
      user: $scope.loginObj.user.id,
      text: $scope.commentData.text,
      timestamp: Firebase.ServerValue.TIMESTAMP
    };
    $scope.commentDataObj.set(commentFBData);
    console.log('Saved comment', commentFBData);
    $scope.closeComment();
  };

  $scope.doneDataObj = new Firebase(baseFirebaseURL + 'done/');
  $scope.markDone = function(experience) {
    var doneData = {};
    doneData[$scope.loginObj.user.id] = {};
    doneData[$scope.loginObj.user.id][experience.catSlug] = {};
    doneData[$scope.loginObj.user.id][experience.catSlug][experience.id] = {
      title: experience.title,
      catSlug: experience.catSlug,
      id: experience.id
    };
    $scope.doneDataObj.set(doneData);
    console.log('Marked experience done: ', experience);
  };
  $scope.checkCompletion = function(experience) {
    console.log('checking for completion of this experience: ', experience);
    if ($scope.loginObj.user) {
      var checkResult = $scope.doneDataObj
        .child($scope.loginObj.user.id)
        .child(experience.catSlug)
        .child(experience.id).on('value', function(snapshot) {
          if(snapshot.val() === null) {
            console.log('Incomplete');
            return false;
          } else {
            console.log('Complete');
            return true;
          }
        });
    } else {
      return false;
    }
  };

  // END EXPERIENCING STUFF

  // Handle login/id stuff
  var loginDataRef = new Firebase("https://redhawk-experience.firebaseio.com/");
  $scope.loginObj = $firebaseSimpleLogin(loginDataRef);
  $scope.loginData = {};
  $scope.loginObj.$getCurrentUser().then(function(user) {
    if(!user){
      console.log('No current user found');
      // Might already be handled by logout event below
      $scope.openLogin();
    } else {
      console.log('Found current user: ', user);
    }
  }, function(err) {
    console.log('Error happened loading current user: ', err);
  });

  $scope.tryRegister = function() {
    console.log('Attempting to register new user.');
    $scope.loginObj.$createUser(
      $scope.loginData.email,
      $scope.loginData.password).then(function(user) {
          console.log('CREATED User ID: ' + user.uid + ', Email: ' + user.email);
      }, function(error) {
          console.log('ERROR creating user: ', error);
      });
    $scope.closeRegister();
    $scope.tryLogin();
  };

  $scope.tryLogin = function() {
    $scope.loginObj.$login('password', {
      email: $scope.loginData.email,
      password: $scope.loginData.password
    }).then(function(user) {
      // The root scope event will trigger and navigate
      console.log('Logged in as: ', user.uid);
      $scope.closeLogin();
      $ionicSideMenuDelegate.toggleLeft(false);
    }, function(error) {
      // Show a form error here
      console.error('Unable to login', error);
    });
  };
  // END LOGIN/ID STUFF

  // Create and load Modals
  $ionicModal.fromTemplateUrl('login.html', function(modal) {
    $scope.loginModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('register.html', function(modal) {
    $scope.registerModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('logout.html', function(modal) {
    $scope.logoutModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('comment.html', function(modal) {
    $scope.commentModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  $scope.openComment = function(experience, category) {
    if (!$scope.loginObj.user) {
      $scope.loginModal.show();
    } else {
      $scope.commentData.experience = experience;
      $scope.commentData.category = category;
      $scope.commentModal.show();
    }
  };
  $scope.closeComment = function() {
    $scope.commentModal.hide();
  };
  $scope.openRegister = function() {
    $scope.registerModal.show();
  };
  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };
  $scope.openLogin = function() {
    $scope.loginModal.show();
  };
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };
  $scope.openLogout = function() {
    $scope.loginObj.$logout();
    console.log('User has been logged out.');
    $scope.logoutModal.show();
  };
  $scope.closeLogout = function() {
    $scope.logoutModal.hide();
  };
  // END Modals
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
