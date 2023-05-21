import {
	StoreChangeHandler,
	GeoJSONStore,
	GeoJSONStoreFeatures,
} from "./store/store";

export type HexColor = `#${string}`;

export interface TerraDrawAdapterStyling {
	pointColor: HexColor;
	pointWidth: number;
	pointOutlineColor: HexColor;
	pointOutlineWidth: number;
	polygonFillColor: HexColor;
	polygonFillOpacity: number;
	polygonOutlineColor: HexColor;
	polygonOutlineWidth: number;
	lineStringWidth: number;
	lineStringColor: HexColor;
	zIndex: number;
}

// Neither buttons nor touch/pen contact changed since last event	-1
// Mouse move with no buttons pressed, Pen moved while hovering with no buttons pressed	—
// Left Mouse, Touch Contact, Pen contact	0
// Middle Mouse	1
// Right Mouse, Pen barrel button	2
export interface TerraDrawMouseEvent {
	lng: number;
	lat: number;
	containerX: number;
	containerY: number;
	button: "neither" | "left" | "middle" | "right";
	heldKeys: string[];
}

export interface TerraDrawKeyboardEvent {
	key: string;
}

export type SetCursor = (
	cursor: "unset" | "grab" | "grabbing" | "crosshair" | "pointer" | "wait"
) => void;

export type Project = (lng: number, lat: number) => { x: number; y: number };
export type Unproject = (x: number, y: number) => { lat: number; lng: number };
export type GetLngLatFromEvent = (event: PointerEvent | MouseEvent) => {
	lng: number;
	lat: number;
} | null;

export interface TerraDrawModeRegisterConfig {
	mode: string;
	store: GeoJSONStore;
	setDoubleClickToZoom: (enabled: boolean) => void;
	setCursor: SetCursor;
	onChange: StoreChangeHandler;
	onSelect: (selectedId: string) => void;
	onDeselect: (deselectedId: string) => void;
	project: Project;
	unproject: Unproject;
}

export type TerraDrawModeState =
	| "unregistered"
	| "registered"
	| "started"
	| "drawing"
	| "selected"
	| "stopped";

export interface TerraDrawCallbacks {
	getState: () => TerraDrawModeState;
	onKeyUp: (event: TerraDrawKeyboardEvent) => void;
	onKeyDown: (event: TerraDrawKeyboardEvent) => void;
	onClick: (event: TerraDrawMouseEvent) => void;
	onMouseMove: (event: TerraDrawMouseEvent) => void;
	onDragStart: (
		event: TerraDrawMouseEvent,
		setMapDraggability: (enabled: boolean) => void
	) => void;
	onDrag: (event: TerraDrawMouseEvent) => void;
	onDragEnd: (
		event: TerraDrawMouseEvent,
		setMapDraggability: (enabled: boolean) => void
	) => void;
	onClear: () => void;
}

export interface TerraDrawChanges {
	created: GeoJSONStoreFeatures[];
	updated: GeoJSONStoreFeatures[];
	unchanged: GeoJSONStoreFeatures[];
	deletedIds: string[];
}

export type TerraDrawStylingFunction = {
	[mode: string]: (feature: GeoJSONStoreFeatures) => TerraDrawAdapterStyling;
};

export interface TerraDrawAdapter {
	project: Project;
	unproject: Unproject;
	setCursor: SetCursor;
	setDoubleClickToZoom: (enabled: boolean) => void;
	getMapContainer: () => HTMLElement;
	register(callbacks: TerraDrawCallbacks): void;
	unregister(): void;
	render(changes: TerraDrawChanges, styling: TerraDrawStylingFunction): void;
	clear(): void;
}

export const SELECT_PROPERTIES = {
	SELECTED: "selected",
	MID_POINT: "midPoint",
	SELECTION_POINT: "selectionPoint",
} as const;

export const POLYGON_PROPERTIES = {
	CLOSING_POINT: "closingPoint",
};
