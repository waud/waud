import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioContext;
import js.Browser;

class AudioManager {

	public var audioContext:AudioContext;
	public var bufferList:Map<String, Dynamic>;
	public var playingSounds:Map<String, Array<Dynamic>>;

	static var AudioContextClass:Dynamic;

	public function new() {
		bufferList = new Map();
		playingSounds = new Map();
	}

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

	public function unlockAudio() {
		if (audioContext == null) return;
		var bfr = audioContext.createBuffer(1, 1, Waud.preferredSampleRate);
		var src:AudioBufferSourceNode = audioContext.createBufferSource();
		src.buffer = bfr;
		src.connect(audioContext.destination);
		src.start(0);
		if (src.onended != null) src.onended = _unlockCallback;
		else haxe.Timer.delay(_unlockCallback, 1);
	}

	inline function _unlockCallback() {
		if (Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
		Browser.window.ontouchend = null;
	}

	public function createAudioContext() {
		if (audioContext == null) {
			try {
				if (AudioContextClass != null) audioContext = cast Type.createInstance(AudioContextClass, []);
			}
			catch(e:Dynamic) {
				audioContext = null;
			}
		}
	}

	public function iOSSafeSampleRateCheck() {
		if (audioContext != null && Waud.iOSSafeSampleRateCheck && audioContext.sampleRate != Waud.preferredSampleRate) {
			var bfr = audioContext.createBuffer(1, 1, Waud.preferredSampleRate);
			var src:AudioBufferSourceNode = audioContext.createBufferSource();
			src.buffer = bfr;
			src.connect(audioContext.destination);
			src.start(0);
			src.disconnect();
			destroyContext();
			createAudioContext();
		}
	}

	function _checkAudioContext(sampleRate:Int) {
		if (audioContext != null && audioContext.sampleRate != sampleRate) {
			destroyContext();
			createAudioContext();
		}
	}

	public function destroyContext() {
		if (audioContext != null) {
			if (untyped __js__("Waud.audioContext").close != null) untyped __js__("Waud.audioContext").close();
			audioContext = null;
		}
	}

	public function suspendContext() {
		if (audioContext != null) {
			if (untyped __js__("Waud.audioContext").suspend != null) untyped __js__("Waud.audioContext").suspend();
		}
	}

	public function resumeContext() {
		if (audioContext != null) {
			if (untyped __js__("Waud.audioContext").resume != null) untyped __js__("Waud.audioContext").resume();
		}
	}
}