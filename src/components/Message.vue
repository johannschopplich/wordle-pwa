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
      class="absolute inset-0 bg-gray-800 bg-opacity-50 translate-z-1"
    />

    <Transition>
      <div
        v-if="isOpen"
        :class="[
          'message',
          'absolute left-1/2 shadow-lg translate-z-1 -translate-x-1/2 transition-opacity-250 z-20',
          size === 'default' &&
            'top-12 bg-gray-800 text-white px-4 py-2 rounded-full',
          size === 'large' && 'top-20 bg-white p-6 rounded-xl',
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
