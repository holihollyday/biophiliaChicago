const flock = [];
var obs;
var canvas;
var clat = 41.7745;
var clon = -87.7504;

var lat = 41.7745;
var lon = -87.7504;

var zoom = 8;

var dataLimiter = 25;

var opacity;
//https://api.ebird.org/v2/data/obs/US-IL/recent
var ebirdUrl = 'https://api.ebird.org/v2/data/obs/geo/recent?lat='+clat+'&lng='+clon+'&dist=50&key=tsqff550l2u8'; 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function preload() {
 // mapimg = loadImage(mapUrl);
  loadJSON(ebirdUrl, gotData, "JSON");
}

function gotData(data) {
  obs = data;
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI/4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function setup() {
  noStroke();
  canvas = createCanvas(windowWidth, windowHeight);
  translate(width/2, height/2);

  // background(250,250,250,20);
  var cx = mercX(clon);
  var cy = mercY(clat);
  
  var x = mercX(lon) - cx;
  var y = mercY(lat) - cy;
  
  
  for (var i = 0; i < obs.length; i++) { // obs.length for entire set
    var lat = obs[i].lat;
    var lon = obs[i].lng;
    var birdMag = obs[i].howMany;
    // console.log(obs[i].comName);
    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;

    flock.push(new Boid(x, y, obs[i].howMany));
  }

  console.log("# of boids: " + flock.length);
  /*
  for (let i = 0; i < 100; i++) {
   flock.push(new Boid(0, 0));
   }
   */
}

function drawMapData() {
  noStroke();
  translate(width/2, height/2);
  opacity = 40;
  background(50, 50, 60,opacity);
  // for (var j = opacity; j > 0; j--) {
  //   background(50, 50, 60,j);
  //   console.log(j);
  // }
  

  var cx = mercX(clon);
  var cy = mercY(clat);

  for (var i = 0; i < obs.length; i++) {
    var lat = obs[i].lat;
    var lon = obs[i].lng;
    var birdMag = obs[i].howMany;
    
    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;
    
    //mapping acccuracy check
    // fill(255,255,255);
    // ellipse(x,y, 20,20);
  }
 // textAlign(LEFT);
 // text("lat&long: "+ clat + "," + clon, -width/2 + 20, height/2 - 20);
}

function draw() {
  drawMapData();
  

//   let sWidth=0;
//   let padding=40;
  
//   fill(255,255,255);
//   var info ="*Listed are the most recently observed bird species in Illinois, US. Updates every 30 days.";
//   text(info ,-windowWidth*0.17+30, windowHeight/2-40);
  
//   for (var i = 0; i < 5; i++) { // obs.length for entire set
//     var bird = obs[i].comName;
//     var listOfColors = ['#b1b175','#ccccff','#cc9999','#fe3fa2','#fe3fa2'];
//     fill(255,255,255);
//     text(bird ,-windowWidth*0.17+ i*padding + sWidth, windowHeight/2-60);
    
//     fill(listOfColors[i]);
//     rect(-windowWidth*0.17-15 + i*padding + sWidth, windowHeight/2-70, 10, 10, 2);
    
//     sWidth = sWidth + textWidth(bird);
//     // console.log(sWidth);
   
//}
  
  // boid functions go here buddy
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}
