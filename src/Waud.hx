import js.html.HTMLDocument;
import js.html.AudioElement;
import js.Browser;

@:expose @:keep class Waud {

	public static var isWebAudioSupported:Bool;
	public static var isHTML5AudioSupported:Bool;
	public static var audioManager:AudioManager;
	public static var defaults:WaudSoundOptions = {};
	public static var sounds:Map<String, IWaudSound>;
	public static var types:Map<String, String>;
	public static var dom:HTMLDocument;
	public static var preferredSampleRate:Int = 44100;
	public static var isMuted:Bool = false;

	static var audioElement:AudioElement;

	public static var __touchUnlockCallback:Void -> Void;

	public static function init(?d:HTMLDocument) {
		if (d == null) d = Browser.document;
		dom = d;
		audioElement = dom.createAudioElement();
		if (Waud.audioManager == null) Waud.audioManager = new AudioManager();
		isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		isHTML5AudioSupported = (Reflect.field(Browser.window, "Audio") != null);

		if (isWebAudioSupported) Waud.audioManager.createAudioContext();
		else if (!isHTML5AudioSupported) trace("no audio support in this browser");

		defaults.autoplay = false;
		defaults.loop = false;
		defaults.preload = "true";
		defaults.volume = 1;

		sounds = new Map();

		types = new Map();
		types.set("mp3", "audio/mpeg");
		types.set("ogg", "audio/ogg");
		types.set("wav", "audio/wav");
		types.set("aac", "audio/aac");
		types.set("m4a", "audio/x-m4a");
	}

	public static function autoMute() {
		var blur = function() {
			for (sound in sounds) sound.mute(true);
		};

		var focus = function() {
			if (!isMuted) for (sound in sounds) sound.mute(false);
		};

		var fm = new FocusManager();
		fm.focus = focus;
		fm.blur = blur;
	}

	public static function enableTouchUnlock(?callback:Void -> Void) {
		__touchUnlockCallback = callback;
		dom.ontouchend = Waud.audioManager.unlockAudio;
	}

	public static function mute(?val:Bool = true) {
		isMuted = val;
		for (sound in sounds) sound.mute(val);
	}

	public static function stop() {
		for (sound in sounds) sound.stop();
	}

	public static function getFormatSupportString():String {
		var support:String = "OGG: " + audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		support += ", WAV: " + audioElement.canPlayType('audio/wav; codecs="1"');
		support += ", MP3: " + audioElement.canPlayType('audio/mpeg;');
		support += ", AAC: " + audioElement.canPlayType('audio/aac;');
		support += ", M4A: " + audioElement.canPlayType('audio/x-m4a;');
		return support;
	}

	public static function isSupported():Bool {
		if (isWebAudioSupported == null || isHTML5AudioSupported == null) {
			isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
			isHTML5AudioSupported = (Reflect.field(Browser.window, "Audio") != null);
		}
		return (isWebAudioSupported || isHTML5AudioSupported);
	}

	public static function isOGGSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isWAVSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/wav; codecs="1"');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isMP3Supported():Bool {
		var canPlay = audioElement.canPlayType('audio/mpeg;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isAACSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/aac;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isM4ASupported():Bool {
		var canPlay = audioElement.canPlayType('audio/x-m4a;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}
}