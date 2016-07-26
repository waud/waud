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
		var xobj = new XMLHttpRequest();
		xobj.open("GET", base64Url, true);

		if (_onProgress != null) {
			xobj.onprogress = function(e:Dynamic) {
				if (e.loaded != null && e.total != null) _onProgress((e.loaded / e.total) * 100);
			};
		}

		xobj.onreadystatechange = function() {
			if (xobj.readyState == 4 && xobj.status == 200) {
				var res = Json.parse(xobj.responseText);
				for (n in Reflect.fields(res)) {
					_soundCount++;
					_createSound(n, Reflect.field(res, n));
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
				_loadCount++;
				_sounds.set(id, s);
				Waud.sounds.set(id, s);
				if (_loadCount == _soundCount && _onLoaded != null) _onLoaded(_sounds);
			},
			onerror:function(s:IWaudSound) {
				_loadCount++;
				_sounds.set(id, null);
				if (_loadCount == _soundCount && _onLoaded != null) {
					_onLoaded(_sounds);
					if (_onError != null) _onError();
				}
			}
		});
	}
}