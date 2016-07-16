(function (console, $hx_exports) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var AudioManager = function() {
	this.bufferList = new haxe_ds_StringMap();
	this.types = new haxe_ds_StringMap();
	this.types.set("mp3","audio/mpeg");
	this.types.set("ogg","audio/ogg");
	this.types.set("wav","audio/wav");
	this.types.set("aac","audio/aac");
	this.types.set("m4a","audio/x-m4a");
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
		if(this.audioContext != null) {
			var bfr = this.audioContext.createBuffer(1,1,Waud.preferredSampleRate);
			var src = this.audioContext.createBufferSource();
			src.buffer = bfr;
			src.connect(this.audioContext.destination);
			if(Reflect.field(src,"start") != null) src.start(0); else src.noteOn(0);
			if(src.onended != null) src.onended = $bind(this,this._unlockCallback); else haxe_Timer.delay($bind(this,this._unlockCallback),1);
		} else {
			var audio;
			var _this = window.document;
			audio = _this.createElement("audio");
			var source;
			var _this1 = window.document;
			source = _this1.createElement("source");
			source.src = "data:audio/wave;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";
			audio.appendChild(source);
			window.document.appendChild(audio);
			audio.play();
			if(Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
			Waud.dom.ontouchend = null;
		}
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
		return this.audioContext;
	}
	,destroy: function() {
		if(this.audioContext != null && (this.audioContext.close != null && this.audioContext.close != "")) this.audioContext.close();
		this.audioContext = null;
		this.bufferList = null;
		this.types = null;
	}
};
var BaseSound = function(sndUrl,options) {
	this._b64 = new EReg("(^data:audio).*(;base64,)","i");
	if(sndUrl == null || sndUrl == "") {
		console.log("invalid sound url");
		return;
	}
	if(Waud.audioManager == null) {
		console.log("initialise Waud using Waud.init() before loading sounds");
		return;
	}
	this.duration = 0;
	this.isSpriteSound = false;
	this.url = sndUrl;
	this._isLoaded = false;
	this._isPlaying = false;
	this._muted = false;
	if(options == null) options = { };
	if(options.autoplay != null) options.autoplay = options.autoplay; else options.autoplay = Waud.defaults.autoplay;
	if(options.webaudio != null) options.webaudio = options.webaudio; else options.webaudio = Waud.defaults.webaudio;
	if(options.preload != null) options.preload = options.preload; else options.preload = Waud.defaults.preload;
	if(options.loop != null) options.loop = options.loop; else options.loop = Waud.defaults.loop;
	if(options.volume != null && options.volume >= 0 && options.volume <= 1) options.volume = options.volume; else options.volume = Waud.defaults.volume;
	if(options.onload != null) options.onload = options.onload; else options.onload = Waud.defaults.onload;
	if(options.onend != null) options.onend = options.onend; else options.onend = Waud.defaults.onend;
	if(options.onerror != null) options.onerror = options.onerror; else options.onerror = Waud.defaults.onerror;
	this._options = options;
};
BaseSound.__name__ = true;
BaseSound.prototype = {
	get_duration: function() {
		return 0;
	}
};
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
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
};
var IWaudSound = function() { };
IWaudSound.__name__ = true;
var HTML5Sound = function(url,options,src) {
	BaseSound.call(this,url,options);
	this._snd = Waud.dom.createElement("audio");
	if(src == null) this._addSource(url); else this._snd.appendChild(src);
	if(this._options.preload) this.load();
	if(this._b64.match(url)) url = "";
};
HTML5Sound.__name__ = true;
HTML5Sound.__interfaces__ = [IWaudSound];
HTML5Sound.__super__ = BaseSound;
HTML5Sound.prototype = $extend(BaseSound.prototype,{
	load: function(callback) {
		var _g = this;
		if(!this._isLoaded) {
			this._snd.autoplay = this._options.autoplay;
			this._snd.loop = this._options.loop;
			this._snd.volume = this._options.volume;
			if(callback != null) this._options.onload = callback;
			if(this._options.preload) this._snd.preload = "auto"; else this._snd.preload = "metadata";
			if(this._options.onload != null) {
				this._isLoaded = true;
				this._snd.onloadeddata = function() {
					_g._options.onload(_g);
				};
			}
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
			this._snd.load();
		}
		return this;
	}
	,get_duration: function() {
		if(!this._isLoaded) return 0;
		return this.duration = this._snd.duration;
	}
	,_addSource: function(url) {
		this._src = Waud.dom.createElement("source");
		this._src.src = url;
		if((function($this) {
			var $r;
			var key = $this._getExt(url);
			$r = Waud.audioManager.types.get(key);
			return $r;
		}(this)) != null) {
			var key1 = this._getExt(url);
			this._src.type = Waud.audioManager.types.get(key1);
		}
		this._snd.appendChild(this._src);
		return this._src;
	}
	,_getExt: function(filename) {
		return filename.split(".").pop();
	}
	,setVolume: function(val,spriteName) {
		if(val >= 0 && val <= 1) this._options.volume = val;
		if(!this._isLoaded) return;
		this._snd.volume = this._options.volume;
	}
	,getVolume: function(spriteName) {
		return this._options.volume;
	}
	,mute: function(val,spriteName) {
		if(!this._isLoaded) return;
		this._snd.muted = val;
		if(WaudUtils.isiOS()) {
			if(val && this.isPlaying()) {
				this._muted = true;
				this._snd.pause();
			} else if(this._muted) {
				this._muted = false;
				this._snd.play();
			}
		}
	}
	,toggleMute: function(spriteName) {
		this.mute(!this._muted);
	}
	,play: function(sprite,soundProps) {
		var _g = this;
		this.spriteName = sprite;
		if(!this._isLoaded || this._snd == null) {
			console.log("sound not loaded");
			return -1;
		}
		if(this._isPlaying) this.stop(this.spriteName);
		if(this._muted) return -1;
		if(this.isSpriteSound && soundProps != null) {
			if(this._pauseTime == null) this._snd.currentTime = soundProps.start; else this._snd.currentTime = this._pauseTime;
			if(this._tmr != null) this._tmr.stop();
			this._tmr = haxe_Timer.delay(function() {
				if(soundProps.loop != null && soundProps.loop) _g.play(_g.spriteName,soundProps); else _g.stop(_g.spriteName);
			},Math.ceil(soundProps.duration * 1000));
		}
		haxe_Timer.delay(($_=this._snd,$bind($_,$_.play)),100);
		this._pauseTime = null;
		return 0;
	}
	,togglePlay: function(spriteName) {
		if(this._isPlaying) this.pause(); else this.play();
	}
	,isPlaying: function(spriteName) {
		return this._isPlaying;
	}
	,loop: function(val) {
		if(!this._isLoaded || this._snd == null) return;
		this._snd.loop = val;
	}
	,stop: function(spriteName) {
		if(!this._isLoaded || this._snd == null) return;
		this._snd.currentTime = 0;
		this._snd.pause();
		this._isPlaying = false;
		if(this._tmr != null) this._tmr.stop();
	}
	,pause: function(spriteName) {
		if(!this._isLoaded || this._snd == null) return;
		this._snd.pause();
		this._pauseTime = this._snd.currentTime;
		this._isPlaying = false;
		if(this._tmr != null) this._tmr.stop();
	}
	,setTime: function(time) {
		if(!this._isLoaded || this._snd == null || time > this._snd.duration) return;
		this._snd.currentTime = time;
	}
	,getTime: function() {
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return 0;
		return this._snd.currentTime;
	}
	,onEnd: function(callback,spriteName) {
		this._options.onend = callback;
		return this;
	}
	,onLoad: function(callback) {
		this._options.onload = callback;
		return this;
	}
	,onError: function(callback) {
		this._options.onerror = callback;
		return this;
	}
	,destroy: function() {
		if(this._snd != null) {
			this._snd.pause();
			this._snd.removeChild(this._src);
			this._src = null;
			this._snd = null;
		}
		this._isPlaying = false;
	}
});
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
var pixi_plugins_app_Application = function() {
	this._animationFrameId = null;
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
			console.log("pixi.plugins.app.Application > Deprecated: skipFrame - use fps property and set it to 30 instead");
			this.set_fps(30);
		}
		return this.skipFrame = val;
	}
	,start: function(rendererType,parentDom,canvasElement) {
		if(rendererType == null) rendererType = "auto";
		if(canvasElement == null) {
			var _this = window.document;
			this.canvas = _this.createElement("canvas");
			this.canvas.style.width = this.width + "px";
			this.canvas.style.height = this.height + "px";
			this.canvas.style.position = "absolute";
		} else this.canvas = canvasElement;
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
		if(parentDom == null) window.document.body.appendChild(this.renderer.view); else parentDom.appendChild(this.renderer.view);
		this.resumeRendering();
		this.addStats();
	}
	,resumeRendering: function() {
		if(this.autoResize) window.onresize = $bind(this,this._onWindowResize);
		if(this._animationFrameId == null) this._animationFrameId = window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
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
		this._animationFrameId = window.requestAnimationFrame($bind(this,this._onRequestAnimationFrame));
	}
	,addStats: function() {
		if(window.Perf != null) new Perf().addInfo(["UNKNOWN","WEBGL","CANVAS"][this.renderer.type] + " - " + this.pixelRatio);
	}
};
var Main = function() {
	this._b64Str = "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAABEAABwpgADBwsLDxISFhoaHiEhJSkpLTAwNDg4PEBDQ0dLS09SUlZaWl5hYWVpaW1wcHR4eHyAg4OHi4uPkpKWmpqeoaGlqamtsLC0uLi8wMPDx8vLz9LS1tra3uHh5enp7fDw9Pj4/P8AAAA5TEFNRTMuOThyAc0AAAAAAAAAABSAJAbZQgAAgAAAcKaU26atAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAAAFHBnPDWngAs5omk3P2ACCAzJkzJkzZ0zp8z50y48WDhQQZQsa1mcOmePifn+f3qemucNeZ0eBhYBgDkBSALAEAHIIYQg6EPQ80zTNM00PV7+I8YFYrGR5E183fv7j98ADMxH/gBj/6HgDvgAYe+OHgAAAAAGHh4eHgAAAAAGHh4eHgAAAAAGHh4eHgAAAAAGHh4eHgAAAAAGHh4eHgAAAAAGHh4ePAAAAAEYeHh7wAAAHboGA4HA6HY8GAgDAQAAMGlDADDcwvCsSAC9pI0zjs56MdazyS4BgZAEERANhgPAVYfRyZyGZAmiRgzoAALAEhgXICIgFA2SVrA6OR/VwOKUuQMwKqANU6fEUW4GoFZwGOg1oGbo1IGbI9aSTo+BidJcBk/JoBk/LQBhwHCBjwHaiySn+BiEEyBglC0BhlDIBhnDoBgYCOBhOCf/+BgIAaA8AAGAMAQGAMAwXxBskAAAP/+McILCCw5IoEUCOoXMLm///MSKkVMi8XjEul1IvJarKYAUADgQAFEACgYGeB1GB2iYhg5YdIYe//uSxA0Dy8wtGB38gAFRt6LB/hVISDAGFsjfhlBpEYfDWp6mU5D+4OG9DAkwHgwQMEqMCZAKzAZgFU8dDDXA2s7/7//////6v///3/7c+6q8RkAfCaA+KmG71doIJJQAIwNIVXAAA6YAGAFGAQgChgPgDCf/co7HQAyCj8LCFEpTz9gOMXp//9v//////X////7/////////t6//t5DrdFMdWMTdGQiEVCnMPMg2y3cmYKIAAMwPEVMMADAHDAAgAswCIAXMB9Abj/e1wc5+HgMfRIRIWqffgBBpv//+///////p//9P////0/////+/9v1z8uxS7qpCEWQqSM85kZyjFx1dmoJIQAIwQwVBMAEAHTABQAowCMAYMB8AfT+9GXo54JQEeg4OoXMdgcBxhen//2//////9f/19f/0//+r//////9v/uz59Za22vMmaUXyGKDKy3lMwUOABmJSpoYA4DhgDAGmBEA6YD2BFH8ut6pzkVGPACHB5GlqUCSi6e/9///9X57/3////v9ewP0tUkLrvDRUDpcJyYmxyq1oBP/7ksR6A8qZvRYP8KpBSzWiwf4VSXQAIwUIUlMAKAGzABwAwwCMAeMB6Alz9sHhY5oMTHYCDA6jU0GBwmJF6f//b//////1//X////////////1//o7Our9eiER1GGVzkfBkxBTUUzLjk4LjKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrLHKrAQ4ABmCuiihgBoA0YAQAGmARAEJgPIFEfnrAgnMxoY6AoQHkaWhQJMVcv1//+///////p/+n+v/////////+b0//o6VT6G3SjnuZEIZYgOOXHLGtAI6AAYuigZgHANmAWAYYEoERgOwFefhJErHL/+5LE7IPI6CkWD3+IAUg0osH+FUnB2Y7AwQHURmgxebrHbP93///+3/1////ur/Jr5RbBaUsBAmFAmcTEFNRTMuOTguMqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVcscqV9i8phPYlsYBSANGAMACZgFQB+YDmCVHxN8W5xs4GNg6YNASAFl06GARTa///N////////9P3//7+39tq//////T/r61zK07PcmpjsUCnZjqoJBOOWNNDJeYwowSRMAqAGTAGQBIwCsA+MBwBNT2//7ksT/g8qpsxQP8EpJZjeigf4JSIukY4kdTGYeMFANAExGXBQIS+n//y/////////X/7/+3/6+n////6+3/7J2WStqbOiIdQhDhGkqhRkxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXLHKlhpASYU+I0GAWgCxgDQAmYBUAgmA2gnh6iveCcJOxjAPmCwIgBYlLa0ttc1//+b////////6f/////7V/////Tze2m1/+9D17pQqCAILMHetfHLGmhlAUYVcIgmAXAC5gDYAkYBSAhGA0Aop5mnpT/+5LE/4PKzbkUD/BKSVW3ooH+CUgf89mXkBhAKgGZzTUsus90//+X////////6//r//+/PX/////r7euz0tqqcElGZmsvMRHCA6MlCTEFNRTMuOTguMlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVyxypYaQxMK/EFjAMQBQwBoATMAoAQzAYwUo8T/57P1fjLCMwcGQCs6lNqW2ua///N//////7////////p6/////p7//2uVy8yXksdDlMD1QI5wtAzY5Y0z+oJjCzA+kwDAATMAbAEDAJwEQwF4FTO8y///uSxP+DyoG1FA/wSolXNaKB/YlRuD6IEykiMGB0JTOZVZl1nun//y//////+v/6//fft2/32X0/////X/39JatJkW6uRJVUYquDZGE1EDDjExBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVcscrMaS9MJ9DQjAKQAwwBQALMAeAOTATQSo55Hj5O/cDHh0wECSFa1M2p21z///N//////6f/p///71///////9Pf/v1zvZbnfVaqaYGsIcyFTCGxyxtRlQI6IxkwqAswVAowdDowEgExOWe57DtHMxsf/7ksT/g8qdvRQP7EqBZbcigf2JUcAAGl84M1ZnrPbP87////t/81/q//7aPdcmIT64fSgkCxEYBB48DJiCmopmXHJwXGSqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrLHKzGlATpO7DCsCDBQCzBwOzAQwTQ45vrPMCpAdDAGAB0AgASXrhTN+dtc///zf////////T///3////////T3/+icyWvkm3vZHR2YLCUljljajKpjpyvzCwBzBUCjBsOjAPgTk4YLugMCeAdzAFwB4D/+5LE/4PKeb0WD+xKgRSFosHf7QCAAqczg0F6es9///y/////////X///2r///////6+3/5endp3ZEyzFflI6FSOcUmIKaimZccnBcZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVyxysy5Up1LRxhaAhgoBJg0HZgHYJ4b6r4wmBJgPBgCQA+CQARKl0qG/O2uf//6f////////T///u////////6e//6aVaUzboY6IS86up5GOolLjljalqxjqyXzCwAzBcCDBkPDANAUE3Q70MOGeTER4G//uSxP+DyfWxFg78SMFEN6LB34kYAqaTcZi9PWe/+3////b//b///2/V7fcl7z4MAsXDCQVTEFNRTMuOTguMlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVe8ysy5Yp1rFRheARgsBJgsHpgGIKIbVn7Ugfn0BjEIBoQNlFeI83Kp9v//9X//////v/+r///3////////V7///dnUrUrVavZbaVF3RQNud5aiq6jrp9TC4ATBcBjBcPDAKgUc2Dz4yA9n0DEoAEBQyEP/7ksT/g8pNuRYO/EjI/4Wiwd/tALSRhUKx5///9f//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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr+dsRdXB2C2o0L4OCEABqYAICjGqjfXJ0vQFQigRQ9kDtw/OX+X/7P///931f////ZT+tS4IHDSFDgyGiYuXE0Rf3C3FFNzCuge4WAWAcAPAUAyMANBRTX4fkQ8PswB4RhU9GluxDk/e7t//9f//////b/+5LE/4PH1C0WDv9IAP0FosHf6QD/9///////f////9ft/8pfdfc+6oQ5LuYaxWWVA6YgpqKZlxycFxlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/mdiLqaGFahEocAthAA6DADMwBIFANpa9vT3eDCnxAET3YA7cPzl/n//+n//////v/+3v//9f/T/////+nr/8mnRNVZ5iMqK7Mgg2jndQ39wtw4qcwq4JYDAFQMAGgqAYGAMgnpuXfpIf3uYg8FwqaDK//uSxP+DyBwtFg7/SAE5N6LB/QlQ3Ihyfvd///1//////9v/3/////+//////19P+nl2fVlRzHdgT9pXhFMR4NkxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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wBgALMBrAOj4pzes4yCAw0jQWTxam/ACDU///7//////////+5LE/4PJRbUYD/CqSQMFIwHsfMDT///////////7///ulp+9d6NMzvUTNYVKJiCmopmXHJwXGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV3rdyCSUAAwoksQQAqBSHlhgNQCSfC0gxGCMAB4QAzDQAqnE1Z+5Xcb/7v/////////91f1IovpvkSxtQDDooby3coYKIAAzDdVSMAEBwwizgVMB9AZD/y1VUwUEAaBQD6JAESJKn34lF1n/v///q/ZV+//uSxP+Dx8gpGA9j5gEztaMB/hVI3p9n//31fveoVrsjS6ljxGBRAGkxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVd6uzUEkIARh9KkmAEA6YpRxsGA+AOp/qC+4YJ8AQgYB+EgCFC5jr9yu4ds/3f//1/t/+v7av/+6vSM3C6MJ2uWWE5ETm1gAjlutMwUQAAZgi4p4YAOAOGACABZgEQA2YD6BAH9htI5zsTAI8hweSBY9Av/7ksT/g8f4KRgPY+YBGAUiwez8wACDTdf//v//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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVxyxpn1EYAEYRgKYmARAD5gCoAkYBaAcGA/AhJ/HWSsc6MJj0LAIQl8mSycGBFfT//7f/////+v/69////3/X0/////+X9OlK2826IRwQJ1BbLFBnYkmWNalfYRAAZhIookYBKAOGALACZgFgB2YD6CJH//uSxP+Dyim7Fg/wqkFbt6KB/hVI5n6F5zMyGOgyYPABfFg0mBAIptf//v//////6f/p//9ff//62//7//v5v0+9/3n1maRzi0zuzDoLTFMQU1FMy45OC4yVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVccsaZ9RGAAGEtCeJgEwA6YAuAJGAWgHRgPAI6faVr5HKjWY5DRg4Al8mCyIKBCX0//+X////////6//t6f//+n////6+X/RLsv5HR2Icsj+hVQGUx4IEXyxypX2EQACYTeJnGAUgDRgDAAmYBUAemA6gv/7ksT/g8q9oRQP8EpJWbcigf4JSUh82u9GchNxjYNmDQEgBZdOhgEU2v//zf/////+n/6f///p3/+v/r///f33+vrpW50ZSGWrWKSTKlihChlTEFNRTMuOTguMlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV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hiEIVP/7ksT/g8pRuRYO/EjBPrXiwd+VESJ6t2j8/RX+f//6f////////T///39f//////6e//9++RakRNCOfBvRxYk7nExBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVXneWpCtY7CakDC6YKgMYKh4YBEClmpifZh2PphUAWCp7N1iE5R3n/9f///+v//6f//r3fQWMKkKqYPBpoDA4sFG9529Il6nY62AoXjBQBTBIPTAHQUw0gP8tA5f4DAIQHhA4kXxDyuWj7f//6v////////+5LE/4PKAbUWDv6ICTw2IsH9CVH/q/////+3/////1e//9tuzpJ9dSNVCzO1B0jJlExBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV53l+Qr2OyEtBwwmCoCGCIeGALAppnin7wbr+BUAiDqHNhiE5R3n/9f//+75f/7v7//+vd3tF6FvcoXLCWDANhoCoUb7zt6RL9OzToCBiMFADMDg7MARBTjL7/7UwCsB+BgBCKgAyirZIbA4YPb///T////uSxP+DyBwrFg7/SAE4tyLB39EB//////5Pr//f+3/6/////p7/99GrVEW17ctR9ke7sVDqNImIKaim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5g6oy5nj/zhGmDKZQzR4c26Sq7/+Y7noZAJOapI6ZmFLUpcKH//zDouTQxIzSxRwKBpjkYcMzElhmY///zQZQTDkcDEUEzIAwzEUoDKsepLS1Lv////+YagEYVkEZYlkZVlkIQqM//uSxP+ALp4bKln6gAUJtWPHPdACayWMuze1W3clV2g////8w6GEwGGwzhTAxcMczCHEgEYxMMUz0OczIMWtu5r/x1d//////AAamMQ+mSRVmAYCGAwgmORMmDokGH4FGCgemDosGNYtVdXauruOt6////////MQQ2MBQ6MXxsMdyGZIYPiQY3kYYIBiNB4YWigYMCaYqB+YPAWYFB6YtC/qtu5W3cy3r//HX/////////5jANZUAUwuE0xqIUwJBwwBA0w8F8wVEAxFChVMQU1FMy45OC4yVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksRqA8AAAaQcAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
	var _g = this;
	pixi_plugins_app_Application.call(this);
	PIXI.RESOLUTION = this.pixelRatio = window.devicePixelRatio;
	this.autoResize = true;
	this.backgroundColor = 6227124;
	this.roundPixels = true;
	this.onResize = $bind(this,this._resize);
	pixi_plugins_app_Application.prototype.start.call(this);
	this._btnContainer = new PIXI.Container();
	this.stage.addChild(this._btnContainer);
	var label = new PIXI.Text("MP3: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	this._addButton("Funk",200,0,60,30,function() {
		_g._funkMP3.play();
	});
	this._addButton("Glass",260,0,60,30,function() {
		_g._glassMP3.play();
	});
	this._addButton("Bell",320,0,60,30,function() {
		_g._bellMP3.play();
	});
	this._addButton("Can",380,0,60,30,function() {
		_g._canMP3.play();
	});
	label = new PIXI.Text("M4A: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 50;
	this._addButton("Sound 1",200,50,60,30,function() {
		_g._sound1M4A.play();
	});
	this._addButton("Sound 2",260,50,60,30,function() {
		_g._sound2M4A.play();
	});
	label = new PIXI.Text("AAC: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 100;
	this._addButton("Glass",200,100,60,30,function() {
		_g._glassAAC.play();
	});
	this._addButton("Bell",260,100,60,30,function() {
		_g._bellAAC.play();
	});
	this._addButton("Can",320,100,60,30,function() {
		_g._canAAC.play();
	});
	label = new PIXI.Text("OGG: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 150;
	this._addButton("Glass",200,150,60,30,function() {
		_g._glassOGG.play();
	});
	this._addButton("Bell",260,150,60,30,function() {
		_g._bellOGG.play();
	});
	this._addButton("Can",320,150,60,30,function() {
		_g._canOGG.play();
	});
	label = new PIXI.Text("Controls: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 200;
	this._addButton("Mute",200,200,60,30,$bind(this,this._mute));
	this._addButton("Unmute",260,200,60,30,$bind(this,this._unmute));
	this._addButton("BG Vol 0",320,200,60,30,function() {
		_g._bgSnd.setVolume(0);
	});
	this._addButton("BG Vol 1",380,200,60,30,function() {
		_g._bgSnd.setVolume(1);
	});
	this._addButton("BG Toggle Play",200,240,100,30,function() {
		_g._bgSnd.togglePlay();
	});
	this._addButton("BG Toggle Mute",300,240,100,30,function() {
		_g._bgSnd.toggleMute();
	});
	this._addButton("Stop All",400,240,60,30,$bind(this,this._stop));
	this._addButton("Pause All",460,240,60,30,$bind(this,this._pause));
	label = new PIXI.Text("Sprite (M4A): ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 300;
	this._addButton("Glass",200,300,60,30,function() {
		_g._audSprite.play("glass");
	});
	this._addButton("Bell (loop)",260,300,120,30,function() {
		_g._audSprite.play("bell");
	});
	this._addButton("Can",380,300,60,30,function() {
		_g._audSprite.play("canopening");
	});
	this._addButton("Play All",440,300,60,30,$bind(this,this.playAllTheThings));
	label = new PIXI.Text("Test 1: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 350;
	this._addButton("Play",200,350,60,30,function() {
		_g._countdown.play();
	});
	this._addButton("Pause",260,350,60,30,function() {
		_g._countdown.pause();
	});
	this._addButton("Stop",320,350,60,30,function() {
		_g._countdown.stop();
	});
	this._addButton("Seek 1s",380,350,60,30,function() {
		_g._countdown.setTime(_g._countdown.getTime() + 1);
	});
	label = new PIXI.Text("Test 2 (M4A): ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 400;
	this._addButton("Play",200,400,60,30,function() {
		_g._audSprite.play("countdown");
	});
	this._addButton("Pause",260,400,60,30,function() {
		_g._audSprite.pause("countdown");
	});
	this._addButton("Stop",320,400,60,30,function() {
		_g._audSprite.stop("countdown");
	});
	label = new PIXI.Text("Base64: ",{ font : "26px Tahoma", fill : "#FFFFFF"});
	this._btnContainer.addChild(label);
	label.position.y = 450;
	this._addButton("Web Audio",200,450,120,30,function() {
		_g._b64SndWebAudio.play();
	});
	this._addButton("HTML5 Audio",320,450,120,30,function() {
		_g._b64SndHTML5.play();
	});
	this._addButton("DESTROY",200,500,180,30,function() {
		Waud.destroy();
	});
	this._ua = new PIXI.Text(window.navigator.userAgent,{ font : "12px Tahoma", fill : "#FFFFFF"});
	this.stage.addChild(this._ua);
	Waud.init();
	Waud.autoMute();
	Waud.enableTouchUnlock($bind(this,this.touchUnlock));
	Waud.defaults.onload = $bind(this,this._onLoad);
	this._bgSnd = new WaudSound("assets/loop.mp3",{ loop : true, autoplay : false, volume : 1, onload : $bind(this,this._playBgSound)});
	this._funkMP3 = new WaudSound("assets/funk100.mp3");
	this._glassMP3 = new WaudSound("assets/glass.mp3");
	this._bellMP3 = new WaudSound("assets/bell.mp3");
	this._canMP3 = new WaudSound("assets/canopening.mp3");
	this._sound1M4A = new WaudSound("assets/l1.m4a");
	this._sound2M4A = new WaudSound("assets/l2.m4a");
	this._glassAAC = new WaudSound("assets/glass.aac");
	this._bellAAC = new WaudSound("assets/bell.aac");
	this._canAAC = new WaudSound("assets/canopening.aac");
	this._glassOGG = new WaudSound("assets/glass.ogg");
	this._bellOGG = new WaudSound("assets/bell.ogg");
	this._canOGG = new WaudSound("assets/canopening.ogg");
	this._ua.text += "\n" + Waud.getFormatSupportString();
	this._ua.text += "\nWeb Audio API: " + Std.string(Waud.isWebAudioSupported);
	this._ua.text += "\nHTML5 Audio: " + Std.string(Waud.isHTML5AudioSupported);
	this._audSprite = new WaudSound("assets/sprite.json",{ webaudio : true});
	this._audSprite.onEnd(function(snd) {
		console.log("Glass finished.");
	},"glass");
	this._audSprite.onEnd(function(snd1) {
		console.log("Bell finished.");
	},"bell");
	this._audSprite.onEnd(function(snd2) {
		console.log("Canopening finished.");
	},"canopening");
	this._countdown = new WaudSound("assets/countdown.mp3",{ webaudio : true});
	this._b64SndWebAudio = new WaudSound(this._b64Str);
	this._b64SndHTML5 = new WaudSound(this._b64Str,{ webaudio : false});
	this._resize();
};
Main.__name__ = true;
Main.main = function() {
	new Main();
};
Main.__super__ = pixi_plugins_app_Application;
Main.prototype = $extend(pixi_plugins_app_Application.prototype,{
	_onLoad: function(snd) {
	}
	,touchUnlock: function() {
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
	,_pause: function() {
		Waud.pause();
	}
	,playAllTheThings: function() {
		var _g = this;
		haxe_Timer.delay(function() {
			_g._audSprite.play("glass");
		},100);
		haxe_Timer.delay(function() {
			_g._audSprite.play("bell");
		},200);
		haxe_Timer.delay(function() {
			_g._audSprite.play("canopening");
		},300);
	}
	,_addButton: function(label,x,y,width,height,callback) {
		var btn = new Button(label,width,height);
		btn.position.set(x,y);
		btn.action.add(callback);
		btn._enabled = true;
		this._btnContainer.addChild(btn);
	}
	,_resize: function() {
		this._btnContainer.position.set((window.innerWidth - this._btnContainer.width) / 2,(window.innerHeight - this._btnContainer.height) / 2);
	}
});
Math.__name__ = true;
var Perf = $hx_exports.Perf = function(pos,offset) {
	if(offset == null) offset = 0;
	if(pos == null) pos = "TR";
	this._perfObj = window.performance;
	if(Reflect.field(this._perfObj,"memory") != null) this._memoryObj = Reflect.field(this._perfObj,"memory");
	this._memCheck = this._perfObj != null && this._memoryObj != null && this._memoryObj.totalJSHeapSize > 0;
	this._pos = pos;
	this._offset = offset;
	this.currentFps = 60;
	this.currentMs = 0;
	this.currentMem = "0";
	this.lowFps = 60;
	this.avgFps = 60;
	this._measureCount = 0;
	this._totalFps = 0;
	this._time = 0;
	this._ticks = 0;
	this._fpsMin = 60;
	this._fpsMax = 60;
	if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) this._startTime = this._perfObj.now(); else this._startTime = new Date().getTime();
	this._prevTime = -Perf.MEASUREMENT_INTERVAL;
	this._createFpsDom();
	this._createMsDom();
	if(this._memCheck) this._createMemoryDom();
	if(($_=window,$bind($_,$_.requestAnimationFrame)) != null) this.RAF = ($_=window,$bind($_,$_.requestAnimationFrame)); else if(window.mozRequestAnimationFrame != null) this.RAF = window.mozRequestAnimationFrame; else if(window.webkitRequestAnimationFrame != null) this.RAF = window.webkitRequestAnimationFrame; else if(window.msRequestAnimationFrame != null) this.RAF = window.msRequestAnimationFrame;
	if(($_=window,$bind($_,$_.cancelAnimationFrame)) != null) this.CAF = ($_=window,$bind($_,$_.cancelAnimationFrame)); else if(window.mozCancelAnimationFrame != null) this.CAF = window.mozCancelAnimationFrame; else if(window.webkitCancelAnimationFrame != null) this.CAF = window.webkitCancelAnimationFrame; else if(window.msCancelAnimationFrame != null) this.CAF = window.msCancelAnimationFrame;
	if(this.RAF != null) this._raf = Reflect.callMethod(window,this.RAF,[$bind(this,this._tick)]);
};
Perf.__name__ = true;
Perf.prototype = {
	_tick: function(val) {
		var time;
		if(this._perfObj != null && ($_=this._perfObj,$bind($_,$_.now)) != null) time = this._perfObj.now(); else time = new Date().getTime();
		this._ticks++;
		if(this._raf != null && time > this._prevTime + Perf.MEASUREMENT_INTERVAL) {
			this.currentMs = Math.round(time - this._startTime);
			this.ms.innerHTML = "MS: " + this.currentMs;
			this.currentFps = Math.round(this._ticks * 1000 / (time - this._prevTime));
			if(this.currentFps > 0 && val > Perf.DELAY_TIME) {
				this._measureCount++;
				this._totalFps += this.currentFps;
				this.lowFps = this._fpsMin = Math.min(this._fpsMin,this.currentFps);
				this._fpsMax = Math.max(this._fpsMax,this.currentFps);
				this.avgFps = Math.round(this._totalFps / this._measureCount);
			}
			this.fps.innerHTML = "FPS: " + this.currentFps + " (" + this._fpsMin + "-" + this._fpsMax + ")";
			if(this.currentFps >= 30) this.fps.style.backgroundColor = Perf.FPS_BG_CLR; else if(this.currentFps >= 15) this.fps.style.backgroundColor = Perf.FPS_WARN_BG_CLR; else this.fps.style.backgroundColor = Perf.FPS_PROB_BG_CLR;
			this._prevTime = time;
			this._ticks = 0;
			if(this._memCheck) {
				this.currentMem = this._getFormattedSize(this._memoryObj.usedJSHeapSize,2);
				this.memory.innerHTML = "MEM: " + this.currentMem;
			}
		}
		this._startTime = time;
		if(this._raf != null) this._raf = Reflect.callMethod(window,this.RAF,[$bind(this,this._tick)]);
	}
	,_createDiv: function(id,top) {
		if(top == null) top = 0;
		var div;
		var _this = window.document;
		div = _this.createElement("div");
		div.id = id;
		div.className = id;
		div.style.position = "absolute";
		var _g = this._pos;
		switch(_g) {
		case "TL":
			div.style.left = this._offset + "px";
			div.style.top = top + "px";
			break;
		case "TR":
			div.style.right = this._offset + "px";
			div.style.top = top + "px";
			break;
		case "BL":
			div.style.left = this._offset + "px";
			div.style.bottom = (this._memCheck?48:32) - top + "px";
			break;
		case "BR":
			div.style.right = this._offset + "px";
			div.style.bottom = (this._memCheck?48:32) - top + "px";
			break;
		}
		div.style.width = "80px";
		div.style.height = "12px";
		div.style.lineHeight = "12px";
		div.style.padding = "2px";
		div.style.fontFamily = Perf.FONT_FAMILY;
		div.style.fontSize = "9px";
		div.style.fontWeight = "bold";
		div.style.textAlign = "center";
		window.document.body.appendChild(div);
		return div;
	}
	,_createFpsDom: function() {
		this.fps = this._createDiv("fps");
		this.fps.style.backgroundColor = Perf.FPS_BG_CLR;
		this.fps.style.zIndex = "995";
		this.fps.style.color = Perf.FPS_TXT_CLR;
		this.fps.innerHTML = "FPS: 0";
	}
	,_createMsDom: function() {
		this.ms = this._createDiv("ms",16);
		this.ms.style.backgroundColor = Perf.MS_BG_CLR;
		this.ms.style.zIndex = "996";
		this.ms.style.color = Perf.MS_TXT_CLR;
		this.ms.innerHTML = "MS: 0";
	}
	,_createMemoryDom: function() {
		this.memory = this._createDiv("memory",32);
		this.memory.style.backgroundColor = Perf.MEM_BG_CLR;
		this.memory.style.color = Perf.MEM_TXT_CLR;
		this.memory.style.zIndex = "997";
		this.memory.innerHTML = "MEM: 0";
	}
	,_getFormattedSize: function(bytes,frac) {
		if(frac == null) frac = 0;
		var sizes = ["Bytes","KB","MB","GB","TB"];
		if(bytes == 0) return "0";
		var precision = Math.pow(10,frac);
		var i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes * precision / Math.pow(1024,i)) / precision + " " + sizes[i];
	}
	,addInfo: function(val) {
		this.info = this._createDiv("info",this._memCheck?48:32);
		this.info.style.backgroundColor = Perf.INFO_BG_CLR;
		this.info.style.color = Perf.INFO_TXT_CLR;
		this.info.style.zIndex = "998";
		this.info.innerHTML = val;
	}
};
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
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
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
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
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
var Waud = $hx_exports.Waud = function() { };
Waud.__name__ = true;
Waud.init = function(d) {
	if(Waud.__audioElement == null) {
		if(d == null) d = window.document;
		Waud.dom = d;
		Waud.__audioElement = Waud.dom.createElement("audio");
		if(Waud.audioManager == null) Waud.audioManager = new AudioManager();
		Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		Waud.isHTML5AudioSupported = Reflect.field(window,"Audio") != null;
		if(Waud.isWebAudioSupported) Waud.audioContext = Waud.audioManager.createAudioContext();
		Waud.sounds = new haxe_ds_StringMap();
	}
};
Waud.autoMute = function() {
	var blur = function() {
		if(Waud.sounds != null) {
			var $it0 = Waud.sounds.iterator();
			while( $it0.hasNext() ) {
				var sound = $it0.next();
				sound.mute(true);
			}
		}
	};
	var focus = function() {
		if(!Waud.isMuted && Waud.sounds != null) {
			var $it1 = Waud.sounds.iterator();
			while( $it1.hasNext() ) {
				var sound1 = $it1.next();
				sound1.mute(false);
			}
		}
	};
	Waud._focusManager = new WaudFocusManager();
	Waud._focusManager.focus = focus;
	Waud._focusManager.blur = blur;
};
Waud.enableTouchUnlock = function(callback) {
	Waud.__touchUnlockCallback = callback;
	Waud.dom.ontouchend = ($_=Waud.audioManager,$bind($_,$_.unlockAudio));
};
Waud.mute = function(val) {
	if(val == null) val = true;
	Waud.isMuted = val;
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.mute(val);
		}
	}
};
Waud.stop = function() {
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.stop();
		}
	}
};
Waud.pause = function() {
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.pause();
		}
	}
};
Waud.getFormatSupportString = function() {
	var support = "OGG: " + Waud.__audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
	support += ", WAV: " + Waud.__audioElement.canPlayType("audio/wav; codecs=\"1\"");
	support += ", MP3: " + Waud.__audioElement.canPlayType("audio/mpeg;");
	support += ", AAC: " + Waud.__audioElement.canPlayType("audio/aac;");
	support += ", M4A: " + Waud.__audioElement.canPlayType("audio/x-m4a;");
	return support;
};
Waud.isSupported = function() {
	if(Waud.isWebAudioSupported == null || Waud.isHTML5AudioSupported == null) {
		Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
		Waud.isHTML5AudioSupported = Reflect.field(window,"Audio") != null;
	}
	return Waud.isWebAudioSupported || Waud.isHTML5AudioSupported;
};
Waud.isOGGSupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/ogg; codecs=\"vorbis\"");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isWAVSupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/wav; codecs=\"1\"");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isMP3Supported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/mpeg;");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isAACSupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/aac;");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.isM4ASupported = function() {
	var canPlay = Waud.__audioElement.canPlayType("audio/x-m4a;");
	return Waud.isHTML5AudioSupported && canPlay != null && (canPlay == "probably" || canPlay == "maybe");
};
Waud.destroy = function() {
	if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.destroy();
		}
	}
	Waud.sounds = null;
	if(Waud.audioManager != null) Waud.audioManager.destroy();
	Waud.audioManager = null;
	Waud.audioContext = null;
	Waud.__audioElement = null;
	if(Waud._focusManager != null) {
		Waud._focusManager.clearEvents();
		Waud._focusManager.blur = null;
		Waud._focusManager.focus = null;
	}
};
var WaudFocusManager = $hx_exports.WaudFocusManager = function() {
	var _g = this;
	this._hidden = "";
	this._visibilityChange = "";
	this._currentState = "";
	if(Reflect.field(window.document,"hidden") != null) {
		this._hidden = "hidden";
		this._visibilityChange = "visibilitychange";
	} else if(Reflect.field(window.document,"mozHidden") != null) {
		this._hidden = "mozHidden";
		this._visibilityChange = "mozvisibilitychange";
	} else if(Reflect.field(window.document,"msHidden") != null) {
		this._hidden = "msHidden";
		this._visibilityChange = "msvisibilitychange";
	} else if(Reflect.field(window.document,"webkitHidden") != null) {
		this._hidden = "webkitHidden";
		this._visibilityChange = "webkitvisibilitychange";
	}
	if(Reflect.field(window,"addEventListener") != null) {
		window.addEventListener("focus",$bind(this,this._focus));
		window.addEventListener("blur",$bind(this,this._blur));
		window.addEventListener("pageshow",$bind(this,this._focus));
		window.addEventListener("pagehide",$bind(this,this._blur));
		document.addEventListener(this._visibilityChange,$bind(this,this._handleVisibilityChange));
	} else if(Reflect.field(window,"attachEvent") != null) {
		window.attachEvent("onfocus",$bind(this,this._focus));
		window.attachEvent("onblur",$bind(this,this._blur));
		window.attachEvent("pageshow",$bind(this,this._focus));
		window.attachEvent("pagehide",$bind(this,this._blur));
		document.attachEvent(this._visibilityChange,$bind(this,this._handleVisibilityChange));
	} else window.onload = function() {
		window.onfocus = $bind(_g,_g._focus);
		window.onblur = $bind(_g,_g._blur);
		window.onpageshow = $bind(_g,_g._focus);
		window.onpagehide = $bind(_g,_g._blur);
	};
};
WaudFocusManager.__name__ = true;
WaudFocusManager.prototype = {
	_handleVisibilityChange: function() {
		if(Reflect.field(window.document,this._hidden) != null && Reflect.field(window.document,this._hidden) && this.blur != null) this.blur(); else if(this.focus != null) this.focus();
	}
	,_focus: function() {
		if(this._currentState != "focus" && this.focus != null) this.focus();
		this._currentState = "focus";
	}
	,_blur: function() {
		if(this._currentState != "blur" && this.blur != null) this.blur();
		this._currentState = "blur";
	}
	,clearEvents: function() {
		if(Reflect.field(window,"removeEventListener") != null) {
			window.removeEventListener("focus",$bind(this,this._focus));
			window.removeEventListener("blur",$bind(this,this._blur));
			window.removeEventListener("pageshow",$bind(this,this._focus));
			window.removeEventListener("pagehide",$bind(this,this._blur));
			window.removeEventListener(this._visibilityChange,$bind(this,this._handleVisibilityChange));
		} else if(Reflect.field(window,"removeEvent") != null) {
			window.removeEvent("onfocus",$bind(this,this._focus));
			window.removeEvent("onblur",$bind(this,this._blur));
			window.removeEvent("pageshow",$bind(this,this._focus));
			window.removeEvent("pagehide",$bind(this,this._blur));
			window.removeEvent(this._visibilityChange,$bind(this,this._handleVisibilityChange));
		} else {
			window.onfocus = null;
			window.onblur = null;
			window.onpageshow = null;
			window.onpagehide = null;
		}
	}
};
var WaudSound = $hx_exports.WaudSound = function(url,options) {
	if(Waud.audioManager == null) {
		console.log("initialise Waud using Waud.init() before loading sounds");
		return;
	}
	this._options = options;
	if(url.indexOf(".json") > 0) {
		this.isSpriteSound = true;
		this._spriteDuration = 0;
		this._spriteSounds = new haxe_ds_StringMap();
		this._spriteSoundEndCallbacks = new haxe_ds_StringMap();
		this._loadSpriteJson(url);
	} else {
		this.isSpriteSound = false;
		this._init(url);
	}
	if(new EReg("(^data:audio).*(;base64,)","i").match(url)) {
		var key = "snd" + new Date().getTime();
		Waud.sounds.set(key,this);
		url = "";
	} else Waud.sounds.set(url,this);
};
WaudSound.__name__ = true;
WaudSound.__interfaces__ = [IWaudSound];
WaudSound.prototype = {
	_loadSpriteJson: function(jsonUrl) {
		var _g = this;
		var xobj = new XMLHttpRequest();
		xobj.open("GET",jsonUrl,true);
		xobj.onreadystatechange = function() {
			if(xobj.readyState == 4 && xobj.status == 200) {
				_g._spriteData = JSON.parse(xobj.responseText);
				var url = _g._spriteData.src;
				if(jsonUrl.indexOf("/") > -1) url = jsonUrl.substring(0,jsonUrl.lastIndexOf("/") + 1) + url;
				_g._init(url);
			}
		};
		xobj.send(null);
	}
	,_init: function(soundUrl) {
		this.url = soundUrl;
		if(Waud.isWebAudioSupported && Waud.useWebAudio && (this._options == null || this._options.webaudio == null || this._options.webaudio)) {
			if(this.isSpriteSound) this._loadSpriteSound(this.url); else this._snd = new WebAudioAPISound(this.url,this._options);
		} else if(Waud.isHTML5AudioSupported) {
			if(this._spriteData != null && this._spriteData.sprite != null) {
				var _g = 0;
				var _g1 = this._spriteData.sprite;
				while(_g < _g1.length) {
					var snd = _g1[_g];
					++_g;
					var sound = new HTML5Sound(this.url,this._options);
					sound.isSpriteSound = true;
					this._spriteSounds.set(snd.name,sound);
				}
			} else this._snd = new HTML5Sound(this.url,this._options);
		} else {
			console.log("no audio support in this browser");
			return;
		}
	}
	,get_duration: function() {
		if(this.isSpriteSound) return this._spriteDuration;
		if(this._snd == null) return 0;
		return this._snd.get_duration();
	}
	,setVolume: function(val,spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).setVolume(val);
			return;
		}
		if(this._snd == null) return;
		this._snd.setVolume(val);
	}
	,getVolume: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) return this._spriteSounds.get(spriteName).getVolume();
			return 0;
		}
		if(this._snd == null) return 0;
		return this._snd.getVolume();
	}
	,mute: function(val,spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).mute(val); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.mute(val);
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.mute(val);
	}
	,toggleMute: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).toggleMute(); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.toggleMute();
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.toggleMute();
	}
	,load: function(callback) {
		if(this._snd == null || this.isSpriteSound) return null;
		this._snd.load(callback);
		return this;
	}
	,play: function(spriteName,soundProps) {
		if(this.isSpriteSound) {
			if(spriteName != null) {
				var _g = 0;
				var _g1 = this._spriteData.sprite;
				while(_g < _g1.length) {
					var snd = _g1[_g];
					++_g;
					if(snd.name == spriteName) {
						soundProps = snd;
						break;
					}
				}
				if(soundProps == null) return null;
				if(this._spriteSounds.get(spriteName) != null) {
					this._spriteSounds.get(spriteName).stop();
					return this._spriteSounds.get(spriteName).play(spriteName,soundProps);
				}
			} else return null;
		}
		if(this._snd == null) return null;
		return this._snd.play(spriteName,soundProps);
	}
	,togglePlay: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).togglePlay();
			return;
		}
		if(this._snd == null) return;
		this._snd.togglePlay();
	}
	,isPlaying: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) return this._spriteSounds.get(spriteName).isPlaying();
			return false;
		}
		if(this._snd == null) return false;
		return this._snd.isPlaying();
	}
	,loop: function(val) {
		if(this._snd == null || this.isSpriteSound) return;
		this._snd.loop(val);
	}
	,stop: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).stop(); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.stop();
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.stop();
	}
	,pause: function(spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null && this._spriteSounds.get(spriteName) != null) this._spriteSounds.get(spriteName).pause(); else {
				var $it0 = this._spriteSounds.iterator();
				while( $it0.hasNext() ) {
					var snd = $it0.next();
					snd.pause();
				}
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.pause();
	}
	,setTime: function(time) {
		if(this._snd == null || this.isSpriteSound) return;
		this._snd.setTime(time);
	}
	,getTime: function() {
		if(this._snd == null || this.isSpriteSound) return 0;
		return this._snd.getTime();
	}
	,onEnd: function(callback,spriteName) {
		if(this.isSpriteSound) {
			if(spriteName != null) {
				this._spriteSoundEndCallbacks.set(spriteName,callback);
				callback;
			}
			return this;
		}
		if(this._snd == null) return null;
		this._snd.onEnd(callback);
		return this;
	}
	,onLoad: function(callback) {
		if(this._snd == null || this.isSpriteSound) return null;
		this._snd.onLoad(callback);
		return this;
	}
	,onError: function(callback) {
		if(this._snd == null || this.isSpriteSound) return null;
		this._snd.onError(callback);
		return this;
	}
	,destroy: function() {
		if(this.isSpriteSound) {
			var $it0 = this._spriteSounds.iterator();
			while( $it0.hasNext() ) {
				var snd = $it0.next();
				snd.destroy();
			}
			return;
		}
		if(this._snd == null) return;
		this._snd.destroy();
		this._snd = null;
	}
	,_loadSpriteSound: function(url) {
		var request = new XMLHttpRequest();
		request.open("GET",url,true);
		request.responseType = "arraybuffer";
		request.onload = $bind(this,this._onSpriteSoundLoaded);
		request.onerror = $bind(this,this._onSpriteSoundError);
		request.send();
	}
	,_onSpriteSoundLoaded: function(evt) {
		Waud.audioManager.audioContext.decodeAudioData(evt.target.response,$bind(this,this._decodeSuccess),$bind(this,this._onSpriteSoundError));
	}
	,_onSpriteSoundError: function() {
		if(this._options != null && this._options.onerror != null) this._options.onerror(this);
	}
	,_decodeSuccess: function(buffer) {
		if(buffer == null) {
			console.log("empty buffer: " + this.url);
			this._onSpriteSoundError();
			return;
		}
		Waud.audioManager.bufferList.set(this.url,buffer);
		this._spriteDuration = buffer.duration;
		if(this._options != null && this._options.onload != null) this._options.onload(this);
		var _g = 0;
		var _g1 = this._spriteData.sprite;
		while(_g < _g1.length) {
			var snd = _g1[_g];
			++_g;
			var sound = new WebAudioAPISound(this.url,this._options,true,buffer.duration);
			sound.isSpriteSound = true;
			this._spriteSounds.set(snd.name,sound);
			sound.onEnd($bind(this,this._spriteOnEnd),snd.name);
		}
	}
	,_spriteOnEnd: function(snd) {
		if(this._spriteSoundEndCallbacks.get(snd.spriteName) != null) this._spriteSoundEndCallbacks.get(snd.spriteName)(snd);
	}
};
var WaudUtils = $hx_exports.WaudUtils = function() { };
WaudUtils.__name__ = true;
WaudUtils.isAndroid = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Android","i").match(ua);
};
WaudUtils.isiOS = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("(iPad|iPhone|iPod)","i").match(ua);
};
WaudUtils.isWindowsPhone = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("(IEMobile|Windows Phone)","i").match(ua);
};
WaudUtils.isFirefox = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Firefox","i").match(ua);
};
WaudUtils.isOpera = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Opera","i").match(ua) || Reflect.field(window,"opera") != null;
};
WaudUtils.isChrome = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Chrome","i").match(ua);
};
WaudUtils.isSafari = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("Safari","i").match(ua);
};
WaudUtils.isMobile = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	return new EReg("(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile)","i").match(ua);
};
WaudUtils.getiOSVersion = function(ua) {
	if(ua == null) ua = window.navigator.userAgent;
	var v = new EReg("[0-9_]+?[0-9_]+?[0-9_]+","i");
	var matched = [];
	if(v.match(ua)) {
		var match = v.matched(0).split("_");
		var _g = [];
		var _g1 = 0;
		while(_g1 < match.length) {
			var i = match[_g1];
			++_g1;
			_g.push(Std.parseInt(i));
		}
		matched = _g;
	}
	return matched;
};
var WebAudioAPISound = function(url,options,loaded,d) {
	if(d == null) d = 0;
	if(loaded == null) loaded = false;
	BaseSound.call(this,url,options);
	this._playStartTime = 0;
	this._pauseTime = 0;
	this._srcNodes = [];
	this._gainNodes = [];
	this._currentSoundProps = null;
	this._isLoaded = loaded;
	this.duration = d;
	this._manager = Waud.audioManager;
	if(this._b64.match(url)) {
		this._decodeAudio(this._base64ToArrayBuffer(url));
		url = "";
	} else if(this._options.preload && !loaded) this.load();
};
WebAudioAPISound.__name__ = true;
WebAudioAPISound.__interfaces__ = [IWaudSound];
WebAudioAPISound.__super__ = BaseSound;
WebAudioAPISound.prototype = $extend(BaseSound.prototype,{
	load: function(callback) {
		if(!this._isLoaded) {
			var request = new XMLHttpRequest();
			request.open("GET",this.url,true);
			request.responseType = "arraybuffer";
			request.onload = $bind(this,this._onSoundLoaded);
			request.onerror = $bind(this,this._error);
			request.send();
			if(callback != null) this._options.onload = callback;
		}
		return this;
	}
	,_base64ToArrayBuffer: function(base64) {
		var raw = window.atob(base64.split(",")[1]);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));
		var _g = 0;
		while(_g < rawLength) {
			var i = _g++;
			array[i] = HxOverrides.cca(raw,i);
		}
		return array.buffer;
	}
	,_onSoundLoaded: function(evt) {
		this._manager.audioContext.decodeAudioData(evt.target.response,$bind(this,this._decodeSuccess),$bind(this,this._error));
	}
	,_decodeAudio: function(data) {
		this._manager.audioContext.decodeAudioData(data,$bind(this,this._decodeSuccess),$bind(this,this._error));
	}
	,_error: function() {
		if(this._options.onerror != null) this._options.onerror(this);
	}
	,_decodeSuccess: function(buffer) {
		if(buffer == null) {
			console.log("empty buffer: " + this.url);
			this._error();
			return;
		}
		this._manager.bufferList.set(this.url,buffer);
		this._isLoaded = true;
		this.duration = buffer.duration;
		if(this._options.onload != null) this._options.onload(this);
		if(this._options.autoplay) this.play();
	}
	,_makeSource: function(buffer) {
		var source = this._manager.audioContext.createBufferSource();
		source.buffer = buffer;
		if(this._manager.audioContext.createGain != null) this._gainNode = this._manager.audioContext.createGain(); else this._gainNode = this._manager.audioContext.createGainNode();
		source.connect(this._gainNode);
		this._gainNode.connect(this._manager.audioContext.destination);
		this._srcNodes.push(source);
		this._gainNodes.push(this._gainNode);
		if(this._muted) this._gainNode.gain.value = 0; else this._gainNode.gain.value = this._options.volume;
		return source;
	}
	,get_duration: function() {
		if(!this._isLoaded) return 0;
		return this.duration;
	}
	,play: function(sprite,soundProps) {
		var _g = this;
		this.spriteName = sprite;
		if(this._isPlaying) this.stop(this.spriteName);
		if(!this._isLoaded) {
			console.log("sound not loaded");
			return -1;
		}
		var start = 0;
		var end = -1;
		if(this.isSpriteSound && soundProps != null) {
			this._currentSoundProps = soundProps;
			start = soundProps.start + this._pauseTime;
			end = soundProps.duration;
		}
		var buffer = this._manager.bufferList.get(this.url);
		if(buffer != null) {
			this._snd = this._makeSource(buffer);
			if(start >= 0 && end > -1) {
				if(Reflect.field(this._snd,"start") != null) this._snd.start(0,start,end); else this._snd.noteGrainOn(0,start,end);
			} else {
				if(Reflect.field(this._snd,"start") != null) this._snd.start(0,this._pauseTime,this._snd.buffer.duration); else this._snd.noteGrainOn(0,this._pauseTime,this._snd.buffer.duration);
				this._snd.loop = this._options.loop;
			}
			this._playStartTime = this._manager.audioContext.currentTime;
			this._isPlaying = true;
			this._snd.onended = function() {
				_g._pauseTime = 0;
				_g._isPlaying = false;
				if(_g.isSpriteSound && soundProps != null && soundProps.loop != null && soundProps.loop && start >= 0 && end > -1) {
					_g.destroy();
					_g.play(_g.spriteName,soundProps);
				} else if(_g._options.onend != null) _g._options.onend(_g);
			};
		}
		return HxOverrides.indexOf(this._srcNodes,this._snd,0);
	}
	,togglePlay: function(spriteName) {
		if(this._isPlaying) this.pause(); else this.play();
	}
	,isPlaying: function(spriteName) {
		return this._isPlaying;
	}
	,loop: function(val) {
		this._options.loop = val;
		if(this._snd != null) this._snd.loop = val;
	}
	,setVolume: function(val,spriteName) {
		this._options.volume = val;
		if(this._gainNode == null || !this._isLoaded) return;
		this._gainNode.gain.value = this._options.volume;
	}
	,getVolume: function(spriteName) {
		return this._options.volume;
	}
	,mute: function(val,spriteName) {
		this._muted = val;
		if(this._gainNode == null || !this._isLoaded) return;
		if(val) this._gainNode.gain.value = 0; else this._gainNode.gain.value = this._options.volume;
	}
	,toggleMute: function(spriteName) {
		this.mute(!this._muted);
	}
	,stop: function(spriteName) {
		this._pauseTime = 0;
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return;
		this.destroy();
	}
	,pause: function(spriteName) {
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return;
		this.destroy();
		this._pauseTime += this._manager.audioContext.currentTime - this._playStartTime;
	}
	,setTime: function(time) {
		if(!this._isLoaded || time > this.get_duration()) return;
		if(this._isPlaying) {
			this.stop();
			this._pauseTime = time;
			this.play();
		} else this._pauseTime = time;
	}
	,getTime: function() {
		if(this._snd == null || !this._isLoaded || !this._isPlaying) return 0;
		return this._manager.audioContext.currentTime - this._playStartTime + this._pauseTime;
	}
	,onEnd: function(callback,spriteName) {
		this._options.onend = callback;
		return this;
	}
	,onLoad: function(callback) {
		this._options.onload = callback;
		return this;
	}
	,onError: function(callback) {
		this._options.onerror = callback;
		return this;
	}
	,destroy: function() {
		var _g = 0;
		var _g1 = this._srcNodes;
		while(_g < _g1.length) {
			var src = _g1[_g];
			++_g;
			if(Reflect.field(src,"stop") != null) src.stop(0); else if(Reflect.field(src,"noteOff") != null) try {
				this.src.noteOff(0);
			} catch( e ) {
				if (e instanceof js__$Boot_HaxeError) e = e.val;
			}
			src.disconnect();
			src = null;
		}
		var _g2 = 0;
		var _g11 = this._gainNodes;
		while(_g2 < _g11.length) {
			var gain = _g11[_g2];
			++_g2;
			gain.disconnect();
			gain = null;
		}
		this._srcNodes = [];
		this._gainNodes = [];
		this._isPlaying = false;
	}
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
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
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal_SlotList.NIL;
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
	,get_numListeners: function() {
		return this.slots.get_length();
	}
};
var msignal_Signal0 = function() {
	msignal_Signal.call(this);
};
msignal_Signal0.__name__ = true;
msignal_Signal0.__super__ = msignal_Signal;
msignal_Signal0.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot0(this,listener,once,priority);
	}
});
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
var msignal_Signal2 = function(type1,type2) {
	msignal_Signal.call(this,[type1,type2]);
};
msignal_Signal2.__name__ = true;
msignal_Signal2.__super__ = msignal_Signal;
msignal_Signal2.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot2(this,listener,once,priority);
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
var msignal_Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot0.__name__ = true;
msignal_Slot0.__super__ = msignal_Slot;
msignal_Slot0.prototype = $extend(msignal_Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
});
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
var msignal_Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot2.__name__ = true;
msignal_Slot2.__super__ = msignal_Slot;
msignal_Slot2.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
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
	get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal_SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
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
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.__name__ = true;
Array.__name__ = true;
Date.__name__ = ["Date"];
var Dynamic = { __name__ : ["Dynamic"]};
var __map_reserved = {}
msignal_SlotList.NIL = new msignal_SlotList(null,null);
Perf.MEASUREMENT_INTERVAL = 1000;
Perf.FONT_FAMILY = "Helvetica,Arial";
Perf.FPS_BG_CLR = "#00FF00";
Perf.FPS_WARN_BG_CLR = "#FF8000";
Perf.FPS_PROB_BG_CLR = "#FF0000";
Perf.MS_BG_CLR = "#FFFF00";
Perf.MEM_BG_CLR = "#086A87";
Perf.INFO_BG_CLR = "#00FFFF";
Perf.FPS_TXT_CLR = "#000000";
Perf.MS_TXT_CLR = "#000000";
Perf.MEM_TXT_CLR = "#FFFFFF";
Perf.INFO_TXT_CLR = "#000000";
Perf.DELAY_TIME = 4000;
Waud.PROBABLY = "probably";
Waud.MAYBE = "maybe";
Waud.version = "0.5.4";
Waud.useWebAudio = true;
Waud.defaults = { autoplay : false, loop : false, preload : true, webaudio : true, volume : 1};
Waud.preferredSampleRate = 44100;
Waud.isMuted = false;
WaudFocusManager.FOCUS_STATE = "focus";
WaudFocusManager.BLUR_STATE = "blur";
WaudFocusManager.ON_FOCUS = "onfocus";
WaudFocusManager.ON_BLUR = "onblur";
WaudFocusManager.PAGE_SHOW = "pageshow";
WaudFocusManager.PAGE_HIDE = "pagehide";
WaudFocusManager.WINDOW = "window";
WaudFocusManager.DOCUMENT = "document";
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=sample.js.map