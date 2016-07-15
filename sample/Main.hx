import haxe.Timer;
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
	var _funkMP3:IWaudSound;
	var _glassMP3:IWaudSound;
	var _bellMP3:IWaudSound;
	var _canMP3:IWaudSound;
	var _glassOGG:IWaudSound;
	var _bellOGG:IWaudSound;
	var _canOGG:IWaudSound;

	var _sound1M4A:IWaudSound;
	var _sound2M4A:IWaudSound;

	var _audSprite:IWaudSound;
	var _audSprite1:IWaudSound;

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
		_addButton("Funk", 200, 0, 60, 30, function() { _funkMP3.play(); });
		_addButton("Glass", 260, 0, 60, 30, function() { _glassMP3.play(); });
		_addButton("Bell", 320, 0, 60, 30, function() { _bellMP3.play(); });
		_addButton("Can", 380, 0, 60, 30, function() { _canMP3.play(); });

		label = new Text("M4A: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 50;
		_addButton("Sound 1", 200, 50, 60, 30, function() { _sound1M4A.play(); });
		_addButton("Sound 2", 260, 50, 60, 30, function() { _sound2M4A.play(); });

		label = new Text("AAC: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 100;
		_addButton("Glass", 200, 100, 60, 30, function() { _glassAAC.play(); });
		_addButton("Bell", 260, 100, 60, 30, function() { _bellAAC.play(); });
		_addButton("Can", 320, 100, 60, 30, function() { _canAAC.play(); });

		label = new Text("OGG: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 150;
		_addButton("Glass", 200, 150, 60, 30, function() { _glassOGG.play(); });
		_addButton("Bell", 260, 150, 60, 30, function() { _bellOGG.play(); });
		_addButton("Can", 320, 150, 60, 30, function() { _canOGG.play(); });

		label = new Text("Controls: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 200;
		_addButton("Mute", 200, 200, 60, 30, _mute);
		_addButton("Unmute", 260, 200, 60, 30, _unmute);
		_addButton("BG Vol 0", 320, 200, 60, 30, function() { _bgSnd.setVolume(0); });
		_addButton("BG Vol 1", 380, 200, 60, 30, function() { _bgSnd.setVolume(1); });
		_addButton("BG Toggle Play", 200, 240, 100, 30, function() { _bgSnd.togglePlay(); });
		_addButton("BG Toggle Mute", 300, 240, 100, 30, function() { _bgSnd.toggleMute(); });
		_addButton("Stop All", 400, 240, 60, 30, _stop);
        _addButton("Pause All", 460, 240, 60, 30, _pause);

		// Audio Sprite
		label = new Text("Sprite (M4A): ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 300;
		_addButton("Glass", 200, 300, 60, 30, function() { _audSprite.play("glass"); });
		_addButton("Bell (loop)", 260, 300, 120, 30, function() { _audSprite.play("bell"); });
		_addButton("Can", 380, 300, 60, 30, function() { _audSprite.play("canopening"); });
		_addButton("Play All", 440, 300, 60, 30, playAllTheThings);

		label = new Text("Test 1: ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 350;
		_addButton("Play", 200, 350, 60, 30, function() { _countdown.play(); });
		_addButton("Pause", 260, 350, 60, 30, function() { _countdown.pause(); });
		_addButton("Stop", 320, 350, 60, 30, function() { _countdown.stop(); });
		_addButton("Seek 1s", 380, 350, 60, 30, function() { _countdown.setTime(_countdown.getTime() + 1); });

		label = new Text("Test 2 (M4A): ", { font: "26px Tahoma", fill:"#FFFFFF" });
		_btnContainer.addChild(label);
		label.position.y = 400;
		_addButton("Play", 200, 400, 60, 30, function() { _audSprite.play("countdown"); });
		_addButton("Pause", 260, 400, 60, 30, function() { _audSprite.pause("countdown"); });
		_addButton("Stop", 320, 400, 60, 30, function() { _audSprite.stop("countdown"); });

		_addButton("DESTROY", 200, 450, 180, 30, function() { Waud.destroy(); });

		_ua = new Text(Browser.navigator.userAgent, { font: "12px Tahoma", fill:"#FFFFFF" });
		stage.addChild(_ua);

		Waud.init();
		Waud.autoMute();
		Waud.enableTouchUnlock(touchUnlock);
		Waud.defaults.onload = _onLoad;
		_bgSnd = new WaudSound("assets/loop.mp3", { loop:true, autoplay: false, volume: 1, onload: _playBgSound });

		_funkMP3 = new WaudSound("assets/funk100.mp3");
		_glassMP3 = new WaudSound("assets/glass.mp3");
		_bellMP3 = new WaudSound("assets/bell.mp3");
		_canMP3 = new WaudSound("assets/canopening.mp3");

		_sound1M4A = new WaudSound("assets/l1.m4a");
		_sound2M4A = new WaudSound("assets/l2.m4a");

		_glassAAC = new WaudSound("assets/glass.aac");
		_bellAAC = new WaudSound("assets/bell.aac");
		_canAAC = new WaudSound("assets/canopening.aac");

		_glassOGG = new WaudSound("assets/glass.ogg");
		_bellOGG = new WaudSound("assets/bell.ogg");
		_canOGG = new WaudSound("assets/canopening.ogg");

		_ua.text += "\n" + Waud.getFormatSupportString();
		_ua.text += "\nWeb Audio API: " + Waud.isWebAudioSupported;
		_ua.text += "\nHTML5 Audio: " + Waud.isHTML5AudioSupported;

		_audSprite = new WaudSound("assets/sprite.json", {webaudio: true});
		_audSprite.onEnd(function(snd:IWaudSound) {trace("Glass finished.");}, "glass");
		_audSprite.onEnd(function(snd:IWaudSound) {trace("Bell finished.");}, "bell");
		_audSprite.onEnd(function(snd:IWaudSound) {trace("Canopening finished.");}, "canopening");

		_countdown = new WaudSound("assets/countdown.mp3", {webaudio: true});

		_resize();
	}

	function _onLoad(snd:IWaudSound) {
		//trace(snd.url);
		//trace(snd.duration);
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

	function playAllTheThings() {
		Timer.delay( function() {_audSprite.play("glass");}, 100);
		Timer.delay( function() {_audSprite.play("bell");}, 200);
		Timer.delay( function() {_audSprite.play("canopening");}, 300);
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