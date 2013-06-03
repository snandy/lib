// Spiral Matrix Solution
// www.rwardell.com/rtw/projects/spiral.htm

function calcSpiral(cellCount) {
    var dims = Math.floor(cellCount);
    //coerce string to number
    if (dims % 2 === 0) {
        alert('Please use an odd number');
        return;
    }
    if (dims > 23) {
        alert('This demo page is limited to 23 cells per row or fewer. Try again.');
        return;
    };
    var size = Math.pow(cellCount, 2)
    var centerpoint = Math.floor(size / 2);
    var centerRow = Math.floor(centerpoint / dims),
        centerCol = Math.floor(centerpoint % dims);
    var delta = Math.floor(dims / 2),
        rowDisp,
        colDisp;
    var col = 0,
        row = 0;

    count = 1,
    ring = 0,
    offset = 0;

    //indexes
    var tbl,
        tblRow = [],
        tblCell,
        targetCell;

    //cleanup from any earlier run
    document.getElementById('output').innerHTML = '<table id="spiral"></table>';
    tbl = document.getElementById('spiral');

    // construct the table
    for (row = 0; row < dims; row++) {
        tblRow[row] = tbl.insertRow(row);
        for (col = 0; col < dims; col++) {
            tblRow[row].insertCell(col);
        }
    }
    // Here's the meat (spiral algorithm)			
    // 'rings' adapted from the Ruby solution at: http://www.rubyquiz.com/quiz109.html
    // cell content calculations are original
    for (row = 0; row < dims; row++) {
        rowDisp = row - delta;
        for (col = 0; col < dims; col++) {
            colDisp = col - delta;
            ring = Math.max(Math.abs(rowDisp), Math.abs(colDisp));
            offset = Math.pow(((ring + 1) * 2 - 1), 2);
            tblRow[centerRow + rowDisp].cells[centerCol + colDisp].innerHTML =
            (offset - (row * 2 + Math.abs(colDisp + rowDisp) - 2 * (delta - ring)));
        }

    }

}