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

	/**
	* Function to set default audio options.
	*
	* @static
	* @method setDefaultOptions
	* @return {WaudSoundOptions}
	* @example
	*     Waud.setDefaultOptions(options);
	*/
	public static function setDefaultOptions(options:WaudSoundOptions):WaudSoundOptions {
		if (options == null) options = {};
		options.autoplay = (options.autoplay != null) ? options.autoplay : Waud.defaults.autoplay;
		options.autostop = (options.autostop != null) ? options.autostop : Waud.defaults.autostop;
		options.webaudio = (options.webaudio != null) ? options.webaudio : Waud.defaults.webaudio;
		options.preload = (options.preload != null) ? options.preload : Waud.defaults.preload;
		options.loop = (options.loop != null) ? options.loop : Waud.defaults.loop;
		options.onload = (options.onload != null) ? options.onload : Waud.defaults.onload;
		options.onend = (options.onend != null) ? options.onend : Waud.defaults.onend;
		options.onerror = (options.onerror != null) ? options.onerror : Waud.defaults.onerror;
		if (options.volume == null || options.volume < 0 || options.volume > 1) options.volume = Waud.defaults.volume;
		if (options.playbackRate == null || options.playbackRate <= 0 || options.playbackRate >= 4) options.playbackRate = Waud.defaults.playbackRate;
		return options;
	}
}