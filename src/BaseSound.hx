@:keep class BaseSound {

	var _options:WaudSoundOptions;
	var _isPlaying:Bool;

	public function new(url:String, ?options:WaudSoundOptions = null) {
		if (url == null || url == "") {
			trace("invalid sound url");
			return;
		}
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}
		_isPlaying = false;
		if (options == null) options = {};

		options.autoplay = (options.autoplay != null) ? options.autoplay : Waud.defaults.autoplay;
		options.preload = (options.preload != null) ? options.preload : Waud.defaults.preload;
		options.loop = (options.loop != null) ? options.loop : Waud.defaults.loop;
		options.volume = (options.volume != null && options.volume >= 0 && options.volume <= 1) ? options.volume : Waud.defaults.volume;

		_options = options;
	}
}