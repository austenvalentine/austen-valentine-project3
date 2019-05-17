$(function() {
    const jamApp = {
        // Using class maybe a better alternative to an object literal
        // Also investigate if inward-facing methods and properties can be made private

        // stretch: get country data should have method to access a json file
        // or a web api
        countriesData: [],
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
            this.resetBoard();
            this.gameScreen.removeClass('blurred');
        },
        pickCountriesSubset: function (countries){
            this.countriesSubset = [];
            // countries parameter needs an array of arrays
            // [[name, country-code],...] copied to a spliceable array
            // to preserve data for future game rounds
            const copyOfCountriesData = this.countriesData.filter(elt => true);
            // pick the subset of countries to match
            for (let i = 0; i < 6; i++) {
                const randIndex = Math.floor(Math.random() * copyOfCountriesData.length);
                const randCountry = copyOfCountriesData.splice(randIndex, 1)[0];
                this.countriesSubset.push(randCountry);
            };
        },
        cloneCards: function (numberOfClones){
            // grab card container from DOM
            let donorCard = document.querySelector('.card');
            // clone donor card 11x and push to game-board
            for (let i = 0; i < numberOfClones ; i++) {
                $('.game-board').append(donorCard.cloneNode(true));
            }
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
        resetBoard: function() {
            this.pickCountriesSubset(this.countries);
            this.dealCards();
        },
        init: function(countriesData) {
            // stretch countriesData should have a method to retrieve
            // data instead of being passed in as argument
            this.countriesData = countriesData;
            this.cloneCards(11);
            this.pickCountriesSubset(this.countries);
            this.dealCards();
        },
    };


    // events - splash screen
    // bind for method to refer to jamApp instead of startButton
    jamApp.startButton.on('click', jamApp.splashGo.bind(jamApp));

    // launch game
    jamApp.init(countryData);
});
