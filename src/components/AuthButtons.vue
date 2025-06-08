
<template>
  <div class="flex gap-2 flex-col md:flex-row">
    <router-link to="/login">
      <button
          class="w-full px-5 py-2 rounded-sm border-none cursor-pointer bg-secondary hover:bg-secondary-hover text-text font-bold">
        Zaloguj się
      </button>
    </router-link>
    <router-link to="/Registration">
      <button
          class="w-full px-5 py-2 rounded-sm border-none cursor-pointer bg-primary text-text-primary hover:bg-primary-hover font-bold">
        Zarejestruj się
      </button>
    </router-link>
  </div>
  <router-view/>
</template>

