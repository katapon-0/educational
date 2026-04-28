<script setup>
import { computed, ref } from "vue"
import MediaCard from "./MediaCard.vue"
import { useMedia } from "../../composables/useMedia"

// ПРИНИМАЕМ СПИСОК ОТ РОДИТЕЛЯ
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(["delete"])

const { filterByType, filterByStatus, sortByDate, getOverdue, statuses, statusLabels } = useMedia()

const filter = ref("all")
const typeFilter = ref("all")
const statusFilter = ref("all")
const sortType = ref("date-asc")

const filteredMedia = computed(function() {
  let list = props.items   // ← используем ПРОП, а не глобальный media

  // старый фильтр по типу (фильмы/сериалы)
  if (filter.value === "series") {
    list = list.filter(function(m) { return m.type === "series" })
  } else if (filter.value === "film") {
    list = list.filter(function(m) { return m.type === "film" })
  }

  // новые фильтры
  list = filterByType(list, typeFilter.value)
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
    <div class="filters">
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">Все</button>
      <button @click="filter = 'series'" :class="{ active: filter === 'series' }">Сериалы</button>
      <button @click="filter = 'film'" :class="{ active: filter === 'film' }">Фильмы</button>

      <span class="separator"></span>

      <button @click="statusFilter = 'all'" :class="{ active: statusFilter === 'all' }">Все статусы</button>
      <button v-for="st in statuses" :key="st" @click="statusFilter = st" :class="{ active: statusFilter === st }">
        {{ statusLabels[st] }}
      </button>

      <span class="separator"></span>

      <select v-model="sortType" class="sort-select">
        <option value="date-asc">📅 Ближайшие</option>
        <option value="date-desc">📅 Поздние</option>
        <option value="overdue">⚠️ Просроченные</option>
      </select>
    </div>

    <div class="grid">
      <MediaCard
        v-for="item in filteredMedia"
        :key="item.id"
        :item="item"
        @delete="emit('delete', item.id)"
      />
    </div>
  </div>
</template>

<style scoped>

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  background: #0d0d0d;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
}

.filters button {
  padding: 5px 12px;
  border: 1px solid #333;
  border-radius: 20px;
  background: #1a1a1a;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s;
}

.filters button:hover {
  background: #2a2a2a;
  border-color: #68a61c;
}

.filters button.active {
  background: #68a61c;
  color: #ffffff;
  border-color: #68a61c;
}

.separator {
  width: 1px;
  height: 24px;
  background: #333;
  margin: 0 4px;
}

.sort-select {
  padding: 5px 10px;
  background: #1a1a1a;
  color: #ccc;
  border: 1px solid #333;
  border-radius: 20px;
  cursor: pointer;
}

.sort-select:focus {
  outline: none;
  border-color: #68a61c;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>