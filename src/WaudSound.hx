import js.html.audio.MediaElementAudioSourceNode;
import js.html.SourceElement;
import js.Browser;
import js.html.AudioElement;
import js.html.Document;

@:expose @:keep class WaudSound {

	public var volume(default, set):Float;

	var doc:Document;
	var pid:Int;
	var events:Array<Dynamic>;
	var supported:Bool;

	var sound:AudioElement;
	var source:SourceElement;

	public function new(src:String, ?options:WaudSoundOptions = null) {
		if (Waud.defaults == null) {
			trace("Initialise Waud using Waud.init() before loading sounds");
			return;
		}
		if (options == null) options = {};
		doc = (options.document != null) ? options.document : Waud.defaults.document;
		pid = 0;
		events = [];
		supported = Waud.isSupported();

		options.autoplay = (options.autoplay != null) ? options.autoplay : Waud.defaults.autoplay;
		options.formats = (options.formats != null) ? options.formats : Waud.defaults.formats;
		options.loop = (options.loop != null) ? options.loop : Waud.defaults.loop;
		options.preload = (options.preload != null) ? options.preload : Waud.defaults.preload;
		options.volume = (options.volume != null && options.volume >= 0 && options.volume <= 1) ? options.volume : Waud.defaults.volume;

		if (supported && src != null && src != "") {
			sound = Browser.document.createAudioElement();
			sound.crossOrigin = "anonymous";
			if (Waud.webAudioAPI && Waud.audioContext != null) {
				if (Waud.audioContext != null) {
					source = cast Waud.audioContext.createMediaElementSource(sound);
					cast(source, MediaElementAudioSourceNode).connect(Waud.audioContext.destination);
				}
			}

			if (options.formats.length > 0) for (format in options.formats) addSource(src + "." + format);
			else addSource(src);

			if (options.loop) sound.loop = true;
			if (options.autoplay) sound.autoplay = true;
			sound.volume = options.volume;

			if (Std.string(options.preload) == "true") sound.preload = "auto";
			else if (Std.string(options.preload) == "false") sound.preload = "none";
			else sound.preload = "metadata";

			if (options.onload != null) {
				sound.onloadeddata = function () {
					options.onload(this);
				}
			}

			if (options.onend != null) {
				sound.onended = function () {
					 options.onend(this);
				}
			}

			if (options.onerror != null) {
				sound.onerror = function () {
					options.onerror(this);
				}
			}

			Waud.sounds.set(src, this);

			sound.load();
		}
	}

	function addSource(src:String):SourceElement {
		source = Browser.document.createSourceElement();
		source.src = src;

		if (Waud.types.get(getExt(src)) != null) source.type = Waud.types.get(getExt(src));
		sound.appendChild(source);

		return source;
	}

	function getExt(filename:String):String {
		return filename.split(".").pop();
	}

	function set_volume(val:Float):Float {
		if (val >= 0 && val <= 1) sound.volume = val;
		return volume = val;
	}

	public function mute() {
		sound.muted = true;
	}

	public function unmute() {
		sound.muted = false;
	}

	public function loop() {
		sound.loop = true;
	}

	public function unloop() {
		sound.loop = false;
	}

	public function play() {
		sound.play();
	}

	public function stop() {
		sound.pause();
		sound.currentTime = 0;
	}
}

typedef WaudSoundOptions = {
	@:optional var autoplay:Bool;
	@:optional var formats:Array<String>;
	@:optional var loop:Bool;
	@:optional var onload:WaudSound -> Void;
	@:optional var onend:WaudSound -> Void;
	@:optional var onerror:WaudSound -> Void;
	@:optional var preload:Dynamic;
	@:optional var volume:Float;
	@:optional var document:Document;
}