let pokemons = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let cardImages = [];

function preload() {
  fetchPokemons();
}

async function fetchPokemons() {
  let promises = [];
  let usedIds = new Set();
  while (usedIds.size < 10) {
    let id = Math.floor(Math.random() * 151) + 1;
    if (!usedIds.has(id)) {
      usedIds.add(id);
      promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json()));
    }
  }
  let results = await Promise.all(promises);
  pokemons = results.map(pokemon => pokemon.sprites.front_default);
  setupGame();
}

function setupGame() {
  let tempCards = [];
  pokemons.forEach((sprite, index) => {
    cardImages.push(loadImage(sprite));
    tempCards.push({ id: index, flipped: false, matched: false });
    tempCards.push({ id: index, flipped: false, matched: false });
  });
  cards = shuffle(tempCards);
  createCanvas(600, 600);
}

function draw() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color('#B3E5FC'), color('#00BCD4'), inter);
    stroke(c);
    line(0, i, width, i);
  }
  for (let i = 0; i < cards.length; i++) {
    let x = (i % 5) * 120;
    let y = Math.floor(i / 5) * 120;
    push();
    noStroke();
    fill(0, 50);
    rect(x + 14, y + 14, 100, 100, 10);
    pop();
    if (cards[i].flipped || cards[i].matched) {
      image(cardImages[cards[i].id], x + 10, y + 10, 100, 100);
    } else {
      fill(255);
      stroke(50);
      strokeWeight(2);
      rect(x + 10, y + 10, 100, 100, 10);
    }
  }
}

function mousePressed() {
  if (!canFlip) return;
  let col = Math.floor(mouseX / 120);
  let row = Math.floor(mouseY / 120);
  let index = row * 5 + col;
  if (index >= cards.length || cards[index].flipped || cards[index].matched) return;
  cards[index].flipped = true;
  flippedCards.push(cards[index]);
  if (flippedCards.length === 2) {
    canFlip = false;
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  if (flippedCards[0].id === flippedCards[1].id) {
    flippedCards[0].matched = true;
    flippedCards[1].matched = true;
    matchedPairs++;
  } else {
    flippedCards[0].flipped = false;
    flippedCards[1].flipped = false;
  }
  flippedCards = [];
  canFlip = true;
  if (matchedPairs === 10) {
    alert("¡Felicidades has ganado!");
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
