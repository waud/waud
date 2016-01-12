import js.Browser;

/**
* Collection of Browser Utility Functions.
*
* @class WaudUtils
*/
@:expose @:keep class WaudUtils {

	/**
	* User Agrent String.
	*
	* @static
	* @property ua
	* @example
	*     WaudUtils.ua;
	*/
	public static var ua:String = Browser.navigator.userAgent;

	/**
	* Function to check if the device is **Android** or not.
	*
	* @static
	* @method isAndroid
	* @return {Bool} true or false
	* @example
	*     Waud.isAndroid();
	*/
	public static function isAndroid():Bool {
		return ~/Android/i.match(ua);
	}

	/**
	* Function to check if the device is **iOS** or not.
	*
	* @static
	* @method isiOS
	* @return {Bool} true or false
	* @example
	*     Waud.isiOS();
	*/
	public static function isiOS():Bool {
		return ~/(iPad|iPhone|iPod)/i.match(ua);
	}

	/**
	* Function to check if the device is **Windows Phone** or not.
	*
	* @static
	* @method isWindowsPhone
	* @return {Bool} true or false
	* @example
	*     Waud.isWindowsPhone();
	*/
	public static function isWindowsPhone():Bool {
		return ~/(IEMobile|Windows Phone)/i.match(ua);
	}

	/**
	* Function to check if the device is **Firefox** or not.
	*
	* @static
	* @method isFirefox
	* @return {Bool} true or false
	* @example
	*     Waud.isFirefox();
	*/
	public static function isFirefox():Bool {
		return ~/Firefox/i.match(ua);
	}

	/**
	* Function to check if the device is **Opera** or not.
	*
	* @static
	* @method isiOS
	* @return {Bool} true or false
	* @example
	*     Waud.isiOS();
	*/
	public static function isOpera():Bool {
		return ~/Opera/i.match(ua) || Reflect.field(Browser.window, "opera") != null;
	}

	/**
	* Function to check if the device is **Chrome** or not.
	*
	* @static
	* @method isChrome
	* @return {Bool} true or false
	* @example
	*     Waud.isChrome();
	*/
	public static function isChrome():Bool {
		return ~/Chrome/i.match(ua);
	}

	/**
	* Function to check if the device is **Safari** or not.
	*
	* @static
	* @method isSafari
	* @return {Bool} true or false
	* @example
	*     Waud.isSafari();
	*/
	public static function isSafari():Bool {
		return ~/Safari/i.match(ua);
	}

	/**
	* Function to check if the device is **mobile** or not.
	*
	* @static
	* @method isMobile
	* @return {Bool} true or false
	* @example
	*     Waud.isMobile();
	*/
	public static function isMobile():Bool {
		return ~/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone|IEMobile)/i.match(ua);
	}

	/**
	* Function to get the **iOS** version.
	*
	* @static
	* @method getiOSVersion
	* @return {Array<Int>} [9,0,1]
	* @example
	*     Waud.getiOSVersion();
	*/
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