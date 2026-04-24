import { ref, watch } from "vue"
import defaultMedia from "../data/defaultMedia"

// =========================
// ХРАНИЛИЩЕ МЕДИА  
// =========================
// основной реф массив медиа
// инициализируется из локал сторедж или дефолтных данных

const storedMedia = JSON.parse(localStorage.getItem("media") || "null")
const media = ref(storedMedia || defaultMedia)


// =========================
// СИНХРОНИЗАЦИЯ С LOCALSTORAGE
// =========================
// автоматическое сохранение состояния при изменениях массива

watch(media, (newMedia) => {
    localStorage.setItem("media", JSON.stringify(newMedia))
}, { deep: true })


// =========================
// ПОЛУЧЕНИЕ ДАННЫХ
// =========================

function getMedia() {
    return media.value
}

// получение элемента по ID
function getMediaById(id) {
    return media.value.find(m => m.id == id)
}


// =========================
// ДОБАВЛЕНИЕ МЕДИА
// =========================
// создаёт новый объект и добавляет в список

function addMedia(item) {
    const maxId = media.value.length
        ? Math.max(...media.value.map(m => m.id))
        : 0

    const newItem = {
        id: maxId + 1,
        title: item.title,
        type: item.type, // филм или сериал
        watchDate: null,
        link: item.link || null,

        // сериал
        episodeDuration: item.episodeDuration || null,
        totalEpisodes: item.totalEpisodes || null,

        // прогресс просмотра
        progress: 0,

        image: item.image || null
    }

    media.value.push(newItem)
}


// =========================
// ОБНОВЛЕНИЕ МЕДИА
// =========================
// частичное обновление объекта по ID

function updateMedia(id, data) {
    const index = media.value.findIndex(m => m.id == id)

    if (index !== -1) {
        media.value[index] = {
            ...media.value[index],
            ...data
        }
    }
}


// =========================
// УДАЛЕНИЕ МЕДИА
// =========================

function deleteMedia(id) {
    media.value = media.value.filter(m => m.id != id)
}


// =========================
// ФИЛЬТРАЦИЯ
// =========================
// используется для UI (сериалы / фильмы)

function getMediaByType(type) {
    return media.value.filter(m => m.type === type)
}


// =========================
// СТАТИСТИКА (ДОПОЛНИТЕЛЬНО)
// =========================
// используется для homepage

function getStats() {
    return {
        total: media.value.length,
        series: media.value.filter(m => m.type === "series").length,
        films: media.value.filter(m => m.type === "film").length,
        watched: media.value.filter(m => m.progress > 0).length
    }
}


// =========================
// ЭКСПОРТ COMPOSABLE
// =========================

export function useMedia() {
    return {
        // state
        media,

        // CRUD
        getMedia,
        getMediaById,
        addMedia,
        updateMedia,
        deleteMedia,

        // фильтры
        getMediaByType,

        // аналитика
        getStats
    }
}