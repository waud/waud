import js.html.audio.AudioBufferSourceNode;
import js.html.Document;
import js.html.audio.AudioContext;
import js.Browser;
import js.html.AudioElement;

@:expose @:keep class Waud {

	public static var Sound:Class<WaudSound> = WaudSound;
	public static var webAudio:Bool;
	public static var sampleRate:Int = 44100;
	public static var audioContext:AudioContext;
	public static var defaults:WaudDefaults;
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

		webAudio = false;

		defaults = new WaudDefaults();
		defaults.autoplay = false;
		defaults.formats = [];
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

	public static function mute() {
		for (sound in sounds) sound.mute();
	}

	public static function unmute() {
		for (sound in sounds) sound.unmute();
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
		if (src.noteOn != null) src.noteOn(0);
		else src.start(0);

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

class WaudDefaults {
	public var autoplay:Bool;
	public var formats:Array<String>;
	public var loop:Bool;
	public var onload:WaudSound -> Void;
	public var onend:WaudSound -> Void;
	public var onerror:WaudSound -> Void;
	public var preload:String;
	public var volume:Int;
	public var document:Document;

	public function new() {}
}