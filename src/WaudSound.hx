import js.html.XMLHttpRequest;
import haxe.Json;

@:expose @:keep class WaudSound implements IWaudSound {

	public var isSpriteSound:Bool;

	var _snd:IWaudSound;
	var _options:WaudSoundOptions;
	var _spriteData:AudioSprite;

	public function new(src:String, ?options:WaudSoundOptions = null) {
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}

		_options = options;

		if (src.indexOf(".json") > 0) {
			isSpriteSound = true;
			_loadSpriteJson(src);
		}
		else {
			isSpriteSound = false;
			_init(src);
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

	function _init(src:String) {
		if (Waud.isWebAudioSupported) _snd = new WebAudioAPISound(src, _options);
		else if (Waud.isHTML5AudioSupported) _snd = new HTML5Sound(src, _options);
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

	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties = null) {
		if (spriteName != null) {
			for (snd in _spriteData.sprite) {
				if (snd.name == spriteName) {
					soundProps = snd;
					break;
				}
			}
		}
		_snd.play(spriteName, soundProps);
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

	public function destroy() {
		_snd.destroy();
		_snd = null;
	}
}