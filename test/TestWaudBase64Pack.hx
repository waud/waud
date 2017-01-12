import utest.Assert;

@:access(WaudBase64Pack)
class TestWaudBase64Pack {

	var b64:WaudBase64Pack;

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
			trace("Asynchornous Loading: " + (Date.now().getTime() - t));
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
			trace("Sequential Loading: " + (Date.now().getTime() - t));
			loadBase64PackComplete();
		},
		function(val:Float) {
			Assert.isTrue(val >= 0 && val <= 1);
		}, true);
	}

	public function teardown() {
		b64 = null;
	}
}