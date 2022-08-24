// Theming
var lineColorOpacity = "0.3";
var lineColor = "rgba(17, 17, 17, " + lineColorOpacity +")";
var backgroundColor = "#FFF";

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     ||  
      function( callback ){
      window.setTimeout(callback, 1000 / 60);
      };
})();

// Initializing the canvas
// I am using native JS here, but you can use jQuery, 
// Mootools or anything you want
var canvas = document.getElementById("matrix");

// Initialize the context of the canvas
var ctx = canvas.getContext("2d");

// Set the canvas width to occupy full window
// Set the canvas heigth to stopage point
var stopPoint = document.querySelector('section').getBoundingClientRect().y; 
var W = window.innerWidth;
var H = stopPoint;
canvas.width = W;
canvas.height = H;
var m = {x: 0, y:0};

//Get Mouse position
canvas.addEventListener( 'mousemove', function(e) {

  bounds = canvas.getBoundingClientRect();
  m.x = e.clientX - bounds.left;
  m.y = e.clientY - bounds.top;
  
});

// Some variables for later use
var particles = [],
  particleCount = 100,
  dist;
if (window.innerWidth < 600) {
    minDist = 50;
} else {
    minDist = 70;
}
// Function to paint the canvas black
function paintCanvas() {    
  // This will create a rectangle of white color from the 
  // top left (0,0) to the bottom right corner (W,H)
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0,0,W,H);
}

// Now the idea is to create some particles that will attract
// each other when they come close. We will set a minimum
// distance for it and also draw a line when they come
// close to each other.

// The attraction can be done by increasing their velocity as 
// they reach closer to each other

// Let's make a function that will act as a class for
// our particles.

function Particle() {
  // Position them randomly on the canvas
  // Math.random() generates a random value between 0
  // and 1 so we will need to multiply that with the
  // canvas width and height.
  this.x = Math.random() * W;
  this.y = Math.random() * H;

  // Now the radius of the particles. I want all of 
  // them to be equal in size so no Math.random() here..
  this.radius = 3;
  
  // We would also need some velocity for the particles
  // so that they can move freely across the space
  this.maxX = W - this.radius;
  this.maxY = H - this.radius;

  this.targetX = Math.random() * this.maxX;
  this.targetY = Math.random() * this.maxY;

  var speed = Math.random() * 2000 + 2000;
  this.vx = (this.targetX - this.x) / speed;
  this.vy = (this.targetY - this.y) / speed;
  
  // This is the method that will draw the Particle on the
  // canvas. It is using the basic fillStyle, then we start
  // the path and after we use the `arc` function to 
  // draw our circle. The `arc` function accepts four
  // parameters in which first two depicts the position
  // of the center point of our arc as x and y coordinates.
  // The third value is for radius, then start angle, 
  // end angle and finally a boolean value which decides
  // whether the arc is to be drawn in counter clockwise or 
  // in a clockwise direction. False for clockwise.
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = lineColor;
    
    // Fill the color to the arc that we just created
    ctx.fill();
  }
}

// Time to push the particles into an array
for(var i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

// Function to draw everything on the canvas that we'll use when 
// animating the whole scene.
function draw() {
  
  // Call the paintCanvas function here so that our canvas
  // will get re-painted in each next frame
  paintCanvas();
  
  // Call the function that will draw the balls using a loop
  for (var i = 0; i < particles.length; i++) {
    p = particles[i];
    p.draw();
  }
  
  //Finally call the update function
  update();
}

// Give every particle some life
function update() {
  
  // In this function, we are first going to update every
  // particle's position according to their velocities
  if(runAnimation) {
    for (var i = 0; i < particles.length; i++) {
      p = particles[i];
      popClose(p, m, i);

      if(p.frozen ){
        p.radius = 10;
      }

      if (!p.frozen) {

        //Set default velocity
        p.radius = 3;
      
        // Change the velocities
        p.x += p.vx;
        p.y += p.vy;
          
        // We don't want to make the particles leave the
        // area, so just change their position when they
        // touch the walls of the window
        
        if (p.x > W || p.x < 0 ) {
           p.vx = -p.vx;
           p.x += p.vx;
        } else if (p.y > H || p.y < 0) {
           p.vy = -p.vy;
           p.y += p.vy
        }
      }

      // Now we need to make them attract each other
      // so first, we'll check the distance between
      // them and compare it to the minDist we have
      // already set
      
      // We will need another loop so that each
      // particle can be compared to every other particle
      // except itself
      for(var j = i + 1; j < particles.length; j++) {
        p2 = particles[j];
        distance(p, p2);
      }
    }    
  }
}

// Distance calculator between two particles
function distance(p1, p2) {
  var dist,
    dx = Math.abs(p1.x - p2.x);
    dy = Math.abs(p1.y - p2.y);
  
  dist = Math.sqrt(dx*dx + dy*dy);
      
  // Draw the line when distance is smaller
  // then the minimum distance
  
  if(dist <= minDist) {
    
    // Draw the line
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.closePath();
    
    // Some acceleration for the partcles 
    // depending upon their distance
    //ax = ay = 1;
    
    // Apply the acceleration on the particles
    /*function accerelate(p) {
        p.vx = Math.sqrt(p.vx*p.vx + 2*ax) * Math.sign(p.vx)
        p.vy = Math.sqrt(p.vy*p.vy + 2*ay) * Math.sign(p.vy)
    }
    accerelate(p1);
    accerelate(p2)*/
  }
}

var closestIndex;

function popClose(p, m, i) {
  var dist,
    dx = Math.abs(p.x - m.x);
    dy = Math.abs(p.y - m.y);

  dist = Math.sqrt(dx*dx + dy*dy);
      
  // Draw the line when distance is smaller
  // then the minimum distance
  if(dist <= p.radius * 1.5) {
    closestIndex = i;
    particles[closestIndex].frozen = true;
  }

  else {
    if ( closestIndex != undefined ) {
      particles[closestIndex].frozen = false;
    }
  }
}

canvas.addEventListener('mousedown', function(e){
  defaultRadius = 3;
  var links= ["model", "market-pains", "ds-solutions", "history", "clients"]
  var link = Math.floor(Math.random() * 4);

  if ( defaultRadius < particles[closestIndex].radius) {
    $(document.body).animate({
        'scrollTop':   $('#' + links[link]).offset().top
    }, 500);
  }
});

// Start the main animation loop using requestAnimFrame
window.animloop = function () {

  lineColorOpacity = "0.3";

  if (window.innerWidth < 600) {
    lineColorOpacity = "0.15";
  }

  lineColor = "rgba(17, 17, 17, " + lineColorOpacity +")";
  backgroundColor = "#FFF";

  if (document.documentElement.dataset.theme && document.documentElement.dataset.theme === "dark") {
    lineColor = "rgba(255,255,255," + lineColorOpacity +")";
    backgroundColor = "#111111";
  }


  draw();
  requestAnimFrame(animloop);
}


//Custom functions
var runAnimation = true;

animloop();
//I tried to make the canvas responsive without refreshing... but...😥😢
window.addEventListener('resize', function(event){
  var stopPoint = document.querySelector('section').getBoundingClientRect().y; 
  var W = window.innerWidth;
  var H = stopPoint;
  canvas.width = W;
  canvas.height = H;
  particles = []
  for(var i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
});