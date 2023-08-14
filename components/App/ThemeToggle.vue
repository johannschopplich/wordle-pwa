<script setup lang="ts">
const mode = useLocalStorage<'light' | 'dark'>('app.color-scheme', 'light')

const isDark = computed({
  get() {
    return mode.value === 'dark'
  },
  set(v) {
    mode.value = v ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark')
  },
})

const toggleDark = useToggle(isDark)
</script>

<template>
  <button class="h-8 w-8" @click="toggleDark()">
    <div v-if="isDark" class="i-teenyicons:sun-solid align-middle" />
    <div v-else class="i-teenyicons:moon-solid align-middle" />
  </button>
</template>
