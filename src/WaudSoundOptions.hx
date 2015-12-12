typedef WaudSoundOptions = {
	@:optional var autoplay:Bool;
	@:optional var loop:Bool;
	@:optional var onload:Dynamic -> Void;
	@:optional var onend:Dynamic -> Void;
	@:optional var onerror:Dynamic -> Void;
	@:optional var preload:Dynamic;
	@:optional var volume:Float;
}