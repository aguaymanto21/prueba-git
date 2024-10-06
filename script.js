document.getElementById('fetch-button').addEventListener('click', function() {
  fetch('https://jsonplaceholder.typicode.com/posts') // API de ejemplo
      .then(response => {
          if (!response.ok) {
              throw new Error('Error en la red');
          }
          return response.json();
      })
      .then(data => {
          const dataDiv = document.getElementById('data');
          dataDiv.innerHTML = JSON.stringify(data, null, 2); // Mostrar datos en formato JSON
      })
      .catch(error => {
          const dataDiv = document.getElementById('data');
          dataDiv.innerHTML = `<p class="error">Hubo un problema: ${error.message}</p>`;
      });
});
