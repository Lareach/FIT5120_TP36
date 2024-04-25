window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);
    var scene = createScene();
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var nodeGroups = {
        "solarPanels": ["node12045", "node12048", "node12051", "node12054", "node12057", "node12060", "node12063", "node12066"],
            "outdoorlighting": ["node12115", "node12074", "node12080", "node12086", "node12092", "node12098", "node12104",],
            "heatwaterPump": ["node3679"]
    };

    var nodeData = {
        "solarPanels": {
            title: "Solar Panels",
            description: "Installing a solar electricity system in Victoria offers several financial benefits, including rebates for solar photovoltaic (PV) systems, hot water systems, solar batteries and interest-free loans. Proper planning and installation, guided by resources like the ‘Buyers Guide developed with Renew’, are crucial for maximising energy and cost savings. Considerations include system size, component quality, and choosing a reputable installer. Rebates enhance affordability, and understanding grid connection is important for effective system integration. Warranties and consumer protections provide additional security and confidence in the investment. Learn more>> https://www.solar.vic.gov.au/solar-panel-rebate",
            imageUrl: "https://example.com/image_solar_panels.jpg"
        },
        "outdoorlighting": {
            title: "Outdoor Lighting",
            description: "Switching to solar lighting in Australia is highly beneficial for environmental and economic reasons. Solar lights are a sustainable choice, reducing carbon footprints and electricity costs. They're easy to install, require minimal maintenance, and can be used in various locations, including remote areas without power grids. Additionally, solar lights are safe, enhance property security  and support wildlife.",
            imageUrl: "https://example.com/image_outdoor_lighting.jpg"
        },
        "heatwaterPump": {
            title: "Heat Water Pump",
            description: "Heat-pump water heaters extract heat from the surrounding air to heat water, using about 60-75% less electricity than conventional electric heaters.They function like reverse- cycle air conditioners, using electricity for the heat pump, not for directly heating water. Available as integrated units or split systems.They require proper ventilation and consideration for noise, especially near bedrooms. Suitable for off - peak electricity tariffs, these systems can also utilise timers to align with solar photovoltaic systems for efficient energy use. Eligible for government rebates in some regions, they are efficient in warmer climates but may have slower reheat rates in cold weather.",
            imageUrl: "https://example.com/image_outdoor_lighting.jpg"
        }
    };

    var selectedNode = null; // Track the currently selected node
    var originalMaterials = new Map(); // To store original materials
    var guiLabel = null; // GUI label for the selected node

    canvas.addEventListener('pointerdown', function (evt) {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit && pickResult.pickedMesh.parent) {
            var pickedNode = pickResult.pickedMesh.parent;
            if (pickedNode instanceof BABYLON.TransformNode && isNodeClickable(pickedNode.name)) {
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
                document.getElementById("infoTitle").textContent = data.title;
                document.getElementById("infoDescription").textContent = data.description;

                selectedNode = pickedNode;
            }
        } else {
            if (selectedNode) {
                resetNode(selectedNode);
                selectedNode = null;
            }
        }
    });

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
        }
    }

    function createScene() {
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 4, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        BABYLON.SceneLoader.ImportMesh("", "https://lareach.github.io/publicfiles/", "thehouse3.glb", scene, function (newMeshes, particleSystems, skeletons) {
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
