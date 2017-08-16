@:keep class BaseSound {

	public var isSpriteSound:Bool;
	public var url:String;
	public var spriteName:String;
	public var rate:Float;

	var _options:WaudSoundOptions;
	var _isLoaded:Bool;
	var _isPlaying:Bool;
	var _muted:Bool;
	var _duration:Float;
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

		isSpriteSound = false;
		url = sndUrl;
		_isLoaded = false;
		_isPlaying = false;
		_muted = false;
		_duration = 0;
		_options = WaudUtils.setDefaultOptions(options);

		rate = _options.playbackRate;
	}

	public function isReady():Bool {
		return _isLoaded;
	}
}