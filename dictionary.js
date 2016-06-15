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
              definition: 'BMW car ngbjgkn bjkfgksjdf hbjhfgbkjsn jhdfkjgsdf  jdfghsdf jhgjhsdfgjk',
			  example: 'I have BMW car',			
            },
            { word: 'Beemar2',
                definition: 'BMW car ngbjgkn bjkfgksjdf hbjhfgbkjsn jhdfkjgsdf  jdfghsdf jhgjhsdfgjk',
				example: 'I have BMW car',		
            },
            { word: 'Beemar3',
                definition: 'BMW car ngbjgkn bjkfgksjdf hbjhfgbkjsn jhdfkjgsdf  jdfghsdf jhgjhsdfgjk',				
            },
            { word: 'Beemar4',
                definition: 'BMW car ngbjgkn bjkfgksjdf hbjhfgbkjsn jhdfkjgsdf  jdfghsdf jhgjhsdfgjk',
				example: 'I have BMW car',				
            }
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
    })

    .factory('CardService', ["$http", function($http) {
        var CardService = {};

        CardService.getWord = function(){
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/random',
            });
        };

        return CardService;
    }]);
