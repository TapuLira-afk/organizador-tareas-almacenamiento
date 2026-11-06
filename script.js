const pendientes = document.querySelector("#pendientes")
const proceso = document.querySelector("#proceso")
const completadas = document.querySelector("#completadas")
const mensaje = document.querySelector("#mensaje")
const countPendientes = document.querySelector("#contador-pendientes")
const countProceso = document.querySelector("#contador-proceso")
const countCompletadas = document.querySelector("#contador-completadas")
const porcentaje = document.querySelector("#porcentaje")
const barraProgreso = document.querySelector("#barra-progreso")


export class tarea {
    dataId;
    contenido;

    constructor(dataId, contenido) {
        this.dataId = dataId;
        this.contenido = contenido;
    }
}

const opcionesComunes = {
    group: 'shared',
    animation: 150,

    // // Se dispara SOLO cuando un ítem ENTRA en esta lista desde otra
    // onAdd(event) {

    // },

    // // Se dispara SOLO cuando un ítem SALE de esta lista hacia otra
    // onRemove(event) {

    // },

    // onSort() { },


    // Se dispara SIEMPRE (reordenar dentro de la lista o mover a otra)
    onEnd(event) {
        mensaje.textContent = `Tarea "${event.item.textContent}" movida. Columna en la que se encuentra "${event.to.dataset.estado}"`
        actualizarContadores()
        guardarTablero()
    }
};

new Sortable(pendientes, opcionesComunes);

new Sortable(proceso, opcionesComunes);

new Sortable(completadas, opcionesComunes);

function actualizarContadores() {
    countPendientes.textContent = pendientes.children.length
    countProceso.textContent = proceso.children.length
    countCompletadas.textContent = completadas.children.length

    let totalTareas = pendientes.children.length + proceso.children.length + completadas.children.length

    let porcentajeTareas = (completadas.children.length / totalTareas) * 100

    porcentaje.textContent = `${Math.round(porcentajeTareas)}%`
    barraProgreso.style.width = `${Math.round(porcentajeTareas)}%`
}

function convertirObjeto(element) {
    return new tarea(element.getAttribute("data-id"), element.textContent)
}

function guardarTareas(columna) {
    const id = columna.getAttribute('id')

    const elementsColumna = columna.querySelectorAll(".tarea");

    let arrayTareas = [];

    elementsColumna.forEach(element => {
        arrayTareas.push(convertirObjeto(element))
    });

    localStorage.setItem(id, JSON.stringify(arrayTareas));
}

function guardarTablero() {
    guardarTareas(pendientes)
    guardarTareas(proceso)
    guardarTareas(completadas)
}

function convertirTarea(tarea) {
    let elementLi = document.createElement('li')
    elementLi.setAttribute("class", "tarea");
    elementLi.setAttribute("data-id", tarea.dataId);
    elementLi.textContent = tarea.contenido

    return elementLi
}

function cargarColumna(columna) {
    const columnaClonada = columna.cloneNode(false)
    const id = columna.getAttribute('id')
    const columnaElement = JSON.parse(localStorage.getItem(id))

    columnaElement.forEach(element => {
        columnaClonada.append(convertirTarea(element))
    });

    columna.innerHTML = columnaClonada.innerHTML
}

function cargarTablero() {
    cargarColumna(pendientes)
    cargarColumna(proceso)
    cargarColumna(completadas)
}

cargarTablero()
actualizarContadores()
