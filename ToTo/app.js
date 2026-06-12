const starsData = [
    {
        title: "لو مضايقة ومخنوقة",
        text: "لو فتحتي النجمة دي وأنتِ مضايقة، أو حاسة بـ خنقة مش عارفة سببها، أو الأيام تقلت عليكي .. عايزاكي تاخدي نَفس طويل وتهوني على نفسك. عادي جداً نضعف وتمر علينا لحظات نكون مش قادرين فيها حتى نتكلم، بس افتكري دايماً إن ربنا جنبك ومعاك... وكل حاجة هتعدي .. كلنا بندعيلك وفي قلبنا على طول ... مينفعش العينين الحلوين دولا يزعلوا ... قومي اعمليلك حاجة تفرحك ... او كلميني انا موجودة على طول عشانك ... روقي يا جميلة، ضيقتك دي غالية علينا.",
        position: new THREE.Vector3(-2.2, 1.8, -7.5)
    },
    {
        title: "لو خايفة أو حيرانه",
        text: "انا عارفة الحياة صعبة وممكن تدخلنا في متاهات وتفاصيل جديدة بتخلينا نحس بـ حيرة أو خوف من الجاي، ومبنكونش عارفين إحنا ماشيين صح ولا غلط.. في اللحظة دي، اقفلي عينك وسيبك امرك كله لربنا ... ربنا عارف الخير ليك ... هييسره ليك...متخليش القلق يسرق منك هدوءك ولا ضحكتك، وسيبي بكرة لربنا. مهما كانت الخطوة الجاية غامضة، ربنا معاك وانتِ قدها، وافتكري دايماً إن ليكي أخت في ضهرك، سند ليكي في كل الاحتمالات ومن غير ما تسألك عن أي تفاصيل.",
        position: new THREE.Vector3(2.2, 1.8, -7.5)
    },
    {
        title: "أيام زمان وحكاياتنا",
        text: "انا بتوحشني اوي لمتنا زمان، وحكايتنا وسفرنا وضحكنا مع بعض ... وانا عارفة ان المسافات وسفر كل واحد فينا أخدنا في دوامة ومبقناش عارفين تفاصيل بعض زي زمان.. بس ذكرياتنا وإحنا صغيرين، ضحكنا، ولعبنا، وكل ثانية عشناها سوا لسه عايشة جوايا بالثانية ومبتتمحيش. إحنا جذورنا واحدة ومالناش إلا بعض مهما غبنا ..",
        position: new THREE.Vector3(-2.2, -1.6, -7.5)
    },
    {
        title: "في بالي دايماً",
        text: "احنا مبقناش بنتكلم كتير والدنيا شغلتنا، ومبقتش عارفة أوي إيه اللي بيفرحك أو يزعلك في حياتك الجديدة.. بس إنتي في بالي وفي قلبي دايماً. بحبك جاامد بجد، و كتير بفتكرك وبأدعي لك. ربنا يريح بالك، ويسعد قلبك، ويديكي كل الخير والرضا اللي في الدنيا، وتفضلي دايماً غالية وقريبة زي ما كنتِ وزي ما هتفضلي.. أنتِ حتة مني.",
        position: new THREE.Vector3(2.2, -1.6, -7.5)
    }
];

let scene, camera, renderer, starObjects = [];
let targetRotationX = 0, targetRotationY = 0;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

init();
animate();

function init() {
    const canvas = document.getElementById('sunset-canvas');
    
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 🌟 1. خلفية سديم الغروب الساحرة العميقة (Shader) - نقية ومستقرة تماماً
    const vertexShader = `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    const fragmentShader = `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            // مزيج متدرج رائع من الأسود الداكن والبرتقالي الغروبي الدافئ والبنفسجي الليلي
            vec3 sunsetOrange = vec3(0.95, 0.45, 0.15);
            vec3 spacePurple = vec3(0.12, 0.05, 0.18);
            vec3 finalColor = mix(spacePurple, sunsetOrange, intensity);
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;
    const skyGeo = new THREE.SphereGeometry(500, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // 🌟 2. نثر مئات النجوم الصغيرة الحقيقية اللامعة في الخلفية
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 400;
    const starPositions = new Float32Array(starsCount * 3);
    for(let i=0; i<starsCount*3; i+=3) {
        starPositions[i] = (Math.random() - 0.5) * 150;
        starPositions[i+1] = (Math.random() - 0.5) * 150;
        starPositions[i+2] = -Math.random() * 100 - 10;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, transparent: true });
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // 🌟 3. إنشاء قلوب 3D منورة (3D Hearts) بدقة هندسية عالية وبحجم مناسب
    starsData.forEach((data, index) => {
        const starGroup = new THREE.Group();
        starGroup.position.copy(data.position);

        // رسم مسار شكل قلب هندسي متناسق
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 0.25, y + 0.25);
        heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
        heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
        heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
        heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
        heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
        heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

        // تحويل مسار القلب لمجسم ثلاثي الأبعاد (Extrude)
        const extrudeSettings = { depth: 0.15, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        heartGeo.center(); // وضع السنتر في منتصف القلب بالظبط
        
        const heartMat = new THREE.MeshBasicMaterial({ 
            color: 0xffdf7a, // لون ذهبي دافئ وساطع
            transparent: true,
            opacity: 0.95
        });
        const heartMesh = new THREE.Mesh(heartGeo, heartMat);
        heartMesh.scale.set(1.2, 1.2, 1.2); // تظبيط مقياس القلب
        starGroup.add(heartMesh);

        // 🌟 4. تكبير خط العناوين الفوقية بشكل ملحوظ ورفعها للأعلى عشان تفصل تماماً عن القلب
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 400; 
        textCanvas.height = 100;
        const ctx = textCanvas.getContext('2d');
        ctx.font = 'Bold 30px Cairo'; // كبرنا الفونت اوي هنا
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffdf7a';
        ctx.shadowBlur = 14;
        ctx.fillText(data.title, 200, 60);

        const textTexture = new THREE.CanvasTexture(textCanvas);
        const spriteMat = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.y = 1.1; // رفعنا العنوان فوق عشان ميتداخلش مع القلب
        sprite.scale.set(2.8, 0.7, 1);
        starGroup.add(sprite);

        starGroup.userData = { id: index, starMesh: heartMesh };
        scene.add(starGroup);
        starObjects.push(starGroup);
    });

    // مستشعرات الحركة والـ Gyroscope
    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            window.addEventListener('click', () => {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        }
                    });
            }, { once: true });
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('click', onSelectStar);
    window.addEventListener('touchstart', onSelectStarTouch);
    window.addEventListener('resize', onWindowResize);
}

function handleOrientation(event) {
    if (event.gamma && event.beta) {
        targetRotationY = (event.gamma / 45) * 0.4;
        targetRotationX = ((event.beta - 60) / 45) * 0.4;
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouse.x * 0.25;
    targetRotationX = -mouse.y * 0.25;
}

function onTouchMove(event) {
    if(event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
}

function onSelectStar() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj.parent && obj.parent !== scene) { obj = obj.parent; }
        if (obj.userData && obj.userData.id !== undefined) {
            openModal(starsData[obj.userData.id].text);
            break;
        }
    }
}

function onSelectStarTouch(event) {
    if(event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        onSelectStar();
    }
}

function animate(time) {
    requestAnimationFrame(animate);

    // نبض القلوب ودورانها الرقيق جداً حول نفسها الفنية ✨
    const pulse = 1 + Math.sin(time * 0.003) * 0.05;
    starObjects.forEach(starGroup => {
        starGroup.userData.starMesh.scale.set(pulse * 1.2, pulse * 1.2, pulse * 1.2);
        starGroup.userData.starMesh.rotation.y = Math.sin(time * 0.001) * 0.2; // لف خفيف يمين وشمال ناعم
    });

    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;

    renderer.render(scene, camera);
}

function openModal(text) {
    document.getElementById('modal-text').innerHTML = text;
    document.getElementById('message-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('message-modal').classList.remove('active');
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
