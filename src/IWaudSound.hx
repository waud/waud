/**
 * Sound Interface.
 *
 * @interface IWaudSound
 */
interface IWaudSound {
	var url:String;
	var isSpriteSound:Bool;
	var duration(get, null):Float;
	var spriteName:String;
	function load(?callback:IWaudSound -> Void):IWaudSound;
	function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):Int;
	function togglePlay(?spriteName:String):Void;
	function stop(?spriteName:String):Void;
	function pause(?spriteName:String):Void;
	function setTime(time:Float):Void;
	function getTime():Float;
	function onEnd(callback:IWaudSound -> Void, ?spriteName:String):IWaudSound;
	function onLoad(callback:IWaudSound -> Void):IWaudSound;
	function onError(callback:IWaudSound -> Void):IWaudSound;
	function mute(val:Bool, ?spriteName:String):Void;
	function toggleMute(?spriteName:String):Void;
	function loop(val:Bool):Void;
	function setVolume(val:Float, ?spriteName:String):Void;
	function getVolume(?spriteName:String):Float;
	function isPlaying(?spriteName:String):Bool;
	function destroy():Void;
}