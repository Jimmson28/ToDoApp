import { ref, onMounted } from 'vue';

const API_URL = 'http://localhost:5275/api/tasks';

export function useTasks() {

  const editingTask = ref(null);
  const tasks = ref([]);
  const currentFilter = ref('active');
  const searchedDate = ref(null);
  const searchedTasks = ref([]);
  const filteredTasks = ref([]);
  const upcomingTasks = ref([]);

  function getTodayDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');    
    return year + '-' + month + '-' + day;
  }

  const newTask = ref({
    title: '',
    description: '',
    startDate: getTodayDate(),
    deadline: getTodayDate()
  });

  function openEditModal(task) {
    editingTask.value = {
      id: task.id,
      title: task.title,
      description: task.description,
      startDate: task.startDate,
      deadline: task.deadline
    };
    
    //console.log('Editing startdate:', editingTask.value.startDate + ' deadline: ' + editingTask.value.deadline);

    if (editingTask.value.startDate) {
      const startDate = editingTask.value.startDate.split('T')[0];  //spliting because backend sends date with time
      editingTask.value.startDate = startDate;
    }

    if (editingTask.value.deadline) {
      const deadline = editingTask.value.deadline.split('T')[0];  //spliting because backend sends date with time
      editingTask.value.deadline = deadline;
    }

    //console.log('After formatting startdate:', editingTask.value.startDate + ' deadline: ' + editingTask.value.deadline);
  }

  function closeEditModal() {
    editingTask.value = null;
  }

  async function saveEditedTask() {
    if (!editingTask.value) {
      return;
    }

    const taskData = {
      id: editingTask.value.id,
      title: editingTask.value.title,
      description: editingTask.value.description,
      startDate: editingTask.value.startDate,
      deadline: editingTask.value.deadline
    };

    try {
      const url = API_URL + '/' + taskData.id;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        fetchTasks();
        fetchFilteredTasks();
        fetchUpcomingTasks();
        closeEditModal();
      }
    } catch (error) {
      console.error('Error editing task:', error);
    }
  }

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);
      tasks.value = await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async function fetchFilteredTasks() {
    try {
      const url = API_URL + '/filter?filter=' + currentFilter.value;
      const response = await fetch(url);
      filteredTasks.value = await response.json();
    } catch (error) {
      console.error('Error fetching filtered tasks:', error);
    }
  }

  async function fetchUpcomingTasks() {
    try {
      const url = API_URL + '/upcoming';  //upcoming endpoint for fetching tasks with deadline in next day
      const response = await fetch(url);
      upcomingTasks.value = await response.json();
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
    }
  }

  async function addTask() {
    if (!newTask.value.title.trim()) {
      return;
    }

    const taskData = {
      title: newTask.value.title,
      description: newTask.value.description,
      startDate: newTask.value.startDate,
      deadline: newTask.value.deadline,
      isCompleted: false
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      if (response.ok) {
        newTask.value.title = '';
        newTask.value.description = '';
        newTask.value.startDate = getTodayDate();
        newTask.value.deadline = getTodayDate();

        fetchTasks();
        fetchFilteredTasks();
        fetchUpcomingTasks(); //after add new task there is need to fetch updated list of tasks
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  async function makeTaskCompleted(task) {
    const updatedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      startDate: null,
      deadline: null,
      isCompleted: !task.isCompleted
    };

    updatedTask.startDate = task.startDate.split('T')[0]; //spliting because backend sends date with time
    updatedTask.deadline = task.deadline.split('T')[0]; //spliting because backend sends date with time

    try {
      const url = API_URL + '/' + task.id;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(updatedTask)
      });

      if (response.ok) {
        fetchTasks();
        fetchFilteredTasks();
        fetchUpcomingTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async function deleteTask(id) {
    try {
      const url = API_URL + '/' + id;
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchTasks();
        fetchFilteredTasks();
        fetchUpcomingTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async function searchByDate() {
    if (!searchedDate.value) {
      return;
    }

    try {
      const url = API_URL + '/by-date?date=' + searchedDate.value;
      const response = await fetch(url);

      if (response.ok) {
        searchedTasks.value = await response.json();
      }
    } catch (error) {
      console.error('Error searching by date:', error);
    }
  }

  async function changeFilter(filter) {
    currentFilter.value = filter;
    fetchFilteredTasks();
  }

  onMounted(() => {
    fetchTasks();
    fetchFilteredTasks();
    fetchUpcomingTasks();

    setInterval(function() {
      fetchTasks();
      fetchFilteredTasks();
      fetchUpcomingTasks();
    }, 60 * 1000);
  });

  return {
    editingTask,
    tasks,
    currentFilter,
    searchedDate,
    searchedTasks,
    newTask,
    openEditModal,
    closeEditModal,
    saveEditedTask,
    fetchTasks,
    addTask,
    makeTaskCompleted,
    deleteTask,
    upcomingTasks,
    filteredTasks,
    searchByDate,
    changeFilter
  };
}