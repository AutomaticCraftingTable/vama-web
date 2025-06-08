<script setup lang="ts">
import axios from 'axios'
import {ref} from "vue"
const data = ref()
function f() {
  const url = 'http://127.0.0.1:3658/m1/829899-809617-default/api/home'
  axios.get(url).then(response => {
    console.log('Dane artykułu:', response.data)
    data.value=response.data.articles[0].tags
  }).catch(error => {
    console.error('Błąd podczas pobierania artykułu:', error)
  })
}
f()
</script>

<template>
  <span
    class="bg-secondary text-text rounded px-3 py-1 text-xs font-bold"
    tabindex="0"
  >
    {{data}}
  </span>
</template>
