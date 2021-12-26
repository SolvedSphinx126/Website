
const canvas = document.querySelector("canvas");
let borderWidth = parseInt(getComputedStyle(canvas, null).getPropertyValue('border-width'), 10);
canvas.width = window.innerWidth - 2 * borderWidth;
canvas.height = 0.9*window.innerHeight - 2 * borderWidth;

//Directions
const UP = 1;
const RIGHT = 2;
const DOWN = 4;
const LEFT = 8;

//Colors
const mazeBg = '#ffffff'
const wall = '#000000'

canvas.setAttribute("style", "background: " + mazeBg)

//Maze preDraw
let cellWidth
let cellHeight
let mazeWidth = canvas.width;
let mazeHeight = canvas.height;
let lineWidth = 3
const ctx = canvas.getContext("2d");


//Maze temp
let rows = 10
let cols = 3*rows
let maze = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

function Cell(x, y)
{
    this.x = x
    this.y = y
}

function Wall(cell1, cell2)
{
    this.cell1 = cell1
    this.cell2 = cell2
}

function union(arr1, arr2)
{
    // creating new set to store union
    var unionSet = new Set();

    // iterate over the values and add
    // it to unionSet
    for (var elem of set1)
    {
        unionSet.add(elem);
    }

    // iterate over the values and add it to
    // the unionSet
    for(var elem of set2)
        unionSet.add(elem);

    // return the values of unionSet
    return unionSet;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


//ctx.fillRect(0,0,canvas.width,canvas.height)
generateMaze(maze, "Random Kruskal")
drawMaze(lineWidth, maze)
//connectCells(1,1,0,1,3);

function drawBackground()
{
    ctx.fillStyle = wall;
    ctx.fillRect(0, canvas.height-mazeHeight, mazeWidth, mazeHeight)
}

function getCorner(dir,row,col,wallWidth)
{
    let ans;

    switch(dir)
    {

        case "SE":
            ans = [(col + 1)*(cellWidth+wallWidth),((row+1)*(wallWidth + cellHeight))];
            break;
        case "NE":
            ans = [(col + 1)*(cellWidth+wallWidth),(row+1)*wallWidth + row*cellWidth];
            break;
        case "SW":
            ans = [((col+1)*wallWidth) + (col*cellWidth),((row+1)*(wallWidth + cellHeight))];
            break;
        case "NW":
            ans = [((col+1)*wallWidth) + (col*cellWidth),((row+1)*wallWidth) + (row*cellHeight)];
            break;
        default:
            console.error(dir);
            break;


    }
    //ans[0] = Math.round(ans[0])
    //ans[1] = Math.round(ans[0])
    return ans;
}

function drawMaze(wallWidth, arr)
{
    cellWidth = Math.round((mazeWidth - (wallWidth*(1+cols))) / cols);
    cellHeight = (mazeHeight - (wallWidth*(1+rows))) / rows;
    drawBackground()
    ctx.fillStyle = mazeBg;
    let val;
    let point;

    for(let row = 0; row < arr.length; row++)
    {
        for (let col = 0; col < arr[0].length; col++) {
            val = arr[row][col];
            //console.log("(" + row + ", " + col + "): " + val);
            point = getCorner("NW",row,col,wallWidth)
            ctx.fillStyle = mazeBg;
            ctx.fillRect(point[0], point[1], cellWidth, cellHeight);
            //ctx.fillRect(0, 0, 500, 500);
            //if there is a bitwise intersection between the array value and the direction checked

            if((val&UP) > 0)
            {
                connectCells(row,col,row-1,col,wallWidth);
                console.log("up")
            }
            if((val&RIGHT) > 0)
            {
                connectCells(row,col,row,col+1,wallWidth)
                console.log("right")
            }
            if((val&DOWN) > 0)
            {
                connectCells(row,col,row+1,col,wallWidth)
                console.log("down")
            }
            if((val&LEFT) > 0)
            {
                connectCells(row,col,row,col-1,wallWidth)
                console.log("left")
            }

        }
    }
}

function connectCells(x1,y1,x2,y2,wallWidth)
{
    let topLeft
    let bottomRight
    ctx.fillStyle = mazeBg;

    topLeft = [getCorner("NW", x1, y1, wallWidth)[0],getCorner("NW", x1, y1, wallWidth)[1]];
    bottomRight = [getCorner("SE", x2, y2, wallWidth)[0],getCorner("SE", x2, y2, wallWidth)[1]];
    ctx.fillRect(topLeft[0], topLeft[1], bottomRight[0]-topLeft[0], bottomRight[1]-topLeft[1]);

}

function generateMaze(maze, mode)
{
    switch (mode){
        case "Binary Tree":
            for(let i = 0; i < maze.length; i++)
            {
                for(let j = 0; j < maze[0].length; j++)
                {

                    if(Math.random()>0.5)
                    {
                        maze[i][j] = LEFT;
                    }
                    else
                    {
                        maze[i][j] = UP;
                    }
                }
            }
            break;
        case "Random Kruskal":
            // https://weblog.jamisbuck.org/2011/1/3/maze-generation-kruskal-s-algorithm
            let sets = []
            let walls = []
            for(let x = 0; x < maze.length; x++)
            {
                for(let y = 0; y < maze[0].length; y++)
                {
                    cell = new Cell(x, y)
                    set = new Set([cell])
                    sets.push(set)
                    if(x > 0)
                        walls.push(new Wall(cell, new Cell(x-1, y)))
                    if(y > 0)
                        walls.push(new Wall(cell, new Cell(x, y-1)))
                }
            }
            for (let i = 0; i < walls.length; i++) {
                connectCells(walls[i].cell1.x, walls[i].cell1.y, walls[i].cell2.x, walls[i].cell2.y, lineWidth)
            }

            shuffle(walls)
            console.log(sets[0])

            console.log(walls[0])
            for(let i = 0; i < walls.length; i++)
            {
                for(let j = 0; j < sets.length; j++)
                {
                    for(let k = 0; k < sets[j].length; k++)
                    {
                        if(walls[i].cell1.x == sets[j][k].x && walls[i].cell1.y == sets[j][k].y)
                            console.log("match found")
                    }
                }
            }



        case "Depth First Search":



    }

}