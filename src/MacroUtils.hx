import haxe.macro.Context;
import haxe.macro.Expr.ExprOf;
import haxe.Json;

class MacroUtils {

	macro public static function parseJsonFile(path:String):ExprOf<{}> {
		var content = loadFileAsString(path);
		var obj = try Json.parse(content) catch (e:Dynamic) {}
		return toExpr(obj);
	}

	#if macro
	static function toExpr(v:Dynamic) {
		return Context.makeExpr(v, Context.currentPos());
	}

	static function loadFileAsString(path:String) {
		try {
			var p = Context.resolvePath(path);
			Context.registerModuleDependency(Context.getLocalModule(), p);
			return sys.io.File.getContent(p);
		}
		catch(e:Dynamic) {
			return haxe.macro.Context.error('Failed to load file $path: $e', Context.currentPos());
		}
	}
	#end
}