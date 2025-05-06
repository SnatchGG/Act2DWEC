import { useState } from "react";
import Consulta from "./Consulta";
import Alta from "./Alta";

export default function Menu() {

    const [formVisible, setFormVisible] = useState(null);

    const handleForm = () => {
        setFormVisible(true)
    }

    const handleConsultar = () => {
        setFormVisible(false)
    }

    //Cuando se agrega un vehículo pasa a la pantalla de consulta para comprobar los datos. Se deja de esta manera en caso de querer corregir algún dato o eliminarlo.
    
    return (
        <>
            <div id='menu'>
                <div onClick={handleForm}>Alta</div>
                <div onClick={handleConsultar}>Consultar</div>
            </div>

            {formVisible == true ? <Alta></Alta> : <Consulta></Consulta>}
        </>
    )
}
