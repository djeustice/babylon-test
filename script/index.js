const canvas = document.getElementById("renderCanvas"); 
const engine = new BABYLON.Engine(canvas, true); 

const createScene = function () {
    // Create Scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);

    // Create top-down Camera and lock it
    const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 0, 0));
    camera.lowerRadiusLimit = 50;
    camera.upperRadiusLimit = 50;

    // Create Directional Light
    const dirLight = new BABYLON.DirectionalLight("DirectionalLight", 
        new BABYLON.Vector3(0, 5, -6), scene);
        dirLight.intensity = 0.75;

    // Create Hemi Light
    const hemiLight = new BABYLON.HemisphericLight("HemiLight", 
        new BABYLON.Vector3(0, 0, 0), scene);
        hemiLight.intensity = 0.5;
   
    // Create the Sphere Material
    const sphereMaterial = new BABYLON.StandardMaterial(scene);
    sphereMaterial.diffuseColor = new BABYLON.Color3(0.621, 0.79, 1);
    sphereMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    // Create Green Material
    const greenMaterial = new BABYLON.StandardMaterial(scene);
    greenMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.85, 0.4);

    // Create Yellow Material
    const yellowMaterial = new BABYLON.StandardMaterial(scene);
    yellowMaterial.diffuseColor = new BABYLON.Color3(1, 1, 0);

    // Create Salmon Material    
    const salmonMaterial= new BABYLON.StandardMaterial("redMat", scene);
	salmonMaterial.diffuseColor = new BABYLON.Color3(1, 0.43, 0.26);        

    // Create the Sphere
    const sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 3, scene);
    sphere.position = new BABYLON.Vector3(11, -5, 0); 
    sphere.material = sphereMaterial; 
    
    let currentPosition = sphere.position;
        console.log(currentPosition);

    // Drag Sphere on X,Z axis
    //const drag = new BABYLON.PointerDragBehavior(
    //    { dragPlaneNormal: new BABYLON.Vector3(0, 0, 1) });

    // Drag Sphere straight line
    const drag = new BABYLON.PointerDragBehavior(
        {dragAxis: new BABYLON.Vector3(1,-1,0)});

    drag.useObjectOrientationForDragging = false;
    drag.onDragStartObservable.add((event)=>{
        //console.log(event);
        console.log(sphere.position);
    })
    drag.onDragObservable.add((event)=>{
    })
    drag.onDragEndObservable.add((event)=>{
        box.material = yellowMaterial;
        //console.log("dragEnd");
        console.log(sphere.position);
        arrowAnim();
    })
    sphere.addBehavior(drag);

    // Create the Box
    const box = BABYLON.MeshBuilder.CreateBox("box", 
        {height:3, width: 3, depth: 0}, scene);
    box.position = new BABYLON.Vector3(0, 0, 0); 
    box.material = greenMaterial; 

    // Create the Arrow Procedurally    
    const arrowCone = BABYLON.MeshBuilder.CreateCylinder("arrowCone", {diameterTop: 0, diameterBottom: 2, height: 2});
    const arrowBox = BABYLON.MeshBuilder.CreateBox("arrowBox", {height: 5, depth: 0.5, width: 0.5})
    arrowBox.position.z = 0;
    arrowBox.position.y = -3;

    const arrow2 = BABYLON.Mesh.MergeMeshes([arrowCone, arrowBox]);
    arrow2.position = new BABYLON.Vector3(-10, -5, 0);
    arrow2.material = salmonMaterial;
    
    // Create Arrow Animation
    let startPosition = arrow2.position;
    let endPosition = sphere.position;
    arrowAnim = () => { 
        BABYLON.Animation.CreateAndStartAnimation("arrowAnim", arrow2, "position", 30, 30, startPosition, endPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    }

    // Arrow follow Sphere
    let angle = 0;
    let deltaAngle = 0.015;
    let forward = new BABYLON.Vector3(0, 1, 0);
    let fin = new BABYLON.Vector3(0, 0, -1);
    let side = BABYLON.Vector3.Cross(forward, fin);
    let nextForward = BABYLON.Vector3.Zero();
    let orientation = BABYLON.Vector3.Zero();

    const speed = 0.0;

    scene.onBeforeRenderObservable.add(() => {
        nextForward = sphere.position.subtract(arrow2.position).normalize();
        fin = BABYLON.Vector3.Cross(forward, nextForward);
        forward = nextForward;
        side  = BABYLON.Vector3.Cross(forward, fin);
        orientation = BABYLON.Vector3.RotationFromAxis(side, forward, fin);
        arrow2.rotation = orientation;
        arrow2.position.addInPlace(forward.scale(speed));
        angle += deltaAngle;
    })
/*
    // Create the Arrow (Modeled in 3DS Max)
    BABYLON.SceneLoader.ImportMesh("arrow", "./models/", "arrow.glb", scene, 
    (newMeshes) => {
        arrow = newMeshes[0]; 
        arrow.position = new BABYLON.Vector3(-15, -5, 0); 

        // Create Arrow Animation
        let startPosition = new BABYLON.Vector3(-20, 0, 0);
        let endPosition = new BABYLON.Vector3(20, 0, 0);
        arrowAnim = () => { 
            BABYLON.Animation.CreateAndStartAnimation("arrowAnim", arrow, "position", 30, 100, startPosition, endPosition, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        }
    }); 
*/
    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
        // Shift+Ctrl+Alt+I
        if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show();
            }
        }
    });

    return scene;
};

const scene = createScene(); 
    engine.runRenderLoop(function () {
            scene.render();
});

window.addEventListener("resize", function () {
        engine.resize();
});