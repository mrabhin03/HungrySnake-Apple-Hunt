const box=document.getElementById("main")
let snakeSize=5;
let oldLeng=snakeSize;
let wrongs=[]
function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}
let cellCount=50
let stepsCount=0
setCell(cellCount);
function setCell(val){
    box.style.gridTemplateColumns = `repeat(${val}, 1fr)`;
    box.style.gridTemplateRows = `repeat(${val}, 1fr)`;
    
    for(let i=0;i<val;i++){
        for(let j=0;j<val;j++){
            let cell=document.createElement("div")
            cell.classList.add("cell");
            cell.setAttribute("data-label",0)
            cell.id=`${i}-${j}`;
            box.appendChild(cell)
        }
    }
    setSnake(val)
}


function setSnake(val){
    mid=parseInt(val/2);
    snakeHead=document.getElementById(`${mid}-${mid}`);
    snakeHead.classList.add("snake")
    snakeHead.classList.add("S-1")
    snakeHead.classList.add("Header")
    let i=1;
    while(i<snakeSize){
        snakeBody=document.getElementById(`${mid}-${mid-i}`);
        snakeBody.classList.add("snake")
        snakeBody.classList.add("S-"+(i+1));
        i++;
    }
    document.getElementById("leng").innerHTML=snakeSize
    checkApple(`${mid}-${mid}`)
    move()
}

async function move(){
    while(true){
        let oldHead=document.querySelector(".S-1")
        wrongs=[]
        nextall= nextMove(oldHead.id);
        removeTempSelector()
        let io=0
        await sleep(10)
        next=nextall[io]
        if(nextall.length==0){
            // window.location.reload()
            alert("Crash.....!")
        }
        if(checkApple(next)){
            document.getElementById("leng").innerHTML=snakeSize
            snakeSize++
        }
        if(oldLeng==snakeSize){
            let tail=document.querySelector(".S-"+snakeSize)
            tail.classList.remove("S-"+snakeSize)
            tail.classList.remove("snake")
            tail.innerHTML=''
        }
            oldLeng=snakeSize
        
        let i=snakeSize-1;
        while(i>=1){
            let body=document.querySelector(".S-"+i)
            body.classList.remove("S-"+i)
            body.classList.add("S-"+(i+1))
            body.classList.remove("Header")
            body.innerHTML=i
            i--
        }
        let head=document.getElementById(next);
        head.classList.add("snake")
        head.classList.add("S-1")
        head.classList.add("Header")
    }
    
}
 function nextMove(prevPoint) {
    let ways = getPoints(prevPoint);
    stepsCount=0
    if(ways.length>=0){
        let outer= noLoop("",prevPoint,0,[])
        if(outer.length!=0){
            ways=outer
        }
    }
    
    return ways;
}

 function noLoop(prev, prevPoint, count, paths) {
    stepsCount++;
    
    if (count >= (snakeSize * 1.2) || count >= (((cellCount * cellCount)) - snakeSize * 1.2)) {
        return paths;
    }
    if (stepsCount >= (cellCount * cellCount) * 100*100) {
        return paths;
    }

    let ways = getPoints(prevPoint);
    if (ways.length == 0) {
        return [];
    }

    for (let i = 0; i < ways.length; i++) {

        if (wrongs.indexOf(`${prevPoint}-${ways[i]}`) >= 0) {
            continue;
        }

        paths.push(ways[i]);
        document.getElementById(ways[i]).classList.add("selectP");

        let newpaths = noLoop(prevPoint, ways[i], count + 1, paths);

        if (newpaths.length == 0) {
            document.getElementById(ways[i]).classList.remove("selectP");
            paths.pop();
        } else {
            return newpaths;
        }
    }

    wrongs.push(`${prev}-${prevPoint}`);
    return [];
}




function removeTempSelector(){
    document.querySelectorAll(".selectP").forEach((ele)=>{
        ele.classList.remove("selectP")
    })
}

function getPoints(point){
    let x=parseInt(point.split("-")[0]);
    let y=parseInt(point.split("-")[1]);
    let ways=[];


    if((y+1)<cellCount){
        if(!document.getElementById(`${x}-${y+1}`).classList.contains("selectP") && !document.getElementById(`${x}-${y+1}`).classList.contains("snake")){
            ways.push(`${x}-${y+1}`);
        }
    }
    if((y-1)>=0 ){
        if(!document.getElementById(`${x}-${y-1}`).classList.contains("selectP") && !document.getElementById(`${x}-${y-1}`).classList.contains("snake")){
            ways.push(`${x}-${y-1}`);
        }
    }
    if((x+1)<cellCount ){
        if(!document.getElementById(`${x+1}-${y}`).classList.contains("selectP") && !document.getElementById(`${x+1}-${y}`).classList.contains("snake")){
            ways.push(`${x+1}-${y}`);
        }
    }
    if((x-1)>=0){
        if(!document.getElementById(`${x-1}-${y}`).classList.contains("selectP") && !document.getElementById(`${x-1}-${y}`).classList.contains("snake")){
            ways.push(`${x-1}-${y}`);
        }
    }
    for (let i=0;i<ways.length;i++){
        let small=i
        for(let j=i+1;j<ways.length;j++){
            let d1=parseInt(document.getElementById(ways[small]).getAttribute("data-label"))
            let d2=parseInt(document.getElementById(ways[j]).getAttribute("data-label"))
            if(d1>d2){
                small=j;
            }
        }
        temp=ways[i]
        ways[i]=ways[small]
        ways[small]=ways[i]
    }
    return ways;
}

function checkApple(point){
    let apple=document.querySelectorAll(".apple");
    if(apple.length>0){
        if(document.getElementById(point).classList.contains("apple")){
            document.getElementById(point).classList.remove("apple")
            addApple(point)
            return true;
        }else{
            return false
        }
    }else{
        addApple(point)
    }
}
function addApple(point){
    let i=0
    while(true){
        applepoint1=(Math.floor(Math.random()*(cellCount-2)))-2;
        applepoint2=(Math.floor(Math.random()*(cellCount-2)))-2;
        let obj=document.getElementById(`${applepoint1}-${applepoint2}`)
        if(obj){
            let obj2=document.getElementById(point)
            if(obj!=obj2 && !obj.classList.contains("snake")){
                obj.classList.add("apple")
                obj.setAttribute("data-label",0)
                setRadius(applepoint1,applepoint2)
                return
            }
        }
        if(i>=500){
            return
        }
        i++
    }
}

function setRadius(row,col){
    for (let i = 0; i < cellCount; i++) {
        for (let j = 0; j < cellCount; j++) {
            document.getElementById(`${i}-${j}`).setAttribute("data-label",Math.abs(i - row) + Math.abs(j - col));
            document.getElementById(`${i}-${j}`).innerHTML=Math.abs(i - row) + Math.abs(j - col);
        }
    }
}