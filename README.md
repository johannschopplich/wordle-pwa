<p align="center">
  <img src="./assets/images/header.png" alt="Logo of Wordle PWA" width="128" height="128">
</p>

<h3 align="center">Wordle PWA</h3>

<p align="center">
  Customizable Wordle app for your friends and family<br>
  <a href="https://wordle.byjohann.workers.dev"><strong>Explore the demo »</strong></a>
</p>

<br>

# Wordle PWA

A refactored and extended Vue app of [VVordle](https://github.com/yyx990803/vue-wordle) by Evan You, which itself is a implementation of the original [Wordle game](https://www.nytimes.com/games/wordle/index.html).

Built with [Nuxt](https://nuxt.com).

## Key Features

- 🐤 Beautiful interface
- 🎞 Custom answer sources (environment variables or Google Spreadsheet)
- ⌨️ Optional `umlauts` keyboard layout
- 🇫🇷 Supports french by sanitizing accented characters
- 💆‍♀️ Styled with [UnoCSS](https://github.com/unocss/unocss)

## Setup

1. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
2. Install dependencies using `pnpm install`
3. Start the development server using `pnpm run dev`
4. Visit [127.0.0.1:5173](http://127.0.0.1:5173/)

> [!NOTE]
> Enable [Take Over Mode](https://vuejs.org/guide/typescript/overview.html#takeover-mode) in Visual Studio Code.

## Usage

### Start Date

Especially for a custom word list you probably prefer to start the list by a date of your choice. Wordle PWA will calculate the difference between the current date and the start date and pick the answer at the array index based from the date difference.

```ini
NUXT_PUBLIC_STARTS_AT=2023-12-01
```

### Base64

You can make your own one-time Wordle and send it to friends by base64-encoding a word and include it as the URL query, e.g. [`wordle.byjohann.workers.dev/?anVsaWE=`](https://wordle.byjohann.workers.dev/?anVsaWE=). This will also allow words that are not in the dictionary.

### Custom Word List

#### Within `.env` File

A custom word list may be set in the app's `.env` file:

```ini
NUXT_PUBLIC_ANSWERS=birds,floor,umami
```

> [!NOTE]
> Remember to set a start date as well.

#### Words From Google Spreadsheet

Alternatively, the app will fetch words from any public Google spreadsheet if the following entries exist in the app's `.env` file:

```ini
NUXT_GOOGLE_API_KEY=...
NUXT_PUBLIC_GOOGLE_SHEETS_ID=1nO4y9FBuOr4_lA50rIldeWUAvqKYpcJYf5h1tpBybZU
NUXT_PUBLIC_GOOGLE_SHEETS_TABLE=Wordle 2023
```

## License

[MIT](./LICENSE) License © 2022-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

[MIT](./LICENSE) License © 2022 [Evan You](https://github.com/yyx990803)

The original creator(s) of Wordle own all applicable rights to the game itself.
