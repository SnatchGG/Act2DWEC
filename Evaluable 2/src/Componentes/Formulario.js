
import { useState, useEffect } from "react";
import { useContext } from "react";
import { validaciones } from "../Contexts/Validaciones";
import { getAllVehiculos } from "./vehiculosServer";

export default function Formulario(props) {

    const accionFormulario = props.accion;
    const coche = props.coche;
    const mensajeBoton = props.mensajeBoton;
    const { validacionChasis, validacionColorMarca } = useContext(validaciones);
    const [listaVehiculos, setListaVehiculos] = useState([]);
    const [numChasis, setNumChasis] = useState(0);
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [color, setColor] = useState("");
    const [potencia, setPotencia] = useState(0);
    const [fechaFabricacion, setFechaFabricacion] = useState("");

    useEffect(() => {
        const listadoVehiculos = async () => {
            const vehiculos = await getAllVehiculos();
            setListaVehiculos(vehiculos);
        };
        listadoVehiculos();
    }, [])

    let fechaActual = new Date();
    let diaActual = fechaActual.getDate();
    let mesActual = fechaActual.getMonth() + 1;
    let anioActual = fechaActual.getFullYear();

    if (diaActual < 10) {
        diaActual = "0" + diaActual;
    }

    if (mesActual < 10) {
        mesActual = "0" + mesActual;
    }

    let fechaMax = anioActual + "-" + mesActual + "-" + diaActual;

    const handleNumChasis = (e) => {
        setNumChasis(e.target.value);
    }

    const handleMarca = (e) => {
        setMarca(e.target.value);
    }

    const handleModelo = (e) => {
        setModelo(e.target.value);
    }

    const handleColor = (e) => {
        setColor(e.target.value);
    }

    const handlePotencia = (e) => {
        setPotencia(e.target.value);
    }

    const handleFechaFabricacion = (e) => {
        setFechaFabricacion(e.target.value);
    }

    let vehiculo = {
        "numChasis": numChasis,
        "marca": marca,
        "modelo": modelo,
        "color": color,
        "potencia": potencia,
        "fechaFabricacion": fechaFabricacion.split("-")[2] + "-" + fechaFabricacion.split("-")[1] + "-" + fechaFabricacion.split("-")[0]
    }

    const comprobacionChasis = (nchasis) => {
        if (listaVehiculos.some(v => v.numChasis === nchasis)) {
            return true;
        }
        else
            return false;
    }

    const [mensajeDatosErroneos, setMensajeDatosErroneos] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!coche) {
            if (!comprobacionChasis(vehiculo.numChasis) && validacionChasis(vehiculo.numChasis) && validacionColorMarca(vehiculo.marca) && validacionColorMarca(vehiculo.color)) {
                console.log("dentro de !coche",vehiculo);
                accionFormulario(vehiculo);
            }
            else {
                if (comprobacionChasis(vehiculo.numChasis))
                    setMensajeDatosErroneos(<div id="erroneo">El chasis ya existe</div>);
                if (!validacionChasis(vehiculo.numChasis))
                    setMensajeDatosErroneos(<div id="erroneo">El chasis solo puede contener números y deben ser 8, no se agrego el vehículo</div>);
                else if (!validacionColorMarca(vehiculo.marca))
                    setMensajeDatosErroneos(<div id="erroneo">La marca solo pueden ser caracteres, no se agrego el vehículo</div>);
                else if (!validacionColorMarca(vehiculo.color))
                    setMensajeDatosErroneos(<div id="erroneo">El color solo pueden ser caracteres, no se agrego el vehículo</div>);
            };
        }
        else {
            if (coche.numChasis == numChasis && validacionChasis(vehiculo.numChasis) && validacionColorMarca(vehiculo.marca) && validacionColorMarca(vehiculo.color)) {
                vehiculo.id = coche.id;
                console.log("dentro de chasis ==",vehiculo);
                accionFormulario(vehiculo);
            }

            else if (coche.numChasis != numChasis && !comprobacionChasis(vehiculo.numChasis) && validacionChasis(vehiculo.numChasis) && validacionColorMarca(vehiculo.marca) && validacionColorMarca(vehiculo.color)) {
                vehiculo.id = coche.id;
                console.log("dentro de chasis !=",vehiculo);
                accionFormulario(vehiculo);
            }

            else {
                if (comprobacionChasis(vehiculo.numChasis))
                    setMensajeDatosErroneos(<div id="erroneo">El chasis ya existe</div>);
                if (!validacionChasis(vehiculo.numChasis))
                    setMensajeDatosErroneos(<div id="erroneo">El chasis solo puede contener números y deben ser 8, no se agrego el vehículo</div>);
                else if (!validacionColorMarca(vehiculo.marca))
                    setMensajeDatosErroneos(<div id="erroneo">La marca solo pueden ser caracteres, no se agrego el vehículo</div>);
                else if (!validacionColorMarca(vehiculo.color))
                    setMensajeDatosErroneos(<div id="erroneo">El color solo pueden ser caracteres, no se agrego el vehículo</div>);
            };
        }
    };

    useEffect(() => {
        if (coche) {
            setNumChasis(coche.numChasis);
            setMarca(coche.marca);
            setModelo(coche.modelo);
            setPotencia(coche.potencia);
            setColor(coche.color);
            setFechaFabricacion(coche.fechaFabricacion.split("-")[2] + "-" + coche.fechaFabricacion.split("-")[1] + "-" + coche.fechaFabricacion.split("-")[0]);
        }
    }, [coche]);

    if (coche === undefined) {
        return (
            <div id="formdiv">
                <form id="form" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Datos del vehículo</legend>
                        <label htmlFor="chasis">Número de chasis</label>
                        <input type="number" id="numChasis" min="1" placeholder="Obligatorio" onChange={handleNumChasis} required ></input>
                        <br></br>
                        <label htmlFor="marca">Marca</label>
                        <input type="text" id="marca" placeholder="Obligatorio" onChange={handleMarca} required></input>
                        <br></br>
                        <label htmlFor="modelo">Modelo</label>
                        <input type="text" id="modelo" placeholder="Obligatorio" onChange={handleModelo} required></input>
                        <br></br>
                        <label htmlFor="color">Color</label>
                        <input type="text" id="color" placeholder="Obligatorio" onChange={handleColor} required></input>
                        <br></br>
                        <label htmlFor="potencia">Potencia</label>
                        <input type="number" id="potencia" placeholder="Obligatorio" min="50" onChange={handlePotencia} required></input>
                        <br></br>
                        <label htmlFor="fecha">Fecha de fabricación</label>
                        <input type="date" id="fechaFabricacion" max={fechaMax} onChange={handleFechaFabricacion} required></input>
                    </fieldset>
                    <button type="submit">{mensajeBoton}</button>
                </form>

                {mensajeDatosErroneos}
            </div>
        )
    }
    else {
        return (
            <div id="formdiv">
                <form id="form" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Datos del vehículo</legend>
                        <label htmlFor="numChasis">Número de chasis</label>
                        <input type="number" id="numChasis" min="1" value={numChasis} onChange={handleNumChasis} required ></input>
                        <br></br>
                        <label htmlFor="marca">Marca</label>
                        <input type="text" id="marca" value={marca} onChange={handleMarca} required></input>
                        <br></br>
                        <label htmlFor="modelo">Modelo</label>
                        <input type="text" id="modelo" value={modelo} onChange={handleModelo} required></input>
                        <br></br>
                        <label htmlFor="color">Color</label>
                        <input type="text" id="color" value={color} onChange={handleColor} required></input>
                        <br></br>
                        <label htmlFor="potencia">Potencia</label>
                        <input type="number" id="potencia" value={potencia} min="50" onChange={handlePotencia} required></input>
                        <br></br>
                        <label htmlFor="fechaFabricacion">Fecha de fabricación</label>
                        <input type="date" id="fechaFabricacion" value={fechaFabricacion} max={fechaMax} onChange={handleFechaFabricacion} required></input>
                    </fieldset>
                    <button type="submit">{mensajeBoton}</button>
                </form>

                {mensajeDatosErroneos}
            </div>
        )
    }
};
