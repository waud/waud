import js.html.audio.AudioContext;

class AudioManager {

	public var bufferList:Map<String, Dynamic>;
	public var playingSounds:Map<String, Array<Dynamic>>;
	public var ctx:AudioContext;

	public function new(context:AudioContext) {
		ctx = context;
		bufferList = new Map();
		playingSounds = new Map();
	}

	/*public function stopSoundWithUrl(url:String) {
		var snd = playingSounds.get(url);
		if (snd != null) {
			for (s in snd) {
				if (s.get(i) != null) snd.get(s).noteOff(0);
			}
		}
	}*/
}