var rowOne = new Array();
var rowTwo = new Array();
var rowThree = new Array();

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};


/**
 * Complex trig used to determine the midpoint of a parallel line. Used to snap 
 * the walls during a move. You really don't want to edit this function...
 *  
 * http://www.intmath.com/Plane-analytic-geometry/Perpendicular-distance-point-line.php
 * 
 * @param startPoint
 * @param endPoint
 * @param nextPoint
 * @param angle
 * @return 
 * 
 */
function getRightAnglePoint(startPoint, endPoint, nextPoint, angle)
{
    angle = Math.round(angle);
    var lineLength = getDistanceGivenPoints(startPoint, endPoint);
    lineLength = lineLength / 2;
    var midPoint = getMidPoint(startPoint, endPoint);
    var distance = getDistanceGivenLine(startPoint, endPoint, nextPoint);
    distance = Math.floor(distance / 10) * 10;
    /*
    * Angle between the line and the shortest distance to that line given a point.     
    */
    //var tempAngle:Number = Math.atan(distance / lineLength)/(Math.PI / 180);
      
    /*
    * Normalize the sign. Account for edge cases (90 / 270)    
    */      
    if(angle > 90 && angle < 270){
        distance = -distance;
    }else  if(angle == 90/* angle >= 80 && angle <= 100 */){
        distance = startPoint.x - nextPoint.x;
    }else if( angle == 270/* angle >= 260 && angle <= 280 */){
        distance = startPoint.x + nextPoint.x;
    }
    //var d2:Number = lineLength * Math.tan((angle % 90 - tempAngle) / (180 / Math.PI));
    var corner = getPointGivenDist(distance, (angle + 90) % 360, midPoint);
    return corner;
      
}
    
/**
* Returns the closest distance from a point to a line. Start and end points are used
* to calculate the line in y = m * x + b format. The distance between a point and a
* line in slope intecept format is: |y1 - m * x1 - b| / sqrt(m^2 + 1). Where 
* (y1, x1) is a point not on the line. 
* 
* DOES NOT WORK FOR LINES AT 90 or 270 DEGREES. (You will need separate use cases 
* for these values).
* 
* http://math.ucsd.edu/~wgarner/math4c/derivations/distance/distptline.htm
* 
* @param startPoint
* @param endPoint
* @param nextPoint
* 
*/   
function getDistanceGivenLine(startPoint, endPoint, nextPoint)
{
    // Slope of the line
    var m = (startPoint.y -  endPoint.y) / (startPoint.x -  endPoint.x);
      
    // Y-Intercept
    var b = startPoint.y - (m * startPoint.x);
      
    return (nextPoint.y - m*nextPoint.x - b) / Math.sqrt(Math.pow(m, 2)+1);
}
    
function getXGivenY(pointY, slope, b)
{
    return (pointY - b) / slope;
}
    
function getYGivenX(pointX, slope, b)
{
    return (slope * pointX) + b;
}
    
function getRecipricolSlope(startPoint, endPoint)
{
    var top = endPoint.y - startPoint.y;
    var bottom = endPoint.x - startPoint.x;
      
    return -(bottom/top);
}
    
function getB(slope, point)
{
    return point.y - (slope * point.x);
}
    
function getMidPoint(startPoint, endPoint)
{
    return new Point((endPoint.x + startPoint.x) / 2, (endPoint.y + startPoint.y) / 2);
}
    
/**
 * Distance formula: sqrt((x2 - x1)^2 + (y2 - y1)^2)
 *  
 * @param startPoint
 * @param endPoint
 * @return 
 * 
 */
function getDistanceGivenPoints(startPoint, endPoint)
{
    return Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));      
}
    
/**
* Returns a point that is the given distance / angle away from the start point.
*  
* @param dist
* @param angle
* @param startPt
* @return 
* 
*/
function getPointGivenDist(dist, angle, startPt)
{
    var result = new Point();
    //var radAngle:Number = angle / (180/ Math.PI);
    if(angle <= 90){
        result.x = startPt.x + Math.cos(angle / (180/ Math.PI)) * dist;
        result.y = startPt.y + Math.sin(angle / (180/ Math.PI)) * dist;
    }else if(angle <= 180){
        result.x = startPt.x - Math.sin((angle - 90) / (180/ Math.PI)) * dist;
        result.y = startPt.y + Math.cos((angle - 90) / (180/ Math.PI)) * dist;
    }else if(angle <= 270){
        result.x = startPt.x - Math.cos((angle - 180) / (180/ Math.PI)) * dist;
        result.y = startPt.y - Math.sin((angle - 180) / (180/ Math.PI)) * dist;
    }else{
        result.x = startPt.x + Math.sin((angle - 270) / (180/ Math.PI)) * dist;
        result.y = startPt.y - Math.cos((angle - 270) / (180/ Math.PI)) * dist;
    }
    return result;            
}
    
/**
* Given a point it returns a 'snap point' which is snapped to the angle passed in.
* 
* This could be re-done using polar coordinates to make it more customizable. Right
* now the angels are hard coded.
*  
* @param startPoint
* @param endPoint
* @param angle
* @return 
* 
*/
function getNormalizedPoint(startPoint, endPoint, angle)
{
    var result = new Point();
    var distance = Math.sqrt(Math.pow((endPoint.x - startPoint.x), 2) + Math.pow((endPoint.y - startPoint.y), 2));
    distance = Math.round(distance / 10) * 10
    var adj = distance * Math.sin(45 / (180 / Math.PI));
    if(angle == 0){
        result = new Point(startPoint.x + distance, startPoint.y);
    }else if(angle == 90){
        result = new Point(startPoint.x, startPoint.y + distance);
    }else if(angle == 180){
        result = new Point(startPoint.x-distance, startPoint.y);
    }else if(angle == 270){
        result = new Point(startPoint.x, startPoint.y-distance);
    }else if(angle == 45){
        result = new Point(startPoint.x + adj, startPoint.y + adj);
    }else if(angle == 135){
        result = new Point(startPoint.x-adj, startPoint.y + adj);
    }else if(angle == 225){
        result = new Point(startPoint.x-adj, startPoint.y-adj);
    }else{
        result = new Point(startPoint.x+adj, startPoint.y-adj);
    }
    return result;
}
    
/**
* Hard coded 'snap angles' that are feed into getNormalizedPoint
* 
* This could be re-done using polar coordinates to make it more customizable. Right
* now the angels are hard coded.
* 
* @param value
* @return 
* 
*/
function normalizeAngle(value)
{
    var result = 0;
    if(value >= 22.5 && value < 67.5){
        result = 45;
    }else if(value >= 67.5 && value < 112.5){
        result = 90;
    }else if(value >= 112.5 && value < 157.5){
        result = 135;
    }else if(value >= 157.5 && value < 202.5){
        result = 180;
    }else if(value >= 202.5 && value < 247.5){
        result = 225;
    }else if(value >= 247.5 && value < 292.5){
        result = 270;
    }else if(value >= 292.5 && value < 337.5){
        result = 315;
    }
    return result;
}
    
/**
* Trigonomitry. Returns an angle give the adj and opp. Needs four use
* cases since the adj / opp will very depending on which quadrant you are in.
*  
* http://en.wikipedia.org/wiki/Triangle
* 
* @param adj
* @param opp
* @return 
* 
*/
function getAngle(adj, opp)
{
    var result = 0;
    if(adj <= 0 && opp <= 0){
        result = 180 + ( Math.atan( Math.abs(adj) / Math.abs(opp) ) /(Math.PI/180) )
    }else if(adj >= 0 && opp <= 0){
        result = 90 + ( Math.atan( Math.abs(opp) / Math.abs(adj) ) /(Math.PI/180) )
    }else if(adj <= 0 && opp >= 0){
        result = 270 + ( Math.atan( Math.abs(opp) / Math.abs(adj) ) /(Math.PI/180) )
    }else{
        result = ( Math.atan( Math.abs(adj) / Math.abs(opp) ) /(Math.PI/180) )
    }
    return result;      
}

var xPos = 124;
var yPos = 153;

function buildArrays() {

    rowOne.push(new Point(59, 153));
    rowOne.push(new Point(76, 153));


    rowTwo.push(new Point(59, 199));
    rowTwo.push(new Point(76, 199));


    rowThree.push(new Point(59, 248));
    rowThree.push(new Point(76, 248));


    for (var i = 1; i <= 35; i++) {
        rowOne.push(new Point(xPos, yPos));
        rowTwo.push(new Point(xPos, yPos + 46));
        rowThree.push(new Point(xPos, yPos + 46 + 49));
        xPos += 16.45;
        if (i % 5 == 0) {
            xPos += 24;
        }

    }

    rowOne.push(new Point(886, 158.5));
    rowOne.push(new Point(942, 208.5));
    rowOne.push(new Point(965.5, 284));
    rowOne.push(new Point(948.5, 359));
    rowOne.push(new Point(896.5, 417.5));

    rowTwo.push(new Point(868.5, 209));
    rowTwo.push(new Point(905, 240.5));
    rowTwo.push(new Point(916.5, 284.5));
    rowTwo.push(new Point(907, 327.5));
    rowTwo.push(new Point(879, 366));

    rowThree.push(new Point(854, 257));
    rowThree.push(new Point(866, 270));
    rowThree.push(new Point(869.5, 287));
    rowThree.push(new Point(867.5, 305));
    rowThree.push(new Point(860, 319.5));


    xPos -= 35;
    yPos = 429;

    for (var n = 1; n <= 35; n++) {
        rowOne.push(new Point(xPos, yPos));
        rowTwo.push(new Point(xPos, yPos - 46));
        rowThree.push(new Point(xPos, yPos - 46 - 47));
        xPos -= 16.8;
        if (n % 5 == 0) {
            xPos -= 9.9;
        }

    }

    rowOne.push(new Point(169.5, 441.5));
    rowOne.push(new Point(159.5, 457.5));
    rowOne.push(new Point(155.5, 474));
    rowOne.push(new Point(158.5, 492));
    rowOne.push(new Point(170.5, 506.5));

    rowTwo.push(new Point(156.5, 384));
    rowTwo.push(new Point(121, 419));
    rowTwo.push(new Point(104, 471));
    rowTwo.push(new Point(117.5, 521.5));
    rowTwo.push(new Point(156.5, 555));

    rowThree.push(new Point(142.5, 338));
    rowThree.push(new Point(77.5, 393.5));
    rowThree.push(new Point(58.5, 469.5));
    rowThree.push(new Point(79, 548));
    rowThree.push(new Point(139, 605));

    xPos += 24;
    yPos = 517.5;

    for (var m = 1; m <= 40; m++) {
        rowOne.push(new Point(xPos, yPos));
        rowTwo.push(new Point(xPos, yPos + 46));
        rowThree.push(new Point(xPos, yPos + 46 + 49));
        xPos += 16.5;
        if (m % 5 == 0) {
            xPos += 10.8;
        }

    }

    rowOne.push(new Point(970.5, 561.5));

    rowTwo.push(new Point(970.5, 561.5));

    rowThree.push(new Point(970.5, 561.5));
}
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
var index = 0;
var closest = 500;
var pegPoint;
/**
* Create peg and add event listeners.
*
*/
function getPegIndex(peg, row) {
    index = 0;
    closest = 500;
    pegPoint = new Point(peg.getX(), peg.getY());
    for (var p = 0; p < row.length; p++) {
        var dist = getDistanceGivenPoints(pegPoint, row[p]);

        if (dist < closest) {
            closest = dist;
            index = p;
            if (dist < 5) {
                continue;
            }
        }
    }
    return index;
}

/**
 * The guide shows the number of pegs as a user drags. This function sets the color, position and text of the guide.
 *
 */
function updateGuide(peg, i, tempIndex, color) {
    if (tempIndex > pegIndexes[i]) {
        if (pegIndexes[i] <= 0) {
            writeMessage(messageLayer, tempIndex - pegIndexes[i] - 1, peg.getX(), peg.getY(), color);
        } else {
            writeMessage(messageLayer, tempIndex - pegIndexes[i], peg.getX(), peg.getY(), color);
        }
    } else {
        writeMessage(messageLayer, "", 0, 0, color);
    }
}



var points;
var currentPeg;
/**
 * Create peg and add event listeners.
 *
 */
function drawPeg(color, name, image) {
    var circle = new Kinetic.Circle({
        x: 0,
        y: 0,
        radius: 20,
        name: name,
        draggable: true,
        /*stroke: color,
        strokeWidth: 1,*/
        fillPatternRepeat: "no-repeat",
        fillPatternImage: image,
        fillPatternOffset: [19, 19]
    });

    // pos is a reference to the event. pos.x and pos.y will return coordinates. pos.shape returns the peg targeted in the event.
    
    circle.on('dragmove', _.throttle(onPegMove, 100));
    
    circle.on('dragstart', function (pos) {
        drawing = true;
        if (pos.shape.attrs.name == 'pegRedOne' || pos.shape.attrs.name == 'pegRedTwo') {
            redLine.show();
        } else if (pos.shape.attrs.name == 'pegBlueOne' || pos.shape.attrs.name == 'pegBlueTwo') {
            blueLine.show();
        } else if (pos.shape.attrs.name == 'pegYellowOne' || pos.shape.attrs.name == 'pegYellowTwo') {
            yellowLine.show();
        }
        startX = pos.x;
        startY = pos.y;
    });

    circle.on('dragend', function (pos) {
        undoData.push(pegIndexes.slice(0));
        document.getElementById("undoButton").disabled = false;
        if (pos.shape.attrs.name == 'pegRedOne') {
            redLine.hide();
            pegIndexes[4] = placePeg(pos.shape, rowThree);
            normalizePegs(4, 5, pegRedOne, pegRedTwo);
            pegRedLayer.draw();
        } else if (pos.shape.attrs.name == 'pegRedTwo') {
            redLine.hide();
            pegIndexes[5] = placePeg(pos.shape, rowThree);
            normalizePegs(4, 5, pegRedOne, pegRedTwo);
            pegRedLayer.draw();
        } else if (pos.shape.attrs.name == 'pegBlueOne') {
            blueLine.hide();
            pegIndexes[0] = placePeg(pos.shape, rowOne);
            normalizePegs(0, 1, pegBlueOne, pegBlueTwo);
            pegBlueLayer.draw();
        } else if (pos.shape.attrs.name == 'pegBlueTwo') {
            blueLine.hide();
            pegIndexes[1] = placePeg(pos.shape, rowOne);
            normalizePegs(0, 1, pegBlueOne, pegBlueTwo);
            pegBlueLayer.draw();
        } else if (pos.shape.attrs.name == 'pegYellowOne') {
            yellowLine.hide();
            pegIndexes[2] = placePeg(pos.shape, rowTwo);
            normalizePegs(2, 3, pegYellowOne, pegYellowTwo);
            pegYellowLayer.draw();
        } else if (pos.shape.attrs.name == 'pegYellowTwo') {
            yellowLine.hide();
            pegIndexes[3] = placePeg(pos.shape, rowTwo);
            normalizePegs(2, 3, pegYellowOne, pegYellowTwo);
            pegYellowLayer.draw();
        }
        updateScores();
        messageLayer.hide();
        lineLayer.draw();

    });
    return circle;
}

function onPegMove(pos) {
    points = new Array();
    if (pos.shape.attrs.name == 'pegRedOne' || pos.shape.attrs.name == 'pegRedTwo') {
        if (pos.shape.attrs.name == 'pegRedOne') {
            tempIndex = getPegIndex(pegRedOne, rowThree);
            points.push(rowThree[pegIndexes[5]].x);
            points.push(rowThree[pegIndexes[5]].y);
            updateGuide(pegRedOne, 5, tempIndex, pegThreeColor);
            for (g = pegIndexes[5]; g <= tempIndex; g++) {
                points.push(rowThree[g].x);
                points.push(rowThree[g].y);
            }
        } else {
            tempIndex = getPegIndex(pegRedTwo, rowThree);
            points.push(rowThree[pegIndexes[4]].x);
            points.push(rowThree[pegIndexes[4]].y);
            updateGuide(pegRedTwo, 4, tempIndex, pegThreeColor);
            for (g = pegIndexes[4]; g <= tempIndex; g++) {
                points.push(rowThree[g].x);
                points.push(rowThree[g].y);
            }

        }
        redLine.setPoints(points);
    } else if (pos.shape.attrs.name == 'pegBlueOne' || pos.shape.attrs.name == 'pegBlueTwo') {

        if (pos.shape.attrs.name == 'pegBlueOne') {
            tempIndex = getPegIndex(pegBlueOne, rowOne);
            points.push(rowOne[pegIndexes[1]].x);
            points.push(rowOne[pegIndexes[1]].y);
            updateGuide(pegBlueOne, 1, tempIndex, pegOneColor);
            for (g = pegIndexes[1]; g <= tempIndex; g++) {
                points.push(rowOne[g].x);
                points.push(rowOne[g].y);
            }

        } else {
            tempIndex = getPegIndex(pegBlueTwo, rowOne);
            points.push(rowOne[pegIndexes[0]].x);
            points.push(rowOne[pegIndexes[0]].y);
            updateGuide(pegBlueTwo, 0, tempIndex, pegOneColor);
            for (g = pegIndexes[0]; g <= tempIndex; g++) {
                points.push(rowOne[g].x);
                points.push(rowOne[g].y);
            }

        }
        blueLine.setPoints(points);
    } else if (pos.shape.attrs.name == 'pegYellowOne' || pos.shape.attrs.name == 'pegYellowTwo') {

        if (pos.shape.attrs.name == 'pegYellowOne') {
            tempIndex = getPegIndex(pegYellowOne, rowTwo);
            points.push(rowTwo[pegIndexes[3]].x);
            points.push(rowTwo[pegIndexes[3]].y);
            updateGuide(pegYellowOne, 3, tempIndex, pegTwoColor);
            for (g = pegIndexes[3]; g <= tempIndex; g++) {
                points.push(rowTwo[g].x);
                points.push(rowTwo[g].y);
            }

        } else {
            tempIndex = getPegIndex(pegYellowTwo, rowOne);
            points.push(rowTwo[pegIndexes[2]].x);
            points.push(rowTwo[pegIndexes[2]].y);
            updateGuide(pegYellowTwo, 2, tempIndex, pegTwoColor);
            for (g = pegIndexes[2]; g <= tempIndex; g++) {
                points.push(rowTwo[g].x);
                points.push(rowTwo[g].y);
            }

        }
        yellowLine.setPoints(points);
    }
    messageLayer.show();
    lineLayer.draw();
    
}

/**
    * Adjusts hit area for pegs when they are right next to each other.
    *  
    * @param peg1
    * @param peg2
    * 
    */ 
function normalizePegs(p1, p2, peg1, peg2)
{
    if (p1 == 0) {
        peg1.setX(rowOne[pegIndexes[p1]].x);
        peg1.setY(rowOne[pegIndexes[p1]].y);
        peg2.setX(rowOne[pegIndexes[p2]].x);
        peg2.setY(rowOne[pegIndexes[p2]].y);
    }

    if (p1 == 2) {
        peg1.setX(rowTwo[pegIndexes[p1]].x);
        peg1.setY(rowTwo[pegIndexes[p1]].y);
        peg2.setX(rowTwo[pegIndexes[p2]].x);
        peg2.setY(rowTwo[pegIndexes[p2]].y);
    }

    if (p1 == 4) {
        peg1.setX(rowThree[pegIndexes[p1]].x);
        peg1.setY(rowThree[pegIndexes[p1]].y);
        peg2.setX(rowThree[pegIndexes[p2]].x);
        peg2.setY(rowThree[pegIndexes[p2]].y);
    }

    peg1.setFillPatternOffset([19, 19]);
    peg2.setFillPatternOffset([19, 19]);

    if(pegIndexes[p1] - pegIndexes[p2] == -1){
        if (pegIndexes[p1] <= 36 || pegIndexes[p1] >= 82) {
            console.log("1");
            peg1.setX(peg1.getX() - 10);
            peg2.setX(peg2.getX() + 10);
            peg1.setFillPatternOffset([9, 19]);
            peg2.setFillPatternOffset([29, 19]);
        } else if (pegIndexes[p1] > 36 && pegIndexes[p1] < 42) {
            console.log("2");
            peg1.setY(peg1.getY() - 10);
            peg2.setY(peg2.getY() + 10);
            peg1.setFillPatternOffset([19, 9]);
            peg2.setFillPatternOffset([19, 29]);
        } else if (pegIndexes[p1] >= 42 && pegIndexes[p1] <= 77) {
            console.log("3");
            peg1.setX(peg1.getX() + 10);
            peg2.setX(peg2.getX() - 10);
            peg1.setFillPatternOffset([29, 19]);
            peg2.setFillPatternOffset([9, 19]);
        } else if (pegIndexes[p1] > 77 && pegIndexes[p1] < 82) {
            console.log("4");
            peg1.setY(peg1.getY() - 10);
            peg2.setY(peg2.getY() + 10);
            peg1.setFillPatternOffset([19, 9]);
            peg2.setFillPatternOffset([19, 29]);
        }
        
    }else if(pegIndexes[p1] - pegIndexes[p2] == 1){
        if (pegIndexes[p1] <= 36 || pegIndexes[p1] >= 82) {
            console.log("11");
            peg1.setX(peg1.getX() + 10);
            peg2.setX(peg2.getX() - 10);
            peg1.setFillPatternOffset([29, 19]);
            peg2.setFillPatternOffset([9, 19]);
        } else if (pegIndexes[p1] > 36 && pegIndexes[p1] < 42) {
            console.log("22");
            peg1.setY(peg1.getY() + 10);
            peg2.setY(peg2.getY() - 10);
            peg1.setFillPatternOffset([19, 29]);
            peg2.setFillPatternOffset([19, 9]);
        } else if (pegIndexes[p1] >= 42 && pegIndexes[p1] <= 77) {
            console.log("33");
            peg1.setX(peg1.getX() - 10);
            peg2.setX(peg2.getX() + 10);
            peg1.setFillPatternOffset([9, 19]);
            peg2.setFillPatternOffset([29, 19]);
        } else if (pegIndexes[p1] > 77 && pegIndexes[p1] < 82) {
            console.log("44");
            peg1.setY(peg1.getY() + 10);
            peg2.setY(peg2.getY() - 10);
            peg1.setFillPatternOffset([19, 29]);
            peg2.setFillPatternOffset([19, 9]);
        }
        
    }
}

function drawPegs(images) {
    pegBlueOne = drawPeg(pegOneColor, 'pegBlueOne', images.bluePegImage);
    pegBlueLayer.add(pegBlueOne);

    pegBlueTwo = drawPeg(pegOneColor, 'pegBlueTwo', images.bluePegImage);
    pegBlueLayer.add(pegBlueTwo);

    pegYellowOne = drawPeg(pegTwoColor, 'pegYellowOne', images.yellowPegImage);
    pegYellowLayer.add(pegYellowOne);

    pegYellowTwo = drawPeg(pegTwoColor, 'pegYellowTwo', images.yellowPegImage);
    pegYellowLayer.add(pegYellowTwo);

    pegRedOne = drawPeg(pegThreeColor, 'pegRedOne', images.redPegImage);
    pegRedLayer.add(pegRedOne);

    pegRedTwo = drawPeg(pegThreeColor, 'pegRedTwo', images.redPegImage);
    pegRedLayer.add(pegRedTwo);
    hasPegs = true;
    updatePegs();
    
}

