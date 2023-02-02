
'use strict'

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let planets =[]
let isDrawing = true



function clearBackground(){
    context.fillStyle = 'black'
    context.fillRect(0,0,canvas.width,canvas.height)
}

function calculate(one,two){
    let r = Math.sqrt(Math.pow(one.x-two.x,2) + Math.pow(one.y-two.y,2))

    let cos2 = (one.x-two.x)/r
    let sin2 = (one.y-two.y)/r

    let cos1 = (two.x-one.x)/r
    let sin1 = (two.y-one.y)/r

    let a1 = two.m/(r*r)
    let a1_x = a1 * cos1
    let a1_y = a1 * sin1
    
    let a2 = one.m/(r*r)
    let a2_x = a2 * cos2
    let a2_y = a2 * sin2
    
    //let a = 1/(rad)
    //let a = 1
    //let a = 40200/(rad*rad*rad) // -200 from one
    one.v_x += a1_x
    one.v_y += a1_y

    two.v_x += a2_x
    two.v_y += a2_y
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

let newPlanet;
addEventListener('mousedown',function(event){
    let m_r = Math.random()*50
    newPlanet = {
        m:m_r,
        v_x:0,
        v_y:0,
        x:event.clientX,
        y:event.clientY,
        radius:Math.max(m_r/2,5),
        color:getRandomColor()
    }
    //console.log(`start (${start.x},${start.y})`)
    drawCircle(newPlanet.x,newPlanet.y,newPlanet.radius,0,Math.PI*2,newPlanet.color)
})
addEventListener('mouseup',function(event){
    newPlanet.v_x = (event.clientX-newPlanet.x)/200
    newPlanet.v_y = (event.clientY-newPlanet.y)/200
    
    planets.push(newPlanet)
})

addEventListener('keydown',function(e){
    switch(e.keyCode){
        case 32:{
            if(isDrawing) isDrawing = false
            else isDrawing = true
            break;
        }
    }
})

let earth = {
    m:1,
    v_x:2,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2 - 200,
    radius:5,
    color:'aqua'
}

let sun = {
    m:2500,
    v_x:0,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2,
    radius:20,
    color:'yellow'
}

let moon = {
    m:1,
    v_x:-2,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2 + 200,
    radius:5,
    color:'gray'
}

let mars = {
    m:1,
    v_x:0,
    v_y:2,
    x:canvas.width/2+300,
    y:canvas.height/2 + 0,
    radius:5,
    color:'red'
}

let venere = {
    m:1,
    v_x:0,
    v_y:-2,
    x:canvas.width/2-300,
    y:canvas.height/2+ 0,
    radius:5,
    color:'orange'
}

let saturn = {
    m:2,
    v_x:-2.5,
    v_y:2.5,
    x:canvas.width/2+200,
    y:canvas.height/2 + 200,
    radius:8,
    color:'Tomato'
}

let jupyter = {
    m:2,
    v_x:2.5,
    v_y:-2.5,
    x:canvas.width/2-200,
    y:canvas.height/2- 200,
    radius:8,
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
        clearBackground() // comment to draw path
        step()
    }
        
})
