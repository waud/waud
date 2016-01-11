import utest.Runner;
import utest.ui.Report;
import utest.TestResult;

class Test {

	public function new() {
		var runner = new Runner();
		runner.addCase(new TestWaudUtils());

		Report.create(runner);
		runner.run();
	}

	public static function main() {
		new Test();
	}
}