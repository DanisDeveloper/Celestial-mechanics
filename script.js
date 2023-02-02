
'use strict'

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let planets =[]
let isDrawing = true

let earth = {
    m:1,
    v_x:2,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2 - 100,
    radius:5,
    color:'aqua'
}

let sun = {
    m:700,
    v_x:0,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2,
    radius:20,
    color:'yellow'
}

let moon = {
    m:0.3,
    v_x:1.3,
    v_y:1,
    x:canvas.width/2,
    y:canvas.height/2 - 200,
    radius:5,
    color:'gray'
}

let mars = {
    m:1.5,
    v_x:-1,
    v_y:1.3,
    x:canvas.width/2+200,
    y:canvas.height/2 + 150,
    radius:5,
    color:'red'
}

let venere = {
    m:1,
    v_x:1.5,
    v_y:0.5,
    x:canvas.width/2-200,
    y:canvas.height/2 + 150,
    radius:5,
    color:'orange'
}


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
    var letters = '23456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let start;
addEventListener('mousedown',function(event){
    start = {
        x:event.clientX,
        y:event.clientY
    }
    //console.log(`start (${start.x},${start.y})`)
    //drawCircle(start.x,start.y,10,0,Math.PI*2,'yellow')
})
addEventListener('mouseup',function(event){
    let end = {
        x:event.clientX,
        y:event.clientY
    }
    console.log(`end (${end.x},${end.y})`)
    console.log(`start (${start.x},${start.y})`)
    let m_r = Math.random()*5
    planets.push({
        m:m_r,
        v_x:(end.x-start.x)/200,
        v_y:(end.y-start.y)/200,
        x:start.x,
        y:start.y,
        radius:m_r*10,
        color:getRandomColor()
    })
    
})

//planets.push(sun)
//planets.push(earth)
//planets.push(moon)
//planets.push(mars)
//planets.push(venere)
clearBackground()
setInterval(function(){
    clearBackground() // comment to draw path
    if(isDrawing)
        step()
},)
