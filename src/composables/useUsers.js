// оставлю мб пригодится
import { ref, computed } from "vue"
import defaultMedia from "../data/defaultMedia"

// =========================
// ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
// =========================

const currentUser = ref(
    JSON.parse(localStorage.getItem("currentUser")) || null
)

// =========================
// СПИСОК ПОЛЬЗОВАТЕЛЕЙ
// =========================

const users = ref(
    JSON.parse(localStorage.getItem("users")) || []
)

// =========================
// РЕДАКТИРОВАНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
// =========================
function updateCurrentUser(data) {
    if (!currentUser.value) return false

    const userIndex = users.value.findIndex(
        u => u.id === currentUser.value.id
    )

    if (userIndex === -1) return false

    // обновляем пользователя в списке
    users.value[userIndex] = {
        ...users.value[userIndex],
        ...data
    }

    // обновляем текущего пользователя
    currentUser.value = {
        ...users.value[userIndex]
    }

    saveUsers()
    saveCurrentUser()

    return true
}

// =========================
// СИНХРОНИЗАЦИЯ
// =========================

function saveUsers() {
    localStorage.setItem("users", JSON.stringify(users.value))
}

function saveCurrentUser() {
    localStorage.setItem("currentUser", JSON.stringify(currentUser.value))
}


// =========================
// АВТОРИЗАЦИЯ
// =========================

function login(login, password) {
    const user = users.value.find(
        u => u.login === login && u.password === password
    )

    if (!user) return false

    currentUser.value = user
    saveCurrentUser()

    return true
}

function logout() {
    currentUser.value = null
    localStorage.removeItem("currentUser")
}


// =========================
// РЕГИСТРАЦИЯ
// =========================

function register(newUser) {
    const exists = users.value.find(u => u.login === newUser.login)
    if (exists) return false

    // глубокое клонирование defaultMedia
    const userMediaCopy = structuredClone(defaultMedia)
    const maxId = Math.max(0, ...users.value.map(u => u.id || 0))
    const user = {
        id: maxId +1,
        login: newUser.login,
        password: newUser.password,
        name: newUser.name || "",
        media: userMediaCopy
    }

    users.value.push(user)
    saveUsers()

    currentUser.value = user
    saveCurrentUser()

    return true
}


// =========================
// ПОЛУЧЕНИЕ МЕДИА ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
// =========================

const userMedia = computed(() => {
    return currentUser.value?.media || []
})


// =========================
// ОБНОВЛЕНИЕ МЕДИА У ПОЛЬЗОВАТЕЛЯ
// =========================

function updateUserMedia(mediaList) {
    if (!currentUser.value) return

    const userIndex = users.value.findIndex(
        u => u.id === currentUser.value.id
    )

    if (userIndex === -1) return

    users.value[userIndex].media = mediaList
    currentUser.value.media = mediaList

    saveUsers()
    saveCurrentUser()
}


// =========================
// РЕДАКТИРОВАНИЕ МЕДИА У ПОЛЬЗОВАТЕЛЯ
// =========================

function addMediaToUser(item) {
    if (!currentUser.value) {
        return
    }

    const media = currentUser.value.media
    if (!Array.isArray(media)) {
        return
    }

    // безопасное вычисление maxId
    const maxId = Math.max(0, ...media.map(m => m.id || 0))

    const newItem = {
        id: maxId + 1,
        title: item.title || "Без названия",
        type: item.type || "film",
        description: item.description || "",
        status: item.status || "want",
        watchDate: item.watchDate || null,  
        link: item.link || null,
        episodeDuration: item.episodeDuration || null,
        totalEpisodes: item.totalEpisodes || null,
        duration: item.duration || null,
        progress: 0,
        image: item.image || null
    }
    // создаём новый массив, чтобы реактивность сработала
    const newMedia = [newItem, ...media]
    updateUserMedia(newMedia)
}

function deleteMediaFromUser(id) {
    if (!currentUser.value) return

    const media = currentUser.value.media.filter(m => m.id !== id)

    updateUserMedia(media)
}

function updateMediaInUser(id, data) {
    if (!currentUser.value) return

    const media = currentUser.value.media.map(m =>
        m.id === id ? { ...m, ...data } : m
    )

    updateUserMedia(media)
}


function getCurrentUser() {
    return currentUser.value
}


// =========================
// ЭКСПОРТ 
// =========================

export function useUsers() {
    return {
        // стата
        users,
        currentUser,
        userMedia,
        updateCurrentUser,

        // авторизация
        login,
        logout,
        register,

        // медиа пользователя
        addMediaToUser,
        deleteMediaFromUser,
        updateMediaInUser,
        updateUserMedia,
        getCurrentUser
    }
}