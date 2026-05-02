import { computed } from "vue"
import { useUsers } from "./useUsers"

// =========================
// СТАТА ИЗ ЮЗЮЗЕРС
// =========================
const { userMedia, updateUserMedia, updateMediaInUser } = useUsers()

const media = computed(() => userMedia.value)

// =========================
// ИЗМЕНЕНИЕ МЕДИА
// =========================
function getMedia() {
    return media.value
}

function getMediaById(id) {
    return media.value.find(m => m.id == id)
}

function addMedia(item) {
    const maxId = media.value.length
        ? Math.max(...media.value.map(m => m.id))
        : 0

    const newItem = {
        id: maxId + 1,
        title: item.title,
        type: item.type,
        description: item.description ?? "",
        status: item.status ?? "want",
        watchDate: item.watchDate ?? null,
        link: item.link ?? null,
        episodeDuration: item.episodeDuration ?? null,
        totalEpisodes: item.totalEpisodes ?? null,
        duration: item.duration ?? null,
        progress: 0,
        image: item.image ?? null
    }

    updateUserMedia([...media.value, newItem])
}

function updateMedia(id, data) {
    updateMediaInUser(id, data)
}

function deleteMedia(id) {
    updateUserMedia(media.value.filter(m => m.id != id))
}

// =========================
// ФИЛТТРЫ
// =========================
function getMediaByType(type) {
    return media.value.filter(m => m.type === type)
}

// универсальные
function filterByType(list, type) {
    return type === "all" ? list : list.filter(m => m.type === type)
}

function filterByStatus(list, status) {
    return status === "all" ? list : list.filter(m => m.status === status)
}

// =========================
// СТАТУСЫ
// =========================
const statuses = ["want", "watching", "done", "abandoned"]

const statusLabels = {
    want: "Хочу посмотреть",
    watching: "Смотрю",
    done: "Просмотрено",
    abandoned: "Заброшено"
}

function updateStatus(id, newStatus) {
    if (!statuses.includes(newStatus)) return
    updateMediaInUser(id, { status: newStatus })
}

function setWatchDate(id, date) {
    updateMediaInUser(id, { watchDate: date })
}

// =========================
// ПРОГРЕСС (СЕРИАЛОВ)
// =========================
function increaseProgress(id) {
    const item = getMediaById(id)
    if (!item || item.type !== "series") return
    if (item.progress >= item.totalEpisodes) return

    const newProgress = (item.progress ?? 0) + 1

    if (item.status === "want") {
        updateMediaInUser(id, {
            status: "watching",
            progress: newProgress
        })
    } else {
        updateMediaInUser(id, { progress: newProgress })
    }

    if (newProgress >= item.totalEpisodes) {
        updateStatus(id, "done")
    }
}

// =========================
// CОРТИРОВКА
// =========================
function sortByDate(list, order = "desc") {
    return [...list].sort((a, b) => {
        const dateA = a.watchDate ? new Date(a.watchDate) : new Date(8640000000000000)
        const dateB = b.watchDate ? new Date(b.watchDate) : new Date(8640000000000000)

        return order === "asc"
            ? dateA - dateB
            : dateB - dateA
    })
}

// =========================
// ПРОСРОЧКА
// =========================
function getOverdue(list) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return list.filter(item => {
        if (!item.watchDate) return false
        if (item.status === "done") return false

        return new Date(item.watchDate) < today
    })
}

// =========================
// СТАТА
// =========================
function getStats(list) {
    return list.reduce(
        (acc, m) => {
            acc[m.status] = (acc[m.status] || 0) + 1
            acc.total++
            return acc
        },
        { want: 0, watching: 0, done: 0, abandoned: 0, total: 0 }
    )
}

// =========================
// ПРЕДЛОЖЕНИЕ
// =========================
function getSuggestion(list) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const overdue = []
    const normal = []

    for (const item of list) {
        if (item.status !== "want" && item.status !== "watching") continue

        if (item.watchDate && new Date(item.watchDate) < today) {
            overdue.push(item)
        } else {
            normal.push(item)
        }
    }

    const pool = [...overdue, ...normal]
    if (!pool.length) return null

    return pool[Math.floor(Math.random() * pool.length)]
}

// =========================
// ЭКСПОПТ :-D
// =========================
export function useMedia() {
    return {
        media,

        getMedia,
        getMediaById,
        addMedia,
        updateMedia,
        deleteMedia,

        // фильтры
        getMediaByType,
        filterByType,
        filterByStatus,

        // статус
        updateStatus,
        setWatchDate,
        statuses,
        statusLabels,

        // прогресс
        increaseProgress,

        // сортировка
        sortByDate,
        getOverdue,
        getStats,
        getSuggestion
    }
}