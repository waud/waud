# <a href="http://waudjs.com"><img class="logo" width="280" height="60" src="http://waud.github.io/images/logo/logo.png" alt="Waud"/></a>
Web Audio Library with HTML5 audio fallback.

[![Build Status](https://travis-ci.org/waud/waud.svg?branch=dev)](https://travis-ci.org/waud/waud)
[![npm version](https://badge.fury.io/js/waud.js.svg)](https://badge.fury.io/js/waud.js)
[![Code Climate](https://codeclimate.com/github/waud/waud/badges/gpa.svg)](https://codeclimate.com/github/waud/waud)
[![Issue Count](https://codeclimate.com/github/waud/waud/badges/issue_count.svg)](https://codeclimate.com/github/waud/waud/issues)

Waud is a simple and powerful web audio library that allows you to go beyond HTML5's `<audio>` tag and easily take advantage of [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). It abstracts Web Audio API making it consistent and reliable across multiple platforms and browsers. It also falls back to HTML5 Audio on non-modern browsers where Web Audio API is not supported.

### Features

- Base64 Pack
- Audio Sprites
- iOS Audio Unlock<sup>1</sup>
- Auto Mute<sup>2</sup>
- Simple API
- Zero Dependencies

<sup>1</sup> Automatically unlocks audio on iOS devices on first touch.

<sup>2</sup> Automatically mutes audio when the window is not in focus (switching tab, minimising window, etc).

<a href="https://www.patreon.com/user?u=5392234"><img id="patreon" class="patreon"
             src="http://waud.github.io/images/patreon.png" alt="support me on patreon" /></a>

### Installation

Available via npm, cdn and haxelib (for haxe users).

- NPM: [https://www.npmjs.com/package/waud.js](https://www.npmjs.com/package/waud.js)
- CDN: [https://cdnjs.com/libraries/waud.js](https://cdnjs.com/libraries/waud.js)
- Haxelib: [http://lib.haxe.org/p/waud](http://lib.haxe.org/p/waud)

[![NPM](https://nodei.co/npm/waud.js.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/waud.js/)

### [API Documentation](http://waud.github.io/api/)

### Example

Example: 
```js
var snd = new WaudSound("assets/loop.mp3", { autoplay: false, loop: true, volume: 0.5, onload: playBgSound });
```

### Base64 Data URI

Waud supports base64 decoding across all browsers including IE 9 and I recommend using this over audio sprites.

Use [waudbase64](https://github.com/waud/waudbase64) to generate base64 encoded JSON file.

`npm install -g waudbase64`

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

Use [waudsprite](https://github.com/waud/waudsprite) to generate audio sprite.

`npm install -g waudsprite`

```js
var audSprite = new WaudSound("assets/sprite.json");
audSprite.play("glass");
```

### Live Audio Stream

Waud supports live audio streams, but make sure to disable web audio as live streams can only be played through HTML5 Audio.

```js
var snd = new WaudSound("http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_p", { autoplay:true, webaudio:false });
````

### Browser Support

Tested on all major browsers.

| <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/safari/safari_32x32.png" alt="Safari"> | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/edge/edge_32x32.png" alt="Edge"> | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/archive/internet-explorer_9-11/internet-explorer_9-11_32x32.png" alt="IE"> | <img src="https://cdnjs.cloudflare.com/ajax/libs/browser-logos/39.1.1/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

Browser & Device Testing provided by:

[![BrowserStack](http://waud.github.io/images/browserstack.png)](https://www.browserstack.com)

### Issues

Found any bug? Please create a new [issue](https://github.com/waud/waud/issues/new).

### Demo

- [JavaScript](http://waud.github.io/sample/js.html)
- [Haxe](http://waud.github.io/sample/)
- [Base64](http://waud.github.io/sample/base64.html)

### Usage

```js
// Initialize Waud. Make sure to call this before loading sounds.
Waud.init();

// To automatically unlock audio on iOS devices by playing a blank sound.
// The parameter is a callback function that can be used to start playing sounds like background music.
Waud.enableTouchUnlock(touchUnlock);

// Use if you want to mute audio when the window is not in focus like switching tabs, minimising window, 
// etc in desktop and pressing home button, getting a call, etc on devices.
Waud.autoMute();

// Load and play looping background sound with autoPlay and loop set to true.
// Note that this will not play automatically in iOS devices without touching the screen.
var bgSnd = new WaudSound("loop.mp3", {
    "autoplay": true,
    "loop": true
});

//Touch unlock callback for iOS devices to start playing bgSnd it it's not already playing
function touchUnlock() {
    if (!bgSnd.isPlaying()) bgSnd.play();
}
```

### Sample Rate

- It is recommended to use same **sample rate** for all the audio files. Playing different **sample rate** files can cause issues on some devices.
- By default, **Waud** uses **44100** sample rate. If your audio files have a different sample rate then specify it using [**`Waud.preferredSampleRate`**](http://waud.github.io/api/classes/Waud.html#property_preferredSampleRate) property.

### Licensing Information

<a rel="license" href="http://opensource.org/licenses/MIT">
<img alt="MIT license" height="40" src="http://upload.wikimedia.org/wikipedia/commons/c/c3/License_icon-mit.svg" /></a>

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.

### Contributor Code of Conduct ###

[Code of Conduct](https://github.com/CoralineAda/contributor_covenant) is adapted from [Contributor Covenant, version 1.4](http://contributor-covenant.org/version/1/4)
