

class Radio {

	public function new() {
		Waud.init();
		Waud.autoMute();

		var rad1:IWaudSound = new WaudSound("http://ice1.somafm.com/groovesalad-128-mp3", {autoplay: true, webaudio:false});
	}

	static function main() {
		new Radio();
	}
}