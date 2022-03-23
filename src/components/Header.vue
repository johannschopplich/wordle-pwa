<template>
  <header
    class="header sticky top-4 bg-stone-100 px-4 py-2 rounded-lg z-10 dark:bg-zinc-800"
  >
    <h1
      class="text-2xl text-amber-700 font-heading tracking-wide dark:text-amber-600"
    >
      Osterwortsuche
    </h1>
    <p
      class="-mt-1 text-stone-400 text-xs font-500 uppercase dark:text-zinc-500"
    >
      Jeden Tag ein Wort
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
