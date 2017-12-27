# Consequences

[![Build Status](https://travis-ci.org/JosephDuffy/consequences.svg?branch=master)](https://travis-ci.org/JosephDuffy/consequences)
[![Build Status](https://ci.appveyor.com/api/projects/status/github/JosephDuffy/consequences/branch/master?branch=master&svg=true)](https://ci.appveyor.com/project/JosephDuffy/consequences/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/JosephDuffy/consequences/badge.svg?branch=master)](https://coveralls.io/github/JosephDuffy/consequences?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/JosephDuffy/consequences.svg)](https://greenkeeper.io/)

Consequences provides the scaffolding for automation.

This is achieved by loading globally installed addons, automatically performing actions based on a set of rules and triggers, and providing an HTTP interface to inspect and update the state of the application.

## Concept

On the surface Consequences does not offer a lot. From a user perspective it is comprised on:

- Variables - A value that can change, e.g. the brightness value of a light bulb, or the status of a motion sensor
- Condition - A rule that can be evaluated to either true of false, e.g. "the brightness of the lounge light bulb is 0"
- Action - Something that will change the state of the application, e.g. "set the brightness of the lounge light to 45%"

### Chains

With these basic concepts "chains" can be created, e.g. "when the lounge motion sensor detects motion, turn the lounge light bulb up to 65%".

Chains support multiple conditions and multiple branches, allowing for complex setups to be created with minimal effort, e.g.:

```
Motion Sensor (variable)
└── "detected motion" is true (condition)
    └── Lounge light bulb is off (condition)
        ├── The sun has set (condition)
        │   ├── Set the lounge light bulb's temperature to warm (action)
        │   └── Turn the lounge light bulb up to 70% (action)
        └── The has not set (condition)
            ├── Set the lounge light bulb's temperature to soft (action)
            └── Turn light bulb up to 30% (action)
```

## Status

This project is currently under development and is considered unstable. Until a stable 1.0 version is released I would recommend you do not use this project, unless you wish to contribute.

## Roadmap

- [X] Provide TypeScript types for addon authors
- [X] Load globally install addons
- [X] Provide a web API to retrieve and create addons
- [X] Provide a web API to retrieve the status of and modify variables
- [ ] Provide a web API to setup "chains" e.g. condition[1-*] => action
- [ ] Create a web GUI (in another project)

## License

Consequences is released until the MIT license. See the LICENSE file for the full license.