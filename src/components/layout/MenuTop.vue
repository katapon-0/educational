<script setup>
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useUsers } from "../../composables/useUsers"

const router = useRouter()

// =========================
// USERS STORE
// =========================
const { currentUser, logout } = useUsers()

// =========================
// COMPUTED USER
// =========================
const user = computed(() => currentUser.value)

// =========================
// NAVIGATION
// =========================
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
</script>

<template>
    <header class="topbar">

        <!-- ЛЕВАЯ ЧАСТЬ -->
        <div class="left">
            <button class="brand" @click="goHome">
                WatchList
            </button>
        </div>

        <!-- ПРАВАЯ ЧАСТЬ -->
        <div class="right">

            <!-- ГОСТЬ -->
            <div v-if="!user" class="auth">
                <button @click="goLogin" class="btn">
                    Войти
                </button>
            </div>

            <!-- АВТОРИЗОВАН -->
            <div v-else class="user">
                <span class="username">
                    {{ user.name || user.login }}
                </span>

                <button @click="handleLogout" class="btn">
                    Выйти
                </button>
            </div>

        </div>

    </header>
</template>

<style scoped>

.topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 14px 20px;
    border-bottom: 1px solid #e6e6e6;

    font-family: Arial;

 
    position: sticky;
    top: 0;
    backdrop-filter: blur(6px);
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

    cursor: pointer;

    padding: 6px 8px;
    border-radius: 6px;
}

.brand:hover {
    opacity: 0.8;
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
}


.btn {
    padding: 6px 10px;

    border: 1px solid #ddd;
    border-radius: 6px;

    background: transparent;

    font-size: 13px;
    cursor: pointer;

    transition: 0.15s ease;
}



</style>