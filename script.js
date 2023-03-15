const BDTask = JSON.parse(localStorage.getItem('BD')) || [
  {
    id: 1,
    title: 'создать новую задачу',
    description: 'описание',
    done: false,
    type: true,
    date: '2023-03-20T09:17',
  },
];

const shevron = document.querySelector('.shevron');
const hideBlock = document.querySelector('.hide');
const openModal = document.querySelector('.popup__plus');
const closeModal = document.querySelector('.modal__close');
const modalWin = document.querySelector('.modalWrapper');
const modalBody = document.querySelector('.modal__body');
const tasks = document.querySelector('#tasks');
const inputTask = document.querySelector('#title_task');
const inputDescription = document.querySelector('#description__task');
const btn = document.querySelector('button');
const personal = document.querySelector('.rad1');
const working = document.querySelector('.rad2');
const inputDate = document.querySelector('#calendar__task');
const types = document.querySelector('#select_type');
const all = document.querySelector('#all');
const sort = document.querySelector('#sort');
const timeIsNow = new Date();
const hours6 = 6 * 60 * 60 * 1000;
const hours3 = 3 * 60 * 60 * 1000;
let editId = null;

// написать функцию и повесить обработчик событий на div
// в ней написать условие, если кликнуть на div, то показать модальное окно

// написать функцию и повестить обработчик события на ссылку x
// в ней написать условие, если кликнуть на x, то модальное окно закрывается

openModal.addEventListener('click', (e) => {
  modalWin.style.opacity = '1';
  modalWin.style.visibility = 'visible';
  document.body.style.overflow = 'hidden';
});

function modalClose() {
  modalWin.style.opacity = '0';
  modalWin.style.visibility = 'hidden';
  document.body.style.overflow = '';
}

closeModal.addEventListener('click', modalClose);

modalBody.addEventListener('click', (e) => {
  if (e.target === modalBody) {
    modalClose();
  }
});

shevron.addEventListener('click', (e) => {
  if (shevron.classList.contains('invert') === false) {
    hideBlock.style.display = 'block';
    shevron.classList.add('invert');
  } else {
    hideBlock.style.display = 'none';
    shevron.classList.remove('invert');
  }
});

// создать новую базу данных
// написать функцию display, которая будет отображать задачи на экране

function display(arr = BDTask) {
  localStorage.setItem('BD', JSON.stringify(BDTask));
  tasks.innerHTML = '';
  arr.forEach((item) => {
    const tag = item.date !== '' ? 'tag' : '';
    const type = item.type === true ? 'fas fa-solid fa-user type' : 'fas fa-solid fa-briefcase type';
    const checked = item.done === true ? 'checked' : '';
    const crossedOut = item.done === true ? 'line-through' : '';
    const opacity = item.done === true ? 'opacity' : '';
    const diff = new Date(item.date) - timeIsNow;
    const yellow = diff <= hours6 ? 'yellow' : '';
    const red = diff <= hours3 ? 'red' : '';
    tasks.innerHTML += `
    <div class="task_card">
      <div class='task_part'>
        <label class='checkbox'><input ${checked} type="checkbox" class='check' onclick='checkTask(${item.id})'/>
          <i class="${type}"></i>
          <span class="task ${crossedOut} ${yellow} ${red}">${item.title}</span>
        </label>
        <i class="fas fa-solid fa-pen edit" onclick='editTask(${item.id})'></i>
        <i class="fas fa-solid fa-trash trash" onclick='deleteTask(${item.id})'></i>
      </div>
      <span class="${tag}">
        ${item.date.split('T', 1).reverse().join('').split('-').reverse().join('-')} 
        ${item.date.split('T').reverse().join().split(',', 1).join('')}
      </span>
    </div>
    <div class='description_card'>
      <p class="description ${opacity}">${item.description}</p>
    </div>`;
  });
}
display();

// написать функцию на клик по кнопке
// при клике на кнопку value инпута присваивается свойству title, как значение и пушится в массив BDTask
// закрывается модальное окно

btn.addEventListener('click', (e) => {
  let titleTask = inputTask.value.trim();
  let descriptionTask = inputDescription.value.trim();
  let dateTask = inputDate.value;
  let typeTask;

  // редактирование tasks
  if (editId !== null) {
    const task = BDTask.find((item) => item.id === editId);

    if (inputTask.value !== '') {
      task.title = inputTask.value.trim();
    } else {
      return;
    }

    task.description = inputDescription.value.trim();
    task.date = inputDate.value;

    if (personal.checked === true) {
      typeTask = true;
    } else if (working.checked === true) {
      typeTask = false;
    }
    task.type = typeTask;

    display();
    inputTask.value = '';
    inputDescription.value = '';
    inputDate.value = '';
    modalWin.style.opacity = '0';
    modalWin.style.visibility = 'hidden';
    types.value = '0';
    all.value = '3';
    sort.value = '6';
    editId = null;
    return;
  }

  if (titleTask === '') {
    inputTask.value = '';
    return;
  }

  if (personal.checked === true) {
    typeTask = true;
  } else if (working.checked === true) {
    typeTask = false;
  }

  const obj = {
    id: Date.now(),
    title: titleTask.toLowerCase(),
    description: descriptionTask.toLowerCase(),
    done: false,
    type: typeTask,
    date: dateTask,
  };

  BDTask.push(obj);
  inputTask.value = '';
  inputDescription.value = '';
  inputDate.value = '';
  modalWin.style.opacity = '0';
  modalWin.style.visibility = 'hidden';
  types.value = '0';
  all.value = '3';
  sort.value = '6';
  display();
});

// написать функцию, которая при клике на чек-бокс перечеркнет текст
// при клике на чек-бокс становится полупрозрачным описание задачи

function checkTask(id) {
  BDTask.forEach((item) => {
    if (item.id === id) {
      item.done = !item.done;
    }
  });
  display();
}

function deleteTask(id) {
  BDTask.forEach((item, index, arr) => {
    if (item.id === id) {
      arr.splice(index, 1);
    }
  });
  display();
}

function editTask(id) {
  modalWin.style.opacity = '1';
  modalWin.style.visibility = 'visible';
  editId = id;
  BDTask.forEach((item) => {
    if (item.id === editId) {
      item.done = false;
      inputTask.value = item.title;
      inputDescription.value = item.description;
      inputDate.value = item.date;
      if (item.type === true) {
        personal.checked = true;
      } else {
        working.checked = true;
      }
    }
  });
  display();
}

types.addEventListener('change', (e) => {
  filter();
});

all.addEventListener('change', (e) => {
  filter();
});

sort.addEventListener('change', (e) => {
  filter();
});

function filter(arr = BDTask) {
  const arrfilter = [...arr];
  const newArr = arrfilter
    .sort(function (a, b) {
      if (sort.value === '6') {
        return;
      }
      if (sort.value === '7') {
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }
        return 0;
      }
      if (sort.value === '8') {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        return 0;
      }
    })
    .filter((item) => {
      if (types.value === '0') {
        return true;
      }
      if (types.value === '1') {
        return item.type;
      } else {
        return !item.type;
      }
    })
    .filter((item) => {
      if (all.value === '3') {
        return true;
      }
      if (all.value === '4') {
        return item.done;
      } else {
        return !item.done;
      }
    });
  display(newArr);
}
