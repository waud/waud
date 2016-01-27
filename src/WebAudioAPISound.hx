import js.html.XMLHttpRequestResponseType;
import js.html.XMLHttpRequest;
import js.html.audio.GainNode;
import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioBuffer;

@:keep class WebAudioAPISound extends BaseSound implements IWaudSound {

	var _manager:AudioManager;
	var _snd:AudioBufferSourceNode;
	var _gainNode:GainNode;
	var _playStartTime:Float;
	var _pauseTime:Float;

	public function new(url:String, ?options:WaudSoundOptions = null) {
		#if debug trace("using web audio - " + url); #end
		super(url, options);
		_playStartTime = 0;
		_pauseTime = 0;
		_manager = Waud.audioManager;
		if (_options.preload) load();
	}

	function _onSoundLoaded(evt) {
		_manager.audioContext.decodeAudioData(evt.target.response, _decodeSuccess, _error);
	}

	function _decodeSuccess(buffer:AudioBuffer) {
		if (buffer == null) {
			trace("empty buffer: " + url);
			_error();
			return;
		}
		_manager.bufferList.set(url, buffer);
		_isLoaded = true;
		if (_options.onload != null) _options.onload(this);
		if (_options.autoplay) play();
	}

	inline function _error() {
		if (_options.onerror != null) _options.onerror(this);
	}

	function _makeSource(buffer:AudioBuffer):AudioBufferSourceNode {
		var source:AudioBufferSourceNode = _manager.audioContext.createBufferSource();
		source.buffer = buffer;
		 if (untyped __js__("this._manager.audioContext").createGain != null) _gainNode = _manager.audioContext.createGain();
		 else _gainNode = untyped __js__("this._manager.audioContext").createGainNode();
		source.connect(_gainNode);
		_gainNode.connect(_manager.audioContext.destination);
		return source;
	}

	public function load(?callback:IWaudSound -> Void):IWaudSound {
		if (!_isLoaded) {
			var request = new XMLHttpRequest();
			request.open("GET", url, true);
			request.responseType = XMLHttpRequestResponseType.ARRAYBUFFER;
			request.onload = _onSoundLoaded;
			request.onerror = _error;
			request.send();

			if (callback != null) _options.onload = callback;
		}

		return this;
	}

	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):IWaudSound {
		if (!_isLoaded) {
			trace("sound not loaded");
			return this;
		}
		if (_muted) return this;
		if (_isPlaying) destroy();
		var start:Float = 0;
		var end:Float = -1;
		if (isSpriteSound && soundProps != null) {
			start = soundProps.start + _pauseTime;
			end = soundProps.duration;
		}
		var buffer = _manager.bufferList.get(url);
		if (buffer != null) {
			_snd = _makeSource(buffer);
			if (start >= 0 && end > -1) {
				if (Reflect.field(_snd, "start") != null) _snd.start(0, start, end);
				else {
					untyped __js__("this._snd").noteGrainOn(0, start, end);
				}
			}
			else {
				_snd.loop = _options.loop;
				if (Reflect.field(_snd, "start") != null) _snd.start(0, _pauseTime);
				else untyped __js__("this._snd").noteGrainOn(0, _pauseTime);
			}

			_playStartTime = _manager.audioContext.currentTime;
			_isPlaying = true;
			_snd.onended = function() {
				if (_pauseTime == 0) {
					if (isSpriteSound && soundProps != null && soundProps.loop && start >= 0 && end > -1) {
						play(spriteName, soundProps);
					}
					_isPlaying = false;
					if (_options.onend != null) _options.onend(this);
				}
			}

			if(_manager.playingSounds.get(url) == null) _manager.playingSounds.set(url, _snd);
		}

		return this;
	}

	public function isPlaying():Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		if (_snd == null || !_isLoaded) return;
		_snd.loop = val;
	}

	public function setVolume(val:Float) {
		if (_gainNode == null || !_isLoaded) return;
		_options.volume = val;
		_gainNode.gain.value = _options.volume;
	}

	public function getVolume():Float {
		return _options.volume;
	}

	public function mute(val:Bool) {
		_muted = val;
		if (_gainNode == null || !_isLoaded) return;
		if (val) _gainNode.gain.value = 0;
		else _gainNode.gain.value = _options.volume;
	}

	public function stop() {
		_pauseTime = 0;
		if (_snd == null || !_isLoaded || !_isPlaying) return;
		_isPlaying = false;
		if (Reflect.field(_snd, "stop") != null) _snd.stop(0);
		else untyped __js__("this._snd").noteOff(0);
	}

	public function pause() {
        if (_snd == null || !_isLoaded || !_isPlaying) return;
		_isPlaying = false;
		if (Reflect.field(_snd, "stop") != null) _snd.stop(0);
		else untyped __js__("this._snd").noteOff(0);
		_pauseTime += _manager.audioContext.currentTime - _playStartTime;
	}

	public function onEnd(callback:IWaudSound -> Void):IWaudSound {
		_options.onend = callback;
		return this;
	}

	public function onLoad(callback:IWaudSound -> Void):IWaudSound {
		_options.onload = callback;
		return this;
	}

	public function onError(callback:IWaudSound -> Void):IWaudSound {
		_options.onerror = callback;
		return this;
	}

	public function destroy() {
		if (_snd != null) {
			if (_isPlaying) {
				if (Reflect.field(_snd, "stop") != null) _snd.stop(0);
				else untyped __js__("this._snd").noteOff(0);
			}
			_snd.disconnect();
			_snd = null;
		}
		if (_gainNode != null) {
			_gainNode.disconnect();
			_gainNode = null;
		}
		_isPlaying = false;
	}
}