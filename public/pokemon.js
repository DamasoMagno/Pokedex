const pokemonImage = document.querySelector("img");

const DOM = {
  getParamsURL(paramsInURL){
    const urlParams = window.location.search;
    const params = new URLSearchParams(urlParams);
    const pokemonName = params.get(paramsInURL);

    return pokemonName;
  },

  async renderPokemonElement(){
    const pokemonName = this.getParamsURL("pokemon");
    await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(response => response.json())
    .then(({sprites}) => {
      pokemonImage.src = sprites.front_default;
    });
  }
}

DOM.renderPokemonElement();
