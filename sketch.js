var poseNet;
var video;
var vw, vh;
var ready=false;
var face;
var data=null;
var hoh;
var moved;
var prevPos, currPos;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video=createCapture(VIDEO);
  video.hide();
  poseNet=ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  face=new Face();
  moved=createVector(0,0);
  prevPos=createVector(width/2, height/2);
  currPos=createVector(width/2, height/2);
  hoh=new HeadOfHair(100,15);
  colorMode(HSB);
}

function draw() {
  vw=video.width;
  vh=video.height;
  background(50);
  // push();
  // scale(-0.3,0.3);
  // image(video,-width,0);
  // pop();
  if(ready){
    // face.showPoints(0,0,0.3);
    // face.show(width/2, height/2);
    var faceGeom=face.getGeom(width/vw, height/vh);
    if(faceGeom && faceGeom.a){
      currPos.x=faceGeom.x;
      currPos.y=faceGeom.y;
      moved=p5.Vector.sub(currPos, prevPos).mult(0.1);
      prevPos=currPos.copy();
      push();
      scale(-1,1);
      translate(-width,0);
      // tint(255,100);
      image(video,0,0, width, height);
      pop();
      maskFace(width-faceGeom.x, faceGeom.y, faceGeom.w, faceGeom.h);
      hoh.show(width-faceGeom.x, faceGeom.y, faceGeom.w/2, faceGeom.a, moved.mult(2));
      push();
      fill(50+frameCount%360,90,80,0.5);
      stroke(60+frameCount%360,90,80,1);
      strokeWeight(faceGeom.w*0.05);
      ellipse(width-faceGeom.eyes[0].x,faceGeom.eyes[0].y,0.6*faceGeom.w/2);
      ellipse(width-faceGeom.eyes[1].x,faceGeom.eyes[1].y,0.6*faceGeom.w/2);
      
      translate(width-faceGeom.x, faceGeom.y);
      noStroke();
      fill(frameCount%360,90,80,0.5);
      ellipse(0,0,0.4*faceGeom.w/2);
      pop();
    }
    // push();
    // scale(-0.3,0.3);
    // image(video,-vw,0);
    // pop();
    // face.showPoints(0,0,0.3);
  }

}

function maskFace(x,y,w,h){
  push();
  noStroke();
  fill(0,0,100,0.9);
  beginShape();
  vertex(0,0);
  vertex(width,0);
  vertex(width, height);
  vertex(0,height);
  beginContour();
  var a,ax,ay;
  for(var i=0; i<20; i++){
    a=TWO_PI-i*TWO_PI/20;
    ax=cos(a)*w/2;
    ay=sin(a)*w/2;
    vertex(x+ax, y+ay);
  }
  endContour();
  endShape(CLOSE);
  pop();
}

function modelReady(){
  console.log("poseNet ready");
  ready=true;
}

function gotPoses(poses){
  // console.log(poses);
  data=poses;
  face.refreshPoints(poses[0]);
  // face.updatePoints();
}

function Face(){
  var nose=[{x: 0, y: 0}];
  var eyes=[{x: 0, y: 0}, {x: 0, y: 0}];
  var ears=[{x: 0, y: 0}, {x: 0, y: 0}];
  var noseIn, eyesIn, earsIn;
  var w;
  var midEyes;
  var noseToMidEyes;
  var h;
  var a;
     
  
  this.refreshPoints=function(data){
    // console.log(data);
    if(data && data.pose){
      var kp=data.pose.keypoints;
      noseIn=[{x: kp[0].position.x, y: kp[0].position.y}];
      eyesIn=[{x: kp[1].position.x, y: kp[1].position.y}, {x: kp[2].position.x, y: kp[2].position.y}];
      earsIn=[{x: kp[3].position.x, y: kp[3].position.y}, {x: kp[4].position.x, y: kp[4].position.y}];
      // w=dist(ears[0].x, ears[0].y, ears[1].x, ears[1].y);
      // midEyes={x: (eyes[0].x+eyes[1].x)/2, y: (eyes[0].y+eyes[1].y)/2};
      // noseToMidEyes=dist(nose[0].x, nose[0].y, midEyes.x, midEyes.y);
      // h=noseToMidEyes*7;
      // a=acos((midEyes.x-nose[0].x)/noseToMidEyes)-PI/2;
      // //a=atan2(nose[0].y-midEyes.y, nose[0].x-midEyes.x);
      this.easePoints(0.3);
    }
  };
  
  this.easePoints=function(ease){
    if(noseIn && noseIn[0]){
      nose[0].x=nose[0].x+(noseIn[0].x-nose[0].x)*ease;
      nose[0].y=nose[0].y+(noseIn[0].y-nose[0].y)*ease;
      eyes[0].x=eyes[0].x+(eyesIn[0].x-eyes[0].x)*ease;
      eyes[0].y=eyes[0].y+(eyesIn[0].y-eyes[0].y)*ease;
      eyes[1].x=eyes[1].x+(eyesIn[1].x-eyes[1].x)*ease;
      eyes[1].y=eyes[1].y+(eyesIn[1].y-eyes[1].y)*ease;
      ears[0].x=ears[0].x+(earsIn[0].x-ears[0].x)*ease;
      ears[0].y=ears[0].y+(earsIn[0].y-ears[0].y)*ease;
      ears[1].x=ears[1].x+(earsIn[1].x-ears[1].x)*ease;
      ears[1].y=ears[1].y+(earsIn[1].y-ears[1].y)*ease;
      // eyes=eyesIn;
      // ears=earsIn;
       w=dist(ears[0].x, ears[0].y, ears[1].x, ears[1].y);
        midEyes={x: (eyes[0].x+eyes[1].x)/2, y: (eyes[0].y+eyes[1].y)/2};
        noseToMidEyes=dist(nose[0].x, nose[0].y, midEyes.x, midEyes.y);
        h=noseToMidEyes*7;
        a=acos((midEyes.x-nose[0].x)/noseToMidEyes)-PI/2;
    }
  };

  this.showPoints=function(x,y,sc){
    var pointSize=50;
    push();
    translate(x,y);
    scale(-sc, sc);
    translate(-width,0);
    fill(200,100,80,0.7);
    noStroke();
    ellipse(nose[0].x, nose[0].y, pointSize);
    ellipse(ears[0].x, ears[0].y, pointSize);
    ellipse(ears[1].x, ears[1].y, pointSize);
    ellipse(eyes[0].x, eyes[0].y, pointSize);
    ellipse(eyes[1].x, eyes[1].y, pointSize);
    pop();
  };
  
  this.getGeom=function(sclx, scly){
    this.easePoints(0.3);
    // var w=dist(ears[0].x, ears[0].y, ears[1].x, ears[1].y);
    // var midEyes={x: (eyes[0].x+eyes[1].x)/2, y: (eyes[0].y+eyes[1].y)/2};
    // var noseToMidEyes=dist(nose[0].x, nose[0].y, midEyes.x, midEyes.y);
    // var h=noseToMidEyes*5;
    // var a=atan2(eyes[1].y-eyes[0].y, eyes[1].x-eyes[0].x);
    return {
      x: nose[0].x*sclx,
      y: nose[0].y*scly,
      w: w*sclx,
      h: h*scly,
      a: a,
      eyes: [{
        x:eyes[0].x*sclx,
        y:eyes[0].y*scly
      },{
        x:eyes[1].x*sclx,
        y:eyes[1].y*scly
      }]
    }
  }
  
  this.show=function(){
    
  };
}

function HeadOfHair(nh, ns){
  var hairs=[];
  var tache=[];
   
  for(var i=0; i<nh; i++){
    hairs[i]=new Hair(width/2, height/2, ns, -PI/2-PI*0.75+(i+0.5)*1.5*PI/nh);
  }
  
  for(var i=0; i<floor(nh/4); i+=2){
    tache[i]=new Hair(width/2, height/2, i/2+2, PI/2-PI*0.1-(i)*0.2*PI/(floor(nh/8)));
    tache[i+1]=new Hair(width/2, height/2, i/2+2, PI/2+PI*0.1+(i)*0.2*PI/(floor(nh/8)));
  }
  
  this.show=function(x,y,rad,aToMouse, moved){
    hairs.forEach(function(hair){
      hair.show(x,y,rad,aToMouse,moved);//(aToMouse+PI/2) (aToMouse+PI/2),aForce
    });
    tache.forEach(function(hair){
      hair.show(x,y,rad/4,aToMouse,moved);//(aToMouse+PI/2) (aToMouse+PI/2),aForce
    });
  };
  
}

function Hair(baseX, baseY, numSegs,startA){
  var segs=[];
  var currentA=startA;
  var aDiff=0;
  var prevA=0;
  var rad=50;
  numSegs=floor(random(numSegs/2, numSegs));
  var t=random(5,10);
  var l=random(12,20);
  var r=random(PI/10, PI/20);
  var thinner=0.9;
  var longer=1.1;
  for(var i=0; i<numSegs; i++){
    segs.push(new Seg(l,t,r));
    t*=thinner;
    l*=longer;
  }
  var hCol=random(0,50);
  var hSat=random(30,90);

  this.show=function(xPos, yPos, rad, ang, vel){
    push();
    var res={
      x: xPos+cos(ang+startA)*rad,
      y: yPos+sin(ang+startA)*rad,
      a: ang+startA,
      aVel: vel.heading(),//*vel.mag()*10//aDiff*2000//(noise(frameCount/10)-0.5)*PI*10
      aVelMag: vel.mag()
    };
    currentA=res.a;
    segs.forEach(function(seg){
      res=seg.update(res.x, res.y, res.a, res.aVel, res.aVelMag);
      seg.show(hCol, hSat);
    });
    aDiff=currentA-prevA;
    prevA=currentA;
    pop();
    hCol=(hCol+2)%360;
  };
}

function Seg(len,t,range){
  var velMax=0.08;
  var friction=0.5;
  var nextAcc=0;
  var nextAccMag=0;
  var myA=0;
  var myAcc=0;
  var myAVel=0;
  var x, y, givenA;
  var gravA=PI/2;
  
  this.update=function(gx,gy,givenA,aVelGiven,aVelMag){
    x=gx;
    y=gy;
    baseA=givenA;
    nextAcc=aVelGiven;
    nextAccMag=aVelMag;
    myAVel+=myAcc;
    myAVel=constrain(myAVel, -velMax, velMax);
    myAVel*=friction;
    myA+=myAVel;
    myA=constrain(myA,-range, range);
    myAcc=0;
    myAcc+=wrapAtPi((nextAcc-(givenA+myA)))*aVelMag/50;
    myAcc+=wrapAtPi(gravA-(givenA+myA))/50;
    return {
      x: x+cos(givenA+myA)*len,
      y: y+sin(givenA+myA)*len,
      a: givenA+myA,
      aVel: nextAcc,
      aVelMag: aVelMag
    };
  };
  
  this.show=function(hCol, hSat){
    push();
    translate(x,y);
    rotate(baseA);
    rotate(myA);
    stroke(hCol, hSat,80);
    strokeWeight(t);
    line(0,0,len,0);
    pop();
  }
}

function wrapAtPi(a){
  if(a>=PI) return -TWO_PI+a;
  if(a<-PI) return TWO_PI+a;
  return a;
}