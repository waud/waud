import utest.Assert;

@:access(WaudBase64Pack)
class TestWaudBase64Pack {

	var b64:WaudBase64Pack;
	var sounds:Map<String, IWaudSound>;

	public function new() {}

	public function setup() {
		Waud.init();
	}

	public function testLoading() {
		var loadBase64PackComplete = Assert.createAsync(5000);

		var t = Date.now().getTime();
		b64 = new WaudBase64Pack("testAssets/sounds.json", function(snds:Map<String, IWaudSound>) {
			Assert.isTrue(snds.exists("sounds/80s-Music.mp3"));
			Assert.equals(b64._soundCount, b64._loadCount);
			trace("Asynchornous Loading Time: " + (Date.now().getTime() - t));
			sounds = snds;
			loadBase64PackComplete();
		},
		function(val:Float) {
			Assert.isTrue(val >= 0 && val <= 1);
		});
	}

	public function testSequentialLoading() {
		var loadBase64PackComplete = Assert.createAsync(5000);

		var t = Date.now().getTime();
		b64 = new WaudBase64Pack("testAssets/sounds.json", function(snds:Map<String, IWaudSound>) {
			Assert.isTrue(snds.exists("sounds/80s-Music.mp3"));
			Assert.equals(b64._soundCount, b64._loadCount);
			trace("Sequential Loading Time: " + (Date.now().getTime() - t));
			loadBase64PackComplete();
		},
		function(val:Float) {
			Assert.isTrue(val >= 0 && val <= 1);
		}, true);
	}

	public function testPlay() {
		Assert.notNull(sounds);
		var snd:IWaudSound = sounds.get("sounds/80s-Music.mp3");

		Assert.isTrue(snd.getTime() == 0);
		Assert.isTrue(snd.getDuration() > 0);

		snd.play();

		haxe.Timer.delay(function() {
			snd.pause();
		}, 3000);

		haxe.Timer.delay(function() {
			snd.setTime(snd.getDuration() - 5);
			snd.play();
		}, 4000);

		var playbackComplete = Assert.createAsync(10000);
		snd.onEnd(function(snd:IWaudSound) {
			Assert.isTrue(snd.getTime() == 0);
			playbackComplete();
		});
	}
}