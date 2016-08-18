import haxe.Json;
import js.html.XMLHttpRequest;

@:expose @:keep class WaudBase64Pack {

	public var progress:Float;

	var _sounds:Map<String, IWaudSound>;
	var _onLoaded:Map<String, IWaudSound> -> Void;
	var _onError:Void -> Void;
	var _onProgress:Float -> Void;
	var _soundCount:Int;
	var _loadCount:Int;
	var _totalSize:Float;

	/**
	* Class to load multiple base64 packed sounds from JSON.
	*
	* @class WaudBase64Pack
	* @constructor
	* @param {String} url - Base64 packed JSON file.
	* @param {IWaudSound> -> Void} [onLoaded] - on load callback.
	* @param {Float -> Void} [onProgress] - on progress callback.
	* @param {Void> -> Void} [onError] - on error callback.
	* @example
	* 		var base64pack = new WaudBase64Pack("assets/sounds.json", _onLoad, _onProgress, _onError);
	*
	* 		function _onLoad(snds:Map<String, IWaudSound>) {
	* 			snds.get("assets/beep.mp3").play();
	* 		}
	*
	* 		function _onProgress(val:Float) {
	* 			trace("loaded %: " + val);
	* 		}
	*
	* 		function _onError() {
	* 			trace("error loading base64 json file");
	* 		}
	*/
	public function new(url:String, ?onLoaded:Map<String, IWaudSound> -> Void, ?onProgress:Float -> Void, ?onError:Void -> Void) {
		if (Waud.audioManager == null) {
			trace("initialise Waud using Waud.init() before loading sounds");
			return;
		}

		if (url.indexOf(".json") > 0) {
			progress = 0;
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
				progress = e.lengthComputable ? (e.loaded / e.total) * 100 : (e.loaded / _totalSize) * 100;
				if (progress > 100) progress = 100;
				 _onProgress(progress);
			};
		}

		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == 200) {
				var res = Json.parse(xobj.responseText);
				for (n in Reflect.fields(res)) {
					if (n == "meta") continue;
					_soundCount++;
					if (Std.is(res, Array)) _createSound(Reflect.field(res, n).name, "data:" + Reflect.field(res, n).mime + ";base64," + Reflect.field(res, n).data);
					else _createSound(n, Reflect.field(res, n));
				}
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
	* @param {String} dataURI - sound data uri.
	*/
	function _createSound(id:String, dataURI:String) {
		var snd = new WaudSound(dataURI, {
			onload:function(s:IWaudSound) {
				_sounds.set(id, s);
				Waud.sounds.set(id, s);
				_checkProgress();
			},
			onerror:function(s:IWaudSound) {
				_sounds.set(id, null);
				if (_checkProgress() && _onError != null) _onError();
			}
		});
	}

	function _checkProgress():Bool {
		_loadCount++;
		if (_loadCount == _soundCount) {
			if (_onLoaded != null) _onLoaded(_sounds);
			if (progress == 0 && _onProgress != null) {
				progress = 100;
				_onProgress(progress);
			}
			return true;
		}
		return false;
	}
}