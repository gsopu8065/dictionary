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

    .controller('CardsCtrl', function($scope, TDCardDelegate, CardService) {
        console.log('CARDS CTRL');
        CardService.getWord().success(function(data){
            console.log(data.word)
        });

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
