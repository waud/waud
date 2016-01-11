import js.Browser;

/**
* Utility functions
*
* @class WaudUtils
*/
@:expose @:keep class WaudUtils {

	public static var ua:String = Browser.navigator.userAgent;

	public static function isAndroid():Bool {
		return ~/Android/i.match(ua);
	}

	public static function isiOS():Bool {
		return ~/(iPad|iPhone|iPod)/i.match(ua);
	}

	public static function isWindowsPhone():Bool {
		return ~/(IEMobile|Windows Phone)/i.match(ua);
	}

	public static function isFirefox():Bool {
		return ~/Firefox/i.match(ua);
	}

	public static function isOpera():Bool {
		return ~/Opera/i.match(ua) || Reflect.field(Browser.window, "opera") != null;
	}

	public static function isChrome():Bool{
		return ~/Chrome/i.match(ua);
	}

	public static function isSafari():Bool{
		return ~/Safari/i.match(ua);
	}

	public static function isMobile():Bool {
		return ~/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile)/i.match(ua);
	}

	public static function getiOSVersion():Array<Int> {
		var v:EReg = ~/[0-9_]+?[0-9_]+?[0-9_]+/i;
		var matched:Array<Int> = [];
		if (v.match(ua)) {
			var match:Array<String> = v.matched(0).split("_");
			matched = [for (i in match) Std.parseInt(i)];
		}
		return matched;
	}
}