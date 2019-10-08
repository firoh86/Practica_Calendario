// localStorage.clear()
// localStorage.removeItem('key')
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// dia marcado
let actualDay
// todas las tareas y sus dias
let id = 0
class Task {
  constructor(date, task) {
    this.date = date
    this.task = task
  }
}
const taskText = document.getElementById('task')
const taskForm = document.getElementById('task-form')
const taskList = document.getElementById('task__li')

const currentDate = new Date()

const currentDay = currentDate.getDate()
let monthNumber = currentDate.getMonth()
let currentYear = currentDate.getFullYear()
// console.log(currentDay + '/' + monthNumber + '/' + currentYear)
// dia mes año y fecha
const month = document.getElementById('calendar__month')
const year = document.getElementById('calendar__year')
const dates = document.getElementById('dates')
// botones meses
const prevM = document.getElementById('prev-month')
const nextM = document.getElementById('next-month')
// calendario cabecera
month.textContent = monthNames[monthNumber]
year.textContent = currentYear.toString()

prevM.addEventListener('click', () => lastMonth())
nextM.addEventListener('click', () => nextMonth())

// showTasks() para mostrar tareas con boton nextmonth y past month
// -------------------------------------------
const actualMonth = monthNumber


taskList.addEventListener('click', (e) => {
  if (e.target.className == 'task__delete') {
    const id = e.target.id
    const taskElement = document.getElementById(id)
    taskElement.remove()
    const allDays = Array.from(dates.children)
    // borra color dia con tarea
    let num = localStorage.getItem('task' + id.toString())
    let color = JSON.parse(num)
    console.log(color)
    const newDate = new Date(color.date)
    let color2 = newDate.getDate().toString()
    allDays[color2].classList.remove('day--tasked')
    // borra el elemento del local storage
    localStorage.removeItem('task' + id.toString())

  }
})


// boton tareas
taskForm.addEventListener('submit', (e) => {
  e.preventDefault()
  if (taskForm.task.value != '' && actualDay != '') {
    const task = {
      date: `${actualDay.getFullYear()},${actualDay.getMonth()},${actualDay.getDate()}`,
      taskString: taskForm.task.value,
      id: id
    }
    localStorage.setItem('task' + id.toString(), JSON.stringify(task))
    createTask(actualDay, taskForm.task.value, id)
    id++
    //  colorea dia con tarea
    const allDays = Array.from(dates.children)
    const newDate = new Date(actualDay)
    const colorDay = newDate.getDate()
    if (!allDays[colorDay].classList.contains('day--tasked')) {
      allDays[colorDay].classList.add('day--tasked')
    }

  }
})

// fragmento inyecta tareas
const fragment = document.createDocumentFragment()

const createTask = (date, task, id) => {

  const dateToString = `${date.getDate()}-${monthNames[date.getMonth()]}-${date.getFullYear()}`

  const divTask = document.createElement('div')
  divTask.className = 'task'
  divTask.id = id.toString()
  const paragraph = document.createElement('p')
  paragraph.textContent = task
  const dateTask = document.createElement('p')
  dateTask.textContent = dateToString
  const deleteButton = document.createElement('button')
  deleteButton.className = 'task__delete'
  deleteButton.textContent = 'X'
  deleteButton.id = id.toString()

  divTask.appendChild(paragraph)
  divTask.appendChild(dateTask)
  divTask.appendChild(deleteButton)
  fragment.appendChild(divTask)
  taskList.appendChild(fragment)

  taskForm.task.value = ''

}

const startDay = () => {
  let start = new Date(currentYear, monthNumber, 1)
  return ((start.getDay() - 1) == -1) ? 6 : start.getDay() - 1
}

const writeMonth = (month) => {

  for (let i = startDay(); i > 0; i--) {
    dates.innerHTML += ` <div class="calendar__day no__day">${getTotalDays(monthNumber - 1) - (i - 1)}</div>`
  }
  // crear fragmento para meter los dias

  for (let i = 1; i < getTotalDays(month); i++) {
    // && actualMonth == month
    if (i == currentDay && actualMonth == month) {
      dates.innerHTML += ` <div class="calendar__day today">${i}</div>`
    } else {
      dates.innerHTML += ` <div class="calendar__day">${i}</div>`
    }
  }
}
// marcar dias
dates.addEventListener('click', (e) => {
  const allDays = Array.from(dates.children)

  if (!e.target.classList.contains('no__day') && (!e.target.classList.contains('calendar__dates'))) {
    if (e.target.classList.contains('marked')) {
      e.target.classList.remove('marked')
      actualDay = ''
    } else {
      allDays.map(day => {
        day.classList.remove('marked')
        e.target.classList.add('marked')
      })
      // saca el dia marcado  y su fecha
      actualDay = new Date(currentYear.toString(), monthNumber, e.target.textContent);
      // console.log(actualDay)
    }
  }
})

const getTotalDays = (month) => {
  if (month == -1) month = 11
  if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
    return 31
  } else if (month == 3 || month == 5 || month == 8 || month == 10) {
    return 30
  } else {
    return isLeap() ? 29 : 28
  }
}
writeMonth(monthNumber)
// calcula si el año es bisiesto
const isLeap = () => {
  return (currentYear % 100 != 0 && currentYear % 4 == 0 || currentYear % 40 == 0)
}

const lastMonth = () => {
  if (monthNumber != 0) {
    monthNumber--
  } else {
    monthNumber = 11
    currentYear--
  }
  setNewDay()
  showTasks()
}

const nextMonth = () => {
  if (monthNumber != 11) {
    monthNumber++
  } else {
    monthNumber = 0
    currentYear++
  }
  setNewDay()
  showTasks()
}


const showTasks = () => {
  // resetea color dia listas

  const allDays = Array.from(dates.children)
  for (day of allDays) {
    if (day.classList.contains('day--tasked')) {
      day.classList.remove('day--tasked')
    }
  }
  // borra la lista mostrada anterior
  while (taskList.hasChildNodes()) {
    taskList.removeChild(taskList.firstChild)
  }
  // el mes se escribe en el anterior
  for (let i = 0; i < id; i++) {
    {
      let item = localStorage.getItem('task' + i.toString())
      if (item != null) {
        let taskDate = JSON.parse(item)
        let newDate = new Date(taskDate.date)


        if (newDate.getMonth() == monthNumber - 1 && newDate.getFullYear() == currentYear) {
          const dateAjust = `${newDate.getDate()}-${monthNames[newDate.getMonth() + 1]}-${newDate.getFullYear()}`

          createList(i, taskDate.taskString, dateAjust, newDate)
        }
      }
      item = null
    }
  }

}

const createList = (id, task, date, colorDay) => {

  const allDays = Array.from(dates.children)
  for (day of allDays) {
    if (day.textContent == colorDay.getDate().toString() && !day.classList.contains('day--tasked')) {
      day.classList.add('day--tasked')
    }

  }


  const divTask = document.createElement('div')
  divTask.className = 'task'
  divTask.id = id.toString()
  const paragraph = document.createElement('p')
  paragraph.textContent = task
  const dateTask = document.createElement('p')
  dateTask.textContent = date
  const deleteButton = document.createElement('button')
  deleteButton.className = 'task__delete'
  deleteButton.textContent = 'X'
  deleteButton.id = id.toString()

  divTask.appendChild(paragraph)
  divTask.appendChild(dateTask)
  divTask.appendChild(deleteButton)
  fragment.appendChild(divTask)
  taskList.appendChild(fragment)
}

const setNewDay = () => {
  currentDate.setUTCFullYear(currentYear, monthNumber, currentDay)
  month.textContent = monthNames[monthNumber]
  year.textContent = currentYear.toString()

  dates.textContent = ''
  writeMonth(monthNumber)
}
