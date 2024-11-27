<?php
// api.php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Incluir configuración de los archivos JSON
require_once 'config.php';

// Función para leer el contenido de un archivo JSON y devolverlo como array
function leerArchivo($archivo) {
    if (!file_exists($archivo)) {
        return [];
    }
    $contenido = file_get_contents($archivo);
    return json_decode($contenido, true);
}

// Función para escribir un array en un archivo JSON
function escribirArchivo($archivo, $data) {
    $contenido = json_encode($data, JSON_PRETTY_PRINT);
    file_put_contents($archivo, $contenido);
}

// Obtener las categorías
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'categorias') {
    echo json_encode(leerArchivo(CATEGORIAS_FILE));
}

// Obtener todas las comidas
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'comidas') {
    echo json_encode(leerArchivo(COMIDAS_FILE));
}

// Obtener una comida por ID
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'comidas' && isset($_GET['id'])) {
    $comidas = leerArchivo(COMIDAS_FILE);
    $id = $_GET['id'];
    $comida = array_filter($comidas, function ($comida) use ($id) {
        return $comida['id'] == $id;
    });
    echo json_encode(array_values($comida)[0] ?? null);
}

// Obtener todas las bebidas
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'bebidas') {
    echo json_encode(leerArchivo(BEBIDAS_FILE));
}

// Obtener una bebida por ID
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'bebidas' && isset($_GET['id'])) {
    $bebidas = leerArchivo(BEBIDAS_FILE);
    $id = $_GET['id'];
    $bebida = array_filter($bebidas, function ($bebida) use ($id) {
        return $bebida['id'] == $id;
    });
    echo json_encode(array_values($bebida)[0] ?? null);
}
// Ruta base para guardar las imágenes
define('UPLOAD_DIR', __DIR__ . '/uploads/');
// define('BASE_URL', 'https://jhonpresthon.com.ar/uploads/');
define('BASE_URL', 'http://localhost:8000/uploads/');


// Crear la carpeta de uploads si no existe
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0777, true);
}


// Agregar una comida
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'comidas') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['titulo'], $data['descripcion'], $data['precio'], $data['imagen'], $data['categoria_id'])) {
        // Decodificar la imagen Base64 y guardarla como un archivo físico
        $base64Data = $data['imagen'];
        $imageData = base64_decode($base64Data);
        
        // Generar un nombre único para la imagen
        $imageName = uniqid('img_', true) . '.jpg'; // Cambia la extensión según el formato esperado
        
        // Guardar la imagen en el servidor
        $imagePath = UPLOAD_DIR . $imageName;
        if (file_put_contents($imagePath, $imageData) === false) {
            echo json_encode(['error' => 'No se pudo guardar la imagen']);
            exit;
        }
        
        // Generar la URL de la imagen
        $imageUrl = BASE_URL . $imageName;
        
        // Actualizar el campo 'imagen' en los datos
        $data['imagen'] = $imageUrl;
        
        // Leer el archivo JSON y agregar la nueva comida
        $comidas = leerArchivo(COMIDAS_FILE);
        $nuevoId = count($comidas) + 1;
        $data['id'] = $nuevoId;
        $comidas[] = $data;
        escribirArchivo(COMIDAS_FILE, $comidas);
        
        echo json_encode(['message' => 'Comida agregada correctamente', 'url_imagen' => $imageUrl]);
    } else {
        echo json_encode(['error' => 'Faltan parámetros']);
    }
}

// Agregar una bebida
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_GET['endpoint']) && $_GET['endpoint'] == 'bebidas') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['titulo'], $data['descripcion'], $data['precio'], $data['imagen'], $data['cantidad'])) {
           // Decodificar la imagen Base64 y guardarla como un archivo físico
           $base64Data = $data['imagen'];
           $imageData = base64_decode($base64Data);
           
           // Generar un nombre único para la imagen
           $imageName = uniqid('img_', true) . '.jpg'; // Cambia la extensión según el formato esperado
           
           // Guardar la imagen en el servidor
           $imagePath = UPLOAD_DIR . $imageName;
           if (file_put_contents($imagePath, $imageData) === false) {
               echo json_encode(['error' => 'No se pudo guardar la imagen']);
               exit;
           }
           
           // Generar la URL de la imagen
           $imageUrl = BASE_URL . $imageName;
           
           // Actualizar el campo 'imagen' en los datos
           $data['imagen'] = $imageUrl;
           
           // Leer el archivo JSON y agregar la nueva comida
        $bebidas = leerArchivo(BEBIDAS_FILE);
        $nuevoId = count($bebidas) + 1;
        $data['id'] = $nuevoId;
        $bebidas[] = $data;
        escribirArchivo(BEBIDAS_FILE, $bebidas);
        echo json_encode(['message' => 'Bebida agregada correctamente']);
    } else {
        echo json_encode(['error' => 'Faltan parámetros']);
    }
}
?>