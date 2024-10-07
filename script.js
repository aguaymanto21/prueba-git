// script.js

document.addEventListener('DOMContentLoaded', function() {
  const fetchButton = document.getElementById('fetch-button');
  const pokemonInput = document.getElementById('pokemon-input');
  const pokemonNameHeader = document.getElementById('pokemon-name');
  const pokemonImage = document.getElementById('pokemon-image');
  const pokemonType = document.getElementById('pokemon-type');

  fetchButton.addEventListener('click', function() {
      const pokemonName = pokemonInput.value.trim().toLowerCase();

      if (pokemonName === "") {
          alert("Por favor, ingresa el nombre o ID del Pokémon.");
          return;
      }

      // Actualiza el <h1> con el nombre ingresado
      pokemonNameHeader.textContent = `Pokémon: ${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}`;

      // Limpia el contenido previo
      pokemonImage.style.display = 'none';
      pokemonImage.src = '';
      pokemonType.textContent = "Tipo:";

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
              if (data.sprites && data.sprites.front_default) {
                  pokemonImage.src = data.sprites.front_default;
                  pokemonImage.style.display = 'block'; // Muestra la imagen
                  pokemonImage.alt = `Imagen de ${data.name}`;
              } else {
                  pokemonImage.style.display = 'none'; // Oculta la imagen si no existe
              }

              // Actualiza el tipo del Pokémon
              const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
              pokemonType.textContent = `Tipo: ${types.charAt(0).toUpperCase() + types.slice(1)}`;
          })
          .catch(error => {
              console.error('Error:', error);
              alert("Pokémon no encontrado. Por favor, verifica el nombre o ID.");
              // Opcional: Limpiar la tarjeta si hay un error
              pokemonImage.style.display = 'none';
              pokemonType.textContent = "Tipo:";
              pokemonNameHeader.textContent = "Hola, soy el Pokémon:";
          });
  });

  // Permitir buscar al presionar Enter
  pokemonInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
          fetchButton.click();
      }
  });
});
