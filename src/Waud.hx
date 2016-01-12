import js.html.HTMLDocument;
import js.html.AudioElement;
import js.Browser;

/**
* Web Audio Library with HTML5 audio fallback.
*
* @class Waud
*/
@:expose @:keep class Waud {

	/**
	* Tells whether web audio api is supported or not.
	* @property isWebAudioSupported
	* @static
	* @type {Bool}
	* @example
 	*     Waud.isWebAudioSupported;
	*/
	public static var isWebAudioSupported:Bool;

	/**
	* Tells whether html5 audio is supported or not.
	* @property isHTML5AudioSupported
	* @static
	* @type {Bool}
	* @example
 	*     Waud.isHTML5AudioSupported;
	*/
	public static var isHTML5AudioSupported:Bool;

	/**
	* Defaults properties used on sound.
	* @property defaults
	* @static
	* @type {WaudSoundOptions}
	* @example
 	*     Waud.defaults = { volume: 0.5, autoplay: true };
	*/
	public static var defaults:WaudSoundOptions = {
		autoplay: false,
		loop: false,
		preload: "true",
		volume: 1
	};

	/**
	* Holds all the sounds that are loaded.
	* @property sounds
	* @static
	* @type {Map<String, IWaudSound>}
	* @example
 	*     Waud.sounds.get("url");
	*/
	public static var sounds:Map<String, IWaudSound>;

	/**
	* Preferred sample rate used when creating buffer on audio context.
	* It is recommended to use audio files with same sample rate and set this value here.
	* @property preferredSampleRate
	* @static
	* @type {Int}
	* @example
 	*     Waud.preferredSampleRate = 44100;
	*/
	public static var preferredSampleRate:Int = 44100;

	public static var audioManager:AudioManager;
	public static var dom:HTMLDocument;

	static var audioElement:AudioElement;
	static var isMuted:Bool = false;

	public static var __touchUnlockCallback:Void -> Void;

	/**
	* To initialise the library, make sure you call this first.
	* You can also pass an optional parent DOM element to it where all the HTML5 sounds will be appended and also used for touch events to unlock audio on iOS devices.
	*
	* @static
	* @method init
	* @param {HTMLDocument} [d = document]
	* @example
 	*     Waud.init();
	*/
	public static function init(?d:HTMLDocument) {
		if (d == null) d = Browser.document;
		dom = d;
		audioElement = dom.createAudioElement();
		if (Waud.audioManager == null) Waud.audioManager = new AudioManager();
		isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		isHTML5AudioSupported = (Reflect.field(Browser.window, "Audio") != null);

		if (isWebAudioSupported) Waud.audioManager.createAudioContext();
		else if (!isHTML5AudioSupported) trace("no audio support in this browser");

		sounds = new Map();
	}

	/**
	* Helper function to automatically mute audio when the browser window is not in focus.
	* Will un-mute when the window gains focus.
	*
	* @static
	* @method autoMute
	* @example
 	*     Waud.autoMute();
	*/
	public static function autoMute() {
		var blur = function() {
			for (sound in sounds) sound.mute(true);
		};

		var focus = function() {
			if (!isMuted) for (sound in sounds) sound.mute(false);
		};

		var fm = new WaudFocusManager();
		fm.focus = focus;
		fm.blur = blur;
	}

	/**
	* Helper function to unlock audio on iOS devices.
	* You can pass an optional callback which will be triggered on `touchend` event.
	*
	* @static
	* @method enableTouchUnlock
	* @param {Function} [callback]
	* @example
 	*     Waud.enableTouchUnlock(callback);
	*/
	public static function enableTouchUnlock(?callback:Void -> Void) {
		__touchUnlockCallback = callback;
		dom.ontouchend = Waud.audioManager.unlockAudio;
	}

	/**
	* Helper function to mute all the sounds.
	*
	* @static
	* @method mute
	* @param {Bool} [val = true]
	* @example
	*     Waud.mute();
 	*     Waud.mute(true);
 	*     Waud.mute(false);
	*/
	public static function mute(?val:Bool = true) {
		isMuted = val;
		for (sound in sounds) sound.mute(val);
	}

	/**
	* Helper function to stop all the sounds.
	*
	* @static
	* @method stop
	* @example
	*     Waud.stop();
	*/
	public static function stop() {
		for (sound in sounds) sound.stop();
	}

	/**
	* Returns a string with all the format support information.
	*
	* @static
	* @method getFormatSupportString
	* @return {String} support string `OGG: probably, WAV: probably, MP3: probably, AAC: probably, M4A: maybe` (example)
	* @example
	*     Waud.getFormatSupportString();
	*/
	public static function getFormatSupportString():String {
		var support:String = "OGG: " + audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		support += ", WAV: " + audioElement.canPlayType('audio/wav; codecs="1"');
		support += ", MP3: " + audioElement.canPlayType('audio/mpeg;');
		support += ", AAC: " + audioElement.canPlayType('audio/aac;');
		support += ", M4A: " + audioElement.canPlayType('audio/x-m4a;');
		return support;
	}

	/**
	* Function to check whether audio is supported or not.
	*
	* @static
	* @method isSupported
	* @return {Bool} true or false
	* @example
	*     Waud.isSupported();
	*/
	public static function isSupported():Bool {
		if (isWebAudioSupported == null || isHTML5AudioSupported == null) {
			isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
			isHTML5AudioSupported = (Reflect.field(Browser.window, "Audio") != null);
		}
		return (isWebAudioSupported || isHTML5AudioSupported);
	}

	/**
	* Function to check `ogg` format support.
	*
	* @static
	* @method isOGGSupported
	* @return {Bool} true or false
	* @example
	*     Waud.isOGGSupported();
	*/
	public static function isOGGSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	/**
	* Function to check `wav` format support.
	*
	* @static
	* @method isWAVSupported
	* @return {Bool} true or false
	* @example
	*     Waud.isWAVSupported();
	*/
	public static function isWAVSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/wav; codecs="1"');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	/**
	* Function to check `mp3` format support.
	*
	* @static
	* @method isMP3Supported
	* @return {Bool} true or false
	* @example
	*     Waud.isMP3Supported();
	*/
	public static function isMP3Supported():Bool {
		var canPlay = audioElement.canPlayType('audio/mpeg;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	/**
	* Function to check `aac` format support.
	*
	* @static
	* @method isAACSupported
	* @return {Bool} true or false
	* @example
	*     Waud.isAACSupported();
	*/
	public static function isAACSupported():Bool {
		var canPlay = audioElement.canPlayType('audio/aac;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}

	/**
	* Function to check `m4a` format support.
	*
	* @static
	* @method isM4ASupported
	* @return {Bool} true or false
	* @example
	*     Waud.isM4ASupported();
	*/
	public static function isM4ASupported():Bool {
		var canPlay = audioElement.canPlayType('audio/x-m4a;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe"));
	}
}