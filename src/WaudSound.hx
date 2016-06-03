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

	/**
	* Sound url.
	*
	* @property url
	* @type {String}
	* @readOnly
	* @example
 	*     snd.url;
	*/
	public var url:String;

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
	* 		// Force HTML5 Audio
	* 		var snd = new WaudSound("assets/loop.mp3", { webaudio: false });
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

		Waud.sounds.set(url, this);
	}

	/**
	* Function to load audio sprite JSON.
	*
	* @private
	* @method _loadSpriteJson
	* @param {String} url - Audio Sprite JSON path.
	*/
	function _loadSpriteJson(jsonUrl:String) {
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open("GET", jsonUrl, true);
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
	function _init(soundUrl:String) {
		url = soundUrl;
		if (Waud.isWebAudioSupported && Waud.useWebAudio && (_options == null || _options.webaudio == null || _options.webaudio)) {
			_snd = new WebAudioAPISound(url, _options);
		}
		else if (Waud.isHTML5AudioSupported) {
			_snd = new HTML5Sound(url, _options);
		}
		else {
			trace("no audio support in this browser");
			return;
		}

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
		if (_snd == null) return;
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
		if (_snd == null) return 0;
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
		if (_snd == null) return;
		_snd.mute(val);
	}

	/**
	* Function to automatically mute or unmute the sound.
	*
	* @method toggleMute
	* @example
	*     snd.toggleMute();
	*/
	public function toggleMute() {
		if (_snd == null) return;
		_snd.toggleMute();
	}

	/**
	* Function to manually load the sound if `preload` was set to `false` with optional onload callback.
	*
	* @method load
	* @param {Function} [callback] - onload callback function.
	* @return {IWaudSound} sound instance
	* @example
	*     snd.load();
	*     snd.load(callback);
	*/
	public function load(?callback:IWaudSound -> Void):IWaudSound {
		if (_snd == null) return null;
		_snd.load(callback);
		return this;
	}

	/**
	* Function to play the sound with optional sprite name when using audio sprite.
	*
	* @method play
	* @param {String} [spriteName] - Sprite name to play.
	* @return {Int} sound id
	* @example
	*     snd.play();
	*     snd.play("bell");
	*/
	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties = null):Int {
		if (_snd == null) return null;
		if (spriteName != null) {
			for (snd in _spriteData.sprite) {
				if (snd.name == spriteName) {
					soundProps = snd;
					break;
				}
			}
		}
		return _snd.play(spriteName, soundProps);
	}

	/**
	* Function to automatically pause or play the sound.
	*
	* @method togglePlay
	* @example
	*     snd.togglePlay();
	*/
	public function togglePlay() {
		if (_snd == null) return;
		_snd.togglePlay();
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
		if (_snd == null) return false;
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
		if (_snd == null) return;
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
		if (_snd == null) return;
		_snd.stop();
	}

	/**
	* Function to pause sound.
	*
	* @method pause
	* @example
	*     snd.pause();
	*/
	public function pause() {
		if (_snd == null) return;
		_snd.pause();
	}

	/**
	* Function to add callback that triggers when the sound finishes playing.
	*
	* @method onEnd
	* @param {Function} callback - Callback function.
	* @return {IWaudSound} sound instance
	* @example
	*     snd.onEnd(callback);
	*/
	public function onEnd(callback:IWaudSound -> Void):IWaudSound {
		if (_snd == null) return null;
		_snd.onEnd(callback);
		return this;
	}

	/**
	* Function to add callback that triggers when the sound is loaded.
	*
	* @method onLoad
	* @param {Function} callback - Callback function.
	* @return {IWaudSound} sound instance
	* @example
	*     snd.onLoad(callback);
	*/
	public function onLoad(callback:IWaudSound -> Void):IWaudSound {
		if (_snd == null) return null;
		_snd.onLoad(callback);
		return this;
	}

	/**
	* Function to add callback that triggers when the sound fails to load or if it fails to decode when using web audio.
	*
	* @method onError
	* @param {Function} callback - Callback function.
	* @return {IWaudSound} sound instance
	* @example
	*     snd.onError(callback);
	*/
	public function onError(callback:IWaudSound -> Void):IWaudSound {
		if (_snd == null) return null;
		_snd.onError(callback);
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
		if (_snd == null) return;
		_snd.destroy();
		_snd = null;
	}
}