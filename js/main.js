const formulario = document.getElementById('ingreso-pasajero');
const tabla = document.getElementById('tabla');
let pasajeros = [];
let lugaresDePasajeros = [];

const obtenerLugares = async () => {
    const response = await fetch('./lugares.json');
    const data = await response.json();

    lugaresDePasajeros = data;

    document.getElementById('destino').innerHTML = data
    .map(({ id, destino }) => `<option value="${id}">${destino}</option>`)
    .join();
}

obtenerLugares();

const llamadaAlServidor = new Promise((resolve, reject) => {
    setTimeout(() => {
        const pasajerosDelLocalStorage = JSON.parse(localStorage.getItem('pasajeros')) || [];
        const storagePasajeros = pasajerosDelLocalStorage.map((pasajero) => {
            return new Pasajero(pasajero);
});

        pasajeros = storagePasajeros;

        resolve(storagePasajeros);
    }, 2000);
});

const agregarFilaALaTabla = ({ nombre, apellido, edad, destino, dni }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${edad}</td>
        <td>${lugaresDePasajeros.find(destinoDePasajero => destinoDePasajero.id === destino)?.apellido}</td>
        <td>${dni}</td>
    `;
    
    const botonera = document.createElement('td');
    botonera.innerHTML = '<button class="btn btn-danger mb-3">ELIMINAR</button>';
    botonera.addEventListener('click', () => {
        Swal.fire({
            text: `Vas a eliminar ${nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No' 
        }).then((respuesta) => {
            if(respuesta.isConfirmed) {
                const pasajeroEncontrado = pasajeros.find((elemento) => elemento.nombre === nombre);
                const indice = pasajeros.indexOf(pasajeroEncontrado);
                pasajeros.splice(indice, 1);
                localStorage.setItem('pasajeros', JSON.stringify(pasajeros));
                tr.remove();
            } 
        });
    });

    tr.append(botonera);

    tabla.append(tr);
}

const mensajeEspera = document.getElementById('mensaje-espera');
mensajeEspera.hidden = false;

llamadaAlServidor.then((data) => {
    for(const pasajero of data) {
        agregarFilaALaTabla(pasajero);
    }
    mensajeEspera.hidden = true;
    tabla.hidden = false;
}).catch(() => {
    toastify({
        text: 'Ocurrio un error, reintente mas tarde',
        gravity: 'top',
        position: 'right',
        duration: 2000,
        style: {
            background: 'yelow'
        },
        close: true
    }).showToast();});

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const[nombreInput, apellidoInput, edadInput, destinoInput, dniInput] = e.target;
    const pasajero = new Pasajero({
        nombre: nombreInput.value,
        apellido: apellidoInput.value,
        edad: edadInput.value,
        destino: destinoInput.value,
        dni: dniInput.value,
    });
    
    if (!pasajero.soyMayorDeEdad()) {
        Toastify({
            text:'Tienes que ser mayor de 18 años o traer una autorizacion ante escribano publico',
            gravity: 'top',
        position: 'right',
        duration: 2000,
        style: {
            background: 'yelow'
        },
        close: true
        }).showToast();
    return;
    }

    pasajeros.push(pasajero);
    localStorage.setItem('pasajeros', JSON.stringify(pasajeros));

    agregarFilaALaTabla(pasajero);

    for(const input of e.target) {
    input.value = '';
    }
});