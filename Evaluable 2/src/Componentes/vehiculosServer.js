const url = "http://localhost:8000/vehiculos.php";

//Se obtienen todos los vehiculos

export const getAllVehiculos = async () => {
    const mensajeError = "Hubo un error al mostrar todos los vehículos";

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(mensajeError);
        return await respuesta.json();
    }
    catch (error) {
        console.error(mensajeError, error);
        return [];
    }
};


//Se obtiene el vehiculo con un id determinado

export const getVehiculoById = async (idVehiculo) => {
    const mensajeError = `No existe el vehículo con dicho id ${idVehiculo}`;

    try {
        const respuesta = await fetch(`${url}?id=${idVehiculo}`);
        if (!respuesta.ok) throw new Error(mensajeError);
        return await respuesta.json();
    }
    catch (error) {
        console.error(mensajeError, error);
        return null;
    }
};


//Se añade un vehiculo nuevo al JSON


export const createVehiculo = async (nuevoVehiculo) => {
    const initObject = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(nuevoVehiculo),
    };

    const mensajeError = "Error al crear el vehículo";

    try {
        const respuesta = await fetch(url, initObject);
        if (!respuesta.ok) throw new Error(mensajeError);
        return await respuesta.json();
    }
    catch (error) {
        console.error(mensajeError, error);
        return null;
    }
};


//Actualizar datos vehiculo

export const updateVehiculoById = async (actVehiculo) => {
    const initObject = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify(actVehiculo),
    };

    const mensajeError = "Error al actualizar los datos";

    try {
        const respuesta = await fetch(url, initObject);
        if (!respuesta.ok) throw new Error(mensajeError);
        return await respuesta.json();
    }
    catch (error) {
        console.error(mensajeError, error);
        return null;
    }
};


//Dar de baja vehiculo 

export const deleteVehiculoById = async (idVehiculo) => {
    const initObject = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        body: JSON.stringify({ id: idVehiculo }),
    };

    const mensajeError = "Error al eliminar el vehículo";

    try {
        const respuesta = await fetch(url, initObject);
        if (!respuesta.ok) throw new Error(mensajeError);
        return true;
    } catch (error) {
        console.error(mensajeError, error);
        return false;
    }
};
