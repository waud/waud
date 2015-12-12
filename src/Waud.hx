import js.html.Document;
import js.Browser;
import js.html.AudioElement;

@:expose @:keep class Waud {

	public static var isWebAudioSupported:Bool;
	public static var isAudioSupported:Bool;
	public static var audioManager:AudioManager;
	public static var defaults:WaudSoundOptions = {};
	public static var sounds:Map<String, ISound>;
	public static var types:Map<String, String>;
	public static var dom:Document;

	public static var iOSSafeSampleRateCheck:Bool = true;
	public static var preferredSampleRate:Int = 44100;

	static var audioElement:AudioElement;
	static var unlocked:Bool = false;

	public static var __touchUnlockCallback:Void -> Void;

	public static function init(?d:Document) {
		if (d == null) d = Browser.document;
		dom = d;
		audioElement = Browser.document.createAudioElement();
		if (Waud.audioManager == null) Waud.audioManager = new AudioManager();
		isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		isAudioSupported = (Reflect.field(Browser.window, "Audio") != null);

		if (isWebAudioSupported) {
			Waud.audioManager.createAudioContext();
			if (Utils.isiOS()) Waud.audioManager.iOSSafeSampleRateCheck();
		}
		else if (!isAudioSupported) trace("no audio support in this browser");

		defaults.autoplay = false;
		defaults.loop = false;
		defaults.preload = "metadata";
		defaults.volume = 1;

		sounds = new Map();

		types = new Map();
		types.set("mp3", "audio/mpeg");
		types.set("ogg", "audio/ogg");
		types.set("wav", "audio/wav");
		types.set("aac", "audio/aac");
		types.set("m4a", "audio/x-m4a");
	}

	public static function enableTouchUnlock(callback:Void -> Void) {
		__touchUnlockCallback = callback;
		dom.addEventListener("touchend", Waud.audioManager.unlockAudio, true);
	}

	public static function mute(val:Bool) {
		for (sound in sounds) sound.mute(val);
	}

	public static function stop() {
		for (sound in sounds) sound.stop();
	}

	public static function getSupportString():String {
		var support:String = "OGG: " + audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		support += ", WAV: " + audioElement.canPlayType('audio/wav; codecs="1"');
		support += ", MP3: " + audioElement.canPlayType('audio/mpeg;');
		support += ", AAC: " + audioElement.canPlayType('audio/aac;');
		support += ", M4A: " + audioElement.canPlayType('audio/x-m4a;');
		return support;
	}

	public static function isOGGSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		return (isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isWAVSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/wav; codecs="1"');
		return (isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isMP3Supported():Bool {
		var canPlay = audioElement.canPlayType('audio/mpeg;');
		return (isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isAACSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/aac;');
		return (isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	public static function isM4ASupported():Bool {
		var canPlay = audioElement.canPlayType('audio/x-m4a;');
		return (isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}
}