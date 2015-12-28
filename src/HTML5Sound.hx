import haxe.Timer;
import js.html.SourceElement;
import js.html.AudioElement;

@:expose @:keep class HTML5Sound extends BaseSound implements IWaudSound {

	var _snd:AudioElement;
	var _src:SourceElement;
	var _muted:Bool;
	var _tmr:Timer;

	public function new(url:String, ?options:WaudSoundOptions = null) {
		super(url, options);
		_muted = false;
		_snd = Waud.dom.createAudioElement();
		_addSource(url);

		_snd.autoplay = _options.autoplay;
		_snd.loop = _options.loop;
		_snd.volume = _options.volume;

		if (Std.string(_options.preload) == "true") _snd.preload = "auto";
		else if (Std.string(_options.preload) == "false") _snd.preload = "none";
		else _snd.preload = "metadata";

		if (_options.onload != null) {
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

		Waud.sounds.set(url, this);

		_snd.load();
	}

	function _addSource(src:String):SourceElement {
		_src = Waud.dom.createSourceElement();
		_src.src = src;

		if (Waud.types.get(_getExt(src)) != null) _src.type = Waud.types.get(_getExt(src));
		_snd.appendChild(_src);

		return _src;
	}

	function _getExt(filename:String):String {
		return filename.split(".").pop();
	}

	public function setVolume(val:Float) {
		if (val >= 0 && val <= 1) {
			_snd.volume = val;
			_options.volume = val;
		}
	}

	public function getVolume():Float {
		return _options.volume;
	}

	public function mute(val:Bool) {
		_snd.muted = val;
		if (Utils.isiOS()) {
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

	public function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties) {
		stop();
		if (isSpriteSound && soundProps != null) {
			_snd.currentTime = soundProps.start;
			if (_tmr != null) _tmr.stop();
			_tmr = Timer.delay(function() {
				if (soundProps.loop != null && soundProps.loop) {
					play(spriteName, soundProps);
				}
				else stop();
			}, Math.ceil(soundProps.end * 1000));
		}
		_snd.play();
	}

	public function isPlaying():Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		_snd.loop = val;
	}

	public function stop() {
		_snd.pause();
		_snd.currentTime = 0;
	}

	public function onEnd(callback:IWaudSound -> Void) {
		_options.onend = callback;
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