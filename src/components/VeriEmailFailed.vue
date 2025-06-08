<script setup lang="ts">
</script>

<template>
  <div class="flex flex-1 justify-center items-center min-h-screen bg-bg">
    <div class="flex flex-col bg-bg gap-12 py-12 px-10">
      <div class="bg-failure rounded-sm p-6">
        <p class="text-text-failure font-bold text-3xl">Oops...</p>
      </div>
        <div class="font-bold">We couldn't verify your email...</div>
    <div>
        <div>We can resend you a verification code.</div>
        <div>If the issue persists, try again later.</div>
    </div>
        <button class="bg-primary hover:bg-primary-hover text-text-primary font-bold text-xl cursor-pointer py-6 px-14 rounded-sm">
          Resend verification code
        </button>
    </div>
  </div>
</template>
