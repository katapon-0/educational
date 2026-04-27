<script setup>
import { computed, ref } from "vue"
import MediaCard from "./MediaCard.vue"
import { useMedia } from "../../composables/useMedia"

const { media, deleteMedia, filterByType, filterByStatus, sortByDate, getOverdue, statuses, statusLabels } = useMedia()

// =========================
// ФИЛЬТР
// =========================
const filter = ref("all")

// =========================
// ДОБАВЛЕНО 2: СОРТИРОВКА
// =========================

const typeFilter = ref("all") 
const statusFilter = ref("all")
const sortType = ref("date-asc")

const filteredMedia = computed(function() {
  // фильтр по типу (из старого кода)
  let list = media.value
  if (filter.value === "series") {
    list = list.filter(function(m) { return m.type === "series" })
  } else if (filter.value === "film") {
    list = list.filter(function(m) { return m.type === "film" })
  }

  // фильтр по типу (новая система)
  list = filterByType(list, typeFilter.value)
  // фильтр по статусу
  list = filterByStatus(list, statusFilter.value)

  // сортировка
  if (sortType.value === "date-asc") {
    list = sortByDate(list, "asc")
  } else if (sortType.value === "date-desc") {
    list = sortByDate(list, "desc")
  } else if (sortType.value === "overdue") {
    var overdueIds = []
    var overdueList = getOverdue(list)
    for (var i = 0; i < overdueList.length; i++) {
      overdueIds.push(overdueList[i].id)
    }
    list = list.slice().sort(function(a, b) {
      var aOverdue = overdueIds.indexOf(a.id) !== -1
      var bOverdue = overdueIds.indexOf(b.id) !== -1
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1
      return 0
    })
  }

  return list
})
</script>

<template>
  <div class="list">

    <!-- ========================= -->
    <!-- ФИЛЬТРЫ (РАСШИРЕНЫ) -->
    <!-- ========================= -->
    <div class="filters">

      <button @click="filter = 'all'"  :class="{ active: filter === 'all' }">Все</button>
      <button @click="filter = 'series'"  :class="{ active: filter === 'series' }">Сериалы</button>
      <button @click="filter = 'film'"  :class="{ active: filter === 'film' }">Фильмы</button>

      

     <!-- ДОБАВЛЕНО 2 фильтр по статусу -->
      <label>Статус:</label>
      <button @click="statusFilter = 'all'" :class="{ active: statusFilter === 'all' }">Все</button>
      <button v-for="st in statuses" :key="st" @click="statusFilter = st" :class="{ active: statusFilter === st }">
        {{ statusLabels[st] }}
      </button>

      <!-- ДОБАВЛЕНО 2 сортировка -->
      <label>Сортировка:</label>
      <select v-model="sortType">
        <option value="date-asc">По дате (сначала ближайшие)</option>
        <option value="date-desc">По дате (сначала дальние)</option>
        <option value="overdue">Просроченные первые</option>
      </select>
    </div>

    <!-- ========================= -->
    <!-- СПИСОК -->
    <!-- ========================= -->
    <div class="grid">

      <MediaCard
        v-for="item in filteredMedia"
        :key="item.id"
        :item="item"
        @delete="deleteMedia"
      />

    </div>

  </div>
</template>

<style scoped>
.list {
  padding: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 12px;
}

.filters button {
  padding: 4px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: white;
  cursor: pointer;
}

.filters button.active {
  background: #000;
  color: white;
  border-color: #000;
}

select {
  padding: 4px 8px;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>