
import "./style.css";

const STORAGE_KEY = "todo-tasks";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const form = document.querySelector("#form-task");
const campo = document.querySelector("#campo-task");
const lista = document.querySelector("#lista");
const info = document.querySelector("#info");

function salvaStato() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  lista.innerHTML = tasks
    .map(task => `
      <li class="${task.completed ? "fatto" : ""}" data-id="${task.id}">
        <span class="titolo">${escapeHTML(task.title)}</span>
        <button type="button" class="elimina" data-id="${task.id}">
          Elimina
        </button>
      </li>
    `)
    .join("");

  const completati = tasks.filter(task => task.completed).length;

  info.textContent = `Totali: ${tasks.length} | Completati: ${completati}`;
}

function escapeHTML(testo) {
  return testo.replace(/[&<>"']/g, carattere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[carattere]);
}

function addTask(titolo) {
  titolo = titolo.trim();

  if (titolo === "") {
    return;
  }

  const nuovoTask = {
    id: Date.now(),
    title: titolo,
    completed: false
  };

  tasks.push(nuovoTask);

  salvaStato();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  salvaStato();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);

  salvaStato();
  render();
}

form.addEventListener("submit", function(evento) {
  evento.preventDefault();

  addTask(campo.value);

  campo.value = "";
  campo.focus();
});

lista.addEventListener("click", function(evento) {
  const bottone = evento.target.closest(".elimina");

  if (bottone) {
    const id = Number(bottone.dataset.id);
    deleteTask(id);
    return;
  }

  const elemento = evento.target.closest("li");

  if (elemento) {
    const id = Number(elemento.dataset.id);
    toggleTask(id);
  }
});

render();
