import * as BABYLON from 'babylonjs';
// import babylon materials
import * as material from 'babylonjs-materials';
// import worldmonger
import { WORLDMONGER } from './Shaders/groundMaterial';
export default class MyScene {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.FreeCamera;
    private _light: BABYLON.Light;

    constructor(canvasElement: string) {
        // Create canvas and engine.
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(): void {
        // Create a basic BJS Scene object.
        this._scene = new BABYLON.Scene(this._engine);

        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(1000, 5000, -5000), this._scene);
        this._camera.speed = 50;
        this._camera.angularSensibility = 500;
        // Target the camera to scene origin.
        this._camera.setTarget(BABYLON.Vector3.Zero());
        this._camera.inputs.addMouseWheel();
        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, true);
        BABYLON.Engine.ShadersRepository = "/Babylon/Shaders/";
        // Create a basic light, aiming 0,1,0 - meaning, to the sky.
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1000, 0), this._scene);
        var sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(-5000, 100, 200), this._scene);
        // sun.position = new BABYLON.Vector3(0, 1000, 0);
        // Create a built-in "ground" shape.

        // var terrain = BABYLON.Mesh.CreateGroundFromHeightMap("terrain", "assets/heightMap.png", 1000, 1000, 50, 0, 200, this._scene, true);
        var terrain = BABYLON.MeshBuilder.CreateGroundFromHeightMap("terrain1", "assets/heightmap.png", {
            width: 5000, height: 5000, subdivisions: 40, minHeight: 0, maxHeight: 1000, onReady(m) {
                m.convertToFlatShadedMesh();
            }
        }, this._scene);
        // make terrain flat shaded

        terrain.position.y = -1000;
        var terrainMaterial = new material.TerrainMaterial("terrainMaterial", this._scene);
        terrainMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        // terrainMaterial.wireframe = true;
        terrainMaterial.mixTexture = new BABYLON.Texture("assets/heightmap1.png", this._scene);
        terrainMaterial.diffuseTexture1 = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/2/23/Light_green.PNG", this._scene);
        terrainMaterial.diffuseTexture2 = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/2/23/Light_green.PNG", this._scene);
        terrainMaterial.diffuseTexture3 = new BABYLON.Texture("assets/water.png", this._scene);

        // // terrainMaterial.bumpTexture1 = new BABYLON.Texture("assets/grassn.png", this._scene);
        // // terrainMaterial.bumpTexture2 = new BABYLON.Texture("assets/grassn.png", this._scene);
        terrainMaterial.bumpTexture3 = new BABYLON.Texture("assets/waterbump.png", this._scene);
        // var elevationControl = new WORLDMONGER.ElevationControl(ground);
        console.log(WORLDMONGER);

        terrain.material = new WORLDMONGER.GroundMaterial("groundMaterial", this._scene, sun);
        // terrain.material = terrainMaterial;
    }

    doRender(): void {
        // Run the render loop.
        this._engine.runRenderLoop(() => {
            this._scene.debugLayer.show();
            this._scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}