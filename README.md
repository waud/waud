# waud.js
[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
Web Audio Library with HTML5 audio fallback. 

### Installation ###

`npm install waud.js`

For haxe users:

`haxelib install waud`

### API Documentation ###

`Waud.init()` - To initialise the library, make sure you call this first.

`Waud.enableTouchUnlock(callback)` - Helper function to unlock audio on iOS.

`Waud.isWebAudioSupported` & `Waud.isAudioSupported` to check web audio and HTML5 audio support.

There are 3 classes available for audio playback.

- `WaudSound` **(recommended)** - to automatically use web audio api with HTML5 audio fallback.
- `WebAudioAPISound` - to force web audio api
- `HTML5Sound` - to force HTML5 audio

Available functions on sound instance:

- `play()`
- `stop()`
- `mute(true/false)`
- `loop(true/false)`
- `setVolume(val)` - between 0 and 1
- `getVolume()`
- `isPlaying()` - returns true/false

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

	var _bgSnd:ISound;
	var _snd2:ISound;

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
    
    function _playBgSound(snd:ISound) {
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
