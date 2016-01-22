import js.Browser;

/**
* Collection of Browser Utility Functions.
*
* @class WaudUtils
*/
@:expose @:keep class WaudUtils {

	/**
	* Function to check if the device is **Android** or not.
	*
	* @static
	* @method isAndroid
	* @return {Bool} true or false
	* @example
	*     Waud.isAndroid();
	*/
	public static function isAndroid(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function isiOS(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function isWindowsPhone(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function isFirefox(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
		return ~/Firefox/i.match(ua);
	}

	/**
	* Function to check if the device is **Opera** or not.
	*
	* @static
	* @method isOpera
	* @return {Bool} true or false
	* @example
	*     Waud.isOpera();
	*/
	public static function isOpera(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function isChrome(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function isSafari(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function isMobile(?ua:String):Bool {
		if (ua == null) ua = Browser.navigator.userAgent;
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
	public static function getiOSVersion(?ua:String):Array<Int> {
		if (ua == null) ua = Browser.navigator.userAgent;
		var v:EReg = ~/[0-9_]+?[0-9_]+?[0-9_]+/i;
		var matched:Array<Int> = [];
		if (v.match(ua)) {
			var match:Array<String> = v.matched(0).split("_");
			matched = [for (i in match) Std.parseInt(i)];
		}
		return matched;
	}
}