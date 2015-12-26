# ![waud logo](https://raw.githubusercontent.com/adireddy/waud/master/logo.png)
Web Audio Library with HTML5 audio fallback.

[![Build Status](https://travis-ci.org/adireddy/waud.svg?branch=master)](https://travis-ci.org/adireddy/waud) [![npm version](https://badge.fury.io/js/waud.js.svg)](https://badge.fury.io/js/waud.js)

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

### Installation ###

`npm install waud.js`

For haxe users:

`haxelib install waud`

### API Documentation ###

`Waud.init(?dom)` - To initialise the library, make sure you call this first. You can also pass an optional parent `DOM` element to it where all the HTML5 sonds will be appended and also used for touch events to unlock audio on iOS devices.

`Waud.enableTouchUnlock(?callback)` - Helper function to unlock audio on iOS devices. You can pass an optional callback which will be called on `touchend` event.

`Waud.isWebAudioSupported` & `Waud.isHTML5AudioSupported` to check web audio and HTML5 audio support.

The following functions can be used to check format support (returns true or false):

- `Waud.isOGGSupported()`
- `Waud.isWAVSupported()`
- `Waud.isMP3Supported()`
- `Waud.isAACSupported()`
- `Waud.isM4ASupported()`

`Waud.getFormatSupportString()` return a string with all the above support information.

There are 3 classes available for audio playback.

- `WaudSound` **(recommended)** - to automatically use web audio api with HTML5 audio fallback.
- `WebAudioAPISound` - to force web audio api
- `HTML5Sound` - to force HTML5 audio

`HTML5Sound` on iOS devices have some [limitations](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html) you should be aware of. Setting volume audio is not possible and mute is implemented by pausing and replaying the sound if it's already playing.

The following are the options available when creating sound instabce:

- `autoplay` - true or false (default: false)
- `loop` - true or false (default: false)
- `volume` - between 0 and 1 (default: 1)
- `onload` - callback function when the sounad is loaded with sound instance as parameter (default: none)
- `onend` - callback function when the sound playback ends with sound instance as parameter (default: none)
- `onerror` - callback function when there is an error in loading/decoding with sound instance as parameter (default: none)

Example: `new WaudSound("assets/loop.mp3", { autoplay: false, loop: true, volume: 0.5, onload: _playBgSound });`

Available functions on sound instance:

- `play()`
- `stop()`
- `mute(val)` - true or false
- `loop(val)` - true or false
- `setVolume(val)` - between 0 and 1
- `getVolume()` - returna value between 0 and 1
- `isPlaying()` - returns true or false

`Waud.sounds` will hold all the sounds that are loaded. To access any sound use `Waud.sounds.get(url)` where `url` is the path used to load the sound.

### Issues ###

Found any bug? Please create a new [issue](https://github.com/adireddy/waud/issues/new).

### Demo ###

[Sample](http://adireddy.github.io/demos/waud/)

Tested on:

| Device        | OS            | Browser        |
| ------------- |:-------------:| --------------:|
| iPad 2        | 6+            | Safari         |
| iPad Mini     | 9+            | Safari, Chrome |
| iPad Air 1    | 9+            | Safari, Chrome |

### Usage ###

##### Haxe #####

```haxe
class Main {

	var _bgSnd:IWaudSound;
	var _snd2:IWaudSound;

	public function new() {
		Waud.init();
        Waud.enableTouchUnlock(touchUnlock);
		_bgSnd = new WaudSound("assets/loop.mp3", { autoplay: false, loop: true, volume: 0.5, onload: _playBgSound });
		_snd2 = new WaudSound("assets/sound1.wav", {
			autoplay: false,
			loop: false,
			onload: function (snd) { snd.play(); },
			onend: function (snd) { trace("ended"); },
			onerror: function (snd) { trace("error"); }
		});
	}
	
	// for iOS devices
	function touchUnlock() {
		if (!_bgSnd.isPlaying()) _bgSnd.play();
	}
	
	function _playBgSound(snd:IWaudSound) {
		if (!snd.isPlaying()) snd.play();
	}
	
	static function main() {
		new Main();
	}
}
```

##### JavaScript #####

```js
Waud.init();
Waud.enableTouchUnlock(touchUnlock);
var _bgSnd = new WaudSound("assets/loop.mp3", {
	"autoplay": false, "loop":true, "volume": 0.5, "onload": _playBgSound
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
	if (_bgSnd.isPlaying()) _bgSnd.play();
}

function _playBgSound(snd) {
	if (!snd.isPlaying()) snd.play();
}
```

### Licensing Information ###

<a rel="license" href="http://opensource.org/licenses/MIT">
<img alt="MIT license" height="40" src="http://upload.wikimedia.org/wikipedia/commons/c/c3/License_icon-mit.svg" /></a>

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
