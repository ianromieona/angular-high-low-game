var hilo = angular.module("hilo",['ngAria','ngMaterial','ngMdIcons'])
        .service('get', function(){
            var cardSuit = ['hearts','spades','clubs','diamonds'];
            var cardNo = ['ace',2,3,4,5,6,8,9,10,'king','jack','queen'];
            var cardNoUsed =[];
            var cardUsed = [];

            this.card = function(value){
                //generate random card number
                randomCardNumber = this.generate(12);
                randomCardSuit = this.generate(cardSuit.length);
                var firstCard = {number:cardNo[randomCardNumber],suit:cardSuit[randomCardSuit]};
                var secondCard = {};

                var a = false;
                while(!a){
                    var rand = this.generate(12);
                    if(firstCard.number != rand){
                        secondCard.number = cardNo[rand];
                        secondCard.suit = cardSuit[randomCardSuit];
                        a = true;
                    }
                }
                return {firstCard:firstCard,secondCard:secondCard};
            };

            this.generate = function(length){
                return Math.floor(Math.random()*length);
            };

            this.check = function(guess,number){
                if(number == "king" || number == "jack" || number == "queen"){
                    number = 10;
                }
                if(number == "ace"){
                    number = 1;
                }
                if(guess){
                    if(number > 7){
                        return true;
                    }
                }else{
                    if(number < 7){
                        return true;
                    }
                }
                return false;
            };


        })
        .controller("HiloCtlr",function($scope,get,$interval,$timeout,$mdDialog){
            var setSecondCard = false;
            var isDisabled = false;
            $scope.counter = "";
            var card = get.card();
            $scope.randomCard = function(card){
                $("#firstCard").attr('src',"img/cards/" + card.firstCard.number + "_of_" + card.firstCard.suit +".png");
                $("#secondCard").attr('src',"img/cards/" + card.secondCard.number + "_of_" + card.secondCard.suit +".png");
            }
            $scope.guess = function(guess){
                $scope.isDisabled = true;
                var title;
                var content;
                $scope.counter = 3;
                stop = $interval(function(){
                            $scope.counter--;
                            if($scope.counter == 0){
                                if(!setSecondCard){
                                    $("#firstCard").attr('src',"img/cards/" + card.firstCard.number + "_of_" + card.firstCard.suit +".png");
                                }else{
                                    $("#firstCard").addClass("blur");
                                    $("#secondCard").attr('src',"img/cards/" + card.secondCard.number + "_of_" + card.secondCard.suit +".png");
                                }
                                $scope.stop();
                                number = card.firstCard.number;
                                if(setSecondCard){
                                    number = card.secondCard.number;
                                }
                                if(get.check(guess,number)){
                                    $scope.counter = "WIN";
                                    title = 'Congratulations';
                                    content = 'You won the game!';
                                }else{
                                    $scope.counter = "LOSE";
                                    if(setSecondCard){
                                        title = 'Better luck next time';
                                        content = 'You lose the game!';
                                    }
                                }
                                $timeout(function(){
                                    $scope.isDisabled = false;
                                    if($scope.counter == "WIN" || setSecondCard){
                                        var confirm = $mdDialog.confirm()
                                          .parent(angular.element(document.body))
                                          .title(title)
                                          .content(content)
                                          .ok('CLOSE');
                                        $mdDialog.show(confirm).then(function() {
                                            $scope.reset();
                                        });
                                    }else{
                                        setSecondCard = true;
                                    }
                                },2000)
                            }
                        },1000);
            }
            $scope.stop = function(){
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            }
            $scope.reset = function(){
                $("#firstCard").removeClass("blur");
                card = get.card();
                $scope.counter = "";
                setSecondCard = false;
                $("#firstCard").attr('src',"img/cards/back.png");
                $("#secondCard").attr('src',"img/cards/back.png");
            }
        });
