$(function() {
    const jamApp = {};

    const card = function (countryName, countrycode) {
        this.name = countryName;
        this.code = countryCode;
        this.box = $('div.memo-card');
        // how is this going to be built?
        // this.component = this.box.append()
    }

    const countriesSubset = [];
    for (let i = 0; i <= 6; i++) {
        let randIndex = Math.floor(Math.random() * countryCodes.length);
        let randCountry = countryCodes.splice(randIndex, 1)[0];
        countriesSubset.push();
    };

    

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
