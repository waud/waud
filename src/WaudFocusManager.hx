import js.Browser;

@:expose @:keep class WaudFocusManager {

	static inline var FOCUS_STATE:String = "focus";
	static inline var BLUR_STATE:String = "blur";
	static inline var ON_FOCUS:String = "onfocus";
	static inline var ON_BLUR:String = "onblur";
	static inline var PAGE_SHOW:String = "pageshow";
	static inline var PAGE_HIDE:String = "pagehide";
	static inline var WINDOW:String = "window";
	static inline var DOCUMENT:String = "document";

	/**
	* Focus callback function.
	*
	* @property focus
	* @type {Function}
	* @example
 	*     fm.focus = onFocus;
	*/
	public var focus:Void -> Void;

	/**
	* Blur callback function.
	*
	* @property blur
	* @type {Function}
	* @example
 	*     fm.blur = onBlur;
	*/
	public var blur:Void -> Void;

	var _hidden:String;
	var _visibilityChange:String;
	var _currentState:String;

	/**
	* Cross-browser utility class used to mute/unmute audio on focus on/off events. Used when **Waud.autoMute()** is called.
	*
	* This can also be used as a standalone utility class to handle focus on/off events.
	*
	* @class WaudFocusManager
	* @constructor
	* @example
	* 		var fm = new WaudFocusManager();
	* 		fm.focus = onFocus;
	* 		fm.blur = onBlur;
	*/
	public function new() {
		_hidden = "";
		_visibilityChange = "";
		_currentState = "";

		if (Reflect.field(Browser.document, "hidden") != null) {
			_hidden = "hidden";
			_visibilityChange = "visibilitychange";
		}
		else if (Reflect.field(Browser.document, "mozHidden") != null) {
			_hidden = "mozHidden";
			_visibilityChange = "mozvisibilitychange";
		}
		else if (Reflect.field(Browser.document, "msHidden") != null) {
			_hidden = "msHidden";
			_visibilityChange = "msvisibilitychange";
		}
		else if (Reflect.field(Browser.document, "webkitHidden") != null) {
			_hidden = "webkitHidden";
			_visibilityChange = "webkitvisibilitychange";
		}

		if (Reflect.field(Browser.window, "addEventListener") != null) {
			untyped __js__(WINDOW).addEventListener(FOCUS_STATE, _focus);
			untyped __js__(WINDOW).addEventListener(BLUR_STATE, _blur);
			untyped __js__(WINDOW).addEventListener(PAGE_SHOW, _focus);
			untyped __js__(WINDOW).addEventListener(PAGE_HIDE, _blur);
			untyped __js__(DOCUMENT).addEventListener(_visibilityChange, _handleVisibilityChange);
		}
		else if (Reflect.field(Browser.window, "attachEvent") != null) {
			untyped __js__(WINDOW).attachEvent(ON_FOCUS, _focus);
			untyped __js__(WINDOW).attachEvent(ON_BLUR, _blur);
			untyped __js__(WINDOW).attachEvent(PAGE_SHOW, _focus);
			untyped __js__(WINDOW).attachEvent(PAGE_HIDE, _blur);
			untyped __js__(DOCUMENT).attachEvent(_visibilityChange, _handleVisibilityChange);
		}
		else {
			Browser.window.onload = function () {
				Browser.window.onfocus = _focus;
				Browser.window.onblur = _blur;
				Browser.window.onpageshow = _focus;
				Browser.window.onpagehide = _blur;
			};
		}
	}

	/**
	* Function to handle visibility change event.
	*
	* @private
	* @method _handleVisibilityChange
	*/
	function _handleVisibilityChange() {
		if (Reflect.field(Browser.document, _hidden) != null && Reflect.field(Browser.document, _hidden) && blur != null) blur();
		else if (focus != null) focus();
	}

	/**
	* Function to trigger focus callback.
	*
	* @private
	* @method _focus
	*/
	function _focus() {
		if (_currentState != FOCUS_STATE && focus != null) focus();
		_currentState = FOCUS_STATE;
	}

	/**
	* Function to trigger blur callback.
	*
	* @private
	* @method _blur
	*/
	function _blur() {
		if (_currentState != BLUR_STATE && blur != null) blur();
		_currentState = BLUR_STATE;
	}

	/**
	* Function to clear focus manager events.
	*
	* @method clearEvents
	* @example
	*     fm.clearEvents();
	*/
	public function clearEvents() {
		if (Reflect.field(Browser.window, "removeEventListener") != null) {
			untyped __js__(WINDOW).removeEventListener(FOCUS_STATE, _focus);
			untyped __js__(WINDOW).removeEventListener(BLUR_STATE, _blur);
			untyped __js__(WINDOW).removeEventListener(PAGE_SHOW, _focus);
			untyped __js__(WINDOW).removeEventListener(PAGE_HIDE, _blur);
			untyped __js__(WINDOW).removeEventListener(_visibilityChange, _handleVisibilityChange);
		}
		else if (Reflect.field(Browser.window, "removeEvent") != null) {
			untyped __js__(WINDOW).removeEvent(ON_FOCUS, _focus);
			untyped __js__(WINDOW).removeEvent(ON_BLUR, _blur);
			untyped __js__(WINDOW).removeEvent(PAGE_SHOW, _focus);
			untyped __js__(WINDOW).removeEvent(PAGE_HIDE, _blur);
			untyped __js__(WINDOW).removeEvent(_visibilityChange, _handleVisibilityChange);
		}
		else {
			Browser.window.onfocus = null;
			Browser.window.onblur = null;
			Browser.window.onpageshow = null;
			Browser.window.onpagehide = null;
		}
	}
}