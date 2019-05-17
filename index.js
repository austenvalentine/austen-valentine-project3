$(function() {
    const jamApp = {};
    jamApp.gameBoard = [];
    // pick the subset of countries to match
    const countriesSubset = [];
    for (let i = 0; i < 6; i++) {
        let randIndex = Math.floor(Math.random() * countryCodes.length);
        let randCountry = countryCodes.splice(randIndex, 1)[0];
        countriesSubset.push(randCountry);
    };

    // scoop up all the cards from the DOM into
    // a deck of cards - convert the JQuery selector container 
    // to an array to use built-in array methods
    const deck = $('.card').toArray();
    // assign countries to pairs of cards in the deck and deal
    // them to the virtual board
    
    countriesSubset.forEach((country, index) => {
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

        jamApp.gameBoard.push(card1, card2);
    
    });
    
    

    jamApp.init = function () {
        // cache 
        this.gameScreen = $('.game-screen');
        this.startButton = $('button.start');
        this.splash = $('.splash');
        this.guessDisplay = $('.guess-display');
        // dealt cards go in here
        

        this.startButton.on('click', () => {
            this.splash.removeClass('show');
            this.splash.addClass('hide');
            this.gameScreen.removeClass('blurred');
        })

    };

    jamApp.init()
        
    //     events - splash screen
    //     Click to start - toggles splash show/hide states
    

});
