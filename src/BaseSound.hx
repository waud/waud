@:keep class BaseSound {

	public var isSpriteSound:Bool;
	public var url:String;

	var _options:WaudSoundOptions;
	var _isLoaded:Bool;
	var _isPlaying:Bool;
	var _muted:Bool;

	public function new(sndUrl:String, ?options:WaudSoundOptions = null) {
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
		if (options == null) options = {};

		options.autoplay = (options.autoplay != null) ? options.autoplay : Waud.defaults.autoplay;
		options.preload = (options.preload != null) ? options.preload : Waud.defaults.preload;
		options.loop = (options.loop != null) ? options.loop : Waud.defaults.loop;
		options.volume = (options.volume != null && options.volume >= 0 && options.volume <= 1) ? options.volume : Waud.defaults.volume;
		options.onload = (options.onload != null) ? options.onload : Waud.defaults.onload;
		options.onend = (options.onend != null) ? options.onend : Waud.defaults.onend;
		options.onerror = (options.onerror != null) ? options.onerror : Waud.defaults.onerror;

		_options = options;
	}
}