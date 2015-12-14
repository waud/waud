(function (console, $hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var AudioManager = function() {
	this.bufferList = new haxe_ds_StringMap();
	this.playingSounds = new haxe_ds_StringMap();
};
AudioManager.__name__ = true;
AudioManager.prototype = {
	checkWebAudioAPISupport: function() {
		if(Reflect.field(window,"AudioContext") != null) {
			AudioManager.AudioContextClass = Reflect.field(window,"AudioContext");
			return true;
		} else if(Reflect.field(window,"webkitAudioContext") != null) {
			AudioManager.AudioContextClass = Reflect.field(window,"webkitAudioContext");
			return true;
		}
		return false;
	}
	,unlockAudio: function() {
		if(this.audioContext == null) return;
		var bfr = this.audioContext.createBuffer(1,1,Waud.preferredSampleRate);
		var src = this.audioContext.createBufferSource();
		src.buffer = bfr;
		src.connect(this.audioContext.destination);
		src.start(0);
		if(src.onended != null) src.onended = $bind(this,this._unlockCallback); else haxe_Timer.delay($bind(this,this._unlockCallback),1);
	}
	,_unlockCallback: function() {
		if(Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
		Waud.dom.ontouchend = null;
	}
	,createAudioContext: function() {
		if(this.audioContext == null) try {
			if(AudioManager.AudioContextClass != null) this.audioContext = Type.createInstance(AudioManager.AudioContextClass,[]);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.audioContext = null;
		}
	}
	,iOSSafeSampleRateCheck: function() {
		haxe_Log.trace(this.audioContext.sampleRate,{ fileName : "AudioManager.hx", lineNumber : 58, className : "AudioManager", methodName : "iOSSafeSampleRateCheck", customParams : [Waud.preferredSampleRate]});
		if(this.audioContext != null && Waud.iOSSafeSampleRateCheck && this.audioContext.sampleRate != Waud.preferredSampleRate) Waud.isWebAudioSupported = false;
	}
};
var BaseSound = function(url,options) {
	if(url == null || url == "") {
		haxe_Log.trace("invalid sound url",{ fileName : "BaseSound.hx", lineNumber : 8, className : "BaseSound", methodName : "new"});
		return;
	}
	if(Waud.defaults == null) {
		haxe_Log.trace("Initialise Waud using Waud.init() before loading sounds",{ fileName : "BaseSound.hx", lineNumber : 12, className : "BaseSound", methodName : "new"});
		return;
	}
	this._isPlaying = false;
	if(options == null) options = { };
	if(options.autoplay != null) options.autoplay = options.autoplay; else options.autoplay = Waud.defaults.autoplay;
	if(options.preload != null) options.preload = options.preload; else options.preload = Waud.defaults.preload;
	if(options.loop != null) options.loop = options.loop; else options.loop = Waud.defaults.loop;
	if(options.volume != null && options.volume >= 0 && options.volume <= 1) options.volume = options.volume; else options.volume = Waud.defaults.volume;
	this._options = options;
};
BaseSound.__name__ = true;
var Button = function(label,width,height,data,fontSize) {
	PIXI.Container.call(this);
	this.action = new msignal_Signal1(Dynamic);
	this._data = data;
	this._setupBackground(width,height);
	this._setupLabel(width,height,fontSize);
	this._label.text = label;
};
Button.__name__ = true;
Button.__super__ = PIXI.Container;
Button.prototype = $extend(PIXI.Container.prototype,{
	_setupBackground: function(width,height) {
		this._rect = new PIXI.Rectangle(0,0,width,height);
		this._background = new PIXI.Graphics();
		this._background.interactive = true;
		this._redraw(3040510);
		this.addChild(this._background);
		this._background.interactive = true;
		this._background.on("mouseover",$bind(this,this._onMouseOver));
		this._background.on("mouseout",$bind(this,this._onMouseOut));
		this._background.on("mousedown",$bind(this,this._onMouseDown));
		this._background.on("mouseup",$bind(this,this._onMouseUp));
		this._background.on("mouseupoutside",$bind(this,this._onMouseUpOutside));
		this._background.on("touchstart",$bind(this,this._onTouchStart));
		this._background.on("touchend",$bind(this,this._onTouchEnd));
		this._background.on("touchendoutside",$bind(this,this._onTouchEndOutside));
	}
	,_setupLabel: function(width,height,fontSize) {
		var size;
		if(fontSize != null) size = fontSize; else size = 12;
		var style = { };
		style.font = size + "px Arial";
		style.fill = "#FFFFFF";
		this._label = new PIXI.Text("",style);
		this._label.anchor.set(0.5);
		this._label.x = width / 2;
		this._label.y = height / 2;
		this.addChild(this._label);
	}
	,_redraw: function(colour) {
		var border = 1;
		this._background.clear();
		this._background.beginFill(13158);
		this._background.drawRect(this._rect.x,this._rect.y,this._rect.width,this._rect.height);
		this._background.endFill();
		this._background.beginFill(colour);
		this._background.drawRect(this._rect.x + border / 2,this._rect.y + border / 2,this._rect.width - border,this._rect.height - border);
		this._background.endFill();
	}
	,_onMouseDown: function(target) {
		if(this._enabled) this._redraw(14644225);
	}
	,_onMouseUp: function(target) {
		if(this._enabled) {
			this.action.dispatch(this._data);
			this._redraw(3040510);
		}
	}
	,_onMouseUpOutside: function(target) {
		if(this._enabled) this._redraw(3040510);
	}
	,_onMouseOver: function(target) {
		if(this._enabled) this._redraw(14644225);
	}
	,_onMouseOut: function(target) {
		if(this._enabled) this._redraw(3040510);
	}
	,_onTouchEndOutside: function(target) {
		if(this._enabled) this._redraw(3040510);
	}
	,_onTouchEnd: function(target) {
		if(this._enabled) {
			this._redraw(3040510);
			this.action.dispatch(this._data);
		}
	}
	,_onTouchStart: function(target) {
		if(this._enabled) this._redraw(14644225);
	}
});
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
};
var ISound = function() { };
ISound.__name__ = true;
var HTML5Sound = $hx_exports.HTML5Sound = function(url,options) {
	var _g = this;
	BaseSound.call(this,url,options);
	this._muted = false;
	this._snd = Waud.dom.createElement("audio");
	this.addSource(url);
	this._snd.autoplay = this._options.autoplay;
	this._snd.loop = this._options.loop;
	this._snd.volume = this._options.volume;
	if(Std.string(this._options.preload) == "true") this._snd.preload = "auto"; else if(Std.string(this._options.preload) == "false") this._snd.preload = "none"; else this._snd.preload = "metadata";
	if(this._options.onload != null) this._snd.onloadeddata = function() {
		_g._options.onload(_g);
	};
	this._snd.onplaying = function() {
		_g._isPlaying = true;
	};
	this._snd.onended = function() {
		_g._isPlaying = false;
		if(_g._options.onend != null) _g._options.onend(_g);
	};
	if(this._options.onerror != null) this._snd.onerror = function() {
		_g._options.onerror(_g);
	};
	Waud.sounds.set(url,this);
	this._snd.load();
};
HTML5Sound.__name__ = true;
HTML5Sound.__interfaces__ = [ISound];
HTML5Sound.__super__ = BaseSound;
HTML5Sound.prototype = $extend(BaseSound.prototype,{
	addSource: function(src) {
		this._src = Waud.dom.createElement("source");
		this._src.src = src;
		if((function($this) {
			var $r;
			var key = $this._getExt(src);
			$r = Waud.types.get(key);
			return $r;
		}(this)) != null) {
			var key1 = this._getExt(src);
			this._src.type = Waud.types.get(key1);
		}
		this._snd.appendChild(this._src);
		return this._src;
	}
	,_getExt: function(filename) {
		return filename.split(".").pop();
	}
	,setVolume: function(val) {
		if(val >= 0 && val <= 1) {
			this._snd.volume = val;
			this._options.volume = val;
		}
	}
	,getVolume: function() {
		return this._options.volume;
	}
	,mute: function(val) {
		this._snd.muted = val;
		if(Utils.isiOS()) {
			if(val && this.isPlaying()) {
				this._muted = true;
				this._snd.pause();
			} else if(this._muted) {
				this._muted = false;
				this._snd.play();
			}
		}
	}
	,play: function() {
		this._snd.play();
	}
	,isPlaying: function() {
		return this._isPlaying;
	}
	,loop: function(val) {
		this._snd.loop = val;
	}
	,stop: function() {
		this._snd.pause();
		this._snd.currentTime = 0;
	}
});
var pixi_plugins_app_Application = function() {
	this.pixelRatio = 1;
	this.set_skipFrame(false);
	this.autoResize = true;
	this.transparent = false;
	this.antialias = false;
	this.forceFXAA = false;
	this.roundPixels = false;
	this.clearBeforeRender = true;
	this.preserveDrawingBuffer = false;
	this.backgroundColor = 16777215;
	this.width = window.innerWidth;
	this.height = window.innerHeight;
	this.set_fps(60);
};
pixi_plugins_app_Application.__name__ = true;
pixi_plugins_app_Application.prototype = {
	set_fps: function(val) {
		this._frameCount = 0;
		return val >= 1 && val < 60?this.fps = val | 0:this.fps = 60;
	}
	,set_skipFrame: function(val) {
		if(val) {
			haxe_Log.trace("pixi.plugins.app.Application > Deprecated: skipFrame - use fps property and set it to 30 instead",{ fileName : "Application.hx", lineNumber : 149, className : "pixi.plugins.app.Application", methodName : "set_skipFrame"});
			this.set_fps(30);
		}
		return this.skipFrame = val;
	}
	,start: function(rendererType,parentDom) {
		if(rendererType == null) rendererType = "auto";
		var _this = window.document;
		this.canvas = _this.createElement("canvas");
		this.canvas.style.width = this.width + "px";
		this.canvas.style.height = this.height + "px";
		this.canvas.style.position = "absolute";
		if(parentDom == null) window.document.body.appendChild(this.canvas); else parentDom.appendChild(this.canvas);
		this.stage = new PIXI.Container();
		var renderingOptions = { };
		renderingOptions.view = this.canvas;
		renderingOptions.backgroundColor = this.backgroundColor;
		renderingOptions.resolution = this.pixelRatio;
		renderingOptions.antialias = this.antialias;
		renderingOptions.forceFXAA = this.forceFXAA;
		renderingOptions.autoResize = this.autoResize;
		renderingOptions.transparent = this.transparent;
		renderingOptions.clearBeforeRender = this.clearBeforeRender;
		renderingOptions.preserveDrawingBuffer = this.preserveDrawingBuffer;
		if(rendererType == "auto") this.renderer = PIXI.autoDetectRenderer(this.width,this.height,renderingOptions); else if(rendererType == "canvas") this.renderer = new PIXI.CanvasRenderer(this.width,this.height,renderingOptions); else this.renderer = new PIXI.WebGLRenderer(this.width,this.height,renderingOptions);
		if(this.roundPixels) this.renderer.roundPixels = true;
		window.document.body.appendChild(this.renderer.view);
		if(this.autoResize) window.onresize = $bind(this,this._onWindowResize);
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
	,_onWindowResize: function(event) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.resize(this.width,this.height);
		this.canvas.style.width = this.width + "px";
		this.canvas.style.height = this.height + "px";
		if(this.onResize != null) this.onResize();
	}
	,_onRequestAnimationFrame: function(elapsedTime) {
		this._frameCount++;
		if(this._frameCount == (60 / this.fps | 0)) {
			this._frameCount = 0;
			if(this.onUpdate != null) this.onUpdate(elapsedTime);
			this.renderer.render(this.stage);
		}
		window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
};
var Main = function() {
	var _g = this;
	pixi_plugins_app_Application.call(this);
	this.pixelRatio = 1;
	this.autoResize = true;
	this.backgroundColor = 6227124;
	this.roundPixels = true;
	this.onResize = $bind(this,this._resize);
	pixi_plugins_app_Application.prototype.start.call(this);
	this._btnContainer = new PIXI.Container();
	this.stage.addChild(this._btnContainer);
	var label = new PIXI.Text("MP3: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	this._addButton("Glass",100,0,60,30,function() {
		_g._glassMP3.play();
	});
	this._addButton("Bell",160,0,60,30,function() {
		_g._bellMP3.play();
	});
	this._addButton("Can",220,0,60,30,function() {
		_g._canMP3.play();
	});
	label = new PIXI.Text("AAC",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 50;
	this._addButton("Glass",100,50,60,30,function() {
		_g._glassAAC.play();
	});
	this._addButton("Bell",160,50,60,30,function() {
		_g._bellAAC.play();
	});
	this._addButton("Can",220,50,60,30,function() {
		_g._canAAC.play();
	});
	label = new PIXI.Text("OGG",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 100;
	this._addButton("Glass",100,100,60,30,function() {
		_g._glassOGG.play();
	});
	this._addButton("Bell",160,100,60,30,function() {
		_g._bellOGG.play();
	});
	this._addButton("Can",220,100,60,30,function() {
		_g._canOGG.play();
	});
	label = new PIXI.Text("Controls",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 150;
	this._addButton("Mute",100,150,60,30,$bind(this,this._mute));
	this._addButton("Unmute",160,150,60,30,$bind(this,this._unmute));
	this._addButton("BG Vol 0",220,150,60,30,function() {
		_g._bgSnd.setVolume(0);
	});
	this._addButton("BG Vol 1",280,150,60,30,function() {
		_g._bgSnd.setVolume(1);
	});
	this._addButton("Stop",340,150,60,30,$bind(this,this._stop));
	this._ua = new PIXI.Text(window.navigator.userAgent,{ font : "12px Tahoma", fill : "#FFFFFF"});
	this.stage.addChild(this._ua);
	Waud.init();
	Waud.enableTouchUnlock($bind(this,this.touchUnlock));
	this._bgSnd = new WaudSound("assets/loop.mp3",{ loop : true, autoplay : false, volume : 0.5, onload : $bind(this,this._playBgSound)});
	this._glassMP3 = new WaudSound("assets/canopening.mp3");
	this._bellMP3 = new WaudSound("assets/bell.mp3");
	this._canMP3 = new WaudSound("assets/canopening.mp3");
	this._glassAAC = new WaudSound("assets/glass.aac");
	this._bellAAC = new WaudSound("assets/bell.aac");
	this._canAAC = new WaudSound("assets/canopening.aac");
	this._glassOGG = new WaudSound("assets/glass.ogg");
	this._bellOGG = new WaudSound("assets/bell.ogg");
	this._canOGG = new WaudSound("assets/canopening.ogg");
	this._ua.text += "\n" + Waud.getFormatSupportString();
	this._ua.text += "\nWeb Audio API: " + Std.string(Waud.isWebAudioSupported);
	this._ua.text += "\nHTML5 Audio: " + Std.string(Waud.isAudioSupported);
	this._resize();
};
Main.__name__ = true;
Main.main = function() {
	new Main();
};
Main.__super__ = pixi_plugins_app_Application;
Main.prototype = $extend(pixi_plugins_app_Application.prototype,{
	touchUnlock: function() {
		if(!this._bgSnd.isPlaying()) this._bgSnd.play();
	}
	,_playBgSound: function(snd) {
		if(!snd.isPlaying()) snd.play();
	}
	,_mute: function() {
		Waud.mute(true);
	}
	,_unmute: function() {
		Waud.mute(false);
	}
	,_stop: function() {
		Waud.stop();
	}
	,_addButton: function(label,x,y,width,height,callback) {
		var button = new Button(label,width,height);
		button.position.set(x,y);
		button.action.add(callback);
		button._enabled = true;
		this._btnContainer.addChild(button);
	}
	,_resize: function() {
		haxe_Log.trace(window.innerWidth,{ fileName : "Main.hx", lineNumber : 122, className : "Main", methodName : "_resize", customParams : [window.innerHeight]});
		this._btnContainer.position.set((window.innerWidth - this._btnContainer.width) / 2,(window.innerHeight - this._btnContainer.height) / 2);
	}
});
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var Type = function() { };
Type.__name__ = true;
Type.createInstance = function(cl,args) {
	var _g = args.length;
	switch(_g) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw new js__$Boot_HaxeError("Too many arguments");
	}
	return null;
};
var Utils = function() { };
Utils.__name__ = true;
Utils.isiOS = function() {
	return new EReg("(iPad|iPhone|iPod)","i").match(window.navigator.userAgent);
};
var Waud = $hx_exports.Waud = function() { };
Waud.__name__ = true;
Waud.init = function(d) {
	if(d == null) d = window.document;
	Waud.dom = d;
	Waud.audioElement = Waud.dom.createElement("audio");
	if(Waud.audioManager == null) Waud.audioManager = new AudioManager();
	Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
	Waud.isAudioSupported = Reflect.field(window,"Audio") != null;
	if(Waud.isWebAudioSupported) {
		Waud.audioManager.createAudioContext();
		if(Utils.isiOS()) Waud.audioManager.iOSSafeSampleRateCheck();
	} else if(!Waud.isAudioSupported) haxe_Log.trace("no audio support in this browser",{ fileName : "Waud.hx", lineNumber : 35, className : "Waud", methodName : "init"});
	Waud.defaults.autoplay = false;
	Waud.defaults.loop = false;
	Waud.defaults.preload = "metadata";
	Waud.defaults.volume = 1;
	Waud.sounds = new haxe_ds_StringMap();
	Waud.types = new haxe_ds_StringMap();
	Waud.types.set("mp3","audio/mpeg");
	Waud.types.set("ogg","audio/ogg");
	Waud.types.set("wav","audio/wav");
	Waud.types.set("aac","audio/aac");
	Waud.types.set("m4a","audio/x-m4a");
};
Waud.enableTouchUnlock = function(callback) {
	Waud.__touchUnlockCallback = callback;
	Waud.dom.ontouchend = ($_=Waud.audioManager,$bind($_,$_.unlockAudio));
};
Waud.mute = function(val) {
	var $it0 = Waud.sounds.iterator();
	while( $it0.hasNext() ) {
		var sound = $it0.next();
		sound.mute(val);
	}
};
Waud.stop = function() {
	var $it0 = Waud.sounds.iterator();
	while( $it0.hasNext() ) {
		var sound = $it0.next();
		sound.stop();
	}
};
Waud.getFormatSupportString = function() {
	var support = "OGG: " + Waud.audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
	support += ", WAV: " + Waud.audioElement.canPlayType("audio/wav; codecs=\"1\"");
	support += ", MP3: " + Waud.audioElement.canPlayType("audio/mpeg;");
	support += ", AAC: " + Waud.audioElement.canPlayType("audio/aac;");
	support += ", M4A: " + Waud.audioElement.canPlayType("audio/x-m4a;");
	return support;
};
Waud.isOGGSupported = function() {
	var canPlay = Waud.audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
	return Waud.isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isWAVSupported = function() {
	var canPlay = Waud.audioElement.canPlayType("audio/wav; codecs=\"1\"");
	return Waud.isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isMP3Supported = function() {
	var canPlay = Waud.audioElement.canPlayType("audio/mpeg;");
	return Waud.isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isAACSupported = function() {
	var canPlay = Waud.audioElement.canPlayType("audio/aac;");
	return Waud.isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isM4ASupported = function() {
	var canPlay = Waud.audioElement.canPlayType("audio/x-m4a;");
	return Waud.isAudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
var WaudSound = $hx_exports.WaudSound = function(src,options) {
	if(Waud.isWebAudioSupported) this._snd = new WebAudioAPISound(src,options); else if(Waud.isAudioSupported) this._snd = new HTML5Sound(src,options); else haxe_Log.trace("no audio support in this browser",{ fileName : "WaudSound.hx", lineNumber : 8, className : "WaudSound", methodName : "new"});
};
WaudSound.__name__ = true;
WaudSound.__interfaces__ = [ISound];
WaudSound.prototype = {
	setVolume: function(val) {
		this._snd.setVolume(val);
	}
	,getVolume: function() {
		return this._snd.getVolume();
	}
	,mute: function(val) {
		this._snd.mute(val);
	}
	,play: function() {
		this._snd.play();
	}
	,isPlaying: function() {
		return this._snd.isPlaying();
	}
	,loop: function(val) {
		this._snd.loop(val);
	}
	,stop: function() {
		this._snd.stop();
	}
};
var WebAudioAPISound = $hx_exports.WebAudioAPISound = function(url,options) {
	BaseSound.call(this,url,options);
	this._url = url;
	this._manager = Waud.audioManager;
	var request = new XMLHttpRequest();
	request.open("GET",this._url,true);
	request.responseType = "arraybuffer";
	request.onload = $bind(this,this._onSoundLoaded);
	request.onerror = $bind(this,this._error);
	request.send();
	Waud.sounds.set(url,this);
};
WebAudioAPISound.__name__ = true;
WebAudioAPISound.__interfaces__ = [ISound];
WebAudioAPISound.__super__ = BaseSound;
WebAudioAPISound.prototype = $extend(BaseSound.prototype,{
	_onSoundLoaded: function(evt) {
		this._manager.audioContext.decodeAudioData(evt.target.response,$bind(this,this._decodeSuccess),$bind(this,this._error));
	}
	,_decodeSuccess: function(buffer) {
		if(buffer == null) {
			haxe_Log.trace("empty buffer: " + this._url,{ fileName : "WebAudioAPISound.hx", lineNumber : 36, className : "WebAudioAPISound", methodName : "_decodeSuccess"});
			if(this._options.onerror != null) this._options.onerror(this);
			return;
		}
		this._manager.bufferList.set(this._url,buffer);
		if(this._options.onload != null) this._options.onload(this);
		if(this._options.autoplay) this.play();
	}
	,_error: function() {
		if(this._options.onerror != null) this._options.onerror(this);
	}
	,_makeSource: function(buffer) {
		var source = this._manager.audioContext.createBufferSource();
		this._gainNode = this._manager.audioContext.createGain();
		this._gainNode.gain.value = this._options.volume;
		source.buffer = buffer;
		source.connect(this._gainNode);
		this._gainNode.connect(this._manager.audioContext.destination);
		return source;
	}
	,play: function() {
		var _g = this;
		var buffer = this._manager.bufferList.get(this._url);
		if(buffer != null) {
			this._snd = this._makeSource(buffer);
			this._snd.loop = this._options.loop;
			this._snd.start(0);
			this._isPlaying = true;
			this._snd.onended = function() {
				_g._isPlaying = false;
				if(_g._options.onend != null) _g._options.onend(_g);
			};
			if(this._manager.playingSounds.get(this._url) == null) this._manager.playingSounds.set(this._url,[]);
			this._manager.playingSounds.get(this._url).push(this._snd);
		}
	}
	,isPlaying: function() {
		return this._isPlaying;
	}
	,loop: function(val) {
		if(this._snd == null) return;
		this._snd.loop = val;
	}
	,setVolume: function(val) {
		if(this._gainNode == null) return;
		this._options.volume = val;
		this._gainNode.gain.value = this._options.volume;
	}
	,getVolume: function() {
		return this._options.volume;
	}
	,mute: function(val) {
		if(this._gainNode == null) return;
		if(val) this._gainNode.gain.value = 0; else this._gainNode.gain.value = this._options.volume;
	}
	,stop: function() {
		if(this._snd == null) return;
		this._snd.stop(0);
	}
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = true;
haxe_ds__$StringMap_StringMapIterator.prototype = {
	hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,iterator: function() {
		return new haxe_ds__$StringMap_StringMapIterator(this,this.arrayKeys());
	}
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var msignal_Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal_SlotList.NIL;
	this.priorityBased = false;
};
msignal_Signal.__name__ = true;
msignal_Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		if(existingSlot.once != once) throw new js__$Boot_HaxeError("You cannot addOnce() then add() the same listener without removing the relationship first.");
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
};
var msignal_Signal1 = function(type) {
	msignal_Signal.call(this,[type]);
};
msignal_Signal1.__name__ = true;
msignal_Signal1.__super__ = msignal_Signal;
msignal_Signal1.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot1(this,listener,once,priority);
	}
});
var msignal_Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal_Slot.__name__ = true;
msignal_Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		if(value == null) throw new js__$Boot_HaxeError("listener cannot be null");
		return this.listener = value;
	}
};
var msignal_Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot1.__name__ = true;
msignal_Slot1.__super__ = msignal_Slot;
msignal_Slot1.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
});
var msignal_SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) {
		if(msignal_SlotList.NIL != null) throw new js__$Boot_HaxeError("Parameters head and tail are null. Use the NIL element instead.");
		this.nonEmpty = false;
	} else if(head == null) throw new js__$Boot_HaxeError("Parameter head cannot be null."); else {
		this.head = head;
		if(tail == null) this.tail = msignal_SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal_SlotList.__name__ = true;
msignal_SlotList.prototype = {
	prepend: function(slot) {
		return new msignal_SlotList(slot,this);
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
var Dynamic = { __name__ : ["Dynamic"]};
var __map_reserved = {}
msignal_SlotList.NIL = new msignal_SlotList(null,null);
Waud.defaults = { };
Waud.iOSSafeSampleRateCheck = true;
Waud.preferredSampleRate = 44100;
Waud.unlocked = false;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=sample.js.map