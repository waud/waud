@:expose @:keep class WaudSound implements IWaudSound {

	var _snd:IWaudSound;

	public function new(src:String, ?options:WaudSoundOptions = null) {
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}

		if (Waud.isWebAudioSupported) _snd = new WebAudioAPISound(src, options);
		else if (Waud.isAudioSupported) _snd = new HTML5Sound(src, options);
		else trace("no audio support in this browser");
	}

	public function setVolume(val:Float) {
		_snd.setVolume(val);
	}

	public function getVolume():Float {
		return _snd.getVolume();
	}

	public function mute(val:Bool) {
		_snd.mute(val);
	}

	public function play() {
		_snd.play();
	}

	public function isPlaying():Bool {
		return _snd.isPlaying();
	}

	public function loop(val:Bool) {
		_snd.loop(val);
	}

	public function stop() {
		_snd.stop();
	}
}