import js.Browser;

class Utils {

	public static function isAndroid():Bool {
		return ~/Android/i.match(Browser.navigator.userAgent);
	}

	public static function isiOS():Bool {
		return ~/(iPad|iPhone|iPod)/i.match(Browser.navigator.userAgent);
	}

	public static function getiOSVersion():Array<Int> {
		var v:EReg = ~/[0-9_]+?[0-9_]+?[0-9_]+/i;
		var matched:Array<Int> = [];
		if (v.match(Browser.navigator.userAgent)) {
			var match:Array<String> = v.matched(0).split("_");
			matched = [for (i in match) Std.parseInt(i)];
		}
		return matched;
	}

	public static function isMobile():Bool {
		var ua = Browser.navigator.userAgent;
		return (~/Android/i.match(ua) || ~/webOS/i.match(ua)
		|| ~/iPhone/i.match(ua) || ~/iPad/i.match(ua) || ~/iPod/i.match(ua)
		|| ~/BlackBerry/i.match(ua) || ~/Windows Phone/i.match(ua));
	}

	public static function isChrome():Bool{
		return Browser.navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
	}
}