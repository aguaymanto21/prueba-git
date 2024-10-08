// script.js

document.addEventListener('DOMContentLoaded', function() {
  const fetchButton = document.getElementById('fetch-button');
  const pokemonInput = document.getElementById('pokemon-input');
  const pokemonNameHeader = document.getElementById('pokemon-name');
  const pokemonImage = document.getElementById('pokemon-image');
  const pokemonType = document.getElementById('pokemon-type');
  const pokemonAbilities = document.getElementById('pokemon-abilities');
  const pokemonHeight = document.getElementById('pokemon-height');
  const pokemonWeight = document.getElementById('pokemon-weight');
  const statsList = document.getElementById('stats-list');
  const loader = document.getElementById('loader');
  const statsChart = document.getElementById('stats-chart');

  let chart; // Variable para almacenar el gráfico de Chart.js

  fetchButton.addEventListener('click', function() {
      const pokemonName = pokemonInput.value.trim().toLowerCase();

      if (pokemonName === "") {
          alert("Por favor, ingresa el nombre o ID del Pokémon.");
          return;
      }

      // Actualiza el <h1> con el nombre ingresado (capitaliza la primera letra)
      pokemonNameHeader.textContent = `Pokémon: ${capitalizeFirstLetter(pokemonName)}`;

      // Limpia el contenido previo
      pokemonImage.style.display = 'none';
      pokemonImage.src = '';
      pokemonType.innerHTML = "<strong>Tipo:</strong> ";
      pokemonAbilities.innerHTML = "<strong>Habilidades:</strong> ";
      pokemonHeight.innerHTML = "<strong>Altura:</strong> ";
      pokemonWeight.innerHTML = "<strong>Peso:</strong> ";
      statsList.innerHTML = ""; // Limpia la lista de estadísticas

      // Oculta el gráfico previo si existe
      if (chart) {
          chart.destroy();
          statsChart.style.display = 'none';
      }

      // Muestra el loader
      loader.style.display = 'block';

      // Fetch de la PokéAPI
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
          .then(response => {
              if (!response.ok) {
                  throw new Error('Pokémon no encontrado');
              }
              return response.json();
          })
          .then(data => {
              // Actualiza la imagen del Pokémon
              if (data.sprites && data.sprites.other['official-artwork'].front_default) {
                  pokemonImage.src = data.sprites.other['official-artwork'].front_default;
                  pokemonImage.style.display = 'block'; // Muestra la imagen
                  pokemonImage.alt = `Imagen de ${capitalizeFirstLetter(data.name)}`;
              } else {
                  // Si no hay imagen oficial, usa la imagen por defecto
                  if (data.sprites && data.sprites.front_default) {
                      pokemonImage.src = data.sprites.front_default;
                      pokemonImage.style.display = 'block';
                      pokemonImage.alt = `Imagen de ${capitalizeFirstLetter(data.name)}`;
                  } else {
                      pokemonImage.style.display = 'none'; // Oculta la imagen si no existe
                  }
              }

              // Actualiza el tipo del Pokémon
              const types = data.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name)).join(', ');
              pokemonType.innerHTML = `<strong>Tipo:</strong> ${types}`;

              // Actualiza las habilidades del Pokémon
              const abilities = data.abilities.map(abilityInfo => {
                  const abilityName = capitalizeFirstLetter(abilityInfo.ability.name);
                  return abilityInfo.is_hidden ? `${abilityName} (Oculta)` : abilityName;
              }).join(', ');
              pokemonAbilities.innerHTML = `<strong>Habilidades:</strong> ${abilities}`;

              // Actualiza la altura y el peso del Pokémon
              const heightInMeters = data.height / 10; // La API devuelve la altura en decímetros
              const weightInKg = data.weight / 10; // La API devuelve el peso en hectogramos
              const heightInFeetInches = metersToFeetInches(heightInMeters);
              const weightInLbs = kgToLbs(weightInKg);
              pokemonHeight.innerHTML = `<strong>Altura:</strong> ${heightInMeters} m (${heightInFeetInches})`;
              pokemonWeight.innerHTML = `<strong>Peso:</strong> ${weightInKg} kg (${weightInLbs})`;

              // Actualiza las estadísticas del Pokémon
              const stats = data.stats.map(statInfo => ({
                  name: capitalizeFirstLetter(statInfo.stat.name),
                  value: statInfo.base_stat
              }));

              stats.forEach(stat => {
                  const statItem = document.createElement('li');
                  statItem.textContent = `${stat.name}: ${stat.value}`;
                  statsList.appendChild(statItem);
              });

              // Crear y mostrar el gráfico de estadísticas usando Chart.js
              const labels = stats.map(stat => stat.name);
              const dataValues = stats.map(stat => stat.value);

              chart = new Chart(statsChart, {
                  type: 'radar',
                  data: {
                      labels: labels,
                      datasets: [{
                          label: `${capitalizeFirstLetter(data.name)} Estadísticas`,
                          data: dataValues,
                          backgroundColor: 'rgba(255, 99, 132, 0.2)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                          borderWidth: 2,
                          pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                      }]
                  },
                  options: {
                      scales: {
                          r: {
                              beginAtZero: true,
                              ticks: {
                                  stepSize: 20
                              },
                              pointLabels: {
                                  color: '#ffffff',
                                  font: {
                                      size: 14
                                  }
                              },
                              angleLines: {
                                  color: 'rgba(255, 255, 255, 0.2)'
                              },
                              grid: {
                                  color: 'rgba(255, 255, 255, 0.1)'
                              }
                          }
                      },
                      plugins: {
                          legend: {
                              display: true,
                              labels: {
                                  color: '#ffffff'
                              }
                          }
                      }
                  }
              });

              statsChart.style.display = 'block'; // Muestra el gráfico

              // Oculta el loader
              loader.style.display = 'none';
          })
          .catch(error => {
              console.error('Error:', error);
              alert("Pokémon no encontrado. Por favor, verifica el nombre o ID.");
              // Opcional: Limpiar la tarjeta si hay un error
              pokemonNameHeader.textContent = "Pokémon:";
              pokemonImage.style.display = 'none';
              pokemonType.innerHTML = "<strong>Tipo:</strong> ";
              pokemonAbilities.innerHTML = "<strong>Habilidades:</strong> ";
              pokemonHeight.innerHTML = "<strong>Altura:</strong> ";
              pokemonWeight.innerHTML = "<strong>Peso:</strong> ";
              statsList.innerHTML = "";
              // Oculta el gráfico y el loader
              statsChart.style.display = 'none';
              loader.style.display = 'none';
          });
  });

  // Permitir buscar al presionar Enter
  pokemonInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
          fetchButton.click();
      }
  });

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
});
