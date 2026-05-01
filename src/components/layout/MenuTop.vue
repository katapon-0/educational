<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"
import AddItemModal from "../Media/AddItemModal.vue"  // модалка напрямую

const router = useRouter()
const { currentUser, logout } = useUsers()

const userName = computed(() => {
  return currentUser.value?.name || currentUser.value?.login
})
const isAuth = computed(() => !!currentUser.value)

// +управление модалкой добавления прямо в шапке
const addModalVisible = ref(false)

function goHome() {
  router.push("/")
}
function goLogin() {
  router.push("/login")
}
function handleLogout() {
  logout()
  router.push("/login")
}
function openAddModal() {
  addModalVisible.value = true
}
function closeAddModal() {
  addModalVisible.value = false
}
</script>

<template>
  <header class="topbar">
    <div class="left">
      <button class="brand" @click="goHome">WatchList</button>
    </div>
    <div class="right">
      <div v-if="!isAuth" class="auth">
        <button @click="goLogin" class="btn">Войти</button>
      </div>
      <div v-else class="user">
        <span class="username">{{ userName }}</span>
        <button @click="openAddModal" class="btn btn-accent">+ Добавить</button>
        <button @click="handleLogout" class="btn">Выйти</button>
      </div>
    </div>
  </header>
  <!-- модалка добавления -->
  <AddItemModal v-if="addModalVisible" @close="closeAddModal" />
</template>

<style scoped>
.topbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #1a172c;
  color: #fefefe;
  border-radius: 0 0 14px 14px;
  font-family: Arial;
  position: sticky;
  top: 0;
  z-index: 10;
}

.left {
  display: flex;
  align-items: center;
}

.brand {
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.3px;
  background: none;
  border: none;
  color: #fefefe;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: 0.2s;
}
.brand:hover {
  background: rgba(255, 255, 255, 0.08);
}

.right {
  display: flex;
  align-items: center;
}

.auth,
.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 14px;
  opacity: 0.8;
}

.btn {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: transparent;
  color: #fefefe;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-accent {
  background: #fdb688;
  color: #1a172c;
  border: none;
}
.btn-accent:hover {
  opacity: 0.9;
}
</style>