interface ISound {
	function play(?loop:Bool = false):Void;
	function stop():Void;
	function mute(val:Bool):Void;
	function loop(val:Bool):Void;
	function setVolume(val:Float):Void;
	function getVolume():Float;
}