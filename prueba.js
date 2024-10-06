let persona = [{
    nombre: "pan",
    edad: "59",
    localidad:"japón"
}]

localStorage.setItem(`consultar`, JSON.stringify(persona))

console.log(localStorage.getItem(`consultar`))