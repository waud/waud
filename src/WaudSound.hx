import js.html.audio.MediaElementAudioSourceNode;
import js.html.SourceElement;
import js.Browser;
import js.html.AudioElement;

@:expose @:keep class WaudSound extends BaseSound implements ISoundAPI {

	var sound:AudioElement;
	var source:SourceElement;

	public function new(src:String, ?options:WaudSoundOptions = null) {
		super(src, options);

		if (Waud.isSupported() && src != null && src != "") {
			sound = Browser.document.createAudioElement();
			sound.crossOrigin = "anonymous";
			if (Waud.webAudioAPI && Waud.audioContext != null) {
				if (Waud.audioContext != null) {
					source = cast Waud.audioContext.createMediaElementSource(sound);
					cast(source, MediaElementAudioSourceNode).connect(Waud.audioContext.destination);
				}
			}

			addSource(src);

			if (options.loop) sound.loop = true;
			if (options.autoplay) sound.autoplay = true;
			sound.volume = options.volume;

			if (Std.string(options.preload) == "true") sound.preload = "auto";
			else if (Std.string(options.preload) == "false") sound.preload = "none";
			else sound.preload = "metadata";

			if (options.onload != null) {
				sound.onloadeddata = function() {
					options.onload(this);
				}
			}

			if (options.onend != null) {
				sound.onended = function() {
					options.onend(this);
				}
			}

			if (options.onerror != null) {
				sound.onerror = function() {
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

		if (Waud.types.get(_getExt(src)) != null) source.type = Waud.types.get(_getExt(src));
		sound.appendChild(source);

		return source;
	}

	function _getExt(filename:String):String {
		return filename.split(".").pop();
	}

	public function setVolume(val:Float) {
		if (val >= 0 && val <= 1) {
			sound.volume = val;
			_options.volume = val;
		}
	}

	public function getVolume():Float {
		return _options.volume;
	}

	public function mute(val:Bool) {
		sound.muted = val;
	}

	public function play(?loop:Bool = false) {
		sound.play();
		sound.loop = loop;
	}

	public function stop() {
		sound.pause();
		sound.currentTime = 0;
	}
}