import haxe.Json;
import js.html.XMLHttpRequest;

@:expose @:keep class WaudBase64Pack {

	static inline var JSON_PER:Float = 0.8;

	public var progress:Float;

	public var options:WaudSoundOptions;

	var _sounds:Map<String, IWaudSound>;
	var _options:WaudSoundOptions;
	var _onLoaded:Map<String, IWaudSound> -> Void;
	var _onError:Void -> Void;
	var _onProgress:Float -> Void;
	var _soundCount:Int;
	var _loadCount:Int;
	var _totalSize:Float;
	var _soundsToLoad:Map<String, String>;
	var _soundIds:Array<String>;
	var _sequentialLoad:Bool;

	/**
	* Class to load multiple base64 packed sounds from JSON.
	*
	* @class WaudBase64Pack
	* @constructor
	* @param {String} url - Base64 packed JSON file.
	* @param {WaudSoundOptions} [options] - Sound options.
	* @param {IWaudSound> -> Void} [onLoaded] - on load callback.
	* @param {Float -> Void} [onProgress] - on progress callback.
	* @param {Void -> Void} [onError] - on error callback.
	* @param {WaudSoundOptions} [options] - Sound options.
	* @param {Bool} [sequentialLoad] - To create and decode sounds sequentially instead of concurrently.
	* @example
	* 		var base64pack = new WaudBase64Pack("assets/sounds.json", _onLoad, _onProgress, _onError);
	*
	* 		function _onLoad(snds:Map<String, IWaudSound>) {
	* 			snds.get("assets/beep.mp3").play();
	* 		}
	*
	* 		function _onProgress(val:Float, loaded:Float) {
	* 			trace("loaded %: " + (val * 100));
	* 		}
	*
	* 		function _onError() {
	* 			trace("error loading base64 json file");
	* 		}
	*/
	public function new(url:String,
						?onLoaded:Map<String, IWaudSound> -> Void,
						?onProgress:Float -> Void,
						?onError:Void -> Void,
						?options:WaudSoundOptions = null,
						?sequentialLoad:Bool = false) {
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}

		_sequentialLoad = sequentialLoad;
		if (url.indexOf(".json") > 0) {
			progress = 0;
			_options = WaudUtils.setDefaultOptions(options);
			_totalSize = 0;
			_soundCount = 0;
			_loadCount = 0;
			_onLoaded = onLoaded;
			_onProgress = onProgress;
			_onError = onError;
			_sounds = new Map();
			_loadBase64Json(url);
		}
	}

	/**
	* Function to load Base64 JSON.
	*
	* @private
	* @method _loadBase64Json
	* @param {String} url - Base64 JSON path.
	*/
	function _loadBase64Json(base64Url:String) {
		var m:EReg = ~/"meta":.[0-9]*,[0-9]*./i;
		var xobj = new XMLHttpRequest();
		xobj.open("GET", base64Url, true);

		if (_onProgress != null) {
			xobj.onprogress = function(e:Dynamic) {
				var meta = m.match(xobj.responseText);
				if (meta && _totalSize == 0) {
					var metaInfo = Json.parse("{" + m.matched(0) + "}");
					_totalSize = metaInfo.meta[1];
				}
				progress = e.lengthComputable ? e.loaded / e.total : e.loaded / _totalSize;
				if (progress > 1) progress = 1;
				_onProgress(JSON_PER * progress);
			};
		}

		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == 200) {
				var res = Json.parse(xobj.responseText);
				_soundsToLoad = new Map();
				_soundIds = [];
				for (n in Reflect.fields(res)) {
					if (n == "meta") continue;
					if (Std.is(res, Array)) {
						_soundIds.push(Reflect.field(res, n).name);
						_soundsToLoad.set(Reflect.field(res, n).name, "data:" + Reflect.field(res, n).mime + ";base64," + Reflect.field(res, n).data);
					}
					else {
						_soundIds.push(n);
						_soundsToLoad.set(n, Reflect.field(res, n));
					}
				}
				_soundCount = _soundIds.length;

				if (!_sequentialLoad) {
					while (_soundIds.length > 0) _createSound(_soundIds.shift());
				}
				else _createSound(_soundIds.shift());
			}
		};
		xobj.send(null);
	}

	/**
	* Function to create base64 sound.
	*
	* @private
	* @method _createSound
	* @param {String} id - sound id.
	*/
	function _createSound(id:String) {
		new WaudSound(_soundsToLoad.get(id), {
			onload:function(s:IWaudSound) {
				_sounds.set(id, s);
				Waud.sounds.set(id, s);
				if (_options.onload != null) _options.onload(s);
				_checkProgress();
			},
			onerror:function(s:IWaudSound) {
				_sounds.set(id, null);
				if (_options.onerror != null) _options.onerror(s);
				if (_checkProgress() && _onError != null) _onError();
			},
			autoplay:_options.autoplay,
			autostop:_options.autostop,
			loop:_options.loop,
			onend:_options.onend,
			playbackRate:_options.playbackRate,
			preload:_options.preload,
			volume:_options.volume,
			webaudio:_options.webaudio
		});
	}

	function _checkProgress():Bool {
		_loadCount++;
		if (_onProgress != null) _onProgress(JSON_PER + (1 - JSON_PER) * (_loadCount / _soundCount));
		if (_loadCount == _soundCount) {
			_soundsToLoad = null;
			if (_onLoaded != null) _onLoaded(_sounds);
			return true;
		}
		else if (_sequentialLoad) _createSound(_soundIds.shift());
		return false;
	}
}