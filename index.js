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
        // matchesNeedDisplay: $('.matches-need'),
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
            document.querySelector(".card").firstElementChild.focus();
        },
        // end of splashGo
        winner: function () {
            this.gameScreen.addClass('blurred');
            const win = `
                <div class="winner">
                    <label for="reset"><p aria-live="polite">You won in <span class="guess-display">${this.guesses}</span> guesses!</p></label>
                    <button value="reset" class="reset" tabindex=1>
                        <strong>Reset</strong>
                    </button>
                </div>
            `;
            this.footer.append(win);
            // focus on the button and add listener for keyboard navigation
            this.footer.children('.winner').children('button').focus();
            // put this in an event listener
            $('.reset').click(function () {
                jamApp.footer.empty();
                jamApp.splash.removeClass('hide');
                jamApp.splash.children('.start').focus();
            });
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
            // this.matchesNeedDisplay.text(`of ${this.countriesSubset.length}`);

        },
        // end of pickCountriesSubset
        cloneCards: function (numberOfClones){
            // grab card container from DOM
            let donorCard = document.querySelector('.card');
            // clone donor card 11x and push to game-board
            for (let i = 0; i < numberOfClones ; i++) {
                $('.game-board').append(donorCard.cloneNode(true));
            }
           
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
                // $(card1).find(".flag").attr(`alt`, country[0]);
                $(card1).find(".name").text(country[0]);
                $(card2).find(".flag").attr(`src`, "assets/flags/" + country[1].toLowerCase() + ".svg");
                // $(card2).find(".flag").attr(`alt`, country[0]);
                $(card2).find(".name").text(country[0]);
                // this is used to keep track of which cards are clickable
                this.cardsInPlay.push(card1, card2);
                // Add screenreader capability by putting tab index on the buttons
                Array.from(document.querySelectorAll('.card')).forEach((card, index) =>{
                    card.firstElementChild.setAttribute('tabindex', index + 2);
                    card.firstElementChild.setAttribute('aria-label', `card ${index + 1}`);
                });
            });
        },
        // end of dealCards
        resetBoard: function() {
            this.pickPair = [];
            this.matchesGot = 0;
            this.guesses = 0;
            this.guessDisplay.text(`Guesses: ${this.guesses}`);
            this.pickCountriesSubset(this.countries);
            this.matches = 0;
            this.matchesGotDisplay.text(`Matches: ${this.matchesGot} of ${this.countriesSubsetSize}`);
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
            // focus on splashGo button
            this.splash.children('.start').focus();
            //
            // set all cards to listen
            this.handleCardClick();
        },
        // end of init
        handleCardClick: function() {
            // this is the game logic
            this.cardsInPlay.forEach(card => {
                // add event listener to the buttons
                card.firstElementChild.addEventListener('click', function () {
                    
                    // player had a chance to see wrong picks before re-hiding pair
                    if (jamApp.pickPair.length === 2) {
                        jamApp.pickPair.forEach(card => {
                            // set the picked face-ups to hide again
                            card.firstElementChild.children[1].classList.toggle('hide');
                        })
                        // empty the pickPair for the next guess
                        jamApp.pickPair = [];
                    
                    // the clicked card is face-up and no longer interactive    
                    } else if (!this.children[1].classList.contains('hide')) {
                        // face-up is not hidden. so current card is not interactive. so do nothing
                        return undefined;

                    // take the first pick
                    } else if (jamApp.pickPair.length === 0) {
                        // push the li containing the target event's button
                        jamApp.pickPair.push(this.parentNode);
                        // show first card face-up side
                        this.children[1].classList.toggle('hide');
                        
                        // take the second pick
                    } else if (jamApp.pickPair.length === 1) {
                        // 2 picks count as one more guess
                        jamApp.guesses++;
                        jamApp.guessDisplay.text(`Guesses: ${jamApp.guesses}`);
                        // push the li containing the target event's button
                        jamApp.pickPair.push(this.parentNode);
                        // show first card face-up side
                        this.children[1].classList.toggle('hide');
                        // there should be some kind of property and getter-setter for these text values
                        // pickPair[card]-> button -> face-up -> heading -> country-name
                        const firstPick = jamApp.pickPair[0].firstElementChild.children[1].children[0].innerText;
                        const secondPick = jamApp.pickPair[1].firstElementChild.children[1].children[0].innerText;
                        // yay! a match!
                        if (firstPick === secondPick) {
                            // increase the match score and update the score display
                            jamApp.matchesGot++;
                            jamApp.matchesGotDisplay.text(`Matches: ${jamApp.matchesGot} of ${jamApp.countriesSubsetSize}`);
                            // show the checkmarks
                            jamApp.pickPair.forEach(card => {
                                // there should be a shorter reference to the checkmark element
                                card.firstElementChild.children[1].lastElementChild.classList.toggle('hide');
                                card.firstElementChild.setAttribute('tabindex', '-1');
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


