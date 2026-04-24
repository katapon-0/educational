<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"

import { useUsers } from "../../composables/useUsers"
import MediaList from "../Media/MediaList.vue"

const router = useRouter()
const { currentUser, logout } = useUsers()

const userName = computed(() => {
    return currentUser.value?.name || currentUser.value?.login
})

const userMedia = computed(() => {
    return currentUser.value?.media ?? []
})

function goLogin() {
    router.push({ name: "login" })
}

function handleLogout() {
    logout()
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

                </div>

            </header>

            <hr />

            <!-- ПУСТОЕ СОСТОЯНИЕ -->
            <div v-if="!userMedia.length">
                <p>У вас пока нет медиа :()</p>
            </div>

            <!-- СПИСОК -->
            <MediaList v-else :media="userMedia" />

        </div>

    </div>
</template>