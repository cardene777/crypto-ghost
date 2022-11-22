## React & TypeScript

### Start

```sh
npx create-react-app front --template typescript
```

### Tailwind.CSS

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- index.CSS

```js
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Module

- TypeScript

```sh
npm install --save-dev typescript ts-loader webpack webpack-cli webpack-dev-server
```
