let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let matches = 0;
let startTime, timerInterval;

// Start the game
window.onload = () => {
    startGame();
    document.getElementById('reset-button').addEventListener('click', resetGame);
};

function startGame() {
    const cards = createCards();
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    cards.forEach(card => gameBoard.appendChild(card));

    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function createCards() {
    // Generate an array of capital letters (A to R)
    const cardValues = Array.from({ length: 18 }, (_, i) => String.fromCharCode(65 + i)).flatMap(letter => [letter, letter]);
    shuffle(cardValues);
    return cardValues.map(value => createCardElement(value));
}

function createCardElement(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.innerHTML = '?'; // Initially hide content
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.innerHTML = this.dataset.value;
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
    matches += 1;
    if (matches === 18) {
        endGame();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.innerHTML = '?';
        secondCard.innerHTML = '?';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    document.getElementById('timer').innerHTML = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById('popup').style.display = 'block';
    document.getElementById('time').value = document.getElementById('timer').innerText.split(' ')[1];
}

function resetGame() {
    matches = 0;
    clearInterval(timerInterval);
    startGame();
    document.getElementById('popup').style.display = 'none';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
