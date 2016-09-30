/**
 * Sound Interface.
 *
 * @interface IWaudSound
 */
interface IWaudSound {
	var url:String;
	var isSpriteSound:Bool;
	var spriteName:String;
	var rate:Float;
	function load(?callback:IWaudSound -> Void):IWaudSound;
	function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):Int;
	function togglePlay(?spriteName:String):Void;
	function stop(?spriteName:String):Void;
	function pause(?spriteName:String):Void;
	function playbackRate(?val:Float, ?spriteName:String):Float;
	function setTime(time:Float):Void;
	function getTime():Float;
	function getDuration():Float;
	function onEnd(callback:IWaudSound -> Void, ?spriteName:String):IWaudSound;
	function onLoad(callback:IWaudSound -> Void):IWaudSound;
	function onError(callback:IWaudSound -> Void):IWaudSound;
	function mute(val:Bool, ?spriteName:String):Void;
	function toggleMute(?spriteName:String):Void;
	function loop(val:Bool):Void;
	function setVolume(val:Float, ?spriteName:String):Void;
	function getVolume(?spriteName:String):Float;
	function isPlaying(?spriteName:String):Bool;
	function autoStop(val:Bool):Void;
	function isReady():Bool;
	function destroy():Void;
}