import js.html.XMLHttpRequest;
import haxe.Json;

@:expose @:keep class WaudSound implements IWaudSound {

	/**
	* Indicates if the sound is sprite sound or normal sound.
	*
	* @property isSpriteSound
	* @type {Bool}
	* @readOnly
	* @example
 	*     snd.isSpriteSound;
	*/
	public var isSpriteSound:Bool;

	var _snd:IWaudSound;
	var _options:WaudSoundOptions;
	var _spriteData:AudioSprite;

	/**
	* Class to automatically use web audio api with HTML5 audio fallback.
	*
	* @class WaudSound
	* @constructor
	* @param {String} url - Can be audio file path or JSON file for audio sprite.
	* @param {WaudSoundOptions} [options] - Sound options.
	* @example
	* 		// MP3 Sound
	* 		var snd = new WaudSound("assets/loop.mp3", { autoplay: false, loop: true, volume: 0.5, onload: _playBgSound });
	*
	* 		// Audio Sprite
	* 		var audSprite = new WaudSound("assets/sprite.json");
	* 		audSprite.play("glass");
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

	/**
	* Function to load audio sprite JSON.
	*
	* @private
	* @method _loadSpriteJson
	* @param {String} url - Audio Sprite JSON path.
	*/
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

	/**
	* Function to initialize sound.
	*
	* @private
	* @method _init
	* @param {String} url - Audio file path.
	*/
	function _init(url:String) {
		if (Waud.isWebAudioSupported) _snd = new WebAudioAPISound(url, _options);
		else if (Waud.isHTML5AudioSupported) _snd = new HTML5Sound(url, _options);
		else trace("no audio support in this browser");

		_snd.isSpriteSound = isSpriteSound;
	}

	/**
	* Function to set sound volume.
	*
	* @method setVolume
	* @param {Float} val - Should be between 0 and 1.
	* @example
	*     snd.setVolume(0.5);
	*/
	public function setVolume(val:Float) {
		_snd.setVolume(val);
	}

	/**
	* Function to get sound volume.
	*
	* @method getVolume
	* @return {Float} between 0 and 1
	* @example
	*     snd.getVolume();
	*/
	public function getVolume():Float {
		return _snd.getVolume();
	}

	/**
	* Function to mute sound.
	*
	* @method mute
	* @param {Bool} val
	* @example
	*     snd.mute(true);
	*/
	public function mute(val:Bool) {
		_snd.mute(val);
	}

	/**
	* Function to play the sound with optional sprite name when using audio sprite.
	*
	* @method play
	* @param {String} [spriteName] - Sprite name to play.
	* @return {IWaudSound} sound instance
	* @example
	*     snd.play();
	*     snd.play("bell");
	*/
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

	/**
	* Function to check if the sound is playing or not.
	*
	* @method isPlaying
	* @return {Bool} true or false
	* @example
	*     snd.isPlaying();
	*/
	public function isPlaying():Bool {
		return _snd.isPlaying();
	}

	/**
	* Function to loop or unloop sound.
	*
	* @method loop
	* @param {Bool} val
	* @example
	*     snd.loop(true);
	*/
	public function loop(val:Bool) {
		_snd.loop(val);
	}

	/**
	* Function to stop sound.
	*
	* @method stop
	* @example
	*     snd.stop();
	*/
	public function stop() {
		_snd.stop();
	}

	/**
	* Function to add callback that triggers on end of the sound.
	*
	* @method onEnd
	* @param {Function} callback - Callback function that triggers on end of the sound.
	* @return {IWaudSound} sound instance
	* @example
	*     snd.onEnd(callback);
	*/
	public function onEnd(callback:IWaudSound -> Void):IWaudSound {
		_snd.onEnd(callback);
		return this;
	}

	/**
	* Function to destroy sound.
	*
	* @method destroy
	* @example
	*     snd.destroy();
	*/
	public function destroy() {
		_snd.destroy();
		_snd = null;
	}
}