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

		Waud.sounds.set(url, this);
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
		if (_options.autoplay) play();
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

	public function play() {
		var buffer = _manager.bufferList.get(_url);
		if (buffer != null) {
			_snd = _makeSource(buffer);
			_snd.loop = _options.loop;
			_snd.start(0);
			_isPlaying = true;
			_snd.onended = function() {
				_isPlaying = false;
				if (_options.onend != null) _options.onend(this);
			}

			if(_manager.playingSounds.get(_url) == null) _manager.playingSounds.set(_url, []);
			_manager.playingSounds.get(_url).push(_snd);
		}
	}

	public function isPlaying():Bool {
		return _isPlaying;
	}

	public function loop(val:Bool) {
		if (_snd == null) return;
		_snd.loop = val;
	}

	public function setVolume(val:Float) {
		if (_gainNode == null) return;
		_options.volume = val;
		_gainNode.gain.value = _options.volume;
	}

	public function getVolume():Float {
		return _options.volume;
	}

	public function mute(val:Bool) {
		if (_gainNode == null) return;
		if (val) _gainNode.gain.value = 0;
		else _gainNode.gain.value = _options.volume;
	}

	public function stop() {
		if (_snd == null) return;
		_snd.stop(0);
	}
}