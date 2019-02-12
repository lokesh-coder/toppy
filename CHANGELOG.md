## [2.3.2](https://github.com/lokesh-coder/toppy/compare/v2.3.1...v2.3.2) (2019-02-12)

## [2.3.1](https://github.com/lokesh-coder/toppy/compare/v2.3.0...v2.3.1) (2019-02-10)

# [2.3.0](https://github.com/lokesh-coder/toppy/compare/v2.2.0...v2.3.0) (2019-01-05)


### Features

* add support to access host component instance ([6cf180a](https://github.com/lokesh-coder/toppy/commit/6cf180a))

# [2.2.0](https://github.com/lokesh-coder/toppy/compare/v2.1.0...v2.2.0) (2018-12-31)


### Features

* attach component custom props on initialize without ToppyOverlay ([e96a5f4](https://github.com/lokesh-coder/toppy/commit/e96a5f4))

# [2.1.0](https://github.com/lokesh-coder/toppy/compare/v2.0.5...v2.1.0) (2018-12-25)


### Bug Fixes

* re-render when nested dynamic component ([68f5844](https://github.com/lokesh-coder/toppy/commit/68f5844))


### Features

* add position classes to warpper element ([79fc1a5](https://github.com/lokesh-coder/toppy/commit/79fc1a5))
* add position classes to warpper element ([b8ffb44](https://github.com/lokesh-coder/toppy/commit/b8ffb44))

## [2.0.5](https://github.com/lokesh-coder/toppy/compare/v2.0.4...v2.0.5) (2018-12-24)

## [2.0.4](https://github.com/lokesh-coder/toppy/compare/v2.0.3...v2.0.4) (2018-12-20)


### Bug Fixes

* allow custom props to be accessed in host component ([9d8e4ba](https://github.com/lokesh-coder/toppy/commit/9d8e4ba))

## [2.0.3](https://github.com/lokesh-coder/toppy/compare/v2.0.2...v2.0.3) (2018-12-15)

## [2.0.2](https://github.com/lokesh-coder/toppy/compare/v2.0.1...v2.0.2) (2018-12-15)


### Bug Fixes

* incorrect signature in API ([c80658e](https://github.com/lokesh-coder/toppy/commit/c80658e))

## [2.0.1](https://github.com/lokesh-coder/toppy/compare/v2.0.0...v2.0.1) (2018-12-14)

# [2.0.0](https://github.com/lokesh-coder/toppy/compare/v1.3.1...v2.0.0) (2018-12-14)


### Bug Fixes

* remove unused components ([10a3fd8](https://github.com/lokesh-coder/toppy/commit/10a3fd8))
* ss class method [skip ci] ([521c2d1](https://github.com/lokesh-coder/toppy/commit/521c2d1))


### Features

* access custom props in Component, Template and Plain text contents ([b8550c8](https://github.com/lokesh-coder/toppy/commit/b8550c8))
* add template ref context ([e3e4ff1](https://github.com/lokesh-coder/toppy/commit/e3e4ff1)), closes [#19](https://github.com/lokesh-coder/toppy/issues/19)
* added support for custom key to reference later ([3901878](https://github.com/lokesh-coder/toppy/commit/3901878))
* include context data in templateref ([a865929](https://github.com/lokesh-coder/toppy/commit/a865929))


### BREAKING CHANGES

* API has been changed. `.overlay()` to `.position()` , `.host()` to `.content()` , `updateHost()` to `updateContent()` , `ToppyRef` to `ToppyControl`. Introduced `.config()`. Performance improvement.

## [1.3.1](https://github.com/lokesh-coder/toppy/compare/v1.3.0...v1.3.1) (2018-12-05)


### Bug Fixes

* **global position:** calculate proper left and top co-ordinates when `hostWidth` and `hostHeight` in percentage ([59dd68b](https://github.com/lokesh-coder/toppy/commit/59dd68b))

# [1.3.0](https://github.com/lokesh-coder/toppy/compare/v1.2.4...v1.3.0) (2018-12-04)


### Features

* **relative position:** added support for content sticking with target element when `autoUpdate` is set to true ([6fa37e7](https://github.com/lokesh-coder/toppy/commit/6fa37e7))

## [1.2.4](https://github.com/lokesh-coder/toppy/compare/v1.2.3...v1.2.4) (2018-11-28)


### Bug Fixes

* replace codeclimate with codecov config in travis ([af9d16f](https://github.com/lokesh-coder/toppy/commit/af9d16f))

## [1.2.3](https://github.com/lokesh-coder/toppy/compare/v1.2.2...v1.2.3) (2018-11-28)


### Bug Fixes

* **docs:** update font path ([29834a5](https://github.com/lokesh-coder/toppy/commit/29834a5))
* move artifacts after build ([d7ff131](https://github.com/lokesh-coder/toppy/commit/d7ff131))

## [1.2.2](https://github.com/lokesh-coder/toppy/compare/v1.2.1...v1.2.2) (2018-11-28)


### Bug Fixes

* updated vulnerable dependencies ([ace393d](https://github.com/lokesh-coder/toppy/commit/ace393d))
* **docs:** update icon fonts path ([eedca4c](https://github.com/lokesh-coder/toppy/commit/eedca4c))

## [1.2.1](https://github.com/lokesh-coder/toppy/compare/v1.2.0...v1.2.1) (2018-11-26)


### Bug Fixes

* **docs:** set font icons path properly ([1d26809](https://github.com/lokesh-coder/toppy/commit/1d26809))
* **docs:** set font icons path properly ([0ae8424](https://github.com/lokesh-coder/toppy/commit/0ae8424))

# [1.2.0](https://github.com/lokesh-coder/toppy/compare/v1.1.1...v1.2.0) (2018-11-24)


### Features

*  added new config prop 'bodyClassNameOnOpen' ([0e047bf](https://github.com/lokesh-coder/toppy/commit/0e047bf))
* add new config 'closeOnEsc' ([fc1577e](https://github.com/lokesh-coder/toppy/commit/fc1577e))
* added support to change content after create ([02182b3](https://github.com/lokesh-coder/toppy/commit/02182b3))
* added version selector in doc ([7554f7b](https://github.com/lokesh-coder/toppy/commit/7554f7b))
* minor improvements and fixes ([8152b1c](https://github.com/lokesh-coder/toppy/commit/8152b1c))

## [1.1.1](https://github.com/lokesh-coder/toppy/compare/v1.1.0...v1.1.1) (2018-11-22)


### Bug Fixes

* multiple toppy config override ([#8](https://github.com/lokesh-coder/toppy/issues/8)) ([ca0ce7e](https://github.com/lokesh-coder/toppy/commit/ca0ce7e))

# [1.1.0](https://github.com/lokesh-coder/toppy/compare/v1.0.18...v1.1.0) (2018-11-18)


### Features

* fade in content once position is updated ([3520ef6](https://github.com/lokesh-coder/toppy/commit/3520ef6))
* fade in content only after final position is updated ([abbfc8f](https://github.com/lokesh-coder/toppy/commit/abbfc8f))

## [1.0.18](https://github.com/lokesh-coder/toppy/compare/v1.0.17...v1.0.18) (2018-11-16)

## [1.0.17](https://github.com/lokesh-coder/toppy/compare/v1.0.16...v1.0.17) (2018-11-13)

## [1.0.16](https://github.com/lokesh-coder/toppy/compare/v1.0.15...v1.0.16) (2018-11-09)

## [1.0.15](https://github.com/lokesh-coder/toppy/compare/v1.0.14...v1.0.15) (2018-11-06)

## [1.0.14](https://github.com/lokesh-coder/toppy/compare/v1.0.13...v1.0.14) (2018-11-03)

## [1.0.13](https://github.com/lokesh-coder/toppy/compare/v1.0.12...v1.0.13) (2018-11-02)


### Bug Fixes

* override files on ghpages instead of replace ([d282266](https://github.com/lokesh-coder/toppy/commit/d282266))

## [1.0.12](https://github.com/lokesh-coder/toppy/compare/v1.0.11...v1.0.12) (2018-11-02)


### Bug Fixes

* add and sort details in package file ([6db7797](https://github.com/lokesh-coder/toppy/commit/6db7797))
* merge conflict resolve ([a412259](https://github.com/lokesh-coder/toppy/commit/a412259))

## [1.0.11](https://github.com/lokesh-coder/toppy/compare/v1.0.10...v1.0.11) (2018-11-01)


### Bug Fixes

* move archive logic to verfiyRelease stage ([cdce3c1](https://github.com/lokesh-coder/toppy/commit/cdce3c1))

## [1.0.10](https://github.com/lokesh-coder/toppy/compare/v1.0.9...v1.0.10) (2018-11-01)


### Bug Fixes

* archive version before publishing ([6dd714a](https://github.com/lokesh-coder/toppy/commit/6dd714a))

## [1.0.9](https://github.com/lokesh-coder/toppy/compare/v1.0.8...v1.0.9) (2018-11-01)


### Bug Fixes

* publish gh-pages with achived versions ([19a34c2](https://github.com/lokesh-coder/toppy/commit/19a34c2))

## [1.0.8](https://github.com/lokesh-coder/toppy/compare/v1.0.7...v1.0.8) (2018-11-01)


### Bug Fixes

* ghpages publish path ([f5d2f47](https://github.com/lokesh-coder/toppy/commit/f5d2f47))

## [1.0.7](https://github.com/lokesh-coder/toppy/compare/v1.0.6...v1.0.7) (2018-11-01)


### Bug Fixes

* set archive version properly ([b01d0ab](https://github.com/lokesh-coder/toppy/commit/b01d0ab))

## [1.0.6](https://github.com/lokesh-coder/toppy/compare/v1.0.5...v1.0.6) (2018-11-01)


### Bug Fixes

* archive doc build versions ([06226c4](https://github.com/lokesh-coder/toppy/commit/06226c4))

## [1.0.5](https://github.com/lokesh-coder/toppy/compare/v1.0.4...v1.0.5) (2018-11-01)


### Bug Fixes

* change gh pages publish package ([a5ef149](https://github.com/lokesh-coder/toppy/commit/a5ef149))

## [1.0.4](https://github.com/lokesh-coder/toppy/compare/v1.0.3...v1.0.4) (2018-11-01)


### Bug Fixes

* update build command in package json ([0ed8a10](https://github.com/lokesh-coder/toppy/commit/0ed8a10))

## [1.0.3](https://github.com/lokesh-coder/toppy/compare/v1.0.2...v1.0.3) (2018-11-01)


### Bug Fixes

* remove assets release in github ([8fb1ec8](https://github.com/lokesh-coder/toppy/commit/8fb1ec8))

## [1.0.2](https://github.com/lokesh-coder/toppy/compare/v1.0.1...v1.0.2) (2018-11-01)


### Bug Fixes

* release doc assets to github pages ([87b460b](https://github.com/lokesh-coder/toppy/commit/87b460b))

## [1.0.1](https://github.com/lokesh-coder/toppy.git/compare/v1.0.0...v1.0.1) (2018-11-01)

# 1.0.0 (2018-11-01)


### Bug Fixes

* package json scripts and travis ([bc4f996](https://github.com/lokesh-coder/toppy.git/commit/bc4f996))


### Features

* add support for ghpages auto publish ([a8c8b7c](https://github.com/lokesh-coder/toppy.git/commit/a8c8b7c))
* initial commit ([6464f1a](https://github.com/lokesh-coder/toppy.git/commit/6464f1a))
* **docs:** installation API update ([a80fab0](https://github.com/lokesh-coder/toppy.git/commit/a80fab0))
