<script setup lang="ts">
</script>

<template>
  <div class="flex flex-1 justify-center items-center min-h-screen bg-bg">
    <div class="flex flex-col bg-bg text-text gap-12 py-12 px-10">
      <div>
        <p class="font-bold text-3xl">Zweryfikuj się</p>
      </div>
      <div>
        <div>You're almost there! We sent an email to</div>
        <div class="font-bold text-2xl">member@email.com</div>
      </div>
      <div>
        <div>Just click on the link in that email to complete your signup.<br>If you don't see it, you may need to check your spam folder.</div>
      </div>
      <button class="bg-primary hover:bg-primary-hover text-text-primary font-bold text-xl cursor-pointer py-6 px-14 rounded-sm">
        Resend verification code
      </button>
    </div>
  </div>
</template>
