// Variabelen
let level = 1;
let gekozenPokemon = '';
let exp = 0;
const maxExp = 100;
let rareCandy = 0;
let vijandHP = 100;
let jouwHP = 100;
let hpInterval;

const middelEvoluties = ['charmeleon', 'ivysaur', 'wartortle'];
const laatsteEvoluties = ['charizard', 'venusaur', 'blastoise'];

// Scherm Wisselen
function wisselScherm(idVanNieuwScherm) {

  // Verberg alle schermen
  document.querySelectorAll('.scherm').forEach(scherm => {
    scherm.classList.remove('actief');
  });

  // Toon alleen het nieuwe scherm
  document.getElementById(idVanNieuwScherm).classList.add('actief');
}

// Melding functie
function toonMelding(tekst, callback = null) {
  const meldingDiv = document.getElementById('melding');
  const meldingTekst = document.getElementById('meldingTekst');

  meldingTekst.textContent = tekst;
  meldingDiv.style.display = 'block';

  setTimeout(() => {
    meldingDiv.style.display = 'none';
    if (callback) {
      callback();
    }
  }, 2000);
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

  if (middelEvoluties.includes(pokemonNaam)) {
    img.classList.add('middel');
  }

  if (laatsteEvoluties.includes(pokemonNaam)) {
    img.classList.add('groot');
  }

  const pokemonDiv = document.querySelector('#pokemon');
  pokemonDiv.textContent = '';
  pokemonDiv.appendChild(img);

  speelCry(pokemonNaam);

  wisselScherm('homeScherm');
}


// Exp verhogen
function voerPokemon() {
  if (rareCandy <= 0) {
    toonMelding("Je hebt geen Rare Candy meer! Vecht om meer te verdienen.");
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

      // Evolutie op level 5 en 15
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

// EventListeners
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

// Evoluties
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

  speelEvolutie()

  setTimeout(() => {
    gekozenPokemon = evolutie.naam.toLowerCase();
    kiesPokemon(gekozenPokemon);
  }, 3000);
}

// Vechten functie
function vechten() {

  wisselScherm('vechtScherm')
}

// Audio functies
function speelCry(pokemonNaam) {
  const audio = new Audio(`audio/${pokemonNaam}.mp3`);
  audio.play();
}

function speelEvolutie() {
  const audio = new Audio(`audio/pokemonevolve.mp3`);
  audio.play();
}

// Vecht scherm
function toonVechtScherm() {
  vijandHP = 100;
  jouwHP = 100;

  document.querySelector('#jouwPokemon').src = `images/${gekozenPokemon}.png`;
  document.querySelector('#jouwPokemon').alt = gekozenPokemon;
  document.querySelector('#hpBar').style.width = jouwHP + '%';

  // Random Pokémon elk gevecht
  const vijanden = ['rattata', 'pidgey', 'pikachu'];
  const random = vijanden[Math.floor(Math.random() * vijanden.length)];

  document.querySelector('#vijandPokemon').src = `images/${random}.png`;
  document.querySelector('#vijandPokemon').alt = random;
  document.querySelector('#vijandHpBar').style.width = vijandHP + '%';


  wisselScherm('vechtScherm');

  // Elke seconden 10 hp van mijn Pokémon afhalen
  hpInterval = setInterval(() => {
    jouwHP -= 10;
    if (jouwHP < 0) jouwHP = 0;
    document.querySelector('#hpBar').style.width = jouwHP + '%';

    if (jouwHP === 0) {
      clearInterval(hpInterval);
      toonMelding('Je hebt verloren :(', () => wisselScherm('homeScherm'));
    }
  }, 1000);
}

// Rare Candy aantal updaten
function updateRareCandy() {
  document.querySelector('#rareCandyAantal').textContent = `Rare Candy: ${rareCandy}`;
}

// Aanvallen
document.querySelector('#aanvalKnop').addEventListener('click', () => {
  vijandHP -= 5;
  if (vijandHP < 0) vijandHP = 0;

  document.querySelector('#vijandHpBar').style.width = vijandHP + '%';

  if (vijandHP === 0) {
    clearInterval(hpInterval);
    toonMelding('Je hebt de vijand verslagen! :)', () => wisselScherm('homeScherm'));

    rareCandy += 10;
    updateRareCandy();
  }
});

