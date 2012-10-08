module("example tests");

test("Test 1",function(){
    var four = 2 + 2;
    equal(four, 4, "Dude you can add!");
});

test("Test 2", function(){
    var four = 2 * 2;
    equal(four, 4, "OMG!");
});

test( "Test 3", function() {
    var four = Math.pow(2,2);
    equal(four, 4, "mmmmmmm");
});