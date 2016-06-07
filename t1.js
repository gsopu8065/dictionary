angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards'])

  .directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

  .controller('CardsCtrl', function($scope, TDCardDelegate) {
  console.log('CARDS CTRL');
  var cardTypes = [
    { word: 'Beemar',
      meaning: 'BMW'
    },
    { word: 'Beemar2',
      meaning: 'BMW'
    },
    { word: 'Beemar3',
      meaning: 'BMW'
    },
    { word: 'Beemar4',
      meaning: 'BMW'
    }/*,
    { image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSJIt3D4sRY9Prsd-1EdaTyMNeTzOrhP9sV46PW_rMabw2rU1B3' },
    { image: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png' },
    { image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSJIt3D4sRY9Prsd-1EdaTyMNeTzOrhP9sV46PW_rMabw2rU1B3'}*/
  ];

  $scope.cards = Array.prototype.slice.call(cardTypes, 0);

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  }
})

  .controller('CardCtrl', function($scope, TDCardDelegate) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    $scope.addCard();
  };
});
