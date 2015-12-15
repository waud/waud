import pixi.core.text.Text;
import pixi.core.display.Container;
import pixi.plugins.app.Application;
import js.Browser;

class Main extends Application {

	var _btnContainer:Container;

	var _bgSnd:IWaudSound;

	var _glassAAC:IWaudSound;
	var _bellAAC:IWaudSound;
	var _canAAC:IWaudSound;
	var _glassMP3:IWaudSound;
	var _bellMP3:IWaudSound;
	var _canMP3:IWaudSound;
	var _glassOGG:IWaudSound;
	var _bellOGG:IWaudSound;
	var _canOGG:IWaudSound;

	var _ua:Text;

	public function new() {
		super();
		pixelRatio = 1;
		autoResize = true;
		backgroundColor = 0x5F04B4;
		roundPixels = true;
		onResize = _resize;
		super.start();

		_btnContainer = new Container();
		stage.addChild(_btnContainer);

		var label:Text = new Text("MP3: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		_addButton("Glass", 100, 0, 60, 30, function() { _glassMP3.play(); });
		_addButton("Bell", 160, 0, 60, 30, function() { _bellMP3.play(); });
		_addButton("Can", 220, 0, 60, 30, function() { _canMP3.play(); });

		label = new Text("AAC: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 50;
		_addButton("Glass", 100, 50, 60, 30, function() { _glassAAC.play(); });
		_addButton("Bell", 160, 50, 60, 30, function() { _bellAAC.play(); });
		_addButton("Can", 220, 50, 60, 30, function() { _canAAC.play(); });

		label = new Text("OGG: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 100;
		_addButton("Glass", 100, 100, 60, 30, function() { _glassOGG.play(); });
		_addButton("Bell", 160, 100, 60, 30, function() { _bellOGG.play(); });
		_addButton("Can", 220, 100, 60, 30, function() { _canOGG.play(); });

		label = new Text("Controls: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 150;
		_addButton("Mute", 100, 150, 60, 30, _mute);
		_addButton("Unmute", 160, 150, 60, 30, _unmute);
		_addButton("BG Vol 0", 220, 150, 60, 30, function() { _bgSnd.setVolume(0); });
		_addButton("BG Vol 1", 280, 150, 60, 30, function() { _bgSnd.setVolume(1); });
		_addButton("Stop", 340, 150, 60, 30, _stop);

		_ua = new Text(Browser.navigator.userAgent, { font: "12px Tahoma", fill:"#FFFFFF" });
		stage.addChild(_ua);

		Waud.init();
		Waud.enableTouchUnlock(touchUnlock);
		_bgSnd = new WaudSound("assets/loop.mp3", { loop:true, autoplay: false, volume: 0.5, onload: _playBgSound });

		_glassMP3 = new WaudSound("assets/glass.mp3");
		_bellMP3 = new WaudSound("assets/bell.mp3");
		_canMP3 = new WaudSound("assets/canopening.mp3");

		_glassAAC = new WaudSound("assets/glass.aac");
		_bellAAC = new WaudSound("assets/bell.aac");
		_canAAC = new WaudSound("assets/canopening.aac");

		_glassOGG = new WaudSound("assets/glass.ogg");
		_bellOGG = new WaudSound("assets/bell.ogg");
		_canOGG = new WaudSound("assets/canopening.ogg");

		_ua.text += "\n" + Waud.getFormatSupportString();
		_ua.text += "\nWeb Audio API: " + Waud.isWebAudioSupported;
		_ua.text += "\nHTML5 Audio: " + Waud.isAudioSupported;

		_resize();
	}

	function touchUnlock() {
		if (!_bgSnd.isPlaying()) _bgSnd.play();
	}

	function _playBgSound(snd:IWaudSound) {
		if (!snd.isPlaying()) snd.play();
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

	function _resize() {
		trace(Browser.window.innerWidth, Browser.window.innerHeight);
		_btnContainer.position.set((Browser.window.innerWidth - _btnContainer.width) / 2, (Browser.window.innerHeight - _btnContainer.height) / 2);
	}

	static function main() {
		new Main();
	}
}