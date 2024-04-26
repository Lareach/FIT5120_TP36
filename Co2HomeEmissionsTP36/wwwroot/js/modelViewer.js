window.addEventListener('DOMContentLoaded', function () {
    var nodeData = window.nodeData;

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    // Defining initial camera parameters
    var initialAlpha = Math.PI / 4; // Initial horizontal rotation
    var initialBeta = Math.PI / 4; // Initial vertical rotation
    var initialRadius = 10; // Initial zoom level
    var initialTarget = BABYLON.Vector3.Zero(); // Camera looking at the origin

    var scene = createScene(); // This now uses initial camera settings
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var nodeGroups = {
        "solarPanels": ["node11861"],
        "outdoorlighting": ["node11883"],
        "evcharger": ["node11869"],
        "heatwaterPump": ["node10467"]
    };

    var selectedNode = null; // Track the currently selected node
    var originalMaterials = new Map(); // To store original materials
    var guiLabel = null; // GUI label for the selected node

    canvas.addEventListener('pointerdown', function (evt) {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh.parent) {
            var pickedNode = pickResult.pickedMesh.parent;
            if (pickedNode instanceof BABYLON.TransformNode && Object.keys(nodeGroups).some(group => nodeGroups[group].includes(pickedNode.name))) {
                if (selectedNode === pickedNode) {
                    return; // Do nothing if the same node is clicked again
                }
                if (selectedNode) {
                    resetNode(selectedNode); // Reset the previously selected node
                }
                highlightNode(pickedNode); // Highlight the new selected node

                // Find which group the node belongs to and display the corresponding information
                const groupName = findGroupName(pickedNode.name);
                const data = nodeData[groupName];
                document.getElementById("infoTitle").innerHTML = data.title;
                document.getElementById("infoDescription").innerHTML = data.description;

                selectedNode = pickedNode; // Update the selected node
            }
        } else {
            if (selectedNode) {
                resetNode(selectedNode);
                selectedNode = null;
                if (guiLabel) {
                    guiLabel.dispose(); // Hide label when clicking outside
                    guiLabel = null;
                }
            }
        }
    });

    // Add a GUI button to reset the camera
    var resetCameraButton = BABYLON.GUI.Button.CreateSimpleButton("resetCamera", "Reset Camera");
    resetCameraButton.width = "150px";
    resetCameraButton.height = "40px";
    resetCameraButton.color = "white";
    resetCameraButton.cornerRadius = 20;
    resetCameraButton.background = "green";
    resetCameraButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    resetCameraButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    resetCameraButton.onPointerUpObservable.add(function () {
        scene.activeCamera.alpha = initialAlpha;
        scene.activeCamera.beta = initialBeta;
        scene.activeCamera.radius = initialRadius;
        scene.activeCamera.setTarget(initialTarget);
    });
    advancedTexture.addControl(resetCameraButton);

    // Disable default mouse wheel behavior for the canvas
    canvas.addEventListener("wheel", function (event) {
        event.preventDefault();
    }, { passive: false });

    function isNodeClickable(nodeName) {
        return Object.values(nodeGroups).some(group => group.includes(nodeName));
    }

    function findGroupName(nodeName) {
        for (let key in nodeGroups) {
            if (nodeGroups[key].includes(nodeName)) {
                return key;
            }
        }
        return null; // Return null if no group is found
    }

    function highlightNode(node) {
        node.getChildMeshes().forEach(mesh => {
            if (mesh.material && !originalMaterials.has(mesh)) {
                originalMaterials.set(mesh, mesh.material);
                mesh.material = mesh.material.clone("clonedMaterial_" + mesh.name);
                mesh.material.emissiveColor = new BABYLON.Color3(1, 0.5, 0);
            }
        });
    }

    function resetNode(node) {
        node.getChildMeshes().forEach(mesh => {
            if (originalMaterials.has(mesh)) {
                mesh.material = originalMaterials.get(mesh);
            }
        });
        originalMaterials.clear();
        if (guiLabel) {
            guiLabel.dispose(); // Dispose the GUI label
            guiLabel = null;
        }
    }

    function createScene() {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("camera1", initialAlpha, initialBeta, initialRadius, initialTarget, scene);
        camera.attachControl(canvas, true);
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        BABYLON.SceneLoader.ImportMesh("", "https://lareach.github.io/publicfiles/", "thehouse5.glb", scene, function (newMeshes, particleSystems, skeletons) {
            if (newMeshes.length > 0) {
                camera.target = newMeshes[0];
                newMeshes.forEach(mesh => {
                    if (!mesh.parent) {
                        let transformNode = new BABYLON.TransformNode("Node_" + mesh.name, scene);
                        mesh.parent = transformNode;
                    }
                });
            } else {
                console.error('No meshes were loaded. Check if the file path is correct and the model file is not corrupt.');
            }
        });

        return scene;
    }

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
});
