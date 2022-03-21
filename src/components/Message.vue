<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  size: "default" | "large";
}>();
</script>

<template>
  <Transition>
    <div
      v-if="isOpen"
      id="messageContainer"
      :class="[
        'message',
        'absolute left-1/2 shadow-lg -translate-x-1/2 transition-opacity-250 z-10',
        size === 'default' &&
          'top-12 bg-gray-800 text-white px-4 py-2 rounded-full',
        size === 'large' && 'top-20 bg-white p-6 rounded-xl',
      ]"
    >
      <div class="space-y-2xl text-center">
        <slot />
      </div>
    </div>
  </Transition>

  <div
    v-if="isOpen && size === 'large'"
    class="absolute inset-0 bg-gray-800 bg-opacity-50"
  />
</template>

<style scoped>
.message.v-leave-to {
  opacity: 0;
}
</style>
