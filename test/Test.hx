import utest.Runner;
import utest.ui.Report;

class Test {

	public function new() {
		var runner = new Runner();
		runner.addCase(new TestWaud());
		runner.addCase(new TestWaudUtils());
		runner.addCase(new TestWaudBase64Pack());

		Report.create(runner);
		runner.run();
	}

	public static function main() {
		new Test();
	}
}