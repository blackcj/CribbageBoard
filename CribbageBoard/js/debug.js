/**
* Used for debugging. Displays a dot at each one of the points in the row arrays.
*
*/
var dotColor = '#666666';
function showDots() {


    var layer = new Kinetic.Layer();

    for (var p = 2; p < rowOne.length; p++) {
        var rect = new Kinetic.Rect({
            x: rowOne[p].x - 5,
            y: rowOne[p].y - 5,
            width: 10,
            height: 10,
            fill: dotColor
        });

        // add the shape to the layer
        layer.add(rect);
    }

    for (var q = 2; q < rowTwo.length; q++) {
        var rect = new Kinetic.Rect({
            x: rowTwo[q].x - 5,
            y: rowTwo[q].y - 5,
            width: 10,
            height: 10,
            fill: dotColor
        });

        // add the shape to the layer
        layer.add(rect);
    }

    for (var w = 2; w < rowThree.length; w++) {
        var rect = new Kinetic.Rect({
            x: rowThree[w].x - 5,
            y: rowThree[w].y - 5,
            width: 10,
            height: 10,
            fill: dotColor
        });

        // add the shape to the layer
        layer.add(rect);
    }
    // add the layer to the stage
    stage.add(layer);
}

showDots();