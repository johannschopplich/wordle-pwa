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
      class="translate-z-1 fixed inset-0 z-20 bg-neutral-800 bg-opacity-50"
    />

    <Transition>
      <div
        v-if="isOpen"
        :class="[
          'message',
          'top-23 transition-opacity-250 translate-z-1 fixed left-1/2 z-20 -translate-x-1/2 shadow-sm',
          size === 'default' &&
            'rounded-full bg-gray-800 px-4 py-2 text-white dark:bg-white dark:text-gray-800',
          size === 'large' &&
            'rounded-xl border-2 border-amber-800 bg-white p-6 text-gray-800',
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
