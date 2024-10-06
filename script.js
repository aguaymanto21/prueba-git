// Agrega un evento al botón para obtener datos cuando se hace clic
document.getElementById('fetch-button').addEventListener('click', function() {
  // Realiza una solicitud GET a la API de Pokémon para obtener datos de Bulbasaur
  fetch('https://pokeapi.co/api/v2/pokemon/1/') // Cambia el número para obtener otros Pokémon
      .then(response => {
          // Verifica si la respuesta es válida (código 200)
          if (!response.ok) {
              throw new Error('Error en la red'); // Si no es válido, lanza un error
          }
          return response.json(); // Convierte la respuesta a formato JSON
      })
      .then(data => {
          // Una vez que tenemos los datos, mostramos la información
          const dataDiv = document.getElementById('data');
          const pokemonInfo = `
              <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2> <!-- Nombre del Pokémon -->
              <p>Altura: ${data.height}</p> <!-- Altura del Pokémon -->
              <p>Peso: ${data.weight}</p> <!-- Peso del Pokémon -->
              <p>Tipos: ${data.types.map(type => type.type.name).join(', ')}</p> <!-- Tipos del Pokémon -->
          `;
          dataDiv.innerHTML = pokemonInfo; // Inserta la información en el div de datos
      })
      .catch(error => {
          // Si hay un error en la solicitud, muestra un mensaje de error
          const dataDiv = document.getElementById('data');
          dataDiv.innerHTML = `<p class="error">Hubo un problema: ${error.message}</p>`;
      });
});
