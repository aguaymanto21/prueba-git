// script.js

document.addEventListener('DOMContentLoaded', function() {
  const cardsContainer = document.getElementById('cards-container');
  const loader = document.getElementById('loader');

  // Función para capitalizar la primera letra
  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Función para convertir metros a pies y pulgadas
  function metersToFeetInches(meters) {
      const totalInches = meters * 39.3701;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}' ${inches}"`;
  }

  // Función para convertir kilogramos a libras
  function kgToLbs(kg) {
      return `${(kg * 2.20462).toFixed(1)} lbs`;
  }

  // Función para crear una tarjeta de Pokémon
  function createPokemonCard(pokemon) {
      // Crear elementos de la tarjeta
      const card = document.createElement('div');
      card.classList.add('card');

      const nameHeader = document.createElement('h1');
      nameHeader.textContent = `Hola, soy el Pokémon: ${capitalizeFirstLetter(pokemon.name)}`;
      card.appendChild(nameHeader);

      const image = document.createElement('img');
      image.src = pokemon.image;
      image.alt = `Imagen de ${capitalizeFirstLetter(pokemon.name)}`;
      card.appendChild(image);

      const typePara = document.createElement('p');
      typePara.innerHTML = `<strong>Tipo:</strong> ${pokemon.types.join(', ')}`;
      card.appendChild(typePara);

      const abilitiesPara = document.createElement('p');
      abilitiesPara.innerHTML = `<strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}`;
      card.appendChild(abilitiesPara);

      const heightPara = document.createElement('p');
      heightPara.innerHTML = `<strong>Altura:</strong> ${pokemon.height} m (${pokemon.heightImperial})`;
      card.appendChild(heightPara);

      const weightPara = document.createElement('p');
      weightPara.innerHTML = `<strong>Peso:</strong> ${pokemon.weight} kg (${pokemon.weightImperial})`;
      card.appendChild(weightPara);

      const statsDiv = document.createElement('div');
      statsDiv.id = 'pokemon-stats';
      statsDiv.innerHTML = `<strong>Estadísticas:</strong>`;
      const statsList = document.createElement('ul');
      statsList.classList.add('stats-list');

      // Agregar estadísticas a la lista
      for (let stat in pokemon.stats) {
          const statItem = document.createElement('li');
          statItem.textContent = `${stat}: ${pokemon.stats[stat]}`;
          statsList.appendChild(statItem);
      }

      statsDiv.appendChild(statsList);
      card.appendChild(statsDiv);

      // Opcional: Crear un gráfico radar de estadísticas
      const statsChart = document.createElement('canvas');
      statsChart.classList.add('stats-chart');
      statsChart.style.display = 'none'; // Ocultar inicialmente
      card.appendChild(statsChart);

      // Agregar la tarjeta al contenedor
      cardsContainer.appendChild(card);

      // Crear el gráfico radar usando Chart.js
      const labels = Object.keys(pokemon.stats);
      const dataValues = Object.values(pokemon.stats);

      statsChart.style.display = 'block'; // Mostrar el gráfico

      new Chart(statsChart, {
          type: 'radar',
          data: {
              labels: labels,
              datasets: [{
                  label: `${capitalizeFirstLetter(pokemon.name)} Estadísticas`,
                  data: dataValues,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                  pointBackgroundColor: 'rgba(255, 99, 132, 1)'
              }]
          },
          options: {
              scales: {
                  r: {
                      beginAtZero: true,
                      suggestedMin: 0,
                      suggestedMax: 150
                  }
              }
          }
      });
  }

  // Función para obtener los primeros 6 Pokémon
  async function getFirstSixPokemon() {
      try {
          // Mostrar el loader
          loader.style.display = 'block';

          // Obtener la lista de los primeros 6 Pokémon
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=6');
          if (!response.ok) {
              throw new Error('Error al obtener la lista de Pokémon');
          }
          const data = await response.json();

          // Iterar sobre cada Pokémon y obtener sus detalles
          const pokemonPromises = data.results.map(async (pokemon) => {
              const res = await fetch(pokemon.url);
              if (!res.ok) {
                  throw new Error(`Error al obtener los datos de ${pokemon.name}`);
              }
              const details = await res.json();

              // Obtener tipos
              const types = details.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name));

              // Obtener habilidades
              const abilities = details.abilities.map(abilityInfo => capitalizeFirstLetter(abilityInfo.ability.name));

              // Obtener altura y peso
              const height = details.height / 10; // Decímetros a metros
              const heightImperial = metersToFeetInches(height);
              const weight = details.weight / 10; // Hectogramos a kilogramos
              const weightImperial = kgToLbs(weight);

              // Obtener estadísticas
              const stats = {};
              details.stats.forEach(statInfo => {
                  stats[capitalizeFirstLetter(statInfo.stat.name)] = statInfo.base_stat;
              });

              // Obtener imagen
              const image = details.sprites.other['official-artwork'].front_default || details.sprites.front_default || '';

              return {
                  name: pokemon.name,
                  image: image,
                  types: types,
                  abilities: abilities,
                  height: height,
                  heightImperial: heightImperial,
                  weight: weight,
                  weightImperial: weightImperial,
                  stats: stats
              };
          });

          // Esperar a que todas las promesas se resuelvan
          const allPokemon = await Promise.all(pokemonPromises);

          // Crear una tarjeta para cada Pokémon
          allPokemon.forEach(pokemon => {
              createPokemonCard(pokemon);
          });

          // Ocultar el loader
          loader.style.display = 'none';

      } catch (error) {
          console.error('Error:', error);
          alert('Hubo un problema al cargar los Pokémon. Inténtalo nuevamente más tarde.');
          loader.style.display = 'none';
      }
  }

  // Llamar a la función para obtener y mostrar los Pokémon al cargar la página
  getFirstSixPokemon();
});
