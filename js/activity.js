'use strict';
define(function (require) {
    var activity = require('sugar-web/activity/activity'),
    $ = require('jquery');

    function loopTimeout(i, max, interval, func) {
        if (i >= max) {
            return;
        }

        // Call the function
        func(i);

        i++;

        // "loop"
        setTimeout(function() {
            loopTimeout(i, max, interval, func);
        }, interval);
    }

    function off(n) {
        setTimeout(function() {
            $('button[value="' + n + '"]').removeClass('active');
        }, 1000);
    }

    function activate(numbers) {
        console.log(numbers);
        loopTimeout(0, numbers.length, 1300, function(i){
            $('button[value="' + numbers[i] + '"]').addClass('active');
            off(numbers[i]);
        });
    };

    function MemoryGame() {
        this.numbers = [];
        this.count = 0;

    };

    MemoryGame.prototype.randomNumber = function() {
        var n = Math.floor(Math.random() * 10);
        this.numbers.push(n);
        return this.numbers;
    };

    MemoryGame.prototype.inputNumber = function(number) {
        var n = parseInt(number);
        if (n === this.numbers[this.count]) {
            this.count++;
            return true;
        }
        else {
            return false;
        }
    };

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        $('.reload-button').on('click', function() {
            location.reload();
        });

        $('.menu-button').on('click', function() {
        	selectMenu($(this).attr('value'));
        });

        var selectMenu = function(level) {
        	$('#level-' + level).toggle();
        	$('#menu').toggle();

            if (level === '1') {
                var game = new MemoryGame();
                var numbers = game.randomNumber();
                activate(numbers);
                $('.button-number').on('click', function(e) {
                    e.preventDefault();
                    if(game.inputNumber($(this).attr('value'))) {
                        numbers = game.randomNumber();
                        activate(numbers);
                    }
                });
            }

            else if (level === '2') {
            }

        };

    });

});
