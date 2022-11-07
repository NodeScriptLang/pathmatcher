# Pathmatcher

Path matching utils for pathname-based routing.

## Key features

- 🔥 Zero dependencies
- 👗 Very slim — just few hundred bytes gzipped
- ⚡️ Blazing fast
- 💻 Works in browser
- 🗜 Tidy and compact
- 🌳 Ergonomic
- 🔬 Strongly typed
- 💎 Very strict feature set

## Usage

```
import { matchPath } from '@flexent/pathmatcher';

matchPath('/users/{name}', '/users/joe');   // { name: 'joe' }
matchPath('/users/{name}', '/users/', );    // null — no match
matchPath('/users', '/users');              // {} — match with no parameters
matchPath('/users/', '/users');             // {} — note: trailing slashes are ignored both ways

// Prefix mode — match only the beginning of the path
matchPath('/users', '/users/foo', true);    // {} — match with no parameters
```
