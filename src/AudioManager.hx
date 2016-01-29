import js.html.AudioElement;
import js.html.SourceElement;
import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioContext;
import js.Browser;

class AudioManager {

	/**
	* Audio Types.
	*
	* @property types
	* @protected
	* @type {Map}
	*/
	public var types:Map<String, String>;

	/**
	* Audio Context instance.
	*
	* @property audioContext
	* @protected
	* @type {AudioContext}
	*/
	public var audioContext(default, null):AudioContext;

	/**
	* Audio buffer list.
	*
	* @property bufferList
	* @protected
	* @type {Map}
	*/
	public var bufferList:Map<String, Dynamic>;

	/**
	* Reference to playing sounds.
	*
	* @property playingSounds
	* @protected
	* @type {Map}
	*/
	public var playingSounds:Map<String, Dynamic>;

	/**
	* Audio Context Class determined based on the browser type. Refer {{#crossLink "AudioManager/checkWebAudioAPISupport:method"}}{{/crossLink}} method.
	*
	* @property AudioContextClass
	* @static
	* @private
	* @type {AudioContext|webkitAudioContext}
	*/
	static var AudioContextClass:Dynamic;

	/**
	* Audio Manager class instantiated in {{#crossLink "Waud/init:method"}}Waud.init{{/crossLink}} method.
	*
	* @class AudioManager
	* @constructor
	* @example
	* 		Waud.audioManager
	*/
	public function new() {
		bufferList = new Map();
		playingSounds = new Map();

		types = new Map();
		types.set("mp3", "audio/mpeg");
		types.set("ogg", "audio/ogg");
		types.set("wav", "audio/wav");
		types.set("aac", "audio/aac");
		types.set("m4a", "audio/x-m4a");
	}

	/**
	* Function to check web audio api support.
	*
	* Used by {{#crossLink "Waud/init:method"}}Waud.init{{/crossLink}} method.
	*
	* @method checkWebAudioAPISupport
	*/
	public function checkWebAudioAPISupport():Bool {
		if (Reflect.field(Browser.window, "AudioContext") != null) {
			AudioContextClass = Reflect.field(Browser.window, "AudioContext");
			return true;
		}
		else if (Reflect.field(Browser.window, "webkitAudioContext") != null) {
			AudioContextClass = Reflect.field(Browser.window, "webkitAudioContext");
			return true;
		}
		return false;
	}

	/**
	* Function to unlock audio on `touchend` event.
	*
	* Used by {{#crossLink "Waud/enableTouchUnlock:method"}}Waud.enableTouchUnlock{{/crossLink}} method.
	*
	* @method unlockAudio
	*/
	public function unlockAudio() {
		if (audioContext != null) {
			var bfr = audioContext.createBuffer(1, 1, Waud.preferredSampleRate);
			var src:AudioBufferSourceNode = audioContext.createBufferSource();
			src.buffer = bfr;
			src.connect(audioContext.destination);
			if (Reflect.field(src, "start") != null) src.start(0);
			else untyped __js__("src").noteOn(0);
			if (src.onended != null) src.onended = _unlockCallback;
			else haxe.Timer.delay(_unlockCallback, 1);
		}
		else {
			var audio:AudioElement = Browser.document.createAudioElement();
			var source:SourceElement = Browser.document.createSourceElement();
			source.src = "data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";
			audio.appendChild(source);
			Browser.document.appendChild(audio);
			audio.play();
			_unlockCallback();
		}
	}

	inline function _unlockCallback() {
		if (Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
		Waud.dom.ontouchend = null;
	}

	/**
	* Function to create audio context.
	*
	* Used by {{#crossLink "Waud/init:method"}}Waud.init{{/crossLink}} method.
	*
	* @method createAudioContext
	* @return AudioContext
	*/
	public function createAudioContext():AudioContext {
		if (audioContext == null) {
			try {
				if (AudioContextClass != null) audioContext = cast Type.createInstance(AudioContextClass, []);
			}
			catch(e:Dynamic) {
				audioContext = null;
			}
		}
		return audioContext;
	}

	/**
	* Function to close audio context and reset all variables.
	*
	* Used by {{#crossLink "Waud/destroy:method"}}Waud.destroy{{/crossLink}} method.
	*
	* @method destroy
	*/
	public function destroy() {
		if (audioContext != null && untyped __js__("this.audioContext").close != null && untyped __js__("this.audioContext").close != "") {
			untyped __js__("this.audioContext").close();
		}
		audioContext = null;
		bufferList = null;
		playingSounds = null;
		types = null;
	}

	/**
	* This function suspends the progression of time in the audio context, temporarily halting audio hardware access and reducing CPU/battery usage in the process.
	* This is useful if you want an application to power down the audio hardware when it will not be using an audio context for a while.
	*
	* @method suspendContext
	* @example
	*     Waud.audioManager.suspendContext();
	*/
	public function suspendContext() {
		if (audioContext != null) {
			if (untyped __js__("this.audioContext").suspend != null) untyped __js__("this.audioContext").suspend();
		}
	}

	/**
	* This function resumes the progression of time in an audio context that has previously been suspended.
	*
	* @method resumeContext
	* @example
	*     Waud.audioManager.resumeContext();
	*/
	public function resumeContext() {
		if (audioContext != null) {
			if (untyped __js__("this.audioContext").resume != null) untyped __js__("this.audioContext").resume();
		}
	}
}