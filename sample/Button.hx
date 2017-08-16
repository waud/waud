import pixi.interaction.EventTarget;
import pixi.core.graphics.Graphics;
import pixi.core.math.shapes.Rectangle;
import pixi.core.text.Text;
import pixi.core.display.Container;
import msignal.Signal.Signal1;

class Button extends Container {

	public static inline var OVER_COLOUR:Int = 0xDF7401;
	public static inline var OUT_COLOUR:Int = 0x2E64FE;
	public static inline var TEXT_COLOUR:String = "#FFFFFF";
	public static inline var FONT_SIZE:Int = 12;

	var _data:Dynamic;
	var _label:Text;
	var _rect:Rectangle;
	var _background:Graphics;

	var _enabled:Bool;

	public var action:Signal1<Dynamic>;

	public function new(label:String, width:Float, height:Float, ?data:Dynamic, ?fontSize:Int) {
		super();
		action = new Signal1(Dynamic);
		_data = data;
		_setupBackground(width, height);
		_setupLabel(width, height, fontSize);
		setText(label);
	}

	function _setupBackground(width:Float, height:Float) {
		_rect = new Rectangle(0, 0, width, height);
		_background = new Graphics();
		_background.interactive = true;
		_redraw(OUT_COLOUR);
		addChild(_background);

		_background.interactive = true;
		_background.on("mouseover", _onMouseOver);
		_background.on("mouseout", _onMouseOut);
		_background.on("mousedown", _onMouseDown);
		_background.on("mouseup", _onMouseUp);
		_background.on("mouseupoutside", _onMouseUpOutside);
		_background.on("touchstart", _onTouchStart);
		_background.on("touchend", _onTouchEnd);
		_background.on("touchendoutside", _onTouchEndOutside);
	}

	function _setupLabel(width:Float, height:Float, fontSize:Int) {
		var size:Int = (fontSize != null) ? fontSize : FONT_SIZE;
		var style:TextStyle = {};
		style.font = (size) + "px Arial";
		style.fill = TEXT_COLOUR;
		_label = new Text("", style);
		_label.anchor.set(0.5);
		_label.x = width / 2;
		_label.y = height / 2;
		addChild(_label);
	}

	function _redraw(colour:Int) {
		var border:Float = 1;
		_background.clear();
		_background.beginFill(0x003366);
		_background.drawRect(_rect.x, _rect.y, _rect.width, _rect.height);
		_background.endFill();
		_background.beginFill(colour);
		_background.drawRect(_rect.x + border / 2, _rect.y + border / 2, _rect.width - border, _rect.height - border);
		_background.endFill();
	}

	public inline function setText(label:String) {
		_label.text = label;
	}

	function _onMouseDown(target:EventTarget) {
		if (_enabled) _redraw(OVER_COLOUR);
	}

	function _onMouseUp(target:EventTarget) {
		if (_enabled) {
			action.dispatch(_data);
			_redraw(OUT_COLOUR);
		}
	}

	function _onMouseUpOutside(target:EventTarget) {
		if (_enabled) _redraw(OUT_COLOUR);
	}

	function _onMouseOver(target:EventTarget) {
		if (_enabled) _redraw(OVER_COLOUR);
	}

	function _onMouseOut(target:EventTarget) {
		if (_enabled) _redraw(OUT_COLOUR);
	}

	function _onTouchEndOutside(target:EventTarget) {
		if (_enabled) _redraw(OUT_COLOUR);
	}

	function _onTouchEnd(target:EventTarget) {
		if (_enabled) {
			_redraw(OUT_COLOUR);
			action.dispatch(_data);
		}
	}

	function _onTouchStart(target:EventTarget) {
		if (_enabled) _redraw(OVER_COLOUR);
	}

	public inline function enable() {
		_enabled = true;
	}

	public function disable() {
		_redraw(OUT_COLOUR);
		_enabled = false;
	}
}