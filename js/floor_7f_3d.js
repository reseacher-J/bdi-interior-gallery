// 부산연구원 신사옥 7층 임원실 및 경영실 3D 디지털 트윈
// 도면 A-057(평면도), A-059, A-064(원장실 TV장), A-066/067(부원장/경영실장실), A-070(간부회의실), A-082(승강기홀 템바보드) 정밀 반영
//
// [수정 핵심]:
// 1. 도면 A-057 1:1 정밀 치수: 가로 17.7m (X = -8.85 ~ +8.85) x 세로 22.0m (Z = -11.0 ~ +11.0)
// 2. 부원장실(세로 4.0m)과 경영관리실장실(세로 2.95m)의 확실한 크기 차이 구현
// 3. 관리사무원실: 팀장 1명 + 관리원 4명이 한 팀을 이루는 총 4개 팀(20석) 아일랜드 모듈 완벽 구축
// 4. 간부회의실: 12인 대형 회의 테이블, 12석 회의용 체어, 1/2 높이 에칭 시트 강화유리 벽체
// 5. 출입구 2개소 정밀 반영: 메인 복도 주출입구(폭 2,400mm) 및 북측 관리사무원 출입구, 승강기홀 템바보드 포인트월

function initFloor7F3D(containerId) {
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
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.35);
  fillLight.position.set(-16, 16, -16);
  scene.add(fillLight);

  // ==========================================
  // 재질 (Materials)
  // ==========================================
  // 기본 오피스 바닥
  const officeFloorMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.05
  });

  // E/V홀 천연 대리석 바닥 (A-082 스펙)
  const marbleFloorMat = new THREE.MeshStandardMaterial({
    color: 0xdfd8cb,
    roughness: 0.15,
    metalness: 0.1
  });

  // 원장실 최고급 카펫/우드 바닥
  const presFloorMat = new THREE.MeshStandardMaterial({
    color: 0xd5cbbb,
    roughness: 0.4
  });

  // 간부회의실 고급 카펫 바닥
  const confFloorMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc,
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

  // 원장실 방염 LPL 래핑보드 벽체 (A-064)
  const wrappingWallMat = new THREE.MeshStandardMaterial({
    color: 0xeee7dc,
    roughness: 0.5,
    transparent: true,
    opacity: 1.0
  });

  // 승강기홀 다크우드 방염 템바보드(Tambour Board) 포인트월
  const tambourWallMat = new THREE.MeshStandardMaterial({
    color: 0x3d281a,
    roughness: 0.45,
    metalness: 0.05
  });

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x9a7b56, // 내추럴/월넛 원목
    roughness: 0.45
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x332218, // 짙은 에보니/월넛
    roughness: 0.45
  });

  const lightWoodMat = new THREE.MeshStandardMaterial({
    color: 0xd8c2a3,
    roughness: 0.55
  });

  const deskTopMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3
  });

  const leatherSofaMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // VIP 다크네이비/블랙 가죽
    roughness: 0.5
  });

  const chairMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.6
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.3,
    metalness: 0.7
  });

  const screenMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8
  });

  // 간부회의실 12mm 강화유리 벽체 (투명 유리빛)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xd9edfc,
    transparent: true,
    opacity: 0.48,
    roughness: 0.15,
    metalness: 0.15,
    transmission: 0.8,
    thickness: 0.5
  });

  // 간부회의실 1/2 높이 에칭 시트지 밴드 (반투명 서리유리 마감)
  const frostSheetMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    transparent: true,
    opacity: 0.82,
    roughness: 0.6
  });

  const blindMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.9,
    side: THREE.DoubleSide
  });

  // Root Model Group
  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // ==========================================
  // 1. 전체 바닥 슬래브 (가로 17.7m x 세로 22.0m x 두께 0.2m)
  // 도면 A-057 정확한 비율: X(-8.85 ~ +8.85), Z(-11.0 ~ +11.0)
  // ==========================================
  const floorGeo = new THREE.BoxGeometry(17.7, 0.2, 22.0);
  const floorMesh = new THREE.Mesh(floorGeo, officeFloorMat);
  floorMesh.position.y = -0.1;
  floorMesh.receiveShadow = true;
  modelGroup.add(floorMesh);

  // 복도 및 바닥 타일 라인
  const gridHelper = new THREE.GridHelper(22, 22, 0x94a3b8, 0xcfd8dc);
  gridHelper.position.y = 0.01;
  modelGroup.add(gridHelper);

  // 1) 원장실 전용 프리미엄 바닥 (남서측: X = -8.85 ~ 0.0, Z = +4.0 ~ +11.0)
  const presFloorGeo = new THREE.BoxGeometry(8.85, 0.02, 7.0);
  const presFloorMesh = new THREE.Mesh(presFloorGeo, presFloorMat);
  presFloorMesh.position.set(-4.425, 0.01, 7.5);
  presFloorMesh.receiveShadow = true;
  modelGroup.add(presFloorMesh);

  // 2) 승강기홀 천연 대리석 바닥 구역 (중동측: X = +0.5 ~ +8.85, Z = -3.25 ~ +1.9)
  const evMarbleGeo = new THREE.BoxGeometry(8.35, 0.02, 5.15);
  const evMarbleMesh = new THREE.Mesh(evMarbleGeo, marbleFloorMat);
  evMarbleMesh.position.set(4.675, 0.01, -0.675);
  evMarbleMesh.receiveShadow = true;
  modelGroup.add(evMarbleMesh);

  // 3) 간부회의실 전용 카펫 바닥 (동측 중앙: X = +3.85 ~ +8.85, Z = +1.9 ~ +8.5)
  const confFloorGeo = new THREE.BoxGeometry(5.0, 0.02, 6.6);
  const confFloorMesh = new THREE.Mesh(confFloorGeo, confFloorMat);
  confFloorMesh.position.set(6.35, 0.01, 5.2);
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

  // 도면 구조 기둥 8개소 배치
  createColumn(-2.85, -11.0);
  createColumn(-2.85, -4.4);
  createColumn(-2.85, 2.4);
  createColumn(-2.85, 11.0);
  createColumn(8.85, -11.0);
  createColumn(8.85, -4.4);
  createColumn(8.85, 2.4);
  createColumn(8.85, 11.0);

  // ==========================================
  // 2. 외벽 및 창호 (가로 17.7m x 세로 22.0m)
  // ==========================================
  const extT = 0.2;
  const intT = 0.1;
  createWall(17.7, wallHeight, extT, 0, wallHeight / 2, -11.0); // 북측 창가 외벽
  createWall(17.7, wallHeight, extT, 0, wallHeight / 2, 11.0);  // 남측 창가 외벽
  createWall(extT, wallHeight, 22.0, -8.85, wallHeight / 2, 0); // 서측 외벽

  // 동측 외벽 (출입구 2개소 개구부 고려)
  // 동측 상단 (Z = -11.0 ~ -4.0, 길이 7.0m)
  createWall(extT, wallHeight, 7.0, 8.85, wallHeight / 2, -7.5);
  // 관리사무원 출입구 상부 인방 (Z = -3.25, 폭 1.5m)
  createWall(extT, 0.6, 1.5, 8.85, wallHeight - 0.3, -3.25);
  // 동측 중간 벽 (Z = -2.5 ~ -0.5, 길이 2.0m)
  createWall(extT, wallHeight, 2.0, 8.85, wallHeight / 2, -1.5);
  // 메인 주출입구 상부 인방 (Z = +0.7, 폭 2.4m)
  createWall(extT, 0.6, 2.4, 8.85, wallHeight - 0.3, 0.7);
  // 동측 하단 벽 (간부회의실 & 문서고 외벽: Z = +1.9 ~ +11.0, 길이 9.1m)
  createWall(extT, wallHeight, 9.1, 8.85, wallHeight / 2, 6.45);

  // 남측 창문 방염 롤블라인더
  for (let x = -8.0; x <= 8.0; x += 3.2) {
    const blind = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.3), blindMat);
    blind.position.set(x, 1.75, 10.88);
    modelGroup.add(blind);
  }

  // ==========================================
  // 3. [A. 남서측: 원장실 (President Suite)]
  // 도면 A-057, A-059, A-064 스펙 완벽 반영
  // 위치: 가로 8,850mm (X = -8.85 ~ 0.0) x 세로 7,000mm (Z = +4.0 ~ +11.0)
  // ==========================================
  // 원장실 북측 벽체 (Z = +4.0, X = -8.85 ~ 0.0) - LPL 레핑보드 마감
  createWall(8.85, wallHeight, intT, -4.425, wallHeight / 2, 4.0, wrappingWallMat);
  // 원장실 동측 분리벽 (X = 0.0, Z = +4.0 ~ +11.0) - LPL 레핑보드 마감
  createWall(intT, wallHeight, 7.0, 0.0, wallHeight / 2, 7.5, wrappingWallMat);

  // 부속실 연결 도어 (X = 0.0, Z = +5.2)
  const presDoor = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.15, 1.0), darkWoodMat);
  presDoor.position.set(0.0, 1.075, 5.2);
  modelGroup.add(presDoor);

  // 1) ★ 북측 벽면: 3,200 x 1,800mm 대형 맞춤형 미디어 TV장 (A-064 전개도 스펙 완벽 반영!)
  const tvUnit = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 0.35), darkWoodMat);
  tvUnit.position.set(-4.425, 1.3, 4.2);
  tvUnit.castShadow = true;
  modelGroup.add(tvUnit);

  const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.25, 0.05), screenMat);
  tvScreen.position.set(-4.425, 1.35, 4.38);
  modelGroup.add(tvScreen);

  // 2) 최고급 원목 원장 집무 데스크 (너비 2.4m x 깊이 1.1m) - 남측 창가 조망
  const presDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.1), woodMat);
  presDesk.position.set(-6.0, 0.74, 9.0);
  presDesk.castShadow = true;
  modelGroup.add(presDesk);

  const presModesty = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 0.03), darkWoodMat);
  presModesty.position.set(-6.0, 0.45, 8.45);
  modelGroup.add(presModesty);

  // 원장 하이백 천연가죽 의자 (북측 응시)
  createOfficeChairMesh(-6.0, 9.7, 0, 0x0f172a, true);

  // 원장 데스크 전면 접견용 의자 2석
  createOfficeChairMesh(-6.8, 8.0, Math.PI, 0x1e293b);
  createOfficeChairMesh(-5.2, 8.0, Math.PI, 0x1e293b);

  // 후면 최고급 원목 대형 서가/책장 (남측 벽면 Z = +10.7)
  const presBookshelf = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.1, 0.4), darkWoodMat);
  presBookshelf.position.set(-6.0, 1.05, 10.7);
  presBookshelf.castShadow = true;
  modelGroup.add(presBookshelf);

  // 3) VIP 접견 공간 (원장실 동측 X = -2.2, Z = +7.5 부근)
  createSofaMesh(-2.2, 8.8, 2.2, 0.85, 0.8, leatherSofaMat, 0); // 3인 소파
  createSofaMesh(-3.4, 7.5, 0.9, 0.85, 0.8, leatherSofaMat, Math.PI / 2); // 1인 소파 좌
  createSofaMesh(-1.0, 7.5, 0.9, 0.85, 0.8, leatherSofaMat, -Math.PI / 2); // 1인 소파 우
  const teaTable = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.8), woodMat);
  teaTable.position.set(-2.2, 0.225, 7.5);
  teaTable.castShadow = true;
  modelGroup.add(teaTable);

  // ==========================================
  // 4. [B. 남측 중앙/동측: 부속실(비서실), 탕비실, 문서고]
  // ==========================================
  // 1) 부속실 (비서실: X = 0.0 ~ +3.85, Z = +4.0 ~ +9.5)
  createWall(intT, wallHeight, 5.5, 3.85, wallHeight / 2, 6.75); // 동측 분리벽
  createWall(2.15, wallHeight, intT, 1.075, wallHeight / 2, 9.5); // 남측 탕비실 경계벽

  // 비서 행정 데스크 및 하이백 체어
  const secDesk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.8), lightWoodMat);
  secDesk.position.set(1.5, 0.74, 5.5);
  modelGroup.add(secDesk);
  createOfficeChairMesh(1.5, 6.1, 0);
  const secMon = createDualMonitors();
  secMon.position.set(1.5, 0.74, 5.3);
  modelGroup.add(secMon);

  // 내방객 대기 소파
  createSofaMesh(2.5, 8.0, 1.6, 0.75, 0.75, leatherSofaMat, -Math.PI / 2);

  // 2) 탕비실 (X = 0.0 ~ +2.15, Z = +9.5 ~ +11.0)
  const sink = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.85, 0.8), metalMat);
  sink.position.set(1.0, 0.425, 10.5);
  sink.castShadow = true;
  modelGroup.add(sink);

  // 3) 문서고 (남동측: X = +3.85 ~ +8.85, Z = +8.5 ~ +11.0, 폭 5.0m x 깊이 2.5m)
  createWall(5.0, wallHeight, intT, 6.35, wallHeight / 2, 8.5); // 북측 간부회의실과의 경계벽
  // 대형 모빌랙 슬라이딩 서가 3열
  for (let rz = 9.2; rz <= 10.6; rz += 0.7) {
    const docRack = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.1, 0.45), metalMat);
    docRack.position.set(6.35, 1.05, rz);
    docRack.castShadow = true;
    modelGroup.add(docRack);
  }

  // ==========================================
  // ★ 5. [C. 서측 임원실: 부원장실 vs 경영관리실장실] ★
  // [사용자 요구 100% 반영]:
  // - 두 방의 크기 차이를 도면 A-057에 따라 명확히 구별!
  // - 부원장실: 세로 4,000mm (4.0m) -> 넉넉한 대형 집무실 (Z = 0.0 ~ +4.0)
  // - 경영관리실장실: 세로 2,950mm (2.95m) -> 표준 독립 집무실 (Z = -3.05 ~ 0.0)
  // ==========================================
  // 서측 복도벽 (X = -2.85, Z = -3.05 ~ +4.0, 길이 7.05m)
  createWall(intT, wallHeight, 7.05, -2.85, wallHeight / 2, 0.475);
  // 부원장실 / 경영실장실 사이벽 (Z = 0.0, X = -8.85 ~ -2.85, 폭 6.0m)
  createWall(6.0, wallHeight, intT, -5.85, wallHeight / 2, 0.0);
  // 경영관리실장실 북측 복도벽 (Z = -3.05, X = -8.85 ~ -2.85, 폭 6.0m)
  createWall(6.0, wallHeight, intT, -5.85, wallHeight / 2, -3.05);

  // 1) ★ 부원장실 (세로 4.0m x 가로 6.0m = 24㎡, 중심 Z = +2.0)
  setupVicePresidentSuite(-5.85, 2.0);

  function setupVicePresidentSuite(cx, cz) {
    // 2.2m 고급 월넛 집무 데스크
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.07, 0.95), woodMat);
    desk.position.set(cx - 1.0, 0.74, cz - 0.3);
    desk.castShadow = true;
    modelGroup.add(desk);

    // 하이백 임원 체어
    createOfficeChairMesh(cx - 1.0, cz - 0.9, 0, 0x0f172a, true);

    // 서측 창가 3단 듀얼 모니터
    const mon = createDualMonitors();
    mon.position.set(cx - 1.0, 0.74, cz - 0.15);
    modelGroup.add(mon);

    // 서측 벽면 3.0m 대형 서가
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 2.0, 3.0), darkWoodMat);
    shelf.position.set(-8.6, 1.0, cz);
    modelGroup.add(shelf);

    // 넉넉한 3인 접견 소파 및 티테이블 세트
    createSofaMesh(cx + 1.6, cz, 1.8, 0.75, 0.75, leatherSofaMat, -Math.PI / 2);
    const smallTable = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 1.2), lightWoodMat);
    smallTable.position.set(cx + 0.6, 0.225, cz);
    modelGroup.add(smallTable);

    // 복도 출입문
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.95), darkWoodMat);
    door.position.set(-2.85, 1.05, cz + 1.2);
    modelGroup.add(door);
  }

  // 2) ★ 경영관리실장실 (세로 2.95m x 가로 6.0m = 17.7㎡, 중심 Z = -1.5)
  setupManagingDirectorSuite(-5.85, -1.5);

  function setupManagingDirectorSuite(cx, cz) {
    // 1.8m 실장 집무 데스크 (방 크기에 알맞게 컴팩트 배치)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.07, 0.85), woodMat);
    desk.position.set(cx - 1.0, 0.74, cz - 0.2);
    desk.castShadow = true;
    modelGroup.add(desk);

    // 하이백 임원 체어
    createOfficeChairMesh(cx - 1.0, cz - 0.75, 0, 0x1e293b, true);

    const mon = createDualMonitors();
    mon.position.set(cx - 1.0, 0.74, cz - 0.05);
    modelGroup.add(mon);

    // 서측 벽면 2.0m 서가
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.38, 2.0, 2.0), darkWoodMat);
    shelf.position.set(-8.6, 1.0, cz);
    modelGroup.add(shelf);

    // 2인 접견 소파 및 원형 티테이블
    createSofaMesh(cx + 1.6, cz, 1.3, 0.7, 0.75, leatherSofaMat, -Math.PI / 2);
    const table = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.45, 16), lightWoodMat);
    table.position.set(cx + 0.6, 0.225, cz);
    modelGroup.add(table);

    // 복도 출입문
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.1, 0.95), darkWoodMat);
    door.position.set(-2.85, 1.05, cz + 0.8);
    modelGroup.add(door);
  }

  // ==========================================
  // ★ 6. [D. 동측 간부회의실: 12인 회의실] ★
  // 도면 A-057, A-070 스펙:
  // - 가로 5,000mm x 세로 6,600mm (X = +3.85 ~ +8.85, Z = +1.9 ~ +8.5)
  // - 북측 및 서측 벽체: 12mm 강화유리 벽체에 1/2 높이의 에칭 시트 부착!
  // - 12인 대형 고급 회의 테이블 및 12석 하이백 가죽 체어 완비!
  // ==========================================
  // 서측 강화유리 벽체 (X = +3.85, Z = +1.9 ~ +8.5, 길이 6.6m)
  const confGlassWest = new THREE.Mesh(new THREE.BoxGeometry(0.06, wallHeight, 6.6), glassMat);
  confGlassWest.position.set(3.85, wallHeight / 2, 5.2);
  modelGroup.add(confGlassWest);

  // 서측 유리벽 프라이버시 에칭 밴드 (높이 75cm)
  const confFrostWest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 6.58), frostSheetMat);
  confFrostWest.position.set(3.85, 1.25, 5.2);
  modelGroup.add(confFrostWest);

  // 북측 강화유리 벽체 (Z = +1.9, X = +3.85 ~ +8.85, 폭 5.0m)
  const confGlassNorth = new THREE.Mesh(new THREE.BoxGeometry(5.0, wallHeight, 0.06), glassMat);
  confGlassNorth.position.set(6.35, wallHeight / 2, 1.9);
  modelGroup.add(confGlassNorth);

  // 북측 유리벽 프라이버시 에칭 밴드
  const confFrostNorth = new THREE.Mesh(new THREE.BoxGeometry(4.98, 0.75, 0.07), frostSheetMat);
  confFrostNorth.position.set(6.35, 1.25, 1.9);
  modelGroup.add(confFrostNorth);

  // 유리벽 알루미늄 프레임 & 멀리온
  const confFrameTopW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 6.6), metalMat);
  confFrameTopW.position.set(3.85, wallHeight - 0.04, 5.2);
  modelGroup.add(confFrameTopW);
  const confFrameBotW = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 6.6), metalMat);
  confFrameBotW.position.set(3.85, 0.04, 5.2);
  modelGroup.add(confFrameBotW);

  // 간부회의실 출입문 (북서측 모서리 Z = +2.6, X = +3.85)
  const confDoor = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.15, 1.0), metalMat);
  confDoor.position.set(3.85, 1.075, 2.6);
  modelGroup.add(confDoor);

  // 12인 대형 프리미엄 회의 테이블 (길이 4.2m x 폭 1.3m 모던 월넛)
  const confTableCenterX = 6.35;
  const confTableCenterZ = 5.2;
  const boardTable = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 4.2), woodMat);
  boardTable.position.set(confTableCenterX, 0.74, confTableCenterZ);
  boardTable.castShadow = true;
  modelGroup.add(boardTable);

  // 테이블 중앙 스마트 덕트
  const boardDuct = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.01, 3.2), metalMat);
  boardDuct.position.set(confTableCenterX, 0.785, confTableCenterZ);
  modelGroup.add(boardDuct);

  // 테이블 하부 스틸 다리 3개소
  [-1.4, 0, 1.4].forEach(offZ => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.08), metalMat);
    leg.position.set(confTableCenterX, 0.35, confTableCenterZ + offZ);
    leg.castShadow = true;
    modelGroup.add(leg);
  });

  // ★ 12석 고급 회의용 체어 (서측 5석 + 동측 5석 + 북측 1석 + 남측 1석 = 총 12석) ★
  // 서측 5석 (X = confTableCenterX - 0.82)
  for (let z = confTableCenterZ - 1.6; z <= confTableCenterZ + 1.65; z += 0.8) {
    createOfficeChairMesh(confTableCenterX - 0.82, z, Math.PI / 2, 0x0f172a);
  }
  // 동측 5석 (X = confTableCenterX + 0.82)
  for (let z = confTableCenterZ - 1.6; z <= confTableCenterZ + 1.65; z += 0.8) {
    createOfficeChairMesh(confTableCenterX + 0.82, z, -Math.PI / 2, 0x0f172a);
  }
  // 북측 상석 1석
  createOfficeChairMesh(confTableCenterX, confTableCenterZ - 2.45, Math.PI, 0x0284c7);
  // 남측 1석
  createOfficeChairMesh(confTableCenterX, confTableCenterZ + 2.45, 0, 0x0284c7);

  // 동측 벽면 85인치 스마트 프레젠테이션 디스플레이 & 사운드바
  const boardTv = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.15, 2.0), screenMat);
  boardTv.position.set(8.8, 1.75, confTableCenterZ);
  modelGroup.add(boardTv);

  // ==========================================
  // ★ 7. [F. 북측: 관리사무원실 (4개 팀 오픈 오피스)] ★
  // [사용자 요구 100% 반영]:
  // - "관리원들이 근무하는 곳은 팀장, 관리원 4인이 한 팀으로 4팀이 근무해"
  // - 팀 1, 팀 2, 팀 3, 팀 4 = 총 4개 팀 아일랜드 모듈 구축 (총 20석)
  // - 북측 창가 팀장석(가로 2.0m x 세로 1.0m) + 전면 관리원 4석(2x2 마주보는 대향 구조)
  // ==========================================
  // 관리사무원실 남측 복도 분리벽 (Z = -3.25, X = -8.85 ~ +4.0)
  createWall(12.85, wallHeight, intT, -2.425, wallHeight / 2, -3.25);

  function createAdminTeamIsland(teamCenterX, teamName) {
    const group = new THREE.Group();

    // 1) 팀장 데스크 (북측 창가를 등지고 업무 공간 조망: Z = -10.0)
    const tlDesk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.05, 0.9), lightWoodMat);
    tlDesk.position.set(teamCenterX, 0.74, -10.0);
    tlDesk.castShadow = true;
    group.add(tlDesk);

    const tlChair = createOfficeChairMesh(teamCenterX, -10.55, 0, 0x0f172a);
    group.add(tlChair);

    const tlMon = createDualMonitors();
    tlMon.position.set(teamCenterX, 0.74, -9.85);
    group.add(tlMon);

    // 팀장 전면 가림 파티션
    const tlPart = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.15, 0.04), chairMat);
    tlPart.position.set(teamCenterX, 0.575, -9.5);
    group.add(tlPart);

    // 2) 관리원 4석 (2x2 대향 아일랜드 모듈: Z = -7.8 및 Z = -6.4)
    // 좌측 2석 (X = teamCenterX - 0.75) / 우측 2석 (X = teamCenterX + 0.75)
    [-0.75, 0.75].forEach(offX => {
      // 북향 관리원 (Z = -7.8, 남쪽 응시)
      const desk1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.7), deskTopMat);
      desk1.position.set(teamCenterX + offX, 0.74, -7.8);
      desk1.castShadow = true;
      group.add(desk1);

      const chair1 = createOfficeChairMesh(teamCenterX + offX, -8.3, 0, 0x334155);
      group.add(chair1);

      const mon1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.02), metalMat);
      mon1.position.set(teamCenterX + offX, 0.95, -7.6);
      group.add(mon1);

      // 남향 관리원 (Z = -6.4, 북쪽 응시)
      const desk2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.7), deskTopMat);
      desk2.position.set(teamCenterX + offX, 0.74, -6.4);
      desk2.castShadow = true;
      group.add(desk2);

      const chair2 = createOfficeChairMesh(teamCenterX + offX, -5.9, Math.PI, 0x334155);
      group.add(chair2);

      const mon2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.32, 0.02), metalMat);
      mon2.position.set(teamCenterX + offX, 0.95, -6.6);
      mon2.rotation.y = Math.PI;
      group.add(mon2);
    });

    // 중앙 파티션 (두 열 사이 Z = -7.1)
    const midPart = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.15, 0.04), chairMat);
    midPart.position.set(teamCenterX, 0.575, -7.1);
    group.add(midPart);

    modelGroup.add(group);
  }

  // 총 4개 팀 아일랜드 배치 (가로 방향 4팀 고른 배치)
  const teamPositions = [-6.2, -2.1, 2.1, 6.2];
  teamPositions.forEach((tx, idx) => {
    createAdminTeamIsland(tx, `Team ${idx + 1}`);
  });

  // 북동측 비품/문서 수납 캐비닛 4개소
  for (let cz = -10.2; cz <= -4.8; cz += 1.8) {
    const cab = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.9, 1.2), darkWoodMat);
    cab.position.set(8.55, 0.95, cz);
    cab.castShadow = true;
    modelGroup.add(cab);
  }

  // ==========================================
  // ★ 8. [중앙 승강기홀 & 출입구 2개소] ★
  // 도면 A-057 및 TIP 이미지 마감 스펙:
  // - 승강기홀: 천연 대리석 바닥, 방염 템바보드(Tambour Board) 월, 15인승 승강기 도어 2기
  // - 출입구 1: 동측 메인 복도 주출입구 (폭 2,400mm 대형 유리 자동문)
  // - 출입구 2: 동측 북단 관리사무원 출입문 (폭 1,500mm)
  // ==========================================
  // 승강기홀 서측 분리벽 (X = +0.5, Z = -3.25 ~ +1.9, 길이 5.15m)
  createWall(intT, wallHeight, 5.15, 0.5, wallHeight / 2, -0.675);

  // ★ 다크우드 방염 템바보드(Tambour Board) 포인트월 (승강기 벽면: Z = -3.25 ~ -0.5)
  createWall(intT, wallHeight, 2.75, 4.0, wallHeight / 2, -1.875, tambourWallMat);

  // 15인승 승강기 도어 2개소 (스테인리스 헤어라인)
  const evDoor1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 1.1), metalMat);
  evDoor1.position.set(3.95, 1.1, -2.5);
  modelGroup.add(evDoor1);

  const evDoor2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.2, 1.1), metalMat);
  evDoor2.position.set(3.95, 1.1, -1.2);
  modelGroup.add(evDoor2);

  // 템바보드 상부 3인치 LED 다운라이트 조명
  const spotMat = new THREE.MeshBasicMaterial({ color: 0xfff0d0 });
  for (let sz = -2.7; sz <= -1.0; sz += 0.8) {
    const spot = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), spotMat);
    spot.position.set(4.2, wallHeight - 0.02, sz);
    modelGroup.add(spot);
  }

  // ★ [출입구 1]: 동측 메인 복도 주출입구 (폭 2,400mm 양개 유리 자동문, Z = -0.5 ~ +1.9)
  const mainEntryFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.3, 2.4), metalMat);
  mainEntryFrame.position.set(8.85, 1.15, 0.7);
  modelGroup.add(mainEntryFrame);

  const mainGlassDoor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.2, 2.3), glassMat);
  mainGlassDoor.position.set(8.85, 1.1, 0.7);
  modelGroup.add(mainGlassDoor);

  const entrySign = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.35, 1.8), darkWoodMat);
  entrySign.position.set(8.85, 2.45, 0.7);
  modelGroup.add(entrySign);

  // ★ [출입구 2]: 동측 북단 관리사무원 출입구 (폭 1,500mm, Z = -3.25)
  const adminEntryFrame = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.2, 1.5), metalMat);
  adminEntryFrame.position.set(8.85, 1.1, -3.25);
  modelGroup.add(adminEntryFrame);

  // ==========================================
  // 9. 천장 그리드 & 조명
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

  // LED 조명 기구들
  const lightFixtureMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let lx = -7.0; lx <= 7.0; lx += 2.8) {
    for (let lz = -9.0; lz <= 9.0; lz += 3.2) {
      const troffer = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 1.2), lightFixtureMat);
      troffer.position.set(lx, wallHeight - 0.02, lz);
      ceilingGroup.add(troffer);
    }
  }

  // ==========================================
  // 공통 가구 생성 함수들
  // ==========================================
  function createSofaMesh(x, z, w, d, h, mat, rotY = 0) {
    const group = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(w, 0.22, d), mat);
    seat.position.y = 0.35;
    seat.castShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.35, 0.2), mat);
    back.position.set(0, 0.35 + (h - 0.35) / 2, -d / 2 + 0.1);
    back.castShadow = true;
    group.add(back);

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    modelGroup.add(group);
    return group;
  }

  function createOfficeChairMesh(x, z, rotY = 0, chairColor = 0x1e293b, isHighback = false) {
    const group = new THREE.Group();
    const seatMat = new THREE.MeshStandardMaterial({ color: chairColor, roughness: 0.6 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.07, 0.46), seatMat);
    seat.position.y = 0.45;
    seat.castShadow = true;
    group.add(seat);

    const backH = isHighback ? 0.65 : 0.48;
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.44, backH, 0.05), seatMat);
    back.position.set(0, 0.45 + backH / 2, 0.2);
    back.castShadow = true;
    group.add(back);

    if (isHighback) {
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.05), seatMat);
      head.position.set(0, 0.45 + backH + 0.07, 0.2);
      group.add(head);
    }

    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.38, 8), metalMat);
    col.position.y = 0.22;
    group.add(col);

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.28), metalMat);
      leg.position.set(Math.sin(angle) * 0.14, 0.04, Math.cos(angle) * 0.14);
      leg.rotation.y = angle;
      group.add(leg);
    }

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    modelGroup.add(group);
    return group;
  }

  function createDualMonitors() {
    const group = new THREE.Group();
    const monW = 0.5;
    const monH = 0.32;

    const m1 = new THREE.Mesh(new THREE.BoxGeometry(monW, monH, 0.02), metalMat);
    m1.position.set(-0.27, 0.22, 0);
    m1.rotation.y = 0.12;
    group.add(m1);
    const s1 = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.02, monH - 0.02), screenMat);
    s1.position.set(-0.27, 0.22, 0.015);
    s1.rotation.y = 0.12;
    group.add(s1);

    const m2 = new THREE.Mesh(new THREE.BoxGeometry(monW, monH, 0.02), metalMat);
    m2.position.set(0.27, 0.22, 0);
    m2.rotation.y = -0.12;
    group.add(m2);
    const s2 = new THREE.Mesh(new THREE.PlaneGeometry(monW - 0.02, monH - 0.02), screenMat);
    s2.position.set(0.27, 0.22, 0.015);
    s2.rotation.y = -0.12;
    group.add(s2);

    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 12), metalMat);
    stand.position.set(0, 0.01, 0);
    group.add(stand);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 8), metalMat);
    post.position.set(0, 0.12, -0.05);
    group.add(post);

    return group;
  }

  // Animation Loop
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
    setIsoView: () => setCamera(new THREE.Vector3(20, 22, 22), new THREE.Vector3(0, 1.2, 0)),
    setTopView: () => setCamera(new THREE.Vector3(0, 28, 0.001), new THREE.Vector3(0, 0, 0)),
    // ★ 남서측 원장실: 3.2m 맞춤 TV장, LPL 래핑벽체, 집무 데스크, VIP 소파 완벽 조망
    setPresidentView: () => setCamera(new THREE.Vector3(-4.4, 4.8, 11.5), new THREE.Vector3(-4.4, 1.2, 7.0)),
    // ★ 부원장실(4.0m) & 경영관리실장실(2.95m) 크기 비교 뷰
    setExecSuitesView: () => setCamera(new THREE.Vector3(-1.0, 7.5, 0.5), new THREE.Vector3(-5.85, 1.2, 0.5)),
    // ★ 승강기홀: 다크우드 템바보드 포인트월, 대리석 바닥, 주출입구(2.4m) 조망
    setTambourLobbyView: () => setCamera(new THREE.Vector3(4.0, 4.0, -4.5), new THREE.Vector3(4.5, 1.2, -0.6)),
    // ★ 간부회의실: T:12mm 에칭유리 파티션 및 12인 대형 회의 테이블 조망
    setBoardroomView: () => setCamera(new THREE.Vector3(3.5, 5.2, 1.5), new THREE.Vector3(6.35, 1.1, 5.2)),
    // ★ 관리사무원실: 4개 팀(팀장1+관리원4) 총 20석 아일랜드 조망
    setAdminView: () => setCamera(new THREE.Vector3(0, 7.5, -2.5), new THREE.Vector3(0, 1.0, -7.5)),
    toggleCeiling: (show) => { ceilingGroup.visible = show; },
    toggleWalls: (transparent) => {
      wallMat.opacity = transparent ? 0.35 : 1.0;
      wrappingWallMat.opacity = transparent ? 0.35 : 1.0;
      tambourWallMat.opacity = transparent ? 0.45 : 1.0;
    },
    toggleAutoRotate: () => { isRotating = !isRotating; return isRotating; },
    toggleNightMode: (isNight) => {
      scene.background.set(isNight ? 0x0a0f1d : 0xf1f5f9);
      sunLight.intensity = isNight ? 0.05 : 0.88;
      ambientLight.intensity = isNight ? 0.35 : 0.72;
    }
  };
}
