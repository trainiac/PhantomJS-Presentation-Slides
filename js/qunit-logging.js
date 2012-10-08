QUnit.formTestSummary = function(sum){
    return "failed: " + sum.failed + ", passed: " + sum.passed + ", total: " + sum.total;
};

QUnit.begin(function(details){
    console.log( "QUnit Starting");
});

QUnit.moduleStart(function(mod){
    console.log( "QUnit Module:", mod.name);
});

QUnit.testStart(function(t){
    console.log( "QUnit Test:", t.name);
});

QUnit.log(function(details){
	if(!details.result){
        console.log( "QUnit FAIL:", details.message );
        console.log( "source:", details.source );
        try{
            console.log( "expected:", JSON.stringify(details.expected, null, 4) );
        }catch(exc){
            console.log("expected:", "QUNIT: error converting to JSON");
        }

        try{
            console.log( "actual:", JSON.stringify(details.actual, null, 4) );
        }catch(exc){
            console.log("actual:", "QUNIT: error converting to JSON");
        }

	} else {
		console.log( "QUnit SUCCESS:", details.message );
	}
});

QUnit.testDone(function(t){
    console.log("QUnit Test " + t.name + " Complete");
    console.log(QUnit.formTestSummary(t));
});

QUnit.moduleDone(function(mod){
    console.log( "QUnit Module Complete");
    console.log( QUnit.formTestSummary(mod) );
});

QUnit.done(function(sum){
    console.log( "QUnit Done!");
    console.log( QUnit.formTestSummary(sum), "runtime:", sum.runtime);
});