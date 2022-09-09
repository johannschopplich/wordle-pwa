<template>
  <header
    class="header sticky top-4 z-10 rounded-lg bg-stone-100 px-4 py-2 dark:bg-zinc-800"
  >
    <h1
      class="font-heading text-2xl tracking-wide text-amber-700 dark:text-amber-600"
    >
      {{ $t("title") }}
    </h1>
    <p class="font-500 -mt-1 text-xs uppercase">
      <span class="text-stone-400 dark:text-zinc-500">
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
