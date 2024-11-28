// Base API
// let base_api = 'https://jhonpresthon.com.ar/api/api.php?';
let base_api = 'http://localhost/resto/api/api.php?';


// Listas locales para almacenar los datos
let listaCategorias = [];
let listaBebidas = [];
let listaComidas = [];

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
                               <p> $${bebida.precio}</p>
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

                // Aquí se realiza la comparación con parseInt()
                const comidasDeCategoria = listaComidas.filter(comida => {
                    return parseInt(comida.categoria_id, 10) === parseInt(categoria.id, 10);
                });

                // // Filtrar las comidas por la categoría actual
                // const comidasDeCategoria = listaComidas.filter(comida => comida.categoria_id === categoria.id);

                // Si no hay comidas para esta categoría, mostramos un mensaje
                if (comidasDeCategoria.length === 0) {
                    const mensaje = document.createElement('p');
                    mensaje.textContent = 'No hay comidas disponibles para esta categoría.';
                    comidaLista.appendChild(mensaje);
                } else {
                    // Mostrar las comidas de la categoría actual
                    comidasDeCategoria.forEach(comida => {
                        const li = document.createElement('li');
                        li.classList.add('comida-item'); // Para aplicar estilos si es necesario

                        // Crear una sección inicial con el título y la descripción
                        const contenido = document.createElement('div');
                        contenido.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin: 1em;`;
                        contenido.innerHTML = `
                            <h3>${comida.titulo}</h3>
                            <p><strong>$${comida.precio}</strong></p>
                        `;
                         // Crear la descripción, pero inicialmente también la ocultamos con CSS
                         const descripcion = document.createElement('p');
                         descripcion.textContent = comida.descripcion;
                         descripcion.style.display = 'none'; // I

                        // Crear la imagen, pero inicialmente la ocultamos con CSS
                        const imagen = document.createElement('img');
                        imagen.src = comida.imagen;
                        imagen.alt = comida.titulo;
                        imagen.style.maxWidth = '200px';
                        imagen.style.maxHeight = '200px';
                        imagen.style.display = 'none'; // Inicialmente la imagen está oculta

                        // Añadir la imagen y el contenido al item de comida
                        
                        li.appendChild(contenido);
                        li.appendChild(descripcion);
                        li.appendChild(imagen);


                        // Agregar el evento de click para alternar la visibilidad de la imagen
                        li.addEventListener('click', () => {
                            // Alternar la visibilidad de la imagen
                            if (imagen.style.display === 'none') {
                                imagen.style.display = 'block'; // Mostrar la imagen
                            } else {
                                imagen.style.display = 'none'; // Ocultar la imagen
                            }
                            // Alternar la visibilidad de la imagen
                            if (descripcion.style.display === 'none') {
                                descripcion.style.display = 'block'; // Mostrar la imagen
                            } else {
                                descripcion.style.display = 'none'; // Ocultar la imagen
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
