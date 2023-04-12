<template>
  <header
    class="header sticky top-4 z-10 rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800"
  >
    <h1
      class="font-heading text-2xl tracking-wide text-amber-700 dark:text-white"
    >
      {{ $t("title") }}
    </h1>
    <p class="text-xs font-500 uppercase -mt-1">
      <span class="text-zinc-400 dark:text-zinc-500">
        {{ $t("header.currentRound") }}
      </span>
    </p>
  </header>
</template>

<style scoped>
.header {
  background-image: url("/images/header.png");
  background-position: calc(100% - 0.5rem) bottom;
  background-repeat: no-repeat;
  background-size: 3.5rem auto;
}
</style>
