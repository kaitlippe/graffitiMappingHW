//camera
var viewAngle = 75;
var aspectRatio = window.innerWidth / window.innerHeight; //fits the width/height of window open
var near = 0.1; 
var far = 40000;
var container;

var clock = new THREE.Clock();

var cube;
var group; 
var cubeArray = [];
var countCubes = -1;

var projector, mouse = { x: 0, y: 0 }, INTERSECTED;

var cameraOrbit = false;

//for drawing cubes
var cityWidth = 2000;
var buildingHeight = 100;
var buildingsAcross = 10;
var bldgIncrement = 1/buildingsAcross;

//always need these three
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();

var pointLight = new THREE.PointLight(0xFFFFFF); 
var skyColor = new THREE.Color(1, 1, 1);
renderer.setClearColor(skyColor, 1);


renderer.setSize(window.innerWidth, window.innerHeight);//give renderer a size 
document.body.appendChild(renderer.domElement); //add to dom to make it appear

//call function
init();
animatedRender();

//setup function 
function init() {
	window.addEventListener('resize', onWindowResize, false); //need another event listener for resizing window
	
	//camera
	camera.position.z = 1500;
	camera.position.y = 1500;
	camera.lookAt(new THREE.Vector3(0, 0, 0)); //have to declare new vector (0, 0 ,0) to look at 
	scene.add(camera); //add camera

	container = document.getElementById('ThreeJS');
	container.appendChild( renderer.domElement );

	//light
	pointLight.position.x = 0;
	pointLight.position.y = 50;
	pointLight.position.z = 150;
	scene.add(pointLight);

	createCube();

	projector = new THREE.Projector();

	document.addEventListener('mousemove', onDocumentMouseMove, false); //mousemove event, function, bool
}

function createCube(){
	var cubeGeometry = new THREE.BoxGeometry(100, 100, 100, 100);

	var material = new THREE.MeshStandardMaterial( {
			vertexColors: THREE.FaceColors
		})

	// cube = new THREE.Mesh(cubeGeometry, material);
	// cube.position.set(0, 0, 0);
	// scene.add(cube)

	group = new THREE.Group();

	for(var i = 0; i <1; i+=bldgIncrement){ //z axis
		for(var j = 0; j <1; j+=bldgIncrement){ //x axis
			countCubes++;
			cube = new THREE.Mesh(cubeGeometry, material); 
			cube.position.x = j * cityWidth - (cityWidth*0.5);
			cube.position.y = buildingHeight*0.5;
			cube.position.z = i * cityWidth - (cityWidth*0.5);

			cube.updateMatrix(); //so its updated
			
			cubeArray.push(cube);
			console.log(cubeArray);
			scene.add(cubeArray[countCubes]);

			// group.add(cubeArray[countCubes]);
		}
	}
	// scene.add(group);
	
}

var frameCount = 0;

//your draw loop of sorts
function animatedRender(){ //another way
	requestAnimationFrame(animatedRender); //function built into js api
	renderer.render(scene, camera);
	update();
	frameCount++;

	// if(cameraOrbit){
	// 	var camDistance = 1500;
	// 	var camPosX = camDistance*Math.sin(frameCount*0.005);
	// 	var camPosY = maxBldgHeight;
	// 	var camPosZ = camDistance*Math.cos(frameCount*0.005);

	// 	camera.position.set(camPosX, camPosY, camPosZ);

	// 	camera.lookAt(new THREE.Vector3(0, maxBldgHeight, 0));
	// }

	// frameCount++;	
	
}


/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/
function update() {
	var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
	projector.unprojectVector(vector, camera);
	var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var intersects = ray.intersectObjects(scene.children);

	// if there is one (or more) intersections
	if (intersects.length > 0) {
    	// if the closest object intersected is not the stored intersection object
    	if (intersects[0].object != INTERSECTED) {
        	// restore previous intersection object (if it exists) to its original color
        	if (INTERSECTED) {
            	INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        	}
        	// store reference to closest object as current intersection object
        	INTERSECTED = intersects[0].object;
        	// store color of closest object (for later restoration)
        	INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
        	// set a new color for closest object
        	INTERSECTED.material.color.setHex(0xffff00);
   		}
	} else {
    	// restore previous intersection object (if it exists) to its original color
    	if (INTERSECTED) {
        	INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    	}
    	// remove previous intersection object reference
    	//     by setting current intersection object to "nothing"
    	INTERSECTED = null;
	}
}

function onDocumentMouseMove(event){
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
