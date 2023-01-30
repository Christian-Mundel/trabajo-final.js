const formulario = document.getElementById('ingreso-pasajero');
const mensajeError = document.getElementById('mensaje-error');
const tabla = document.getElementById('tabla');
const pasajerosDelLocalStorage = JSON.parse(localStorage.getItem('pasajeros')) || [];
const pasajeros = pasajerosDelLocalStorage.map((pasajero) => {
    return new Pasajero(pasajero);
});

const agregarFilaALaTabla = ({ nombre, apellido, edad, dni }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${edad}</td>
        <td>${dni}</td>
    `;
    
    const botonera = document.createElement('td');
    botonera.innerHTML = '<button class="btn btn-danger mb-3">ELIMINAR</button>';
    botonera.addEventListener('click', () => {
        const pasajeroEcontrado = pasajeros.find((elemento) => elemento.nombre === nombre);
        const indice = pasajeros.indexOf(pasajeroEcontrado);
        pasajeros.splice(indice, 1);
        localStorage.setItem('pasajeros', JSON.stringify(pasajeros));
        tr.remove();
    });

    tr.append(botonera);

    tabla.append(tr);
}

pasajeros.forEach((pasajero) => {
    agregarFilaALaTabla(pasajero);
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const pasajero = new Pasajero({
    nombre: e.target[0].value,
    apellido: e.target[1].value,
    edad: e.target[2].value,
    dni: e.target[3].value,
    });

    if (!pasajero.soyMayorDeEdad()) {
    mensajeError.innerText = 'Tienes que ser mayor de 18 años o traer una autorizacion ante escribano publico';
    return;
    }

    pasajeros.push(pasajero);
    localStorage.setItem('pasajeros', JSON.stringify(pasajeros));

    agregarFilaALaTabla(pasajero);

    for(const input of e.target) {
    input.value = '';
    }
});