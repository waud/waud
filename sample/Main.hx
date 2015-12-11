class Main {

	public function new() {
		Waud.init();
		var snd1 = new WaudSound("assets/loop", { autoplay: false, formats: ["mp3"], loop: true, volume: 1});
		var snd2 = new WaudSound("assets/sound1.wav", {
			autoplay: false,
			loop: true,
			onload: function (snd) { trace("loaded"); },
			onend: function (snd) { trace("ended"); },
			onerror: function (snd) { trace("error"); }
		});

		snd1.play();
		snd2.play();

		//Touch unlock event for iOS devices
		Waud.touchUnlock = function() {
			snd1.play();
			snd2.play();
		}
	}

	static function main() {
		new Main();
	}
}