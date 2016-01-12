import js.html.XMLHttpRequest;
import haxe.Json;

@:expose @:keep class WaudSound implements IWaudSound {

	public var isSpriteSound:Bool;

	var _snd:IWaudSound;
	var _options:WaudSoundOptions;
	var _spriteData:AudioSprite;

	/**
	* Class to automatically use web audio api with HTML5 audio fallback.
	*
	* @class WaudSound
	* @constructor
	* @param {String} url Can be audio file path or JSON file for audio sprite.
	*/
	public function new(url:String, ?options:WaudSoundOptions = null) {
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}

		_options = options;

		if (url.indexOf(".json") > 0) {
			isSpriteSound = true;
			_loadSpriteJson(url);
		}
		else {
			isSpriteSound = false;
			_init(url);
		}
	}

	function _loadSpriteJson(url:String) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open("GET", url, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == 200) {
				_spriteData = Json.parse(xobj.response);
				_init(_spriteData.src);
			}
		};
		xobj.send(null);
	}

	function _init(url:String) {
		if (Waud.isWebAudioSupported) _snd = new WebAudioAPISound(url, _options);
		else if (Waud.isHTML5AudioSupported) _snd = new HTML5Sound(url, _options);
		else trace("no audio support in this browser");

		_snd.isSpriteSound = isSpriteSound;
	}

	public function setVolume(val:Float) {
		_snd.setVolume(val);
	}

	public function getVolume():Float {
		return _snd.getVolume();
	}

	public function mute(val:Bool) {
		_snd.mute(val);
	}

	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties = null):IWaudSound {
		if (spriteName != null) {
			for (snd in _spriteData.sprite) {
				if (snd.name == spriteName) {
					soundProps = snd;
					break;
				}
			}
		}
		_snd.play(spriteName, soundProps);
		return this;
	}

	public function isPlaying():Bool {
		return _snd.isPlaying();
	}

	public function loop(val:Bool) {
		_snd.loop(val);
	}

	public function stop() {
		_snd.stop();
	}

	public function onEnd(callback:IWaudSound -> Void):IWaudSound {
		_snd.onEnd(callback);
		return this;
	}

	public function destroy() {
		_snd.destroy();
		_snd = null;
	}
}