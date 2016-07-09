angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'ui.bootstrap', 'ngStorage', 'ngSanitize'])

    .run(function ($rootScope, $q, CardService) {
        $rootScope.cards = []
        $rootScope.loading = true;
        CardService.getWords().success(function (data) {
            $rootScope.cards = data
            $rootScope.loading = false;
            $rootScope.$emit('jack');
        });
    })

    .directive('noScroll', function ($document) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {
                $document.on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        }
    })

    .controller('CardsCtrl', function ($rootScope, $scope, TDCardDelegate, CardService, $modal, $sessionStorage) {
        var fingerprint = new Fingerprint().get();

        if($sessionStorage.slangCheck == undefined) {
            console.log($sessionStorage.slangCheck)
            $sessionStorage.slangCheck = true
            console.log($sessionStorage.slangCheck)
        }
        if($sessionStorage.verbsCheck == undefined) $sessionStorage.verbsCheck = false
        if($sessionStorage.emotionsCheck == undefined) $sessionStorage.emotionsCheck = false
        if($sessionStorage.adjectivesCheck == undefined) $sessionStorage.adjectivesCheck = false
        if($sessionStorage.descriptiveCheck == undefined) $sessionStorage.descriptiveCheck = false

        $scope.slangCheck = $sessionStorage.slangCheck
        $scope.verbsCheck = $sessionStorage.verbsCheck;
        $scope.emotionsCheck = $sessionStorage.emotionsCheck;
        $scope.adjectivesCheck = $sessionStorage.adjectivesCheck;
        $scope.descriptiveCheck = $sessionStorage.descriptiveCheck;

        $scope.email = $sessionStorage.email;
        if (!$scope.email) {
            CardService.getEmail(fingerprint)
                .success(function (data) {
                    if (data.length > 0) {
                        $scope.email = data[0].email;
                        $sessionStorage.email = data[0].email;
                        unbindHandler();
                    }
                    else {
                        $modal.open({
                            templateUrl: 'popup/popup.html',
                            controller: function ($scope, $modalInstance) {
                                $scope.ok = function (email) {
                                    $modalInstance.close(email);
                                };
                            }
                        }).result.then(function (result) {
                            $scope.email = result;
                            $sessionStorage.email = $scope.email;
                            CardService.signUp(fingerprint, result)
                                .success(function (signUpRes) {
                                    console.log(signUpRes)
                                    $modal.open({
                                        templateUrl: 'popup/sucess.html',
                                        controller: function ($scope, $modalInstance) {
                                            $scope.ok = function () {
                                                $modalInstance.close();
                                            };
                                        }
                                    })
                                    unbindHandler();
                                })
                        });
                    }

                })
        }


        var unbindHandler = $rootScope.$on('jack', function () {
            $scope.cards = $rootScope.cards
        });

        $scope.loadSavedWords = function () {
            document.getElementById("rightSideNav").style.width = "100%";
            document.getElementById("rightSideNav").style.display = "block";
            CardService.getSavedWords($scope.email)
                .success(function (res) {
                    $scope.savedWords = res.words
                })
        }

        $scope.removeSavedWord = function (word) {
            CardService.removeSavedWord($scope.email, word)
                .success(function (res) {
                    $scope.savedWords.splice($scope.savedWords.indexOf(word), 1)
                })
        }

        $scope.verifyCheck = function () {
            var flag = $scope.slangCheck || $scope.verbsCheck || $scope.emotionsCheck || $scope.adjectivesCheck || $scope.descriptiveCheck;
            if (!flag) {
                $scope.slangCheck = true
            }

            $sessionStorage.slangCheck = $scope.slangCheck
            $sessionStorage.verbsCheck = $scope.verbsCheck
            $sessionStorage.emotionsCheck = $scope.emotionsCheck
            $sessionStorage.adjectivesCheck = $scope.adjectivesCheck
            $sessionStorage.descriptiveCheck = $scope.descriptiveCheck
        }


        $scope.left_open = function () {
            document.getElementsByClassName("w3-leftsidenav")[0].style.width = "100%";
            document.getElementsByClassName("w3-leftsidenav")[0].style.display = "block";
        }
        $scope.left_close = function () {
            document.getElementsByClassName("w3-leftsidenav")[0].style.display = "none";
        }

        var pointer = 1
        $scope.addCard = function () {

            var indexs = []
            if ($scope.slangCheck) indexs.push(1);
            if ($scope.verbsCheck) indexs.push(2);
            if ($scope.emotionsCheck) indexs.push(3);
            if ($scope.adjectivesCheck) indexs.push(4);
            if ($scope.descriptiveCheck) indexs.push(5);

            if (pointer > indexs.length) pointer = 1;

            CardService.getWord(indexs[pointer - 1]).success(function (data) {
                $scope.cards.unshift(angular.extend({}, data));
            });
            pointer++;
        }

        $scope.cardSwipedLeft = function (index) {
            console.log('LEFT SWIPE');
        };
        $scope.cardSwipedRight = function (index) {
            CardService.saveWord($scope.email, $scope.cards[index])
                .success(function (signUpRes) {
                })
        };

        $scope.cardDestroyed = function (index) {
            console.log('cardDestroyed');
            $scope.cards.splice(index, 1);
            $scope.addCard();
        };

    })
    .factory('CardService', ["$http", function ($http) {
        var CardService = {};
        CardService.getWord = function (index) {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/random?id=' + index,
            });
        };

        CardService.getWords = function () {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/randomWords',
            });
        };

        CardService.getEmail = function (deviceId) {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/getEmail?deviceId=' + deviceId,
            });
        };

        CardService.signUp = function (deviceId, email) {
            return $http({
                method: 'post',
                url: 'https://dictionaryweb.herokuapp.com/signup',
                data: {
                    _id: deviceId + "",
                    email: email
                }
            });
        };

        CardService.saveWord = function (email, word) {
            return $http({
                method: 'post',
                url: 'https://dictionaryweb.herokuapp.com/saveWord',
                data: {
                    email: email,
                    word: [word]
                }
            });
        };

        CardService.getSavedWords = function (email) {
            return $http({
                method: 'get',
                url: 'https://dictionaryweb.herokuapp.com/getSavedWords?email=' + email,
            });
        };

        CardService.removeSavedWord = function (email, word) {
            return $http({
                method: 'post',
                url: 'https://dictionaryweb.herokuapp.com/removeWord',
                data: {
                    email: email,
                    word: word
                }
            });
        };

        return CardService;
    }]);
