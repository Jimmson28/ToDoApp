<script setup>
import { useTasks } from './composables/useTasks.js';

const {
  editingTask,
  currentFilter,
  searchedDate,
  searchedTasks,
  newTask,
  openEditModal,
  closeEditModal,
  saveEditedTask,
  addTask,
  makeTaskCompleted,
  deleteTask,
  upcomingTasks,
  filteredTasks,
  searchByDate,
  changeFilter,
  errorMessage
} = useTasks();
</script>

<template>
  <div class="dashboard-wrapper">
    <header class="top-nav">
      <img src="./assets/TELDAT.svg.png" alt="Logo" class="logo-image" />      
    </header>

    <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>

    <h1 class="main-title">ToDoApp</h1>

    <div v-if="upcomingTasks.length > 0" class="notification-banner">
        You have {{ upcomingTasks.length }} task(s) expiring today or tomorrow:
        <span v-for="task in upcomingTasks" :key="task.id">
          <strong>{{ task.title }}</strong> ({{ new Date(task.deadline).toLocaleDateString() }})
        </span>
    </div>

    <div class="dashboard">
      <aside class="sidebar card">
        <h2>Add new task</h2>
        <div class="form-group">
          <label>Title of new task</label>
          <input type="text" v-model="newTask.title" placeholder="For example, Write email..." />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newTask.description" placeholder="Additional information..." rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="date" v-model="newTask.startDate" />
        </div>
        <div class="form-group">
          <label>Deadline</label>
          <input type="date" v-model="newTask.deadline" />
        </div>
        <button class="btn-success w-100" @click="addTask">Add Task</button>
      </aside>

      <aside class="sidebar card">
        <h2>Search for task</h2>
        <div class="form-group">
          <label>Search by date</label>
          <input type="date" v-model="searchedDate" placeholder="Select date..." />
          <button @click="searchByDate">Search</button>
        </div>
        <div v-for="task in searchedTasks" :key="task.id">
          {{ task.title }}
        </div>
      </aside>

      <main class="main-content card">
        <div class="header-with-filters">
          <h2>TaskList</h2>
          <div class="filters">
            <button :class="{ active: currentFilter === 'active' }" @click="changeFilter('active')">Active</button>
            <button :class="{ active: currentFilter === 'completed' }" @click="changeFilter('completed')">Done</button>
            <button :class="{ active: currentFilter === 'overdue' }" @click="changeFilter('overdue')" class="btn-filter-danger">Overdue</button>
          </div>
        </div>

        <div class="task-list">
          <div v-if="filteredTasks.length === 0" class="empty-state">
            No tasks in this category
          </div>

          <div v-for="task in filteredTasks" :key="task.id" class="task-item" :class="{ 'is-completed': task.isCompleted }">
            <div class="task-info">
              <label class="custom-checkbox">
                <input type="checkbox" :checked="task.isCompleted" @change="makeTaskCompleted(task)" />
                <span class="checkmark"></span>
              </label>
              <div>
                <h3 class="task-title">{{ task.title }}</h3>
                <p class="task-desc" v-if="task.description">{{ task.description }}</p>
                <small class="task-dates">
                  StartDate: {{ new Date(task.startDate).toLocaleDateString() }}
                  <br>
                </small>
                <small class="task-dates">
                  Deadline: {{ new Date(task.deadline).toLocaleDateString() }}
                </small>
              </div>
            </div>
            <button class="btn-edit" @click="openEditModal(task)">Edit Task</button>
            <button class="btn-delete" @click="deleteTask(task.id)">Delete</button>
          </div>
        </div>
      </main>
    </div>
    
    <div v-if="editingTask" class="modal-backdrop">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Task</h2>
          <span class="close" @click="closeEditModal">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="editingTask.title" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="editingTask.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Start Date</label>
            <input type="date" v-model="editingTask.startDate" />
          </div>

          <div class="form-group">
            <label>Deadline</label>
            <input type="date" v-model="editingTask.deadline" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-success" @click="saveEditedTask">Save changes</button>
          <button class="btn-cancel" @click="closeEditModal">Cancel</button>
        </div>
      </div>
    </div>
    
  </div>
</template>