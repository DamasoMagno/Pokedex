const input = document.querySelector("input");
const button = document.querySelector("#find-pokemon");
const buttonSeeMore = document.querySelector("#see-more");

let allPokemons;
let chargingAllPokemons = [];

function stopSearchInAPI() {
  return chargingAllPokemons.forEach(item => {
    clearTimeout(item)
  });
}

const DOM = {
  allPokemonsDiv: document.querySelector(".pokemons"),

  renderAllPokemons(pokemon){
    const aPokemon = document.createElement("a");
    aPokemon.classList.add("pokemon");
    aPokemon.setAttribute("href",`/pokemon.html?pokemon=${pokemon.name}`);   

    const div = document.createElement("div");
    const strong = document.createElement("strong");
    const span = document.createElement("span");
    const img = document.createElement("img");

    const namePokemonStrong = document.createTextNode(`${pokemon.name}`);
    const idPokemonSpan = document.createTextNode(`#${pokemon.id}`);

    strong.appendChild(namePokemonStrong);
    span.appendChild(idPokemonSpan);
    img.src = `${pokemon.sprites.front_default}`;

    div.appendChild(strong);
    div.appendChild(span);

    aPokemon.appendChild(img);
    aPokemon.append(div);

    this.allPokemonsDiv.appendChild(aPokemon);
  },
}

const ChargePokemons = {
  offset: 20,

  async chargeAllPokemons(){
    await fetch("https://pokeapi.co/api/v2/pokemon")
    .then(response => response.json())
    .then(response  => {
      allPokemons = response.results;
    });

    allPokemons.forEach((item, index) => {
      chargingAllPokemons.push(
        setTimeout( async() => {
          await fetch(`https://pokeapi.co/api/v2/pokemon/${index+1}`)
          .then(response => response.json())
          .then(response => {
           DOM.renderAllPokemons(response);
          });
        }, 1000 + ((index + 1) * 1000))
      )
    })
  },

  async findPokemon(){
    await fetch(`https://pokeapi.co/api/v2/pokemon/${input.value}`)
    .then(response => response.json())
    .then(response => {
      stopSearchInAPI();
      DOM.allPokemonsDiv.innerHTML = "";
      DOM.renderAllPokemons(response);
    });
  },

  async seeMorePokemon(){
    await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${this.offset}&limit=20`)
    .then(response => response.json())
    .then(response => {
      allPokemons = response.results;
    });

    this.offset += 20;

    allPokemons.forEach((item, index) => {
      setTimeout(async () => {
        await fetch(`https://pokeapi.co/api/v2/pokemon/${item.name}`)
        .then(response => response.json())
        .then(response => {
          DOM.renderAllPokemons(response);
        });
      }, 1000 + ((index + 1) * 1000))
    })
  }
}

const App = {
  init(){
    ChargePokemons.chargeAllPokemons();
  },

  chargeMorePokemon(){
    buttonSeeMore.addEventListener("click", ChargePokemons.seeMorePokemon);
  },

  findPokemonAndShowHer(){
    input.addEventListener("keyup", (e)=>{
      if(!e.target.value){
        stopSearchInAPI();
        DOM.allPokemonsDiv.innerHTML = "";
        ChargePokemons.chargeAllPokemons();
        button.disabled = true;
      } else {
        button.disabled = false;
        button.addEventListener("click", ()=> {
          ChargePokemons.findPokemon();
        })
      }
    });
  }
}

App.init();
App.chargeMorePokemon();
App.findPokemonAndShowHer();