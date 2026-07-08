export const TOP_RADIUS = 38;
export const BOTTOM_RADIUS = 48;
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
};

function panelMetrics(width: number, height: number, headerLineY: number): PanelMetrics {
  const y = Math.max(headerLineY, TOP_RADIUS + 4);
  const rB = Math.min(BOTTOM_RADIUS, width * 0.1, height * 0.12);
  const isMobile = width <= MOBILE_PANEL_MAX_WIDTH;
  const rT = isMobile
    ? Math.min(TOP_RADIUS, width * 0.1)
    : Math.min(TOP_RADIUS, width * 0.1, (height - y) * 0.12);

  return { y, rT, rB };
}

/** Smooth bottom-right corner — mirror of the bottom-left panel curve */
function bottomRightCurveSegment(width: number, height: number, rB: number) {
  return `C ${width} ${height - rB + BEZIER_K * rB} ${width - rB + BEZIER_K * rB} ${height} ${width - rB} ${height}`;
}

/** Header seam — right edge turns left with upward fillet (mirror of top-left) */
function topRightHeaderCorner(width: number, y: number, rT: number) {
  return `C ${width} ${y - BEZIER_K * rT} ${width - rT + BEZIER_K * rT} ${y} ${width - rT} ${y}`;
}

function topLeftCornerFromHeader(y: number, rT: number) {
  return `C ${rT - BEZIER_K * rT} ${y} 0 ${y + BEZIER_K * rT} 0 ${y + rT}`;
}

/** Straight right edge, mirrored header corners (same geometry on mobile and desktop) */
function buildSymmetricPanelPath(
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

function buildSymmetricBorderTracePath(
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
    `L ${width} 0`,
  ].join(" ");
}

/** Closed clip path for the white content panel */
export function buildPanelPath(
  width: number,
  height: number,
  headerLineY: number,
): string {
  if (width <= 0 || height <= 0) return "";

  const { y, rT, rB } = panelMetrics(width, height, headerLineY);
  return buildSymmetricPanelPath(width, height, y, rT, rB);
}

/** Full panel border trace — right-top → header seam → left curves → bottom → right-bottom */
export function buildBorderTracePath(
  width: number,
  height: number,
  headerLineY: number,
): string {
  if (width <= 0 || height <= 0) return "";

  const { y, rT, rB } = panelMetrics(width, height, headerLineY);
  return buildSymmetricBorderTracePath(width, height, y, rT, rB);
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
