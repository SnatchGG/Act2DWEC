<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('HTTP/1.1 204 No Content');
    exit;
}
// Ruta del archivo JSON donde se almacenan los vehículos
$filePath = 'vehiculos.json';
// Lee todas los vehículos existentes del fichero
function getAllVehiculos($filePath) {
    if (file_exists($filePath)) {
        $data = file_get_contents($filePath);
        
        // Se decodifica el JSON en un array asociativo
        $retValue = json_decode($data, true);

        // Por si acaso, se verifica que retValue es un array y que no está vacío
        if (is_array($retValue) && !empty($retValue)) {
            // Ahora se ordena por id
            usort($retValue, function ($a, $b) {
                return $a['id'] <=> $b['id']; // Operador de comparación espaciada (<=>)
            });
        }
        // Se devuelve el array ordenado
        return $retValue;
    }    
    // Si el archivo no existe o está vacío, se devuelve un array vacío
    return [];
}
// Obtiene un vehículo por su ID.
 function getVehiculoById($id, $filePath) {
    $vehiculos = getAllVehiculos($filePath);
    // Se usa array_filter con una expresión lambda para filtrar el vehículo por ID
    $vehiculoFiltrado = array_filter($vehiculos, function ($vehiculo) use ($id) {
        return $vehiculo['id'] == $id;
    });
    // Si se encontró el vehículo, se devuelve el primer (y único) elemento del array resultante
    return !empty($vehiculoFiltrado) ? array_values($vehiculoFiltrado)[0] : null;
}


//Crea un nuevo vehículo y la guarda en el archivo JSON.
 function createVehiculo($numChasis, $marca, $modelo, $color, $potencia, $fechaFabricacion, $filePath) {
    $vehiculos = getAllVehiculos($filePath);
    // Genera un nuevo ID único
    $id = isset($vehiculos[count($vehiculos) - 1]['id']) ? $vehiculos[count($vehiculos) - 1]['id'] + 1 : 1;
    // Crea el nuevo vehículo
    $nuevoVehiculo = [
        'id' => $id,
        'numChasis' => $numChasis,
        'marca' => $marca,
        'modelo' => $modelo, 
        'color' => $color,
        'potencia' => $potencia, 
        'fechaFabricacion' => $fechaFabricacion
    ];
    // Agrega el nuevo vehículo al array
    $vehiculos[] = $nuevoVehiculo;
    // Guardar las notas actualizadas en el archivo JSON
    file_put_contents($filePath, json_encode($vehiculos, JSON_PRETTY_PRINT));
    return $nuevoVehiculo;
}
// Actualiza una nota existente por su ID.
 function updateVehiculoById($id, $numChasis, $marca, $modelo, $color, $potencia, $fechaFabricacion, $filePath) {
    $vehiculos = getAllVehiculos($filePath);
   // Se usa array_map con una expresión lambda para actualizar el vehículo si coincide con el ID
   $vehiculoAct = array_map(function ($vehiculo) use ($id, $numChasis, $marca, $modelo, $color, $potencia, $fechaFabricacion) {
    if ($vehiculo['id'] == $id) {
        // Actualizamos los campos del vehículo
        return [
            'id' => $id,
            'numChasis' => $numChasis,
            'marca' => $marca,
            'modelo' => $modelo, 
            'color' => $color,
            'potencia' => $potencia, 
            'fechaFabricacion' => $fechaFabricacion
        ];
    }
    return $vehiculo; // Si no coincide el ID, se deja el vehículo sin cambios
}, $vehiculos);
    // Guarda los vehículos actualizados en el archivo JSON
    file_put_contents($filePath, json_encode($vehiculoAct, JSON_PRETTY_PRINT));
    return getVehiculoById($id, $filePath);
}
// Elimina un vehículo por ID
 function deleteVehiculoById($id, $filePath) {
    $vehiculos = getAllVehiculos($filePath);
    // Deja todos los vehículos excepto el del ID dado
    $vehiculosFiltrados = array_filter($vehiculos, function ($vehiculo) use ($id) {
        return $vehiculo['id'] != $id;
    });



    // Guarda las notas actualizadas en el archivo JSON
    file_put_contents($filePath, json_encode(array_values($vehiculosFiltrados), JSON_PRETTY_PRINT));
    return ['message' => "Vehículo con ID $id eliminado correctamente."];
}


// Procesa las solicitudes según el método HTTP
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $vehiculo = getVehiculoById($id, $filePath);
            echo json_encode($vehiculo ?: ['error' => "No se encontró ningún vehículo con ID $id."]);
        } else {
            $vehiculos = getAllVehiculos($filePath);
            echo json_encode($vehiculos);
        }
        break;
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $numChasis = $input['numChasis'];
        $marca = $input['marca']; 
        $modelo = $input['modelo'];
        $color = $input['color'];
        $potencia = $input['potencia'];
        $fechaFabricacion = $input['fechaFabricacion'];
        if (isset($numChasis) && isset($marca) && isset($modelo) && isset($color) && isset($potencia) && isset($fechaFabricacion))
        {
            $nuevoVehiculo = createVehiculo($numChasis, $marca, $modelo, $color, $potencia, $fechaFabricacion, $filePath);
            http_response_code(201); // Código de creación exitosa
            echo json_encode($nuevoVehiculo);
        } else {
            http_response_code(400); // Código de error: solicitud incorrecta
            echo json_encode(['error' => 'Datos incompletos para crear el vehículo.']);
        }
        break;
    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'];
        $numChasis = $input['numChasis'];
        $marca = $input['marca']; 
        $modelo = $input['modelo'];
        $color = $input['color'];
        $potencia = $input['potencia'];
        $fechaFabricacion = $input['fechaFabricacion'];
        if (isset($id) && isset($numChasis) && isset($marca) && isset($modelo) && isset($color) && isset($potencia) && isset($fechaFabricacion)){
            $actualizado = updateVehiculoById($id, $numChasis, $marca, $modelo, $color, $potencia, $fechaFabricacion, $filePath);
            echo json_encode($actualizado);
        } else {
            http_response_code(400); // Código de error: solicitud incorrecta
            echo json_encode(['error' => 'Datos incompletos para actualizar el vehículo.']);
        }
        break;

    case 'DELETE':
        $input = json_decode(file_get_contents('php://input'), true);
        if (isset($input['id'])) {
            $resultado = deleteVehiculoById($input['id'], $filePath);
            echo json_encode($resultado);
        } else {
            http_response_code(400); // Código de error: solicitud incorrecta
            echo json_encode(['error' => 'ID de vehículo a eliminar no proporcionado.']);
        }
        break;

    default:
        http_response_code(405); // Método no permitido
        echo json_encode(['error' => 'Método no permitido.']);
}
?>
