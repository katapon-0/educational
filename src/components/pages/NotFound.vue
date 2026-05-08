<script setup>
import { useRouter } from "vue-router"
const router = useRouter()
function goHome() {
  router.push({ name: "home" })
}
</script>

<template>
  <div class="not-found">
    <div class="content">
      <h1 class="code">404</h1>
      <p class="message">Страница не найдена</p>
      <p class="description">
        Возможно, она была удалена или вы неверно указали адрес.
      </p>
      <button @click="goHome" class="btn-home">Вернуться на главную</button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 40px 20px;
  background: #fefefe;
  color: #1a172c;
  font-family: var(--font-text);
}
.content {
  text-align: center;
  max-width: 500px;
}
.code {
  font-size: 120px;
  font-weight: 700;
  color: #1a172c;
  margin: 0;
  line-height: 1;
  font-family: var(--font-heading);
}
.message {
  font-size: 28px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #1a172c;
}
.description {
  font-size: 16px;
  color: rgba(26, 23, 44, 0.7);
  margin-bottom: 32px;
}
.btn-home {
  background: #1a172c;
  color: #fefefe;
  border: none;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(26, 23, 44, 0.2);
}
.btn-home:hover {
  background: #2d2a44;
  transform: translateY(-2px);
}
</style>