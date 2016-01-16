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
		WaudUtils.ua = _uaStrings.get("chrome");
		Assert.isTrue(WaudUtils.isChrome());
	}

	public function testFirefox() {
		WaudUtils.ua = _uaStrings.get("firefox");
		Assert.isTrue(WaudUtils.isFirefox());
	}

	public function testOpera() {
		WaudUtils.ua = _uaStrings.get("opera");
		Assert.isTrue(WaudUtils.isOpera());
	}

	public function testSafari() {
		WaudUtils.ua = _uaStrings.get("safari");
		Assert.isTrue(WaudUtils.isSafari());
	}

	public function testWindows() {
		WaudUtils.ua = _uaStrings.get("windows");
		Assert.isTrue(WaudUtils.isWindowsPhone());
	}

	public function testiOS() {
		WaudUtils.ua = _uaStrings.get("ipad");
		Assert.isTrue(WaudUtils.isiOS());
	}

	public function testAndroid() {
		WaudUtils.ua = _uaStrings.get("android");
		Assert.isTrue(WaudUtils.isAndroid());
	}

	public function testMobile() {
		WaudUtils.ua = _uaStrings.get("iphone");
		Assert.isTrue(WaudUtils.isMobile());
	}

	public function testiOSVersion() {
		WaudUtils.ua = _uaStrings.get("ipad");
		Assert.isTrue(WaudUtils.getiOSVersion()[0] == 7);

		WaudUtils.ua = _uaStrings.get("iphone");
		Assert.isTrue(WaudUtils.getiOSVersion()[0] == 8);
	}
}