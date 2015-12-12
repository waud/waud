import js.html.Document;

class BaseSound {

	var _doc:Document;
	var _options:WaudSoundOptions;

	public function new(src:String, ?options:WaudSoundOptions = null) {
		if (Waud.defaults == null) {
			trace("Initialise Waud using Waud.init() before loading sounds");
			return;
		}
		if (options == null) options = {};
		_doc = (options.document != null) ? options.document : Waud.defaults.document;

		options.autoplay = (options.autoplay != null) ? options.autoplay : Waud.defaults.autoplay;
		options.loop = (options.loop != null) ? options.loop : Waud.defaults.loop;
		options.preload = (options.preload != null) ? options.preload : Waud.defaults.preload;
		options.volume = (options.volume != null && options.volume >= 0 && options.volume <= 1) ? options.volume : Waud.defaults.volume;

		_options = options;
	}
}