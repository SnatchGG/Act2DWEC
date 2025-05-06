import { createContext } from "react";

export const validaciones = createContext();

function ValidacionesProvider(props) {

  const regexChasis = /^\d{8}$/;
  const regexColorMarca = /^[A-Za-z]+$/;

  function validacionChasis(inputFormularioChasis) {
    const expresionchasis = new RegExp(regexChasis);
    return expresionchasis.test(inputFormularioChasis);
  };

  function validacionColorMarca(inputFormularioColorMarca) {
    const expresionCM = new RegExp(regexColorMarca);
    return expresionCM.test(inputFormularioColorMarca);
  };

  return (
    <validaciones.Provider value={{ validacionChasis, validacionColorMarca }}>
      {props.children}
    </validaciones.Provider>
  )
}

export default ValidacionesProvider;