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
    JSON.parse(localStorage.getItem("users")) || [
        {
            id: 1,
            login: "admin",
            password: "admin",
            name: "Админ",
            role: "admin",
            media: structuredClone(defaultMedia)
        }
    ]
)


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
    var exists = users.value.find(function(u) {
    return u.login === newUser.login
    })
    if (exists) return false

  // глубокое клонирование defaultMedia
  var userMediaCopy = JSON.parse(JSON.stringify(defaultMedia))

    const user = {
        id: users.value.length + 1,
        login: newUser.login,
        password: newUser.password,
        name: newUser.name || "",
        role: "user",
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
    if (!currentUser.value) return

    const media = currentUser.value.media

    const maxId = media.length
        ? Math.max(...media.map(m => m.id))
        : 0

    media.push({
        id: maxId + 1,
        title: item.title,
        type: item.type,
        watchDate: null,
        link: item.link || null,
        episodeDuration: item.episodeDuration || null,
        totalEpisodes: item.totalEpisodes || null,
        progress: 0,
        image: item.image || null
    })

    updateUserMedia(media)
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
    return JSON.parse(localStorage.getItem("currentUser"))
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