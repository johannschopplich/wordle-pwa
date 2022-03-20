# Vue Wordle

> Forked from [VVordle](https://github.com/yyx990803/vue-wordle)

A Vue implementation of the [Wordle game](https://www.powerlanguage.co.uk/wordle/). This is just for fun and doesn't aim to 100% replicate the original.

## Make Your Own Wordle

You can make your own Wordle and send it to friends by base64-encoding a word and include it as the URL query, e.g. `more-wordle.netlify.app/?YmxpbXA=`. This will also allow words that are not in the dictionary.

Alternatively, you can add a custom word list to pick from to your loccal `.env` file and set a start date as well:

```
VITE_ANSWERS=first,scond,third
VITE_STARTS_AT=2022-04-01
```

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
