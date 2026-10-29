import * as T from "three";
import {
  carX,
  traffic,
  isRoad,
  visibleRows,
  newGame,
  tick,
  move,
  type Game,
} from "./game";
export function createScene(
  host: HTMLElement,
  onState: (g: Game) => void,
  onError: () => void,
) {
  let dirty = true;
  let facing = 0;
  const scene = new T.Scene();
  scene.background = new T.Color("#dce6c9");
  scene.fog = new T.Fog("#dce6c9", 28, 65);
  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  const camera = new T.OrthographicCamera(-10, 10, 10, -10, 0.1, 100);
  const light = new T.DirectionalLight("#fff4da", 3);
  light.position.set(-6, 16, 8);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -14;
  light.shadow.camera.right = 14;
  light.shadow.camera.top = 14;
  light.shadow.camera.bottom = -14;
  const ambient = new T.HemisphereLight("#fffce7", "#637355", 2.5);
  scene.add(light, ambient);
  scene.add(light.target);
  const geo = new T.BoxGeometry(1, 1, 1);
  const mats = new Map<string, T.MeshStandardMaterial>();
  function box(
    parent: T.Object3D,
    color: string,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
  ) {
    let mat = mats.get(color);
    if (!mat) {
      mat = new T.MeshStandardMaterial({ color, roughness: 1 });
      mats.set(color, mat);
    }
    const m = new T.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.scale.set(w, h, d);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  let cars: { mesh: T.Group; row: number; index: number }[] = [];
  const lanes = new Map<number, T.Group>();
  function makeLane(r: number) {
    const lane = new T.Group();
    lane.position.z = -r;
    scene.add(lane);
    lanes.set(r, lane);
    const road = isRoad(r);
    box(
      lane,
      road ? "#66766a" : r % 2 ? "#9fb87e" : "#a9c288",
      0,
      -0.35,
      0,
      12,
      0.6,
      1,
    );
    box(lane, "#7d9163", -6.15, -0.55, 0, 0.3, 0.9, 1);
    box(lane, "#7d9163", 6.15, -0.55, 0, 0.3, 0.9, 1);
    if (road) {
      for (let x = -5; x <= 5; x += 2)
        box(lane, "#c8cdb0", x, -0.035, 0, 0.55, 0.015, 0.06);
      for (let i = 0; i < 3; i++) {
        const c = new T.Group();
        box(
          c,
          ["#d68554", "#e5c76f", "#7399a0"][r % 3],
          0,
          0.26,
          0,
          1.35,
          0.45,
          0.7,
        );
        box(c, "#e8e7cf", 0, 0.6, 0, 0.65, 0.32, 0.62);
        for (const x of [-0.43, 0.43])
          for (const z of [-0.37, 0.37])
            box(c, "#32443a", x, 0.14, z, 0.25, 0.27, 0.12);
        lane.add(c);
        for (const z of [-0.22, 0.22])
          box(c, "#fff1ad", (r % 2 ? 1 : -1) * 0.69, 0.3, z, 0.04, 0.13, 0.16);
        cars.push({ mesh: c, row: r, index: i });
      }
    } else {
      for (const side of [-1, 1]) {
        const x = side * (3.6 + ((r * r) % 13) / 8);
        box(lane, "#7b6950", x, 0.5, 0, 0.22, 1, 0.22);
        box(lane, r % 2 ? "#54734a" : "#66894e", x, 1.2, 0, 1.05, 1.2, 1);
        box(lane, "#7e9e5b", x, 1.9, 0, 0.65, 0.6, 0.65);
        if (r % 3 === 0)
          box(lane, "#e4c579", side * 2.7, 0.1, 0, 0.22, 0.25, 0.22);
      }
    }
  }
  function ensureTerrain(row: number) {
    const { first, last } = visibleRows(row);
    for (const [r, lane] of lanes)
      if (r < first || r > last) {
        scene.remove(lane);
        lanes.delete(r);
      }
    cars = cars.filter((c) => lanes.has(c.row));
    for (let r = first; r <= last; r++) if (!lanes.has(r)) makeLane(r);
  }
  ensureTerrain(0);
  const frog = new T.Group();
  box(frog, "#709d42", 0, 0.28, 0, 0.67, 0.4, 0.65);
  box(frog, "#b2ce68", 0, 0.43, -0.17, 0.67, 0.3, 0.42);
  for (const x of [-0.25, 0.25]) {
    box(frog, "#85ad4d", x, 0.66, -0.22, 0.26, 0.26, 0.25);
    box(frog, "#faf6da", x, 0.68, -0.36, 0.17, 0.16, 0.025);
    box(frog, "#263f2c", x, 0.68, -0.38, 0.08, 0.11, 0.025);
    box(frog, "#547b36", x, 0.08, 0.18, 0.31, 0.16, 0.42);
  }
  scene.add(frog);
  const markers: T.Sprite[] = [];
  const signs = new T.Group();
  scene.add(signs);
  const signGroups: T.Group[] = [];
  for (const [r, label] of [
    [0, "HELLO"],
    [8, "ABOUT"],
    [16, "SKILLS"],
    [24, "PROJECTS"],
    [30, "CREATIVE"],
    [36, "SAY HELLO"],
  ] as const) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f6f0dc";
    ctx.fillRect(0, 0, 256, 80);
    ctx.fillStyle = "#294636";
    ctx.font = "bold 25px monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, 128, 49);
    const texture = new T.CanvasTexture(canvas);
    const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture }));
    const sign = new T.Group();
    sign.position.z = -r;
    signs.add(sign);
    signGroups.push(sign);
    sprite.position.set(-2, 1.4, 0);
    sprite.scale.set(2.2, 0.69, 1);
    sign.add(sprite);
    markers.push(sprite);
    box(sign, "#75654c", -2, 0.5, 0, 0.09, 1, 0.09);
  }
  const starGeometry = new T.BufferGeometry();
  const positions = new Float32Array(180 * 3);
  for (let i = 0; i < 180; i++) {
    positions[i * 3] = Math.sin(i * 127.1) * 24;
    positions[i * 3 + 1] = 7 + (Math.sin(i * 311.7) + 1) * 8;
    positions[i * 3 + 2] = Math.cos(i * 74.7) * 28;
  }
  starGeometry.setAttribute("position", new T.BufferAttribute(positions, 3));
  const starMaterial = new T.PointsMaterial({
    color: "#dce8ff",
    size: 0.055,
    transparent: true,
    opacity: 0.85,
  });
  const stars = new T.Points(starGeometry, starMaterial);
  scene.add(stars);
  function theme() {
    const night = document.documentElement.dataset.theme === "dark";
    const background = night ? "#101d25" : "#f6f4eb";
    (scene.background as T.Color).set(background);
    (scene.fog as T.Fog).color.set(background);
    light.color.set(night ? "#a5beff" : "#fff4da");
    light.intensity = night ? 1.4 : 3;
    ambient.color.set(night ? "#8098bc" : "#fffce7");
    ambient.groundColor.set(night ? "#182c34" : "#637355");
    ambient.intensity = night ? 0.8 : 2.5;
    for (const [color, mat] of mats) {
      mat.emissive.set(color === "#fff1ad" && night ? "#ffce69" : "#000000");
      mat.emissiveIntensity = night ? 1.5 : 0;
    }
    stars.visible = night;
    dirty = true;
    host.dataset.theme = night ? "dark" : "light";
  }
  window.addEventListener("portfolio-theme", theme);
  theme();
  const hopFrom = new T.Vector3(),
    hopTo = new T.Vector3();
  let hopElapsed = 1,
    hopDuration = 0.25;
  let requestedRow = NaN,
    requestedX = NaN;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let g = newGame(),
    playing = false,
    target = 0,
    raf = 0,
    last = 0,
    previous = "",
    disposed = false;
  function resize() {
    dirty = true;
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h);
    const view = w < 500 ? 7 : 8;
    camera.left = (-view * w) / h;
    camera.right = (view * w) / h;
    camera.top = view;
    camera.bottom = -view;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function frame(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (playing) tick(g, dt);
    const row = playing ? g.row : target,
      x = playing ? g.x : 0;
    if (row !== requestedRow || x !== requestedX) {
      if (playing) frog.rotation.y = facing;
      else if (Number.isFinite(requestedRow)) {
        const dx = x - requestedX,
          dr = row - requestedRow;
        if (dx || dr) frog.rotation.y = Math.atan2(-dx, dr);
      } else frog.rotation.y = 0;
      hopFrom.copy(frog.position);
      hopTo.set(x, 0, -row);
      hopDuration = Math.min(
        0.65,
        0.2 + Math.abs(row + frog.position.z) * 0.018,
      );
      hopElapsed = 0;
      requestedRow = row;
      requestedX = x;
      dirty = true;
    }
    const wasHopping = hopElapsed < hopDuration;
    if (!playing || g.status === "playing")
      hopElapsed = Math.min(hopDuration, hopElapsed + dt);
    const progress = Math.min(1, hopElapsed / hopDuration);
    const eased = progress * progress * (3 - 2 * progress);
    frog.position.lerpVectors(hopFrom, hopTo, eased);
    if (!reducedMotion.matches)
      frog.position.y +=
        Math.sin(progress * Math.PI) *
        Math.min(1.5, 0.5 + hopFrom.distanceTo(hopTo) * 0.035);
    const distance = wasHopping ? 1 : 0;

    ensureTerrain(-frog.position.z);
    host.dataset.row = String(row);
    host.dataset.facing = String(frog.rotation.y);
    host.dataset.lanes = String(lanes.size);
    host.dataset.signs = playing ? "hidden" : "visible";
    const z = frog.position.z;
    camera.position.set(10, 12, z + 12);
    camera.lookAt(0, 0, z - 2);
    stars.position.z = z;
    light.position.set(-6, 16, z + 8);
    light.target.position.set(0, 0, z);
    for (const c of cars) {
      const lane = traffic(c.row, playing ? g.seed : 0);
      c.mesh.visible = c.index < lane.count;
      c.mesh.scale.x = lane.direction / (c.row % 2 ? 1 : -1);
      let cx = carX(c.row, playing ? g.time : 0, c.index, playing ? g.seed : 0);
      if (!playing && Math.abs(cx) < 1.5) cx += 3;
      c.mesh.position.set(cx, 0, 0);
    }
    if (dirty || distance > 0.001 || (playing && g.status === "playing")) {
      renderer.render(scene, camera);
      dirty = false;
    }
    const signature = `${g.status}:${g.score}`;
    if (signature !== previous) {
      previous = signature;
      onState({ ...g });
    }
  }
  function visibility() {
    if (document.hidden && g.status === "playing") {
      g.status = "paused";
      onState({ ...g });
    }
  }
  document.addEventListener("visibilitychange", visibility);
  function lost(e: Event) {
    e.preventDefault();
    onError();
  }
  renderer.domElement.addEventListener("webglcontextlost", lost);
  raf = requestAnimationFrame(frame);
  return {
    landmarks: (rows: number[]) => {
      signGroups.forEach((sign, i) => {
        sign.position.z = -(rows[i] || 0);
      });
      dirty = true;
    },
    scroll: (r: number) => {
      target = r;
      dirty = true;
    },
    play: () => {
      dirty = true;
      playing = true;
      signs.visible = false;
      requestedRow = NaN;
      g = newGame(crypto.getRandomValues(new Uint32Array(1))[0]);
      frog.position.set(0, 0, 0);
      onState({ ...g });
    },
    exit: () => {
      playing = false;
      signs.visible = true;
      requestedRow = NaN;
      dirty = true;
    },
    start: () => {
      dirty = true;
      g = newGame(crypto.getRandomValues(new Uint32Array(1))[0]);
      g.status = "playing";
      facing = 0;
      requestedRow = NaN;
      frog.position.set(0, 0, 0);
      onState({ ...g });
    },
    pause: () => {
      if (g.status === "playing") g.status = "paused";
      else if (g.status === "paused") g.status = "playing";
      onState({ ...g });
    },
    move: (x: number, r: number) => {
      const oldX = g.x,
        oldRow = g.row;
      move(g, x, r);
      if (g.x !== oldX || g.row !== oldRow)
        facing = Math.atan2(-(g.x - oldX), g.row - oldRow);
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      window.removeEventListener("portfolio-theme", theme);
      starGeometry.dispose();
      starMaterial.dispose();
      lanes.clear();
      geo.dispose();
      mats.forEach((m) => m.dispose());
      markers.forEach((s) => {
        s.material.map?.dispose();
        s.material.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
export type SceneController = ReturnType<typeof createScene>;
