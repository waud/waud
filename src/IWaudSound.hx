interface IWaudSound {
	function play(?spriteName:String, ?soundProps:AudioSpriteSoundProperties):Void;
	function stop():Void;
	function mute(val:Bool):Void;
	function loop(val:Bool):Void;
	function setVolume(val:Float):Void;
	function getVolume():Float;
	function isPlaying():Bool;
}