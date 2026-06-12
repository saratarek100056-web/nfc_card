// داتا المشاعر والرسائل الصافية بتاعتك (موزعة رصة هندسية في السنتر)
const starsData = [
    {
        title: "لو مضايقة ومخنوقة",
        text: "لو فتحتي النجمة دي وأنتِ مضايقة، أو حاسة بـ خنقة مش عارفة سببها، أو الأيام تقلت عليكي .. عايزاكي تاخدي نَفس طويل وتهوني على نفسك. عادي جداً نضعف وتمر علينا لحظات نكون مش قادرين فيها حتى نتكلم، بس افتكري دايماً إن ربنا جنبك ومعاك... وكل حاجة هتعدي .. كلنا بندعيلك وفي قلبنا على طول ... مينفعش العينين الحلوين دولا يزعلوا ... قومي اعمليلك حاجة تفرحك ... او كلميني انا موجودة على طول عشانك ... روقي يا جميلة، ضيقتك دي غالية علينا.",
        position: new THREE.Vector3(-2.2, 1.8, -8) // يسار فوق
    },
    {
        title: "لو خايفة أو حيرانه",
        text: "انا عارفة الحياة صعبة وممكن تدخلنا في متاهات وتفاصيل جديدة بتخلينا نحس بـ حيرة أو خوف من الجاي، ومبنكونش عارفين إحنا ماشيين صح ولا غلط.. في اللحظة دي، اقفلي عينك وسيبك امرك كله لربنا ... ربنا عارف الخير ليك ... هييسره ليك...متخليش القلق يسرق منك هدوءك ولا ضحكتك، وسيبي بكرة لربنا. مهما كانت الخطوة الجاية غامضة، ربنا معاك وانتِ قدها، وافتكري دايماً إن ليكي أخت في ضهرك، سند ليكي في كل الاحتمالات ومن غير ما تسألك عن أي تفاصيل.",
        position: new THREE.Vector3(2.2, 1.8, -8) // يمين فوق
    },
    {
        title: "أيام زمان وحكاياتنا",
        text: "انا بتوحشني اوي لمتنا زمان، وحكايتنا وسفرنا وضحكنا مع بعض ... وانا عارفة ان المسافات وسفر كل واحد فينا أخدنا في دوامة ومبقناش عارفين تفاصيل بعض زي زمان.. بس ذكرياتنا وإحنا صغيرين، ضحكنا، ولعبنا، وكل ثانية عشناها سوا لسه عايشة جوايا بالثانية ومبتتمحيش. إحنا جذورنا واحدة ومالناش إلا بعض مهما غبنا ..",
        position: new THREE.Vector3(-2.2, -1.5, -8) // يسار تحت
    },
    {
        title: "في بالي دايماً",
        text: "احنا مبقناش بنتكلم كتير والدنيا شغلتنا، ومبقتش عارفة أوي إيه اللي بيفرحك أو يزعلك في حياتك الجديدة.. بس إنتي في بالي وفي قلبي دايماً. بحبك جاامد بجد، و كتير بفتكرك وبأدعي لك. ربنا يريح بالك، ويسعد قلبك، ويديكي كل الخير والرضا اللي في الدنيا، وتفضلي دايماً غالية وقريبة زي ما كنتِ وزي ما هتفضلي.. أنتِ حتة مني.",
        position: new THREE.Vector3(2.2, -1.5, -8) // يمين تحت
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

    // 🌟 التعديل السحري: تحميل صورتك الرائعة وتوزيعها كخلفية محيطية بالكامل
    const loader = new THREE.TextureLoader();
    loader.load('sunset_stars.jpg', function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping; // يمنع التمطيط والتشويه
        
        const skyGeo = new THREE.SphereGeometry(500, 60, 40);
        const skyMat = new THREE.MeshBasicMaterial({ 
            map: texture, 
            side: THREE.BackSide 
        });
        const sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);

    // إنشاء الدوائر (النجوم) وتنسيق شكلها الذهبي الدافئ
    starsData.forEach((data, index) => {
        const starGroup = new THREE.Group();
        starGroup.position.copy(data.position);

        // شكل الدائرة المجسمة الناعمة المضيئة
        const starGeo = new THREE.SphereGeometry(0.38, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({ 
            color: 0xffdf7a, // لون ذهبي دافئ مستوحى من ضي الصورة
            transparent: true,
            opacity: 0.9
        });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starGroup.add(starMesh);

        // خط عناوين الدوائر اللطيف العائم فوقها
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 256;
        textCanvas.height = 64;
        const ctx = textCanvas.getContext('2d');
        ctx.font = 'Bold 22px Segoe UI';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffe399';
        ctx.shadowBlur = 10;
        ctx.fillText(data.title, 128, 40);

        const textTexture = new THREE.CanvasTexture(textCanvas);
        const spriteMat = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.y = 0.75; 
        sprite.scale.set(2, 0.5, 1);
        starGroup.add(sprite);

        starGroup.userData = { id: index, starMesh: starMesh };
        scene.add(starGroup);
        starObjects.push(starGroup);
    });

    // تفعيل الـ Gyroscope والـ Fallbacks للهواتف والديسكتوب
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

// تظبيط زوايا وحساسية مسكة الموبايل المريحة لربط الحركة بالصورة الحقيقية
function handleOrientation(event) {
    if (event.gamma && event.beta) {
        targetRotationY = (event.gamma / 50) * 0.4;
        targetRotationX = ((event.beta - 60) / 50) * 0.4;
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = mouse.x * 0.2;
    targetRotationX = -mouse.y * 0.2;
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

// وميض الدوائر الهادئ (Breathing Effect) وتنعيم حركة الكاميرا
function animate(time) {
    requestAnimationFrame(animate);
    if (typeof TWEEN !== 'undefined') TWEEN.update();

    const pulse = 1 + Math.sin(time * 0.003) * 0.05;
    starObjects.forEach(starGroup => {
        starGroup.userData.starMesh.scale.set(pulse, pulse, pulse);
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
    document.getElementById('message-modal').classList.remove('remove'); // تعويض آمن
    document.getElementById('message-modal').classList.remove('active');
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
