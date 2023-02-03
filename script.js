
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


    if(one.radius+two.radius >= r){
        
        planets.push({
            m:one.m+two.m,
            v_x:(one.m*one.v_x+two.m*two.v_x)/(one.m + two.m),
            v_y:(one.m*one.v_y+two.m*two.v_y)/(one.m + two.m),
            x:(one.m>two.m)?one.x:two.x,
            y:(one.m>two.m)?one.y:two.y,
            radius:Math.sqrt((Math.pow(one.radius,2)+Math.pow(two.radius,2))),
            color:getRandomColor()
        })
        planets.splice(planets.findIndex((value)=>value===one),1)
        planets.splice(planets.findIndex((value)=>value===two),1)
        // one.v_x = (two.v_x+one.v_x)*(two.m/one.m)
        // one.v_y = (two.v_y+one.v_y)*(two.m/one.m)

        // two.v_x = (two.v_x+one.v_x)*(two.m/one.m)
        // two.v_y = (two.v_y+one.v_y)*(two.m/one.m)
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

let newPlanet;
addEventListener('mousedown',function(event){
    let m_r = Math.random()*20
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
    console.log(e.keyCode)
    switch(e.keyCode){
        case 32:{
            if(isDrawing) isDrawing = false
            else isDrawing = true
            break;
        }
        case 78:{
            planets.push({
                    m:Math.max(Math.random()*20,1),
                    v_x:(Math.random()-0.5)*2,
                    v_y:(Math.random()-0.5)*2,
                    x:Math.random()*canvas.width,
                    y:Math.random()*canvas.height,
                    radius:Math.max(Math.random()*10,5),
                    color:getRandomColor()
                })
            break;
        }
        case 67:{
            planets = []
            clearBackground()
            break;
        }
        case 82:{
            planets = []
            clearBackground()
            for(let i=0;i<3000;i++){
                planets.push(
                    {
                        m:Math.max(Math.random()*20,1),
                        v_x:(Math.random()-0.5)*17,
                        v_y:(Math.random()-0.5)*17,
                        x:Math.random()*canvas.width,
                        y:Math.random()*canvas.height,
                        radius:Math.max(Math.random()*10,5),
                        color:getRandomColor()
                    }
                )
            }
        }
        case 37:{
            planets.forEach(value=>value.x+=10)
            break;
        }
        case 38:{
            planets.forEach(value=>value.y+=10)
            break;
        }
        case 39:{
            planets.forEach(value=>value.x-=10)
            break;
        }
        case 40:{
            planets.forEach(value=>value.y-=10)
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
        clearBackground() // comment to draw path
        step()
    }
        
})
