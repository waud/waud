# waud.js [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)
Web Audio Library

### Installation ###

`npm install waud.js`

For haxe users:

`haxelib install waud.js`

### API Documentation ###

coming soon

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

	public function new() {
		Waud.init();
		var snd1 = new WaudSound("assets/loop", { autoplay: false, formats: ["mp3"], loop: true, volume: 1});
		var snd2 = new WaudSound("assets/sound1.wav", {
			autoplay: false,
			loop: true,
			onload: function (snd) { trace("loaded"); },
			onend: function (snd) { trace("ended"); },
			onerror: function (snd) { trace("error"); }
		});

		snd1.play();
		snd2.play();

		//Touch unlock event for iOS devices
		Waud.touchUnlock = function() {
			snd1.play();
			snd2.play();
		}
	}

	static function main() {
		new Main();
	}
}
```

##### JavaScript #####

```js
Waud.init();
var snd1 = new Waud.Sound("assets/loop", {
        "autoplay": false, "formats": ["mp3"], "loop":true, "volume": 1
});

var snd2 = new Waud.Sound("assets/sound1.wav", {
    "autoplay": false,
    "loop":true,
    "onload": function (snd) { console.log("loaded"); },
    "onend": function (snd) { console.log("ended"); },
    "onerror": function (snd) { console.log("error"); }
});

snd1.play();
snd2.play();

//Touch unlock event for iOS devices
Waud.touchUnlock = function() {
    snd1.play();
    snd2.play();
}
```

### Licensing Information ###

<a rel="license" href="http://opensource.org/licenses/MIT">
<img alt="MIT license" height="40" src="http://upload.wikimedia.org/wikipedia/commons/c/c3/License_icon-mit.svg" /></a>

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.