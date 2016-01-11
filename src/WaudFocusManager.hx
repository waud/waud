import js.Browser;

@:expose @:keep class WaudFocusManager {

	static inline var FOCUS_STATE:String = "focus";
	static inline var BLUR_STATE:String = "blur";

	public var focus:Void -> Void;
	public var blur:Void -> Void;

	var _hidden:String;
	var _visibilityChange:String;
	var _currentState:String;

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
			untyped __js__("window").addEventListener("focus", _focus);
			untyped __js__("window").addEventListener("blur", _blur);
			untyped __js__("window").addEventListener("pageshow", _focus);
			untyped __js__("window").addEventListener("pagehide", _blur);
			untyped __js__("document").addEventListener(_visibilityChange, _handleVisibilityChange);
		}
		else if (Reflect.field(Browser.window, "attachEvent") != null) {
			untyped __js__("window").attachEvent("onfocus", _focus);
			untyped __js__("window").attachEvent("onblur", _blur);
			untyped __js__("window").attachEvent("pageshow", _focus);
			untyped __js__("window").attachEvent("pagehide", _blur);
			untyped __js__("document").attachEvent(_visibilityChange, _handleVisibilityChange);
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

	function _handleVisibilityChange() {
		if (Reflect.field(Browser.document, _hidden) != null && Reflect.field(Browser.document, _hidden)) blur();
		else focus();
	}

	function _focus() {
		if (_currentState != FOCUS_STATE && focus != null) focus();
		_currentState = FOCUS_STATE;
	}

	function _blur() {
		if (_currentState != BLUR_STATE && blur != null) blur();
		_currentState = BLUR_STATE;
	}

	public function clearEvents() {
		if (Reflect.field(Browser.window, "removeEventListener") != null) {
			untyped __js__("window").removeEventListener("focus", _focus);
			untyped __js__("window").removeEventListener("blur", _blur);
			untyped __js__("window").removeEventListener("pageshow", _focus);
			untyped __js__("window").removeEventListener("pagehide", _blur);
			untyped __js__("window").removeEventListener(_visibilityChange, _handleVisibilityChange);
		}
		else if (Reflect.field(Browser.window, "removeEvent") != null) {
			untyped __js__("window").removeEvent("onfocus", _focus);
			untyped __js__("window").removeEvent("onblur", _blur);
			untyped __js__("window").removeEvent("pageshow", _focus);
			untyped __js__("window").removeEvent("pagehide", _blur);
			untyped __js__("window").removeEvent(_visibilityChange, _handleVisibilityChange);
		}
		else {
			Browser.window.onfocus = null;
			Browser.window.onblur = null;
			Browser.window.onpageshow = null;
			Browser.window.onpagehide = null;
		}
	}
}