import js.Browser;
import js.html.Uint8Array;
import js.html.ArrayBuffer;
import js.html.XMLHttpRequestResponseType;
import js.html.XMLHttpRequest;
import js.html.audio.GainNode;
import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioBuffer;

@:keep class WebAudioAPISound extends BaseSound implements IWaudSound {

	public var source:AudioBufferSourceNode;

	var _srcNodes:Array<AudioBufferSourceNode>;
	var _gainNodes:Array<Dynamic>;
	var _manager:AudioManager;
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
		_duration = d;
		_manager = Waud.audioManager;

		if (_b64.match(url)) {
			_decodeAudio(_base64ToArrayBuffer(url));
			url = "";
		}
		else if (_options.preload && !loaded) load();
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

	function _base64ToArrayBuffer(base64:String):ArrayBuffer {
		var raw = Browser.window.atob(base64.split(",")[1]);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));
		for (i in 0 ... rawLength) array[i] = raw.charCodeAt(i);
		return array.buffer;
	}

	function _onSoundLoaded(evt) {
		_decodeAudio(evt.target.response);
	}

	inline function _decodeAudio(data:ArrayBuffer) {
		_manager.audioContext.decodeAudioData(data, _decodeSuccess, _error);
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
		_duration = buffer.duration;
		if (_options.onload != null) _options.onload(this);
		if (_options.autoplay) play();
	}

	function _makeSource(buffer:AudioBuffer):AudioBufferSourceNode {
		var bufferSource:AudioBufferSourceNode = _manager.audioContext.createBufferSource();
		bufferSource.buffer = buffer;

		_gainNode = _manager.createGain();

		bufferSource.connect(_gainNode);
		bufferSource.playbackRate.value = rate;
		_gainNode.connect(_manager.masterGainNode);
		_manager.masterGainNode.connect(_manager.audioContext.destination);

		_srcNodes.push(bufferSource);
		_gainNodes.push(_gainNode);

		if (_muted) _gainNode.gain.value = 0;
		else _gainNode.gain.value = _options.volume;

		return bufferSource;
	}

	public function getDuration():Float {
		if (!_isLoaded) return 0;
		return _duration;
	}

	public function play(?sprite:String, ?soundProps:AudioSpriteSoundProperties):Int {
		spriteName = sprite;
		if (_isPlaying && _options.autostop) stop(spriteName);
		if (!_isLoaded) {
			trace("sound not loaded");
			return -1;
		}

		var start:Float = 0;
		var end:Float = -1;
		if (isSpriteSound && soundProps != null) {
			_currentSoundProps = soundProps;
			start = soundProps.start + _pauseTime;
			end = soundProps.duration;
		}
		var buffer = (_manager.bufferList != null) ? _manager.bufferList.get(url) : null;
		if (buffer != null) {
			source = _makeSource(buffer);

			if (start >= 0 && end > -1) _start(0, start, end)
			else {
				_start(0, _pauseTime, source.buffer.duration);
				source.loop = _options.loop;
			}

			_playStartTime = _manager.audioContext.currentTime;
			_isPlaying = true;
			source.onended = function() {
				_pauseTime = 0;
				_isPlaying = false;
				if (isSpriteSound && soundProps != null && soundProps.loop != null && soundProps.loop && start >= 0 && end > -1) {
					destroy();
					play(spriteName, soundProps);
				}
				else if (_options.onend != null) _options.onend(this);
			}
		}

		return _srcNodes.indexOf(source);
	}

	function _start(when:Float, offset:Float, duration:Float) {
		if (Reflect.field(source, "start") != null) {
			source.start(when, offset, duration);
		}
		else if (Reflect.field(source, "noteGrainOn") != null) {
			Reflect.callMethod(source, Reflect.field(source, "noteGrainOn"), [when, offset, duration]);
		}
		else if (Reflect.field(source, "noteOn") != null) {
			Reflect.callMethod(source, Reflect.field(source, "noteOn"), [when, offset, duration]);
		}
	}

	public function togglePlay(?spriteName:String) {
		if (_isPlaying) pause();
		else play();
	}

	public function isPlaying(?spriteName:String):Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		_options.loop = val;
		if (source != null) source.loop = val;
	}

	public function setVolume(val:Float, ?spriteName:String) {
		_options.volume = val;
		if (_gainNode == null || !_isLoaded || _muted) return;
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

	public function autoStop(val:Bool) {
		_options.autostop = val;
	}

	public function stop(?spriteName:String) {
		_pauseTime = 0;
		if (source == null || !_isLoaded || !_isPlaying) return;
		destroy();
	}

	public function pause(?spriteName:String) {
		if (source == null || !_isLoaded || !_isPlaying) return;
		destroy();
		_pauseTime += _manager.audioContext.currentTime - _playStartTime;
	}

	public function playbackRate(?val:Float, ?spriteName:String):Float {
		if (val == null) return rate;
		for (src in _srcNodes) {
			src.playbackRate.value = val;
		}
		return rate = val;
	}

	public function setTime(time:Float) {
		if (!_isLoaded || time > _duration) return;

		if (_isPlaying) {
			stop();
			_pauseTime = time;
			play();
		}
		else _pauseTime = time;
	}

	public function getTime():Float {
		if (source == null || !_isLoaded || !_isPlaying) return 0;
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
				Reflect.callMethod(src, Reflect.field(src, "noteOff"), [0]);
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