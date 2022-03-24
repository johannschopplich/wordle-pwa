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
      class="fixed inset-0 bg-neutral-800 bg-opacity-50 translate-z-1 z-20"
    />

    <Transition>
      <div
        v-if="isOpen"
        :class="[
          'message',
          'fixed top-23 left-1/2 shadow-sm transition-opacity-250 -translate-x-1/2 translate-z-1 z-20',
          size === 'default' &&
            'bg-gray-800 text-white px-4 py-2 rounded-full dark:bg-white dark:text-gray-800',
          size === 'large' &&
            'bg-white text-gray-800 p-6 rounded-xl border-2 border-amber-800',
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
