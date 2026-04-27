<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"

import { useUsers } from "../../composables/useUsers"
import MediaList from "../Media/MediaList.vue"

import { useMedia } from "../../composables/useMedia"
import { ref } from "vue"
import AddItemModal from "../Media/AddItemModal.vue"

const router = useRouter()
const { currentUser, logout } = useUsers()
const { getStats, getSuggestion, statusLabels } = useMedia()

const userName = computed(function() {
    return currentUser.value?.name || currentUser.value?.login
})

const userMedia = computed(function() {
    return currentUser.value?.media ?? []
})

// ДОБАВЛЕНО 2: статистика
const stats = computed(function() {
  return getStats(userMedia.value)
})

// ДОБАВЛЕНО 2: рекомендация
const suggestion = ref(null)
const addModalVisible = ref(false)

function refreshSuggestion() {
  suggestion.value = getSuggestion(userMedia.value)
}

function goLogin() {
    router.push({ name: "login" })
}

function handleLogout() {
    logout()
}

function openAddModal() {
  addModalVisible.value = true
}

function closeAddModal() {
  addModalVisible.value = false
}
</script>

<template>
    <div class="home">

        <!-- ========================= -->
        <!-- ЕСЛИ НЕТ ПОЛЬЗОВАТЕЛЯ -->
        <!-- ========================= -->

        <div v-if="!currentUser">
            <h2>Вы не авторизованы</h2>
            <p>Пожалуйста, войдите в систему</p>
            <button @click="goLogin">
                Перейти к входу
            </button>
        </div>



        <!-- ========================= -->
        <!-- ОСНОВНОЙ UI -->
        <!-- ========================= -->

        <div v-else>

            <!-- HEADER -->
            <header class="header">

                <h1>My Media List</h1>

                <div class="user-info">

                    <span>
                        Пользователь: {{ userName }}
                    </span>

                    <button @click="handleLogout">
                        Выйти
                    </button>

                    <button @click="openAddModal" class="add-btn">+ Добавить</button>

                </div>

            </header>

            <!-- ========================= -->
            <!-- ДОБАВЛЕНО 2: МИНИ-СТАТИСТИКА -->
            <!-- ========================= -->
            <div class="stats">
                <div class="stat-card">⏳ Хочу: {{ stats.want }}</div>
                <div class="stat-card">▶️ Смотрю: {{ stats.watching }}</div>
                <div class="stat-card">✅ Посмотрено: {{ stats.done }}</div>
                <div class="stat-card">❌ Заброшено: {{ stats.abandoned }}</div>
            </div>

            <!-- ========================= -->
            <!-- ДОБАВЛЕНО: "ЧТО ПОСМОТРЕТЬ СЕГОДНЯ" -->
            <!-- ========================= -->
            <div class="suggestion">
                <button @click="refreshSuggestion">🎯 Что посмотреть сегодня?</button>
                <div v-if="suggestion" class="suggestion-card">
                <strong>{{ suggestion.title }}</strong> ({{ suggestion.type === "series" ? "Сериал" : "Фильм" }})
                <span v-if="suggestion.watchDate"> — 📅 {{ new Date(suggestion.watchDate).toLocaleDateString() }}</span>
                <button @click="router.push('/media/' + suggestion.id)">Перейти</button>
                </div>
            </div>
            
            <hr />

            <!-- ПУСТОЕ СОСТОЯНИЕ -->
            <div v-if="!userMedia.length">
                <p>У вас пока нет медиа :()</p>
            </div>

            <!-- СПИСОК -->
            <MediaList v-else  />

            <!-- ДОБАВЛЕНО: МОДАЛЬНОЕ ОКНО ДОБАВЛЕНИЯ -->
            <AddItemModal v-if="addModalVisible" @close="closeAddModal" />           

        </div>

    </div>
</template>

<style scoped>
.home {
  padding: 20px;
  font-family: Arial;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.user-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
}

.stats {
  display: flex;
  gap: 16px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.stat-card {
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
}

.suggestion {
  background: #e3f2fd;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.suggestion-card {
  margin-top: 8px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.suggestion button {
  margin-left: auto;
}
</style>