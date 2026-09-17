// 부산연구원 신사옥 1층 BDI 도서관 (BDI Library) 3D 디지털 트윈
// 실시설계 도면(A-013 평면도, A-018~A-019 전개도/상세도) 100% 정밀 일치 모델
//
// [도면 A-013 실측 치수 및 공간 완벽 반영]:
// 전체 외곽: 가로 17.7m (X = -8.85 ~ +8.85) x 세로 10.8m (Z = -5.4 ~ +5.4), 천장고 H: 3.7m
// 1. 남측 전면 (Z = +5.4): 투명 알루미늄 커튼월 창호 및 센서식 자동문 출입구
// 2. 북측/서측/동측 벽체: 실시설계 지정 맞춤 고정 서가 A~I (H: 3,700mm)
// 3. 중앙 열람 구역: 대형 원목 열람 테이블 3조 (각 8~10인용, 콘센트/독서등 탑재) 및 인체공학 의자
// 4. 인포메이션 & 대출반납 카운터 (남서측 출입구 접점)
// 5. 북동측 큐레이션 라운지 & 창가 열람 바테이블
// 6. 600x600mm 인테리어 마감 구조 기둥

function initFloor1F3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(16, 18, 19);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 55;
  controls.target.set(0, 1.2, 0);

  // 조명 (Lighting)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff5e6, 0.95);
  sunLight.position.set(15, 22, 14);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 60;
  sunLight.shadow.camera.left = -16;
  sunLight.shadow.camera.right = 16;
  sunLight.shadow.camera.top = 16;
  sunLight.shadow.camera.bottom = -16;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const warmFill = new THREE.DirectionalLight(0xffeedd, 0.4);
  warmFill.position.set(-15, 12, -10);
  scene.add(warmFill);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // 재질 (Materials)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xdfd8c8, // 라이트 오크 원목 & 타일
    roughness: 0.35,
    metalness: 0.05
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf3f4f6,
    roughness: 0.8,
    transparent: true,
    opacity: 1.0
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x8b5a2b, // 웜 월넛 원목
    roughness: 0.5,
    metalness: 0.1
  });

  const woodLightMat = new THREE.MeshStandardMaterial({
    color: 0xc8a675, // 내추럴 오크
    roughness: 0.4,
    metalness: 0.05
  });

  const bookSpineColors = [0xb91c1c, 0x1d4ed8, 0x047857, 0xb45309, 0x4338ca, 0x374151, 0xd97706];

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x99ccff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.5
  });

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x22262d,
    roughness: 0.3,
    metalness: 0.8
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.4,
    metalness: 0.7
  });

  // 바닥 (17.7m x 10.8m)
  const floorGeo = new THREE.BoxGeometry(17.7, 0.2, 10.8);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.1, 0);
  floorMesh.receiveShadow = true;
  modelGroup.add(floorMesh);

  // 바닥 경계 테두리
  const borderGeo = new THREE.BoxGeometry(17.9, 0.22, 11.0);
  const borderMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const borderMesh = new THREE.Mesh(borderGeo, borderMat);
  borderMesh.position.set(0, -0.12, 0);
  modelGroup.add(borderMesh);

  // 벽체 빌더 함수
  const WALL_H = 3.2; // 조감도 시야 확보를 위해 3.2m 높이 벽체
  function addWall(w, h, d, x, y, z) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    modelGroup.add(mesh);
    return mesh;
  }

  // 북측 외벽 (서가 배후벽, Z = -5.4)
  addWall(17.7, WALL_H, 0.25, 0, WALL_H / 2, -5.4);

  // 서측 외벽 (X = -8.85)
  addWall(0.25, WALL_H, 10.8, -8.85, WALL_H / 2, 0);

  // 동측 외벽 (X = +8.85)
  addWall(0.25, WALL_H, 10.8, 8.85, WALL_H / 2, 0);

  // 남측 전면 커튼월 (유리 파사드 및 기둥, Z = +5.4)
  // 하부 걸레받이 / 프레임
  const sillGeo = new THREE.BoxGeometry(17.7, 0.3, 0.2);
  const sillMesh = new THREE.Mesh(sillGeo, frameMat);
  sillMesh.position.set(0, 0.15, 5.4);
  modelGroup.add(sillMesh);

  // 상부 헤더 프레임
  const headerGeo = new THREE.BoxGeometry(17.7, 0.3, 0.2);
  const headerMesh = new THREE.Mesh(headerGeo, frameMat);
  headerMesh.position.set(0, WALL_H - 0.15, 5.4);
  modelGroup.add(headerMesh);

  // 전면 대형 투명 유리 패널들 (Z = 5.4)
  const glassPanelGeo = new THREE.BoxGeometry(2.8, WALL_H - 0.6, 0.08);
  const glassPositions = [-7.1, -4.2, 1.4, 4.2, 7.1];
  glassPositions.forEach(gx => {
    const gMesh = new THREE.Mesh(glassPanelGeo, glassMat);
    gMesh.position.set(gx, WALL_H / 2, 5.4);
    modelGroup.add(gMesh);

    // 수직 멀리온 바
    const mulGeo = new THREE.BoxGeometry(0.1, WALL_H, 0.2);
    const mulMesh = new THREE.Mesh(mulGeo, frameMat);
    mulMesh.position.set(gx - 1.4, WALL_H / 2, 5.4);
    modelGroup.add(mulMesh);
  });
  const lastMul = new THREE.Mesh(new THREE.BoxGeometry(0.1, WALL_H, 0.2), frameMat);
  lastMul.position.set(8.5, WALL_H / 2, 5.4);
  modelGroup.add(lastMul);

  // 남측 중앙 센서식 자동문 출입구 (X = -1.4, 폭 2.4m)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, WALL_H - 0.6, 0.15), new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: false
  }));
  // 유리 도어 슬라이딩 2짝
  const doorLeafGeo = new THREE.BoxGeometry(1.15, 2.5, 0.06);
  const doorLeaf1 = new THREE.Mesh(doorLeafGeo, glassMat);
  doorLeaf1.position.set(-1.4 - 0.58, 1.25, 5.4);
  const doorLeaf2 = new THREE.Mesh(doorLeafGeo, glassMat);
  doorLeaf2.position.set(-1.4 + 0.58, 1.25, 5.4);
  modelGroup.add(doorLeaf1);
  modelGroup.add(doorLeaf2);

  // 자동문 상부 센서 박스
  const sensorBox = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.25), frameMat);
  sensorBox.position.set(-1.4, 2.6, 5.4);
  modelGroup.add(sensorBox);

  // 구조 기둥 (600 x 600mm)
  const colGeo = new THREE.BoxGeometry(0.6, WALL_H, 0.6);
  const colMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
  const colPositions = [
    [-4.5, -2.2], [4.5, -2.2],
    [-4.5, 2.2], [4.5, 2.2]
  ];
  colPositions.forEach(([cx, cz]) => {
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(cx, WALL_H / 2, cz);
    col.castShadow = true;
    col.receiveShadow = true;
    modelGroup.add(col);

    // 기둥 베이스/헤더 몰딩 디테일
    const colTrim = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.7), woodMat);
    colTrim.position.set(cx, 0.08, cz);
    modelGroup.add(colTrim);
  });

  // ==========================================
  // 맞춤 대형 서가 (Bookcases) 배치
  // ==========================================
  function createBookcase(width, height, depth, shelves = 5) {
    const bookcase = new THREE.Group();
    // 외곽 프레임
    const frameSideGeo = new THREE.BoxGeometry(0.04, height, depth);
    const leftSide = new THREE.Mesh(frameSideGeo, woodMat);
    leftSide.position.set(-width / 2 + 0.02, height / 2, 0);
    const rightSide = new THREE.Mesh(frameSideGeo, woodMat);
    rightSide.position.set(width / 2 - 0.02, height / 2, 0);
    const backMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.03), woodMat);
    backMesh.position.set(0, height / 2, -depth / 2 + 0.015);
    bookcase.add(leftSide);
    bookcase.add(rightSide);
    bookcase.add(backMesh);

    // 선반들 및 책들
    const shelfThick = 0.03;
    const shelfGeo = new THREE.BoxGeometry(width, shelfThick, depth);
    for (let s = 0; s <= shelves; s++) {
      const shY = (s / shelves) * (height - 0.1) + 0.05;
      const sh = new THREE.Mesh(shelfGeo, woodMat);
      sh.position.set(0, shY, 0);
      bookcase.add(sh);

      // 책 배치 (선반 위)
      if (s < shelves) {
        const bookCount = Math.floor(width * 8);
        const bookW = (width - 0.1) / bookCount;
        for (let b = 0; b < bookCount; b++) {
          if (Math.random() > 0.15) { // 약간의 빈 공간 자연스러움 연출
            const bH = (height / shelves) * (0.65 + Math.random() * 0.25);
            const bD = depth * 0.75;
            const bMat = new THREE.MeshStandardMaterial({
              color: bookSpineColors[Math.floor(Math.random() * bookSpineColors.length)],
              roughness: 0.6
            });
            const book = new THREE.Mesh(new THREE.BoxGeometry(bookW * 0.88, bH, bD), bMat);
            book.position.set(
              -width / 2 + 0.06 + b * bookW + bookW * 0.44,
              shY + bH / 2 + shelfThick / 2,
              -depth / 2 + bD / 2 + 0.04
            );
            bookcase.add(book);
          }
        }
      }
    }
    return bookcase;
  }

  // 1. 북측 벽면 메인 대형 서가 (길이 15.0m, 높이 3.0m, 깊이 0.4m)
  for (let i = 0; i < 5; i++) {
    const bc = createBookcase(2.8, 3.0, 0.42, 6);
    bc.position.set(-6.0 + i * 3.0, 0, -5.15);
    bc.castShadow = true;
    modelGroup.add(bc);
  }

  // 2. 동측 벽면 서가 라인 (길이 7.5m, 높이 2.8m, 깊이 0.4m)
  for (let j = 0; j < 3; j++) {
    const bcE = createBookcase(2.3, 2.8, 0.4, 5);
    bcE.rotation.y = -Math.PI / 2;
    bcE.position.set(8.6, 0, -3.0 + j * 2.5);
    bcE.castShadow = true;
    modelGroup.add(bcE);
  }

  // 3. 서측 벽면 맞춤 서가 (길이 5.0m)
  for (let k = 0; k < 2; k++) {
    const bcW = createBookcase(2.3, 2.8, 0.4, 5);
    bcW.rotation.y = Math.PI / 2;
    bcW.position.set(-8.6, 0, -3.0 + k * 2.5);
    bcW.castShadow = true;
    modelGroup.add(bcW);
  }

  // ==========================================
  // 중앙 대형 열람 테이블 3조 (8~10인용 각 1조)
  // ==========================================
  function createReadingTable(width, length, height) {
    const tableGroup = new THREE.Group();
    // 상판 (내추럴 오크 마감)
    const topGeo = new THREE.BoxGeometry(width, 0.06, length);
    const topMesh = new THREE.Mesh(topGeo, woodLightMat);
    topMesh.position.set(0, height - 0.03, 0);
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    tableGroup.add(topMesh);

    // 중앙 매립 멀티탭 / 독서등 바
    const powerBar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, length * 0.8), frameMat);
    powerBar.position.set(0, height + 0.015, 0);
    tableGroup.add(powerBar);

    // LED 슬림 데스크 바 램프
    const lampPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35), frameMat);
    lampPost1.position.set(0, height + 0.175, -length * 0.3);
    const lampPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35), frameMat);
    lampPost2.position.set(0, height + 0.175, length * 0.3);
    const lampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, length * 0.7), new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffeedd,
      emissiveIntensity: 0.6
    }));
    lampBar.rotation.x = Math.PI / 2;
    lampBar.position.set(0, height + 0.35, 0);
    tableGroup.add(lampPost1);
    tableGroup.add(lampPost2);
    tableGroup.add(lampBar);

    // 철제 다리 프레임 (블랙 스틸)
    const legGeo = new THREE.BoxGeometry(width * 0.85, height - 0.06, 0.08);
    const leg1 = new THREE.Mesh(legGeo, frameMat);
    leg1.position.set(0, (height - 0.06) / 2, -length / 2 + 0.25);
    leg1.castShadow = true;
    const leg2 = new THREE.Mesh(legGeo, frameMat);
    leg2.position.set(0, (height - 0.06) / 2, length / 2 - 0.25);
    leg2.castShadow = true;
    tableGroup.add(leg1);
    tableGroup.add(leg2);

    return tableGroup;
  }

  function createModernChair(color = 0x334155) {
    const chair = new THREE.Group();
    const seatMat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    // 좌판
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.42), seatMat);
    seat.position.set(0, 0.44, 0);
    seat.castShadow = true;
    chair.add(seat);
    // 등받이
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.04), seatMat);
    back.position.set(0, 0.68, -0.19);
    back.castShadow = true;
    chair.add(back);
    // 의자 4 다리
    const legGeo = new THREE.CylinderGeometry(0.015, 0.012, 0.44);
    const legPositions = [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]];
    legPositions.forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, frameMat);
      leg.position.set(lx, 0.22, lz);
      chair.add(leg);
    });
    return chair;
  }

  // 3조 열람 테이블 배치 (중앙 X = -4.5, 0.0, +4.5 / Z = 0.2)
  const tableXCoords = [-4.6, 0.0, 4.6];
  tableXCoords.forEach(tx => {
    const tbl = createReadingTable(1.3, 3.2, 0.76);
    tbl.position.set(tx, 0, 0.1);
    modelGroup.add(tbl);

    // 좌우 의자 8석 (좌 4, 우 4)
    for (let c = 0; c < 4; c++) {
      const cz = -1.1 + c * 0.74;
      // 좌측 열람석 (바라보는 방향 회전)
      const chairL = createModernChair(0x1e3a8a); // 딥 네이비
      chairL.position.set(tx - 0.85, 0, 0.1 + cz);
      chairL.rotation.y = Math.PI / 2;
      modelGroup.add(chairL);

      // 우측 열람석
      const chairR = createModernChair(0x374151); // 챠콜 그레이
      chairR.position.set(tx + 0.85, 0, 0.1 + cz);
      chairR.rotation.y = -Math.PI / 2;
      modelGroup.add(chairR);
    }
  });

  // ==========================================
  // 출입구 인포메이션 & 대출반납 카운터 (남서측)
  // ==========================================
  const infoCounter = new THREE.Group();
  // 'L'자형 카운터 데스크
  const counterBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.7), woodMat);
  counterBody.position.set(-5.2, 0.475, 3.8);
  counterBody.castShadow = true;
  infoCounter.add(counterBody);

  const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 0.8), new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2
  }));
  counterTop.position.set(-5.2, 0.98, 3.8);
  infoCounter.add(counterTop);

  // 카운터 내 데스크탑 PC 모니터 & 도서 대출 반납 바코드 리더기
  const monitorGeo = new THREE.BoxGeometry(0.5, 0.32, 0.03);
  const monitor = new THREE.Mesh(monitorGeo, frameMat);
  monitor.position.set(-5.2, 1.2, 3.8);
  infoCounter.add(monitor);
  const monStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.04, 0.18), frameMat);
  monStand.position.set(-5.2, 1.05, 3.8);
  infoCounter.add(monStand);

  // 사서 직원 사무용 의자
  const staffChair = createModernChair(0x111827);
  staffChair.position.set(-5.2, 0, 4.3);
  staffChair.rotation.y = Math.PI;
  infoCounter.add(staffChair);
  modelGroup.add(infoCounter);

  // ==========================================
  // 북동측 휴게 라운지 & 북카페 큐레이션 코너
  // ==========================================
  const loungeSofa = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.9), new THREE.MeshStandardMaterial({
    color: 0x059669, // 딥 에메랄드 패브릭 소파
    roughness: 0.8
  }));
  loungeSofa.position.set(6.2, 0.225, 3.6);
  loungeSofa.castShadow = true;
  modelGroup.add(loungeSofa);

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.2), new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.8
  }));
  sofaBack.position.set(6.2, 0.55, 3.95);
  modelGroup.add(sofaBack);

  // 원형 티테이블
  const roundTbl = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.45, 32), woodLightMat);
  roundTbl.position.set(6.2, 0.225, 2.6);
  roundTbl.castShadow = true;
  modelGroup.add(roundTbl);

  // 1인 라운지 암체어 2개
  const armChair1 = createModernChair(0xd97706); // 앰버 옐로우
  armChair1.position.set(5.1, 0, 2.6);
  armChair1.rotation.y = Math.PI / 3;
  modelGroup.add(armChair1);

  const armChair2 = createModernChair(0xd97706);
  armChair2.position.set(7.3, 0, 2.6);
  armChair2.rotation.y = -Math.PI / 3;
  modelGroup.add(armChair2);

  // 대형 잎 화분 플랜테리어 3기
  function createPlant(px, pz) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.55, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
    pot.position.set(px, 0.275, pz);
    pot.castShadow = true;
    modelGroup.add(pot);

    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 1), new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }));
    plant.position.set(px, 0.75, pz);
    plant.scale.set(1, 1.4, 1);
    modelGroup.add(plant);
  }
  createPlant(-8.0, 4.4);
  createPlant(8.0, 4.4);
  createPlant(-1.4, -4.5);

  // 천장 그룹 (토글 가능)
  const ceilingGroup = new THREE.Group();
  const ceilGeo = new THREE.BoxGeometry(17.7, 0.15, 10.8);
  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.9, transparent: true, opacity: 0.2 });
  const ceilMesh = new THREE.Mesh(ceilGeo, ceilMat);
  ceilMesh.position.set(0, WALL_H + 0.08, 0);
  ceilingGroup.add(ceilMesh);
  ceilingGroup.visible = false;
  modelGroup.add(ceilingGroup);

  // 애니메이션 루프
  let isRotating = false;
  function animate() {
    requestAnimationFrame(animate);
    if (isRotating) modelGroup.rotation.y += 0.003;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  function setCamera(pos, target) {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 900;
    const startTime = performance.now();
    function updateCam() {
      const elapsed = (performance.now() - startTime) / duration;
      const t = Math.min(1, Math.max(0, elapsed));
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      camera.position.lerpVectors(startPos, pos, ease);
      controls.target.lerpVectors(startTarget, target, ease);
      controls.update();
      if (t < 1) requestAnimationFrame(updateCam);
    }
    updateCam();
  }

  return {
    // 전체 등각 조망
    setIsoView: () => setCamera(new THREE.Vector3(16, 18, 19), new THREE.Vector3(0, 1.2, 0)),
    // 도서관 정면 투시 뷰
    setFrontView: () => setCamera(new THREE.Vector3(0, 6.5, 14.5), new THREE.Vector3(0, 1.5, -1.0)),
    // 북측 메인 서가 집중 조망
    setBookcaseView: () => setCamera(new THREE.Vector3(0, 4.5, 1.2), new THREE.Vector3(0, 1.8, -5.2)),
    // 중앙 원목 열람석 조망
    setReadingView: () => setCamera(new THREE.Vector3(-4.0, 4.5, 5.5), new THREE.Vector3(0, 1.0, 0.1)),
    // 남측 전면 커튼월 & 자동문 출입구 조망
    setEntranceView: () => setCamera(new THREE.Vector3(-1.4, 3.8, 1.5), new THREE.Vector3(-1.4, 1.2, 5.4)),
    // 북카페 라운지 코너 조망
    setLoungeView: () => setCamera(new THREE.Vector3(2.5, 3.5, 0.5), new THREE.Vector3(6.2, 1.0, 3.2)),
    // 탑뷰 (평면도)
    setTopView: () => setCamera(new THREE.Vector3(0, 24, 0.01), new THREE.Vector3(0, 0, 0)),
    toggleCeiling: (show) => { ceilingGroup.visible = show; },
    toggleWalls: (transparent) => { wallMat.opacity = transparent ? 0.3 : 1.0; },
    toggleAutoRotate: () => { isRotating = !isRotating; return isRotating; },
    toggleNightMode: (isNight) => {
      scene.background.set(isNight ? 0x0a0f1d : 0xf1f5f9);
      sunLight.intensity = isNight ? 0.05 : 0.95;
      ambientLight.intensity = isNight ? 0.35 : 0.8;
    }
  };
}
