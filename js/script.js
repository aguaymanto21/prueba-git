$(document).ready(function() {
  // Número de cards por página
  var itemsPerPage = 3;

  // Selecciona todos los elementos de card
  var items = $('.custom-card');
  var numItems = items.length;

  // Oculta todos los items inicialmente
  items.hide();

  // Inicializa la paginación
  $('#pagination-container').pagination({
      items: numItems,
      itemsOnPage: itemsPerPage,
      cssStyle: 'light-theme',
      prevText: 'Anterior',
      nextText: 'Siguiente',
      onPageClick: function(pageNumber) {
          // Calcula los índices inicial y final de los items a mostrar
          var showFrom = (pageNumber - 1) * itemsPerPage;
          var showTo = showFrom + itemsPerPage;

          // Oculta todos los items y muestra solo los correspondientes a la página actual
          items.hide().slice(showFrom, showTo).show();
      }
  });

  // Muestra los primeros items al cargar la página
  items.slice(0, itemsPerPage).show();
});
