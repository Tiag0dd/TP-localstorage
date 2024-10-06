// Obtener productos y rubros del Local Storage o usar valores por defecto
let productos = JSON.parse(localStorage.getItem('productos')) || [];

let rubros = JSON.parse(localStorage.getItem('rubros')) || [];

// Guardar rubros en Local Storage si no están presentes
if (!localStorage.getItem('rubros')) {
    localStorage.setItem('rubros', JSON.stringify(rubros));
}

document.addEventListener('DOMContentLoaded', () => {
    // Llenar el select de rubros si está presente
    const selectRubro = document.getElementById('selectrubro');
    if (selectRubro) {
        rubros.forEach(rubro => {
            selectRubro.innerHTML += `<option value="${rubro}">${rubro}</option>`;
        });
    }

    // Evento para agregar productos
    const formProducto = document.getElementById('formagregarproducto');
    if (formProducto) {
        formProducto.onsubmit = (e) => {
            e.preventDefault();
            agregarProducto();
        };
    }

    // Evento para agregar rubros
    const formRubro = document.getElementById('formagregarrubro');
    if (formRubro) {
        formRubro.onsubmit = (e) => {

            // explicar bien que hace esto
            e.preventDefault();
            agregarRubro();
        };
    }

    // Llenar la tabla con los productos cuando el DOM esté cargado
    llenarTablaProductos();
});

function agregarProducto() {
    const nombre = document.getElementById('inputnombre').value;
    const precio = document.getElementById('inputprecio').value;
    const stock = document.getElementById('inputstock').value;
    const rubro = document.getElementById('selectrubro').value;

    productos.push({ nombre, precio, stock, rubro });
    localStorage.setItem('productos', JSON.stringify(productos));

    // Actualizar rubros si el nuevo producto tiene un rubro nuevo
    if (!rubros.includes(rubro)) {
        rubros.push(rubro);
        localStorage.setItem('rubros', JSON.stringify(rubros));

        // Actualizar el select de rubros
        const selectRubro = document.getElementById('selectrubro');
        if (selectRubro) {
            selectRubro.innerHTML += `<option value="${rubro}">${rubro}</option>`;
        }
    }

    document.getElementById('formagregarproducto').reset();
    alert('Producto agregado con éxito');
    llenarTablaProductos(); // Actualizar la tabla con el nuevo producto
}

function agregarRubro() {
    const nuevoRubro = document.getElementById('inputrubro').value;

    // Agregar el rubro al arreglo si no existe
    if (!rubros.includes(nuevoRubro)) {
        rubros.push(nuevoRubro);
        localStorage.setItem('rubros', JSON.stringify(rubros));

        // Actualizar el select de rubros
        const selectRubro = document.getElementById('selectrubro');
        if (selectRubro) {
            selectRubro.innerHTML += `<option value="${nuevoRubro}">${nuevoRubro}</option>`;
        }
    }

    document.getElementById('formagregarrubro').reset();
    alert('Rubro agregado con éxito');
}

function llenarTablaProductos() {
    // Obtener productos del Local Storage o usar valores por defecto
    let productos = JSON.parse(localStorage.getItem('productos')) || [
        { nombre: 'Manzana', precio: 50, stock: 10, rubro: 'Verdulería' },
        { nombre: 'Pollo', precio: 150, stock: 5, rubro: 'Carnicería' },
    ];

    // Obtener el cuerpo de la tabla
    const tbody = document.querySelector('#tablaProductos tbody');
    
    // Limpiar el contenido existente en el tbody
    tbody.innerHTML = '';

    // Rellenar la tabla con los productos
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        
        // Crear celdas para cada característica del producto
        const celdaNombre = document.createElement('td');
        celdaNombre.textContent = producto.nombre;
        fila.appendChild(celdaNombre);

        const celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = producto.precio;
        fila.appendChild(celdaPrecio);

        const celdaStock = document.createElement('td');
        celdaStock.textContent = producto.stock;
        fila.appendChild(celdaStock);

        const celdaRubro = document.createElement('td');
        celdaRubro.textContent = producto.rubro;
        fila.appendChild(celdaRubro);

        const celdaOpciones = document.createElement('td');
        // Botón de borrar
        celdaOpciones.innerHTML = `<button class="botonborrar">Borrar</button>`;
        // Botón de editar stock
        celdaOpciones.innerHTML += `<button class="botonEditarStock">Editar Stock</button>`;
        fila.appendChild(celdaOpciones);

        // Añadir la fila al cuerpo de la tabla
        tbody.appendChild(fila);
    });

    // Reasignar eventos de borrar y editar después de llenar la tabla
    asignarEventosBorrar();
    asignarEventosEditarStock();
}

function asignarEventosBorrar() {
    const botonesEliminar = document.querySelectorAll('.botonborrar');
    
    botonesEliminar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const fila = boton.closest('tr');
            const nombreProducto = fila.querySelector('td:first-child').textContent;

            // Llamar a la función BorrarProd pasando el nombre del producto y la fila
            BorrarProd(nombreProducto, fila);
        });
    });
}

function asignarEventosEditarStock() {
    const botonesEditarStock = document.querySelectorAll('.botonEditarStock');
    
    botonesEditarStock.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const fila = boton.closest('tr');
            const nombreProducto = fila.querySelector('td:first-child').textContent;

            // Llamar a la función para editar el stock
            editarStock(nombreProducto);
        });
    });
}

function BorrarProd(nombreProducto, fila) {
    // Filtrar los productos para eliminar el que coincide con el nombre
    productos = productos.filter(producto => producto.nombre !== nombreProducto);

    // Actualizar el Local Storage con el nuevo arreglo de productos
    localStorage.setItem('productos', JSON.stringify(productos));

    // Eliminar la fila de la tabla instantáneamente
    fila.remove();

    alert('Producto eliminado con éxito');
}

function editarStock(nombreProducto) {
    const nuevoStock = prompt('Ingrese el nuevo stock para el producto:');
    
    if (nuevoStock !== null && !isNaN(nuevoStock) && nuevoStock.trim() !== '') {
        // Actualizar el stock del producto en el arreglo
        productos = productos.map(producto => {
            if (producto.nombre === nombreProducto) {
                producto.stock = parseInt(nuevoStock, 10); // Actualizar el stock con el nuevo valor
            }
            return producto;
        });

        // Guardar los productos actualizados en el Local Storage
        localStorage.setItem('productos', JSON.stringify(productos));

        // Volver a llenar la tabla para reflejar el cambio
        llenarTablaProductos();

        alert('Stock actualizado con éxito');
    } else {
        alert('Por favor, ingrese un número válido para el stock.');
    }
}

// Inicializar los eventos y tabla cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    llenarTablaProductos();
});