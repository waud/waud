/**
 * Sound Interface.
 *
 * @interface IWaudSound
 */
interface IWaudSound {
	var url:String;
	var isSpriteSound:Bool;
	function load(?callback:IWaudSound -> Void):IWaudSound;
	function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):IWaudSound;
	function stop():Void;
	function onEnd(callback:IWaudSound -> Void):IWaudSound;
	function onLoad(callback:IWaudSound -> Void):IWaudSound;
	function onError(callback:IWaudSound -> Void):IWaudSound;
	function mute(val:Bool):Void;
	function loop(val:Bool):Void;
	function setVolume(val:Float):Void;
	function getVolume():Float;
	function isPlaying():Bool;
	function destroy():Void;
}