import type { SurfaceBlockModel } from './surface-model.js';
import type { SurfaceBlockService } from './surface-service.js';

export { normalizeShapeBound } from './canvas-renderer/element-renderer/index.js';
export { fitContent } from './canvas-renderer/element-renderer/shape/utils.js';
export { Overlay, Renderer } from './canvas-renderer/renderer.js';
export {
  type IModelCoord,
  ShapeStyle,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from './consts.js';
export {
  AffineCanvasTextFonts,
  CommunityCanvasTextFonts,
  GRID_GAP_MAX,
  GRID_GAP_MIN,
} from './consts.js';
export { SurfaceElementModel } from './element-model/base.js';
export { CanvasElementType } from './element-model/index.js';
export {
  LayoutType,
  MindmapElementModel,
  MindmapStyle,
} from './element-model/mindmap.js';
export * from './elements/index.js';
export { ShapeType } from './elements/shape/consts.js';
export {
  MindmapRootBlock,
  MindmapService,
  MindmapSurfaceBlock,
  markdownToMindmap,
} from './mini-mindmap/index.js';
export { RoughCanvas } from './rough/canvas.js';
export type { Options } from './rough/core.js';
export { SurfaceBlockModel as SurfaceBlockModel } from './surface-model.js';
export { AStarRunner } from './utils/a-star.js';
export * from './utils/index.js';
export {
  BrushElementModel,
  type Connection,
  ConnectorElementModel,
  ConnectorEndpoint,
  ConnectorMode,
  DEFAULT_FRONT_END_POINT_STYLE,
  DEFAULT_REAR_END_POINT_STYLE,
  GroupElementModel,
  type PointStyle,
  ShapeElementModel,
  TextElementModel,
} from '@blocksuite/affine-model';
export {
  almostEqual,
  clamp,
  getBoundsWithRotation,
  getPointFromBoundsWithRotation,
  getPointsFromBoundsWithRotation,
  getQuadBoundsWithRotation,
  getStroke,
  getSvgPathFromStroke,
  intersects,
  isOverlap,
  isPointIn,
  lineIntersects,
  linePolygonIntersects,
  normalizeDegAngle,
  polyLineNearestPoint,
  polygonGetPointTangent,
  polygonNearestPoint,
  polygonPointDistance,
  rotatePoints,
  sign,
  toDegree,
  toRadian,
} from '@blocksuite/global/utils';

declare global {
  namespace BlockSuite {
    interface BlockServices {
      'affine:surface': SurfaceBlockService;
    }
    interface BlockModels {
      'affine:surface': SurfaceBlockModel;
    }
  }
}
