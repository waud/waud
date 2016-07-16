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
	var _sound1:IWaudSound;
	var _sound2:IWaudSound;
	var _sound3:IWaudSound;

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
		_addButton("Sound 1", 80, 40, 80, 30, function() { _sound1.play(); });
		_addButton("Sound 2", 160, 40, 80, 30, function() { _sound2.play(); });
		_addButton("Sound 3", 240, 40, 80, 30, function() { _sound3.play(); });

		Waud.init();
		Waud.autoMute();
		Waud.enableTouchUnlock(touchUnlock);
		_snd = new WaudBase64Pack("assets/sounds.json", _onLoad);

		_resize();
	}

	function _onLoad(snds:Map<String, IWaudSound>) {
		_beep = snds.get("test/beep.mp3");
		_sound1 = snds.get("test/sound1.wav");
		_sound2 = snds.get("test/sound2.aac");
		_sound3 = snds.get("test/sound3.ogg");
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