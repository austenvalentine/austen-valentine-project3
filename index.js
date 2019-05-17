$(function() {
    const jamApp = {
        // using class maybe a better alternative to an object literal

        // get country data
        countries: countryCodes,
        // cache selectors
        gameScreen: $('.game-screen'),
        startButton: $('button.start'),
        splash: $('.splash'),
        guessDisplay: $('.guess-display'),
        gameBoard: [],
        countriesSubset: [],
        splashGo: function (){
            this.splash.removeClass('show');
            this.splash.addClass('hide');
            this.gameScreen.removeClass('blurred');
            this.init(this.countries);
        },
        pickCountriesSubset: function (countries){
            this.countriesSubset = [];
            // countries parameter needs an array of arrays
            // [[name, country-code],...]
            // pick the subset of countries to match
            for (let i = 0; i < 6; i++) {
                const randIndex = Math.floor(Math.random() * countries.length);
                const randCountry = countries.splice(randIndex, 1)[0];
                this.countriesSubset.push(randCountry);
            };
        },
        dealCards: function (){
            // scoop up all the cards from the DOM into
            // a deck of cards - convert the JQuery selector container 
            // to an array to use built-in array methods
            const deck = $('.card').toArray();
            // assign countries to pairs of cards in the deck and deal
            // them to the virtual board

            this.countriesSubset.forEach((country, index) => {
                // pick a random pair of cards from the deck
                const cardIndex1 = Math.floor(Math.random() * deck.length);
                const card1 = deck.splice(cardIndex1, 1);
                const cardIndex2 = Math.floor(Math.random() * deck.length);
                const card2 = deck.splice(cardIndex2, 1);
                // assign current country's flag and name to the pair
                $(card1).find(".flag").attr(`src`, "assets/flags/" + country[1].toLowerCase() + ".svg");
                $(card1).find(".name").text(country[0]);
                $(card2).find(".flag").attr(`src`, "assets/flags/" + country[1].toLowerCase() + ".svg");
                $(card2).find(".name").text(country[0]);
                this.gameBoard.push(card1, card2);
            });
        },
        init: function(countries) {
            // build up the DOM cards by cloning the markup
            // this.cloneCards(12);
            this.pickCountriesSubset(countries);
            this.dealCards();
        },
    };


    // events - splash screen
    // bind for method to refer to jamApp instead of startButton
    jamApp.startButton.on('click', jamApp.splashGo.bind(jamApp));

    // launch game
    jamApp.init(countryCodes);
});
