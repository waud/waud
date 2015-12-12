typedef WaudSoundOptions = {
	@:optional var autoplay:Bool;
	@:optional var loop:Bool;
	@:optional var onload:ISound -> Void;
	@:optional var onend:ISound -> Void;
	@:optional var onerror:ISound -> Void;
	@:optional var preload:Dynamic;
	@:optional var volume:Float;
}