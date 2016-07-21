@:keep class BaseSound {

	public var isSpriteSound:Bool;
	public var url:String;
	public var duration(get, null):Float;
	public var spriteName:String;

	var _options:WaudSoundOptions;
	var _isLoaded:Bool;
	var _isPlaying:Bool;
	var _muted:Bool;
	var _b64:EReg;

	public function new(sndUrl:String, ?options:WaudSoundOptions = null) {
		_b64 = ~/(^data:audio).*(;base64,)/i;
		if (sndUrl == null || sndUrl == "") {
			trace("invalid sound url");
			return;
		}
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}
		duration = 0;
		isSpriteSound = false;
		url = sndUrl;
		_isLoaded = false;
		_isPlaying = false;
		_muted = false;
		if (options == null) options = {};

		options.autoplay = (options.autoplay != null) ? options.autoplay : Waud.defaults.autoplay;
		options.autostop = (options.autostop != null) ? options.autostop : Waud.defaults.autostop;
		options.webaudio = (options.webaudio != null) ? options.webaudio : Waud.defaults.webaudio;
		options.preload = (options.preload != null) ? options.preload : Waud.defaults.preload;
		options.loop = (options.loop != null) ? options.loop : Waud.defaults.loop;
		options.volume = (options.volume != null && options.volume >= 0 && options.volume <= 1) ? options.volume : Waud.defaults.volume;
		options.onload = (options.onload != null) ? options.onload : Waud.defaults.onload;
		options.onend = (options.onend != null) ? options.onend : Waud.defaults.onend;
		options.onerror = (options.onerror != null) ? options.onerror : Waud.defaults.onerror;

		_options = options;
	}

	function get_duration():Float {
		return 0;
	}

	public function isReady():Bool {
		return _isLoaded;
	}
}