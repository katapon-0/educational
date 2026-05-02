import { createRouter, createWebHashHistory } from "vue-router"

import HomePage from "./components/pages/HomePage.vue"
import LoginPage from "./components/auth/LoginPage.vue"
import RegisterForm from "./components/auth/RegisterForm.vue"
import MediaPage from "./components/pages/MediaPage.vue"
import TestPage from "./components/pages/test.vue"

import { useUsers } from "./composables/useUsers"

// =========================
// РОУТЫ
// =========================

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },

  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { guestOnly: true }
  },

  {
    path: "/register",
    name: "register",
    component: RegisterForm,
    meta: { guestOnly: true }
  },

  {
    path: "/media/:id",
    name: "media",
    component: MediaPage,
    meta: { requiresAuth: true }
  },

  {
    path: "/test",
    name: "test",
    component: TestPage
  },

  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
 

// --- ПРОВЕРКА АВТОРИЗАЦИИ ---
router.beforeEach((to, from, next) => {
  const { currentUser } = useUsers()

  const user = currentUser.value

  // ЕСЛИ СТРАНИЦА ТРЕБУЕТ АВТОРИЗАЦИИ И ПОЛЬЗОВАТЕЛЬ НЕ ВОШЁЛ
  if (to.meta.requiresAuth && !user) {
    next({ name: "login" }) // ЕСЛИ НЕ АВТОРИЗОВАН -> ЛОГИН
    return
  }

  // ЕСЛИ СТРАНИЦА ТОЛЬКО ДЛЯ ГОСТЕЙ, А ПОЛЬЗОВАТЕЛЬ УЖЕ ВОШЁЛ
  if (to.meta.guestOnly && user) {
    next({ name: "home" }) // ЕСЛИ УЖЕ АВТОРИЗОВАН -> HOME
    return
  }
  next()
})

// ДЛЯ ГИТ ПЕЙДЖС import { createRouter, createWebHashHistory } from "vue-router";

// ДЛЯ ГИТ ПЕЙДЖС
// export const router = createRouter({
//   history: createWebHashHistory(),
//   routes
// });


// защита админ-панели (оставлю мб пригодится)
// router.beforeEach((to) => {
//   if (to.meta.requiresAdmin && !store.isAdmin()) {
//     return { name: "home" };
//   }
//   return true;
// });