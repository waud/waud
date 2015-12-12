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
		var _g = this;
		if(this.audioContext == null) return;
		var bfr = this.audioContext.createBuffer(1,1,Waud.preferredSampleRate);
		var src = this.audioContext.createBufferSource();
		src.buffer = bfr;
		src.connect(this.audioContext.destination);
		src.start(0);
		src.onended = function() {
			if(Waud.__touchUnlockCallback != null) Waud.__touchUnlockCallback();
			Waud.dom.removeEventListener("touchend",$bind(_g,_g.unlockAudio),true);
		};
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
		if(this.audioContext != null && Waud.iOSSafeSampleRateCheck && this.audioContext.sampleRate != Waud.preferredSampleRate) {
			var bfr = this.audioContext.createBuffer(1,1,Waud.preferredSampleRate);
			var src = this.audioContext.createBufferSource();
			src.buffer = bfr;
			src.connect(this.audioContext.destination);
			src.start(0);
			src.disconnect();
			this.destroyContext();
			this.createAudioContext();
		}
	}
	,destroyContext: function() {
		if(this.audioContext != null) {
			if(Waud.audioContext.close != null) Waud.audioContext.close();
			this.audioContext = null;
		}
	}
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
};
var ISound = function() { };
var Reflect = function() { };
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
var Type = function() { };
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
Utils.isiOS = function() {
	return new EReg("(iPad|iPhone|iPod)","i").match(window.navigator.userAgent);
};
var Waud = $hx_exports.Waud = function() { };
Waud.init = function(d) {
	if(d == null) d = window.document;
	Waud.dom = d;
	var _this = window.document;
	Waud.audioElement = _this.createElement("audio");
	if(Waud.audioManager == null) Waud.audioManager = new AudioManager();
	Waud.isWebAudioSupported = Waud.audioManager.checkWebAudioAPISupport();
	Waud.isAudioSupported = Reflect.field(window,"Audio") != null;
	if(Waud.isWebAudioSupported) {
		Waud.audioManager.createAudioContext();
		if(Utils.isiOS()) Waud.audioManager.iOSSafeSampleRateCheck();
	} else if(!Waud.isAudioSupported) console.log("no audio support in this browser");
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
	Waud.dom.addEventListener("touchend",($_=Waud.audioManager,$bind($_,$_.unlockAudio)),true);
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
Waud.getSupportString = function() {
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
var haxe_IMap = function() { };
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
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
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
var __map_reserved = {}
Waud.defaults = { };
Waud.iOSSafeSampleRateCheck = true;
Waud.preferredSampleRate = 44100;
Waud.unlocked = false;
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=waud.js.map