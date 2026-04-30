<script setup>

// короче надо пофиксить добавление в этой шапке. я её перенесла, но я так намучалась с этими эмитами... по хорошему, надо шапку перенести в отдельный компонент, т.е. оставить её здесь. если у тебя не получится, мы оставим её отдельным блоком в homepage.vue.
// выход работает, он меняет состояние в зависимости от авторизации. но добавить не работает кнопка.. остальное вроде рабочее.

import { computed } from "vue"
import { useUsers } from "../../composables/useUsers"

const { currentUser, logout } = useUsers()

const emit = defineEmits(["open-add"])

const userName = computed(() => {
  return currentUser.value?.name || currentUser.value?.login
})

const isAuth = computed(() => !!currentUser.value)

function handleLogout() {
  logout()
}

function openAddModal() {
  emit("open-add")
}
</script>

<template>
  <header class="header">
    <h1>🎬 WatchList</h1>

    <div class="user-info">

      <template v-if="isAuth">

        <span class="username">👤 {{ userName }}</span>

        <button class="btn-add" @click="openAddModal">
          + Добавить
        </button>

        <button class="btn-logout" @click="handleLogout">
          Выйти
        </button>

      </template>

      <template v-else>

        <button class="btn-logout" @click="goLogin">
          Войти
        </button>

      </template>

    </div>
  </header>
</template>

<style scoped>

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    padding: 16px 18px;
    background: #1a172c;
    border-radius: 18px;
    border: 1px solid #1a172c;
}

.header h1 {
    margin: 0;
    color: #fefefe;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.username {
  color: #fefefe;
  opacity: 0.9;
}

.btn-logout {
  background: transparent;
  color: #fefefe;
  border: 1px solid rgba(254, 254, 254, 0.28);
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background: rgba(253, 234, 191, 0.16);
  border-color: #fdeabf;
}

.btn-add {
  background: #fdb688;
  color: #1a172c;
  border: none;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #fdeabf;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #1a172c;
  opacity: 0.5;
}

.btn-primary {
  background: #1a172c;
  color: #fefefe;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.92;
}

</style>