# Klbb: Phase 1

My first Phaser project!

## Requirements

* We need Node, so probs see if you've got it `node -v`.
 * If you don't, maybe install it using something like `nvm`. Here's a [handy guide to install it on macOS](https://tecadmin.net/install-nvm-macos-with-homebrew/).
* We also need Webpack!
 * If you don't have it, run `npm install --save-dev webpack`.

This is a [Phaser 3](https://github.com/photonstorm/phaser) starter with [TypeScript](https://www.typescriptlang.org/), [Rollup](https://rollupjs.org) with ⚡️ lightning fast HMR through [Vite](https://vitejs.dev/).

## Available Commands

| Command | Description |
|---------|-------------|
| `yarn install` | Install project dependencies |
| `yarn run dev` | Builds project and open web server, watching for changes |
| `yarn run build` | Builds code bundle with production settings  |
| `yarn run serve` | Run a web server to serve built code bundle |

## Development

After cloning the repo, run `yarn install` from your project directory. Then, you can start the local development
server by running `yarn dev` and navigate to http://localhost:3000.

## Production

After running `yarn build`, the files you need for production will be on the `dist` folder. To test code on your `dist` folder, run `yarn serve` and navigate to http://localhost:5000c` to kill **http-server** process. |
| `npm run dev` | Compile stuff to `dist` for deploying to places 