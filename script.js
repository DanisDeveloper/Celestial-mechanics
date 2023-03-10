/**********************************
space - stop
n - add new random planet
c - clear all planets and background
o - change focus on the most massive planet
a - next planet
d - previous planet
s - foces on current planet
r - clear all, create 2000 planets and spread them
q - most far planet from Sun
t - The Big Bang
i - show/hide info
m -  planets merge together
Esc - toggle clear
arrows - move camera
mouse click drag & drop - create new random planet with boost 

***********************************/


'use strict'

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let planets =[]
let isDrawing = true
let isClearing = true
let showInfo = true
let doCollision = true
let indexCurrentPlanet = 0
let linkCurrentPlanet = null;
let linkMostMassivePlanet = null;
let linkMostFarPlanetFromSun = null;

let shiftCamera = 70
let numberNewPlanets = 5
let limitVelocity = 5
let limitMass = 500
let minRadius = 3
let koeffRadius = 5
let minMass = 3
let koeffCanvas = 2
let scale = 1
let stepScale = 0.01
let tact = 0
let amountRandomPlanets = 1000

function clearBackground(x=0,y=0,width=canvas.width,height=canvas.height){
    context.fillStyle = 'black'
    context.fillRect(x,y,width,height)
}

function getAccelerationByChoice(planet1,planet2,choice){
    switch(choice){
        case 0:{

            break;
        }
        case 1:{
            break;
        }
        case 2:{
            break;
        }
        case 3:{
            break;
        }
        case 4:{
            break;
        }
        case 5:{
            break;
        }
    }
}

function step(){
    for(let i=0;i<planets.length;i++){
        for(let j=i+1;j<planets.length;j++){
            //calculate(i,j)
            let r = Math.max(Math.sqrt(Math.pow(planets[i].x-planets[j].x,2) + Math.pow(planets[i].y-planets[j].y,2)),0.0000000000001)
            let cos = (planets[j].x-planets[i].x)/r
            let sin = (planets[j].y-planets[i].y)/r

            let a1 = planets[j].m/(r*r)
            //let a1 = 1/(r)
            //let a1 = 0.005
            //let a1 = r/100000
            //let a1 = 1000000/(r*r*r)
            //let a1 = planet2.m/(r)/1000
            
            let a2 = planets[i].m/(r*r)
            //let a2 = 1/(r)
            //let a2 = 0.005
            //let a2 = r/100000
            //let a2 = 1000000/(r*r*r)
            //let a2 = planet1.m/(r)/1000

            
            planets[i].v_x += a1 * cos
            planets[i].v_y += a1 * sin

            planets[j].v_x += a2 * -cos
            planets[j].v_y += a2 * -sin


            if(planets[i].radius+planets[j].radius >= r && doCollision){
                let planet = {
                    m:planets[i].m+planets[j].m,
                    v_x:(planets[i].m*planets[i].v_x+planets[j].m*planets[j].v_x)/(planets[i].m + planets[j].m),
                    v_y:(planets[i].m*planets[i].v_y+planets[j].m*planets[j].v_y)/(planets[i].m + planets[j].m),
                    x:(planets[i].m>planets[j].m)?planets[i].x:planets[j].x,
                    y:(planets[i].m>planets[j].m)?planets[i].y:planets[j].y,
                    radius:Math.sqrt((Math.pow(planets[i].radius,2)+Math.pow(planets[j].radius,2))),
                    color:getRandomColor()
                }
                if(linkCurrentPlanet === planets[i] || linkCurrentPlanet === planets[j])  linkCurrentPlanet = planet
                planets.splice(j,1)
                planets.splice(i,1)
                planets.push(planet)
            }
        }
    }

    planets.forEach(element=>{
        element.x +=element.v_x
        element.y +=element.v_y
        drawCircle(element.x,element.y,element.radius,0,Math.PI*2,element.color)
    })  
}
function drawCircle(x,y,radius,startAngle,endAngle,color){
    context.beginPath()
    context.fillStyle = color
    context.arc((scale<=1)?x*scale + canvas.width*Math.abs(scale-1)/2 :x*scale - canvas.width*Math.abs(scale-1)/2,
                (scale<=1)?y*scale+ canvas.height*Math.abs(scale-1)/2 :y*scale - canvas.height*Math.abs(scale-1)/2,
                radius*scale,
                startAngle,
                endAngle)
    context.fill()
    context.closePath()
}

function getRandomColor() {
    var letters = '56789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random()* letters.length)];
    }
    return color;
}

function getRandomPlanet(x=(Math.random()-0.5)*canvas.width*koeffCanvas + canvas.width/2,
                         y=(Math.random()-0.5)*canvas.height*koeffCanvas+ canvas.height/2,
                         v_x=(Math.random()-0.5)*limitVelocity,
                         v_y=(Math.random()-0.5)*limitVelocity,
                         ){
    let randomMass = Math.max(Math.random()*limitMass,minMass)
    return {
        m:randomMass,
        v_x:v_x,
        v_y:v_y,
        x:x,
        y:y,
        radius:Math.max(randomMass/limitMass *koeffRadius,minRadius),
        color:getRandomColor()
    }
}

function getRandomCoordinateInEllips(planet){
    let RX = canvas.width/2
    let RY = canvas.height/2
    while (true){
        planet.x = (Math.random()-0.5)*RX*2
        planet.y = (Math.random()-0.5)*RY*2
        if(planet.x*planet.x/(RX*RX) + planet.y*planet.y/(RY*RY) <= 1) {
            planet.x += canvas.width/2
            planet.y += canvas.height/2
            return;
        }
    }
}

function moveToCurrentPlanet(planet){
    let diff_x = planet.x - canvas.width/2/scale
    let diff_y = planet.y - canvas.height/2/scale
    planets.forEach(value=>{
        value.x -= (scale <=1)? diff_x+canvas.width*Math.abs(scale-1)/2/scale : diff_x-canvas.width*Math.abs(scale-1)/2/scale
        value.y -= (scale <=1)? diff_y+canvas.height*Math.abs(scale-1)/2/scale :diff_y-canvas.height*Math.abs(scale-1)/2/scale
    })
}
function getDistanceFromSun(planet,planetWithMaxM=null){
    if(planetWithMaxM === null)
        planetWithMaxM = getMostMassivePlanet()
    let distance = Math.sqrt(Math.pow(planetWithMaxM.x-planet.x,2)+Math.pow(planetWithMaxM.y-planet.y,2))
    return distance
}
function getMostMassivePlanet(){
    let planetWithMaxM = planets[0]
    planets.forEach(value=>{
        if(value.m>planetWithMaxM.m){
            planetWithMaxM = value
        } 
    })
    return planetWithMaxM
}

function printText(text,x,y){
    context.font = "100px Arial";
    context.fillStyle='white'
    context.fillText(text,x,y)
}

function reset(){
    planets = []
    indexCurrentPlanet = 0
    linkCurrentPlanet = null;
    linkMostMassivePlanet = null;
    linkMostFarPlanetFromSun = null;
    tact = 0
    clearBackground()
}

let newPlanet;
addEventListener('mousedown',function(event){
    newPlanet = getRandomPlanet(
        (scale<=1)? event.clientX/scale-canvas.width*Math.abs(scale-1)/2/scale : event.clientX/scale+canvas.width*Math.abs(scale-1)/2/scale,
        (scale<=1)? event.clientY/scale-canvas.height*Math.abs(scale-1)/2/scale :event.clientY/scale+canvas.height*Math.abs(scale-1)/2/scale
    )
    //console.log(`start (${start.x},${start.y})`)
    drawCircle(newPlanet.x,newPlanet.y,newPlanet.radius,0,Math.PI*2,newPlanet.color)
})
addEventListener('mouseup',function(event){
    newPlanet.v_x = (scale<=1)? 
    ((event.clientX-canvas.width*Math.abs(scale-1)/2)/scale-newPlanet.x)/200 : 
    ((event.clientX+canvas.width*Math.abs(scale-1)/2)/scale-newPlanet.x)/200

    newPlanet.v_y = (scale<=1)? 
    ((event.clientY-canvas.height*Math.abs(scale-1)/2)/scale-newPlanet.y)/200 :
    ((event.clientY+canvas.height*Math.abs(scale-1)/2)/scale-newPlanet.y)/200
    
    planets.push(newPlanet)
})

addEventListener('keydown',function(e){
    console.log(e.keyCode)
    switch(e.keyCode){
        case 32:{ // space
            isDrawing = !isDrawing
            break;
        }
        case 77:{
            doCollision = !doCollision
            break;
        }
        case 78:{ // n
            for(let i=0;i<numberNewPlanets;i++){
                let planet = getRandomPlanet()
                planets.push(planet)
                drawCircle(planet.x,planet.y,planet.radius,0,Math.PI*2,planet.color)
            }
            break;
        }
        case 67:{ // c
            reset()
            break;
        }
        case 82:{ // r
            reset()
            for(let i=0;i<amountRandomPlanets;i++){
                planets.push(getRandomPlanet())
            }
            break;
        }
        case 84:{ // t
            reset()
            for(let i=0;i<amountRandomPlanets;i++){
                let coordinate = {
                    x:0,
                    y:0
                }
                getRandomCoordinateInEllips(coordinate)
                let v_x = (coordinate.x-canvas.width/2)/20
                let v_y = (coordinate.y-canvas.height/2)/20
                planets.push(getRandomPlanet(coordinate.x,coordinate.y,v_x,v_y))
            }
            break;
        }
        case 37:{ // left
            planets.forEach(value=>value.x+=shiftCamera/scale)
            break;
        }
        case 38:{ // up
            planets.forEach(value=>value.y+=shiftCamera/scale)
            break;
        }
        case 39:{ // right
            planets.forEach(value=>value.x-=shiftCamera/scale)
            break;
        }
        case 40:{ // down
            planets.forEach(value=>value.y-=shiftCamera/scale)
            break;
        }
        case 79:{ // o
            linkMostMassivePlanet = getMostMassivePlanet()
            linkCurrentPlanet = linkMostMassivePlanet
            moveToCurrentPlanet(linkMostMassivePlanet)
            break;
        }
        case 65:{ // a
            indexCurrentPlanet--
            if(indexCurrentPlanet < 0 || indexCurrentPlanet >= planets.length) indexCurrentPlanet = planets.length-1
            linkCurrentPlanet = planets[indexCurrentPlanet]
            try{
                moveToCurrentPlanet(linkCurrentPlanet)
            }catch(error){
                linkCurrentPlanet = planets[0]
                moveToCurrentPlanet(linkCurrentPlanet)
            }
            
            break;
        }
        case 68:{ // d
            indexCurrentPlanet++
            if(indexCurrentPlanet >= planets.length) indexCurrentPlanet = 0
            linkCurrentPlanet = planets[indexCurrentPlanet]
            try{
                moveToCurrentPlanet(linkCurrentPlanet)
            }catch(error){
                linkCurrentPlanet = planets[0]
                moveToCurrentPlanet(linkCurrentPlanet)
            }
            break;
        }
        case 83:{ // s
            moveToCurrentPlanet(linkCurrentPlanet)
            break;
        }
        case 27:{ // Esc
            isClearing = !isClearing
            break;
        }
        case 81:{ // q
            linkMostFarPlanetFromSun = planets[0]
            let mostMassivePlanet = getMostMassivePlanet()
            planets.forEach(value=>{
                if(getDistanceFromSun(value,mostMassivePlanet) > getDistanceFromSun(linkMostFarPlanetFromSun,mostMassivePlanet)){
                    linkMostFarPlanetFromSun = value
                }
            })
            linkCurrentPlanet = linkMostFarPlanetFromSun
            moveToCurrentPlanet(linkCurrentPlanet)
            break;
        }
        case 90:{ // z
            if(scale-stepScale>0) {
                scale -=stepScale
            } else{
                scale = stepScale
            }
            break;
        }
        case 88:{ // x 
            scale +=stepScale
            break;
        }
        case 73:{
            showInfo = !showInfo
            break;
        }
    }
})


let sun = {
    m:3555,
    v_x:0,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2,
    radius:20,
    color:'yellow'
}
let earth = {
    m:22,
    v_x:3.5,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2 - 200,
    radius:5,
    color:'aqua'
}
let moon = {
    m:22,
    v_x:-3.5,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2 + 200,
    radius:5,
    color:'gray'
}
let mars = {
    m:17,
    v_x:0,
    v_y:4,
    x:canvas.width/2+300,
    y:canvas.height/2 + 0,
    radius:5,
    color:'red'
}
let venere = {
    m:17,
    v_x:0,
    v_y:-4,
    x:canvas.width/2-300,
    y:canvas.height/2+ 0,
    radius:5,
    color:'orange'
}
let saturn = {
    m:70,
    v_x:-1.7,
    v_y:1.7,
    x:canvas.width/2 + 500,
    y:canvas.height/2 + 500,
    radius:10,
    color:'Tomato'
}
let jupyter = {
    m:70,
    v_x:1.7,
    v_y:-1.7,
    x:canvas.width/2 - 500,
    y:canvas.height/2 - 500,
    radius:10,
    color:'OrangeRed'
}

planets.push(sun)
planets.push(earth)
planets.push(moon)
planets.push(mars)
planets.push(venere)
planets.push(saturn)
planets.push(jupyter)
clearBackground()
setInterval(function(){
    
    if(isDrawing){
        if(isClearing)
            clearBackground() 
        step()
        if(showInfo){
            printText(`planets: ${planets.length}`,100,100)
            try{
                printText(`distance to Sun: ${getDistanceFromSun(linkCurrentPlanet).toFixed()}`,100,200)
            }catch(error){
                printText(`distance to Sun: ${0}`,100,200)
            }
            if(linkMostMassivePlanet === null) printText(`mass of Sun: ${0}`,100,300)
            else printText(`mass of Sun: ${linkMostMassivePlanet.m.toFixed()}`,100,300)
            printText(`scale: ${scale.toFixed(2)}`,100,400)
            printText(`tact: ${tact++}`,100,500)
        }
    }  
})
