$(function() {
    const jamApp = {};
    const countryList = [
        
    ]
    const memoCard = function (countryName, countrycode) {
        this.element = $('div.memo-card');
        this.name = countryName;
        this.code = countryCode;
    }

      jamApp.init = function () {
        // cache selectors - start screen
        this.startButton = $('button.start');
        this.splash = $('.splash');
        this.guessDisplay = $('.guess-display');

        this.startButton.on('click', () => {
            this.splash.removeClass('show');
            this.splash.addClass('hide');
        })

        this.gameBoard = $('.game-board');
        this.setupBoard  = function() {

        }
    };

    jamApp.init()
        
    //     events - splash screen
    //     Click to start - toggles splash show/hide states
    

});
