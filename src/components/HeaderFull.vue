<script setup lang="ts">
import {ref} from 'vue'

defineProps<{
  msg: string
}>()

const isLoggedIn = ref(false)
const searchQuery = ref('')
</script>
<template>
  <div class="full-page-container light-background">
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <a href="/">
            <div class="logo-v">V</div>
          </a>
        </div>

        <div class="search-container">
          <div class="search-box light-secondary">
            <span class="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
                type="text"
                placeholder="Search"
                v-model="searchQuery"
                class="light-text"
            />
          </div>
        </div>

        <div class="auth-buttons">
          <button class="login-button light-secondary light-text">Log in</button>
          <button class="signup-button text-red">Sign up</button>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
.full-page-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  padding: 10px 0;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-v {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
}

.search-container {
  flex-grow: 1;
  max-width: 500px;
  margin: 0 20px;
}

.search-box {
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 8px 16px;
}

.search-icon {
  margin-right: 8px;
}

.search-box input {
  border: none;
  background: transparent;
  width: 100%;
  outline: none;
  font-size: 16px;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.login-button {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.signup-button {
  padding: 8px 20px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.page-content {
  flex: 1;
}

:host {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
