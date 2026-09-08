# nuxt-i18n-preload-frozen-messages

Reproduction for `@nuxtjs/i18n` 10.6.0: with `i18n.experimental.preload` enabled, every SSR
request that loads a locale a second time logs

```
Failed to load messages for locale "ar" TypeError: Cannot assign to read only property 'HOTELS' of object '#<Object>'
```

## Run

```sh
pnpm install
pnpm build
pnpm preview
```

In another shell:

```sh
curl -s http://localhost:3000/        > /dev/null
curl -s http://localhost:3000/en      > /dev/null
curl -s http://localhost:3000/en/about > /dev/null
```

## Expected

No warnings on the server.

## Actual

Four warnings across those three requests, each with a stack through `deepCopy` →
`Object.loadMessages` → `loadAndSetLocale`. Pages still render translated: the preload pass has
already installed every locale, so the throw only aborts a redundant re-merge.

Setting `experimental.preload: false` gives zero warnings.

## Cause

`cachedFunctionI18n` deep-freezes what it caches, and the preload plugin fills `ctx.messages`
from `vueI18n.global.messages`, so those entries are the frozen cached trees. A later
`ctx.loadMessages()` in the same request runs `deepCopy(messages, this.messages)` and writes into
a frozen object.
