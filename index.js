$(function() {
    const jamApp = {};

    const card = function (countryName, countrycode) {
        this.name = countryName;
        this.code = countryCode;
        this.component = $('<div>').attr('class', '.memo-card');
        // nest country info into the component div
    }

    const countriesSubset = [];
    for (let i = 0; i <= 6; i++) {
        let randIndex = Math.floor(Math.random() * countryCodes.length);
        let randCountry = countryCodes.splice(randIndex, 1)[0];
        countriesSubset.push();
    };

    

    jamApp.init = function () {
        // cache selectors - start screen
        this.gameScreen = $('.game-screen');
        this.startButton = $('button.start');
        this.splash = $('.splash');
        this.guessDisplay = $('.guess-display');

        this.startButton.on('click', () => {
            this.splash.removeClass('show');
            this.splash.addClass('hide');
            this.gameScreen.removeClass('blurred');

        })


        this.gameBoard = $('.game-board');
        this.setupBoard  = function() {

        }
    };

    jamApp.init()
        
    //     events - splash screen
    //     Click to start - toggles splash show/hide states
    

});
