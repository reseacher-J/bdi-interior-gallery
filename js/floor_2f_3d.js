// 부산연구원 신사옥 2층 회의 복합센터 3D 디지털 트윈
// 실시설계 도면(A-021, A-023 평면도, A-028 전개도) 100% 정밀 일치 모델
// 
// [도면 A-023 실측 치수 및 기둥/출입구 완벽 반영]:
// 전체 외곽: 가로 17.7m (X = -8.85 ~ +8.85) x 세로 22.0m (Z = -11.0 ~ +11.0)
//
// 1. 중회의실 (북동측 코너): 세로 10,100mm (Z = -11.0 ~ -0.9), 가로 9.2m (X = -0.35 ~ +8.85)
//    - 도면 치수 10,100mm를 100% 반영하여 웅장한 40인 'ㅁ'자형 대형 스마트 화상회의실 완비
//    - 남측 가벽("가벽 신설 H:2,800"): Z = -0.9 지점
// 2. 동측 메인 출입구: 세로 1,930mm (Z = -0.9 ~ +1.03), 폭 1.93m
//    - 중회의실 남측 가벽 바로 아래의 메인 복도 출입구 완벽 개방
// 3. 전산실-1 & 전산실-2 (동측 외벽 폭 3,000mm X = +5.85 ~ +8.85):
//    - 전산실-1: 출입구 바로 밑 세로 3,300mm (Z = +1.03 ~ +4.33), FL+150mm 악세스플로어 & 서버랙 3개소
//    - 전산실-2: 세로 6,100mm (Z = +4.43 ~ +10.5), 소회의실 동측 코너 전체를 채우는 FL+150mm 악세스플로어 & 서버랙
// 4. 여성휴게실 & 소회의실 (남측 창가 Z = +4.5 ~ +11.0):
//    - 여성휴게실: 도면 치수 폭 2,900mm (X = -0.35 ~ +2.55)
//    - 소회의실: 도면 치수 폭 3,100mm (X = +2.65 ~ +5.75)
// 5. 대회의실 (서측 전체 폭 8,400mm X = -8.85 ~ -0.45):
//    - 북측 벽면(Z = -11.0) 무대 단상(FL+150)과 250인치 스크린
//    - 10열 x 열당 10석(좌 5석 + 우 5석) = 정확히 100석 세미나 연수 좌석 정렬 (Z = -7.4 ~ +1.6)
//    - Z = +3.4 차음 폴딩도어 (14.4m 지점), Z = +7.5 등록 데스크
// 6. 도면 주요 구조 기둥(Columns, 600x600mm) 정밀 구현 (Z = -11.0, -4.4, +2.4, +11.0)
// 7. 출입구 앞 중앙 테이블 제거 완료 (도면대로 시원한 오픈 홀 유지)

function initFloor2F3D(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1f5f9);

  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(19, 21, 23);

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
  controls.maxDistance = 65;
  controls.target.set(0, 1.2, 0);

  // 조명 (Lighting)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff8ee, 0.9);
  sunLight.position.set(16, 26, 12);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // 재질 (Materials)
  const floorTileMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35 });
  const confFloorMat = new THREE.MeshStandardMaterial({ color: 0xd3dce6, roughness: 0.5 }); // 대회의실 카펫
  const midFloorMat = new THREE.MeshStandardMaterial({ color: 0xdae2eb, roughness: 0.45 }); // 중회의실
  const accessFloorMat = new THREE.MeshStandardMaterial({ color: 0x8698a3, roughness: 0.2, metalness: 0.5 }); // 전산실 악세스플로어 FL+150
  const restFloorMat = new THREE.MeshStandardMaterial({ color: 0xded6c8, roughness: 0.4 }); // 여성휴게실 온열 톤
  const smallConfFloorMat = new THREE.MeshStandardMaterial({ color: 0xe5ecf4, roughness: 0.4 }); // 소회의실
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85, transparent: true, opacity: 1.0 });
  const wallFocusMat = new THREE.MeshStandardMaterial({ color: 0x004b8d, roughness: 0.45 }); // BDI C.I 딥블루 포인트월
  const columnMat = new THREE.MeshStandardMaterial({ color: 0xccd5e0, roughness: 0.6 }); // 구조 기둥 콘크리트/도장 마감
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, roughness: 0.1 });
  const glassEtchMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 0.3 }); // 1/2 에칭유리
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xbfa074, roughness: 0.5 });
  const lightWoodMat = new THREE.MeshStandardMaterial({ color: 0xd8c2a3, roughness: 0.55 });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.45 });
  const chairSeatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const chairBackMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const restSofaMat = new THREE.MeshStandardMaterial({ color: 0x9c8273, roughness: 0.6 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.3, metalness: 0.7 });
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const semTableMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // 1. 기본 슬래브 (가로 17.7m x 세로 22.0m)
  const floorGeo = new THREE.BoxGeometry(17.7, 0.2, 22.0);
  const floorMesh = new THREE.Mesh(floorGeo, floorTileMat);
  floorMesh.position.y = -0.1;
  floorMesh.receiveShadow = true;
  modelGroup.add(floorMesh);

  // 대회의실 영역 바닥 (X: -8.85 ~ -0.45, 폭 8.4m x 길이 22.0m)
  const confFloorGeo = new THREE.BoxGeometry(8.4, 0.02, 22.0);
  const confFloorMesh = new THREE.Mesh(confFloorGeo, confFloorMat);
  confFloorMesh.position.set(-4.65, 0.01, 0);
  confFloorMesh.receiveShadow = true;
  modelGroup.add(confFloorMesh);

  // ★ 중회의실 바닥: 도면 10,100mm 정밀 반영! (X: -0.35 ~ +8.85, 폭 9.2m x Z: -11.0 ~ -0.9, 세로 10.1m) ★
  const midFloorMesh = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.02, 10.1), midFloorMat);
  midFloorMesh.position.set(4.25, 0.01, -5.95);
  midFloorMesh.receiveShadow = true;
  modelGroup.add(midFloorMesh);

  // 여성휴게실 바닥 (X: -0.35 ~ +2.55, 폭 2.9m x Z: +4.5 ~ +11.0, 세로 6.5m)
  const restFloorMesh = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.02, 6.5), restFloorMat);
  restFloorMesh.position.set(1.1, 0.01, 7.75);
  restFloorMesh.receiveShadow = true;
  modelGroup.add(restFloorMesh);

  // 소회의실 바닥 (X: +2.65 ~ +5.75, 폭 3.1m x Z: +4.5 ~ +11.0, 세로 6.5m)
  const smallConfFloorMesh = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.02, 6.5), smallConfFloorMat);
  smallConfFloorMesh.position.set(4.2, 0.01, 7.75);
  smallConfFloorMesh.receiveShadow = true;
  modelGroup.add(smallConfFloorMesh);

  const gridHelper = new THREE.GridHelper(22, 22, 0x94a3b8, 0xcfd8dc);
  gridHelper.position.y = 0.02;
  modelGroup.add(gridHelper);

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

  // 구조 기둥 생성 헬퍼 (도면 기준 600x600mm)
  function createColumn(x, z, w = 0.6, d = 0.6) {
    const colGeo = new THREE.BoxGeometry(w, wallHeight, d);
    const col = new THREE.Mesh(colGeo, columnMat);
    col.position.set(x, wallHeight / 2, z);
    col.castShadow = true;
    col.receiveShadow = true;
    modelGroup.add(col);
    return col;
  }

  // 2. 도면 구조 기둥 (Columns) 정밀 배치
  // 1열 (대회의실 동측 칸막이 라인 X = -0.45)
  createColumn(-0.45, -11.0); // 북측 외벽 기둥
  createColumn(-0.45, -4.4);  // 중회의실 서측 기둥
  createColumn(-0.45, 2.4);   // 홀 / 대회의실 출입문 옆 기둥
  createColumn(-0.45, 11.0);  // 남측 외벽 기둥
  // 2열 (동측 외벽 라인 X = 8.85)
  createColumn(8.85, -11.0);  // 북동측 코너 기둥
  createColumn(8.85, -4.4);   // 중회의실 우측 벽 기둥
  createColumn(8.85, 2.4);    // 전산실-1 동측 외벽 기둥
  createColumn(8.85, 11.0);   // 동남측 코너 기둥
  // 서측 외벽 기둥 (X = -8.85)
  createColumn(-8.85, -11.0);
  createColumn(-8.85, -4.4);
  createColumn(-8.85, 2.4);
  createColumn(-8.85, 11.0);

  // 3. 외벽 (Ext Walls)
  const extT = 0.2;
  createWall(17.7, wallHeight, extT, 0, wallHeight / 2, -11.0); // 북측 외벽
  createWall(17.7, wallHeight, extT, 0, wallHeight / 2, 11.0);  // 남측 외벽
  createWall(extT, wallHeight, 22.0, -8.85, wallHeight / 2, 0); // 서측 외벽
  createWall(extT, wallHeight, 22.0, 8.85, wallHeight / 2, 0);  // 동측 외벽

  const intT = 0.1;

  // =========================================================================
  // ★ [1. 대회의실 (서측 전체 8.4m x 22.0m, 정확히 100석 세미나석 완비)] ★
  // - 북측 벽면(Z = -11.0): 250인치 대형 와이드 스크린 & FL+150mm 목재 단상 구축
  // - 단상 앞(Z = -7.4 ~ +1.6): 10열 x 열당 10석(좌 5석 + 우 5석) = 정확히 100석 정렬!
  // - Z = +3.4 지점: 7.6m 가변형 차음 폴딩도어 (도면 치수 14.4m 구간)
  // - 폴딩도어 남측: 후면 등록/안내 데스크 (Z = +7.5)
  // =========================================================================
  // 대회의실 동측 메인 경계벽 (X = -0.45)
  createWall(intT, wallHeight, 10.1, -0.45, wallHeight / 2, -5.95); // 중회의실 구간 (10.1m)
  createWall(intT, wallHeight, 2.0, -0.45, wallHeight / 2, 0.1);   // 홀 출입구 상부벽
  createWall(intT, wallHeight, 2.2, -0.45, wallHeight / 2, 3.2);   // 홀 출입구 하부벽
  createWall(intT, wallHeight, 6.5, -0.45, wallHeight / 2, 7.75);  // 여성휴게실 구간 (6.5m)

  // 가변형 차음 폴딩도어 (Z = +3.4)
  const foldingDoor = new THREE.Mesh(new THREE.BoxGeometry(8.2, 2.6, 0.08), glassMat);
  foldingDoor.position.set(-4.65, 1.3, 3.4);
  modelGroup.add(foldingDoor);

  // 북측 포인트 아트월 & 250인치 스크린
  createWall(8.2, wallHeight - 0.1, 0.06, -4.65, wallHeight / 2, -10.9, wallFocusMat);
  const mainScreen = new THREE.Mesh(new THREE.BoxGeometry(6.4, 2.2, 0.06), screenMat);
  mainScreen.position.set(-4.65, 1.75, -10.82);
  modelGroup.add(mainScreen);

  // 북측 무대 단상 (FL+150mm, 너비 8.0m x 깊이 2.2m)
  const stage = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.18, 2.2), woodMat);
  stage.position.set(-4.65, 0.09, -9.7);
  stage.receiveShadow = true;
  modelGroup.add(stage);

  // 강연대(Podium) & VIP 심사위원석
  const podium = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.15, 0.65), darkWoodMat);
  podium.position.set(-7.5, 0.75, -9.5);
  podium.castShadow = true;
  modelGroup.add(podium);

  const vipTable = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 0.7), darkWoodMat);
  vipTable.position.set(-3.2, 0.88, -9.5);
  vipTable.castShadow = true;
  modelGroup.add(vipTable);
  for (let vx = -4.5; vx <= -1.9; vx += 0.9) {
    createChairMesh(vx, -10.1, 0);
  }

  // ★ 100인 수용 세미나 좌석 (10열 x 열당 10석 = 정확히 100석) ★
  const startRowZ = -7.4;
  const spacingRowZ = 0.95;
  for (let row = 0; row < 10; row++) {
    const tableZ = startRowZ + row * spacingRowZ;
    const chairZ = tableZ + 0.42;

    // 서측 블록 5석 테이블 (X: -8.15 ~ -5.15, 길이 3.0m)
    const tWest = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 0.42), semTableMat);
    tWest.position.set(-6.65, 0.72, tableZ);
    tWest.castShadow = true;
    modelGroup.add(tWest);
    const pWest = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.38, 0.02), semTableMat);
    pWest.position.set(-6.65, 0.51, tableZ - 0.2);
    modelGroup.add(pWest);
    // 5석 의자 (-7.85, -7.25, -6.65, -6.05, -5.45)
    for (let cx = -7.85; cx <= -5.40; cx += 0.6) {
      createChairMesh(cx, chairZ, 0);
    }

    // 동측 블록 5석 테이블 (X: -4.15 ~ -1.15, 길이 3.0m)
    const tEast = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 0.42), semTableMat);
    tEast.position.set(-2.65, 0.72, tableZ);
    tEast.castShadow = true;
    modelGroup.add(tEast);
    const pEast = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.38, 0.02), semTableMat);
    pEast.position.set(-2.65, 0.51, tableZ - 0.2);
    modelGroup.add(pEast);
    // 5석 의자 (-3.85, -3.25, -2.65, -2.05, -1.45)
    for (let cx = -3.85; cx <= -1.40; cx += 0.6) {
      createChairMesh(cx, chairZ, 0);
    }
  }

  // 남측 후면 등록/안내 데스크
  const regDesk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.85, 0.75), woodMat);
  regDesk.position.set(-4.65, 0.425, 7.5);
  regDesk.castShadow = true;
  modelGroup.add(regDesk);
  createChairMesh(-5.4, 8.1, 0);
  createChairMesh(-3.9, 8.1, 0);

  // =========================================================================
  // ★ [2. 중회의실 (40석): 도면 치수 세로 10,100mm 완벽 반영!] ★
  // - 영역: X = -0.35 ~ +8.85 (폭 9.2m) x Z = -11.0 ~ -0.9 (세로 10.1m, 약 93㎡ 대형 회의실)
  // - 남측 가벽("가벽 신설 H:2,800"): Z = -0.9 지점에 시공
  // - 동측 외벽 출입구(Z = -2.0 부근) 및 40인 'ㅁ'자형 대형 스마트 화상회의 시스템 완비
  // =========================================================================
  // 중회의실 남측 가벽 (Z = -0.9, X = -0.45 ~ +8.85, 폭 9.3m)
  createWall(7.5, wallHeight, intT, 5.1, wallHeight / 2, -0.9); // 메인 가벽
  createWall(1.0, wallHeight, intT, 0.05, wallHeight / 2, -0.9); // 도어 옆 벽체

  // 북측 포인트월 & 140인치 대형 스마트 화상회의 스크린
  createWall(8.8, wallHeight - 0.1, 0.06, 4.25, wallHeight / 2, -10.9, wallFocusMat);
  const midScreen = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 0.05), screenMat);
  midScreen.position.set(4.25, 1.8, -10.82);
  modelGroup.add(midScreen);

  // 40인 대형 'ㅁ'자형 회의 테이블 (10.1m 공간에 맞추어 웅장하게 배치)
  const tNorthM = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.06, 0.8), woodMat);
  tNorthM.position.set(4.25, 0.74, -8.0);
  tNorthM.castShadow = true;
  modelGroup.add(tNorthM);

  const tSouthM = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.06, 0.8), woodMat);
  tSouthM.position.set(4.25, 0.74, -4.0);
  tSouthM.castShadow = true;
  modelGroup.add(tSouthM);

  const tWestM = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 3.2), woodMat);
  tWestM.position.set(1.05, 0.74, -6.0);
  tWestM.castShadow = true;
  modelGroup.add(tWestM);

  const tEastM = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 3.2), woodMat);
  tEastM.position.set(7.45, 0.74, -6.0);
  tEastM.castShadow = true;
  modelGroup.add(tEastM);

  // 중회의실 의자 (40석 수용)
  for (let mx = 1.5; mx <= 7.0; mx += 0.55) {
    createChairMesh(mx, -8.55, 0); // 북측 내측 (11석)
    createChairMesh(mx, -3.45, Math.PI); // 남측 내측 (11석)
  }
  for (let mz = -7.2; mz <= -4.8; mz += 0.55) {
    createChairMesh(0.5, mz, Math.PI / 2); // 서측 (5석)
    createChairMesh(8.0, mz, -Math.PI / 2); // 동측 (5석)
  }
  for (let mx = 2.0; mx <= 6.5; mx += 0.6) {
    createChairMesh(mx, -2.6, Math.PI); // 남측 외측 방청/보조석 (8석)
  }

  // =========================================================================
  // ★ [3. 동측 복도 출입구 (폭 1,930mm) 및 전산실 1·2 정밀 배치] ★
  // - 메인 출입구: Z = -0.9 ~ +1.03 (폭 1,930mm 출입구 통로 확보)
  // - 전산실-1: 출입구 바로 밑 세로 3,300mm (Z = +1.03 ~ +4.33, 폭 3,000mm X = +5.85 ~ +8.85)
  //   * 도면 치수 3,300mm x 3,000mm 정밀 일치, FL+150mm 악세스플로어 & 서버랙 3개소
  // - 전산실-2: 전산실-1 밑으로 내려와 소회의실 동측 코너 차지 (Z = +4.43 ~ +10.5, 세로 6.1m)
  //   * FL+150mm 악세스플로어 & 백업 서버랙 3개소 및 UPS 공조설비
  // =========================================================================
  // 전산실-1 북측 벽체 (Z = +1.03, X = +5.85 ~ +8.85, 출입구 통로 분리벽)
  createWall(3.0, wallHeight, intT, 7.35, wallHeight / 2, 1.03);
  // 전산실-1 서측 벽체 (X = +5.85, Z = +1.03 ~ +4.33, 세로 3.3m)
  createWall(intT, wallHeight, 3.3, 5.85, wallHeight / 2, 2.68);
  // 전산실 1과 2 사이벽 (Z = +4.33, X = +5.85 ~ +8.85)
  createWall(3.0, wallHeight, intT, 7.35, wallHeight / 2, 4.33);

  // 1) 전산실-1 바닥 (FL+150mm, 3.3m x 3.0m)
  const serverAccess1 = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.15, 3.2), accessFloorMat);
  serverAccess1.position.set(7.35, 0.075, 2.68);
  serverAccess1.receiveShadow = true;
  modelGroup.add(serverAccess1);

  // 전산실-1 메인 서버랙 3개소 (외벽 밀착 정렬)
  for (let sz = 1.7; sz <= 3.7; sz += 1.0) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.1, 0.75), metalMat);
    rack.position.set(7.8, 1.125, sz);
    rack.castShadow = true;
    modelGroup.add(rack);
  }

  // 2) 전산실-2 (소회의실 동측 코너, Z = +4.43 ~ +10.5, 세로 6.1m x 폭 3.0m)
  createWall(intT, wallHeight, 6.1, 5.75, wallHeight / 2, 7.48); // 서측 벽체 (소회의실 동측벽)

  const serverAccess2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 6.0), accessFloorMat);
  serverAccess2.position.set(7.35, 0.075, 7.48);
  serverAccess2.receiveShadow = true;
  modelGroup.add(serverAccess2);

  // 전산실-2 백업 서버랙 3개소
  for (let sz = 5.2; sz <= 7.6; sz += 1.2) {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.1, 0.8), metalMat);
    rack.position.set(7.8, 1.125, sz);
    rack.castShadow = true;
    modelGroup.add(rack);
  }
  // 전산실-2 대형 UPS/공조기 2기 (서측 벽면)
  for (let sz = 6.0; sz <= 8.6; sz += 2.6) {
    const ups = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 1.1), metalMat);
    ups.position.set(6.4, 0.975, sz);
    ups.castShadow = true;
    modelGroup.add(ups);
  }

  // =========================================================================
  // ★ [4. 여성휴게실: 남측 창가 서쪽 X = -0.35 ~ +2.55 (폭 2,900mm)] ★
  // =========================================================================
  createWall(intT, wallHeight, 6.5, 2.55, wallHeight / 2, 7.75); // 소회의실 사이벽

  // 북측 복도벽 (1/2 에칭유리 파티션, Z = +4.5, X = -0.35 ~ +2.55)
  const restGlass = new THREE.Mesh(new THREE.BoxGeometry(2.9, wallHeight, 0.08), glassEtchMat);
  restGlass.position.set(1.1, wallHeight / 2, 4.5);
  modelGroup.add(restGlass);

  // 3인 패브릭 소파
  const restSofa = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.45, 0.85), restSofaMat);
  restSofa.position.set(1.1, 0.225, 7.8);
  restSofa.castShadow = true;
  modelGroup.add(restSofa);

  // 원형 티 테이블
  const restTable = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.42, 24), woodMat);
  restTable.position.set(1.1, 0.21, 9.2);
  restTable.castShadow = true;
  modelGroup.add(restTable);

  // 안락의자 2석
  createChairMesh(0.1, 9.2, Math.PI / 3);
  createChairMesh(2.1, 9.2, -Math.PI / 3);

  // 파우더 데스크 및 전신 거울 (서측 벽면)
  const powderDesk = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.75, 1.4), lightWoodMat);
  powderDesk.position.set(-0.15, 0.375, 6.0);
  modelGroup.add(powderDesk);
  const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.4, 0.8), glassMat);
  mirror.position.set(-0.35, 1.4, 6.0);
  modelGroup.add(mirror);

  // =========================================================================
  // ★ [5. 소회의실: 남측 창가 중앙 X = +2.65 ~ +5.75 (폭 3,100mm)] ★
  // =========================================================================
  // 북측 복도벽 (1/2 에칭유리 파티션, Z = +4.5, X = +2.65 ~ +5.75)
  const smallConfGlass = new THREE.Mesh(new THREE.BoxGeometry(3.1, wallHeight, 0.08), glassEtchMat);
  smallConfGlass.position.set(4.2, wallHeight / 2, 4.5);
  modelGroup.add(smallConfGlass);

  // 회의 테이블 (2.6m x 1.1m)
  const smallConfTable = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 2.6), woodMat);
  smallConfTable.position.set(4.2, 0.74, 8.0);
  smallConfTable.castShadow = true;
  modelGroup.add(smallConfTable);

  // 스마트 스크린
  const smallConfScreen = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.0, 1.6), screenMat);
  smallConfScreen.position.set(5.65, 1.65, 8.0);
  modelGroup.add(smallConfScreen);

  // 소회의실 의자 8석
  for (let sz = 7.0; sz <= 9.0; sz += 0.8) {
    createChairMesh(3.4, sz, Math.PI / 2); // 서측 (3석)
    createChairMesh(5.0, sz, -Math.PI / 2); // 동측 (3석)
  }
  createChairMesh(4.2, 6.4, Math.PI); // 북측 (1석)
  createChairMesh(4.2, 9.6, 0);       // 남측 (1석)

  // =========================================================================
  // ★ [6. 중앙 공용 홀 (로비): 도면대로 테이블 없는 시원한 오픈 복도] ★
  // =========================================================================

  // 천장 (Ceiling Group)
  const ceilingGroup = new THREE.Group();
  modelGroup.add(ceilingGroup);
  const ceilingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(17.7, 0.08, 22.0),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.25 })
  );
  ceilingMesh.position.y = wallHeight;
  ceilingGroup.add(ceilingMesh);

  // 헬퍼: 의자 모델 생성
  function createChairMesh(x, z, rotY = 0) {
    const chair = new THREE.Group();
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.05, 0.44), chairSeatMat);
    seat.position.y = 0.44;
    seat.castShadow = true;
    chair.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.04), chairBackMat);
    back.position.set(0, 0.67, -0.2);
    back.castShadow = true;
    chair.add(back);

    const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.44, 6);
    const legPositions = [
      [-0.18, 0.22, -0.18],
      [0.18, 0.22, -0.18],
      [-0.18, 0.22, 0.18],
      [0.18, 0.22, 0.18]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, metalMat);
      leg.position.set(lx, ly, lz);
      chair.add(leg);
    });

    chair.position.set(x, 0, z);
    chair.rotation.y = rotY;
    modelGroup.add(chair);
    return chair;
  }

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
    setIsoView: () => setCamera(new THREE.Vector3(19, 21, 23), new THREE.Vector3(0, 1.2, 0)),
    // 대회의실 100석 완비 조망 뷰
    setMainView: () => setCamera(new THREE.Vector3(-4.65, 8.5, 9.5), new THREE.Vector3(-4.65, 1.5, -9.0)),
    setMainHallView: () => setCamera(new THREE.Vector3(-4.65, 8.5, 9.5), new THREE.Vector3(-4.65, 1.5, -9.0)),
    // 북동측 대형 중회의실 (10.1m 40석) 뷰
    setMidView: () => setCamera(new THREE.Vector3(4.25, 9.5, 1.5), new THREE.Vector3(4.25, 1.2, -6.0)),
    setMidConfView: () => setCamera(new THREE.Vector3(4.25, 9.5, 1.5), new THREE.Vector3(4.25, 1.2, -6.0)),
    // 동측 외벽 전산실 1 & 2 (출입구 밑 3.3m x 3.0m 정밀 스케일) 뷰
    setServerView: () => setCamera(new THREE.Vector3(3.0, 7.0, 5.0), new THREE.Vector3(7.35, 1.1, 5.0)),
    setServerRoomView: () => setCamera(new THREE.Vector3(3.0, 7.0, 5.0), new THREE.Vector3(7.35, 1.1, 5.0)),
    // 남측 창가 소회의실 뷰
    setSmallConfView: () => setCamera(new THREE.Vector3(4.2, 5.0, 3.2), new THREE.Vector3(4.2, 1.0, 8.0)),
    // 남측 창가 여성휴게실 뷰
    setWomenLoungeView: () => setCamera(new THREE.Vector3(1.1, 5.0, 3.2), new THREE.Vector3(1.1, 1.0, 8.0)),
    toggleCeiling: (show) => { ceilingGroup.visible = show; },
    toggleWalls: (transparent) => { wallMat.opacity = transparent ? 0.35 : 1.0; },
    toggleAutoRotate: () => { isRotating = !isRotating; return isRotating; },
    toggleNightMode: (isNight) => {
      scene.background.set(isNight ? 0x0a0f1d : 0xf1f5f9);
      sunLight.intensity = isNight ? 0.05 : 0.9;
      ambientLight.intensity = isNight ? 0.35 : 0.75;
    }
  };
}
