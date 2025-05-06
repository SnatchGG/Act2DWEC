import { getAllVehiculos, getVehiculoById, updateVehiculoById, deleteVehiculoById } from "./vehiculosServer";
import { useState, useEffect } from "react";
import Formulario from "./Formulario";

function Consulta() {

    const [listaVehiculos, setListaVehiculos] = useState([]);
    const [listaMarcas, setListaMarcas] = useState([]);
    const [pmedia, setP] = useState(0);
    const [pmin, setPmin] = useState(0);
    const [pmax, setPmax] = useState(0);
    const [coche, setCoche] = useState({
        numChasis: 1,
        marca: "Actualizar",
        modelo: "Actualizar",
        color: "Actualizar",
        potencia: 50,
        fechaFabricacion: ""
    });

    let valor = "";

    const handleValor = (e) => {
        let media = 0;
        let max = 0;
        let min = Number.MAX_VALUE;
        let listaV = [];

        valor = e.target.value;

        listaVehiculos.forEach(v => {
            if (v.marca == valor) {
                listaV.push(v);
            }

            else if (valor == "Todos") {
                listaV = listaVehiculos;
            }
        })

        listaV.forEach(v => {
            media += parseInt(v.potencia);

            if (v.potencia > max) {
                max = parseInt(v.potencia);
            }

            if (v.potencia < min) {
                min = parseInt(v.potencia);
            }
        })

        setP(media / listaV.length);
        setPmax(max);
        setPmin(min);
    }

    const handleSubmit = async (v) => {
        const r = await updateVehiculoById(v);
    }

    useEffect(() => {
        const listadoVehiculos = async () => {
            const vehiculos = await getAllVehiculos();
            setListaVehiculos(vehiculos);
        };
        listadoVehiculos();
    }, []);

    useEffect(() => {
        let potenciaMedia = 0;
        let potenciaMax = 0;
        let potenciaMin = Number.MAX_VALUE;
        let listaMarc = [];

        listaMarc.push("Todos");

        listaVehiculos.forEach(e => {
            listaMarc.push(e.marca);

            potenciaMedia += parseInt(e.potencia);

            if (e.potencia > potenciaMax) {
                potenciaMax = parseInt(e.potencia);
            }

            if (e.potencia < potenciaMin) {
                potenciaMin = parseInt(e.potencia);
            }
        });

        if (listaVehiculos.length > 0) {
            setP(potenciaMedia / listaVehiculos.length);
        }

        setPmax(potenciaMax);
        setPmin(potenciaMin);

        //-----Creando lista de marcas:

        let listasFiltrada = [... new Set(listaMarc)];
        setListaMarcas(listasFiltrada);

    }, [listaVehiculos])


    const actualizar = async (cocheID) => {
        const respuestaVehiculo = await getVehiculoById(cocheID);
        setCoche(respuestaVehiculo);
    }


    const tr = listaVehiculos.map(v => {
        return (
            <tr key={v.id}>
                <td>{v.numChasis}</td>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.color}</td>
                <td>{v.potencia}</td>
                <td>{v.fechaFabricacion}</td>
                <td><button onClick={() => actualizar(v.id)}>Actualizar</button> <button onClick={() => deleteVehiculoById(v.id)}>Eliminar</button></td>
            </tr>
        )
    }
    );


    if(listaVehiculos.length != 0){
        return(
            <div id="contenedorConsultaFormulario">
            <div id='tabla'>
                <table>
                    <thead>
                        <tr>
                            <th>Chasis</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Color</th>
                            <th>Potencia</th>
                            <th>FechaFabricación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tr}
                    </tbody>
                </table>
            </div>

            <Formulario accion={handleSubmit} coche={coche} mensajeBoton="Actualizar vehículo"></Formulario>

            <div className="potencia">
                <h3>Consulta potencia</h3>
                <div className="select">
                    <select>
                        {listaMarcas.map(m => (
                            <option key={m} value={m} onClick={handleValor}>{m}</option>
                        ))}
                    </select>
                </div>
                {pmedia > 0 ? <p>Potencia media: {pmedia}</p> : null}
                {pmin > 0 && pmin != Number.MAX_VALUE ? <p>Potencia mínima: {pmin}</p> : null}
                {pmax > 0 ? <p>Potencia máxima: {pmax}</p> : null}
            </div>
        </div>
        )
    }
    else{
        return (<div id="vacio">NO HAY VEHÍCULOS</div>)
    }
       
};

export default Consulta;