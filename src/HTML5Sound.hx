import haxe.Timer;
import js.html.SourceElement;
import js.html.AudioElement;

@:keep class HTML5Sound extends BaseSound implements IWaudSound {

	var _snd:AudioElement;
	var _src:SourceElement;
	var _tmr:Timer;

	public function new(url:String, ?options:WaudSoundOptions = null) {
		#if debug trace("using html5 audio - " + url); #end
		super(url, options);
		_snd = Waud.dom.createAudioElement();
		_addSource(url);
		if (_options.preload) load();
	}

	public function load(?callback:IWaudSound -> Void):IWaudSound {
		if (!_isLoaded) {
			_snd.autoplay = _options.autoplay;
			_snd.loop = _options.loop;
			_snd.volume = _options.volume;

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

	function _addSource(url:String):SourceElement {
		_src = Waud.dom.createSourceElement();
		_src.src = url;

		if (Waud.audioManager.types.get(_getExt(url)) != null) _src.type = Waud.audioManager.types.get(_getExt(url));
		_snd.appendChild(_src);

		return _src;
	}

	function _getExt(filename:String):String {
		return filename.split(".").pop();
	}

	public function setVolume(val:Float) {
		if (!_isLoaded) return;
		if (val >= 0 && val <= 1) {
			_snd.volume = val;
			_options.volume = val;
		}
	}

	public function getVolume():Float {
		return _options.volume;
	}

	public function mute(val:Bool) {
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

	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):IWaudSound {
		if (!_isLoaded) {
			trace("sound not loaded");
			return this;
		}
		if (_muted) return this;
		if (isSpriteSound && soundProps != null) {
			_snd.currentTime = soundProps.start;
			if (_tmr != null) _tmr.stop();
			_tmr = Timer.delay(function() {
				if (soundProps.loop != null && soundProps.loop) {
					play(spriteName, soundProps);
				}
				else stop();
			}, Math.ceil(soundProps.duration * 1000));
		}
		_snd.play();
		return this;
	}

	public function isPlaying():Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		if (!_isLoaded) return;
		_snd.loop = val;
	}

	public function stop() {
		if (!_isLoaded) return;
		_snd.pause();
		_snd.currentTime = 0;
	}

	public function onEnd(callback:IWaudSound -> Void):IWaudSound {
		_options.onend = callback;
		return this;
	}

	public function onLoad(callback:IWaudSound -> Void):IWaudSound {
		_options.onload = callback;
		return this;
	}

	public function destroy() {
		if (_snd != null) {
			_snd.pause();
			_snd.removeChild(_src);
			_src = null;
			_snd = null;
		}
	}
}