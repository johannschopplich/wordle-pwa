<template>
  <header
    class="header sticky top-4 z-10 rounded-lg bg-zinc-100 px-4 py-2 dark:bg-zinc-800"
  >
    <h1
      class="font-heading text-primary-700 text-2xl tracking-wide dark:text-white"
    >
      {{ $t("title") }}
    </h1>
    <p class="font-500 -mt-1 text-xs uppercase">
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
