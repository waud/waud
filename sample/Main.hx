import js.Browser;
import pixi.core.Pixi;
import pixi.core.text.Text;
import pixi.core.display.Container;
import pixi.plugins.app.Application;

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

	var _audSprite:IWaudSound;

	var _countdown:IWaudSound;

	var _ua:Text;

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

		var label:Text = new Text("MP3: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		_addButton("Glass", 120, 0, 60, 30, function() { _glassMP3.play(); });
		_addButton("Bell", 180, 0, 60, 30, function() { _bellMP3.play(); });
		_addButton("Can", 240, 0, 60, 30, function() { _canMP3.play(); });

		label = new Text("AAC: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 50;
		_addButton("Glass", 120, 50, 60, 30, function() { _glassAAC.play(); });
		_addButton("Bell", 180, 50, 60, 30, function() { _bellAAC.play(); });
		_addButton("Can", 240, 50, 60, 30, function() { _canAAC.play(); });

		label = new Text("OGG: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 100;
		_addButton("Glass", 120, 100, 60, 30, function() { _glassOGG.play(); });
		_addButton("Bell", 180, 100, 60, 30, function() { _bellOGG.play(); });
		_addButton("Can", 240, 100, 60, 30, function() { _canOGG.play(); });

		label = new Text("Controls: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 150;
		_addButton("Mute", 120, 150, 60, 30, _mute);
		_addButton("Unmute", 180, 150, 60, 30, _unmute);
		_addButton("BG Vol 0", 240, 150, 60, 30, function() { _bgSnd.setVolume(0); });
		_addButton("BG Vol 1", 300, 150, 60, 30, function() { _bgSnd.setVolume(1); });
		_addButton("BG Toggle Play", 120, 190, 100, 30, function() { _bgSnd.togglePlay(); });
		_addButton("BG Toggle Mute", 220, 190, 100, 30, function() { _bgSnd.toggleMute(); });
		_addButton("Stop All", 320, 190, 60, 30, _stop);
        _addButton("Pause All", 380, 190, 60, 30, _pause);

		// Audio Sprite
		label = new Text("Sprite: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 250;
		_addButton("Glass", 120, 250, 60, 30, function() { _audSprite.play("glass"); });
		_addButton("Bell", 180, 250, 60, 30, function() { _audSprite.play("bell"); });
		_addButton("Can", 240, 250, 60, 30, function() { _audSprite.play("canopening"); });

		label = new Text("Test 1: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 300;
		_addButton("Play", 120, 300, 60, 30, function() { _countdown.play(); });
		_addButton("Pause", 180, 300, 60, 30, function() { _countdown.pause(); });
		_addButton("Stop", 240, 300, 60, 30, function() { _countdown.stop(); });

		label = new Text("Test 2: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 350;
		_addButton("Play", 120, 350, 60, 30, function() { _audSprite.play("countdown"); });
		_addButton("Pause", 180, 350, 60, 30, function() { _audSprite.pause(); });
		_addButton("Stop", 240, 350, 60, 30, function() { _audSprite.stop(); });

		_addButton("DESTROY", 120, 400, 180, 30, function() { Waud.destroy(); });

		_ua = new Text(Browser.navigator.userAgent, { font: "12px Tahoma", fill:"#FFFFFF" });
		stage.addChild(_ua);

		Waud.init();
		Waud.autoMute();
		Waud.enableTouchUnlock(touchUnlock);
		Waud.defaults.onload = _onLoad;
		_bgSnd = new WaudSound("assets/loop.mp3", { loop:true, autoplay: false, volume: 1, onload: _playBgSound });

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
		_ua.text += "\nHTML5 Audio: " + Waud.isHTML5AudioSupported;

		_audSprite = new WaudSound("assets/sprite.json");

		_countdown = new WaudSound("assets/countdown.mp3", {webaudio: false});

		_resize();
	}

	function _onLoad(snd:IWaudSound) {
		trace(snd.url);
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
		new Main();
	}
}