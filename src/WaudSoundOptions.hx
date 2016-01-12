/**
* Sound Options.
*
* @class WaudSoundOptions
*/
typedef WaudSoundOptions = {
	/**
	* Auto play sound.
	* @property autoplay
	* @type {Bool}
	* @default false
	*/
	@:optional var autoplay:Bool;

	/**
	* Loop sound.
	* @property loop
	* @type {Bool}
	* @default false
	*/
	@:optional var loop:Bool;

	/**
	* Sound volume between 0 and 1.
	* @property volume
	* @type {Float}
	* @default 1
	*/
	@:optional var volume:Float;

	/**
	* Callback function when the sound is loaded with sound instance as parameter.
	* @property onload
	* @type {Function}
	* @default null
	*/
	@:optional var onload:IWaudSound -> Void;

	/**
	* Callback function when the sound playback ends with sound instance as parameter.
	* @property onend
	* @type {Function}
	* @default null
	*/
	@:optional var onend:IWaudSound -> Void;

	/**
	* Callback function when there is an error in loading/decoding with sound instance as parameter.
	* @property onerror
	* @type {Function}
	* @default null
	*/
	@:optional var onerror:IWaudSound -> Void;

	@:optional var preload:Dynamic;
}