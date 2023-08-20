<script setup lang="ts">
defineProps<{
  isOpen: boolean
  size: 'default' | 'large'
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && size === 'large'"
      class="fixed inset-0 z-20 translate-z-1 bg-neutral-800 bg-opacity-50"
    />

    <Transition>
      <div
        v-if="isOpen"
        class="message fixed left-1/2 top-23 z-20 translate-z-1 shadow-sm transition-opacity-250 -translate-x-1/2"
        :class="[
          size === 'default' &&
            'rounded-full bg-gray-800 px-4 py-2 text-white dark:bg-white dark:text-gray-800',
          size === 'large' &&
            'border-2 border-primary-800 rounded-xl bg-white p-6 text-gray-800',
        ]"
      >
        <div class="text-center space-y-6">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.message.v-leave-to {
  opacity: 0;
}
</style>
