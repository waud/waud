import pixi.core.text.Text;
import pixi.core.Pixi;
import pixi.core.display.Container;
import pixi.plugins.app.Application;
import js.Browser;

class Main extends Application {

	var _btnContainer:Container;

	var _bgSnd:ISound;

	var _glass:ISound;
	var _bell:ISound;
	var _can:ISound;

	var _ua:Text;

	public function new() {
		super();
		pixelRatio = Math.floor(Browser.window.devicePixelRatio);
		Pixi.RESOLUTION = pixelRatio;
		backgroundColor = 0x5F04B4;
		super.start();

		_btnContainer = new Container();
		stage.addChild(_btnContainer);

		_addButton("Glass", 0, 0, 60, 30, _playSound1);
		_addButton("Bell", 60, 0, 60, 30, _playSound2);
		_addButton("Can", 120, 0, 60, 30, _playSound3);
		_addButton("Mute", 200, 0, 60, 30, _mute);
		_addButton("Unmute", 260, 0, 60, 30, _unmute);
		_addButton("BG Vol 0", 320, 0, 60, 30, function() { _bgSnd.setVolume(0); });
		_addButton("BG Vol 1", 380, 0, 60, 30, function() { _bgSnd.setVolume(1); });
		_addButton("Stop", 440, 0, 60, 30, _stop);

		_ua = new Text(Browser.navigator.userAgent, { font: "12px Tahoma", fill:"#FFFFFF" });
		stage.addChild(_ua);
		_btnContainer.position.set((Browser.window.innerWidth - 500) / 2, (Browser.window.innerHeight - 30) / 2);

		Waud.init();
		Waud.enableTouchUnlock(touchUnlock);
		_bgSnd = new WaudSound("assets/loop.mp3", { loop:true, autoplay: false, volume: 0.5, onload: _playBgSound });
		_glass = new WaudSound("assets/glass.aac");
		_bell = new WaudSound("assets/bell.aac");
		_can = new WaudSound("assets/canopening.mp3");
	}

	// for iOS devices
	function touchUnlock() {
		if (!_bgSnd.isPlaying()) _bgSnd.play();
	}

	function _playBgSound(snd:ISound) {
		if (!snd.isPlaying()) snd.play();
	}

	function _playSound1() {
		_glass.play();
	}

	function _playSound2() {
		_bell.play();
	}

	function _playSound3() {
		_can.play();
	}

	function _mute() {
		Waud.mute(true);
	}

	function _unmute() {
		Waud.mute(false);
	}

	function _stop() {
		Waud.stop();
	}

	function _addButton(label:String, x:Float, y:Float, width:Float, height:Float, callback:Dynamic) {
		var button = new Button(label, width, height);
		button.position.set(x, y);
		button.action.add(callback);
		button.enable();
		_btnContainer.addChild(button);
	}



	static function main() {
		new Main();
	}
}