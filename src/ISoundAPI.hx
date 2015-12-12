package ;

interface ISoundAPI {
	function play(?loop:Bool = false):Void;
	function stop():Void;
	function setVolume(val:Float):Void;
	function getVolume():Float;
}