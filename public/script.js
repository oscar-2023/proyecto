document.getElementById('personalDataForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('personalDataSection').classList.add('hidden');
    document.getElementById('bmiSection').classList.remove('hidden');
});

document.getElementById('bmiForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const bmi = weight / (height * height);
    let message = `Tu IMC es ${bmi.toFixed(2)}. `;

    if (bmi < 18.5) {
        message += "Estás en la categoría de bajo peso.";
    } else if (bmi < 24.9) {
        message += "Estás en la categoría de peso normal.";
    } else if (bmi < 29.9) {
        message += "Estás en la categoría de sobrepeso.";
    } else {
        message += "Estás en la categoría de obesidad.";
    }

    document.getElementById('bmiSection').classList.add('hidden');
    document.getElementById('bmiResultSection').classList.remove('hidden');
    document.getElementById('bmiResult').textContent = message;
});

function goBackToPersonalData() {
    document.getElementById('bmiSection').classList.add('hidden');
    document.getElementById('personalDataSection').classList.remove('hidden');
}

function goBackToBMI() {
    document.getElementById('bmiResultSection').classList.add('hidden');
    document.getElementById('bmiSection').classList.remove('hidden');
}

function showAdvice() {
    const bmiMessage = document.getElementById('bmiResult').textContent;
    let advice = "";

    if (bmiMessage.includes("bajo peso")) {
        advice = "Se recomienda aumentar de peso con una dieta rica en nutrientes.";
    } else if (bmiMessage.includes("peso normal")) {
        advice = "Mantén tu peso actual con una dieta equilibrada y ejercicio regular.";
    } else if (bmiMessage.includes("sobrepeso")) {
        advice = "Se recomienda bajar de peso con una dieta controlada y ejercicio.";
    } else if (bmiMessage.includes("obesidad")) {
        advice = "Se recomienda bajar de peso con la ayuda de un profesional de salud.";
    }

    document.getElementById('bmiResultSection').classList.add('hidden');
    document.getElementById('adviceSection').classList.remove('hidden');
    document.getElementById('adviceResult').textContent = advice;
}

function goBackToBMIResult() {
    document.getElementById('adviceSection').classList.add('hidden');
    document.getElementById('bmiResultSection').classList.remove('hidden');
}

function showArticles() {
    document.getElementById('adviceSection').classList.add('hidden');
    document.getElementById('articlesSection').classList.remove('hidden');
}

function goBackToAdvice() {
    document.getElementById('articlesSection').classList.add('hidden');
    document.getElementById('adviceSection').classList.remove('hidden');
}

// Obtener todos los usuarios
function fetchUsers() {
    fetch('/api/users')
      .then(response => response.json())
      .then(users => {
        const usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
        usersTable.innerHTML = ''; // Limpiar tabla
        users.forEach(user => {
          const row = usersTable.insertRow();
          row.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.edad}</td>
            <td>${user.dni}</td>
            <td>${user.celular}</td>
            <td>${user.correo_electronico}</td>
            <td>
              <button onclick="editUser(${user.id})">Editar</button>
              <button onclick="deleteUser(${user.id})">Eliminar</button>
            </td>
          `;
        });
      });
}

// Cargar datos del usuario en el formulario para editar
function editUser(id) {
    fetch(`/api/users/${id}`)
      .then(response => response.json())
      .then(user => {
        document.getElementById('nombre').value = user.nombre;
        document.getElementById('edad').value = user.edad;
        document.getElementById('dni').value = user.dni;
        document.getElementById('celular').value = user.celular;
        document.getElementById('correo_electronico').value = user.correo_electronico;
        document.getElementById('userForm').dataset.userId = id; // Guardar el ID del usuario en el formulario
      });
}
////
// Crear o actualizar usuario
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const dni = document.getElementById('dni').value;
    const celular = document.getElementById('celular').value;
    const correo_electronico = document.getElementById('correo_electronico').value;
    const userId = document.getElementById('userForm').dataset.userId;

    const method = userId ? 'PUT' : 'POST';
    const url = userId ? `/api/users/${userId}` : '/api/users';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, edad, dni, celular, correo_electronico }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        fetchUsers(); // Actualizar lista de usuarios
        document.getElementById('userForm').reset(); // Limpiar formulario
        delete document.getElementById('userForm').dataset.userId; // Eliminar el ID del usuario del formulario
      } else {
        alert('Error al guardar el usuario');
      }
    });
});

// Eliminar usuario
function deleteUser(id) {
    fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        fetchUsers(); // Actualizar lista de usuarios
      } else {
        alert('Error al eliminar el usuario');
      }
    });
}
  // Llamar a fetchUsers al cargar la página
  document.addEventListener('DOMContentLoaded', fetchUsers);

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario por defecto

    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const dni = document.getElementById('dni').value;
    const celular = document.getElementById('celular').value;
    const correo_electronico = document.getElementById('correo_electronico').value;

    fetch('/api/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, edad, dni, celular, correo_electronico })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Aquí puedes actualizar la tabla de usuarios o mostrar un mensaje de éxito
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

