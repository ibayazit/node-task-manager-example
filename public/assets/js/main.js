axios.defaults.baseURL = location.origin + '/api/v1'

const errorContainer = document.getElementById('error-container')
const taskModal = document.getElementById('taskModal')
const taskModalInstance = new bootstrap.Modal(taskModal)
const taskList = document.getElementById('task-list')
const taskModalTitle = taskModal.querySelector('#taskModalLabel')
const taskForm = taskModal.querySelector('#task-form')
const taskFormIdInput = taskModal.querySelector('#task-id-input')
const taskFormNameInput = taskModal.querySelector('#task-name-input')
const taskFormCompletedInput = taskModal.querySelector('#task-completed-input')

// Request
const makeRequest = ({
    url,
    method = 'post',
    data = {},
    success = () => { },
    error = () => { },
    final = () => { }
}) => {
    errorContainer.classList.add('d-none')

    axios({ method, url, data })
        .then((response) => success(response))
        .catch((err) => {
            const res = err.response.data;
            error(res)
            
            errorContainer.classList.remove('d-none')
            if(!res.hasOwnProperty('errors')){
                errorContainer.innerHTML = res.message
            }
            else{
                errorContainer.innerHTML = res.errors.map((e) => e.message).join('<br>')
            }
        })
        .then(() => final())
}

// Create task rows
const createTaskRow = (datas) => {
    let html = ''

    html = datas.map((data) => {
        return `<li class="list-group-item d-flex align-items-center justify-content-between">
            <span class="w-75 text-truncate ${data.completed ? 'text-decoration-line-through' : ''}">${data.name}</span>
            <div>
                <button 
                type="button" 
                class="btn btn-sm btn-danger rounded-circle task-delete"
                data-id="${data._id}"
                >⊗</button>
                <button 
                type="button" 
                class="btn btn-sm btn-warning rounded-circle" 
                data-bs-toggle="modal"
                data-bs-target="#taskModal" 
                data-bs-title="Edit Task" 
                data-bs-name="${data.name}" 
                data-bs-completed="${data.completed}" 
                data-bs-id="${data._id}" 
                >✎</button>
            </div>
        </li>`
    })

    return html.join('')
}

// Modal
taskModal.addEventListener('show.bs.modal', (event) => {
    const elButton = event.relatedTarget
    const modalTitle = elButton.getAttribute('data-bs-title')
    const idValue = elButton.getAttribute('data-bs-id') || ''
    const nameValue = elButton.getAttribute('data-bs-name') || ''
    const completedValue = elButton.getAttribute('data-bs-completed') == "true"

    taskModalTitle.textContent = modalTitle
    taskFormIdInput.value = idValue
    taskFormNameInput.value = nameValue
    taskFormCompletedInput.checked = !!completedValue
})

// Form Submit
taskForm.addEventListener('submit', (e) => {
    const data = Object.fromEntries((new FormData(e.target)).entries())

    makeRequest({
        method: data.id ? 'patch' : 'post',
        url: data.id ? '/tasks/' + data.id : '/tasks',
        data,
        success: (response) => {
            getAndPrintTasks()
        },
        final: () => {
            document.querySelectorAll('.task-delete').forEach(el => {
                el.addEventListener('click', (e) => {
                    deleteTask(e.target.getAttribute('data-id'))
                })
            })

            taskModalInstance.hide()
        }
    })
})

// Get Tasks
const getAndPrintTasks = () => {
    makeRequest({
        method: 'get',
        url: '/tasks',
        success: (response) => {
            taskList.innerHTML = createTaskRow(response.data.tasks)
        },
        final: () => {
            document.querySelectorAll('.task-delete').forEach(el => {
                el.addEventListener('click', (e) => {
                    deleteTask(e.target.getAttribute('data-id'))
                })
            })
        }
    })
}

// Delete Task
const deleteTask = (id) => {
    makeRequest({
        method: 'delete',
        url: '/tasks/' + id,
        success: (response) => { getAndPrintTasks() },
        final: () => {
            document.querySelectorAll('.task-delete').forEach(el => {
                el.addEventListener('click', (e) => {
                    deleteTask(e.target.getAttribute('data-id'))
                })
            })
        }
    })
}

// Init
const init = () => {
    getAndPrintTasks()
}

init()