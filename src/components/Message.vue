<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  size: "default" | "large";
}>();
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && size === 'large'"
      class="absolute inset-0 bg-gray-800 bg-opacity-50 translate-z-1 z-20 dark:bg-zinc-800 dark:bg-opacity-50"
    />

    <Transition>
      <div
        v-if="isOpen"
        :class="[
          'message',
          'absolute left-1/2 shadow-lg transition-opacity-250 -translate-x-1/2 translate-z-1 z-20 dark:text-gray-800',
          size === 'default' &&
            'top-12 bg-gray-800 text-white px-4 py-2 rounded-full dark:bg-white',
          size === 'large' && 'top-24 bg-white p-6 rounded-xl',
        ]"
      >
        <div class="space-y-6 text-center">
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
