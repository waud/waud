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
	* Auto stop sound when `play` method is called on the sound when it's already playing
	* @property autostop
	* @type {Bool}
	* @default true
	*/
	@:optional var autostop:Bool;

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
	* Playback rate between 0 and 4.
	* @property playbackRate
	* @type {Float}
	* @default 1
	*/
	@:optional var playbackRate:Float;

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

	/**
	* Whether to preload the sound or not.
	*
	* Set it to `true` to automatically load the sound when instantiated.
	*
	* Set it to `false` to load the sound manually using `snd.load()` method.
	*
	* @property preload
	* @type {Bool}
	* @default true
	*/
	@:optional var preload:Bool;

	/**
	* Whether to use web audio api or not.
	*
	* Set it to `false` to force html5 audio even when web audio is available.
	*
	* @property webaudio
	* @type {Bool}
	* @default true
	*/
	@:optional var webaudio:Bool;
}