import js.html.XMLHttpRequestResponseType;
import js.html.XMLHttpRequest;
import js.html.audio.GainNode;
import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioBuffer;

@:expose @:keep class WebAudioAPISound extends BaseSound implements ISound {

	var _url:String;
	var _manager:AudioManager;
	var _snd:AudioBufferSourceNode;
	var _gainNode:GainNode;

	public function new(url:String, ?options:WaudSoundOptions = null) {
		super(url, options);

		_url = url;
		_manager = Waud.audioManager;

		var request = new XMLHttpRequest();
		request.open("GET", _url, true);
		request.responseType = XMLHttpRequestResponseType.ARRAYBUFFER;
		request.onload = _onSoundLoaded;
		request.onerror = _error;
		request.send();
	}

	function _onSoundLoaded(evt) {
		_manager.audioContext.decodeAudioData(evt.target.response, _decodeSuccess, _error);
	}

	function _decodeSuccess(buffer:AudioBuffer) {
		if (buffer == null) {
			trace("empty buffer: " + _url);
			_error();
			return;
		}
		_manager.bufferList.set(_url, buffer);
		if (_options.onload != null) _options.onload(this);
		if (_options.autoplay) play(_options.loop);
	}

	inline function _error() {
		if (_options.onerror != null) _options.onerror(this);
	}

	function _makeSource(buffer:AudioBuffer):AudioBufferSourceNode {
		var source:AudioBufferSourceNode = _manager.audioContext.createBufferSource();
		_gainNode = _manager.audioContext.createGain();
		_gainNode.gain.value = _options.volume;
		source.buffer = buffer;
		source.connect(_gainNode);
		_gainNode.connect(_manager.audioContext.destination);
		return source;
	}

	public function play(?loop:Bool = false) {
		var buffer = _manager.bufferList.get(_url);
		if (buffer != null) {
			_snd = _makeSource(buffer);
			_snd.loop = loop;
			_snd.start(0);

			if(_manager.playingSounds.get(_url) == null) _manager.playingSounds.set(_url, []);
			_manager.playingSounds.get(_url).push(_snd);
		}
	}

	public function loop(val:Bool) {
		_snd.loop = val;
	}

	public function setVolume(val:Float) {
		_options.volume = val;
		_gainNode.gain.value = _options.volume;
	}

	public function getVolume():Float {
		return _options.volume;
	}

	public function mute(val:Bool) {
		if (val) _gainNode.gain.value = 0;
		else _gainNode.gain.value = _options.volume;
	}

	public function stop() {
		_snd.stop(0);
	}
}