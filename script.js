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
let indexCurrentPlanet = 0
let linkCurrentPlanet = null;
let linkMostMassivePlanet = null;
let linkMostFarPlanetFromSun = null;

let shift = 70
let limit_v = 5
let limit_m = 500
let min_radius = 3
let koeff_radius = 5
let min_mass = 3
let koeff_coordinate = 3

function clearBackground(){
    context.fillStyle = 'black'
    context.fillRect(0,0,canvas.width,canvas.height)
}

function calculate(one,two){
    let r = Math.max(Math.sqrt(Math.pow(one.x-two.x,2) + Math.pow(one.y-two.y,2)),0.0000000000001)

    let cos2 = (one.x-two.x)/r
    let sin2 = (one.y-two.y)/r

    let cos1 = (two.x-one.x)/r
    let sin1 = (two.y-one.y)/r

    let a1 = two.m/(r*r)
    //let a1 = 1/(r)
    //let a1 = 0.01
    //let a1 = r/10000
    //let a1 = 1000000/(r*r*r)
    //let a1 = two.m/(r)/1000
    let a1_x = a1 * cos1
    let a1_y = a1 * sin1
    
    let a2 = one.m/(r*r)
    //let a2 = 1/(r)
    //let a2 = 0.01
    //let a2 = r/10000
    //let a2 = 1000000/(r*r*r)
    //let a2 = one.m/(r)/1000
    let a2_x = a2 * cos2
    let a2_y = a2 * sin2
    
    one.v_x += a1_x
    one.v_y += a1_y

    two.v_x += a2_x
    two.v_y += a2_y


    if(one.radius+two.radius >= r){
        let planet = {
            m:one.m+two.m,
            v_x:(one.m*one.v_x+two.m*two.v_x)/(one.m + two.m),
            v_y:(one.m*one.v_y+two.m*two.v_y)/(one.m + two.m),
            x:(one.m>two.m)?one.x:two.x,
            y:(one.m>two.m)?one.y:two.y,
            radius:Math.sqrt((Math.pow(one.radius,2)+Math.pow(two.radius,2))),
            color:getRandomColor()
        }
        if(linkCurrentPlanet === one || linkCurrentPlanet === two)  linkCurrentPlanet = planet
           
        planets.push(planet)
        planets.splice(planets.findIndex((value)=>value===one),1)
        planets.splice(planets.findIndex((value)=>value===two),1)
    }
}
function step(){
    for(let i=0;i<planets.length;i++){
        for(let j=i+1;j<planets.length;j++){
            calculate(planets[i],planets[j])
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
    context.arc(x,y,radius,startAngle,endAngle)
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

function getRandomPlanet(x=(Math.random()-0.5)*canvas.width*koeff_coordinate,y=(Math.random()-0.5)*canvas.height*koeff_coordinate,isMoving=true){
    let m_rand = Math.max(Math.random()*limit_m,min_mass)
    return {
        m:m_rand,
        v_x:isMoving?(Math.random()-0.5)*limit_v:0,
        v_y:isMoving?(Math.random()-0.5)*limit_v:0,
        x:x,
        y:y,
        radius:Math.max(m_rand/limit_m *koeff_radius,min_radius),
        color:getRandomColor()
    }
}

function moveToCurrentPlanet(planet){
    let diff_x = planet.x - canvas.width/2
    let diff_y = planet.y - canvas.height/2
    planets.forEach(value=>{
        value.x -= diff_x
        value.y -= diff_y
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

let newPlanet;
addEventListener('mousedown',function(event){
    newPlanet = getRandomPlanet(event.clientX,event.clientY)
    //console.log(`start (${start.x},${start.y})`)
    drawCircle(newPlanet.x,newPlanet.y,newPlanet.radius,0,Math.PI*2,newPlanet.color)
})
addEventListener('mouseup',function(event){
    newPlanet.v_x = (event.clientX-newPlanet.x)/200
    newPlanet.v_y = (event.clientY-newPlanet.y)/200
    
    planets.push(newPlanet)
})

addEventListener('keydown',function(e){
    console.log(e.keyCode)
    switch(e.keyCode){
        case 32:{ // space
            if(isDrawing) isDrawing = false
            else isDrawing = true
            break;
        }
        case 78:{ // n
            for(let i=0;i<5;i++){
                let planet = getRandomPlanet()
                planets.push(planet)
                drawCircle(planet.x,planet.y,planet.radius,0,Math.PI*2,planet.color)
            }
            break;
        }
        case 67:{ // c
            planets = []
            clearBackground()
            break;
        }
        case 82:{ // r
            planets = []
            indexCurrentPlanet = 0
            linkCurrentPlanet = null;
            linkMostMassivePlanet = null;
            linkMostFarPlanetFromSun = null;
            clearBackground()
            for(let i=0;i<2000;i++){
                planets.push(getRandomPlanet())
            }
        }
        case 37:{ // left
            planets.forEach(value=>value.x+=shift)
            break;
        }
        case 38:{ // up
            planets.forEach(value=>value.y+=shift)
            break;
        }
        case 39:{ // right
            planets.forEach(value=>value.x-=shift)
            break;
        }
        case 40:{ // down
            planets.forEach(value=>value.y-=shift)
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
            if(isClearing) isClearing = false
            else isClearing = true
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
        printText(`planets: ${planets.length}`,100,100)
        try{
            printText(`distance to Sun: ${getDistanceFromSun(linkCurrentPlanet).toFixed()}`,100,200)
        }catch(error){
            printText(`distance to Sun: ${0}`,100,200)
        }
        if(linkMostMassivePlanet === null) printText(`mass of Sun: ${0}`,100,300)
        else printText(`mass of Sun: ${linkMostMassivePlanet.m.toFixed()}`,100,300)
    }  
})
