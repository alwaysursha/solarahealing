export const TOP_RADIUS = 38;
export const BOTTOM_RADIUS = 48;
export const RIGHT_CURVE_START = 0.96;
export const RIGHT_CURVE_START_MOBILE = 0.87;
export const MOBILE_PANEL_MAX_WIDTH = 768;
export const MOBILE_NAV_WIDTH_PERCENT = RIGHT_CURVE_START_MOBILE * 100;
export const MOBILE_NAV_CORNER = 16;
export const MOBILE_NAV_CORNER_TR = 24;
export const MOBILE_NAV_CORNER_BR = 24;
export const BEZIER_K = 0.5522847498;

type PanelMetrics = {
  y: number;
  rT: number;
  rB: number;
  curveX: number;
  isMobile: boolean;
};

function panelMetrics(width: number, height: number, headerLineY: number): PanelMetrics {
  const y = Math.max(headerLineY, TOP_RADIUS + 4);
  const rB = Math.min(BOTTOM_RADIUS, width * 0.1, height * 0.12);
  const isMobile = width <= MOBILE_PANEL_MAX_WIDTH;
  const curveStart = isMobile ? RIGHT_CURVE_START_MOBILE : RIGHT_CURVE_START;
  const curveX = width * curveStart;
  const rT = isMobile
    ? Math.min(TOP_RADIUS, width * 0.1)
    : Math.min(TOP_RADIUS, width * 0.1, (height - y) * 0.12);

  return { y, rT, rB, curveX, isMobile };
}

/** Cubic bezier control points for the top-right panel curve */
function rightTopCurveControls(width: number, y: number, curveX: number) {
  const span = width - curveX;

  // Tangent-aligned handles — same circular-arc constant as the other panel corners
  return {
    cp1x: curveX + span * BEZIER_K,
    cp1y: y,
    cp2x: width,
    cp2y: y * BEZIER_K,
  };
}

function rightTopCurveSegment(width: number, y: number, curveX: number) {
  const { cp1x, cp1y, cp2x, cp2y } = rightTopCurveControls(width, y, curveX);
  return `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${width} 0`;
}

/** Smooth bottom-right corner — mirror of the bottom-left panel curve */
function bottomRightCurveSegment(width: number, height: number, rB: number) {
  return `C ${width} ${height - rB + BEZIER_K * rB} ${width - rB + BEZIER_K * rB} ${height} ${width - rB} ${height}`;
}

/** Header seam — right edge turns left with upward fillet (mirror angle of top-left) */
function topRightHeaderCorner(width: number, y: number, rT: number) {
  return `C ${width} ${y - BEZIER_K * rT} ${width - rT + BEZIER_K * rT} ${y} ${width - rT} ${y}`;
}

function topLeftCornerSegment(y: number, rT: number) {
  return `C 0 ${y + BEZIER_K * rT} ${rT - BEZIER_K * rT} ${y} ${rT} ${y}`;
}

function topLeftCornerFromHeader(y: number, rT: number) {
  return `C ${rT - BEZIER_K * rT} ${y} 0 ${y + BEZIER_K * rT} 0 ${y + rT}`;
}

/** Mobile: straight right edge down, rounded turn left at header bottom (same rT as left) */
function buildMobilePanelPath(
  width: number,
  height: number,
  y: number,
  rT: number,
  rB: number,
): string {
  return [
    `M ${width} 0`,
    `L ${width} ${y - rT}`,
    topRightHeaderCorner(width, y, rT),
    `L ${rT} ${y}`,
    topLeftCornerFromHeader(y, rT),
    `L 0 ${height - rB}`,
    `C 0 ${height - BEZIER_K * rB} 0 ${height} ${rB} ${height}`,
    `L ${width - rB} ${height}`,
    `C ${width - rB + BEZIER_K * rB} ${height} ${width} ${height - rB + BEZIER_K * rB} ${width} ${height - rB}`,
    `L ${width} ${y - rT}`,
    "Z",
  ].join(" ");
}

/** Desktop: curved top-right sweep, then straight down and rounded bottom-right */
function desktopRightEdge(width: number, y: number, height: number, curveX: number, rB: number) {
  return [
    `L ${curveX} ${y}`,
    rightTopCurveSegment(width, y, curveX),
    `L ${width} ${height - rB}`,
    bottomRightCurveSegment(width, height, rB),
  ].join(" ");
}

/** Closed clip path for the white content panel */
export function buildPanelPath(
  width: number,
  height: number,
  headerLineY: number,
): string {
  if (width <= 0 || height <= 0) return "";

  const { y, rT, rB, curveX, isMobile } = panelMetrics(width, height, headerLineY);

  if (isMobile) {
    return buildMobilePanelPath(width, height, y, rT, rB);
  }

  return [
    `M ${rT} ${y}`,
    desktopRightEdge(width, y, height, curveX, rB),
    `L ${rB} ${height}`,
    `C 0 ${height} 0 ${height - BEZIER_K * rB} 0 ${height - rB}`,
    `L 0 ${y + rT}`,
    topLeftCornerSegment(y, rT),
    "Z",
  ].join(" ");
}

/** Full panel border trace — right-top → header seam → left curves → bottom → right-bottom, then back */
export function buildBorderTracePath(
  width: number,
  height: number,
  headerLineY: number,
): string {
  if (width <= 0 || height <= 0) return "";

  const { y, rT, rB, curveX, isMobile } = panelMetrics(width, height, headerLineY);

  if (isMobile) {
    return [
      `M ${width} 0`,
      `L ${width} ${y - rT}`,
      topRightHeaderCorner(width, y, rT),
      `L ${rT} ${y}`,
      topLeftCornerFromHeader(y, rT),
      `L 0 ${height - rB}`,
      `C 0 ${height - BEZIER_K * rB} 0 ${height} ${rB} ${height}`,
      `L ${width - rB} ${height}`,
      `C ${width - rB + BEZIER_K * rB} ${height} ${width} ${height - rB + BEZIER_K * rB} ${width} ${height - rB}`,
      `L ${width} ${y - rT}`,
      `L ${width} 0`,
    ].join(" ");
  }

  const { cp1x, cp1y, cp2x, cp2y } = rightTopCurveControls(width, y, curveX);

  return [
    `M ${width} 0`,
    `C ${cp2x} ${cp2y} ${cp1x} ${cp1y} ${curveX} ${y}`,
    `L ${rT} ${y}`,
    `C ${rT - BEZIER_K * rT} ${y} 0 ${y + BEZIER_K * rT} 0 ${y + rT}`,
    `L 0 ${height - rB}`,
    `C 0 ${height - BEZIER_K * rB} 0 ${height} ${rB} ${height}`,
    `L ${width - rB} ${height}`,
    `C ${width - rB + BEZIER_K * rB} ${height} ${width} ${height - rB + BEZIER_K * rB} ${width} ${height - rB}`,
  ].join(" ");
}

/** Mobile nav — rounded top-right + bottom-right, straight right edge between them */
export function buildMobileNavPath(width: number, height: number): string {
  if (width <= 0 || height <= 0) return "";

  const rTL = MOBILE_NAV_CORNER;
  const rBL = MOBILE_NAV_CORNER;
  const rTR = MOBILE_NAV_CORNER_TR;
  const rBR = MOBILE_NAV_CORNER_BR;
  const k = BEZIER_K;

  return [
    `M ${rTL} 0`,
    `L ${width - rTR} 0`,
    `C ${width - k * rTR} 0 ${width} ${k * rTR} ${width} ${rTR}`,
    `L ${width} ${height - rBR}`,
    `C ${width} ${height - rBR + k * rBR} ${width - rBR + k * rBR} ${height} ${width - rBR} ${height}`,
    `L ${rBL} ${height}`,
    `C 0 ${height} 0 ${height - k * rBL} 0 ${height - rBL}`,
    `L 0 ${rTL}`,
    `C 0 ${k * rTL} ${k * rTL} 0 ${rTL} 0`,
    "Z",
  ].join(" ");
}
