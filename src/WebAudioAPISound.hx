import js.html.XMLHttpRequestResponseType;
import js.html.XMLHttpRequest;
import js.html.audio.GainNode;
import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioBuffer;

@:keep class WebAudioAPISound extends BaseSound implements IWaudSound {

	var _srcNodes:Array<AudioBufferSourceNode>;
	var _gainNodes:Array<Dynamic>;
	var _manager:AudioManager;
	var _snd:AudioBufferSourceNode;
	var _gainNode:GainNode;
	var _playStartTime:Float;
	var _pauseTime:Float;
	var _currentSoundProps:AudioSpriteSoundProperties;

	public function new(url:String, ?options:WaudSoundOptions = null, ?loaded:Bool = false, ?d:Float = 0) {
		super(url, options);
		_playStartTime = 0;
		_pauseTime = 0;
		_srcNodes = [];
		_gainNodes = [];
		_currentSoundProps = null;
		_isLoaded = loaded;
		duration = d;
		_manager = Waud.audioManager;
		if (_options.preload && !loaded) load();
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

	function _onSoundLoaded(evt) {
		_manager.audioContext.decodeAudioData(evt.target.response, _decodeSuccess, _error);
	}

	function _error() {
		if (_options.onerror != null) _options.onerror(this);
	}

	function _decodeSuccess(buffer:AudioBuffer) {
		if (buffer == null) {
			trace("empty buffer: " + url);
			_error();
			return;
		}
		_manager.bufferList.set(url, buffer);
		_isLoaded = true;
		duration = buffer.duration;
		if (_options.onload != null) _options.onload(this);
		if (_options.autoplay) play();
	}

	function _makeSource(buffer:AudioBuffer):AudioBufferSourceNode {
		var source:AudioBufferSourceNode = _manager.audioContext.createBufferSource();
		source.buffer = buffer;
		if (untyped __js__("this._manager.audioContext").createGain != null) _gainNode = _manager.audioContext.createGain();
		else _gainNode = untyped __js__("this._manager.audioContext").createGainNode();

		source.connect(_gainNode);
		_gainNode.connect(_manager.audioContext.destination);
		_srcNodes.push(source);
		_gainNodes.push(_gainNode);

		if (_muted) _gainNode.gain.value = 0;
		else _gainNode.gain.value = _options.volume;

		return source;
	}

	override function get_duration():Float {
		if (!_isLoaded) return 0;
		return duration;
	}

	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):Int {
		if (_isPlaying) stop(spriteName);
		if (!_isLoaded) {
			trace("sound not loaded");
			return -1;
		}

		//if (_muted) return -1;
		var start:Float = 0;
		var end:Float = -1;
		if (isSpriteSound && soundProps != null) {
			_currentSoundProps = soundProps;
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
				if (Reflect.field(_snd, "start") != null) _snd.start(0, _pauseTime, _snd.buffer.duration);
				else untyped __js__("this._snd").noteGrainOn(0, _pauseTime, _snd.buffer.duration);
			}

			_playStartTime = _manager.audioContext.currentTime;
			_isPlaying = true;
			_snd.onended = function() {
				_pauseTime = 0;
				_isPlaying = false;
				if (isSpriteSound && soundProps != null && soundProps.loop != null && soundProps.loop && start >= 0 && end > -1) {
					destroy();
					play(spriteName, soundProps);
				}
				else if(_options.loop) {
					destroy();
					play();
				}
				if (_options.onend != null) _options.onend(this);
			}
		}

		return _srcNodes.indexOf(_snd);
	}

	public function togglePlay(?spriteName:String) {
		if (_isPlaying) pause();
		else play();
	}

	public function isPlaying(?spriteName:String):Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		if (_snd == null || !_isLoaded) return;
		_snd.loop = val;
	}

	public function setVolume(val:Float, ?spriteName:String) {
		_options.volume = val;
		if (_gainNode == null || !_isLoaded) return;
		_gainNode.gain.value = _options.volume;
	}

	public function getVolume(?spriteName:String):Float {
		return _options.volume;
	}

	public function mute(val:Bool, ?spriteName:String) {
		_muted = val;
		if (_gainNode == null || !_isLoaded) return;
		if (val) _gainNode.gain.value = 0;
		else _gainNode.gain.value = _options.volume;
	}

	public function toggleMute(?spriteName:String) {
		mute(!_muted);
	}

	public function stop(?spriteName:String) {
		_pauseTime = 0;
		if (_snd == null || !_isLoaded || !_isPlaying) return;
		destroy();
	}

	public function pause(?spriteName:String) {
		if (_snd == null || !_isLoaded || !_isPlaying) return;
		destroy();
		_pauseTime += _manager.audioContext.currentTime - _playStartTime;
	}

	public function setTime(time:Float) {
		if (!_isLoaded || time > duration) return;

		if (_isPlaying) {
			stop();
			_pauseTime = time;
			play();
		}
		else _pauseTime = time;
	}

	public function getTime():Float {
		if (_snd == null || !_isLoaded || !_isPlaying) return 0;
		return _manager.audioContext.currentTime - _playStartTime + _pauseTime;
	}

	public function onEnd(callback:IWaudSound -> Void, ?spriteName:String):IWaudSound {
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
		for (src in _srcNodes) {
			if (Reflect.field(src, "stop") != null) src.stop(0);
			else if (Reflect.field(src, "noteOff") != null) {
				try {
					untyped __js__("this.src").noteOff(0);
				}
				catch (e:Dynamic) {}
			}
			src.disconnect();
			src = null;
		}
		for (gain in _gainNodes) {
			gain.disconnect();
			gain = null;
		}
		_srcNodes = [];
		_gainNodes = [];

		_isPlaying = false;
	}
}