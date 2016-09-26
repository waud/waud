import js.html.audio.AudioContext;
import js.html.HTMLDocument;
import js.html.AudioElement;
import js.Browser;

/**
* Web Audio Library with HTML5 audio fallback.
*
* @class Waud
*/
@:expose @:keep class Waud {

	static inline var PROBABLY:String = "probably";
	static inline var MAYBE:String = "maybe";

	/**
	* Version number.
	*
	* @property version
	* @static
	* @type {String}
	*/
	public static var version:String = "0.7.5";

	/**
	* Tells whether to use web audio api or not.
	*
	* You can use this to enable/disable web audio globally for all sounds.
	*
	* Note that you can also enable/disable web audio individually for each sound instance.
	*
	* @property useWebAudio
	* @static
	* @type {Bool}
	* @default true
	* @example
 	*     Waud.useWebAudio = false;
	*/
	public static var useWebAudio:Bool = true;

	/**
	* Tells whether web audio api is supported or not.
	*
	* @property isWebAudioSupported
	* @static
	* @type {Bool}
	* @readOnly
	* @example
 	*     Waud.isWebAudioSupported;
	*/
	public static var isWebAudioSupported(default, null):Bool;

	/**
	* Tells whether html5 audio is supported or not.
	*
	* @property isHTML5AudioSupported
	* @static
	* @type {Bool}
	* @readOnly
	* @example
 	*     Waud.isHTML5AudioSupported;
	*/
	public static var isHTML5AudioSupported(default, null):Bool;

	/**
	* Defaults properties used on sound.
	*
	* @property defaults
	* @static
	* @type {WaudSoundOptions}
	* @default { autoplay: false, loop: false, preload: true, webaudio: true, volume: 1 }
	* @example
 	*     Waud.defaults = { volume: 0.5, autoplay: true, preload: false };
	*/
	public static var defaults:WaudSoundOptions = {
		autoplay: false,
		autostop: true,
		loop: false,
		preload: true,
		webaudio: true,
		volume: 1
	};

	/**
	* Holds all the sounds that are loaded.
	*
	* @property sounds
	* @static
	* @type {Map<String, IWaudSound>}
	* @readOnly
	* @example
 	*     Waud.sounds.get("url");
	*/
	public static var sounds(default, null):Map<String, IWaudSound>;

	/**
	* Preferred sample rate used when creating buffer on audio context.
	*
	* It is recommended to use audio files with same sample rate and set the value used here.
	*
	* @property preferredSampleRate
	* @static
	* @type {Int}
	* @default 44100
	* @example
 	*     Waud.preferredSampleRate = 22050;
	*/
	public static var preferredSampleRate:Int = 44100;

	/**
	* Audio Manager instance.
	*
	* @property audioManager
	* @static
	* @type {AudioManager}
	* @readOnly
	*/
	public static var audioManager(default, null):AudioManager;

	/**
	* Audio Context reference.
	*
	* @property audioContext
	* @static
	* @type {AudioContext}
	* @readOnly
	*/
	public static var audioContext:AudioContext;

	/**
	* Audio Context sample rate.
	*
	* @property sampleRate
	* @static
	* @type {Float}
	*/
	public static var sampleRate(get, null):Float;

	/**
	* Document dom element used for appending sounds and touch events.
	*
	* @property dom
	* @static
	* @type {document}
	*/
	public static var dom(default, null):HTMLDocument;

	/**
	* State of audio, muted or not.
	*
	* @property isMuted
	* @static
	* @type {Bool}
	* @readOnly
	* @default false
	* @example
 	*     Waud.isMuted;
	*/
	public static var isMuted(default, null):Bool = false;

	/**
	* Touch unlock callback reference.
	*
	* @property __touchUnlockCallback
	* @static
	* @protected
	* @type {Function}
	*/
	public static var __touchUnlockCallback:Void -> Void;

	/**
	* Audio element used to check audio support.
	*
	* @property __audioElement
	* @static
	* @private
	* @type {AudioElement}
	* @readOnly
	*/
	static var __audioElement:AudioElement;

	/**
	* Focus Manager reference used for `autoMute` functionality.
	*
	* @property _focusManager
	* @static
	* @private
	* @type {WaudFocusManager}
	* @readOnly
	*/
	static var _focusManager:WaudFocusManager;

	/**
	* To initialise the library, make sure you call this first.
	*
	* You can also pass an optional parent DOM element to it where all the HTML5 sounds will be appended
	* and also used for touch events to unlock audio on iOS devices.
	*
	* @static
	* @method init
	* @param {HTMLDocument} [d = document]
	* @example
 	*     Waud.init();
	*/
	public static function init(?d:HTMLDocument) {
		if (__audioElement == null) {
			if (d == null) d = Browser.document;
			dom = d;
			__audioElement = dom.createAudioElement();
			if (Waud.audioManager == null) Waud.audioManager = new AudioManager();
			isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
			isHTML5AudioSupported = (Reflect.field(Browser.window, "Audio") != null);

			if (isWebAudioSupported) audioContext = Waud.audioManager.createAudioContext();

			sounds = new Map();
		}
	}

	/**
	* Helper function to automatically mute audio when the browser window is not in focus.
	*
	* Will un-mute when the window gains focus.
	*
	* @static
	* @method autoMute
	* @example
 	*     Waud.autoMute();
	*/
	public static function autoMute() {
		var blur = function() {
			if (sounds != null) for (sound in sounds) sound.mute(true);
		};

		var focus = function() {
			if (!isMuted && sounds != null) for (sound in sounds) sound.mute(false);
		};

		_focusManager = new WaudFocusManager();
		_focusManager.focus = focus;
		_focusManager.blur = blur;
	}

	/**
	* Helper function to unlock audio on iOS devices.
	*
	* You can pass an optional callback which will be triggered after unlocking audio.
	*
	* @static
	* @method enableTouchUnlock
	* @param {Function} [callback] - Optional callback that triggers after unlocking audio.
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
		if (sounds != null) for (sound in sounds) sound.mute(val);
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
		if (sounds != null) for (sound in sounds) sound.stop();
	}

	/**
	* Helper function to pause all the sounds.
	*
	* @static
	* @method pause
	* @example
	*     Waud.pause();
	*/
	public static function pause() {
		if (sounds != null) for (sound in sounds) sound.pause();
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
		var support:String = "OGG: " + __audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		support += ", WAV: " + __audioElement.canPlayType('audio/wav; codecs="1"');
		support += ", MP3: " + __audioElement.canPlayType('audio/mpeg;');
		support += ", AAC: " + __audioElement.canPlayType('audio/aac;');
		support += ", M4A: " + __audioElement.canPlayType('audio/x-m4a;');
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
		var canPlay = __audioElement.canPlayType('audio/ogg; codecs="vorbis"');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == PROBABLY || canPlay == MAYBE));
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
		var canPlay = __audioElement.canPlayType('audio/wav; codecs="1"');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == PROBABLY || canPlay == MAYBE));
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
		var canPlay = __audioElement.canPlayType('audio/mpeg;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == PROBABLY || canPlay == MAYBE));
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
		var canPlay = __audioElement.canPlayType('audio/aac;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == PROBABLY || canPlay == MAYBE));
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
		var canPlay = __audioElement.canPlayType('audio/x-m4a;');
		return (isHTML5AudioSupported && canPlay != null && (canPlay == PROBABLY || canPlay == MAYBE));
	}

	/**
	* Function to get current sample rate of audio context.
	*
	* @private
	* @static
	* @method get_sampleRate
	*/
	static function get_sampleRate():Float {
		return audioContext != null ? audioContext.sampleRate : 0;
	}

	/**
	* Function to destroy audio context.
	*
	* @static
	* @method destroy
	* @example
	*     Waud.destroy();
	*/
	public static function destroy() {
		if (sounds != null) for (sound in sounds) sound.destroy();
		sounds = null;
		if (Waud.audioManager != null) Waud.audioManager.destroy();
		Waud.audioManager = null;
		Waud.audioContext = null;
		__audioElement = null;
		if (_focusManager != null) {
			_focusManager.clearEvents();
			_focusManager.blur = null;
			_focusManager.focus = null;
		}
	}
}
