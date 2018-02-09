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
	var _dom:Dynamic;

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
	public function new(?dom:Dynamic) {
		_hidden = "";
		_visibilityChange = "";
		_currentState = "";

		if (dom == null) dom = Browser.document;
		_dom = dom;

		if (_dom.hidden != null) {
			_hidden = "hidden";
			_visibilityChange = "visibilitychange";
		}
		else if (_dom.mozHidden != null) {
			_hidden = "mozHidden";
			_visibilityChange = "mozvisibilitychange";
		}
		else if (_dom.msHidden != null) {
			_hidden = "msHidden";
			_visibilityChange = "msvisibilitychange";
		}
		else if (_dom.webkitHidden != null) {
			_hidden = "webkitHidden";
			_visibilityChange = "webkitvisibilitychange";
		}

		if (_dom.addEventListener != null) {
			_dom.addEventListener(FOCUS_STATE, _focus);
			_dom.addEventListener(BLUR_STATE, _blur);
			_dom.addEventListener(PAGE_SHOW, _focus);
			_dom.addEventListener(PAGE_HIDE, _blur);
			_dom.addEventListener(_visibilityChange, _handleVisibilityChange);
		}
		else if (_dom.attachEvent != null) {
			_dom.attachEvent(ON_FOCUS, _focus);
			_dom.attachEvent(ON_BLUR, _blur);
			_dom.attachEvent(PAGE_SHOW, _focus);
			_dom.attachEvent(PAGE_HIDE, _blur);
			_dom.attachEvent(_visibilityChange, _handleVisibilityChange);
		}
		else {
			_dom.onload = function () {
				_dom.onfocus = _focus;
				_dom.onblur = _blur;
				_dom.onpageshow = _focus;
				_dom.onpagehide = _blur;
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
		if (Reflect.field(_dom, _hidden) != null && Reflect.field(_dom, _hidden) && blur != null) blur();
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
		if (_dom.removeEventListener != null) {
			_dom.removeEventListener(FOCUS_STATE, _focus);
			_dom.removeEventListener(BLUR_STATE, _blur);
			_dom.removeEventListener(PAGE_SHOW, _focus);
			_dom.removeEventListener(PAGE_HIDE, _blur);
			_dom.removeEventListener(_visibilityChange, _handleVisibilityChange);
		}
		else if (_dom.removeEvent != null) {
			_dom.removeEvent(ON_FOCUS, _focus);
			_dom.removeEvent(ON_BLUR, _blur);
			_dom.removeEvent(PAGE_SHOW, _focus);
			_dom.removeEvent(PAGE_HIDE, _blur);
			_dom.removeEvent(_visibilityChange, _handleVisibilityChange);
		}
		else {
			_dom.onfocus = null;
			_dom.onblur = null;
			_dom.onpageshow = null;
			_dom.onpagehide = null;
		}
	}
}