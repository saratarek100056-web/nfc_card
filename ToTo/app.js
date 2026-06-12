// داتا المشاعر والرسائل الصافية بتاعتك بالظبط
const starsData = [
    {
        title: "لو مضايقة ومخنوقة",
        text: "لو فتحتي النجمة دي وأنتِ مضايقة، أو حاسة بـ خنقة مش عارفة سببها، أو الأيام تقلت عليكي .. عايزاكي تاخدي نَفس طويل وتهوني على نفسك. عادي جداً نضعف وتمر علينا لحظات نكون مش قادرين فيها حتى نتكلم، بس افتكري دايماً إن ربنا جنبك ومعاك... وكل حاجة هتعدي .. كلنا بندعيلك وفي قلبنا على طول ... مينفعش العينين الحلوين دولا يزعلوا ... قومي اعمليلك حاجة تفرحك ... او كلميني انا موجودة على طول عشانك ... روقي يا جميلة، ضيقتك دي غالية علينا.",
        position: new THREE.Vector3(-8, 3, -10) // يسار فوق
    },
    {
        title: "لو خايفة أو حيرانه",
        text: "انا عارفة الحياة صعبة وممكن تدخلنا في متاهات وتفاصيل جديدة بتخلينا نحس بـ حيرة أو خوف من الجاي، ومبنكونش عارفين إحنا ماشيين صح ولا غلط.. في اللحظة دي، اقفلي عينك وسيبك امرك كله لربنا ... ربنا عارف الخير ليك ... هييسره ليك...متخليش القلق يسرق منك هدوءك ولا ضحكتك، وسيبي بكرة لربنا. مهما كانت الخطوة الجاية غامضة، ربنا معاك وانتِ قدها، وافتكري دايماً إن ليكي أخت في ضهرك، سند ليكي في كل الاحتمالات ومن غير ما تسألك عن أي تفاصيل.",
        position: new THREE.Vector3(0, 5, -12) // منتصف فوق
    },
    {
        title: "أيام زمان وحكاياتنا",
        text: "انا بتوحشني اوي لمتنا زمان، وحكايتنا وسفرنا وضحكنا مع بعض ... وانا عارفة ان المسافات وسفر كل واحد فينا أخدنا في دوامة ومبقناش عارفين تفاصيل بعض زي زمان.. بس ذكرياتنا وإحنا صغيرين، ضحكنا، ولعبنا، وكل ثانية عشناها سوا لسه عايشة جوايا بالثانية ومبتتمحيش. إحنا جذورنا واحدة ومالناش إلا بعض مهما غبنا ..",
        position: new THREE.Vector3(8, 2, -10) // يمين
    },
    {
        title: "في بالي دايماً",
        text: "احنا مبقناش بنتكلم كتير والدنيا شغلتنا، ومبقتش عارفة أوي إيه اللي بيفرحك أو يزعلك في حياتك الجديدة.. بس إنتي في بالي وفي قلبي دايماً. بحبك جاامد بجد، و كتير بفتكرك وبأدعي لك. ربنا يريح بالك، ويسعد قلبك، ويديكي كل الخير والرضا اللي في الدنيا، وتفضلي دايماً غالية وقريبة زي ما كنتِ وزي ما هتفضلي.. أنتِ حتة مني.",
        position: new THREE.Vector3(0, -2, -8) // أسفل المنتصف
    }
];

// المتغيرات الأساسية لـ Three.js
let scene, camera, renderer, starObjects = [];
let targetRotationX = 0, targetRotationY = 0;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

init();
animate();

function init() {
    const canvas = document.getElementById('sunset-canvas');
    
    // 1. إنشاء المشهد والكاميرا
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 2. إنشاء الـ Renderer بجودة عالية
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. هندسة تدرج الغروب (The Sunset Sky Box) الاحترافي
    // تدرج من الأحمر الناري للبرتقالي الدافئ إلى البنفسجي الساكن
    const vertexShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `;
    const fragmentShader = `
        varying vec3 vWorldPosition;
        void main() {
            vec3 direction = normalize(vWorldPosition);
            float h = direction.y; // الإرتفاع الرأسي
            
            // ألوان الغروب الدافية
            vec3 skyColorTop = vec3(0.2, 0.05, 0.25);    // بنفسجي شفق بالليل فوق
            vec3 skyColorMiddle = vec3(0.98, 0.35, 0.1); // برتقالي ناري في النص
            vec3 skyColorBottom = vec3(0.9, 0.15, 0.05); // أحمر دافي تحت خالص
            
            vec3 skyColor;
            if (h > 0.0) {
                skyColor = mix(skyColorMiddle, skyColorTop, h);
            } else {
                skyColor = mix(skyColorMiddle, skyColorBottom, -h);
            }
            gl_FragColor = vec4(skyColor, 1.0);
        }
    `;
    const skyGeo = new THREE.SphereGeometry(500, 32, 15);
    const skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, side: THREE.BackSide });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // 4. إضاءة خفيفة للمشهد
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // 5. إنشاء النجوم الـ 4 المضيئة مع الـ Canvas Text (عناوين النجوم)
    starsData.forEach((data, index) => {
        // جروب يضم النجمة والنص بتاعها سوا
        const starGroup = new THREE.Group();
        starGroup.position.copy(data.position);

        // مجسم النجمة (Core Sphere)
        const starGeo = new THREE.SphereGeometry(0.35, 32, 32);
        const starMat = new THREE.MeshBasicMaterial({ 
            color: 0xfff6e9, 
            transparent: true,
            opacity: 0.95
        });
        const starMesh = new THREE.Mesh(starGeo, starMat);
        starGroup.add(starMesh);

        // إنشاء عنوان النجمة كـ Sprite ثنائي الأبعاد عايم فوقها بالـ Canvas
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 256;
        textCanvas.height = 64;
        const ctx = textCanvas.getContext('2d');
        ctx.font = 'Bold 24px Segoe UI';
        ctx.fillStyle = '#ffedd5';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#fb923c';
        ctx.shadowBlur = 8;
        ctx.fillText(data.title, 128, 40);

        const textTexture = new THREE.CanvasTexture(textCanvas);
        const spriteMat = new THREE.SpriteMaterial({ map: textTexture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.y = 0.8; // يرتفع فوق النجمة شوية
        sprite.scale.set(2, 0.5, 1);
        starGroup.add(sprite);

        // تخزين البيانات للـ Raycasting والـ Click
        starGroup.userData = { id: index, starMesh: starMesh };
        scene.add(starGroup);
        starObjects.push(starGroup);
    });

    // 6. تفعيل الـ Gyroscope للهواتف الذكية احترافياً مع طلب الصلاحية للـ iOS
    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // للآيفون iOS 13+: يحتاج لضغط أولى لتفعيل الـ Gyroscope
            window.addEventListener('click', () => {
                DeviceOrientationEvent.requestPermission()
                    .then(response => {
                        if (response === 'granted') {
                            window.addEventListener('deviceorientation', handleOrientation);
                        }
                    });
            }, { once: true });
        } else {
            // للأندرويد وباقي الأجهزة: يشتغل فوراً
            window.addEventListener('deviceorientation', handleOrientation);
        }
    }

    // Fallback: التحكم بالماوس والسحب للأجهزة اللي مفيهاش Gyroscope
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('click', onSelectStar);
    window.addEventListener('touchstart', onSelectStarTouch);
    window.addEventListener('resize', onWindowResize);
}

// معالجة مستشعرات حركة الموبايل
function handleOrientation(event) {
    // استخدام الـ Gamma (يمين/شمال) والـ Beta (فوق/تحت) لتدوير الكاميرا
    if (event.gamma && event.beta) {
        targetRotationY = (event.gamma / 30) * 0.5;
        targetRotationX = ((event.beta - 60) / 30) * 0.5; // تم التعديل ليناسب زاوية مسكة الموبايل المريحة
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // تدوير خفيف مع الماوس على الديسكتوب كـ Fallback
    targetRotationY = mouse.x * 0.3;
    targetRotationX = -mouse.y * 0.3;
}

function onTouchMove(event) {
    if(event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
}

// التقاط كليك النجوم (Raycasting)
function onSelectStar(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    for (let i = 0; i < intersects.length; i++) {
        let obj = intersects[i].object;
        while (obj.parent && obj.parent !== scene) {
            obj = obj.parent;
        }
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

// الـ Glow والـ Breathing Effect الخاص بالنجوم جوة الـ Loop
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update();

    // الأنيميشن اللطيف (جعل النجوم تنبض ببطء كأنها تتنفس)
    const pulse = 1 + Math.sin(time * 0.003) * 0.08;
    starObjects.forEach(starGroup => {
        starGroup.userData.starMesh.scale.set(pulse, pulse, pulse);
    });

    // تنعيم حركة الكاميرا (Interpolation / Lerp) لأعلى سلاسة
    camera.rotation.y += (targetRotationY - camera.rotation.y) * 0.05;
    camera.rotation.x += (targetRotationX - camera.rotation.x) * 0.05;

    renderer.render(scene, camera);
}

// فتح وغلق كروت الكلام الشفافة
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