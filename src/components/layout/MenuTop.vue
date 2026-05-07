<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"
import logowl from "../../assets/icons/logowl.png"
import iconedit from "../../assets/icons/edituser.png"
import AddItemModal from "../Media/AddItemModal.vue"  // модалка напрямую
import EditUserModal from "../Media/EditUserModal.vue"

const router = useRouter()
const { currentUser, logout } = useUsers()

const userName = computed(() => {
  return currentUser.value?.name || currentUser.value?.login
})
const isAuth = computed(() => !!currentUser.value)

// +управление модалкой добавления прямо в шапке
const addModalVisible = ref(false)
const editModalVisible = ref(false)

function goHome() {
  router.push({ name: "home" })
}
function goLogin() {
  router.push({ name: "login" })
}
function handleLogout() {
  logout()
  router.push({ name: "login" })
}

function openAddModal() {
  addModalVisible.value = true
}
function closeAddModal() {
  addModalVisible.value = false
}

function openEditModal() {
  editModalVisible.value = true
}
function closeEditModal() {
  editModalVisible.value = false
}


</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="left">
        <button class="brand" @click="goHome">
          <img :src="logowl" class="logo" alt="logo" />
          <span>WatchList</span>
        </button>
      </div>

      <div class="right">
        <div v-if="!isAuth" class="auth">
          <button @click="goLogin" class="btn">Авторизация</button>
        </div>
        <div v-else class="user">
          <button class="icon-btn" @click="openEditModal" title="Профиль">
            <img :src="iconedit" alt="edit" class="icon-img" />
          </button>
          <span class="username">{{ userName }}</span>
          <button @click="openAddModal" class="btn btn-accent">+ Добавить</button>
          <button @click="handleLogout" class="btn">Выйти</button>
        </div>
      </div>
    </div>
  </header>

  <AddItemModal v-if="addModalVisible" @close="closeAddModal" />
  <EditUserModal v-if="editModalVisible" @close="closeEditModal" />
</template>

<style scoped>
.topbar {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  background: #1a172c;
  color: #fefefe;
  border-radius: 0 0 14px 14px;
}

.topbar-inner {
  width: 80vw;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
}

.brand {
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 0.3px;
  background: none;
  border: none;
  color: #fefefe;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand:hover {
  background: rgba(255, 255, 255, 0.08);
}

.logo {
  width: 32px;
  height: 25px;
  object-fit: contain;
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
  font-size: 17px;
}

.btn {
  padding: 6px 12px;
  border: 1px solid rgba(197, 194, 210, 0.2);
  border-radius: 8px;
  background: transparent;
  color: #fefefe;
  font-size: 15px;
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
  background: #ffdac1;
  border: 2px;
  border-color: #fdb688;
}

.icon-btn {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;
 
  background: transparent;
  color: #fefefe;

  cursor: pointer;
  transition: 0.2s ease;

  font-size: 16px;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.icon-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  transition: 0.2s ease;
}

@media (max-width: 768px) {
  .topbar-inner {
    width: 100%;
    padding: 10px 12px;
  }

  .brand {
    font-size: 16px;
    gap: 6px;
    padding: 4px 6px;
  }

  .logo {
    width: 26px;
    height: 20px;
  }

  .username {
    display: none; 
  }

  .auth,
  .user {
    gap: 6px;
  }

  .btn {
    padding: 5px 8px;
    font-size: 13px;
  }

  .btn-accent {
    padding: 6px 10px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
  }

  .icon-img {
    width: 28px;
    height: 28px;
  }
}

</style>