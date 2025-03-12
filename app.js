document.addEventListener("DOMContentLoaded", function () {
    cargarDatos();
    document.getElementById("alumno-form").addEventListener("submit", function (event) {
        event.preventDefault();
        agregarAlumno();
    });
    document.getElementById("filtrar-form").addEventListener("submit", function (event) {
        event.preventDefault();
        filtrarDatos();
    });
});
function cargarDatos(params = '') {
    fetch(`/datos${params}`)
        .then(response => response.json())
        .then(data => {
            mostrarDatos(data);
        });
}
function mostrarDatos(data) {
    const tbody = document.querySelector('#alumnos-table');
    tbody.innerHTML = ''; // Limpiar la tabla
    data.forEach(alumno => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${alumno[0]}</td> <!-- ID -->
            <td>${alumno[1]}</td> <!-- nombre -->
            <td>${alumno[2]}</td> <!-- apellido -->
            <td>${alumno[3]}</td> <!-- fecha_nacimiento -->
            <td>${alumno[4]}</td> <!-- sexo -->
            <td>${alumno[5]}</td> <!-- lenguaje_favorito -->
            <td>${alumno[6]}</td> <!-- promedio_primaria -->
            <td>${alumno[7]}</td> <!-- promedio_secundaria -->
            <td>${alumno[8]}</td> <!-- promedio_preparatoria -->
            <td>${alumno[9]}</td> <!-- promedio_actual -->
            <td>${alumno[10]}</td> <!-- salario_esperado -->
            <td>${alumno[11]}</td> <!-- color_favorito -->
            <td>${alumno[12]}</td> <!-- marca_ropa -->
            <td>${alumno[13]}</td> <!-- marca_celular -->
            <td>${alumno[14]}</td> <!-- materia_favorita -->
            <td>
                <button class="modify-button" onclick="editarAlumno(${alumno[0]})">Modificar</button>
                <button class="delete-button" onclick="eliminarAlumno(${alumno[0]})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
function agregarAlumno() {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
    const sexo = document.getElementById("sexo").value;
    const lenguaje_favorito = document.getElementById("lenguaje_favorito").value;
    const promedio_primaria = document.getElementById("promedio_primaria").value;
    const promedio_secundaria = document.getElementById("promedio_secundaria").value;
    const promedio_preparatoria = document.getElementById("promedio_preparatoria").value;
    const promedio_actual = document.getElementById("promedio_actual").value;
    const salario_esperado = document.getElementById("salario_esperado").value;
    const color_favorito = document.getElementById("color_favorito").value;
    const marca_ropa = document.getElementById("marca_ropa").value;
    const marca_celular = document.getElementById("marca_celular").value;
    const materia_favorita = document.getElementById("materia_favorita").value;
    fetch("/datos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, fecha_nacimiento, sexo, lenguaje_favorito, promedio_primaria, promedio_secundaria, promedio_preparatoria, promedio_actual, salario_esperado, color_favorito, marca_ropa, marca_celular, materia_favorita })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("alumno-form").reset();
        cargarDatos();
    });
}
function eliminarAlumno(id) {
    fetch(`/datos/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => obtenerAlumnos());
}
function editarAlumno(id) {
    const nombre = prompt("Nuevo nombre:");
    const apellido = prompt("Nuevo apellido:");
    const fecha_nacimiento = prompt("Nueva fecha de nacimiento:");
    const sexo = prompt("Nuevo sexo:");
    const lenguaje_favorito = prompt("Nuevo lenguaje favorito:");
    const promedio_primaria = prompt("Nuevo promedio de primaria:");
    const promedio_secundaria = prompt("Nuevo promedio de secundaria:");
    const promedio_preparatoria = prompt("Nuevo promedio de preparatoria:");
    const promedio_actual = prompt("Nuevo promedio actual:");
    const salario_esperado = prompt("Nuevo salario esperado:");
    const color_favorito = prompt("Nuevo color favorito:");
    const marca_ropa = prompt("Nueva marca de ropa:");
    const marca_celular = prompt("Nueva marca de celular:");
    const materia_favorita = prompt("Nueva materia favorita:");
    const data = {
        nombre, apellido, fecha_nacimiento, sexo, lenguaje_favorito, promedio_primaria, promedio_secundaria, promedio_preparatoria, promedio_actual, salario_esperado, color_favorito, marca_ropa, marca_celular, materia_favorita
    };
    fetch(`/datos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            cargarDatos();
        } else {
            alert('Error al actualizar el dato');
        }
    });
}
function filtrarDatos() {
    const nombre = document.getElementById("filtro-nombre").value;
    const apellido = document.getElementById("filtro-apellido").value;
    const params = new URLSearchParams();
    if (nombre) params.append('nombre', nombre);
    if (apellido) params.append('apellido', apellido);
    cargarDatos(`?${params.toString()}`);
}