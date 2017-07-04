//xtd
var container, projector, mouse = {x:0, y:0};
var targetList = [];
var renderer;
var width,height;
var scene;
var light;
var camera;
var orbitControl;
var pipeArrayWithInfo = new Array();

function initRenderer()
{
    width = document.getElementById("main-canvas").clientWidth;
    height = document.getElementById("main-canvas").clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.domElement.setAttribute("id", "threeCanvas");
    renderer.setSize(width,height);
    // renderer.setClearColor(0x000000, 1.0);
    container = document.getElementById('main-canvas');
    container.appendChild(renderer.domElement);

}

function initScene()
{
    scene = new THREE.Scene();
}

function initLight()
{
    light = new THREE.DirectionalLight(0xaaaaaa, 1.0, 0);
    light.position.set(500, 500, 500);
    scene.add(light);

    var directionalLight = new THREE.DirectionalLight(0xaaaaaa, 1.0, 0);
    directionalLight.position.set(-500, -500, -500);
    scene.add(directionalLight);

    var ambientLight = new THREE.AmbientLight(0xaaaaaa, 1);
    //scene.add(ambientLight);

    var spotLight = new THREE.SpotLight(0xffffff, 1, 1000);
    spotLight.position.set(200, 200, 200);
    //scene.add(spotLight);

    light = null;
    directionalLight = null;
    ambientLight = null;
    spotLight = null;
}

function initCamera()
{
    camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
    // camera.position.x = 400;
    // camera.position.y = 400;
    // camera.position.z = 0;
    camera.position.x = 0;
    camera.position.y = 3000;
    camera.position.z = 0;
    //camera.lookAt(new THREE.Vector3(300, 300, 300));
    camera.lookAt(new THREE.Vector3(200, 0, 0));
    scene.add(camera);

}

function initOrbitControl()
{
    orbitControl = new THREE.OrbitControls(camera,renderer.domElement);
    orbitControl.addEventListener("change", render);

}

function addAxis()
{
    var cube = new THREE.CubeGeometry(100,100,100,5,5,5);
    var matrial = new THREE.MeshLambertMaterial({
        color: 0x0000ff

    });

    var cubeMesh = new THREE.Mesh(cube, matrial);
    cubeMesh.position.x = 0;
    cubeMesh.position.y = 0;
    cubeMesh.position.z = 200;
    //scene.add(cubeMesh);

    var axisLength = 600;   //Lenth of Axis
    var linex = new THREE.Geometry();
    linex.vertices.push(new THREE.Vector3(0, 0, 0));
    linex.vertices.push(new THREE.Vector3(axisLength, 0, 0));
    var liney = new THREE.Geometry();
    liney.vertices.push(new THREE.Vector3(0, 0, 0));
    liney.vertices.push(new THREE.Vector3(0, axisLength, 0));
    var linez = new THREE.Geometry();
    linez.vertices.push(new THREE.Vector3(0, 0, 0));
    linez.vertices.push(new THREE.Vector3(0, 0, axisLength));
    var xline = new THREE.Line(linex, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    scene.add(xline);
    var yline = new THREE.Line(liney, new THREE.LineBasicMaterial({ color: 0x00ff00}));
    scene.add(yline);
    var zline = new THREE.Line(linez, new THREE.LineBasicMaterial({ color: 0x0000ff}));
    scene.add(zline);

    linex =null;liney=null;linez=null;
    xline=null;yline=null;zline=null;
    cube=null;matrial=null;cubeMesh=null;
}

function addPipeWithInfoArray(pipeArrayWithInfo)
{
    for (var currentpipe = 0; currentpipe < pipeArrayWithInfo.length; currentpipe++)
    {
        var pipe = pipeArrayWithInfo[currentpipe];
        for (var currentpoint = 0; currentpoint < pipe.points.length - 1; currentpoint++)
        {
            var color;
            if(pipe.info.name == "下水管道"){
                color = "#EAC100";
            }else if(pipe.info.name == "电缆线"){
                color = "#80FFFF";
            }
            if(pipe.info.status ==0) color = "#FF0000";
            addSingleTubeWithUserData(pipe.points[currentpoint], pipe.points[currentpoint + 1],pipe.info,color);
        }
    }
}

//function add single tube with userData
function addSingleTubeWithUserData(start,end,userData,color)
{
    if(color == null || color == undefined) color = 0x00ffaa;
    //根据空间向量为起点终点各自额外增加一个半径的长度
    var x,y,z;
    x = end.x - start.x;
    y = end.y - start.y;
    z = end.z - start.z;
    var mo = Math.sqrt(x*x+y*y+z*z);
    var start_r = new THREE.Vector3(start.x-x/mo*2,start.y-y/mo*2,start.z-z/mo*2);
    var end_r = new THREE.Vector3(end.x+x/mo*2,end.y+y/mo*2,end.z+z/mo*2);

    var linecurve = new THREE.LineCurve(start_r, end_r);
    var lineGeometry = new THREE.TubeGeometry(linecurve, 100, 30, 20, false);

    var lineMesh = new THREE.Mesh(lineGeometry, new THREE.MeshLambertMaterial({
        opacity: 0.9,
        transparent: false,
        side: THREE.DoubleSide,
        color:color
    }));

    if(userData != null && userData!=undefined){
        lineMesh.userData = userData;
    }
    scene.add(lineMesh);
    targetList.push(lineMesh);

    start_r=null;end_r=null;linecurve=null;lineGeometry=null;lineMesh=null;
}


function render()
{
    renderer.render(scene, camera);
}


function JsonParseWithInfo(json,pipeArrayWithInfo)
{
    var originpoint = json.currentLoction;
    var newpoint;
    var xpos = 0;
    var ypos = 0;
    var pointArray;
    var zoomsize = 1000000;

    while(pipeArrayWithInfo.length!=0){
        pipeArrayWithInfo.pop();
        targetList.pop();
    }

    for (var currentpipe = 0; currentpipe < json.pipes.length; currentpipe++)
    {
        var pipe = json.pipes[currentpipe];
        var pipeInfo = {};
        pointArray = new Array();
        for (var currentpoint = 0; currentpoint < pipe.points.length; currentpoint++)
        {
            var point = pipe.points[currentpoint];
            xpos = (point.x - originpoint.x)*zoomsize;
            ypos = -(point.y - originpoint.y)*zoomsize;
            newpoint = new THREE.Vector3(xpos, point.z, ypos);
            pointArray.push(newpoint);
        }
        pipeInfo.info = pipe.pipeInfo;
        pipeInfo.points = pointArray;
        pipeArrayWithInfo.push(pipeInfo);
    }
    pointArray=null;newpoint=null;
}

function onDocumentMouseDown( event )
{
    console.log("Click.");

    // update the mouse variable
    // mouse.x = ( event.clientX / width ) * 2 - 1;
    // mouse.y = - ( event.clientY / (height+20) ) * 2 + 1;
    // mouse.x = ( (event.clientX - event.currentTarget.offsetParent.offsetLeft) / width ) * 2 - 1;
    // mouse.y = - ( (event.clientY - event.currentTarget.offsetTop) / (height) ) * 2 + 1;
    mouse.x = ( (event.clientX - event.currentTarget.offsetParent.offsetParent.offsetLeft) / width ) * 2 - 1;
    mouse.y = - ( (event.clientY - event.currentTarget.offsetParent.offsetTop) / (height) ) * 2 + 1;

    // find intersections
    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( targetList );

    // if there is one (or more) intersections
    if ( intersects.length > 0 )
    {
        // change the color of the closest face.
        // alert(intersects[ 0 ].object.userData);
        var curUserData = intersects[ 0 ].object.userData;
        $('#pipe_id').val(curUserData.ID);
        $('#pipe_name').val(curUserData.name);
        $('#pipe_type').val(curUserData.type);
        $('#pipe_status').val(curUserData.status);
        $('#pipe_company').val(curUserData.companyName);
        $("#myModal").modal('show');
    }
    vector=null;ray=null;
}

//当鼠标移动时触发的事件
function onDocumentMouseMove( event ) {
    //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
    event.preventDefault();

    // mouse.x = ( (event.clientX - event.currentTarget.offsetParent.offsetLeft) / width ) * 2 - 1;
    // mouse.y = - ( (event.clientY - event.currentTarget.offsetTop) / (height) ) * 2 + 1;
    mouse.x = ( (event.clientX - event.currentTarget.offsetParent.offsetParent.offsetLeft) / width ) * 2 - 1;
    mouse.y = - ( (event.clientY - event.currentTarget.offsetParent.offsetTop) / (height) ) * 2 + 1;

    //新建一个三维变换半单位向量 假设z方向就是0.5,这样我左右移的时候，还会有前后移的效果
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

    //屏幕和场景转换工具根据照相机，把这个向量从屏幕转化为场景中的向量
    projector.unprojectVector( vector, camera );

    //vector.sub( camera.position ).normalize()变换过后的向量vector减去相机的位置向量后标准化
    //新建一条从相机的位置到vector向量的一道光线
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    //否则的话，光线和所有物体相交，返回相交的物体
    var intersects = raycaster.intersectObjects( targetList );
    //如果有物体相交了
    if ( intersects.length > 0 ) {
        //改变鼠标的样式
        container.style.cursor = 'pointer';
    } else {
        //改变鼠标的样式
        container.style.cursor = 'auto';
    }
    vector=null;raycaster=null;
}

function release(){
    // container = null;
    // mouse = {x:0, y:0};
    // renderer = null;
    // width = null;
    // height = null;
    pipeArrayWithInfo = [];
    targetList = [];
    THREE.Cache.clear();
    for ( var i = scene.children.length - 1; i >= 0 ; i -- ) {
        var obj = scene.children[i];
        if(obj.geometry !=null && obj.geometry!=undefined){
            obj.geometry.dispose();
            obj.material.dispose();//don't know if you need these, even
        }
        scene.remove(obj);
        delete(obj);
    }
    scene = undefined;
}
function startThree(DynamicMockJson)
{
    if(scene != null && scene != undefined){
        release();
    }
    initRenderer();
    initScene();
    initLight();
    initCamera();
    initOrbitControl();
    addAxis();
    //parse the json data returned from DataBase
    // JsonParse(mockJson, pipeArray);
    JsonParseWithInfo(DynamicMockJson,pipeArrayWithInfo);
    addPipeWithInfoArray(pipeArrayWithInfo);

    projector = new THREE.Projector();
    // when the mouse moves, call the given function
    // document.getElementById("withThree").addEventListener( 'mousedown', onDocumentMouseDown, false );
    // document.getElementById("withThree").addEventListener( 'mousemove', onDocumentMouseMove, false );

    document.getElementById("main-canvas").addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.getElementById("main-canvas").addEventListener( 'mousemove', onDocumentMouseMove, false );

    renderer.render(scene, camera);
}
