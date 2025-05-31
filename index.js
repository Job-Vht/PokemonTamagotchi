// Variabelen
let level = 1;
let gekozenPokemon = '';
let exp = 0;
const maxExp = 100;
let rareCandy = 0;
let vijandHP = 100;


const audio = new Audio();
audio.src = './'

// Scherm Wisselen
function wisselScherm(idVanNieuwScherm) {
  // Verberg alle schermen
  document.querySelectorAll('.scherm').forEach(scherm => {
    scherm.classList.remove('actief');
  });

  // Toon alleen het nieuwe scherm
  document.getElementById(idVanNieuwScherm).classList.add('actief');
}

// Pokemon kiezen
const pokemonNamen = {
  bulbasaur: 'Bulbasaur',
  ivysaur: 'Ivysaur',
  venusaur: 'Venusaur',
  charmander: 'Charmander',
  charmeleon: 'Charmeleon',
  charizard: 'Charizard',
  squirtle: 'Squirtle',
  wartortle: 'Wartortle',
  blastoise: 'Blastoise'
};

function bepaalNaam(naam) {
  return pokemonNamen[naam] || naam;
}

function kiesPokemon(pokemonNaam) {
  gekozenPokemon = pokemonNaam;

  document.querySelector('#pokemonNaam').textContent = bepaalNaam(pokemonNaam);
  const img = document.createElement('img');
  img.src = `images/${pokemonNaam}.png`;
  img.alt = pokemonNaam;

  const pokemonDiv = document.querySelector('#pokemon');
  pokemonDiv.textContent = '';
  pokemonDiv.appendChild(img);

  speelCry(pokemonNaam);

  wisselScherm('homeScherm');
}


// EXP up
function voerPokemon() {
  if (rareCandy <= 0) {
    alert("Je hebt geen Rare Candy meer!");
    return;
  }

  if (exp < maxExp) {
    rareCandy -= 1;
    updateRareCandy();

    exp += 25;
    if (exp >= maxExp) {
      level += 1;
      exp = 0;
      document.querySelector('#levelNummer').textContent = level;

      if ((level === 5 || level === 15) && evoluties[gekozenPokemon]) {
        startEvolutie();
        return;
      }
    }

    // Update exp bar
    const bar = document.querySelector('#expBar');
    bar.style.width = (exp / maxExp) * 100 + '%';
    document.querySelector('#expPunten').textContent = exp;
  }

  checkVoerKnop();
}



// Update de balk en tekst
const bar = document.querySelector('#expBar');
bar.style.width = (exp / maxExp) * 100 + '%';

document.querySelector('#expPunten').textContent = exp;


document.querySelectorAll('.keuze').forEach(img => {
  img.addEventListener('click', () => {
    const naam = img.dataset.pokemon;
    kiesPokemon(naam);
  });
});

document.querySelector('#voerKnop').addEventListener('click', voerPokemon);

document.querySelector('#vechtKnop').addEventListener('click', () => {
  toonVechtScherm();
});


const evoluties = {
  charmander: { naam: 'Charmeleon', afbeelding: 'charmeleon.png' },
  bulbasaur: { naam: 'Ivysaur', afbeelding: 'ivysaur.png' },
  squirtle: { naam: 'Wartortle', afbeelding: 'wartortle.png' },
  charmeleon: { naam: 'Charizard', afbeelding: 'charizard.png' },
  ivysaur: { naam: 'Venusaur', afbeelding: 'venusaur.png' },
  wartortle: { naam: 'Blastoise', afbeelding: 'blastoise.png' }
};

function startEvolutie() {
  const evolutie = evoluties[gekozenPokemon];
  document.querySelector('#evolutieAfbeelding').src = `images/${evolutie.afbeelding}`;
  document.querySelector('#evolutieNaam').textContent = `Je ${bepaalNaam(gekozenPokemon)} word ${evolutie.naam}!`;
  document.querySelector('#pokemonNaam').textContent = evolutie.naam;

  wisselScherm('evolutieScherm');

  setTimeout(() => {
    gekozenPokemon = evolutie.afbeelding.split('.')[0].toLowerCase();
    kiesPokemon(gekozenPokemon);
  }, 3000);
}

function vechten() {

  wisselScherm('vechtScherm')
}

function speelCry(pokemonNaam) {
  const audio = new Audio(`audio/${pokemonNaam}.mp3`);
  audio.play();
}

function toonVechtScherm() {

  vijandHP = 100;
 
  document.querySelector('#jouwPokemon').src = `images/${gekozenPokemon}.png`;
  document.querySelector('#jouwPokemon').alt = gekozenPokemon;


  const vijanden = ['rattata', 'pidgey', 'pikachu'];
  const random = vijanden[Math.floor(Math.random() * vijanden.length)];

  document.querySelector('#vijandPokemon').src = `images/${random}.png`;
  document.querySelector('#vijandPokemon').alt = random;

  wisselScherm('vechtScherm');
}


document.querySelector('#aanvalKnop').addEventListener('click', () => {
  vijandHP -= 5;

  if (vijandHP < 0) vijandHP = 0;

  document.querySelector('#vijandHpBar').style.width = vijandHP + '%';

  if (vijandHP === 0) {
    alert('Je hebt de vijand verslagen! 🎉');

    wisselScherm('homeScherm');
  }
});

function updateRareCandy() {
  document.querySelector('#rareCandyAantal').textContent = `Rare Candy: ${rareCandy}`;
}

document.querySelector('#aanvalKnop').addEventListener('click', () => {
  vijandHP -= 5;
  if (vijandHP < 0) vijandHP = 0;

  document.querySelector('#vijandHpBar').style.width = vijandHP + '%';

  if (vijandHP === 0) {
    alert('Je hebt de vijand verslagen! 🎉');

    rareCandy += 10;
    updateRareCandy();

    wisselScherm('homeScherm');
  }
});
