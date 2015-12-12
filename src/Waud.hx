import js.html.audio.AudioBufferSourceNode;
import js.html.Document;
import js.html.audio.AudioContext;
import js.Browser;
import js.html.AudioElement;

@:expose @:keep class Waud {

	public static var audioManager:AudioManager;
	public static var webAudioAPI:Bool = false;
	public static var sampleRate:Int = 44100;
	public static var audioContext:AudioContext;
	public static var defaults:WaudSoundOptions = {};
	public static var sounds:Map<String, WaudSound>;
	public static var types:Map<String, String>;
	public static var touchUnlock:Void -> Void;

	static var ac:Dynamic = (Reflect.field(Browser.window, "AudioContext") != null) ? Reflect.field(Browser.window, "AudioContext") : Reflect.field(Browser.window, "webkitAudioContext");
	static var audioElement:AudioElement = Browser.document.createAudioElement();
	static var iOS:Bool = Utils.isiOS();
	static var unlocked:Bool = false;

	public static function init() {
		audioContext = createAudioContext();
		checkAudioContext(sampleRate);

		if (Waud.audioManager == null) Waud.audioManager = new AudioManager(audioContext);

		defaults.autoplay = false;
		defaults.loop = false;
		defaults.preload = "metadata";
		defaults.volume = 1;
		defaults.document = Browser.document;

		sounds = new Map();

		types = new Map();
		types.set("mp3", "audio/mpeg");
		types.set("ogg", "audio/ogg");
		types.set("wav", "audio/wav");
		types.set("aac", "audio/aac");
		types.set("m4a", "audio/x-m4a");

		if (iOS) Browser.document.addEventListener("touchend", unlockAudio, true);
		Browser.window.addEventListener("unload", destroyContext, true);
	}

	public static function mute(val:Bool) {
		for (sound in sounds) sound.mute(val);
	}

	public static function destroyContext() {
		if (audioContext != null) {
			if (untyped __js__("Waud.audioContext").close != null) untyped __js__("Waud.audioContext").close();
			audioContext = null;
		}
	}

	public static function suspendContext() {
		if (audioContext != null) {
			if (untyped __js__("Waud.audioContext").suspend != null) untyped __js__("Waud.audioContext").suspend();
		}
	}

	public static function resumeContext() {
		if (audioContext != null) {
			if (untyped __js__("Waud.audioContext").resume != null) untyped __js__("Waud.audioContext").resume();
		}
	}

	public static function getSupportString():String {
		var support:String = "OGG: " + audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		support += ", WAV: " + audioElement.canPlayType('audio/wav; codecs="1"');
		support += ", MP3: " + audioElement.canPlayType('audio/mpeg;');
		support += ", AAC: " + audioElement.canPlayType('audio/aac;');
		support += ", M4A: " + audioElement.canPlayType('audio/x-m4a;');
		return support;
	}

	static function createAudioContext():AudioContext {
		if (audioContext == null) {
			try {
				if (ac != null) audioContext = cast Type.createInstance(ac, []);
			}
			catch(e:Dynamic) {
				audioContext = null;
			}
		}
		return audioContext;
	}

	static function checkAudioContext(sampleRate:Int) {
		if (audioContext != null && audioContext.sampleRate != sampleRate) {
			destroyContext();
			audioContext = createAudioContext();
		}
	}

	static function unlockAudio() {
		if (unlocked || audioContext == null) return;
		var bfr = audioContext.createBuffer(1, 1, sampleRate);
		var src:Dynamic = audioContext.createBufferSource();
		src.buffer = bfr;
		src.connect(audioContext.destination);
		if (src.start != null) src.start(0);
		else src.noteOn(0);

		haxe.Timer.delay(function() {
			if(src.playbackState == src.PLAYING_STATE || src.playbackState == src.FINISHED_STATE) {
				unlocked = true;
				if (touchUnlock != null) touchUnlock();
				Browser.document.removeEventListener("touchend", unlockAudio, true);
			}
		}, 1);
	}

	public static inline function isSupported():Bool {
		return (audioElement.canPlayType != null);
	}

	public static function isOGGSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		return (isSupported() && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isWAVSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/wav; codecs="1"');
		return (isSupported() && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isMP3Supported():Bool {
		var canPlay = audioElement.canPlayType('audio/mpeg;');
		return (isSupported() && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isAACSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/aac;');
		return (isSupported() && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isM4ASupported():Bool {
		var canPlay = audioElement.canPlayType('audio/x-m4a;');
		return (isSupported() && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}
}