import js.Browser;
import js.html.audio.AudioBuffer;
import js.html.XMLHttpRequestResponseType;
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

	/**
	* Sound sprite name.
	*
	* @property spriteName
	* @type {String}
	* @readOnly
	* @example
 	*     snd.spriteName;
	*/
	public var spriteName:String;

	/**
	* Sound playback rate.
	*
	* @property rate
	* @type {Float}
	* @readOnly
	* @example
 	*     snd.rate;
	*/
	public var rate:Float;

	var _snd:IWaudSound;
	var _options:WaudSoundOptions;
	var _spriteData:AudioSprite;
	var _spriteSounds:Map<String, IWaudSound>;
	var _spriteSoundEndCallbacks:Map<String, IWaudSound -> Void>;
	var _spriteDuration:Float;

	/**
	* Class to automatically use web audio api with HTML5 audio fallback.
	*
	* @class WaudSound
	* @constructor
	* @param {String} url - Can be audio file path or JSON file for audio sprite.
	* @param {WaudSoundOptions} [options] - Sound options.
	* @example
	* 		// MP3 Sound
	* 		var snd = new WaudSound("assets/loop.mp3", { autoplay: false, loop: true, volume: 0.5 });
	*
	* 		// Force HTML5 Audio
	* 		var snd = new WaudSound("assets/loop.mp3", { webaudio: false });
	*
	* 		// Data URI
	* 		// Note that the data URI used below is a sample string and not a valid sound
	* 		var base64Snd = new WaudSound("data:audio/mpeg;base64,//uQxAAAAAAAAAAAAASW5mbwAAAA8AAABEAABwpgADBwsLDxISF");
	* 		base64Snd.play();
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

		rate = 1;
		_options = options;

		if (url.indexOf(".json") > 0) {
			isSpriteSound = true;
			_spriteDuration = 0;
			_spriteSounds = new Map();
			_spriteSoundEndCallbacks = new Map();
			_loadSpriteJson(url);
		}
		else {
			isSpriteSound = false;
			_init(url);
		}

		if (~/(^data:audio).*(;base64,)/i.match(url)) {
			Waud.sounds.set("snd" + Date.now().getTime(), this);
			url = "";
		}
		else Waud.sounds.set(url, this);
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
		xobj.open("GET", jsonUrl, true);
		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == 200) {
				_spriteData = Json.parse(xobj.responseText);
				var src = _spriteData.src;
				if (jsonUrl.indexOf("/") > -1) src = jsonUrl.substring(0, jsonUrl.lastIndexOf("/") + 1) + src;
				_init(src);
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
			if (isSpriteSound) _loadSpriteSound(url);
			else _snd = new WebAudioAPISound(url, _options);
		}
		else if (Waud.isHTML5AudioSupported) {
			if (_spriteData != null && _spriteData.sprite != null) {
				var loadCount = 0;
				var onLoad = (_options != null && _options.onload != null) ? _options.onload : null;

				var onLoadSpriteSound = function(snd:IWaudSound) {
					loadCount++;
					if (loadCount == _spriteData.sprite.length && onLoad != null) onLoad(snd);
				};

				var onErrorSpriteSound = function(snd:IWaudSound) {
					loadCount++;
					if (loadCount == _spriteData.sprite.length && onLoad != null) onLoad(snd);
				};

				if (_options == null) _options = {};
				_options.onload = onLoadSpriteSound;
				_options.onerror = onErrorSpriteSound;
				for (snd in _spriteData.sprite) {
					var sound = new HTML5Sound(url, _options);
					sound.isSpriteSound = true;
					_spriteSounds.set(snd.name, sound);
				}
			}
			else _snd = new HTML5Sound(url, _options);
		}
		else {
			trace("no audio support in this browser");
			return;
		}
	}

	/**
	* Function to get sound duration.
	*
	* @method getDuration
	* @return {Float} sound duration
	* @example
 	*     snd.getDuration();
	*/
	public function getDuration():Float {
		if (isSpriteSound) return _spriteDuration;
		if (_snd == null) return 0;
		return _snd.getDuration();
	}

	/**
	* Function to set sound volume.
	*
	* @method setVolume
	* @param {Float} val - Should be between 0 and 1.
	* @example
	*     snd.setVolume(0.5);
	*/
	public function setVolume(val:Float, ?spriteName:String) {
		if (Std.is(val, Int) || Std.is(val, Float)) {
			if (isSpriteSound) {
				if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].setVolume(val);
				return;
			}

			if (_snd == null) return;
			_snd.setVolume(val);
		}
		else Browser.console.warn("Volume should be a number between 0 and 1. Received: " + val);
	}

	/**
	* Function to get sound volume.
	*
	* @method getVolume
	* @return {Float} between 0 and 1
	* @example
	*     snd.getVolume();
	*/
	public function getVolume(?spriteName:String):Float {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) return _spriteSounds[spriteName].getVolume();
			return 0;
		}

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
	public function mute(val:Bool, ?spriteName:String) {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].mute(val);
			else {
				for (snd in _spriteSounds) snd.mute(val);
			}
			return;
		}

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
	public function toggleMute(?spriteName:String) {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].toggleMute();
			else {
				for (snd in _spriteSounds) snd.toggleMute();
			}
			return;
		}

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
		if (_snd == null || isSpriteSound) return null;
		_snd.load(callback);
		return this;
	}

	/**
	* Function to check if the sound is ready to be played.
	*
	* @method isReady
	* @return {Bool} true or false
	* @example
	*     snd.isReady();
	*/
	public function isReady():Bool {
		if (isSpriteSound) {
			for (snd in _spriteSounds) return snd.isReady();
		}
		return _snd.isReady();
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
		if (isSpriteSound) {
			if (spriteName != null) {
				for (snd in _spriteData.sprite) {
					if (snd.name == spriteName) {
						soundProps = snd;
						break;
					}
				}
				if (soundProps == null) return null;
				if (_spriteSounds[spriteName] != null) {
					return _spriteSounds[spriteName].play(spriteName, soundProps);
				}
			}
			else return null;
		}
		if (_snd == null) return null;
		return _snd.play(spriteName, soundProps);
	}

	/**
	* Function to automatically pause or play the sound.
	*
	* @method togglePlay
	* @param {String} [spriteName] - Sprite name to toggle play.
	* @example
	*     snd.togglePlay();
	*/
	public function togglePlay(?spriteName:String) {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].togglePlay();
			return;
		}

		if (_snd == null) return;
		_snd.togglePlay();
	}

	/**
	* Function to check if the sound is playing or not.
	*
	* @method isPlaying
	* @param {String} [spriteName] - Sprite name
	* @return {Bool} true or false
	* @example
	*     snd.isPlaying();
	*/
	public function isPlaying(?spriteName:String):Bool {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) return _spriteSounds[spriteName].isPlaying();
			return false;
		}

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
		if (_snd == null || isSpriteSound) return;
		_snd.loop(val);
	}

	/**
	* Function to automatically stop the sound if it's already playing or play the sound in a different channel.
	*
	* By default, sound will automatically stop if play is called on the sound that is already playing.
	*
	* @method autoStop
	* @param {Bool} val
	* @example
	*     snd.autoStop(false);
	*/
	public function autoStop(val:Bool) {
		if (_snd == null) return;
		_snd.autoStop(val);
	}

	/**
	* Function to stop sound.
	*
	* @method stop
	* @param {String} [spriteName] - Sprite name
	* @example
	*     snd.stop();
	*/
	public function stop(?spriteName:String) {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].stop();
			else {
				for (snd in _spriteSounds) snd.stop();
			}
		}
		else if (_snd != null) _snd.stop();
	}

	/**
	* Function to pause sound.
	*
	* @method pause
	* @param {String} [spriteName] - Sprite name to pause.
	* @example
	*     snd.pause();
	*/
	public function pause(?spriteName:String) {
		if (isSpriteSound) {
			if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].pause();
			else {
				for (snd in _spriteSounds) snd.pause();
			}
		}
		else if (_snd != null) _snd.pause();
	}

	/**
	* Function to set playback rate.
	*
	* @method playbackRate
	* @param {Float} [val] - playback rate.
	* @return {Float} current playback rate.
	* @example
	*     snd.playbackRate(1.25);
	*/
	public function playbackRate(?val:Float, ?spriteName:String):Float {
		if (val != null) {
			if (isSpriteSound) {
				if (spriteName != null && _spriteSounds[spriteName] != null) _spriteSounds[spriteName].playbackRate(val);
				else for (snd in _spriteSounds) snd.playbackRate(val);
			}
			else if (_snd != null) _snd.playbackRate(val);

			return rate = val;
		}
		return rate;
	}

	/**
	* Function to set playback position in seconds.
	*
	* **Not supported for audio sprites yet.**
	*
	* @method setTime
	* @param {Float} time - playback position in seconds.
	* @example
	*     snd.setTime(30);
	*/
	public function setTime(time:Float) {
		if (_snd == null || isSpriteSound) return;
		_snd.setTime(time);
	}

	/**
	* Function to get the current playback position in seconds.
	*
	* **Not supported for audio sprites yet.**
	*
	* @method getTime
	* @example
	*     snd.getTime();
	*/
	public function getTime():Float {
		if (_snd == null || isSpriteSound) return 0;
		return _snd.getTime();
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
	public function onEnd(callback:IWaudSound -> Void, ?spriteName:String):IWaudSound {
		if (isSpriteSound) {
			if (spriteName != null) _spriteSoundEndCallbacks.set(spriteName, callback);
			return this;
		}
		else if (_snd != null) {
			_snd.onEnd(callback);
			return this;
		}
		return null;
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
		if (_snd == null || isSpriteSound) return null;
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
		if (_snd == null || isSpriteSound) return null;
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
		if (isSpriteSound) {
			for (snd in _spriteSounds) snd.destroy();
		}
		else if (_snd != null) {
			_snd.destroy();
			_snd = null;
		}
	}

	function _loadSpriteSound(?url:String) {
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = XMLHttpRequestResponseType.ARRAYBUFFER;
		request.onload = _onSpriteSoundLoaded;
		request.onerror = _onSpriteSoundError;
		request.send();
	}

	function _onSpriteSoundLoaded(evt) {
		Waud.audioManager.audioContext.decodeAudioData(evt.target.response, _decodeSuccess, _onSpriteSoundError);
	}

	function _onSpriteSoundError() {
		if (_options != null && _options.onerror != null) _options.onerror(this);
	}

	function _decodeSuccess(buffer:AudioBuffer) {
		if (buffer == null) {
			_onSpriteSoundError();
			return;
		}
		Waud.audioManager.bufferList.set(url, buffer);
		_spriteDuration = buffer.duration;

		if (_options != null && _options.onload != null) _options.onload(this);

		for (snd in _spriteData.sprite) {
			var sound = new WebAudioAPISound(url, _options, true, buffer.duration);
			sound.isSpriteSound = true;
			_spriteSounds.set(snd.name, sound);
			sound.onEnd(_spriteOnEnd, snd.name);
		}
	}

	function _spriteOnEnd(snd:IWaudSound) {
		if (_spriteSoundEndCallbacks[snd.spriteName] != null) _spriteSoundEndCallbacks[snd.spriteName](snd);
	}
}