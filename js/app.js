// Overlay to prevent clicking on more than two cards
const overlay = $("#overlay");

// List that holds all of the cards
const cards = [
   'fa fa-balance-scale','fa fa-balance-scale',
   'fa fa-binoculars','fa fa-binoculars',
   'fa fa-coffee','fa fa-coffee',
   'fa fa-tree','fa fa-tree',
   'fa fa-umbrella','fa fa-umbrella',
   'fa fa-hand-spock-o','fa fa-hand-spock-o',
   'fa fa-scissors','fa fa-scissors',
   'fa fa-heart','fa fa-heart'
];
 let moves = 0; // Keeps track of the player moves
 let stars = 3; // Keeps track of the player stars
 let timer;     // Keeps track of the player time

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 *  Function for starting a new game
 */
function newGame() {
    const deck = $('.deck');

    // If a deck has already been created, clear the deck before making a new one
    if (deck.children().length > 0) {
        deck.empty();
    }

    setupGame();

    // Shuffle the cards using the shuffle function
    let shuffledCards = shuffle(cards);

    // Loop through each card, create its HTML, and add it to the page
    for (let i = 0; i < shuffledCards.length; i++) {
        const liCard = $('<li>');
        const iCard = $('<i>');

        for (let j = 0; j < shuffledCards.length; j++){
            iCard.appendTo(liCard);
            liCard.appendTo(deck);
            liCard.addClass("card");
            iCard.addClass(shuffledCards[i]);
        }
    }

    // When a card is clicked run the showCard() function
    $('.card').click(showCard);

    // Keyboard shortcut "n" for a new game
    $(document).keydown(function (e) {
        if (e.keyCode == 78) {
            newGame();
        }
    });

}

/*
 *  Updates variables for a new game
 */
function setupGame() {
    // Reset and update the timer
    stopTimer();
    $('.time').text(0);
    // Reset and update the moves
    moves = 0;
    moveUpdate();
    // Reset and update the stars
    stars = 3;
    starCounter();
}

/*
 *  Runs when a card is clicked
 */
function showCard() {
    // Display the card's symbol adding the css classes "open" and "show"
    $(this).addClass("open show");

    checkMatch();
}

/*
 *  Function that checks if the opened cards match or not
 */
function checkMatch() {
    // Keeps track of the opened cards
    let openCards = $(".open");

    // Starts the timer when the user clicks on a card for the first time
    if (moves == 0 && openCards.length == 1){
        startTimer();
    }

    // When the user opens two cards, check to see if they match
    if (openCards.length == 2) {
        // Add overlay to prevent clicking on more than two cards
        overlay.addClass("overlay");

        setTimeout(function() {
        if (openCards[0].children[0].className == openCards[1].children[0].className) {
            // If cards match, they are marked as match
            for (let i = openCards.length - 1; i >= 0; i--) {
                match(openCards[i]);
            }

        }   else {
                // If the cards do not match, hide the card's symbol
                for (let i = openCards.length - 1; i >= 0 ; i--) {
                    mismatch(openCards[i]);
                }
            }

        }, 500);

        moveCounter();

    }
}

/*
 *  Runs when two cards match
 */
function match(element) {
    element.classList.add("match", "animated", "tada");
    // Prevent further clicking on matched cards
    $('.match').off('click');

    checkWin();

    // Wait for the animation to finish before removing classes and the overlay
    window.setTimeout( function() {
        element.classList.remove("animated", "tada", "open", "show");
        overlay.removeClass("overlay");
    }, 1000);

}

/*
 *  Runs when two cards do not match
 */
function mismatch(element) {
    element.classList.add("mismatch", "animated", "rubberBand");

    // Wait for the animation to finish before removing classes and the overlay
    window.setTimeout( function(){
        element.classList.remove("mismatch", "animated", "rubberBand", "open", "show");
        overlay.removeClass("overlay");
    }, 1000);

}

/*
 *  Increments the moves counter, updates the stars, and display them on the page
 */
function moveCounter(){
    moves++;
    starCounter();
    moveUpdate();
}

/*
 *  Display the number of moves on the page
 */
function moveUpdate() {
    $('.moves').html(moves);
}

/*
 *  Updates the stars based on the number of moves
 */
function starCounter() {
    if (moves <= 10) {
        stars = 3;
    } else if (moves <= 15) {
        stars = 2;
    } else {
        stars = 1;
    }

    starUpdate();
}

/*
 *  Display the stars on the page
 */
function starUpdate() {
    // Keeps track of the stars earned
    let starsEarned = $('.score-panel .fa-star');

    if (starsEarned.length != stars) {
        let aStar = $('.score-panel .stars i');

        // Adds a star (with 'fa-star' class)
        for (let i = 0; i <= stars; i++) {
            aStar.eq(i).attr('class', 'fa fa-star');
        }

        // Removes a star (adds an empty star with 'fa-star-o' class)
        for(let i = stars; i < 3; i++){
            aStar.eq(i).attr('class', 'fa fa-star-o');
        }
    }

    // Display the star rating in the victory message
    $('.rating').html($('.score-panel .stars').html());

}

/*
 *  Start the timer and display it on the page
 */
function startTimer() {
    let start = new Date;

    timer = setInterval(function() {
        $('.time').text(Math.round((new Date - start) / 1000, 0));
    }, 1000);

}

/*
 *  Stops the timer
 */
function stopTimer() {
    clearInterval(timer);
}

/*
 *  Checks if all cards have matched (game completed)
 */
function checkWin() {
    // Keeps track of the matched cards
    let matchedCards = $(".match");

    // If all cards have matched, stop the timer and display a message with the final score
    if (matchedCards.length == cards.length) {
        stopTimer();
        victoryMessage();
    }
}

/*
 *  When a user wins the game, display a modal with the final score
 */
function victoryMessage() {
    const victory = $('#victory');

    // Add animation when the modal appears
    victory.on('show.bs.modal', function (e) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog rollIn animated');

        // Starts a new game when the 'Play Again' button is clicked
        $('.play-again').click(newGame);

        // Keyboard shortcut "enter" for the "Play again" button
        $(document).keydown(function (e) {
            if (e.keyCode == 13) {
                $('.play-again').click();
            }
        });
    });

    // Add animation when the modal disappears
    victory.on('hide.bs.modal', function (e) {
        $('.modal .modal-dialog').attr('class', 'modal-dialog rollOut animated');
    });

    victory.modal("show");

}

// Starts a new game when the 'Restart' icon is clicked
$('.restart').click(newGame);

newGame();
