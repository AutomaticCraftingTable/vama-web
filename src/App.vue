<template>
  <div>
    <div class="flex flex-col gap-4 items-center">
      <router-link to="/"><div class="w-50 h-10 bg-red rounded-lg content-center">Redirect to "/"</div></router-link>
      <router-link to="/profile">Redirect to "/porfile"</router-link>
      <router-view />
    </div>
  </div>
</template>
