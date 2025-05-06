import { createVehiculo } from "./vehiculosServer";
import Formulario from "./Formulario";

export default function Alta() {

    const handleSubmit = async (v) => {
        let r = await createVehiculo(v);
        console.log(r);
    }

    return (
        <div id="formdiv">
            <Formulario accion={handleSubmit} mensajeBoton="Dar de alta" ></Formulario>
        </div>
    )
};
