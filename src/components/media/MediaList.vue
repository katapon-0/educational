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

// const filter = ref("all")
const typeFilter = ref("all")
const statusFilter = ref("all")
const sortType = ref("date-asc")

const filteredMedia = computed(function() {
  let list = props.items   // ← используем ПРОП, а не глобальный media

  // фильтр типа
  list = filterByType(list, typeFilter.value)
  // фильтр состояния
  list = filterByStatus(list, statusFilter.value)

  // сортировка с просроченным приоритетом
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
      <!-- переключен на TypeFilter для унифицированной фильтрации типов -->
      <button @click="typeFilter = 'all'" :class="{ active: typeFilter === 'all' }">Все</button>
      <button @click="typeFilter = 'series'" :class="{ active: typeFilter === 'series' }">Сериалы</button>
      <button @click="typeFilter = 'film'" :class="{ active: typeFilter === 'film' }">Фильмы</button>
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

  background: #fefefe;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.filters button {
  padding: 6px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;

  background: transparent;
  color: #1a172c;

  cursor: pointer;
  transition: all 0.2s ease;
}

.filters button:hover {
  background: #fdeabf;
  border-color: #fdb688;
}

.filters button.active {
  background: #fdb688;
  color: #1a172c;
  border-color: #fdb688;
}

.separator {
  width: 1px;
  height: 24px;
  background: #e0e0e0;
  margin: 0 4px;
}

.sort-select {
  padding: 6px 12px;

  background: transparent;
  color: #1a172c;

  border: 1px solid #e0e0e0;
  border-radius: 20px;

  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:hover {
  border-color: #fdb688;
  background: #fdeabf;
}

.sort-select:focus {
  outline: none;
  border-color: #fdb688;
  background: #fdeabf;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>