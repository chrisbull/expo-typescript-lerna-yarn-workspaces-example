# Expo TypeScript Lerna Yarn Workspace Example

I'm creating this as an example project of to actually get expo, yarn, typescript,
lerna, and yarn workspaces to all work together correctly.

I'm sure, like so many others, you want to create a monto repo using expo and typescript, but no matter what you do,
you can't get expo to work the moment include it in your mono repo. And you may have even found the documentation on
how to use [`expo-yarn-workspaces`](https://github.com/expo/expo/tree/master/packages/expo-yarn-workspaces). But even
after following all the instructions to the letter it still doesn't work. If all of this, or some of this is true, then
you are just like me and dealing with the same issues I did.

But have no fear. Here is the quick and dirty instructions, that aren't clear in the expo instructions.

## NOTICE! - If you want to build from scratch by yourself you'll have to do work (Yes I know, it sucks). Or you canjust clone this already built repo and call it a day

---

## Steps to create yourself

If you are hardcore about figuring out what I did, here are the steps:

## 1. Setup your root folder this is going to contain your packge.json (aka the "Root Packager")

The primary purpose of the Root Packager is to house all the other micro projects you embed - and then make it easy for you to connect packages to eacthother

```$
mkdir my-expo-ts-mono-repo && cd my-expo-ts-mono-repo

yarn init -y

```

## 2. Make Your Root Package.json Look Like this

```json ./package.json
{
  "name": "my-expo-ts-mono-repo",
  "version": "1.0.0",
  "license": "MIT",
  "private": true,
  "scripts ": {
    "ios": "lerna run ios --scope=@app/mobile --stream --",
    "android": "lerna run android --scope=@app/mobile --stream --"
  },
  "workspaces": ["packages/*", "tools/expo-yarn-workspaces"],
  "devDependencies": {
    "expo-yarn-workspaces": "^1.1.0",
    "lerna": "^3.13.1",
    "typescript": "^3.3.4000"
  }
}
```

### Don't Run Yarn Yet (!)

## 2. Clone these files and paste them in a folder called "tools" -- NPM DOES NOT WORK FOR THIS!

```$
# inside of your root folder
svn export https://github.com/expo/expo/trunk/packages/expo-yarn-workspaces ./tools/expo-yarn-workspaces
```

Expo hasn't pushed the latest version of this package. You can't get expo-yarn-workspaces@1.1.0 so you have to clone and copy this over into your project manually

```json
// Note that we already have these in the ./package.json file
"tools/expo-yarn-workspaces"
// and
"expo-yarn-workspaces": "^1.1.0",
// So you don't have to do anything more here.
```

## 3. Make Your Expo App Inside of packages

```$
# inside of your root folder
mkdir packages && cd packages

expo init mobile
# when it asks you - name your poject whatever you like
# follow the instructions and let it create your app inside of the packages folder

# your project folder should be `mobile` if it's not, then change it!
alert "you should read this!" # ha just checking
```

## 4. Update your expo project package.json

** Your expo package.json file shoul look a little like this (but not as abbreviated) **

```json - ./packages/mobile/package.json
{
  "name": "mobile", // <-- change this
  "main": "__generated__/AppEntry.js", // <-- change this
  "version": "0.1.0", // <-- add this
  "scripts": {
    //... dont touch the above scripts
    "postinstall": "expo-yarn-workspaces postinstall" // <-- add this
  },
  "dependencies": {
    //... don't touch these
  },
  "devDependencies": {
    //... don't touch these
  },
  "private": true // <-- add or verify this
}
```

## 5. Create a `rn-cli.config.js` file and save it in your expo project folder

```js - ./packages/mobile/rn-cli.config.js
const { createReactNativeConfiguration } = require('expo-yarn-workspaces')
module.exports = createReactNativeConfiguration(__dirname)
```

## 6. Add this to your `app.json` file INSIDE the `"expo"` section

```json - ./packages/mobile/app.json
"packagerOpts": {
  "config": "rn-cli.config.js"
}
```

so it should look like ...

```json - ./packages/mobile/package.json
{
  "expo": {
    // ... a bunch of stuff
    "packagerOpts": {
      "config": "rn-cli.config.js"
    }
  }
}
```

## 7. Add lerna.json

create file lerna.json in root directory

```json - ./lerna.json
{
  "packages": ["packages/*"],
  "version": "independent",
  "npmClient": "yarn",
  "useWorkspaces": true
}
```

## 8. Add `.yarnrc` file to look like this

```bash - ./.yarnrc
workspaces-experimental true
```

## 9. Now you can run `yarn install` at the root folder

```$
yarn install
```

## 10. Let's get typescript running for expo

Now you can update your expo app to work typescript.

```$
# insdie ./packages/expo/
# move all your source files into a `src` folder
# then run (this will convert all your js and jsx files to ts and tsx)

npx js-to-ts-converter ./src/**/* # this kind of works. I basically do this by hand (yes it sucks)
# make sure to change all .js that have react components to .tsx

rm babel.config.js # we don't need this anymore
```

## Finished... that should be it. Happy coding!
