# Modules

A custom user module system. Every `.ts` file inside this folder following the template below will be installed automatically.

```ts
import type { UserModule } from "~/types";

export const install: UserModule = ({ app }) => {
  // Do something
};
```
