import haxe.Timer;
import js.html.SourceElement;
import js.html.AudioElement;

@:keep class HTML5Sound extends BaseSound implements IWaudSound {

	public var source:SourceElement;

	var _snd:AudioElement;
	var _tmr:Timer;
	var _pauseTime:Float;

	public function new(url:String, ?options:WaudSoundOptions = null, ?src:SourceElement) {
		super(url, options);
		_snd = Waud.dom.createAudioElement();
		if (src == null) _addSource(url);
		else _snd.appendChild(src);
		if (_options.preload) load();
		if (_b64.match(url)) url = "";
	}

	public function load(?callback:IWaudSound -> Void):IWaudSound {
		if (!_isLoaded) {
			_snd.autoplay = _options.autoplay;
			_snd.loop = _options.loop;
			_snd.volume = _options.volume;
			_snd.playbackRate = rate;

			if (callback != null) _options.onload = callback;

			if (_options.preload) _snd.preload = "auto";
			else _snd.preload = "metadata"; //none

			if (_options.onload != null) {
				_isLoaded = true;
				_snd.onloadeddata = function() {
					_options.onload(this);
				}
			}

			_snd.onplaying = function() {
				_isLoaded = true;
				_isPlaying = true;
			}

			_snd.onended = function() {
				_isPlaying = false;
				if (_options.onend != null) _options.onend(this);
			}

			if (_options.onerror != null) {
				_snd.onerror = function() {
					_options.onerror(this);
				}
			}

			_snd.load();
		}

		return this;
	}

	public function getDuration():Float {
		if (!_isLoaded) return 0;
		_duration = _snd.duration;
		return _duration;
	}

	function _addSource(url:String):SourceElement {
		source = Waud.dom.createSourceElement();
		source.src = url;

		if (Waud.audioManager.types.get(_getExt(url)) != null) source.type = Waud.audioManager.types.get(_getExt(url));
		_snd.appendChild(source);

		return source;
	}

	function _getExt(filename:String):String {
		return filename.split(".").pop();
	}

	public function setVolume(val:Float, ?spriteName:String) {
		if (val >= 0 && val <= 1) _options.volume = val;
		if (!_isLoaded) return;
		_snd.volume = _options.volume;
	}

	public function getVolume(?spriteName:String):Float {
		return _options.volume;
	}

	public function mute(val:Bool, ?spriteName:String) {
		if (!_isLoaded) return;
		_snd.muted = val;
		if (WaudUtils.isiOS()) {
			if (val && isPlaying()) {
				_muted = true;
				_snd.pause();
			}
			else if (_muted) {
				_muted = false;
				_snd.play();
			}
		}
	}

	public function toggleMute(?spriteName:String) {
		mute(!_muted);
	}

	public function play(?sprite:String, ?soundProps:AudioSpriteSoundProperties):Int {
		spriteName = sprite;
		if (!_isLoaded || _snd == null) {
			trace("sound not loaded");
			return -1;
		}
		if (_isPlaying) {
			if (_options.autostop) stop(spriteName);
			else {
				var n = cast(_snd.cloneNode(true), AudioElement);
				Timer.delay(n.play, 100);
			}
		}
		if (_muted) return -1;
		if (isSpriteSound && soundProps != null) {
			_snd.currentTime = _pauseTime == null ? soundProps.start : _pauseTime;
			if (_tmr != null) _tmr.stop();
			_tmr = Timer.delay(function() {
				if (soundProps.loop != null && soundProps.loop) {
					play(spriteName, soundProps);
				}
				else stop(spriteName);
			},
			Math.ceil(soundProps.duration * 1000));
		}
		Timer.delay(_snd.play, 100);
		_pauseTime = null;
		return 0;
	}

	public function togglePlay(?spriteName:String) {
		if (_isPlaying) pause();
		else play();
	}

	public function isPlaying(?spriteName:String):Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		if (!_isLoaded || _snd == null) return;
		_snd.loop = val;
	}

	public function autoStop(val:Bool) {
		_options.autostop = val;
	}

	public function stop(?spriteName:String) {
		if (!_isLoaded || _snd == null) return;
		_snd.currentTime = 0;
		_snd.pause();
		_isPlaying = false;
		if (_tmr != null) _tmr.stop();
	}

	public function pause(?spriteName:String) {
		if (!_isLoaded || _snd == null) return;
		_snd.pause();
		_pauseTime = _snd.currentTime;
		_isPlaying = false;
		if (_tmr != null) _tmr.stop();
	}

	public function playbackRate(?val:Float, ?spriteName:String):Float {
		if (val == null) return rate;
		_snd.playbackRate = val;
		return rate = val;
	}

	public function setTime(time:Float) {
		if (!_isLoaded || _snd == null || time > _snd.duration) return;
		_snd.currentTime = time;
	}

	public function getTime():Float {
		if (_snd == null || !_isLoaded || !_isPlaying) return 0;
		return _snd.currentTime;
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
		if (_snd != null) {
			_snd.pause();
			_snd.removeChild(source);
			source = null;
			_snd = null;
		}
		_isPlaying = false;
	}
}