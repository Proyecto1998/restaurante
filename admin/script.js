// script.js

// Función para obtener las categorías desde la API
// var base_api='https://jhonpresthon.com.ar/api/api.php?';
var base_api = 'http://localhost:8000/api/api.php?';


async function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // Elimina el prefijo
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}


// Manejador para el formulario de comidas
document.getElementById('formComidas').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('imagenComida');
    const file = fileInput.files[0];
    if (!file) {
        alert("Debe seleccionar una imagen.");
        return;
    }

    try {
        const base64Imagen = await convertirImagenABase64(file);
        const data = {
            titulo: document.getElementById('tituloComida').value,
            descripcion: document.getElementById('descripcionComida').value,
            precio: document.getElementById('precioComida').value,
            imagen: base64Imagen,
            categoria_id: document.getElementById('categoriaComida').value,
        };

        console.log("Datos enviados:", JSON.stringify(data, null, 2)); // Depuración

        fetch(base_api+'endpoint=comidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => alert(data.message || data.error))
        .catch(error => console.error('Error:', error));
    } catch (error) {
        alert('Error al procesar la imagen.');
    }
});

// Manejador para el formulario de bebidas
document.getElementById('formBebidas').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('imagenBebida');
    const file = fileInput.files[0];
    if (!file) {
        alert("Debe seleccionar una imagen.");
        return;
    }

    try {
        const base64Imagen = await convertirImagenABase64(file);
        const data = {
            titulo: document.getElementById('tituloBebida').value,
            descripcion: document.getElementById('descripcionBebida').value,
            precio: document.getElementById('precioBebida').value,
            imagen: base64Imagen,
            cantidad: document.getElementById('cantidadBebida').value,
        };

        fetch(base_api+'endpoint=bebidas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => alert(data.message || data.error))
        .catch(error => alert('Error:'+error));
    } catch (error) {
        alert('Error al procesar la imagen.');
    }
});



function cargarCategorias() {
    fetch(base_api+'endpoint=categorias')
        .then(response => response.json())
        .then(categorias => {
            const categoriaSelect = document.getElementById('categoriaComida');
            categoriaSelect.innerHTML = ''; // Limpiar opciones previas

            // Agregar la opción por defecto
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecciona una categoría';
            categoriaSelect.appendChild(optionDefault);

            // Agregar las opciones de categorías obtenidas de la API
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;  // Usar el ID de la categoría
                option.textContent = categoria.nombre;  // Usar el nombre de la categoría
                categoriaSelect.appendChild(option);
            });

            const categoriaLista = document.getElementById('categoria-lista');
            categoriaLista.innerHTML = ''; // Limpiar lista antes de agregar elementos

            categorias.forEach(categoria => {
                const li = document.createElement('li');
                li.textContent = categoria.nombre;
                categoriaLista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });
}

// Función para obtener las bebidas desde la API
function cargarBebidas() {
    fetch(base_api+'endpoint=bebidas')
        .then(response => response.json())
        .then(bebidas => {
            const bebidaLista = document.getElementById('bebida-lista');
            bebidaLista.innerHTML = ''; // Limpiar lista antes de agregar elementos
            bebidas.forEach(bebida => {
                const li = document.createElement('li');
                li.innerHTML = `<h3>${bebida.titulo}</h3>
                               <p>${bebida.descripcion}</p>
                               <p><strong>Precio:</strong> $${bebida.precio}</p>
                               <p><strong>Cantidad disponible:</strong> ${bebida.cantidad}</p>`;
                bebidaLista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al cargar las bebidas:', error);
        });
}
function cargarComidas() {
    fetch(base_api+'endpoint=comidas')
        .then(response => response.json())
        .then(comidas => {
            const comidaLista = document.getElementById('comida-lista');
            comidaLista.innerHTML = ''; // Limpiar lista antes de agregar elementos

            comidas.forEach(comida => {
                const li = document.createElement('li');
                li.innerHTML = `
                     <img src="${comida.imagen}" alt="${comida.titulo}" style="max-width: 200px; max-height: 200px;">
                    <h3>${comida.titulo}</h3>
                    <p>${comida.descripcion}</p>
                    <p><strong>Precio:</strong> $${comida.precio}</p>
                    <p><strong>Categoría:</strong> ${comida.categoria}</p>`;
                comidaLista.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error al cargar las comidas:', error);
        });
}


    

// Cargar los datos cuando la página se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarComidas();
    cargarBebidas();
});