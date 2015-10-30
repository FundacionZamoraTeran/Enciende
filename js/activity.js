'use strict';
define(function (require) {
    var activity = require('sugar-web/activity/activity');
    var series = require("../js/series.js");
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

    function win_msg() {
        $('.win').removeClass('hidden');
    }

    function fail_msg() {
        $('.bad').removeClass('hidden');
        setTimeout(function() {
            $('.bad').addClass('hidden');
        }, 1500);
    }

    function good_msg() {
        $('.good').removeClass('hidden');
        setTimeout(function() {
            $('.good').addClass('hidden');
        }, 1500);
    }

    function off(n) {
        setTimeout(function() {
            $('button[value="' + n + '"]').removeClass('active');
        }, 1000);
    }

    function activate(numbers) {
        loopTimeout(0, numbers.length, 1300, function(i){
            $('button[value="' + numbers[i] + '"]').addClass('active');
            off(numbers[i]);
        });
    };

    function MemoryGame() {
        this.numbers = [];
        this.count = 0;
        this.win_count = 0;

    };

    MemoryGame.prototype.randomNumber = function() {
        var n = Math.floor(Math.random() * 10);
        while (this.numbers[this.numbers.length - 1] === n) {
            n = Math.floor(Math.random() * 10);
        }
        this.numbers.push(n);
        return this.numbers;
    };

    MemoryGame.prototype.inputNumber = function(number) {
        var n = parseInt(number);
        if (n === this.numbers[this.count]) {
            this.count++;
            // Good
            if (this.count >= this.numbers.length) {
                this.count = 0;
                this.win_count = 0;
                return true;
            }
            // Bien, pero aun no has ganado todas
            else {
                this.win_count++;
                return false;
            }
        }

        // Muy mal
        else {
            this.count = 0;
            fail_msg();
            return false;
        }
    };

    MemoryGame.prototype.win = function() {
        if (this.win_count >= 2) {
            return true;
        }

        else {
            return false;
        }
    }

    MemoryGame.prototype.reset = function() {
        this.numbers = [];
        this.count = 0;
        this.win_count = 0;
    }


    function Series() {
        this.op1 = 0;
        this.op2 = 0;
        this.win_count = 0;
    };

    Series.prototype.randomSerie = function() {
        var tmp = series[Math.floor(Math.random() * series.length)];
        this.op1 = tmp.op1;
        this.op2 = tmp.op2;
        var op = 1;
        for (var i=0; i<tmp.serie.length; i++) {
            if (tmp.serie[i] != null) {
                $('button[value="'+ i +'"]').html(tmp.serie[i]);
            }
            else {
                $('button[value="'+ i +'"]').next('input').removeClass('hidden').addClass('op' + op);
                op++;
            }

            $('#serie-text').html(tmp.text);
        }
    };

    Series.prototype.clean = function() {
        for (var i=0; i<6; i++) {
            $('button[value="'+ i +'"]').html('');
            $('button[value="'+ i +'"]').next('input').addClass('hidden');
            if ($('button[value="'+ i +'"]').next('input').hasClass('op1')) {
                $('button[value="'+ i +'"]').next('input').removeClass('op1');
            }
            else if ($('button[value="'+ i +'"]').next('input').hasClass('op2')) {
                $('button[value="'+ i +'"]').next('input').removeClass('op2');
            }
        }

    };

    Series.prototype.win = function() {
        if (this.win_count >= 2) {
            return true;
        }
        else {
            return false;
        }
    }

    Series.prototype.check = function() {
        if (parseInt($('.op1').val()) === this.op1 && parseInt($('.op2').val()) === this.op2) {
            $('.op1').val('');
            $('.op2').val('');
            this.win_count++;
            return true;
        }
        else {
            $('.op1').val('');
            $('.op2').val('');
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
                var numbers = [];
                $('.start').on('click', function(e) {
                    numbers = game.randomNumber();
                    activate(numbers);
                });
                $('.button-number').on('click', function(e) {
                    e.preventDefault();
                    if(game.win()) {
                        game.reset();
                        win_msg();
                    }
                    else if(game.inputNumber($(this).attr('value'))) {
                        numbers = game.randomNumber();
                        activate(numbers);
                        good_msg();
                    }
                });
                $('.play-again').on('click', function(e) {
                    e.preventDefault();
                    $('.win').addClass('hidden');
                    var numbers = game.randomNumber();
                    activate(numbers);
                });
            }

            else if (level === '2') {
                var s = new Series();
                s.randomSerie();
                $('#check').on('click', function() {
                    if(s.check()) {
                        console.log(s.win());
                        if(s.win()) {
                            win_msg();
                        }
                        else {
                            s.clean();
                            good_msg();
                            s.randomSerie();
                        }
                    }

                    else {
                        fail_msg();
                    }
                });
                $('.serie-again').on('click', function(e) {
                    s.clean();
                    s.randomSerie();
                    $('.win').addClass('hidden');
                });
            }

        };

    });

});
