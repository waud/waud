package ;
import js.Browser;
import pixi.core.Pixi;
import pixi.core.text.Text;
import pixi.core.display.Container;
import pixi.plugins.app.Application;

class Base64 extends Application {

	var _btnContainer:Container;

	var _snd:WaudBase64Pack;
	var _base64sounds:Text;
	var _beep:IWaudSound;
	var _bell:IWaudSound;
	var _glass:IWaudSound;
	var _canopening:IWaudSound;
	var _countdown:IWaudSound;
	var _funk100:IWaudSound;

	public function new() {
		super();
		Pixi.RESOLUTION = pixelRatio = Browser.window.devicePixelRatio;
		autoResize = true;
		backgroundColor = 0x5F04B4;
		roundPixels = true;
		onResize = _resize;
		super.start();

		_btnContainer = new Container();
		stage.addChild(_btnContainer);

		_base64sounds = new Text("Base64 Sounds: ", { font: "20px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(_base64sounds);
		_addButton("Beep", 0, 40, 80, 30, function() { _beep.play(); });
		_addButton("Bell", 80, 40, 80, 30, function() { _bell.play(); });
		_addButton("Glass", 160, 40, 80, 30, function() { _glass.play(); });
		_addButton("Can", 240, 40, 80, 30, function() { _canopening.play(); });
		_addButton("Countdown", 320, 40, 80, 30, function() { _countdown.play(); });
		_addButton("Funk", 400, 40, 80, 30, function() { _funk100.play(); });

		Waud.init();
		Waud.autoMute();
		Waud.enableTouchUnlock(touchUnlock);
		_snd = new WaudBase64Pack("assets/sounds.json", _onLoad);

		_resize();
	}

	function _onLoad(snds:Map<String, IWaudSound>) {
		_beep = snds.get("test/beep.mp3");
		_bell = snds.get("test/bell.mp3");
		_glass = snds.get("test/glass.mp3");
		_canopening = snds.get("test/canopening.mp3");
		_countdown = snds.get("test/countdown.mp3");
		_funk100 = snds.get("test/funk100.mp3");
	}

	function touchUnlock() {

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

    function _pause() {
		Waud.pause();
	}

	function _addButton(label:String, x:Float, y:Float, width:Float, height:Float, callback:Dynamic) {
		var btn:Button = new Button(label, width, height);
		btn.position.set(x, y);
		btn.action.add(callback);
		btn.enable();
		_btnContainer.addChild(btn);
	}

	function _resize() {
		_btnContainer.position.set((Browser.window.innerWidth - _btnContainer.width) / 2, (Browser.window.innerHeight - _btnContainer.height) / 2);
	}

	static function main() {
		new Base64();
	}
}