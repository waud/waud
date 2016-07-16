package ;
import js.Browser;
import pixi.core.Pixi;
import pixi.core.text.Text;
import pixi.core.display.Container;
import pixi.plugins.app.Application;

class Base64 extends Application {

	var _btnContainer:Container;

	var _snd:WaudBase64Pack;
	var _duration:Text;
	var _time:Text;

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

		_duration = new Text("Duration: ", { font: "20px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(_duration);
//		_time = new Text("Time: ", { font: "20px Tahoma", fill:"#FFFFFF" });
//		_time.y = 50;
//		_btnContainer.addChild(_time);
//		_addButton("Play", 0, 100, 80, 30, function() { _snd.play(); });
//		_addButton("getTime()", 80, 100, 80, 30, function() { _time.text = "Time: " + _snd.getTime(); });
//		_addButton("setTime(2)", 160, 100, 80, 30, function() { _snd.setTime(2); });
//		_addButton("setTime(5)", 240, 100, 80, 30, function() { _snd.setTime(5); });
//		_addButton("setTime(7)", 320, 100, 80, 30, function() { _snd.setTime(7); });
//		_addButton("setTime(10)", 400, 100, 80, 30, function() { _snd.setTime(10); });

		Waud.init();
		Waud.autoMute();
		Waud.enableTouchUnlock(touchUnlock);
		_snd = new WaudBase64Pack("assets/bundle.json", _onLoad);

		_resize();
	}

	function _onLoad(snds:Map<String, IWaudSound>) {
		snds.get("resources/beep.mp3").play();
		snds.get("resources/beep.mp3").loop(true);
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