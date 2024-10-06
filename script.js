document.getElementById('fetch-button').addEventListener('click', function() {
  const pokemonInput = document.getElementById('pokemon-input').value.trim(); // Obtiene el valor ingresado por el usuario

  if (!pokemonInput) {
      alert('Por favor, ingresa un nombre o ID de Pokémon.'); // Mensaje de advertencia si el campo está vacío
      return;
  }

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInput}/`) // Usar el valor ingresado en la URL
      .then(response => {
          if (!response.ok) {
              throw new Error('Pokémon no encontrado'); // Maneja el error si el Pokémon no se encuentra
          }
          return response.json();
      })
      .then(data => {
          const dataDiv = document.getElementById('data');
          const pokemonInfo = `
              <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
              <p>Altura: ${data.height}</p>
              <p>Peso: ${data.weight}</p>
              <p>Tipos: ${data.types.map(type => type.type.name).join(', ')}</p>
          `;
          dataDiv.innerHTML = pokemonInfo; // Muestra la información del Pokémon
      })
      .catch(error => {
          const dataDiv = document.getElementById('data');
          dataDiv.innerHTML = `<p class="error">Hubo un problema: ${error.message}</p>`; // Muestra un mensaje de error
      });
});
