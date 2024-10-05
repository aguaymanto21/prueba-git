$(document).ready(function() {
  // Número de tarjetas por página
  var itemsPerPage = 3; // Cambia este valor según tus necesidades

  // Selecciona todos los elementos de tarjeta
  var items = $('.custom-skill-item');
  var numItems = items.length;

  // Oculta todas las tarjetas inicialmente
  items.hide();

  // Inicializa la paginación sin los botones "Anterior" y "Siguiente"
  $('#pagination-container').pagination({
    items: numItems,
    itemsOnPage: itemsPerPage,
    cssStyle: '',
    // Removemos el texto de "Anterior" y "Siguiente" estableciendo las cadenas vacías
    prevText: '',
    nextText: '',
    // Opciones para ocultar los botones "Anterior" y "Siguiente"
    useAnchors: false,
    displayedPages: 2, // Número de páginas a mostrar (en tu caso, 2)
    edges: 0, // Número de páginas de borde (al principio y al final)
    onPageClick: function(pageNumber) {
      // Calcula los índices inicial y final de las tarjetas a mostrar
      var showFrom = (pageNumber - 1) * itemsPerPage;
      var showTo = showFrom + itemsPerPage;

      // Oculta todas las tarjetas y muestra solo las correspondientes a la página actual
      items.hide().slice(showFrom, showTo).show();
    }
  });

  // Muestra las primeras tarjetas al cargar la página
  items.slice(0, itemsPerPage).show();
});
