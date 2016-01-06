import js.Browser;

class FocusManager {

	public static function addEvents(focus:Void -> Void, blur:Void -> Void) {
		if (Reflect.field(Browser.window, "addEventListener") != null) {
			untyped __js__("window").addEventListener("focus", focus);
			untyped __js__("window").addEventListener("blur", blur);
		}
		else if (Reflect.field(Browser.window, "attachEvent") != null) { //IE
			untyped __js__("window").attachEvent("onfocus", focus);
			untyped __js__("window").attachEvent("onblur", blur);
		}
		else {
			Browser.window.onload = function () {
				Browser.window.onfocus = focus;
				Browser.window.onblur = blur;
			};
		}
	}

	public static function removeEvents(focus:Void -> Void, blur:Void -> Void) {
		if (Reflect.field(Browser.window, "removeEventListener") != null) {
			untyped __js__("window").removeEventListener("focus", focus);
			untyped __js__("window").removeEventListener("blur", blur);
		}
		else if (Reflect.field(Browser.window, "removeEvent") != null) { //IE
			untyped __js__("window").removeEvent("onfocus", focus);
			untyped __js__("window").removeEvent("onblur", blur);
		}
		else {
			Browser.window.onfocus = null;
			Browser.window.onblur = null;
		}
	}
}