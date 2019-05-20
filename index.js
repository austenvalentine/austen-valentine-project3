$(function() {
    const jamApp = {
        // Using class maybe a better alternative to an object literal
        // Also investigate if inward-facing methods and properties can be made private

        // stretch: get country data should have method to access a json file
        // or a web api
        countriesData: [],
        // cache selectors
        footer: $('footer'),
        gameScreen: $('.game-screen'),
        startButton: $('button.start'),
        splash: $('.splash'),
        countriesSubsetSize: 6,
        guessDisplay: $('.guess-display'),
        matchesGotDisplay: $('.matches-got'),
        matchesNeedDisplay: $('.matches-need'),
        guesses: 0,
        matchesGot: 0,
        cardsInPlay: [],
        cardsMatched: [],
        countriesSubset: [],
        pickPair: [],
        splashGo: function (){
            this.splash.addClass('hide');
            this.resetBoard();
            this.gameScreen.removeClass('blurred');
        },
        // end of splashGo
        winner: function () {
            this.gameScreen.addClass('blurred');
            const win = `
                <div class="winner">
                    <h1>You won in only <span class="guess-display">${this.guesses}</span> guesses!</h1>
                    <button class="reset">
                        <h2>Reset</h2>
                    </button>
                </div>
            `;
            this.footer.append(win);
            // put this in an event listener
            $('.reset').click(function () {
                jamApp.footer.empty();
                jamApp.splash.removeClass('hide');
            });
            // 
        },  
        //end of winner
        pickCountriesSubset: function (countries){
            this.countriesSubset = [];
            // countries parameter needs an array of arrays
            // [[name, country-code],...] copied to a spliceable array
            // to preserve data for future game rounds
            const copyOfCountriesData = this.countriesData.filter(elt => true);
            // pick the subset of countries to match
            for (let i = 0; i < this.countriesSubsetSize; i++) {
                const randIndex = Math.floor(Math.random() * copyOfCountriesData.length);
                const randCountry = copyOfCountriesData.splice(randIndex, 1)[0];
                this.countriesSubset.push(randCountry);
            };
            this.matchesNeedDisplay.text(this.countriesSubset.length);

        },
        // end of pickCountriesSubset
        cloneCards: function (numberOfClones){
            // grab card container from DOM
            let donorCard = document.querySelector('.card');
            // clone donor card 11x and push to game-board
            for (let i = 0; i < numberOfClones ; i++) {
                $('.game-board').append(donorCard.cloneNode(true));
            }
            Array.from(document.querySelectorAll('.card')).forEach((card, index) =>{
                card.setAttribute('tabindex', index + 1)
                .setAttribute('aria-label', index + 1);
            });
        },
        // end of cloneCards
        dealCards: function (){
            // scoop up all the cards from the DOM into
            // a deck of cards - convert the nodeList to array
            const deck = Array.from(document.querySelectorAll('.card'));
            // assign countries to pairs of cards in the deck and deal
            // them to the virtual board
            this.cardsInPlay = [];
            this.countriesSubset.forEach((country, index) => {
                // pick a random pair of cards from the deck
                const cardIndex1 = Math.floor(Math.random() * deck.length);
                const card1 = deck.splice(cardIndex1, 1)[0];
                const cardIndex2 = Math.floor(Math.random() * deck.length);
                const card2 = deck.splice(cardIndex2, 1)[0];
                // assign current country's flag and name to the pair
                $(card1).find(".flag").attr(`src`, "assets/flags/" + country[1].toLowerCase() + ".svg");
                $(card1).find(".name").text(country[0]);
                $(card2).find(".flag").attr(`src`, "assets/flags/" + country[1].toLowerCase() + ".svg");
                $(card2).find(".name").text(country[0]);
                // this is used to keep track of which cards are clickable
                this.cardsInPlay.push(card1, card2);
            });
        },
        // end of dealCards
        resetBoard: function() {
            this.pickPair = [];
            this.matchesGot = 0;
            this.guesses = 0;
            this.guessDisplay.text(this.guesses);
            this.pickCountriesSubset(this.countries);
            this.matches = 0;
            this.matchesGotDisplay.text(this.matchesGot);
            this.dealCards();
            // don't want to hide on init so face-up shows during splash
            document.querySelectorAll('.face-up').forEach(face => {
                // hide the face-up
                face.classList.add('hide');
                // hide the check-mark
                face.children[2].classList.add('hide');
            });
        },
        // end of resetBoard    
        init: function(countriesData) {
            // stretch countriesData should have a method to retrieve
            // data instead of being passed in as argument
            this.countriesData = countriesData;
            this.cloneCards(11);
            this.pickCountriesSubset(this.countries);
            this.dealCards();
            // set all cards to listen
            this.handleCardClick();
        },
        // end of init
        handleCardClick: function() {
            // this is the game logic
            this.cardsInPlay.forEach(card => {
                card.addEventListener('click', function () {
                    // player had a chance to see wrong picks before resetting pair
                    if (jamApp.pickPair.length === 2) {
                        jamApp.pickPair.forEach(card => {
                            card.children[1].classList.toggle('hide');
                        })
                        jamApp.pickPair = [];
                    } else if (!this.childNodes[3].classList.contains('hide')) {
                        // current card is not interactive
                        return undefined;
                    } else if (jamApp.pickPair.length === 0) {
                        jamApp.pickPair.push(this);
                        // show first card face-up side
                        this.children[1].classList.toggle('hide');
                    } else if (jamApp.pickPair.length === 1) {
                        jamApp.guesses++;
                        jamApp.guessDisplay.text(jamApp.guesses);
                        jamApp.pickPair.push(this);
                        // show first card face-up side
                        this.children[1].classList.toggle('hide');
                        // there should be some kind of setter for these text values
                        const firstPick = jamApp.pickPair[0].children[1].children[0].innerText;
                        const secondPick = jamApp.pickPair[1].children[1].children[0].innerText;
                        if (firstPick === secondPick) {
                            // yay! a match! show the checkmarks
                            jamApp.matchesGot++;
                            jamApp.matchesGotDisplay.text(jamApp.matchesGot);
                            jamApp.pickPair.forEach(card => {
                                // there should be a shorter reference to the checkmark element
                                card.childNodes[3].lastElementChild.classList.toggle('hide');
                            })
                            // clear the pickPair so that the successful match cards stay face-up visible
                            jamApp.pickPair = [];
                            
                            // game over
                            if (jamApp.matchesGot == jamApp.countriesSubsetSize) {
                                jamApp.winner();
                            }
                        }
                    }
                })
            });
        },
        // end of handleCardClick

    };


    // events - splash screen
    // bind for method to refer to jamApp instead of startButton
    jamApp.startButton.on('click', jamApp.splashGo.bind(jamApp));
    
        
    // launch game
    jamApp.init(countryData);
});
