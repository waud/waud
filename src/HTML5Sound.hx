import js.html.SourceElement;
import js.html.AudioElement;
import js.Browser;

@:expose @:keep class HTML5Sound extends BaseSound implements ISound {

	var _snd:AudioElement;
	var _src:SourceElement;

	public function new(url:String, ?options:WaudSoundOptions = null) {
		super(url, options);

		if (Waud.isSupported() && url != null && url != "") {
			_snd = Browser.document.createAudioElement();
			addSource(url);

			if (options.autoplay) _snd.autoplay = true;
			_snd.volume = options.volume;

			if (Std.string(options.preload) == "true") _snd.preload = "auto";
			else if (Std.string(options.preload) == "false") _snd.preload = "none";
			else _snd.preload = "metadata";

			if (options.onload != null) {
				_snd.onloadeddata = function() {
					options.onload(this);
				}
			}

			if (options.onend != null) {
				_snd.onended = function() {
					options.onend(this);
				}
			}

			if (options.onerror != null) {
				_snd.onerror = function() {
					options.onerror(this);
				}
			}

			Waud.sounds.set(url, this);

			_snd.load();
		}
	}

	function addSource(src:String):SourceElement {
		_src = Browser.document.createSourceElement();
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
	}

	public function play(?loop:Bool = false) {
		_snd.play();
		_snd.loop = loop;
	}

	public function loop(val:Bool) {
		_snd.loop = val;
	}

	public function stop() {
		_snd.pause();
		_snd.currentTime = 0;
	}
}