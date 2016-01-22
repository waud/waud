import utest.Assert;

class TestWaudUtils {

	var _uaStrings:Map<String, String>;

	public function new() {
		_uaStrings = new Map();
		_uaStrings.set("chrome", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36");
		_uaStrings.set("firefox", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1");
		_uaStrings.set("opera", "Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16");
		_uaStrings.set("safari", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A");
		_uaStrings.set("windows", "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)");
		_uaStrings.set("ipad", "Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53");
		_uaStrings.set("iphone", "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4");
		_uaStrings.set("android", "Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JSS15Q) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Safari/537.36");
	}

	public function testChrome() {
		Assert.isTrue(WaudUtils.isChrome(_uaStrings.get("chrome")));
	}

	public function testFirefox() {
		Assert.isTrue(WaudUtils.isFirefox(_uaStrings.get("firefox")));
	}

	public function testOpera() {
		Assert.isTrue(WaudUtils.isOpera(_uaStrings.get("opera")));
	}

	public function testSafari() {
		Assert.isTrue(WaudUtils.isSafari(_uaStrings.get("safari")));
	}

	public function testWindows() {
		Assert.isTrue(WaudUtils.isWindowsPhone(_uaStrings.get("windows")));
	}

	public function testiOS() {
		Assert.isTrue(WaudUtils.isiOS(_uaStrings.get("ipad")));
	}

	public function testAndroid() {
		Assert.isTrue(WaudUtils.isAndroid(_uaStrings.get("android")));
	}

	public function testMobile() {
		Assert.isTrue(WaudUtils.isMobile(_uaStrings.get("iphone")));
	}

	public function testiOSVersion() {
		Assert.isTrue(WaudUtils.getiOSVersion(_uaStrings.get("ipad"))[0] == 7);
		Assert.isTrue(WaudUtils.getiOSVersion(_uaStrings.get("iphone"))[0] == 8);
	}
}