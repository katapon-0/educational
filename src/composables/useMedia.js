import { computed } from "vue"
import defaultMedia from "../data/defaultMedia"
// единый источник данных через useUsers
import { useUsers } from "./useUsers"

// =========================
// ХРАНИЛИЩЕ МЕДИА — теперь из useUsers
// =========================
// MOD: media теперь ссылается на userMedia из useUsers
const { userMedia, updateUserMedia, updateMediaInUser, currentUser } = useUsers()
const media = computed(() => userMedia.value)

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

function addMedia(item) {
    const maxId = media.value.length
        ? Math.max(...media.value.map(m => m.id))
        : 0
    const newItem = {
        id: maxId + 1,
        title: item.title,
        type: item.type,
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
    // MOD: используем updateUserMedia для синхронизации
    const newMedia = [...media.value, newItem]
    updateUserMedia(newMedia)
}

// =========================
// ОБНОВЛЕНИЕ МЕДИА
// =========================
function updateMedia(id, data) {
    // MOD: используем updateMediaInUser вместо прямого изменения
    updateMediaInUser(id, data)
}

// =========================
// УДАЛЕНИЕ МЕДИА
// =========================
function deleteMedia(id) {
    // MOD: удаляем через обновление всего массива
    const newMedia = media.value.filter(m => m.id != id)
    updateUserMedia(newMedia)
}

// =========================
// ФИЛЬТРАЦИЯ
// =========================
function getMediaByType(type) {
    return media.value.filter(m => m.type === type)
}

// =========================
// ДОБАВЛЕНО РАЗРАБОТЧИКОМ 2
// СТАТУСЫ И ДАТЫ
// =========================
var statuses = ["want", "watching", "done", "abandoned"]
var statusLabels = {
    want: "⏳ Хочу посмотреть",
    watching: "▶️ Смотрю",
    done: "✅ Посмотрено",
    abandoned: "❌ Заброшено"
}

function updateStatus(id, newStatus) {
    if (statuses.indexOf(newStatus) === -1) return
    // MOD: используем updateMediaInUser
    updateMediaInUser(id, { status: newStatus })
}

function setWatchDate(id, date) {
    // MOD: используем updateMediaInUser
    updateMediaInUser(id, { watchDate: date })
}

// =========================
// ПРОГРЕСС СЕРИАЛОВ
// =========================
function increaseProgress(id) {
    var item = getMediaById(id)
    if (item && item.type === "series" && item.progress < item.totalEpisodes) {
        var newProgress = (item.progress || 0) + 1
        updateMediaInUser(id, { progress: newProgress })
        // автоматически помечает как выполненное, когда прогресс достигает 100%
        if (newProgress >= item.totalEpisodes) {
            updateStatus(id, 'done')
        }
    }
}

// =========================
// ФИЛЬТРАЦИЯ И СОРТИРОВКА (чистые функции)
// =========================
function filterByType(mediaList, type) {
    if (type === "all") return mediaList
    return mediaList.filter(function(m) {
        return m.type === type
    })
}

function filterByStatus(mediaList, status) {
    if (status === "all") return mediaList
    return mediaList.filter(function(m) {
        return m.status === status
    })
}

function sortByDate(mediaList, order) {
    var copy = mediaList.slice()
    return copy.sort(function(a, b) {
        var dateA = a.watchDate ? new Date(a.watchDate) : new Date(8640000000000000)
        var dateB = b.watchDate ? new Date(b.watchDate) : new Date(8640000000000000)
        if (order === "asc") {
            return dateA - dateB
        } else {
            return dateB - dateA
        }
    })
}

function getOverdue(mediaList) {
    var today = new Date()
    today.setHours(0, 0, 0, 0)
    return mediaList.filter(function(item) {
        if (!item.watchDate) return false
        if (item.status === "done") return false
        var watchDate = new Date(item.watchDate)
        return watchDate < today
    })
}

// =========================
// СТАТИСТИКА
// =========================
function getStats(mediaList) {
    var want = 0
    var watching = 0
    var done = 0
    var abandoned = 0
    for (var i = 0; i < mediaList.length; i++) {
        var m = mediaList[i]
        if (m.status === "want") want++
        else if (m.status === "watching") watching++
        else if (m.status === "done") done++
        else if (m.status === "abandoned") abandoned++
    }
    return {
        want: want,
        watching: watching,
        done: done,
        abandoned: abandoned,
        total: mediaList.length
    }
}

// =========================
// "ЧТО ПОСМОТРЕТЬ СЕГОДНЯ" (МОДИФИЦИРОВАНО: случайный выбор)
// =========================
function getSuggestion(mediaList) {
    // MOD: random selection with overdue priority
    var candidates = []
    var overdueCandidates = []
    var today = new Date()
    today.setHours(0, 0, 0, 0)

    for (var i = 0; i < mediaList.length; i++) {
        var item = mediaList[i]
        if (item.status !== 'want' && item.status !== 'watching') continue
        if (item.watchDate) {
            var watchDate = new Date(item.watchDate)
            if (watchDate < today) {
                overdueCandidates.push(item)
            } else {
                candidates.push(item)
            }
        } else {
            candidates.push(item)
        }
    }

    if (overdueCandidates.length > 0) {
        var randomIndex = Math.floor(Math.random() * overdueCandidates.length)
        return overdueCandidates[randomIndex]
    }
    if (candidates.length > 0) {
        var randomIndex = Math.floor(Math.random() * candidates.length)
        return candidates[randomIndex]
    }
    return null
}

// =========================
// ЭКСПОРТ COMPOSABLE
// =========================
export function useMedia() {
    return {
        // state
        media: media,
        // CRUD
        getMedia: getMedia,
        getMediaById: getMediaById,
        addMedia: addMedia,
        updateMedia: updateMedia,
        deleteMedia: deleteMedia,
        // фильтры
        getMediaByType: getMediaByType,
        // аналитика
        getStats: getStats,
        // ДОБАВЛЕНО РАЗРАБОТЧИКОМ 2
        updateStatus: updateStatus,
        setWatchDate: setWatchDate,
        increaseProgress: increaseProgress,
        filterByType: filterByType,
        filterByStatus: filterByStatus,
        sortByDate: sortByDate,
        getOverdue: getOverdue,
        getSuggestion: getSuggestion,
        statuses: statuses,
        statusLabels: statusLabels
    }
}