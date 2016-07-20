# ![waud logo](https://raw.githubusercontent.com/adireddy/waud/dev/logo.png)
Web Audio Library with HTML5 audio fallback.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![haxelib](https://badge.fury.io/gh/adireddy%2Fwaud.svg)](http://lib.haxe.org/p/waud/)
[![npm version](https://badge.fury.io/js/waud.js.svg)](https://badge.fury.io/js/waud.js)
[![Build Status](https://travis-ci.org/adireddy/waud.svg?branch=dev)](https://travis-ci.org/adireddy/waud)
[![Code Climate](https://codeclimate.com/github/adireddy/waud/badges/gpa.svg)](https://codeclimate.com/github/adireddy/waud)
[![Code Climate Issues](https://img.shields.io/codeclimate/issues/github/adireddy/waud.svg)](https://codeclimate.com/github/adireddy/waud/issues)

- It is recommended to use same **sample rate** for all the audio files. Playing different **sample rate** files can cause issues on some devices.
- By default, **Waud** uses **44100** sample rate. If your audio files have a different sample rate then specify it using [**`Waud.preferredSampleRate`**](http://adireddy.github.io/docs/waud/classes/Waud.html#property_preferredSampleRate) property.

### Installation

`npm install waud.js`

For haxe users:

`haxelib install waud`

### [API Documentation](http://adireddy.github.io/docs/waud/)

### Example

Example: 
```js
var snd = new WaudSound("assets/loop.mp3", { autoplay: false, loop: true, volume: 0.5, onload: playBgSound });
```

### Base64 Data URI

Waud supports base64 decoding across all browsers including IE 9 and I recommend using this solution instead of audio sprite.

Use [waudbase64](https://github.com/adireddy/waudbase64) to generate base64 encoded JSON file.

```js
var base64pack = new WaudBase64Pack("assets/sounds.json", _onLoad);

function _onLoad(snds) {
  snds.get("assets/beep.mp3").play();
}
```

Waud also supports passing data URI string to `WaudSound`.

```js
//Note that the data URI used below is a sample string and not a valid sound
var base64Snd = new WaudSound("data:audio/mpeg;base64,//uQxAAAAAAAAAAAAASW5mbwAAAA8AAABEAABwpgADBwsLDxISF");
```

### Audio Sprite

Use [waudsprite](https://github.com/adireddy/waudsprite) to generate audio sprite.

```js
var audSprite = new WaudSound("assets/sprite.json");
audSprite.play("glass");
```

### Support

Browser & Mobile Device Testing provided by:

[![BrowserStack](http://adireddy.github.io/assets/browserstack.png)](https://www.browserstack.com)

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ |

### Issues

Found any bug? Please create a new [issue](https://github.com/adireddy/waud/issues/new).

### Demo

- [JavaScript](http://adireddy.github.io/demos/waud/js.html)
- [Haxe](http://adireddy.github.io/demos/waud/)
- [Base64](http://adireddy.github.io/demos/waud/base64.html)

### Usage

```js
Waud.init();
Waud.enableTouchUnlock(touchUnlock);
Waud.autoMute();

var bgSnd = new WaudSound("assets/loop.mp3", {
	"autoplay": false, "loop":true, "volume": 0.5, "onload": playBgSound
});

var snd2 = new WaudSound("assets/sound1.wav", {
	"autoplay": false,
	"loop":true,
	"onload": function (snd) { snd.play(); },
	"onend": function (snd) { console.log("ended"); },
	"onerror": function (snd) { console.log("error"); }
});

//Touch unlock event for iOS devices
function touchUnlock() {
	if (!bgSnd.isPlaying()) bgSnd.play();
}

function playBgSound(snd) {
	if (!snd.isPlaying()) snd.play();
}
```

### Licensing Information

<a rel="license" href="http://opensource.org/licenses/MIT">
<img alt="MIT license" height="40" src="http://upload.wikimedia.org/wikipedia/commons/c/c3/License_icon-mit.svg" /></a>

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.

### Contributor Code of Conduct ###

[Code of Conduct](https://github.com/CoralineAda/contributor_covenant) is adapted from [Contributor Covenant, version 1.4](http://contributor-covenant.org/version/1/4)
