// 부산연구원 신사옥 기준층 (4~13F) 스마트 연구실 3D 디지털 트윈
// 도면 A-043 (지상 기준층 연구실 평면도) 1:1 정밀 치수 및 최신 사용자 피드백 완벽 반영
//
// [도면 A-043 정밀 공간 구획 및 치수]:
// 전체 외곽: 가로 17.7m (X = -8.85 ~ +8.85) x 세로 22.0m (Z = -11.0 ~ +11.0)
// 1. 개별 연구실 1~7실 (서측 전체): 폭 6,000mm (X = -8.85 ~ -2.85)
//    - 서측 창가 전망형 메인 집무 데스크, 듀얼 모니터, 5단 대형 서가, 접견 원형 테이블 세트
// 2. 메인 관통 복도: 폭 2,000mm (X = -2.85 ~ -0.85)
// 3. 연구원실 11인실 (북동측 상단): 가로 9.1m x 세로 10.4m (Z = -11.0 ~ -0.6)
//    - ★ 서측 복도면(X = -0.85) 및 남측 홀면(Z = -0.6) 전체를 유리 칸막이벽(Glass Wall / 1/2 불투명 에칭)으로 완벽 구획
//    - 2.2m x 2.5m 모듈형 11석 워크스테이션 3개 열 (4석 + 3석 + 4석 = 11석) 정밀 배치
// 4. 소회의실 (동남측 하단): 가로 3,231mm x 세로 7,130mm (X = +5.62 ~ +8.85, Z = +3.87 ~ +11.0)
//    - ★ 12인 대형 회의 완벽 수용: 길이 4.2m 대형 모던 회의 테이블 & 12석 회의용 체어 완비
//    - 북측 벽면 스마트 화상 프레젠테이션 디스플레이
// 5. 연구실 8, 9 (남측 중앙): 폭 각 3,000mm x 세로 6.5m (Z = +4.5 ~ +11.0)
// 6. OA실 (동측 중앙): 가로 3.23m x 세로 2.4m (Z = +1.4 ~ +3.87)

function initStandardFloor3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  // Camera setup
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(20, 22, 22);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // OrbitControls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 65;
  controls.target.set(0, 1.2, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.72);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff8ee, 0.88);
  sunLight.position.set(16, 26, 12);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 80;
  const d = 20;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.35);
  fillLight.position.set(-16, 16, -16);
  scene.add(fillLight);

  // Materials
  const floorTileMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.05
  });

  const roomFloorMat = new THREE.MeshStandardMaterial({
    color: 0xedf2f7,
    roughness: 0.45
  });

  const researcherFloorMat = new THREE.MeshStandardMaterial({
    color: 0xe8edf4,
    roughness: 0.4
  });

  const confFloorMat = new THREE.MeshStandardMaterial({
    color: 0xd9e2ec,
    roughness: 0.45
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.85,
    transparent: true,
    opacity: 1.0
  });

  const columnMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8e3,
    roughness: 0.6
  });

  const wallAccentMat = new THREE.MeshStandardMaterial({
    color: 0x004b8d, // 부산연구원 C.I 네이비 블루
    roughness: 0.5
  });

  // 연구원실 전용 유리 칸막이벽 재질 (알루미늄 프레임과 고급 1/2 에칭유리)
  const glassPartitionMat = new THREE.MeshPhysicalMaterial({
    color: 0xd9edfc, // 투명하고 세련된 아이스 스카이블루 유리빛
    transparent: true,
    opacity: 0.52,
    roughness: 0.15,
    metalness: 0.15,
    transmission: 0.78,
    thickness: 0.45
  });

  // 에칭 유리 프라이버시 시트지 밴드 (반투명 서리유리 띠장)
  const frostSheetMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.82,
    roughness: 0.6
  });

  const glassWindowMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
    thickness: 0.5
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0xd4be9b, // 내추럴 오크
    roughness: 0.55
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x7c5d3b, // 월넛/다크우드
    roughness: 0.5
  });

  const deskTopMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // 깔끔한 화이트/아이보리 상판
    roughness: 0.3
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // 흑색 메탈 프레임
    roughness: 0.3,
    metalness: 0.7
  });

  const partitionMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // 웜 그레이 패브릭 파티션
    roughness: 0.9
  });

  const partitionAccentMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // BDI 블루 포인트 파티션
    roughness: 0.85
  });

  const chairMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.7
  });

  const confChairMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.6
  });

  const screenMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  const blindMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.9,
    side: THREE.DoubleSide
  });

  // Root Model Group
  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // 1. 전체 바닥 슬래브 (22m x 17.7m x 0.2m)
  const floorGeo = new THREE.BoxGeometry(17.7, 0.2, 22.0);
  const floorMesh = new THREE.Mesh(floorGeo, floorTileMat);
  floorMesh.position.y = -0.1;
  floorMesh.receiveShadow = true;
  modelGroup.add(floorMesh);

  // 복도 및 타일 라인
  const gridHelper = new THREE.GridHelper(22, 22, 0x94a3b8, 0xcfd8dc);
  gridHelper.position.y = 0.01;
  modelGroup.add(gridHelper);

  // 개별 연구실 1~7 구역 바닥 (X: -8.85 ~ -2.85, 폭 6.0m)
  const roomFloorGeo = new THREE.BoxGeometry(6.0, 0.02, 21.4);
  const roomFloorMesh = new THREE.Mesh(roomFloorGeo, roomFloorMat);
  roomFloorMesh.position.set(-5.85, 0.01, -0.3);
  roomFloorMesh.receiveShadow = true;
  modelGroup.add(roomFloorMesh);

  // 연구원실(11인) 전용 바닥 (X: -0.85 ~ +8.85, 폭 9.7m x Z: -11.0 ~ -0.6, 세로 10.4m)
  const researcherFloorMesh = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.02, 10.4), researcherFloorMat);
  researcherFloorMesh.position.set(4.0, 0.01, -5.8);
  researcherFloorMesh.receiveShadow = true;
  modelGroup.add(researcherFloorMesh);

  // 소회의실(12인) 전용 바닥 (X: +5.62 ~ +8.85, 폭 3.23m x Z: +3.87 ~ +11.0, 세로 7.13m)
  const confFloorMesh = new THREE.Mesh(new THREE.BoxGeometry(3.23, 0.02, 7.13), confFloorMat);
  confFloorMesh.position.set(7.235, 0.01, 7.435);
  confFloorMesh.receiveShadow = true;
  modelGroup.add(confFloorMesh);

  // 벽체 생성 헬퍼 함수
  const wallHeight = 2.8;
  function createWall(w, h, d, x, y, z, mat = wallMat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    modelGroup.add(mesh);
    return mesh;
  }

  // 구조 기둥 생성 헬퍼 (600x600mm)
  function createColumn(x, z, w = 0.6, d = 0.6) {
    const colGeo = new THREE.BoxGeometry(w, wallHeight, d);
    const col = new THREE.Mesh(colGeo, columnMat);
    col.position.set(x, wallHeight / 2, z);
    col.castShadow = true;
    col.receiveShadow = true;
    modelGroup.add(col);
    return col;
  }

  // 도면 주요 구조 기둥 배치
  createColumn(-2.85, -11.0);
  createColumn(-2.85, -4.4);
  createColumn(-2.85, 2.4);
  createColumn(-2.85, 11.0);
  createColumn(8.85, -11.0);
  createColumn(8.85, -4.4);
  createColumn(8.85, 2.4);
  createColumn(8.85, 11.0);

  // 2. 외벽 및 창호
  const extT = 0.2;
  createWall(17.7, wallHeight, extT, 0, wallHeight / 2, -11.0); // 북측 외벽
  createWall(extT, wallHeight, 22.0, 8.85, wallHeight / 2, 0);  // 동측 외벽
  createWall(17.7, wallHeight, extT, 0, wallHeight / 2, 11.0);  // 남측 외벽

  // 서측 외벽 창대 및 통창 (연구실 1~7 창가)
  createWall(extT, 0.85, 22.0, -8.85, 0.425, 0);
  createWall(extT, 0.45, 22.0, -8.85, wallHeight - 0.225, 0);
  const westWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.5, 21.9), glassWindowMat);
  westWindow.position.set(-8.85, 1.6, 0);
  modelGroup.add(westWindow);

  // 각 연구실 창문 방염 롤블라인더
  for (let z = -9.5; z <= 9.5; z += 3.05) {
    const blind = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.2), blindMat);
    blind.position.set(-8.82, 1.75, z);
    blind.rotation.y = Math.PI / 2;
    modelGroup.add(blind);
  }

  // ==========================================
  // 3. [개별 연구실 1 ~ 7] (서측 폭 6,000mm x 세로 각 3,050mm)
  // ==========================================
  const intT = 0.1;
  const roomDepth = 6.0;

  // 연구실 1~7과 복도를 가르는 복도벽 (X = -2.85)
  createWall(intT, wallHeight, 21.4, -2.85, wallHeight / 2, -0.3);

  // 연구실 간 칸막이벽 6개소
  const roomDividerZ = [-7.95, -4.90, -1.85, 1.20, 4.25, 7.30];
  roomDividerZ.forEach(z => {
    createWall(roomDepth, wallHeight, intT, -5.85, wallHeight / 2, z);
  });
  createWall(roomDepth, wallHeight, intT, -5.85, wallHeight / 2, 10.4);

  // 연구실 1~7 가구 세팅
  function setupPrivateResearchRoom(centerZ) {
    const group = new THREE.Group();
    const deskX = -6.8;
    const deskZ = centerZ - 0.5;
    const desk = createDeskMesh(1.8, 0.85, 0.74, woodMat);
    desk.position.set(deskX, 0, deskZ);
    group.add(desk);

    const chair = createOfficeChair();
    chair.position.set(deskX, 0, deskZ + 0.5);
    chair.rotation.y = Math.PI;
    group.add(chair);

    const monitors = createDualMonitors();
    monitors.position.set(deskX, 0.74, deskZ - 0.15);
    group.add(monitors);

    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 0.35), darkWoodMat);
    shelf.position.set(-5.5, 1.0, centerZ + 1.25);
    shelf.castShadow = true;
    group.add(shelf);

    const guestTable = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.65, 24), woodMat);
    guestTable.position.set(-4.0, 0.325, centerZ - 0.5);
    guestTable.castShadow = true;
    group.add(guestTable);

    const guestChair1 = createOfficeChair(0x475569);
    guestChair1.position.set(-4.0, 0, centerZ - 1.1);
    group.add(guestChair1);

    const guestChair2 = createOfficeChair(0x475569);
    guestChair2.position.set(-4.0, 0, centerZ + 0.1);
    guestChair2.rotation.y = Math.PI;
    group.add(guestChair2);

    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 1.0), metalMat);
    doorFrame.position.set(-2.85, 1.05, centerZ - 0.9);
    group.add(doorFrame);

    modelGroup.add(group);
  }

  const roomCenters = [
    (-11.0 + -7.95) / 2,
    (-7.95 + -4.90) / 2,
    (-4.90 + -1.85) / 2,
    (-1.85 + 1.20) / 2,
    (1.20 + 4.25) / 2,
    (4.25 + 7.30) / 2,
    (7.30 + 10.40) / 2
  ];
  roomCenters.forEach(z => setupPrivateResearchRoom(z));

  // ==========================================
  // 4. [창고.2] (연구원실 북서측 코너 X = -0.85 ~ +1.5, Z = -11.0 ~ -9.4)
  // ==========================================
  createWall(intT, wallHeight, 1.6, 1.5, wallHeight / 2, -10.2);
  createWall(2.35, wallHeight, intT, 0.325, wallHeight / 2, -9.4);

  // ==========================================
  // ★ 5. [연구원실 (11인실)] (북동측 가로 9.1m x 세로 10.4m, Z = -11.0 ~ -0.6) ★
  // [사용자 요구 100% 반영]:
  // - 서측 복도면(X = -0.85) 및 남측 홀면(Z = -0.6) 전체를 뚜렷한 "유리 칸막이벽"으로 시공!
  // - 알루미늄 블랙 프레임 + 세로 멀리온 기둥 격자 + 프라이버시 에칭 밴드로 독립된 유리벽 방 완벽 구별!
  // ==========================================
  // 1) 서측 복도면 유리벽 (X = -0.85, Z = -9.4 ~ -0.6, 길이 8.8m)
  const westGlassWall = new THREE.Mesh(new THREE.BoxGeometry(0.06, wallHeight, 8.8), glassPartitionMat);
  westGlassWall.position.set(-0.85, wallHeight / 2, -5.0);
  modelGroup.add(westGlassWall);

  // 서측 유리벽 프라이버시 에칭 시트지 밴드 (높이 0.75m, 사람 눈높이 차폐)
  const westFrostBand = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 8.78), frostSheetMat);
  westFrostBand.position.set(-0.85, 1.25, -5.0);
  modelGroup.add(westFrostBand);

  // 서측 유리벽 수평 프레임 (상단/중간/하단/걸레받이)
  const westFrameTop = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 8.8), metalMat);
  westFrameTop.position.set(-0.85, wallHeight - 0.04, -5.0);
  modelGroup.add(westFrameTop);
  const westFrameMid1 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 8.8), metalMat);
  westFrameMid1.position.set(-0.85, 1.625, -5.0);
  modelGroup.add(westFrameMid1);
  const westFrameMid2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 8.8), metalMat);
  westFrameMid2.position.set(-0.85, 0.875, -5.0);
  modelGroup.add(westFrameMid2);
  const westFrameBot = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.1, 8.8), metalMat);
  westFrameBot.position.set(-0.85, 0.05, -5.0);
  modelGroup.add(westFrameBot);

  // 서측 유리벽 세로 멀리온(수직 프레임 기둥) 7개소 (격자 유리벽 구현)
  const westMullionZ = [-9.4, -7.93, -6.46, -5.0, -3.53, -2.06, -0.6];
  westMullionZ.forEach(z => {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.09, wallHeight, 0.07), metalMat);
    mullion.position.set(-0.85, wallHeight / 2, z);
    modelGroup.add(mullion);
  });

  // 2) 남측 홀면 유리벽 (Z = -0.6, X = -0.85 ~ +8.85, 폭 9.7m)
  // 도어 구간(X = +2.0 ~ +3.0)을 고려하여 좌(2.85m)/우(5.85m) 유리벽 분할 배치
  const southGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(2.85, wallHeight, 0.06), glassPartitionMat);
  southGlassLeft.position.set(0.575, wallHeight / 2, -0.6);
  modelGroup.add(southGlassLeft);

  const southGlassRight = new THREE.Mesh(new THREE.BoxGeometry(5.85, wallHeight, 0.06), glassPartitionMat);
  southGlassRight.position.set(5.925, wallHeight / 2, -0.6);
  modelGroup.add(southGlassRight);

  // 남측 프라이버시 에칭 시트지 밴드 (좌/우)
  const southFrostLeft = new THREE.Mesh(new THREE.BoxGeometry(2.84, 0.75, 0.07), frostSheetMat);
  southFrostLeft.position.set(0.575, 1.25, -0.6);
  modelGroup.add(southFrostLeft);

  const southFrostRight = new THREE.Mesh(new THREE.BoxGeometry(5.84, 0.75, 0.07), frostSheetMat);
  southFrostRight.position.set(5.925, 1.25, -0.6);
  modelGroup.add(southFrostRight);

  // 남측 유리벽 수평 프레임
  const southFrameTop = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.08, 0.09), metalMat);
  southFrameTop.position.set(4.0, wallHeight - 0.04, -0.6);
  modelGroup.add(southFrameTop);
  const southFrameMid1 = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.04, 0.09), metalMat);
  southFrameMid1.position.set(4.0, 1.625, -0.6);
  modelGroup.add(southFrameMid1);
  const southFrameMid2 = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.04, 0.09), metalMat);
  southFrameMid2.position.set(4.0, 0.875, -0.6);
  modelGroup.add(southFrameMid2);
  const southFrameBot = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.1, 0.09), metalMat);
  southFrameBot.position.set(4.0, 0.05, -0.6);
  modelGroup.add(southFrameBot);

  // 남측 유리벽 세로 멀리온(수직 프레임) 8개소
  const southMullionX = [-0.85, 0.6, 2.0, 3.0, 4.46, 5.92, 7.38, 8.85];
  southMullionX.forEach(x => {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.07, wallHeight, 0.09), metalMat);
    mullion.position.set(x, wallHeight / 2, -0.6);
    modelGroup.add(mullion);
  });

  // 남측 강화유리 출입 도어 (외여닫이문 X = +2.5, Z = -0.6)
  const glassDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.15, 0.1), metalMat);
  glassDoorFrame.position.set(2.5, 1.075, -0.6);
  modelGroup.add(glassDoorFrame);

  const glassDoorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.92, 2.05, 0.04), glassPartitionMat);
  glassDoorLeaf.position.set(2.5, 1.05, -0.6);
  modelGroup.add(glassDoorLeaf);

  const doorFrostBand = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.75, 0.045), frostSheetMat);
  doorFrostBand.position.set(2.5, 1.25, -0.6);
  modelGroup.add(doorFrostBand);

  // 스테인리스 롱 D자 손잡이 (안팎 2개)
  const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
  const handleOuter = new THREE.Mesh(handleGeo, metalMat);
  handleOuter.position.set(2.88, 1.05, -0.54);
  modelGroup.add(handleOuter);
  const handleInner = new THREE.Mesh(handleGeo, metalMat);
  handleInner.position.set(2.88, 1.05, -0.66);
  modelGroup.add(handleInner);

  // 3) 연구원실 내부 11석 워크스테이션 (3개 열 배치: 4석 + 3석 + 4석 = 11석)
  function createWorkstationDesk(x, z, rotY = 0, isAccent = false) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    // 메인 책상 (1.6m x 0.8m)
    const desk = createDeskMesh(1.6, 0.8, 0.74, deskTopMat);
    group.add(desk);

    // L자형 보조 책상 (0.9m x 0.5m)
    const sideDesk = createDeskMesh(0.5, 0.9, 0.74, deskTopMat);
    sideDesk.position.set(0.85, 0, 0.05);
    group.add(sideDesk);

    // 이동식 서랍장
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.58, 0.5), metalMat);
    drawer.position.set(-0.55, 0.29, 0);
    drawer.castShadow = true;
    group.add(drawer);

    // 패브릭 흡음 파티션
    const frontPart = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.15, 0.05),
      isAccent ? partitionAccentMat : partitionMat
    );
    frontPart.position.set(0, 1.15 / 2, -0.42);
    frontPart.castShadow = true;
    group.add(frontPart);

    const sidePart = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.0, 1.3),
      partitionMat
    );
    sidePart.position.set(-0.82, 0.5, 0.2);
    sidePart.castShadow = true;
    group.add(sidePart);

    // 듀얼 모니터
    const monitors = createDualMonitors();
    monitors.position.set(0, 0.74, -0.25);
    group.add(monitors);

    // 의자
    const chair = createOfficeChair();
    chair.position.set(0, 0, 0.45);
    chair.rotation.y = Math.PI;
    group.add(chair);

    modelGroup.add(group);
  }

  // 열 1 (서측 유리벽변 4석, X = +0.65)
  const col1Z = [-9.3, -7.0, -4.7, -2.4];
  col1Z.forEach((z, i) => createWorkstationDesk(0.65, z, 0, i % 2 === 1));

  // 열 2 (중앙 대향열 3석, X = +3.45)
  const col2Z = [-7.0, -4.7, -2.4];
  col2Z.forEach((z, i) => createWorkstationDesk(3.45, z, Math.PI, i === 1));

  // 열 3 (동측 외벽변 4석, X = +6.25)
  const col3Z = [-9.3, -7.0, -4.7, -2.4];
  col3Z.forEach((z, i) => createWorkstationDesk(6.25, z, 0, i === 2));

  // ==========================================
  // ★ 6. [소회의실: 12인 회의실] (동남측 가로 3,231mm x 세로 7,130mm, Z = +3.87 ~ +11.0) ★
  // [사용자 요구 100% 반영]:
  // - 12인 회의가 여유롭게 가능한 대형 회의 테이블(4.2m x 1.2m) 구축
  // - 12석의 고급 회의용 체어(양측 5석씩 + 상하 1석씩 = 12석) 완비
  // - 북측 벽면 스마트 디스플레이 스크린 완비
  // ==========================================
  // 소회의실 서측 칸막이벽 (X = +5.62, Z = +3.87 ~ +11.0, 길이 7.13m)
  createWall(intT, wallHeight, 7.13, 5.62, wallHeight / 2, 7.435);
  // 소회의실 북측 칸막이벽 (Z = +3.87, X = +5.62 ~ +8.85, 폭 3.23m)
  createWall(3.23, wallHeight, intT, 7.235, wallHeight / 2, 3.87);

  // 12인용 대형 회의 테이블 (길이 4.2m x 폭 1.2m 모던 월넛/오크)
  const confTableCenterZ = 7.45;
  const confTableCenterX = 7.235;
  const confTable = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 4.2), darkWoodMat);
  confTable.position.set(confTableCenterX, 0.74, confTableCenterZ);
  confTable.castShadow = true;
  modelGroup.add(confTable);

  // 테이블 중앙 스마트 매립형 콘센트 & 케이블 덕트
  const confDuct = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.01, 3.2), metalMat);
  confDuct.position.set(confTableCenterX, 0.775, confTableCenterZ);
  modelGroup.add(confDuct);

  // 테이블 하부 스틸 다리 3개소
  [-1.4, 0, 1.4].forEach(offZ => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.71, 0.08), metalMat);
    leg.position.set(confTableCenterX, 0.355, confTableCenterZ + offZ);
    leg.castShadow = true;
    modelGroup.add(leg);
  });

  // ★ 12석 회의용 체어 (서측 5석 + 동측 5석 + 북측 1석 + 남측 1석 = 12석) ★
  // 1) 서측 5석 (X = +6.45)
  for (let z = confTableCenterZ - 1.6; z <= confTableCenterZ + 1.65; z += 0.8) {
    const chair = createOfficeChair(0x1e293b);
    chair.position.set(confTableCenterX - 0.78, 0, z);
    chair.rotation.y = Math.PI / 2; // 테이블(동쪽) 응시
    modelGroup.add(chair);
  }
  // 2) 동측 5석 (X = +8.02)
  for (let z = confTableCenterZ - 1.6; z <= confTableCenterZ + 1.65; z += 0.8) {
    const chair = createOfficeChair(0x1e293b);
    chair.position.set(confTableCenterX + 0.78, 0, z);
    chair.rotation.y = -Math.PI / 2; // 테이블(서쪽) 응시
    modelGroup.add(chair);
  }
  // 3) 북측 상석 1석 (Z = confTableCenterZ - 2.5)
  const chairNorth = createOfficeChair(0x0f172a);
  chairNorth.position.set(confTableCenterX, 0, confTableCenterZ - 2.45);
  chairNorth.rotation.y = Math.PI; // 테이블(남쪽) 응시
  modelGroup.add(chairNorth);

  // 4) 남측 1석 (Z = confTableCenterZ + 2.5)
  const chairSouth = createOfficeChair(0x0f172a);
  chairSouth.position.set(confTableCenterX, 0, confTableCenterZ + 2.45);
  chairSouth.rotation.y = 0; // 테이블(북쪽) 응시
  modelGroup.add(chairSouth);

  // 북측 벽면 75인치 프레젠테이션 스마트 디스플레이 & 화상회의 바
  const confTv = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.05, 0.05), screenMat);
  confTv.position.set(confTableCenterX, 1.75, 3.95);
  modelGroup.add(confTv);

  const soundBar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.08), metalMat);
  soundBar.position.set(confTableCenterX, 1.15, 3.95);
  modelGroup.add(soundBar);

  // 소회의실 출입 도어 (홀 방향 Z = +3.87, X = +6.2)
  const confDoor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.1, 0.08), metalMat);
  confDoor.position.set(6.25, 1.05, 3.87);
  modelGroup.add(confDoor);

  // 테이블 위 화상회의 회의용 슬림 노트북 4대 & 마이크 유닛
  const laptopGeo = new THREE.BoxGeometry(0.32, 0.015, 0.22);
  const laptopScreenGeo = new THREE.BoxGeometry(0.32, 0.22, 0.015);
  [-1.0, 0.8].forEach(zOffset => {
    // 서측 노트북
    const lapBaseW = new THREE.Mesh(laptopGeo, metalMat);
    lapBaseW.position.set(confTableCenterX - 0.28, 0.78, confTableCenterZ + zOffset);
    modelGroup.add(lapBaseW);
    const lapScrnW = new THREE.Mesh(laptopScreenGeo, screenMat);
    lapScrnW.position.set(confTableCenterX - 0.38, 0.88, confTableCenterZ + zOffset);
    lapScrnW.rotation.z = -0.3;
    modelGroup.add(lapScrnW);

    // 동측 노트북
    const lapBaseE = new THREE.Mesh(laptopGeo, metalMat);
    lapBaseE.position.set(confTableCenterX + 0.28, 0.78, confTableCenterZ + zOffset - 0.4);
    modelGroup.add(lapBaseE);
    const lapScrnE = new THREE.Mesh(laptopScreenGeo, screenMat);
    lapScrnE.position.set(confTableCenterX + 0.38, 0.88, confTableCenterZ + zOffset - 0.4);
    lapScrnE.rotation.z = 0.3;
    modelGroup.add(lapScrnE);
  });

  // ==========================================
  // 7. [연구실 8 & 9 및 창고 3] (도면 A-043 치수 정밀 반영)
  // ==========================================
  // 연구실 8/9 사이벽 (X = +2.35, Z = +4.5 ~ +11.0)
  createWall(intT, wallHeight, 6.5, 2.35, wallHeight / 2, 7.75);
  // 복도 / 연구실 8 사이벽 (X = -0.85, Z = +4.5 ~ +11.0)
  createWall(intT, wallHeight, 6.5, -0.85, wallHeight / 2, 7.75);
  // 연구실 8, 9 북측 복도벽 (Z = +4.5, X = -0.85 ~ +5.62)
  createWall(6.47, wallHeight, intT, 2.385, wallHeight / 2, 4.5);

  // 창고.3 (중앙 홀 서측, 도면 A-043 실측: X = -0.85 ~ +0.95, Z = +1.8 ~ +4.5)
  createWall(1.8, wallHeight, intT, 0.05, wallHeight / 2, 1.8);
  createWall(intT, wallHeight, 2.7, 0.95, wallHeight / 2, 3.15);
  const storage3Door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.1, 0.08), metalMat);
  storage3Door.position.set(0.95, 1.05, 2.5);
  modelGroup.add(storage3Door);

  // 연구실 8 집무실 가구 (X = +0.75)
  createDeskMeshWithSetup(0.75, 8.5, woodMat);
  // 연구실 9 집무실 가구 (X = +3.98)
  createDeskMeshWithSetup(3.98, 8.5, woodMat);

  function createDeskMeshWithSetup(x, z, mat) {
    const d = createDeskMesh(1.8, 0.85, 0.74, mat);
    d.position.set(x, 0, z);
    modelGroup.add(d);
    const c = createOfficeChair();
    c.position.set(x, 0, z + 0.5);
    c.rotation.y = Math.PI;
    modelGroup.add(c);
    const m = createDualMonitors();
    m.position.set(x, 0.74, z - 0.15);
    modelGroup.add(m);
    const sh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.9, 0.35), darkWoodMat);
    sh.position.set(x, 0.95, z + 1.2);
    modelGroup.add(sh);
  }

  // 창고.1 (X = -2.85 ~ -0.85, Z = 7.3 ~ 11.0)
  createWall(2.0, wallHeight, intT, -1.85, wallHeight / 2, 7.3);

  // ==========================================
  // 8. [OA실 & 중앙 홀] (X = +5.62 ~ +8.85, Z = +1.4 ~ +3.87)
  // ==========================================
  // OA실 북측 벽체 (Z = +1.4)
  createWall(3.23, wallHeight, intT, 7.235, wallHeight / 2, 1.4);
  const copier = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.8), metalMat);
  copier.position.set(7.2, 0.5, 2.6);
  copier.castShadow = true;
  modelGroup.add(copier);

  // ==========================================
  // 9. 천장 그리드 & LED 조명 (토글 가능)
  // ==========================================
  const ceilingGroup = new THREE.Group();
  modelGroup.add(ceilingGroup);

  const ceilingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(17.7, 0.08, 22.0),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      transparent: true,
      opacity: 0.25
    })
  );
  ceilingMesh.position.y = wallHeight;
  ceilingGroup.add(ceilingMesh);

  // LED 300x1200 조명 기구들
  const lightFixtureMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let lx = -7.0; lx <= 7.0; lx += 2.8) {
    for (let lz = -9.0; lz <= 9.0; lz += 3.2) {
      const troffer = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 1.2), lightFixtureMat);
      troffer.position.set(lx, wallHeight - 0.02, lz);
      ceilingGroup.add(troffer);
    }
  }

  // ==========================================
  // 공통 가구 생성 함수
  // ==========================================
  function createDeskMesh(w, d, h, topMaterial) {
    const group = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, d), topMaterial);
    top.position.y = h;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    const legGeo = new THREE.BoxGeometry(0.04, h, 0.04);
    const legOffsets = [
      [-w / 2 + 0.04, h / 2, -d / 2 + 0.04],
      [w / 2 - 0.04, h / 2, -d / 2 + 0.04],
      [-w / 2 + 0.04, h / 2, d / 2 - 0.04],
      [w / 2 - 0.04, h / 2, d / 2 - 0.04]
    ];
    legOffsets.forEach(pos => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(...pos);
      leg.castShadow = true;
      group.add(leg);
    });
    return group;
  }

  function createDualMonitors() {
    const group = new THREE.Group();
    const monW = 0.52;
    const monH = 0.32;

    const m1 = new THREE.Mesh(new THREE.BoxGeometry(monW, monH, 0.02), metalMat);
    m1.position.set(-0.28, 0.22, 0);
    m1.rotation.y = 0.15;
    group.add(m1);
    const s1 = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.02, monH - 0.02), screenMat);
    s1.position.set(-0.28, 0.22, 0.015);
    s1.rotation.y = 0.15;
    group.add(s1);

    const m2 = new THREE.Mesh(new THREE.BoxGeometry(monW, monH, 0.02), metalMat);
    m2.position.set(0.28, 0.22, 0);
    m2.rotation.y = -0.15;
    group.add(m2);
    const s2 = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.02, monH - 0.02), screenMat);
    s2.position.set(0.28, 0.22, 0.015);
    s2.rotation.y = -0.15;
    group.add(s2);

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 12), metalMat);
    stand.position.set(0, 0.01, 0);
    group.add(stand);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8), metalMat);
    post.position.set(0, 0.125, -0.05);
    group.add(post);

    return group;
  }

  function createOfficeChair(seatColor = 0x1e293b) {
    const group = new THREE.Group();
    const customSeatMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.7 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.46), customSeatMat);
    seat.position.y = 0.46;
    seat.castShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.52, 0.04), customSeatMat);
    back.position.set(0, 0.74, 0.21);
    back.castShadow = true;
    group.add(back);

    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.04), customSeatMat);
    headrest.position.set(0, 1.05, 0.22);
    group.add(headrest);

    const armGeo = new THREE.BoxGeometry(0.05, 0.02, 0.25);
    const armL = new THREE.Mesh(armGeo, metalMat);
    armL.position.set(-0.24, 0.65, 0.05);
    group.add(armL);
    const armR = new THREE.Mesh(armGeo, metalMat);
    armR.position.set(0.24, 0.65, 0.05);
    group.add(armR);

    const baseCol = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.38, 8), metalMat);
    baseCol.position.y = 0.22;
    group.add(baseCol);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.28), metalMat);
      leg.position.set(Math.sin(angle) * 0.14, 0.04, Math.cos(angle) * 0.14);
      leg.rotation.y = angle;
      group.add(leg);
    }

    return group;
  }

  // Animation Loop
  let isRotating = false;
  function animate() {
    requestAnimationFrame(animate);
    if (isRotating) {
      modelGroup.rotation.y += 0.003;
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
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
    setIsoView: () => setCamera(new THREE.Vector3(20, 22, 22), new THREE.Vector3(0, 1.2, 0)),
    setTopView: () => setCamera(new THREE.Vector3(0, 28, 0.001), new THREE.Vector3(0, 0, 0)),
    // 연구원실 11석 및 유리 칸막이벽 포커스 뷰
    setWorkstationView: () => setCamera(new THREE.Vector3(4.0, 9.5, 5.0), new THREE.Vector3(4.0, 1.2, -5.5)),
    // 개별연구실 1~7실 포커스 뷰
    setPrivateOfficeView: () => setCamera(new THREE.Vector3(-1.0, 6.5, -4.5), new THREE.Vector3(-5.85, 1.2, -6.5)),
    // 소회의실 12인 회의 포커스 뷰
    setSmallConfView: () => setCamera(new THREE.Vector3(7.235, 7.0, 1.5), new THREE.Vector3(7.235, 1.0, 7.45)),
    // 복도 시점
    setCorridorView: () => setCamera(new THREE.Vector3(-1.85, 2.0, 9.5), new THREE.Vector3(-1.85, 1.5, -9.5)),
    toggleCeiling: (show) => { ceilingGroup.visible = show; },
    toggleWalls: (transparent) => {
      wallMat.opacity = transparent ? 0.35 : 1.0;
      glassPartitionMat.opacity = transparent ? 0.2 : 0.45;
    },
    toggleAutoRotate: () => { isRotating = !isRotating; return isRotating; },
    toggleNightMode: (isNight) => {
      scene.background.set(isNight ? 0x0a0f1d : 0xf1f5f9);
      sunLight.intensity = isNight ? 0.05 : 0.88;
      fillLight.intensity = isNight ? 0.05 : 0.35;
      ambientLight.intensity = isNight ? 0.3 : 0.72;
    }
  };
}
