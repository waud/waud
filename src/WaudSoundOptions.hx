typedef WaudSoundOptions = {
	@:optional var autoplay:Bool;
	@:optional var loop:Bool;
	@:optional var onload:IWaudSound -> Void;
	@:optional var onend:IWaudSound -> Void;
	@:optional var onerror:IWaudSound -> Void;
	@:optional var preload:Dynamic;
	@:optional var volume:Float;
}