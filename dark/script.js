// Base API
// var base_api = 'https://jhonpresthon.com.ar/api/api.php?';
var base_api = 'http://localhost:8000/api/api.php?';


// Listas locales para almacenar los datos
var listaCategorias = [];
var listaBebidas = [];
var listaComidas = [];

// Función para obtener las bebidas desde la API
function cargarBebidas() {
    fetch(base_api + 'endpoint=bebidas')
        .then(response => response.json())
        .then(bebidas => {
            listaBebidas = bebidas;
            const bebidaLista = document.getElementById('bebida-lista');
            bebidaLista.innerHTML = ''; // Limpiar lista antes de agregar elementos
            bebidas.forEach(bebida => {
                const li = document.createElement('li');
                li.innerHTML = `<h3>${bebida.titulo}</h3>
                               <p>${bebida.descripcion}</p>
                               <p><strong>Precio:</strong> $${bebida.precio}</p>
                               <p><strong>Cantidad disponible:</strong> ${bebida.cantidad}</p>
                               <p><strong>Categoría:</strong> ${bebida.categoria}</p>`;
                bebidaLista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al cargar las bebidas:', error);
        });
}
function cargarCategoriasYComidas() {
    // Primero obtenemos las categorías
    fetch(base_api + 'endpoint=categorias')
        .then(response => response.json())
        .then(categorias => {
            listaCategorias = categorias; // Guardamos las categorías en la lista local

            // Luego, obtenemos las comidas
            return fetch(base_api + 'endpoint=comidas');
        })
        .then(response => response.json())
        .then(comidas => {
            listaComidas = comidas; // Guardamos las comidas en la lista local

            const comidaLista = document.getElementById('comida-lista');
            comidaLista.innerHTML = ''; // Limpiar la lista antes de agregar elementos

            // Recorrer las categorías y mostrar sus comidas
            listaCategorias.forEach(categoria => {
                // Agregar el título de la categoría
                const categoriaTitulo = document.createElement('h2');
                categoriaTitulo.textContent = categoria.nombre;
                comidaLista.appendChild(categoriaTitulo);

                // Filtrar las comidas por la categoría actual
                const comidasDeCategoria = listaComidas.filter(comida => {
                    return parseInt(comida.categoria_id, 10) === parseInt(categoria.id, 10);
                });

                // Si no hay comidas para esta categoría, mostramos un mensaje
                if (comidasDeCategoria.length === 0) {
                    const mensaje = document.createElement('p');
                    mensaje.textContent = 'No hay comidas disponibles para esta categoría.';
                    comidaLista.appendChild(mensaje);
                } else {
                    // Mostrar las comidas de la categoría actual
                    comidasDeCategoria.forEach(comida => {
                        const li = document.createElement('li');
                        li.classList.add('comida-item'); // Aplicar estilo con CSS

                        // Crear una sección inicial con el título y la descripción
                        const contenido = document.createElement('div');
                        contenido.classList.add('comida-contenido'); 
                        contenido.innerHTML = `
                            <h3>${comida.titulo}</h3>
                            <p class="precio-comida"> $${comida.precio}</p>
                        `;

                        // Crear la descripción, inicialmente oculta
                        const descripcion = document.createElement('p');
                        descripcion.textContent = comida.descripcion;
                        descripcion.style.display = 'none'; // Oculta la descripción al inicio

                        // Crear la imagen
                        const imagen = document.createElement('img');
                        imagen.src = comida.imagen;
                        imagen.alt = comida.titulo;
                        imagen.classList.add('comida-imagen'); // Aplicar clase CSS
                        imagen.style.display = 'none'; // Inicialmente la imagen está oculta

                        // Añadir la imagen y el contenido al item de comida
                        li.appendChild(contenido);
                        li.appendChild(descripcion);
                        li.appendChild(imagen);

                        // Agregar el evento de clic para alternar visibilidad
                        li.addEventListener('click', () => {
                            // Alternar visibilidad de la imagen y descripción
                            if (imagen.style.display === 'none') {
                                imagen.style.display = 'block'; // Mostrar imagen
                                descripcion.style.display = 'block'; // Mostrar descripción
                            } else {
                                imagen.style.display = 'none'; // Ocultar imagen
                                descripcion.style.display = 'none'; // Ocultar descripción
                            }
                        });

                        // Añadir el item a la lista
                        comidaLista.appendChild(li);
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías y comidas:', error);
        });
}


// Cargar los datos cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // cargarCategorias();
    cargarCategoriasYComidas();
    cargarBebidas();
});