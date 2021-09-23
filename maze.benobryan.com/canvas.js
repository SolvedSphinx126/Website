
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
const mazeBg = '#FFFFFF'
const wall = '#000000'
const canvasBg = '#ffffff'

canvas.setAttribute("style", "background: " + canvasBg)

//Maze preDraw
let cellWidth
let cellHeight
let mazeWidth = canvas.width;
let mazeHeight = canvas.height;
const ctx = canvas.getContext("2d");


//Maze temp
let rows = 30
let cols = 3*rows
let maze = new Array(rows).fill(0).map(() => new Array(cols).fill(0));


//ctx.fillRect(0,0,canvas.width,canvas.height)
generateMaze(maze)
drawMaze(3, maze)

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

        case "NE":
            ans = [(col + 1)*(cellWidth+wallWidth),((row+1)*wallWidth) + (row*cellHeight)];
            break;
        case "SE":
            ans = [col*(cellWidth+wallWidth),(row+1)*(cellHeight+wallWidth)];
            break;
        case "SW":
            ans = [((col+1)*wallWidth) + (col*cellWidth),(row+1)*(cellHeight+wallWidth)];
            break;
        case "NW":
            ans = [((col+1)*wallWidth) + (col*cellWidth),((row+1)*wallWidth) + (row*cellHeight)];
            break;
        default:
            console.error(dir);
            break;


    }
    return ans;
}

function drawMaze(wallWidth, arr)
{
    cellWidth = (mazeWidth - (wallWidth*(1+cols))) / cols;
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
                point = getCorner("NW",row, col, wallWidth)
                ctx.fillRect(point[0], point[1]+0, cellWidth, -wallWidth-0);
            }
            if((val&RIGHT) > 0)
            {
                point = getCorner("NE",row, col, wallWidth)
                console.log("hi")
                ctx.fillRect(point[0]-0, point[1], wallWidth + 0, cellHeight);
            }
            if((val&DOWN) > 0)
            {
                point = getCorner("SW",row, col, wallWidth)
                ctx.fillRect(point[0], point[1]-0, cellWidth, wallWidth+0);
            }
            if((val&LEFT) > 0)
            {
                point = getCorner("NW",row, col, wallWidth)
                ctx.fillRect(point[0]+1, point[1], -wallWidth-2, cellHeight);
            }

        }
    }
    /*
    for(let j = 0; j < rows; j++)
    {
        for(let i = 0; i < cols; i++)
        {
            ctx.fillRect(((i+1)*wallWidth) + (i*cellWidth), ((j+1)*wallWidth) + (j*cellHeight), cellWidth, cellHeight);
        }
    }
    */

}

function generateMaze(maze)
{
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
}