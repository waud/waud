import utest.Assert;

@:access(Waud)
class TestWaud {

	public function new() {}

	public function testSetVolume() {
		Waud.setVolume(100);
		Assert.isNull(Waud._volume);

		Waud.setVolume(-1);
		Assert.isNull(Waud._volume);

		Waud.setVolume(0.5);
		Assert.equals(0.5, Waud._volume);
	}
}