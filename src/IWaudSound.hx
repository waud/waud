/**
 * Sound Interface.
 *
 * @interface IWaudSound
 */
interface IWaudSound {
	var url:String;
	var isSpriteSound:Bool;
	var duration(get, null):Float;
	function load(?callback:IWaudSound -> Void):IWaudSound;
	function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):Int;
	function togglePlay():Void;
	function stop():Void;
	function pause():Void;
	function setTime(time:Float):Void;
	function getTime():Float;
	function onEnd(callback:IWaudSound -> Void):IWaudSound;
	function onLoad(callback:IWaudSound -> Void):IWaudSound;
	function onError(callback:IWaudSound -> Void):IWaudSound;
	function mute(val:Bool):Void;
	function toggleMute():Void;
	function loop(val:Bool):Void;
	function setVolume(val:Float):Void;
	function getVolume():Float;
	function isPlaying():Bool;
	function destroy():Void;
}