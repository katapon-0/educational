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
        watchDate: item.watchDate || null,
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


// =========================
// ДОБАВЛЕНО РАЗРАБОТЧИКОМ 2
// СТАТУСЫ И ДАТЫ
// =========================

// статусы
var statuses = ["want", "watching", "done", "abandoned"]
var statusLabels = {
  want: "⏳ Хочу посмотреть",
  watching: "▶️ Смотрю",
  done: "✅ Посмотрено",
  abandoned: "❌ Заброшено"
}

function updateStatus(id, newStatus) {
  if (statuses.indexOf(newStatus) === -1) return
  updateMedia(id, { status: newStatus })
}

function setWatchDate(id, date) {
  updateMedia(id, { watchDate: date })
}

// =========================
// ПРОГРЕСС СЕРИАЛОВ
// =========================

function increaseProgress(id) {
  var item = getMediaById(id)
  if (item && item.type === "series" && item.progress < item.totalEpisodes) {
    updateMedia(id, { progress: (item.progress || 0) + 1 })
  }
}

// =========================
// ФИЛЬТРАЦИЯ И СОРТИРОВКА
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
// "ЧТО ПОСМОТРЕТЬ СЕГОДНЯ"
// =========================

function getSuggestion(mediaList) {
  var today = new Date()
  today.setHours(0, 0, 0, 0)

  var overdue = []
  var upcoming = []

  for (var i = 0; i < mediaList.length; i++) {
    var item = mediaList[i]
    if (item.status === "done") continue
    if (!item.watchDate) continue

    var watchDate = new Date(item.watchDate)
    if (watchDate < today) {
      overdue.push(item)
    } else if (watchDate >= today) {
      upcoming.push(item)
    }
  }

  if (overdue.length > 0) {
    return overdue[0]
  }

  if (upcoming.length > 0) {
    upcoming.sort(function(a, b) {
      return new Date(a.watchDate) - new Date(b.watchDate)
    })
    return upcoming[0]
  }

  for (var j = 0; j < mediaList.length; j++) {
    var anyItem = mediaList[j]
    if (anyItem.status === "want" || anyItem.status === "watching") {
      return anyItem
    }
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

        // аналитика (ЗАМЕНЕН на новый, с поддержкой статусов)
        getStats: getStats,

        // ДОБАВЛЕНО РАЗРАБОМ 2
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