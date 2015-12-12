class Main {

	var snd1:ISound;
	var snd2:ISound;

	public function new() {
		Waud.init();
		Waud.enableTouchUnlock(touchUnlock);
		snd1 = new WaudSound("assets/loop.mp3", { autoplay: false, volume: 0.5 });
		snd2 = new WaudSound("assets/sound1.wav", {
			autoplay: true,
			loop: false,
			onload: function(snd) { trace("loaded"); },
			onend: function(snd) { trace("ended"); },
			onerror: function(snd) { trace("error"); }
		});
	}

	// for iOS devices
	function touchUnlock() {
		snd1.play();
		snd2.play(true);
	}

	static function main() {
		new Main();
	}
}