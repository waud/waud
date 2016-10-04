(function (console, $hx_exports, $global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
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
AudioManager.__name__ = ["AudioManager"];
AudioManager.prototype = {
	types: null
	,audioContext: null
	,bufferList: null
	,checkWebAudioAPISupport: function() {
		return Reflect.field(window,"AudioContext") != null || Reflect.field(window,"webkitAudioContext") != null;
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
			if(Reflect.field(window,"AudioContext") != null) this.audioContext = new AudioContext(); else if(Reflect.field(window,"webkitAudioContext") != null) this.audioContext = new webkitAudioContext();
		} catch( e ) {
			haxe_CallStack.lastException = e;
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
	,suspendContext: function() {
		if(this.audioContext != null) {
			if(this.audioContext.suspend != null) this.audioContext.suspend();
		}
	}
	,resumeContext: function() {
		if(this.audioContext != null) {
			if(this.audioContext.resume != null) this.audioContext.resume();
		}
	}
	,__class__: AudioManager
};
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
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
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IWaudSound = function() { };
IWaudSound.__name__ = ["IWaudSound"];
IWaudSound.prototype = {
	url: null
	,isSpriteSound: null
	,spriteName: null
	,rate: null
	,load: null
	,play: null
	,togglePlay: null
	,stop: null
	,pause: null
	,playbackRate: null
	,setTime: null
	,getTime: null
	,getDuration: null
	,onEnd: null
	,onLoad: null
	,onError: null
	,mute: null
	,toggleMute: null
	,loop: null
	,setVolume: null
	,getVolume: null
	,isPlaying: null
	,autoStop: null
	,isReady: null
	,destroy: null
	,__class__: IWaudSound
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = [];
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
};
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	head: null
	,val: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compare = function(a,b) {
	if(a == b) return 0; else if(a > b) return 1; else return -1;
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) return s.split("\"").join("&quot;").split("'").join("&#039;"); else return s;
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var Test = function() {
	var runner = new utest_Runner();
	runner.addCase(new TestWaudUtils());
	utest_ui_Report.create(runner);
	runner.run();
};
Test.__name__ = ["Test"];
Test.main = function() {
	new Test();
};
Test.prototype = {
	__class__: Test
};
var TestWaudUtils = function() {
	this._uaStrings = new haxe_ds_StringMap();
	this._uaStrings.set("chrome","Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36");
	this._uaStrings.set("firefox","Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1");
	this._uaStrings.set("opera","Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16");
	this._uaStrings.set("safari","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A");
	this._uaStrings.set("windows","Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)");
	this._uaStrings.set("ipad","Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53");
	this._uaStrings.set("iphone","Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4");
	this._uaStrings.set("android","Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JSS15Q) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Safari/537.36");
};
TestWaudUtils.__name__ = ["TestWaudUtils"];
TestWaudUtils.prototype = {
	_uaStrings: null
	,testChrome: function() {
		utest_Assert.isTrue(WaudUtils.isChrome(this._uaStrings.get("chrome")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 20, className : "TestWaudUtils", methodName : "testChrome"});
	}
	,testFirefox: function() {
		utest_Assert.isTrue(WaudUtils.isFirefox(this._uaStrings.get("firefox")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 24, className : "TestWaudUtils", methodName : "testFirefox"});
	}
	,testOpera: function() {
		utest_Assert.isTrue(WaudUtils.isOpera(this._uaStrings.get("opera")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 28, className : "TestWaudUtils", methodName : "testOpera"});
	}
	,testSafari: function() {
		utest_Assert.isTrue(WaudUtils.isSafari(this._uaStrings.get("safari")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 32, className : "TestWaudUtils", methodName : "testSafari"});
	}
	,testWindows: function() {
		utest_Assert.isTrue(WaudUtils.isWindowsPhone(this._uaStrings.get("windows")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 36, className : "TestWaudUtils", methodName : "testWindows"});
	}
	,testiOS: function() {
		utest_Assert.isTrue(WaudUtils.isiOS(this._uaStrings.get("ipad")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 40, className : "TestWaudUtils", methodName : "testiOS"});
	}
	,testAndroid: function() {
		utest_Assert.isTrue(WaudUtils.isAndroid(this._uaStrings.get("android")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 44, className : "TestWaudUtils", methodName : "testAndroid"});
	}
	,testMobile: function() {
		utest_Assert.isTrue(WaudUtils.isMobile(this._uaStrings.get("iphone")),null,{ fileName : "TestWaudUtils.hx", lineNumber : 48, className : "TestWaudUtils", methodName : "testMobile"});
	}
	,testiOSVersion: function() {
		utest_Assert.isTrue(WaudUtils.getiOSVersion(this._uaStrings.get("ipad"))[0] == 7,null,{ fileName : "TestWaudUtils.hx", lineNumber : 52, className : "TestWaudUtils", methodName : "testiOSVersion"});
		utest_Assert.isTrue(WaudUtils.getiOSVersion(this._uaStrings.get("iphone"))[0] == 8,null,{ fileName : "TestWaudUtils.hx", lineNumber : 53, className : "TestWaudUtils", methodName : "testiOSVersion"});
	}
	,__class__: TestWaudUtils
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumConstructor = function(e) {
	return e[0];
};
Type.enumParameters = function(e) {
	return e.slice(2);
};
Type.enumIndex = function(e) {
	return e[1];
};
var Waud = $hx_exports.Waud = function() { };
Waud.__name__ = ["Waud"];
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
Waud.playbackRate = function(val) {
	if(val == null) return Waud._playbackRate; else if(Waud.sounds != null) {
		var $it0 = Waud.sounds.iterator();
		while( $it0.hasNext() ) {
			var sound = $it0.next();
			sound.playbackRate(val);
		}
	}
	return Waud._playbackRate = val;
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
Waud.get_sampleRate = function() {
	if(Waud.audioContext != null) return Waud.audioContext.sampleRate; else return 0;
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
		Waud._focusManager = null;
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
WaudFocusManager.__name__ = ["WaudFocusManager"];
WaudFocusManager.prototype = {
	focus: null
	,blur: null
	,_hidden: null
	,_visibilityChange: null
	,_currentState: null
	,_handleVisibilityChange: function() {
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
	,__class__: WaudFocusManager
};
var WaudUtils = $hx_exports.WaudUtils = function() { };
WaudUtils.__name__ = ["WaudUtils"];
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
WaudUtils.setDefaultOptions = function(options) {
	if(options == null) options = { };
	if(options.autoplay != null) options.autoplay = options.autoplay; else options.autoplay = Waud.defaults.autoplay;
	if(options.autostop != null) options.autostop = options.autostop; else options.autostop = Waud.defaults.autostop;
	if(options.webaudio != null) options.webaudio = options.webaudio; else options.webaudio = Waud.defaults.webaudio;
	if(options.preload != null) options.preload = options.preload; else options.preload = Waud.defaults.preload;
	if(options.loop != null) options.loop = options.loop; else options.loop = Waud.defaults.loop;
	if(options.onload != null) options.onload = options.onload; else options.onload = Waud.defaults.onload;
	if(options.onend != null) options.onend = options.onend; else options.onend = Waud.defaults.onend;
	if(options.onerror != null) options.onerror = options.onerror; else options.onerror = Waud.defaults.onerror;
	if(options.volume == null || options.volume < 0 || options.volume > 1) options.volume = Waud.defaults.volume;
	if(options.playbackRate == null || options.playbackRate <= 0 || options.playbackRate >= 4) options.playbackRate = Waud.defaults.playbackRate;
	return options;
};
var haxe_StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = ["haxe","CallStack"];
haxe_CallStack.getStack = function(e) {
	if(e == null) return [];
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			if(haxe_CallStack.wrapCallSite != null) site = haxe_CallStack.wrapCallSite(site);
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(e.stack);
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.callStack = function() {
	try {
		throw new Error();
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var a = haxe_CallStack.getStack(e);
		a.shift();
		return a;
	}
};
haxe_CallStack.exceptionStack = function() {
	return haxe_CallStack.getStack(haxe_CallStack.lastException);
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		if(m == null) b.b += "null"; else b.b += "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		if(file == null) b.b += "null"; else b.b += "" + file;
		b.b += " line ";
		if(line == null) b.b += "null"; else b.b += "" + line;
		if(s1 != null) b.b += ")";
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		if(cname == null) b.b += "null"; else b.b += "" + cname;
		b.b += ".";
		if(meth == null) b.b += "null"; else b.b += "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		if(n == null) b.b += "null"; else b.b += "" + n;
		break;
	}
};
haxe_CallStack.makeStack = function(s) {
	if(s == null) return []; else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") stack.shift();
		var m = [];
		var rie10 = new EReg("^   at ([A-Za-z0-9_. ]+) \\(([^)]+):([0-9]+):([0-9]+)\\)$","");
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			if(rie10.match(line)) {
				var path = rie10.matched(1).split(".");
				var meth = path.pop();
				var file = rie10.matched(2);
				var line1 = Std.parseInt(rie10.matched(3));
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function"?haxe_StackItem.LocalFunction():meth == "Global code"?null:haxe_StackItem.Method(path.join("."),meth),file,line1));
			} else m.push(haxe_StackItem.Module(StringTools.trim(line)));
		}
		return m;
	} else return s;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	high: null
	,low: null
	,__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Log = function() { };
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.stamp = function() {
	return new Date().getTime() / 1000;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ds__$StringMap_StringMapIterator = function(map,keys) {
	this.map = map;
	this.keys = keys;
	this.index = 0;
	this.count = keys.length;
};
haxe_ds__$StringMap_StringMapIterator.__name__ = ["haxe","ds","_StringMap","StringMapIterator"];
haxe_ds__$StringMap_StringMapIterator.prototype = {
	map: null
	,keys: null
	,index: null
	,count: null
	,hasNext: function() {
		return this.index < this.count;
	}
	,next: function() {
		return this.map.get(this.keys[this.index++]);
	}
	,__class__: haxe_ds__$StringMap_StringMapIterator
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
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
	,__class__: haxe_ds_StringMap
};
var haxe_io_Bytes = function() { };
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,__class__: haxe_io_Bytes
};
var haxe_io_Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
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
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
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
			haxe_CallStack.lastException = e;
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
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	byteLength: null
	,a: null
	,slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	buf: null
	,offset: null
	,length: null
	,getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var utest_Assert = function() { };
utest_Assert.__name__ = ["utest","Assert"];
utest_Assert.isTrue = function(cond,msg,pos) {
	if(utest_Assert.results == null) throw new js__$Boot_HaxeError("Assert.results is not currently bound to any assert context");
	if(null == msg) msg = "expected true";
	if(cond) utest_Assert.results.add(utest_Assertation.Success(pos)); else utest_Assert.results.add(utest_Assertation.Failure(msg,pos));
};
utest_Assert.isFalse = function(value,msg,pos) {
	if(null == msg) msg = "expected false";
	utest_Assert.isTrue(value == false,msg,pos);
};
utest_Assert.isNull = function(value,msg,pos) {
	if(msg == null) msg = "expected null but it is " + utest_Assert.q(value);
	utest_Assert.isTrue(value == null,msg,pos);
};
utest_Assert.notNull = function(value,msg,pos) {
	if(null == msg) msg = "expected not null";
	utest_Assert.isTrue(value != null,msg,pos);
};
utest_Assert["is"] = function(value,type,msg,pos) {
	if(msg == null) msg = "expected type " + utest_Assert.typeToString(type) + " but it is " + utest_Assert.typeToString(value);
	utest_Assert.isTrue(js_Boot.__instanceof(value,type),msg,pos);
};
utest_Assert.notEquals = function(expected,value,msg,pos) {
	if(msg == null) msg = "expected " + utest_Assert.q(expected) + " and test value " + utest_Assert.q(value) + " should be different";
	utest_Assert.isFalse(expected == value,msg,pos);
};
utest_Assert.equals = function(expected,value,msg,pos) {
	if(msg == null) msg = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value);
	utest_Assert.isTrue(expected == value,msg,pos);
};
utest_Assert.match = function(pattern,value,msg,pos) {
	if(msg == null) msg = "the value " + utest_Assert.q(value) + " does not match the provided pattern";
	utest_Assert.isTrue(pattern.match(value),msg,pos);
};
utest_Assert.floatEquals = function(expected,value,approx,msg,pos) {
	if(msg == null) msg = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value);
	utest_Assert.isTrue(utest_Assert._floatEquals(expected,value,approx),msg,pos);
	return;
};
utest_Assert._floatEquals = function(expected,value,approx) {
	if(isNaN(expected)) return isNaN(value); else if(isNaN(value)) return false; else if(!isFinite(expected) && !isFinite(value)) return expected > 0 == value > 0;
	if(null == approx) approx = 1e-5;
	return Math.abs(value - expected) <= approx;
};
utest_Assert.getTypeName = function(v) {
	{
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			return "`null`";
		case 1:
			return "Int";
		case 2:
			return "Float";
		case 3:
			return "Bool";
		case 5:
			return "function";
		case 6:
			var c = _g[2];
			return Type.getClassName(c);
		case 7:
			var e = _g[2];
			return Type.getEnumName(e);
		case 4:
			return "Object";
		case 8:
			return "`Unknown`";
		}
	}
};
utest_Assert.isIterable = function(v,isAnonym) {
	var fields;
	if(isAnonym) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"iterator")) return false;
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
utest_Assert.isIterator = function(v,isAnonym) {
	var fields;
	if(isAnonym) fields = Reflect.fields(v); else fields = Type.getInstanceFields(Type.getClass(v));
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) return false;
	return Reflect.isFunction(Reflect.field(v,"next")) && Reflect.isFunction(Reflect.field(v,"hasNext"));
};
utest_Assert.sameAs = function(expected,value,status,approx) {
	var texpected = utest_Assert.getTypeName(expected);
	var tvalue = utest_Assert.getTypeName(value);
	if(texpected != tvalue && !(texpected == "Int" && tvalue == "Float" || texpected == "Float" && tvalue == "Int")) {
		status.error = "expected type " + texpected + " but it is " + tvalue + (status.path == ""?"":" for field " + status.path);
		return false;
	}
	{
		var _g = Type["typeof"](expected);
		switch(_g[1]) {
		case 2:case 1:
			if(!utest_Assert._floatEquals(expected,value,approx)) {
				status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 0:case 3:
			if(expected != value) {
				status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 5:
			if(!Reflect.compareMethods(expected,value)) {
				status.error = "expected same function reference" + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			return true;
		case 6:
			var c = _g[2];
			var cexpected = Type.getClassName(c);
			var cvalue = Type.getClassName(Type.getClass(value));
			if(cexpected != cvalue) {
				status.error = "expected instance of " + utest_Assert.q(cexpected) + " but it is " + utest_Assert.q(cvalue) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			if(typeof(expected) == "string" && expected != value) {
				status.error = "expected string '" + Std.string(expected) + "' but it is '" + Std.string(value) + "'";
				return false;
			}
			if((expected instanceof Array) && expected.__enum__ == null) {
				if(status.recursive || status.path == "") {
					if(expected.length != value.length) {
						status.error = "expected " + Std.string(expected.length) + " elements but they are " + Std.string(value.length) + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path = status.path;
					var _g2 = 0;
					var _g1 = expected.length;
					while(_g2 < _g1) {
						var i = _g2++;
						if(path == "") status.path = "array[" + i + "]"; else status.path = path + "[" + i + "]";
						if(!utest_Assert.sameAs(expected[i],value[i],status,approx)) {
							status.error = "expected array element at [" + i + "] to be " + utest_Assert.q(expected[i]) + " but it is " + utest_Assert.q(value[i]) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(js_Boot.__instanceof(expected,Date)) {
				if(expected.getTime() != value.getTime()) {
					status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				return true;
			}
			if(js_Boot.__instanceof(expected,haxe_io_Bytes)) {
				if(status.recursive || status.path == "") {
					var ebytes = expected;
					var vbytes = value;
					if(ebytes.length != vbytes.length) return false;
					var _g21 = 0;
					var _g11 = ebytes.length;
					while(_g21 < _g11) {
						var i1 = _g21++;
						if(ebytes.b[i1] != vbytes.b[i1]) {
							status.error = "expected byte " + ebytes.b[i1] + " but it is " + vbytes.b[i1] + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(js_Boot.__instanceof(expected,haxe_IMap)) {
				if(status.recursive || status.path == "") {
					var map;
					map = js_Boot.__cast(expected , haxe_IMap);
					var vmap;
					vmap = js_Boot.__cast(value , haxe_IMap);
					var keys;
					var _g12 = [];
					var $it0 = map.keys();
					while( $it0.hasNext() ) {
						var k = $it0.next();
						_g12.push(k);
					}
					keys = _g12;
					var vkeys;
					var _g22 = [];
					var $it1 = vmap.keys();
					while( $it1.hasNext() ) {
						var k1 = $it1.next();
						_g22.push(k1);
					}
					vkeys = _g22;
					if(keys.length != vkeys.length) {
						status.error = "expected " + keys.length + " keys but they are " + vkeys.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path1 = status.path;
					var _g3 = 0;
					while(_g3 < keys.length) {
						var key = keys[_g3];
						++_g3;
						if(path1 == "") status.path = "hash[" + Std.string(key) + "]"; else status.path = path1 + "[" + Std.string(key) + "]";
						if(!utest_Assert.sameAs(map.get(key),vmap.get(key),status,approx)) {
							status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(utest_Assert.isIterator(expected,false)) {
				if(status.recursive || status.path == "") {
					var evalues = Lambda.array({ iterator : function() {
						return expected;
					}});
					var vvalues = Lambda.array({ iterator : function() {
						return value;
					}});
					if(evalues.length != vvalues.length) {
						status.error = "expected " + evalues.length + " values in Iterator but they are " + vvalues.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path2 = status.path;
					var _g23 = 0;
					var _g13 = evalues.length;
					while(_g23 < _g13) {
						var i2 = _g23++;
						if(path2 == "") status.path = "iterator[" + i2 + "]"; else status.path = path2 + "[" + i2 + "]";
						if(!utest_Assert.sameAs(evalues[i2],vvalues[i2],status,approx)) {
							status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(utest_Assert.isIterable(expected,false)) {
				if(status.recursive || status.path == "") {
					var evalues1 = Lambda.array(expected);
					var vvalues1 = Lambda.array(value);
					if(evalues1.length != vvalues1.length) {
						status.error = "expected " + evalues1.length + " values in Iterable but they are " + vvalues1.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path3 = status.path;
					var _g24 = 0;
					var _g14 = evalues1.length;
					while(_g24 < _g14) {
						var i3 = _g24++;
						if(path3 == "") status.path = "iterable[" + i3 + "]"; else status.path = path3 + "[" + i3 + "]";
						if(!utest_Assert.sameAs(evalues1[i3],vvalues1[i3],status,approx)) return false;
					}
				}
				return true;
			}
			if(status.recursive || status.path == "") {
				var fields = Type.getInstanceFields(Type.getClass(expected));
				var path4 = status.path;
				var _g15 = 0;
				while(_g15 < fields.length) {
					var field = fields[_g15];
					++_g15;
					if(path4 == "") status.path = field; else status.path = path4 + "." + field;
					var e = Reflect.field(expected,field);
					if(Reflect.isFunction(e)) continue;
					var v = Reflect.field(value,field);
					if(!utest_Assert.sameAs(e,v,status,approx)) return false;
				}
			}
			return true;
		case 7:
			var e1 = _g[2];
			var eexpected = Type.getEnumName(e1);
			var evalue = Type.getEnumName(Type.getEnum(value));
			if(eexpected != evalue) {
				status.error = "expected enumeration of " + utest_Assert.q(eexpected) + " but it is " + utest_Assert.q(evalue) + (status.path == ""?"":" for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				if(Type.enumIndex(expected) != Type.enumIndex(value)) {
					status.error = "expected enum constructor " + utest_Assert.q(Type.enumConstructor(expected)) + " but it is " + utest_Assert.q(Type.enumConstructor(value)) + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				var eparams = Type.enumParameters(expected);
				var vparams = Type.enumParameters(value);
				var path5 = status.path;
				var _g25 = 0;
				var _g16 = eparams.length;
				while(_g25 < _g16) {
					var i4 = _g25++;
					if(path5 == "") status.path = "enum[" + i4 + "]"; else status.path = path5 + "[" + i4 + "]";
					if(!utest_Assert.sameAs(eparams[i4],vparams[i4],status,approx)) {
						status.error = "expected enum param " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path) + " with " + status.error;
						return false;
					}
				}
			}
			return true;
		case 4:
			if(status.recursive || status.path == "") {
				var tfields = Reflect.fields(value);
				var fields1 = Reflect.fields(expected);
				var path6 = status.path;
				var _g17 = 0;
				while(_g17 < fields1.length) {
					var field1 = fields1[_g17];
					++_g17;
					HxOverrides.remove(tfields,field1);
					if(path6 == "") status.path = field1; else status.path = path6 + "." + field1;
					if(!Object.prototype.hasOwnProperty.call(value,field1)) {
						status.error = "expected field " + status.path + " does not exist in " + utest_Assert.q(value);
						return false;
					}
					var e2 = Reflect.field(expected,field1);
					if(Reflect.isFunction(e2)) continue;
					var v1 = Reflect.field(value,field1);
					if(!utest_Assert.sameAs(e2,v1,status,approx)) return false;
				}
				if(tfields.length > 0) {
					status.error = "the tested object has extra field(s) (" + tfields.join(", ") + ") not included in the expected ones";
					return false;
				}
			}
			if(utest_Assert.isIterator(expected,true)) {
				if(!utest_Assert.isIterator(value,true)) {
					status.error = "expected Iterable but it is not " + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				if(status.recursive || status.path == "") {
					var evalues2 = Lambda.array({ iterator : function() {
						return expected;
					}});
					var vvalues2 = Lambda.array({ iterator : function() {
						return value;
					}});
					if(evalues2.length != vvalues2.length) {
						status.error = "expected " + evalues2.length + " values in Iterator but they are " + vvalues2.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path7 = status.path;
					var _g26 = 0;
					var _g18 = evalues2.length;
					while(_g26 < _g18) {
						var i5 = _g26++;
						if(path7 == "") status.path = "iterator[" + i5 + "]"; else status.path = path7 + "[" + i5 + "]";
						if(!utest_Assert.sameAs(evalues2[i5],vvalues2[i5],status,approx)) {
							status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == ""?"":" for field " + status.path);
							return false;
						}
					}
				}
				return true;
			}
			if(utest_Assert.isIterable(expected,true)) {
				if(!utest_Assert.isIterable(value,true)) {
					status.error = "expected Iterator but it is not " + (status.path == ""?"":" for field " + status.path);
					return false;
				}
				if(status.recursive || status.path == "") {
					var evalues3 = Lambda.array(expected);
					var vvalues3 = Lambda.array(value);
					if(evalues3.length != vvalues3.length) {
						status.error = "expected " + evalues3.length + " values in Iterable but they are " + vvalues3.length + (status.path == ""?"":" for field " + status.path);
						return false;
					}
					var path8 = status.path;
					var _g27 = 0;
					var _g19 = evalues3.length;
					while(_g27 < _g19) {
						var i6 = _g27++;
						if(path8 == "") status.path = "iterable[" + i6 + "]"; else status.path = path8 + "[" + i6 + "]";
						if(!utest_Assert.sameAs(evalues3[i6],vvalues3[i6],status,approx)) return false;
					}
				}
				return true;
			}
			return true;
		case 8:
			throw new js__$Boot_HaxeError("Unable to compare two unknown types");
			break;
		}
	}
	throw new js__$Boot_HaxeError("Unable to compare values: " + utest_Assert.q(expected) + " and " + utest_Assert.q(value));
};
utest_Assert.q = function(v) {
	if(typeof(v) == "string") return "\"" + StringTools.replace(v,"\"","\\\"") + "\""; else return Std.string(v);
};
utest_Assert.same = function(expected,value,recursive,msg,approx,pos) {
	if(null == approx) approx = 1e-5;
	var status = { recursive : null == recursive?true:recursive, path : "", error : null};
	if(utest_Assert.sameAs(expected,value,status,approx)) utest_Assert.pass(msg,pos); else utest_Assert.fail(msg == null?status.error:msg,pos);
};
utest_Assert.raises = function(method,type,msgNotThrown,msgWrongType,pos) {
	try {
		method();
		var name = Type.getClassName(type);
		if(name == null) name = "Dynamic";
		if(null == msgNotThrown) msgNotThrown = "exception of type " + name + " not raised";
		utest_Assert.fail(msgNotThrown,pos);
	} catch( ex ) {
		haxe_CallStack.lastException = ex;
		if (ex instanceof js__$Boot_HaxeError) ex = ex.val;
		if(null == type) utest_Assert.pass(null,pos); else {
			var name1 = Type.getClassName(type);
			if(null == msgWrongType) msgWrongType = "expected throw of type " + name1 + " but it is " + Std.string(ex);
			utest_Assert.isTrue(js_Boot.__instanceof(ex,type),msgWrongType,pos);
		}
	}
};
utest_Assert.allows = function(possibilities,value,msg,pos) {
	if(Lambda.has(possibilities,value)) utest_Assert.isTrue(true,msg,pos); else utest_Assert.fail(msg == null?"value " + utest_Assert.q(value) + " not found in the expected possibilities " + Std.string(possibilities):msg,pos);
};
utest_Assert.contains = function(match,values,msg,pos) {
	if(Lambda.has(values,match)) utest_Assert.isTrue(true,msg,pos); else utest_Assert.fail(msg == null?"values " + utest_Assert.q(values) + " do not contain " + Std.string(match):msg,pos);
};
utest_Assert.notContains = function(match,values,msg,pos) {
	if(!Lambda.has(values,match)) utest_Assert.isTrue(true,msg,pos); else utest_Assert.fail(msg == null?"values " + utest_Assert.q(values) + " do contain " + Std.string(match):msg,pos);
};
utest_Assert.stringContains = function(match,value,msg,pos) {
	if(value != null && value.indexOf(match) >= 0) utest_Assert.isTrue(true,msg,pos); else utest_Assert.fail(msg == null?"value " + utest_Assert.q(value) + " does not contain " + utest_Assert.q(match):msg,pos);
};
utest_Assert.stringSequence = function(sequence,value,msg,pos) {
	if(null == value) {
		utest_Assert.fail(msg == null?"null argument value":msg,pos);
		return;
	}
	var p = 0;
	var _g = 0;
	while(_g < sequence.length) {
		var s = sequence[_g];
		++_g;
		var p2 = value.indexOf(s,p);
		if(p2 < 0) {
			if(msg == null) {
				msg = "expected '" + s + "' after ";
				if(p > 0) {
					var cut = HxOverrides.substr(value,0,p);
					if(cut.length > 30) cut = "..." + HxOverrides.substr(cut,-27,null);
					msg += " '" + cut + "'";
				} else msg += " begin";
			}
			utest_Assert.fail(msg,pos);
			return;
		}
		p = p2 + s.length;
	}
	utest_Assert.isTrue(true,msg,pos);
};
utest_Assert.pass = function(msg,pos) {
	if(msg == null) msg = "pass expected";
	utest_Assert.isTrue(true,msg,pos);
};
utest_Assert.fail = function(msg,pos) {
	if(msg == null) msg = "failure expected";
	utest_Assert.isTrue(false,msg,pos);
};
utest_Assert.warn = function(msg) {
	utest_Assert.results.add(utest_Assertation.Warning(msg));
};
utest_Assert.createAsync = function(f,timeout) {
	return function() {
	};
};
utest_Assert.createEvent = function(f,timeout) {
	return function(e) {
	};
};
utest_Assert.typeToString = function(t) {
	try {
		var _t = Type.getClass(t);
		if(_t != null) t = _t;
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
	}
	try {
		return Type.getClassName(t);
	} catch( e1 ) {
		haxe_CallStack.lastException = e1;
		if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
	}
	try {
		var _t1 = Type.getEnum(t);
		if(_t1 != null) t = _t1;
	} catch( e2 ) {
		haxe_CallStack.lastException = e2;
		if (e2 instanceof js__$Boot_HaxeError) e2 = e2.val;
	}
	try {
		return Type.getEnumName(t);
	} catch( e3 ) {
		haxe_CallStack.lastException = e3;
		if (e3 instanceof js__$Boot_HaxeError) e3 = e3.val;
	}
	try {
		return Std.string(Type["typeof"](t));
	} catch( e4 ) {
		haxe_CallStack.lastException = e4;
		if (e4 instanceof js__$Boot_HaxeError) e4 = e4.val;
	}
	try {
		return Std.string(t);
	} catch( e5 ) {
		haxe_CallStack.lastException = e5;
		if (e5 instanceof js__$Boot_HaxeError) e5 = e5.val;
	}
	return "<unable to retrieve type name>";
};
var utest_Assertation = { __ename__ : ["utest","Assertation"], __constructs__ : ["Success","Failure","Error","SetupError","TeardownError","TimeoutError","AsyncError","Warning"] };
utest_Assertation.Success = function(pos) { var $x = ["Success",0,pos]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.Failure = function(msg,pos) { var $x = ["Failure",1,msg,pos]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.Error = function(e,stack) { var $x = ["Error",2,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.SetupError = function(e,stack) { var $x = ["SetupError",3,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.TeardownError = function(e,stack) { var $x = ["TeardownError",4,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.TimeoutError = function(missedAsyncs,stack) { var $x = ["TimeoutError",5,missedAsyncs,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.AsyncError = function(e,stack) { var $x = ["AsyncError",6,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.Warning = function(msg) { var $x = ["Warning",7,msg]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
var utest__$Dispatcher_EventException = { __ename__ : ["utest","_Dispatcher","EventException"], __constructs__ : ["StopPropagation"] };
utest__$Dispatcher_EventException.StopPropagation = ["StopPropagation",0];
utest__$Dispatcher_EventException.StopPropagation.toString = $estr;
utest__$Dispatcher_EventException.StopPropagation.__enum__ = utest__$Dispatcher_EventException;
var utest_Dispatcher = function() {
	this.handlers = [];
};
utest_Dispatcher.__name__ = ["utest","Dispatcher"];
utest_Dispatcher.stop = function() {
	throw new js__$Boot_HaxeError(utest__$Dispatcher_EventException.StopPropagation);
};
utest_Dispatcher.prototype = {
	handlers: null
	,add: function(h) {
		this.handlers.push(h);
		return h;
	}
	,remove: function(h) {
		var _g1 = 0;
		var _g = this.handlers.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(Reflect.compareMethods(this.handlers[i],h)) return this.handlers.splice(i,1)[0];
		}
		return null;
	}
	,clear: function() {
		this.handlers = [];
	}
	,dispatch: function(e) {
		try {
			var list = this.handlers.slice();
			var _g = 0;
			while(_g < list.length) {
				var l = list[_g];
				++_g;
				l(e);
			}
			return true;
		} catch( exc ) {
			haxe_CallStack.lastException = exc;
			if (exc instanceof js__$Boot_HaxeError) exc = exc.val;
			if( js_Boot.__instanceof(exc,utest__$Dispatcher_EventException) ) {
				return false;
			} else throw(exc);
		}
	}
	,has: function() {
		return this.handlers.length > 0;
	}
	,__class__: utest_Dispatcher
};
var utest_Notifier = function() {
	this.handlers = [];
};
utest_Notifier.__name__ = ["utest","Notifier"];
utest_Notifier.stop = function() {
	throw new js__$Boot_HaxeError(utest__$Dispatcher_EventException.StopPropagation);
};
utest_Notifier.prototype = {
	handlers: null
	,add: function(h) {
		this.handlers.push(h);
		return h;
	}
	,remove: function(h) {
		var _g1 = 0;
		var _g = this.handlers.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(Reflect.compareMethods(this.handlers[i],h)) return this.handlers.splice(i,1)[0];
		}
		return null;
	}
	,clear: function() {
		this.handlers = [];
	}
	,dispatch: function() {
		try {
			var list = this.handlers.slice();
			var _g = 0;
			while(_g < list.length) {
				var l = list[_g];
				++_g;
				l();
			}
			return true;
		} catch( exc ) {
			haxe_CallStack.lastException = exc;
			if (exc instanceof js__$Boot_HaxeError) exc = exc.val;
			if( js_Boot.__instanceof(exc,utest__$Dispatcher_EventException) ) {
				return false;
			} else throw(exc);
		}
	}
	,has: function() {
		return this.handlers.length > 0;
	}
	,__class__: utest_Notifier
};
var utest_Runner = function() {
	this.globalPattern = null;
	this.fixtures = [];
	this.onProgress = new utest_Dispatcher();
	this.onStart = new utest_Dispatcher();
	this.onComplete = new utest_Dispatcher();
	this.onPrecheck = new utest_Dispatcher();
	this.onTestStart = new utest_Dispatcher();
	this.onTestComplete = new utest_Dispatcher();
	this.length = 0;
};
utest_Runner.__name__ = ["utest","Runner"];
utest_Runner.prototype = {
	fixtures: null
	,onProgress: null
	,onStart: null
	,onComplete: null
	,onPrecheck: null
	,onTestStart: null
	,onTestComplete: null
	,length: null
	,globalPattern: null
	,addCase: function(test,setup,teardown,prefix,pattern,setupAsync,teardownAsync) {
		if(teardownAsync == null) teardownAsync = "teardownAsync";
		if(setupAsync == null) setupAsync = "setupAsync";
		if(prefix == null) prefix = "test";
		if(teardown == null) teardown = "teardown";
		if(setup == null) setup = "setup";
		if(!Reflect.isObject(test)) throw new js__$Boot_HaxeError("can't add a null object as a test case");
		if(!this.isMethod(test,setup)) setup = null;
		if(!this.isMethod(test,setupAsync)) setupAsync = null;
		if(!this.isMethod(test,teardown)) teardown = null;
		if(!this.isMethod(test,teardownAsync)) teardownAsync = null;
		var fields = Type.getInstanceFields(Type.getClass(test));
		if(this.globalPattern == null && pattern == null) {
			var _g = 0;
			while(_g < fields.length) {
				var field = fields[_g];
				++_g;
				if(!StringTools.startsWith(field,prefix)) continue;
				if(!this.isMethod(test,field)) continue;
				this.addFixture(new utest_TestFixture(test,field,setup,teardown,setupAsync,teardownAsync));
			}
		} else {
			if(this.globalPattern != null) pattern = this.globalPattern; else pattern = pattern;
			var _g1 = 0;
			while(_g1 < fields.length) {
				var field1 = fields[_g1];
				++_g1;
				if(!pattern.match(field1)) continue;
				if(!this.isMethod(test,field1)) continue;
				this.addFixture(new utest_TestFixture(test,field1,setup,teardown,setupAsync,teardownAsync));
			}
		}
	}
	,addFixture: function(fixture) {
		this.fixtures.push(fixture);
		this.length++;
	}
	,getFixture: function(index) {
		return this.fixtures[index];
	}
	,isMethod: function(test,name) {
		try {
			return Reflect.isFunction(Reflect.field(test,name));
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return false;
		}
	}
	,pos: null
	,run: function() {
		this.pos = 0;
		this.onStart.dispatch(this);
		this.runNext();
	}
	,runNext: function() {
		if(this.fixtures.length > this.pos) this.runFixture(this.fixtures[this.pos++]); else this.onComplete.dispatch(this);
	}
	,runFixture: function(fixture) {
		var handler = new utest_TestHandler(fixture);
		handler.onComplete.add($bind(this,this.testComplete));
		handler.onPrecheck.add(($_=this.onPrecheck,$bind($_,$_.dispatch)));
		this.onTestStart.dispatch(handler);
		handler.execute();
	}
	,testComplete: function(h) {
		this.onTestComplete.dispatch(h);
		this.onProgress.dispatch({ result : utest_TestResult.ofHandler(h), done : this.pos, totals : this.length});
		this.runNext();
	}
	,__class__: utest_Runner
};
var utest_TestFixture = function(target,method,setup,teardown,setupAsync,teardownAsync) {
	this.target = target;
	this.method = method;
	this.setup = setup;
	this.setupAsync = setupAsync;
	this.teardown = teardown;
	this.teardownAsync = teardownAsync;
};
utest_TestFixture.__name__ = ["utest","TestFixture"];
utest_TestFixture.prototype = {
	target: null
	,method: null
	,setup: null
	,setupAsync: null
	,teardown: null
	,teardownAsync: null
	,checkMethod: function(name,arg) {
		var field = Reflect.field(this.target,name);
		if(field == null) throw new js__$Boot_HaxeError(arg + " function " + name + " is not a field of target");
		if(!Reflect.isFunction(field)) throw new js__$Boot_HaxeError(arg + " function " + name + " is not a function");
	}
	,__class__: utest_TestFixture
};
var utest_TestHandler = function(fixture) {
	if(fixture == null) throw new js__$Boot_HaxeError("fixture argument is null");
	this.fixture = fixture;
	this.results = new List();
	this.asyncStack = new List();
	this.onTested = new utest_Dispatcher();
	this.onTimeout = new utest_Dispatcher();
	this.onComplete = new utest_Dispatcher();
	this.onPrecheck = new utest_Dispatcher();
};
utest_TestHandler.__name__ = ["utest","TestHandler"];
utest_TestHandler.exceptionStack = function(pops) {
	if(pops == null) pops = 2;
	var stack = haxe_CallStack.exceptionStack();
	while(pops-- > 0) stack.pop();
	return stack;
};
utest_TestHandler.prototype = {
	results: null
	,fixture: null
	,asyncStack: null
	,onTested: null
	,onTimeout: null
	,onComplete: null
	,onPrecheck: null
	,precheck: null
	,execute: function() {
		try {
			this.executeMethod(this.fixture.setup);
			this.executeAsyncMethod(this.fixture.setupAsync,(function(f) {
				return function() {
					f();
				};
			})($bind(this,this.executeAsync)));
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.results.add(utest_Assertation.SetupError(e,utest_TestHandler.exceptionStack()));
			this.executeFinally();
		}
	}
	,executeAsync: function() {
		try {
			this.executeMethod(this.fixture.method);
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.results.add(utest_Assertation.Error(e,utest_TestHandler.exceptionStack()));
		}
		this.executeFinally();
	}
	,executeFinally: function() {
		this.onPrecheck.dispatch(this);
		this.checkTested();
	}
	,checkTested: function() {
		if(this.expireson == null || this.asyncStack.length == 0) this.tested(); else if(haxe_Timer.stamp() > this.expireson) this.timeout(); else haxe_Timer.delay($bind(this,this.checkTested),10);
	}
	,expireson: null
	,setTimeout: function(timeout) {
		var newexpire = haxe_Timer.stamp() + timeout / 1000;
		if(this.expireson == null) this.expireson = newexpire; else if(newexpire > this.expireson) this.expireson = newexpire; else this.expireson = this.expireson;
	}
	,bindHandler: function() {
		utest_Assert.results = this.results;
		utest_Assert.createAsync = $bind(this,this.addAsync);
		utest_Assert.createEvent = $bind(this,this.addEvent);
	}
	,unbindHandler: function() {
		utest_Assert.results = null;
		utest_Assert.createAsync = function(f,t) {
			return function() {
			};
		};
		utest_Assert.createEvent = function(f1,t1) {
			return function(e) {
			};
		};
	}
	,addAsync: function(f,timeout) {
		if(timeout == null) timeout = 250;
		if(null == f) f = function() {
		};
		this.asyncStack.add(f);
		var handler = this;
		this.setTimeout(timeout);
		return function() {
			if(!handler.asyncStack.remove(f)) {
				handler.results.add(utest_Assertation.AsyncError("async function already executed",[]));
				return;
			}
			try {
				handler.bindHandler();
				f();
			} catch( e ) {
				haxe_CallStack.lastException = e;
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				handler.results.add(utest_Assertation.AsyncError(e,utest_TestHandler.exceptionStack(0)));
			}
		};
	}
	,addEvent: function(f,timeout) {
		if(timeout == null) timeout = 250;
		this.asyncStack.add(f);
		var handler = this;
		this.setTimeout(timeout);
		return function(e) {
			if(!handler.asyncStack.remove(f)) {
				handler.results.add(utest_Assertation.AsyncError("event already executed",[]));
				return;
			}
			try {
				handler.bindHandler();
				f(e);
			} catch( e1 ) {
				haxe_CallStack.lastException = e1;
				if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
				handler.results.add(utest_Assertation.AsyncError(e1,utest_TestHandler.exceptionStack(0)));
			}
		};
	}
	,executeMethod: function(name) {
		if(name == null) return;
		this.bindHandler();
		Reflect.callMethod(this.fixture.target,Reflect.field(this.fixture.target,name),[]);
	}
	,executeAsyncMethod: function(name,done) {
		if(name == null) {
			done();
			return;
		}
		this.bindHandler();
		Reflect.callMethod(this.fixture.target,Reflect.field(this.fixture.target,name),[done]);
	}
	,tested: function() {
		if(this.results.length == 0) this.results.add(utest_Assertation.Warning("no assertions"));
		this.onTested.dispatch(this);
		this.completed();
	}
	,timeout: function() {
		this.results.add(utest_Assertation.TimeoutError(this.asyncStack.length,[]));
		this.onTimeout.dispatch(this);
		this.completed();
	}
	,completed: function() {
		try {
			this.executeMethod(this.fixture.teardown);
			this.executeAsyncMethod(this.fixture.teardownAsync,(function(f) {
				return function() {
					f();
				};
			})($bind(this,this.completedFinally)));
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.results.add(utest_Assertation.TeardownError(e,utest_TestHandler.exceptionStack(2)));
			this.completedFinally();
		}
	}
	,completedFinally: function() {
		this.unbindHandler();
		this.onComplete.dispatch(this);
	}
	,__class__: utest_TestHandler
};
var utest_TestResult = function() {
};
utest_TestResult.__name__ = ["utest","TestResult"];
utest_TestResult.ofHandler = function(handler) {
	var r = new utest_TestResult();
	var path = Type.getClassName(Type.getClass(handler.fixture.target)).split(".");
	r.cls = path.pop();
	r.pack = path.join(".");
	r.method = handler.fixture.method;
	r.setup = handler.fixture.setup;
	r.setupAsync = handler.fixture.setupAsync;
	r.teardown = handler.fixture.teardown;
	r.teardownAsync = handler.fixture.teardownAsync;
	r.assertations = handler.results;
	return r;
};
utest_TestResult.prototype = {
	pack: null
	,cls: null
	,method: null
	,setup: null
	,setupAsync: null
	,teardown: null
	,teardownAsync: null
	,assertations: null
	,allOk: function() {
		var _g_head = this.assertations.h;
		var _g_val = null;
		try {
			while(_g_head != null) {
				var l;
				l = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				switch(l[1]) {
				case 0:
					throw "__break__";
					break;
				default:
					return false;
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return true;
	}
	,__class__: utest_TestResult
};
var utest_ui_Report = function() { };
utest_ui_Report.__name__ = ["utest","ui","Report"];
utest_ui_Report.create = function(runner,displaySuccessResults,headerDisplayMode) {
	var report;
	if(typeof window != 'undefined') report = new utest_ui_text_HtmlReport(runner,null,true); else report = new utest_ui_text_PrintReport(runner);
	if(null == displaySuccessResults) report.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors; else report.displaySuccessResults = displaySuccessResults;
	if(null == headerDisplayMode) report.displayHeader = utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults; else report.displayHeader = headerDisplayMode;
	return report;
};
var utest_ui_common_ClassResult = function(className,setupName,teardownName) {
	this.fixtures = new haxe_ds_StringMap();
	this.className = className;
	this.setupName = setupName;
	this.hasSetup = setupName != null;
	this.teardownName = teardownName;
	this.hasTeardown = teardownName != null;
	this.methods = 0;
	this.stats = new utest_ui_common_ResultStats();
};
utest_ui_common_ClassResult.__name__ = ["utest","ui","common","ClassResult"];
utest_ui_common_ClassResult.prototype = {
	fixtures: null
	,className: null
	,setupName: null
	,teardownName: null
	,hasSetup: null
	,hasTeardown: null
	,methods: null
	,stats: null
	,add: function(result) {
		if(this.fixtures.exists(result.methodName)) throw new js__$Boot_HaxeError("invalid duplicated fixture result");
		this.stats.wire(result.stats);
		this.methods++;
		this.fixtures.set(result.methodName,result);
	}
	,get: function(method) {
		return this.fixtures.get(method);
	}
	,exists: function(method) {
		return this.fixtures.exists(method);
	}
	,methodNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) errorsHavePriority = true;
		var names = [];
		var $it0 = this.fixtures.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			names.push(name);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var $as = me.get(a).stats;
				var bs = me.get(b).stats;
				if($as.hasErrors) if(!bs.hasErrors) return -1; else if($as.errors == bs.errors) return Reflect.compare(a,b); else return Reflect.compare($as.errors,bs.errors); else if(bs.hasErrors) return 1; else if($as.hasFailures) if(!bs.hasFailures) return -1; else if($as.failures == bs.failures) return Reflect.compare(a,b); else return Reflect.compare($as.failures,bs.failures); else if(bs.hasFailures) return 1; else if($as.hasWarnings) if(!bs.hasWarnings) return -1; else if($as.warnings == bs.warnings) return Reflect.compare(a,b); else return Reflect.compare($as.warnings,bs.warnings); else if(bs.hasWarnings) return 1; else return Reflect.compare(a,b);
			});
		} else names.sort(function(a1,b1) {
			return Reflect.compare(a1,b1);
		});
		return names;
	}
	,__class__: utest_ui_common_ClassResult
};
var utest_ui_common_FixtureResult = function(methodName) {
	this.methodName = methodName;
	this.list = new List();
	this.hasTestError = false;
	this.hasSetupError = false;
	this.hasTeardownError = false;
	this.hasTimeoutError = false;
	this.hasAsyncError = false;
	this.stats = new utest_ui_common_ResultStats();
};
utest_ui_common_FixtureResult.__name__ = ["utest","ui","common","FixtureResult"];
utest_ui_common_FixtureResult.prototype = {
	methodName: null
	,hasTestError: null
	,hasSetupError: null
	,hasTeardownError: null
	,hasTimeoutError: null
	,hasAsyncError: null
	,stats: null
	,list: null
	,iterator: function() {
		return new _$List_ListIterator(this.list.h);
	}
	,add: function(assertation) {
		this.list.add(assertation);
		switch(assertation[1]) {
		case 0:
			this.stats.addSuccesses(1);
			break;
		case 1:
			this.stats.addFailures(1);
			break;
		case 2:
			this.stats.addErrors(1);
			break;
		case 3:
			this.stats.addErrors(1);
			this.hasSetupError = true;
			break;
		case 4:
			this.stats.addErrors(1);
			this.hasTeardownError = true;
			break;
		case 5:
			this.stats.addErrors(1);
			this.hasTimeoutError = true;
			break;
		case 6:
			this.stats.addErrors(1);
			this.hasAsyncError = true;
			break;
		case 7:
			this.stats.addWarnings(1);
			break;
		}
	}
	,__class__: utest_ui_common_FixtureResult
};
var utest_ui_common_HeaderDisplayMode = { __ename__ : ["utest","ui","common","HeaderDisplayMode"], __constructs__ : ["AlwaysShowHeader","NeverShowHeader","ShowHeaderWithResults"] };
utest_ui_common_HeaderDisplayMode.AlwaysShowHeader = ["AlwaysShowHeader",0];
utest_ui_common_HeaderDisplayMode.AlwaysShowHeader.toString = $estr;
utest_ui_common_HeaderDisplayMode.AlwaysShowHeader.__enum__ = utest_ui_common_HeaderDisplayMode;
utest_ui_common_HeaderDisplayMode.NeverShowHeader = ["NeverShowHeader",1];
utest_ui_common_HeaderDisplayMode.NeverShowHeader.toString = $estr;
utest_ui_common_HeaderDisplayMode.NeverShowHeader.__enum__ = utest_ui_common_HeaderDisplayMode;
utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults = ["ShowHeaderWithResults",2];
utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults.toString = $estr;
utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults.__enum__ = utest_ui_common_HeaderDisplayMode;
var utest_ui_common_SuccessResultsDisplayMode = { __ename__ : ["utest","ui","common","SuccessResultsDisplayMode"], __constructs__ : ["AlwaysShowSuccessResults","NeverShowSuccessResults","ShowSuccessResultsWithNoErrors"] };
utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults = ["AlwaysShowSuccessResults",0];
utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults.toString = $estr;
utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults.__enum__ = utest_ui_common_SuccessResultsDisplayMode;
utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults = ["NeverShowSuccessResults",1];
utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults.toString = $estr;
utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults.__enum__ = utest_ui_common_SuccessResultsDisplayMode;
utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors = ["ShowSuccessResultsWithNoErrors",2];
utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors.toString = $estr;
utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors.__enum__ = utest_ui_common_SuccessResultsDisplayMode;
var utest_ui_common_IReport = function() { };
utest_ui_common_IReport.__name__ = ["utest","ui","common","IReport"];
utest_ui_common_IReport.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,setHandler: null
	,__class__: utest_ui_common_IReport
};
var utest_ui_common_PackageResult = function(packageName) {
	this.packageName = packageName;
	this.classes = new haxe_ds_StringMap();
	this.packages = new haxe_ds_StringMap();
	this.stats = new utest_ui_common_ResultStats();
};
utest_ui_common_PackageResult.__name__ = ["utest","ui","common","PackageResult"];
utest_ui_common_PackageResult.prototype = {
	packageName: null
	,classes: null
	,packages: null
	,stats: null
	,addResult: function(result,flattenPackage) {
		var pack = this.getOrCreatePackage(result.pack,flattenPackage,this);
		var cls = this.getOrCreateClass(pack,result.cls,result.setup,result.teardown);
		var fix = this.createFixture(result.method,result.assertations);
		cls.add(fix);
	}
	,addClass: function(result) {
		this.classes.set(result.className,result);
		this.stats.wire(result.stats);
	}
	,addPackage: function(result) {
		this.packages.set(result.packageName,result);
		this.stats.wire(result.stats);
	}
	,existsPackage: function(name) {
		return this.packages.exists(name);
	}
	,existsClass: function(name) {
		return this.classes.exists(name);
	}
	,getPackage: function(name) {
		if(this.packageName == null && name == "") return this;
		return this.packages.get(name);
	}
	,getClass: function(name) {
		return this.classes.get(name);
	}
	,classNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) errorsHavePriority = true;
		var names = [];
		var $it0 = this.classes.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			names.push(name);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var $as = me.getClass(a).stats;
				var bs = me.getClass(b).stats;
				if($as.hasErrors) if(!bs.hasErrors) return -1; else if($as.errors == bs.errors) return Reflect.compare(a,b); else return Reflect.compare($as.errors,bs.errors); else if(bs.hasErrors) return 1; else if($as.hasFailures) if(!bs.hasFailures) return -1; else if($as.failures == bs.failures) return Reflect.compare(a,b); else return Reflect.compare($as.failures,bs.failures); else if(bs.hasFailures) return 1; else if($as.hasWarnings) if(!bs.hasWarnings) return -1; else if($as.warnings == bs.warnings) return Reflect.compare(a,b); else return Reflect.compare($as.warnings,bs.warnings); else if(bs.hasWarnings) return 1; else return Reflect.compare(a,b);
			});
		} else names.sort(function(a1,b1) {
			return Reflect.compare(a1,b1);
		});
		return names;
	}
	,packageNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) errorsHavePriority = true;
		var names = [];
		if(this.packageName == null) names.push("");
		var $it0 = this.packages.keys();
		while( $it0.hasNext() ) {
			var name = $it0.next();
			names.push(name);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var $as = me.getPackage(a).stats;
				var bs = me.getPackage(b).stats;
				if($as.hasErrors) if(!bs.hasErrors) return -1; else if($as.errors == bs.errors) return Reflect.compare(a,b); else return Reflect.compare($as.errors,bs.errors); else if(bs.hasErrors) return 1; else if($as.hasFailures) if(!bs.hasFailures) return -1; else if($as.failures == bs.failures) return Reflect.compare(a,b); else return Reflect.compare($as.failures,bs.failures); else if(bs.hasFailures) return 1; else if($as.hasWarnings) if(!bs.hasWarnings) return -1; else if($as.warnings == bs.warnings) return Reflect.compare(a,b); else return Reflect.compare($as.warnings,bs.warnings); else if(bs.hasWarnings) return 1; else return Reflect.compare(a,b);
			});
		} else names.sort(function(a1,b1) {
			return Reflect.compare(a1,b1);
		});
		return names;
	}
	,createFixture: function(method,assertations) {
		var f = new utest_ui_common_FixtureResult(method);
		var $it0 = $iterator(assertations)();
		while( $it0.hasNext() ) {
			var assertation = $it0.next();
			f.add(assertation);
		}
		return f;
	}
	,getOrCreateClass: function(pack,cls,setup,teardown) {
		if(pack.existsClass(cls)) return pack.getClass(cls);
		var c = new utest_ui_common_ClassResult(cls,setup,teardown);
		pack.addClass(c);
		return c;
	}
	,getOrCreatePackage: function(pack,flat,ref) {
		if(pack == null || pack == "") return ref;
		if(flat) {
			if(ref.existsPackage(pack)) return ref.getPackage(pack);
			var p = new utest_ui_common_PackageResult(pack);
			ref.addPackage(p);
			return p;
		} else {
			var parts = pack.split(".");
			var _g = 0;
			while(_g < parts.length) {
				var part = parts[_g];
				++_g;
				ref = this.getOrCreatePackage(part,true,ref);
			}
			return ref;
		}
	}
	,__class__: utest_ui_common_PackageResult
};
var utest_ui_common_ReportTools = function() { };
utest_ui_common_ReportTools.__name__ = ["utest","ui","common","ReportTools"];
utest_ui_common_ReportTools.hasHeader = function(report,stats) {
	var _g = report.displayHeader;
	switch(_g[1]) {
	case 1:
		return false;
	case 2:
		if(!stats.isOk) return true;
		var _g1 = report.displaySuccessResults;
		switch(_g1[1]) {
		case 1:
			return false;
		case 0:case 2:
			return true;
		}
		break;
	case 0:
		return true;
	}
};
utest_ui_common_ReportTools.skipResult = function(report,stats,isOk) {
	if(!stats.isOk) return false;
	var _g = report.displaySuccessResults;
	switch(_g[1]) {
	case 1:
		return true;
	case 0:
		return false;
	case 2:
		return !isOk;
	}
};
utest_ui_common_ReportTools.hasOutput = function(report,stats) {
	if(!stats.isOk) return true;
	return utest_ui_common_ReportTools.hasHeader(report,stats);
};
var utest_ui_common_ResultAggregator = function(runner,flattenPackage) {
	if(flattenPackage == null) flattenPackage = false;
	if(runner == null) throw new js__$Boot_HaxeError("runner argument is null");
	this.flattenPackage = flattenPackage;
	this.runner = runner;
	runner.onStart.add($bind(this,this.start));
	runner.onProgress.add($bind(this,this.progress));
	runner.onComplete.add($bind(this,this.complete));
	this.onStart = new utest_Notifier();
	this.onComplete = new utest_Dispatcher();
	this.onProgress = new utest_Dispatcher();
};
utest_ui_common_ResultAggregator.__name__ = ["utest","ui","common","ResultAggregator"];
utest_ui_common_ResultAggregator.prototype = {
	runner: null
	,flattenPackage: null
	,root: null
	,onStart: null
	,onComplete: null
	,onProgress: null
	,start: function(runner) {
		this.root = new utest_ui_common_PackageResult(null);
		this.onStart.dispatch();
	}
	,getOrCreatePackage: function(pack,flat,ref) {
		if(ref == null) ref = this.root;
		if(pack == null || pack == "") return ref;
		if(flat) {
			if(ref.existsPackage(pack)) return ref.getPackage(pack);
			var p = new utest_ui_common_PackageResult(pack);
			ref.addPackage(p);
			return p;
		} else {
			var parts = pack.split(".");
			var _g = 0;
			while(_g < parts.length) {
				var part = parts[_g];
				++_g;
				ref = this.getOrCreatePackage(part,true,ref);
			}
			return ref;
		}
	}
	,getOrCreateClass: function(pack,cls,setup,teardown) {
		if(pack.existsClass(cls)) return pack.getClass(cls);
		var c = new utest_ui_common_ClassResult(cls,setup,teardown);
		pack.addClass(c);
		return c;
	}
	,createFixture: function(result) {
		var f = new utest_ui_common_FixtureResult(result.method);
		var _g_head = result.assertations.h;
		var _g_val = null;
		while(_g_head != null) {
			var assertation;
			assertation = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			f.add(assertation);
		}
		return f;
	}
	,progress: function(e) {
		this.root.addResult(e.result,this.flattenPackage);
		this.onProgress.dispatch(e);
	}
	,complete: function(runner) {
		this.onComplete.dispatch(this.root);
	}
	,__class__: utest_ui_common_ResultAggregator
};
var utest_ui_common_ResultStats = function() {
	this.assertations = 0;
	this.successes = 0;
	this.failures = 0;
	this.errors = 0;
	this.warnings = 0;
	this.isOk = true;
	this.hasFailures = false;
	this.hasErrors = false;
	this.hasWarnings = false;
	this.onAddSuccesses = new utest_Dispatcher();
	this.onAddFailures = new utest_Dispatcher();
	this.onAddErrors = new utest_Dispatcher();
	this.onAddWarnings = new utest_Dispatcher();
};
utest_ui_common_ResultStats.__name__ = ["utest","ui","common","ResultStats"];
utest_ui_common_ResultStats.prototype = {
	assertations: null
	,successes: null
	,failures: null
	,errors: null
	,warnings: null
	,onAddSuccesses: null
	,onAddFailures: null
	,onAddErrors: null
	,onAddWarnings: null
	,isOk: null
	,hasFailures: null
	,hasErrors: null
	,hasWarnings: null
	,addSuccesses: function(v) {
		if(v == 0) return;
		this.assertations += v;
		this.successes += v;
		this.onAddSuccesses.dispatch(v);
	}
	,addFailures: function(v) {
		if(v == 0) return;
		this.assertations += v;
		this.failures += v;
		this.hasFailures = this.failures > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddFailures.dispatch(v);
	}
	,addErrors: function(v) {
		if(v == 0) return;
		this.assertations += v;
		this.errors += v;
		this.hasErrors = this.errors > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddErrors.dispatch(v);
	}
	,addWarnings: function(v) {
		if(v == 0) return;
		this.assertations += v;
		this.warnings += v;
		this.hasWarnings = this.warnings > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddWarnings.dispatch(v);
	}
	,sum: function(other) {
		this.addSuccesses(other.successes);
		this.addFailures(other.failures);
		this.addErrors(other.errors);
		this.addWarnings(other.warnings);
	}
	,subtract: function(other) {
		this.addSuccesses(-other.successes);
		this.addFailures(-other.failures);
		this.addErrors(-other.errors);
		this.addWarnings(-other.warnings);
	}
	,wire: function(dependant) {
		dependant.onAddSuccesses.add($bind(this,this.addSuccesses));
		dependant.onAddFailures.add($bind(this,this.addFailures));
		dependant.onAddErrors.add($bind(this,this.addErrors));
		dependant.onAddWarnings.add($bind(this,this.addWarnings));
		this.sum(dependant);
	}
	,unwire: function(dependant) {
		dependant.onAddSuccesses.remove($bind(this,this.addSuccesses));
		dependant.onAddFailures.remove($bind(this,this.addFailures));
		dependant.onAddErrors.remove($bind(this,this.addErrors));
		dependant.onAddWarnings.remove($bind(this,this.addWarnings));
		this.subtract(dependant);
	}
	,__class__: utest_ui_common_ResultStats
};
var utest_ui_text_HtmlReport = function(runner,outputHandler,traceRedirected) {
	if(traceRedirected == null) traceRedirected = true;
	this.aggregator = new utest_ui_common_ResultAggregator(runner,true);
	runner.onStart.add($bind(this,this.start));
	this.aggregator.onComplete.add($bind(this,this.complete));
	if(null == outputHandler) this.setHandler($bind(this,this._handler)); else this.setHandler(outputHandler);
	if(traceRedirected) this.redirectTrace();
	this.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults;
	this.displayHeader = utest_ui_common_HeaderDisplayMode.AlwaysShowHeader;
};
utest_ui_text_HtmlReport.__name__ = ["utest","ui","text","HtmlReport"];
utest_ui_text_HtmlReport.__interfaces__ = [utest_ui_common_IReport];
utest_ui_text_HtmlReport.prototype = {
	traceRedirected: null
	,displaySuccessResults: null
	,displayHeader: null
	,handler: null
	,aggregator: null
	,oldTrace: null
	,_traces: null
	,setHandler: function(handler) {
		this.handler = handler;
	}
	,redirectTrace: function() {
		if(this.traceRedirected) return;
		this._traces = [];
		this.oldTrace = haxe_Log.trace;
		haxe_Log.trace = $bind(this,this._trace);
	}
	,restoreTrace: function() {
		if(!this.traceRedirected) return;
		haxe_Log.trace = this.oldTrace;
	}
	,_traceTime: null
	,_trace: function(v,infos) {
		var time = haxe_Timer.stamp();
		var delta;
		if(this._traceTime == null) delta = 0; else delta = time - this._traceTime;
		this._traces.push({ msg : StringTools.htmlEscape(Std.string(v)), infos : infos, time : time - this.startTime, delta : delta, stack : haxe_CallStack.callStack()});
		this._traceTime = haxe_Timer.stamp();
	}
	,startTime: null
	,start: function(e) {
		this.startTime = haxe_Timer.stamp();
	}
	,cls: function(stats) {
		if(stats.hasErrors) return "error"; else if(stats.hasFailures) return "failure"; else if(stats.hasWarnings) return "warn"; else return "ok";
	}
	,resultNumbers: function(buf,stats) {
		var numbers = [];
		if(stats.assertations == 1) numbers.push("<strong>1</strong> test"); else numbers.push("<strong>" + stats.assertations + "</strong> tests");
		if(stats.successes != stats.assertations) {
			if(stats.successes == 1) numbers.push("<strong>1</strong> pass"); else if(stats.successes > 0) numbers.push("<strong>" + stats.successes + "</strong> passes");
		}
		if(stats.errors == 1) numbers.push("<strong>1</strong> error"); else if(stats.errors > 0) numbers.push("<strong>" + stats.errors + "</strong> errors");
		if(stats.failures == 1) numbers.push("<strong>1</strong> failure"); else if(stats.failures > 0) numbers.push("<strong>" + stats.failures + "</strong> failures");
		if(stats.warnings == 1) numbers.push("<strong>1</strong> warning"); else if(stats.warnings > 0) numbers.push("<strong>" + stats.warnings + "</strong> warnings");
		buf.add(numbers.join(", "));
	}
	,blockNumbers: function(buf,stats) {
		buf.add("<div class=\"" + this.cls(stats) + "bg statnumbers\">");
		this.resultNumbers(buf,stats);
		buf.b += "</div>";
	}
	,formatStack: function(stack,addNL) {
		if(addNL == null) addNL = true;
		var parts = [];
		var nl;
		if(addNL) nl = "\n"; else nl = "";
		var last = null;
		var count = 1;
		var _g = 0;
		var _g1 = haxe_CallStack.toString(stack).split("\n");
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			if(StringTools.trim(part) == "") continue;
			if(-1 < part.indexOf("Called from utest.")) continue;
			if(part == last) parts[parts.length - 1] = part + " (#" + ++count + ")"; else {
				count = 1;
				parts.push(last = part);
			}
		}
		var s = "<ul><li>" + parts.join("</li>" + nl + "<li>") + "</li></ul>" + nl;
		return "<div>" + s + "</div>" + nl;
	}
	,addFixture: function(buf,result,name,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) return;
		buf.b += "<li class=\"fixture\"><div class=\"li\">";
		buf.add("<span class=\"" + this.cls(result.stats) + "bg fixtureresult\">");
		if(result.stats.isOk) buf.b += "OK "; else if(result.stats.hasErrors) buf.b += "ERROR "; else if(result.stats.hasFailures) buf.b += "FAILURE "; else if(result.stats.hasWarnings) buf.b += "WARNING ";
		buf.b += "</span>";
		buf.b += "<div class=\"fixturedetails\">";
		buf.b += Std.string("<strong>" + name + "</strong>");
		buf.b += ": ";
		this.resultNumbers(buf,result.stats);
		var messages = [];
		var _g = result.iterator();
		while(_g.head != null) {
			var assertation;
			assertation = (function($this) {
				var $r;
				_g.val = _g.head[0];
				_g.head = _g.head[1];
				$r = _g.val;
				return $r;
			}(this));
			switch(assertation[1]) {
			case 0:
				break;
			case 1:
				var pos = assertation[3];
				var msg = assertation[2];
				messages.push("<strong>line " + pos.lineNumber + "</strong>: <em>" + StringTools.htmlEscape(msg) + "</em>");
				break;
			case 2:
				var s = assertation[3];
				var e = assertation[2];
				messages.push("<strong>error</strong>: <em>" + this.getErrorDescription(e) + "</em>\n<br/><strong>stack</strong>:" + this.getErrorStack(s,e));
				break;
			case 3:
				var s1 = assertation[3];
				var e1 = assertation[2];
				messages.push("<strong>setup error</strong>: " + this.getErrorDescription(e1) + "\n<br/><strong>stack</strong>:" + this.getErrorStack(s1,e1));
				break;
			case 4:
				var s2 = assertation[3];
				var e2 = assertation[2];
				messages.push("<strong>tear-down error</strong>: " + this.getErrorDescription(e2) + "\n<br/><strong>stack</strong>:" + this.getErrorStack(s2,e2));
				break;
			case 5:
				var missedAsyncs = assertation[2];
				messages.push("<strong>missed async call(s)</strong>: " + missedAsyncs);
				break;
			case 6:
				var s3 = assertation[3];
				var e3 = assertation[2];
				messages.push("<strong>async error</strong>: " + this.getErrorDescription(e3) + "\n<br/><strong>stack</strong>:" + this.getErrorStack(s3,e3));
				break;
			case 7:
				var msg1 = assertation[2];
				messages.push(StringTools.htmlEscape(msg1));
				break;
			}
		}
		if(messages.length > 0) {
			buf.b += "<div class=\"testoutput\">";
			buf.add(messages.join("<br/>"));
			buf.b += "</div>\n";
		}
		buf.b += "</div>\n";
		buf.b += "</div></li>\n";
	}
	,getErrorDescription: function(e) {
		return Std.string(e);
	}
	,getErrorStack: function(s,e) {
		return this.formatStack(s);
	}
	,addClass: function(buf,result,name,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) return;
		buf.b += "<li>";
		buf.b += Std.string("<h2 class=\"classname\">" + name + "</h2>");
		this.blockNumbers(buf,result.stats);
		buf.b += "<ul>\n";
		var _g = 0;
		var _g1 = result.methodNames();
		while(_g < _g1.length) {
			var mname = _g1[_g];
			++_g;
			this.addFixture(buf,result.get(mname),mname,isOk);
		}
		buf.b += "</ul>\n";
		buf.b += "</li>\n";
	}
	,addPackages: function(buf,result,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) return;
		buf.b += "<ul id=\"utest-results-packages\">\n";
		var _g = 0;
		var _g1 = result.packageNames(false);
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			this.addPackage(buf,result.getPackage(name),name,isOk);
		}
		buf.b += "</ul>\n";
	}
	,addPackage: function(buf,result,name,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) return;
		if(name == "" && result.classNames().length == 0) return;
		buf.b += "<li>";
		buf.b += Std.string("<h2>" + name + "</h2>");
		this.blockNumbers(buf,result.stats);
		buf.b += "<ul>\n";
		var _g = 0;
		var _g1 = result.classNames();
		while(_g < _g1.length) {
			var cname = _g1[_g];
			++_g;
			this.addClass(buf,result.getClass(cname),cname,isOk);
		}
		buf.b += "</ul>\n";
		buf.b += "</li>\n";
	}
	,getTextResults: function() {
		var newline = "\n";
		var indents = function(count) {
			return ((function($this) {
				var $r;
				var _g = [];
				{
					var _g1 = 0;
					while(_g1 < count) {
						var i = _g1++;
						_g.push("  ");
					}
				}
				$r = _g;
				return $r;
			}(this))).join("");
		};
		var dumpStack = function(stack) {
			if(stack.length == 0) return "";
			var parts = haxe_CallStack.toString(stack).split("\n");
			var r = [];
			var _g2 = 0;
			while(_g2 < parts.length) {
				var part = parts[_g2];
				++_g2;
				if(part.indexOf(" utest.") >= 0) continue;
				r.push(part);
			}
			return r.join(newline);
		};
		var buf = new StringBuf();
		var _g3 = 0;
		var _g11 = this.result.packageNames();
		while(_g3 < _g11.length) {
			var pname = _g11[_g3];
			++_g3;
			var pack = this.result.getPackage(pname);
			if(utest_ui_common_ReportTools.skipResult(this,pack.stats,this.result.stats.isOk)) continue;
			var _g21 = 0;
			var _g31 = pack.classNames();
			while(_g21 < _g31.length) {
				var cname = _g31[_g21];
				++_g21;
				var cls = pack.getClass(cname);
				if(utest_ui_common_ReportTools.skipResult(this,cls.stats,this.result.stats.isOk)) continue;
				buf.b += Std.string((pname == ""?"":pname + ".") + cname + newline);
				var _g4 = 0;
				var _g5 = cls.methodNames();
				while(_g4 < _g5.length) {
					var mname = _g5[_g4];
					++_g4;
					var fix = cls.get(mname);
					if(utest_ui_common_ReportTools.skipResult(this,fix.stats,this.result.stats.isOk)) continue;
					buf.add(indents(1) + mname + ": ");
					if(fix.stats.isOk) buf.b += "OK "; else if(fix.stats.hasErrors) buf.b += "ERROR "; else if(fix.stats.hasFailures) buf.b += "FAILURE "; else if(fix.stats.hasWarnings) buf.b += "WARNING ";
					var messages = "";
					var _g6 = fix.iterator();
					while(_g6.head != null) {
						var assertation;
						assertation = (function($this) {
							var $r;
							_g6.val = _g6.head[0];
							_g6.head = _g6.head[1];
							$r = _g6.val;
							return $r;
						}(this));
						switch(assertation[1]) {
						case 0:
							buf.b += ".";
							break;
						case 1:
							var pos = assertation[3];
							var msg = assertation[2];
							buf.b += "F";
							messages += indents(2) + "line: " + pos.lineNumber + ", " + msg + newline;
							break;
						case 2:
							var s = assertation[3];
							var e = assertation[2];
							buf.b += "E";
							messages += indents(2) + Std.string(e) + dumpStack(s) + newline;
							break;
						case 3:
							var s1 = assertation[3];
							var e1 = assertation[2];
							buf.b += "S";
							messages += indents(2) + Std.string(e1) + dumpStack(s1) + newline;
							break;
						case 4:
							var s2 = assertation[3];
							var e2 = assertation[2];
							buf.b += "T";
							messages += indents(2) + Std.string(e2) + dumpStack(s2) + newline;
							break;
						case 5:
							var s3 = assertation[3];
							var missedAsyncs = assertation[2];
							buf.b += "O";
							messages += indents(2) + "missed async calls: " + missedAsyncs + dumpStack(s3) + newline;
							break;
						case 6:
							var s4 = assertation[3];
							var e3 = assertation[2];
							buf.b += "A";
							messages += indents(2) + Std.string(e3) + dumpStack(s4) + newline;
							break;
						case 7:
							var msg1 = assertation[2];
							buf.b += "W";
							messages += indents(2) + msg1 + newline;
							break;
						}
					}
					if(newline == null) buf.b += "null"; else buf.b += "" + newline;
					if(messages == null) buf.b += "null"; else buf.b += "" + messages;
				}
			}
		}
		return buf.b;
	}
	,getHeader: function() {
		var buf = new StringBuf();
		if(!utest_ui_common_ReportTools.hasHeader(this,this.result.stats)) return "";
		var end = haxe_Timer.stamp();
		var time = ((end - this.startTime) * 1000 | 0) / 1000;
		var msg = "TEST OK";
		if(this.result.stats.hasErrors) msg = "TEST ERRORS"; else if(this.result.stats.hasFailures) msg = "TEST FAILED"; else if(this.result.stats.hasWarnings) msg = "WARNING REPORTED";
		buf.add("<h1 class=\"" + this.cls(this.result.stats) + "bg header\">" + msg + "</h1>\n");
		buf.b += "<div class=\"headerinfo\">";
		this.resultNumbers(buf,this.result.stats);
		buf.b += Std.string(" performed on <strong>" + utest_ui_text_HtmlReport.platform + "</strong>, executed in <strong> " + time + " sec. </strong></div >\n ");
		return buf.b;
	}
	,getTrace: function() {
		var buf = new StringBuf();
		if(this._traces == null || this._traces.length == 0) return "";
		buf.b += "<div class=\"trace\"><h2>traces</h2><ol>";
		var _g = 0;
		var _g1 = this._traces;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			buf.b += "<li><div class=\"li\">";
			var stack = StringTools.replace(this.formatStack(t.stack,false),"'","\\'");
			var method = "<span class=\"tracepackage\">" + t.infos.className + "</span><br/>" + t.infos.methodName + "(" + t.infos.lineNumber + ")";
			buf.b += Std.string("<span class=\"tracepos\" onmouseover=\"utestTooltip(this.parentNode, '" + stack + "')\" onmouseout=\"utestRemoveTooltip()\">");
			if(method == null) buf.b += "null"; else buf.b += "" + method;
			buf.b += "</span><span class=\"tracetime\">";
			buf.add("@ " + this.formatTime(t.time));
			if(Math.round(t.delta * 1000) > 0) buf.add(", ~" + this.formatTime(t.delta));
			buf.b += "</span><span class=\"tracemsg\">";
			buf.add(StringTools.replace(StringTools.trim(t.msg),"\n","<br/>\n"));
			buf.b += "</span><div class=\"clr\"></div></div></li>";
		}
		buf.b += "</ol></div>";
		return buf.b;
	}
	,getResults: function() {
		var buf = new StringBuf();
		this.addPackages(buf,this.result,this.result.stats.isOk);
		return buf.b;
	}
	,getAll: function() {
		if(!utest_ui_common_ReportTools.hasOutput(this,this.result.stats)) return ""; else return this.getHeader() + this.getTrace() + this.getResults();
	}
	,getHtml: function(title) {
		if(null == title) title = "utest: " + utest_ui_text_HtmlReport.platform;
		var s = this.getAll();
		if("" == s) return ""; else return this.wrapHtml(title,s);
	}
	,result: null
	,complete: function(result) {
		this.result = result;
		this.handler(this);
		this.restoreTrace();
		var exposedResult = { isOk : result.stats.isOk, message : this.getTextResults()};
		if('undefined' != typeof window) window.utest_result = exposedResult;
	}
	,formatTime: function(t) {
		return Math.round(t * 1000) + " ms";
	}
	,cssStyle: function() {
		return "body, dd, dt {\n  font-family: Verdana, Arial, Sans-serif;\n  font-size: 12px;\n}\ndl {\n  width: 180px;\n}\ndd, dt {\n  margin : 0;\n  padding : 2px 5px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n}\ndd.value {\n  text-align: center;\n  background-color: #eeeeee;\n}\ndt {\n  text-align: left;\n  background-color: #e6e6e6;\n  float: left;\n  width: 100px;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  margin: 0;\n  padding: 0;\n}\n\nh1 {\n  text-align: center;\n  font-weight: bold;\n  padding: 5px 0 4px 0;\n  font-family: Arial, Sans-serif;\n  font-size: 18px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  margin: 0 2px 0px 2px;\n}\n\nh2 {\n  font-weight: bold;\n  padding: 2px 0 2px 8px;\n  font-family: Arial, Sans-serif;\n  font-size: 13px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  margin: 0 0 0px 0;\n  background-color: #FFFFFF;\n  color: #777777;\n}\n\nh2.classname {\n  color: #000000;\n}\n\n.okbg {\n  background-color: #66FF55;\n}\n.errorbg {\n  background-color: #CC1100;\n}\n.failurebg {\n  background-color: #EE3322;\n}\n.warnbg {\n  background-color: #FFCC99;\n}\n.headerinfo {\n  text-align: right;\n  font-size: 11px;\n  font - color: 0xCCCCCC;\n  margin: 0 2px 5px 2px;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  padding: 2px;\n}\n\nli {\n  padding: 4px;\n  margin: 2px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  background-color: #e6e6e6;\n}\n\nli.fixture {\n  background-color: #f6f6f6;\n  padding-bottom: 6px;\n}\n\ndiv.fixturedetails {\n  padding-left: 108px;\n}\n\nul {\n  padding: 0;\n  margin: 6px 0 0 0;\n  list-style-type: none;\n}\n\nol {\n  padding: 0 0 0 28px;\n  margin: 0px 0 0 0;\n}\n\n.statnumbers {\n  padding: 2px 8px;\n}\n\n.fixtureresult {\n  width: 100px;\n  text-align: center;\n  display: block;\n  float: left;\n  font-weight: bold;\n  padding: 1px;\n  margin: 0 0 0 0;\n}\n\n.testoutput {\n  border: 1px dashed #CCCCCC;\n  margin: 4px 0 0 0;\n  padding: 4px 8px;\n  background-color: #eeeeee;\n}\n\nspan.tracepos, span.traceposempty {\n  display: block;\n  float: left;\n  font-weight: bold;\n  font-size: 9px;\n  width: 170px;\n  margin: 2px 0 0 2px;\n}\n\nspan.tracepos:hover {\n  cursor : pointer;\n  background-color: #ffff99;\n}\n\nspan.tracemsg {\n  display: block;\n  margin-left: 180px;\n  background-color: #eeeeee;\n  padding: 7px;\n}\n\nspan.tracetime {\n  display: block;\n  float: right;\n  margin: 2px;\n  font-size: 9px;\n  color: #777777;\n}\n\n\ndiv.trace ol {\n  padding: 0 0 0 40px;\n  color: #777777;\n}\n\ndiv.trace li {\n  padding: 0;\n}\n\ndiv.trace li div.li {\n  color: #000000;\n}\n\ndiv.trace h2 {\n  margin: 0 2px 0px 2px;\n  padding-left: 4px;\n}\n\n.tracepackage {\n  color: #777777;\n  font-weight: normal;\n}\n\n.clr {\n  clear: both;\n}\n\n#utesttip {\n  margin-top: -3px;\n  margin-left: 170px;\n  font-size: 9px;\n}\n\n#utesttip li {\n  margin: 0;\n  background-color: #ffff99;\n  padding: 2px 4px;\n  border: 0;\n  border-bottom: 1px dashed #ffff33;\n}";
	}
	,jsScript: function() {
		return "function utestTooltip(ref, text) {\n  var el = document.getElementById(\"utesttip\");\n  if(!el) {\n    var el = document.createElement(\"div\")\n    el.id = \"utesttip\";\n    el.style.position = \"absolute\";\n    document.body.appendChild(el)\n  }\n  var p = utestFindPos(ref);\n  el.style.left = (4 + p[0]) + \"px\";\n  el.style.top = (p[1] - 1) + \"px\";\n  el.innerHTML =  text;\n}\n\nfunction utestFindPos(el) {\n  var left = 0;\n  var top = 0;\n  do {\n    left += el.offsetLeft;\n    top += el.offsetTop;\n  } while(el = el.offsetParent)\n  return [left, top];\n}\n\nfunction utestRemoveTooltip() {\n  var el = document.getElementById(\"utesttip\")\n  if(el)\n    document.body.removeChild(el)\n}";
	}
	,wrapHtml: function(title,s) {
		return "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\" />\n<title>" + title + "</title>\n      <style type=\"text/css\">" + this.cssStyle() + "</style>\n      <script type=\"text/javascript\">\n" + this.jsScript() + "\n</" + "script>\n</head>\n      <body>\n" + s + "\n</body>\n</html>";
	}
	,_handler: function(report) {
		var isDef = function(v) {
			return typeof v != 'undefined';
		};
		var hasProcess = typeof process != 'undefined';
		if(hasProcess) {
			process.stdout.write(report.getHtml());
			return;
		}
		var head = window.document.getElementsByTagName("head")[0];
		var script = window.document.createElement("script");
		script.type = "text/javascript";
		var sjs = report.jsScript();
		if(isDef(script.text)) script.text = sjs; else script.innerHTML = sjs;
		head.appendChild(script);
		var style = window.document.createElement("style");
		style.type = "text/css";
		var scss = report.cssStyle();
		if(isDef(style.styleSheet)) style.styleSheet.cssText = scss; else if(isDef(style.cssText)) style.cssText = scss; else if(isDef(style.innerText)) style.innerText = scss; else style.innerHTML = scss;
		head.appendChild(style);
		var el = window.document.getElementById("utest-results");
		if(null == el) {
			el = window.document.createElement("div");
			el.id = "utest-results";
			window.document.body.appendChild(el);
		}
		el.innerHTML = report.getAll();
	}
	,__class__: utest_ui_text_HtmlReport
};
var utest_ui_text_PlainTextReport = function(runner,outputHandler) {
	this.aggregator = new utest_ui_common_ResultAggregator(runner,true);
	runner.onStart.add($bind(this,this.start));
	this.aggregator.onComplete.add($bind(this,this.complete));
	if(null != outputHandler) this.setHandler(outputHandler);
	this.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults;
	this.displayHeader = utest_ui_common_HeaderDisplayMode.AlwaysShowHeader;
};
utest_ui_text_PlainTextReport.__name__ = ["utest","ui","text","PlainTextReport"];
utest_ui_text_PlainTextReport.__interfaces__ = [utest_ui_common_IReport];
utest_ui_text_PlainTextReport.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,handler: null
	,aggregator: null
	,newline: null
	,indent: null
	,setHandler: function(handler) {
		this.handler = handler;
	}
	,startTime: null
	,start: function(e) {
		this.startTime = this.getTime();
	}
	,getTime: function() {
		return haxe_Timer.stamp();
	}
	,indents: function(c) {
		var s = "";
		var _g = 0;
		while(_g < c) {
			var _ = _g++;
			s += this.indent;
		}
		return s;
	}
	,dumpStack: function(stack) {
		if(stack.length == 0) return "";
		var parts = haxe_CallStack.toString(stack).split("\n");
		var r = [];
		var _g = 0;
		while(_g < parts.length) {
			var part = parts[_g];
			++_g;
			if(part.indexOf(" utest.") >= 0) continue;
			r.push(part);
		}
		return r.join(this.newline);
	}
	,addHeader: function(buf,result) {
		if(!utest_ui_common_ReportTools.hasHeader(this,result.stats)) return;
		var end = this.getTime();
		var time = ((end - this.startTime) * 1000 | 0) / 1000;
		buf.b += Std.string("\nassertations: " + result.stats.assertations + this.newline);
		buf.b += Std.string("successes: " + result.stats.successes + this.newline);
		buf.b += Std.string("errors: " + result.stats.errors + this.newline);
		buf.b += Std.string("failures: " + result.stats.failures + this.newline);
		buf.b += Std.string("warnings: " + result.stats.warnings + this.newline);
		buf.b += Std.string("execution time: " + time + this.newline);
		buf.b += Std.string(this.newline);
		buf.b += Std.string("results: " + (result.stats.isOk?"ALL TESTS OK (success: true)":"SOME TESTS FAILURES (success: false)"));
		buf.b += Std.string(this.newline);
	}
	,result: null
	,getResults: function() {
		var buf = new StringBuf();
		this.addHeader(buf,this.result);
		var _g = 0;
		var _g1 = this.result.packageNames();
		while(_g < _g1.length) {
			var pname = _g1[_g];
			++_g;
			var pack = this.result.getPackage(pname);
			if(utest_ui_common_ReportTools.skipResult(this,pack.stats,this.result.stats.isOk)) continue;
			var _g2 = 0;
			var _g3 = pack.classNames();
			while(_g2 < _g3.length) {
				var cname = _g3[_g2];
				++_g2;
				var cls = pack.getClass(cname);
				if(utest_ui_common_ReportTools.skipResult(this,cls.stats,this.result.stats.isOk)) continue;
				buf.b += Std.string((pname == ""?"":pname + ".") + cname + this.newline);
				var _g4 = 0;
				var _g5 = cls.methodNames();
				while(_g4 < _g5.length) {
					var mname = _g5[_g4];
					++_g4;
					var fix = cls.get(mname);
					if(utest_ui_common_ReportTools.skipResult(this,fix.stats,this.result.stats.isOk)) continue;
					buf.add(this.indents(1) + mname + ": ");
					if(fix.stats.isOk) buf.b += "OK "; else if(fix.stats.hasErrors) buf.b += "ERROR "; else if(fix.stats.hasFailures) buf.b += "FAILURE "; else if(fix.stats.hasWarnings) buf.b += "WARNING ";
					var messages = "";
					var _g6 = fix.iterator();
					while(_g6.head != null) {
						var assertation;
						assertation = (function($this) {
							var $r;
							_g6.val = _g6.head[0];
							_g6.head = _g6.head[1];
							$r = _g6.val;
							return $r;
						}(this));
						switch(assertation[1]) {
						case 0:
							buf.b += ".";
							break;
						case 1:
							var pos = assertation[3];
							var msg = assertation[2];
							buf.b += "F";
							messages += this.indents(2) + "line: " + pos.lineNumber + ", " + msg + this.newline;
							break;
						case 2:
							var s = assertation[3];
							var e = assertation[2];
							buf.b += "E";
							messages += this.indents(2) + Std.string(e) + this.dumpStack(s) + this.newline;
							break;
						case 3:
							var s1 = assertation[3];
							var e1 = assertation[2];
							buf.b += "S";
							messages += this.indents(2) + Std.string(e1) + this.dumpStack(s1) + this.newline;
							break;
						case 4:
							var s2 = assertation[3];
							var e2 = assertation[2];
							buf.b += "T";
							messages += this.indents(2) + Std.string(e2) + this.dumpStack(s2) + this.newline;
							break;
						case 5:
							var s3 = assertation[3];
							var missedAsyncs = assertation[2];
							buf.b += "O";
							messages += this.indents(2) + "missed async calls: " + missedAsyncs + this.dumpStack(s3) + this.newline;
							break;
						case 6:
							var s4 = assertation[3];
							var e3 = assertation[2];
							buf.b += "A";
							messages += this.indents(2) + Std.string(e3) + this.dumpStack(s4) + this.newline;
							break;
						case 7:
							var msg1 = assertation[2];
							buf.b += "W";
							messages += this.indents(2) + msg1 + this.newline;
							break;
						}
					}
					buf.b += Std.string(this.newline);
					if(messages == null) buf.b += "null"; else buf.b += "" + messages;
				}
			}
		}
		return buf.b;
	}
	,complete: function(result) {
		this.result = result;
		this.handler(this);
		if(typeof process != "undefined") process.exit(result.stats.isOk?0:1);
		if(typeof phantom != "undefined") phantom.exit(result.stats.isOk?0:1);
	}
	,__class__: utest_ui_text_PlainTextReport
};
var utest_ui_text_PrintReport = function(runner) {
	utest_ui_text_PlainTextReport.call(this,runner,$bind(this,this._handler));
	this.newline = "\n";
	this.indent = "  ";
};
utest_ui_text_PrintReport.__name__ = ["utest","ui","text","PrintReport"];
utest_ui_text_PrintReport.__super__ = utest_ui_text_PlainTextReport;
utest_ui_text_PrintReport.prototype = $extend(utest_ui_text_PlainTextReport.prototype,{
	_handler: function(report) {
		this._trace(report.getResults());
	}
	,_trace: function(s) {
		s = StringTools.replace(s,"  ",this.indent);
		s = StringTools.replace(s,"\n",this.newline);
		haxe_Log.trace(s,{ fileName : "PrintReport.hx", lineNumber : 57, className : "utest.ui.text.PrintReport", methodName : "_trace"});
	}
	,__class__: utest_ui_text_PrintReport
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = $global.DataView || js_html_compat_DataView;
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
AudioManager.AUDIO_CONTEXT = "this.audioContext";
Waud.PROBABLY = "probably";
Waud.MAYBE = "maybe";
Waud.version = "0.8.0";
Waud.useWebAudio = true;
Waud.defaults = { autoplay : false, autostop : true, loop : false, preload : true, webaudio : true, volume : 1, playbackRate : 1};
Waud.preferredSampleRate = 44100;
Waud.isMuted = false;
Waud._playbackRate = 1;
WaudFocusManager.FOCUS_STATE = "focus";
WaudFocusManager.BLUR_STATE = "blur";
WaudFocusManager.ON_FOCUS = "onfocus";
WaudFocusManager.ON_BLUR = "onblur";
WaudFocusManager.PAGE_SHOW = "pageshow";
WaudFocusManager.PAGE_HIDE = "pagehide";
WaudFocusManager.WINDOW = "window";
WaudFocusManager.DOCUMENT = "document";
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
utest_TestHandler.POLLING_TIME = 10;
utest_ui_text_HtmlReport.platform = "javascript";
Test.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports, typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
