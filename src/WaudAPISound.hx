import js.html.XMLHttpRequestResponseType;
import js.html.XMLHttpRequest;
import js.html.audio.GainNode;
import js.html.audio.AudioBufferSourceNode;
import js.html.audio.AudioBuffer;

class WaudAPISound extends BaseSound implements ISoundAPI {

	var _url:String;
	var _manager:AudioManager;
	var _snd:AudioBufferSourceNode;
	var _gainNode:GainNode;

	public function new(src:String, ?options:WaudSoundOptions = null) {
		super(src, options);

		_url = src;
		_manager = Waud.audioManager;

		var request = new XMLHttpRequest();
		request.open("GET", _url, true);
		request.responseType = XMLHttpRequestResponseType.ARRAYBUFFER;
		request.onload = function() {
			_manager.ctx.decodeAudioData(request.response,
			function(buffer:AudioBuffer) {
				if (buffer == null) {
					trace("decoding failed: " + _url);
					return;
				}
				_manager.bufferList.set(_url, buffer);
				if (options.onload != null) options.onload(this);
			},
			function() {
				trace("decoding failed: " + _url);
			});
		}

		request.onerror = function() {
			trace("error loading sound: " + _url);
		}

		request.send();
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

	function _makeSource(buffer:AudioBuffer):AudioBufferSourceNode {
		var source:AudioBufferSourceNode = _manager.ctx.createBufferSource();
		_gainNode = _manager.ctx.createGain();
		_gainNode.gain.value = _options.volume;
		source.buffer = buffer;
		source.connect(_gainNode);
		_gainNode.connect(_manager.ctx.destination);
		return source;
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