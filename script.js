
'use strict'

let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight


let earth = {
    m:1,
    v_x:1.4,
    v_y:1,
    x:canvas.width/2,
    y:canvas.height/2 - 150,
    radius:10,
    color:'green'
}

let sun = {
    m:earth.m*400,
    v_x:0,
    v_y:0,
    x:canvas.width/2,
    y:canvas.height/2,
    radius:20,
    color:'yellow'
}

function clearBackground(){
    context.fillStyle = 'black'
    context.fillRect(0,0,canvas.width,canvas.height)
}

function calculate(){
    let rad = Math.sqrt(Math.pow(sun.x-earth.x,2) + Math.pow(sun.y-earth.y,2))
    let a = sun.m/(rad*rad)
    //let a = 1/(rad)
    //let a = 1
    //let a = 40200/(rad*rad*rad) // -200 from sun
    let cos = (sun.x-earth.x)/rad
    let sin = (sun.y-earth.y)/rad
    let v_a_x = a * cos
    let v_a_y = a * sin
    earth.v_x += v_a_x
    earth.v_y += v_a_y
    earth.x += earth.v_x
    earth.y += earth.v_y
}
function drawCircle(x,y,radius,startAngle,endAngle,color){
    context.beginPath()
    context.fillStyle = color
    context.arc(x,y,radius,startAngle,endAngle)
    context.fill()
    context.closePath()
}
clearBackground()
setInterval(function(){
    //clearBackground()
    drawCircle(sun.x,sun.y,sun.radius,0,Math.PI*2,sun.color)
    drawCircle(earth.x,earth.y,earth.radius/5,0,Math.PI*2,earth.color)
    calculate()
},)
