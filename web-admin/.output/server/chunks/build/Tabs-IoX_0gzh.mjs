import { v as vue_exports, g as useComponentProps, h as useAppConfig, l as useForwardProps, t as tv, s as server_renderer_exports, C as get, _ as _sfc_main$1, f as _sfc_main$3, n as useForwardExpose, P as Primitive, p as Presence_default, q as createContext } from '../virtual/entry.mjs';
import { a as useDirection, u as useId } from './useId-D2M6x4XU.mjs';
import { R as RovingFocusGroup_default } from './RovingFocusGroup-CkUp22zh.mjs';
import { R as RovingFocusItem_default } from './RovingFocusItem-ClXCvEdi.mjs';
import { _ as _sfc_main$2 } from './Badge-DNHUbyj-.mjs';
import { reactivePick, useVModel, useMounted, useResizeObserver } from '@vueuse/core';

//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Tabs/TabsRoot.js
var [injectTabsRootContext, provideTabsRootContext] = /*#__PURE__*/ createContext("TabsRoot");
var TabsRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TabsRoot",
	props: {
		defaultValue: {
			type: null,
			required: false
		},
		orientation: {
			type: String,
			required: false,
			default: "horizontal"
		},
		dir: {
			type: String,
			required: false
		},
		activationMode: {
			type: String,
			required: false,
			default: "automatic"
		},
		modelValue: {
			type: null,
			required: false
		},
		unmountOnHide: {
			type: Boolean,
			required: false,
			default: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { orientation, unmountOnHide, dir: propDir } = (0, vue_exports.toRefs)(props);
		const dir = useDirection(propDir);
		useForwardExpose();
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue,
			passive: props.modelValue === void 0
		});
		const tabsList = (0, vue_exports.ref)();
		const contentIds = (0, vue_exports.shallowRef)(/* @__PURE__ */ new Set());
		provideTabsRootContext({
			modelValue,
			changeModelValue: (value) => {
				modelValue.value = value;
			},
			orientation,
			dir,
			unmountOnHide,
			activationMode: props.activationMode,
			baseId: useId(void 0, "reka-tabs"),
			tabsList,
			contentIds,
			registerContent: (value) => {
				contentIds.value = /* @__PURE__ */ new Set([...contentIds.value, value]);
			},
			unregisterContent: (value) => {
				const newSet = new Set(contentIds.value);
				newSet.delete(value);
				contentIds.value = newSet;
			}
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				dir: (0, vue_exports.unref)(dir),
				"data-orientation": (0, vue_exports.unref)(orientation),
				"as-child": _ctx.asChild,
				as: _ctx.as
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { modelValue: (0, vue_exports.unref)(modelValue) })]),
				_: 3
			}, 8, [
				"dir",
				"data-orientation",
				"as-child",
				"as"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Tabs/utils.js
function makeTriggerId(baseId, value) {
	return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
	return `${baseId}-content-${value}`;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Tabs/TabsContent.js
var TabsContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TabsContent",
	props: {
		value: {
			type: [String, Number],
			required: true
		},
		forceMount: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef } = useForwardExpose();
		const rootContext = injectTabsRootContext();
		const triggerId = (0, vue_exports.computed)(() => makeTriggerId(rootContext.baseId, props.value));
		const contentId = (0, vue_exports.computed)(() => makeContentId(rootContext.baseId, props.value));
		const isSelected = (0, vue_exports.computed)(() => props.value === rootContext.modelValue.value);
		const isMountAnimationPreventedRef = (0, vue_exports.ref)(isSelected.value);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), {
				present: _ctx.forceMount || isSelected.value,
				"force-mount": ""
			}, {
				default: (0, vue_exports.withCtx)(({ present }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), {
					id: contentId.value,
					ref: (0, vue_exports.unref)(forwardRef),
					"as-child": _ctx.asChild,
					as: _ctx.as,
					role: "tabpanel",
					"data-state": isSelected.value ? "active" : "inactive",
					"data-orientation": (0, vue_exports.unref)(rootContext).orientation.value,
					"aria-labelledby": triggerId.value,
					hidden: !present,
					tabindex: "0",
					style: (0, vue_exports.normalizeStyle)({ animationDuration: isMountAnimationPreventedRef.value ? "0s" : void 0 })
				}, {
					default: (0, vue_exports.withCtx)(() => [((0, vue_exports.unref)(rootContext).unmountOnHide.value ? present : true) ? (0, vue_exports.renderSlot)(_ctx.$slots, "default", { key: 0 }) : (0, vue_exports.createCommentVNode)("v-if", true)]),
					_: 2
				}, 1032, [
					"id",
					"as-child",
					"as",
					"data-state",
					"data-orientation",
					"aria-labelledby",
					"hidden",
					"style"
				])]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Tabs/TabsIndicator.js
var TabsIndicator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TabsIndicator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props, { expose: __expose }) {
		const props = __props;
		const context = injectTabsRootContext();
		__expose({ updateIndicatorStyle });
		useForwardExpose();
		const isMounted = useMounted();
		const indicatorStyle = (0, vue_exports.ref)({
			size: null,
			thickness: null,
			position: null
		});
		const tabs = (0, vue_exports.ref)([]);
		(0, vue_exports.watch)(() => [context.modelValue.value, context?.dir.value], () => {
			updateIndicatorStyle();
		}, {
			immediate: true,
			flush: "post"
		});
		(0, vue_exports.watchPostEffect)(() => {
			tabs.value = Array.from(context.tabsList.value?.querySelectorAll("[role=\"tab\"]") || []);
		});
		useResizeObserver((0, vue_exports.computed)(() => [context.tabsList.value, ...tabs.value]), updateIndicatorStyle);
		function updateIndicatorStyle() {
			const activeTab = context.tabsList.value?.querySelector("[role=\"tab\"][data-state=\"active\"]");
			if (!activeTab) return;
			if (context.orientation.value === "horizontal") indicatorStyle.value = {
				size: activeTab.offsetWidth,
				thickness: activeTab.offsetHeight,
				position: activeTab.offsetLeft
			};
			else indicatorStyle.value = {
				size: activeTab.offsetHeight,
				thickness: activeTab.offsetWidth,
				position: activeTab.offsetTop
			};
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(isMounted) && typeof indicatorStyle.value.size === "number" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ key: 0 }, props, { style: {
				"--reka-tabs-indicator-size": `${indicatorStyle.value.size}px`,
				"--reka-tabs-indicator-thickness": `${indicatorStyle.value.thickness}px`,
				"--reka-tabs-indicator-position": `${indicatorStyle.value.position}px`
			} }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["style"])) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Tabs/TabsList.js
var TabsList_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TabsList",
	props: {
		loop: {
			type: Boolean,
			required: false,
			default: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const { loop } = (0, vue_exports.toRefs)(__props);
		const { forwardRef, currentElement } = useForwardExpose();
		const context = injectTabsRootContext();
		context.tabsList = currentElement;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(RovingFocusGroup_default), {
				"as-child": "",
				orientation: (0, vue_exports.unref)(context).orientation.value,
				dir: (0, vue_exports.unref)(context).dir.value,
				loop: (0, vue_exports.unref)(loop)
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), {
					ref: (0, vue_exports.unref)(forwardRef),
					role: "tablist",
					"as-child": _ctx.asChild,
					as: _ctx.as,
					"aria-orientation": (0, vue_exports.unref)(context).orientation.value
				}, {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as-child",
					"as",
					"aria-orientation"
				])]),
				_: 3
			}, 8, [
				"orientation",
				"dir",
				"loop"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Tabs/TabsTrigger.js
var TabsTrigger_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "TabsTrigger",
	props: {
		value: {
			type: [String, Number],
			required: true
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef } = useForwardExpose();
		const rootContext = injectTabsRootContext();
		const triggerId = (0, vue_exports.computed)(() => makeTriggerId(rootContext.baseId, props.value));
		const contentId = (0, vue_exports.computed)(() => rootContext.contentIds.value.has(props.value) ? makeContentId(rootContext.baseId, props.value) : void 0);
		const isSelected = (0, vue_exports.computed)(() => props.value === rootContext.modelValue.value);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(RovingFocusItem_default), {
				"as-child": "",
				focusable: !_ctx.disabled,
				active: isSelected.value
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), {
					id: triggerId.value,
					ref: (0, vue_exports.unref)(forwardRef),
					role: "tab",
					type: _ctx.as === "button" ? "button" : void 0,
					as: _ctx.as,
					"as-child": _ctx.asChild,
					"aria-selected": isSelected.value ? "true" : "false",
					"aria-controls": contentId.value,
					"data-state": isSelected.value ? "active" : "inactive",
					disabled: _ctx.disabled,
					"data-disabled": _ctx.disabled ? "" : void 0,
					"data-orientation": (0, vue_exports.unref)(rootContext).orientation.value,
					onMousedown: _cache[0] || (_cache[0] = (0, vue_exports.withModifiers)((event) => {
						if (!_ctx.disabled && event.ctrlKey === false) (0, vue_exports.unref)(rootContext).changeModelValue(_ctx.value);
						else event.preventDefault();
					}, ["left"])),
					onKeydown: _cache[1] || (_cache[1] = (0, vue_exports.withKeys)(($event) => (0, vue_exports.unref)(rootContext).changeModelValue(_ctx.value), ["enter", "space"])),
					onFocus: _cache[2] || (_cache[2] = () => {
						const isAutomaticActivation = (0, vue_exports.unref)(rootContext).activationMode !== "manual";
						if (!isSelected.value && !_ctx.disabled && isAutomaticActivation) (0, vue_exports.unref)(rootContext).changeModelValue(_ctx.value);
					})
				}, {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"id",
					"type",
					"as",
					"as-child",
					"aria-selected",
					"aria-controls",
					"data-state",
					"disabled",
					"data-disabled",
					"data-orientation"
				])]),
				_: 3
			}, 8, ["focusable", "active"]);
		};
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ftabs.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftabs_default = {
	"slots": {
		"root": "flex items-center gap-2",
		"list": "relative flex p-1 group",
		"indicator": "absolute transition-[translate,width] duration-200",
		"trigger": ["group relative inline-flex items-center min-w-0 data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leadingIcon": "shrink-0",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"label": "truncate",
		"trailingBadge": "shrink-0",
		"trailingBadgeSize": "sm",
		"content": "w-full rounded-md focus-visible:outline-3"
	},
	"variants": {
		"color": {
			"primary": { "content": "outline-primary/25" },
			"secondary": { "content": "outline-secondary/25" },
			"success": { "content": "outline-success/25" },
			"info": { "content": "outline-info/25" },
			"warning": { "content": "outline-warning/25" },
			"error": { "content": "outline-error/25" },
			"neutral": { "content": "outline-inverted/25" }
		},
		"variant": {
			"pill": {
				"list": "bg-elevated rounded-lg",
				"trigger": ["grow", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:content-[''] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:absolute in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:inset-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:rounded-md in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:shadow-xs in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:-z-10 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:isolate"],
				"indicator": "rounded-md shadow-xs"
			},
			"link": {
				"list": "border-default",
				"indicator": "rounded-full",
				"trigger": "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:content-[''] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:absolute in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:rounded-full"
			}
		},
		"orientation": {
			"horizontal": {
				"root": "flex-col",
				"list": "w-full",
				"indicator": "left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)",
				"trigger": "justify-center"
			},
			"vertical": {
				"list": "flex-col",
				"indicator": "top-0 h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)"
			}
		},
		"size": {
			"xs": {
				"trigger": "px-2 py-1 text-xs gap-1",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs"
			},
			"sm": {
				"trigger": "px-2.5 py-1.5 text-xs gap-1.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs"
			},
			"md": {
				"trigger": "px-3 py-1.5 text-sm gap-1.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs"
			},
			"lg": {
				"trigger": "px-3 py-2 text-sm gap-2",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs"
			},
			"xl": {
				"trigger": "px-3 py-2 text-base gap-2",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs"
			}
		}
	},
	"compoundVariants": [
		{
			"orientation": "horizontal",
			"variant": "pill",
			"class": { "indicator": "inset-y-1" }
		},
		{
			"orientation": "horizontal",
			"variant": "link",
			"class": {
				"list": "border-b -mb-px",
				"indicator": "-bottom-px h-px",
				"trigger": "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:inset-x-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:-bottom-[calc(var(--spacing)+1px)] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:h-px"
			}
		},
		{
			"orientation": "vertical",
			"variant": "pill",
			"class": {
				"indicator": "inset-x-1",
				"list": "items-center",
				"trigger": "w-full justify-center"
			}
		},
		{
			"orientation": "vertical",
			"variant": "link",
			"class": {
				"list": "border-s -ms-px",
				"indicator": "-start-px w-px",
				"trigger": "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:inset-y-0 in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:-start-[calc(var(--spacing)+1px)] in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:w-px"
			}
		},
		{
			"color": "primary",
			"variant": "pill",
			"class": {
				"indicator": "bg-primary",
				"trigger": ["data-[state=active]:text-inverted outline-primary/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-primary"]
			}
		},
		{
			"color": "secondary",
			"variant": "pill",
			"class": {
				"indicator": "bg-secondary",
				"trigger": ["data-[state=active]:text-inverted outline-secondary/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-secondary"]
			}
		},
		{
			"color": "success",
			"variant": "pill",
			"class": {
				"indicator": "bg-success",
				"trigger": ["data-[state=active]:text-inverted outline-success/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-success"]
			}
		},
		{
			"color": "info",
			"variant": "pill",
			"class": {
				"indicator": "bg-info",
				"trigger": ["data-[state=active]:text-inverted outline-info/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-info"]
			}
		},
		{
			"color": "warning",
			"variant": "pill",
			"class": {
				"indicator": "bg-warning",
				"trigger": ["data-[state=active]:text-inverted outline-warning/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-warning"]
			}
		},
		{
			"color": "error",
			"variant": "pill",
			"class": {
				"indicator": "bg-error",
				"trigger": ["data-[state=active]:text-inverted outline-error/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-error"]
			}
		},
		{
			"color": "neutral",
			"variant": "pill",
			"class": {
				"indicator": "bg-inverted",
				"trigger": ["data-[state=active]:text-inverted outline-inverted/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-inverted"]
			}
		},
		{
			"color": "primary",
			"variant": "link",
			"class": {
				"indicator": "bg-primary",
				"trigger": ["data-[state=active]:text-primary outline-primary/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-primary"]
			}
		},
		{
			"color": "secondary",
			"variant": "link",
			"class": {
				"indicator": "bg-secondary",
				"trigger": ["data-[state=active]:text-secondary outline-secondary/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-secondary"]
			}
		},
		{
			"color": "success",
			"variant": "link",
			"class": {
				"indicator": "bg-success",
				"trigger": ["data-[state=active]:text-success outline-success/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-success"]
			}
		},
		{
			"color": "info",
			"variant": "link",
			"class": {
				"indicator": "bg-info",
				"trigger": ["data-[state=active]:text-info outline-info/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-info"]
			}
		},
		{
			"color": "warning",
			"variant": "link",
			"class": {
				"indicator": "bg-warning",
				"trigger": ["data-[state=active]:text-warning outline-warning/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-warning"]
			}
		},
		{
			"color": "error",
			"variant": "link",
			"class": {
				"indicator": "bg-error",
				"trigger": ["data-[state=active]:text-error outline-error/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-error"]
			}
		},
		{
			"color": "neutral",
			"variant": "link",
			"class": {
				"indicator": "bg-inverted",
				"trigger": ["data-[state=active]:text-highlighted outline-inverted/25 focus-visible:outline-3", "in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:after:bg-inverted"]
			}
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "pill",
		"size": "md"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Tabs.vue
var _sfc_main = {
	__name: "UTabs",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		items: {
			type: Array,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		orientation: {
			type: null,
			required: false,
			default: "horizontal"
		},
		content: {
			type: Boolean,
			required: false,
			default: true
		},
		valueKey: {
			type: null,
			required: false,
			default: "value"
		},
		labelKey: {
			type: null,
			required: false,
			default: "label"
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		defaultValue: {
			type: [String, Number],
			required: false,
			default: "0"
		},
		modelValue: {
			type: [String, Number],
			required: false
		},
		activationMode: {
			type: String,
			required: false
		},
		unmountOnHide: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("tabs", _props);
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "as", "unmountOnHide"), emits);
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftabs_default,
			...appConfig.ui?.tabs || {}
		})({
			color: props.color,
			variant: props.variant,
			size: props.size,
			orientation: props.orientation
		}));
		const triggersRef = (0, vue_exports.ref)([]);
		function setTriggerRef(index, el) {
			triggersRef.value[index] = el;
		}
		__expose({ triggersRef });
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TabsRoot_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(rootProps), {
				"model-value": (0, vue_exports.unref)(props).modelValue,
				"default-value": (0, vue_exports.unref)(props).defaultValue,
				orientation: (0, vue_exports.unref)(props).orientation,
				"activation-mode": (0, vue_exports.unref)(props).activationMode,
				"data-slot": "root",
				class: ui.value.root({ class: [(0, vue_exports.unref)(props).ui?.root, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TabsList_default), {
							"data-slot": "list",
							class: ui.value.list({ class: (0, vue_exports.unref)(props).ui?.list })
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TabsIndicator_default), {
										"data-slot": "indicator",
										class: ui.value.indicator({ class: (0, vue_exports.unref)(props).ui?.indicator })
									}, null, _parent, _scopeId));
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "list-leading", {}, null, _push, _parent, _scopeId);
									_push(`<!--[-->`);
									(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(props).items, (item, index) => {
										_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TabsTrigger_default), {
											key: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? index,
											ref_for: true,
											ref: (el) => setTriggerRef(index, el),
											value: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? String(index),
											disabled: item.disabled,
											"data-slot": "trigger",
											class: ui.value.trigger({ class: [(0, vue_exports.unref)(props).ui?.trigger, item.ui?.trigger] })
										}, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) {
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", {
														item,
														index,
														ui: ui.value
													}, () => {
														if (item.icon) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
															name: item.icon,
															"data-slot": "leadingIcon",
															class: ui.value.leadingIcon({ class: [(0, vue_exports.unref)(props).ui?.leadingIcon, item.ui?.leadingIcon] })
														}, null, _parent, _scopeId));
														else if (item.avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: item.ui?.leadingAvatarSize || (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, { ref_for: true }, item.avatar, {
															"data-slot": "leadingAvatar",
															class: ui.value.leadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.leadingAvatar, item.ui?.leadingAvatar] })
														}), null, _parent, _scopeId));
														else _push(`<!---->`);
													}, _push, _parent, _scopeId);
													if ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) || !!slots.default) {
														_push(`<span data-slot="label" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.label({ class: [(0, vue_exports.unref)(props).ui?.label, item.ui?.label] }))}"${_scopeId}>`);
														(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {
															item,
															index
														}, () => {
															_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey))}`);
														}, _push, _parent, _scopeId);
														_push(`</span>`);
													} else _push(`<!---->`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "trailing", {
														item,
														index,
														ui: ui.value
													}, () => {
														if (item.badge || item.badge === 0) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
															color: "neutral",
															variant: "outline",
															size: item.ui?.trailingBadgeSize || (0, vue_exports.unref)(props).ui?.trailingBadgeSize || ui.value.trailingBadgeSize()
														}, { ref_for: true }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
															"data-slot": "trailingBadge",
															class: ui.value.trailingBadge({ class: [(0, vue_exports.unref)(props).ui?.trailingBadge, item.ui?.trailingBadge] })
														}), null, _parent, _scopeId));
														else _push(`<!---->`);
													}, _push, _parent, _scopeId);
												} else return [
													(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
														item,
														index,
														ui: ui.value
													}, () => [item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
														key: 0,
														name: item.icon,
														"data-slot": "leadingIcon",
														class: ui.value.leadingIcon({ class: [(0, vue_exports.unref)(props).ui?.leadingIcon, item.ui?.leadingIcon] })
													}, null, 8, ["name", "class"])) : item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
														key: 1,
														size: item.ui?.leadingAvatarSize || (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
													}, { ref_for: true }, item.avatar, {
														"data-slot": "leadingAvatar",
														class: ui.value.leadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.leadingAvatar, item.ui?.leadingAvatar] })
													}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
													(0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) || !!slots.default ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
														key: 0,
														"data-slot": "label",
														class: ui.value.label({ class: [(0, vue_exports.unref)(props).ui?.label, item.ui?.label] })
													}, [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
														item,
														index
													}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
													(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
														item,
														index,
														ui: ui.value
													}, () => [item.badge || item.badge === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
														key: 0,
														color: "neutral",
														variant: "outline",
														size: item.ui?.trailingBadgeSize || (0, vue_exports.unref)(props).ui?.trailingBadgeSize || ui.value.trailingBadgeSize()
													}, { ref_for: true }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
														"data-slot": "trailingBadge",
														class: ui.value.trailingBadge({ class: [(0, vue_exports.unref)(props).ui?.trailingBadge, item.ui?.trailingBadge] })
													}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])
												];
											}),
											_: 2
										}, _parent, _scopeId));
									});
									_push(`<!--]-->`);
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "list-trailing", {}, null, _push, _parent, _scopeId);
								} else return [
									(0, vue_exports.createVNode)((0, vue_exports.unref)(TabsIndicator_default), {
										"data-slot": "indicator",
										class: ui.value.indicator({ class: (0, vue_exports.unref)(props).ui?.indicator })
									}, null, 8, ["class"]),
									(0, vue_exports.renderSlot)(_ctx.$slots, "list-leading"),
									((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).items, (item, index) => {
										return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TabsTrigger_default), {
											key: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? index,
											ref_for: true,
											ref: (el) => setTriggerRef(index, el),
											value: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? String(index),
											disabled: item.disabled,
											"data-slot": "trigger",
											class: ui.value.trigger({ class: [(0, vue_exports.unref)(props).ui?.trigger, item.ui?.trigger] })
										}, {
											default: (0, vue_exports.withCtx)(() => [
												(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
													item,
													index,
													ui: ui.value
												}, () => [item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
													key: 0,
													name: item.icon,
													"data-slot": "leadingIcon",
													class: ui.value.leadingIcon({ class: [(0, vue_exports.unref)(props).ui?.leadingIcon, item.ui?.leadingIcon] })
												}, null, 8, ["name", "class"])) : item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
													key: 1,
													size: item.ui?.leadingAvatarSize || (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
												}, { ref_for: true }, item.avatar, {
													"data-slot": "leadingAvatar",
													class: ui.value.leadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.leadingAvatar, item.ui?.leadingAvatar] })
												}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
												(0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) || !!slots.default ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 0,
													"data-slot": "label",
													class: ui.value.label({ class: [(0, vue_exports.unref)(props).ui?.label, item.ui?.label] })
												}, [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
													item,
													index
												}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
													item,
													index,
													ui: ui.value
												}, () => [item.badge || item.badge === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
													key: 0,
													color: "neutral",
													variant: "outline",
													size: item.ui?.trailingBadgeSize || (0, vue_exports.unref)(props).ui?.trailingBadgeSize || ui.value.trailingBadgeSize()
												}, { ref_for: true }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
													"data-slot": "trailingBadge",
													class: ui.value.trailingBadge({ class: [(0, vue_exports.unref)(props).ui?.trailingBadge, item.ui?.trailingBadge] })
												}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])
											]),
											_: 2
										}, 1032, [
											"value",
											"disabled",
											"class"
										]);
									}), 128)),
									(0, vue_exports.renderSlot)(_ctx.$slots, "list-trailing")
								];
							}),
							_: 3
						}, _parent, _scopeId));
						if (!!(0, vue_exports.unref)(props).content) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(props).items, (item, index) => {
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(TabsContent_default), {
									key: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? index,
									value: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? String(index),
									"data-slot": "content",
									class: ui.value.content({ class: [
										(0, vue_exports.unref)(props).ui?.content,
										item.ui?.content,
										item.class
									] })
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, item.slot || "content", {
											item,
											index,
											ui: ui.value
										}, () => {
											_push(`${(0, server_renderer_exports.ssrInterpolate)(item.content)}`);
										}, _push, _parent, _scopeId);
										else return [(0, vue_exports.renderSlot)(_ctx.$slots, item.slot || "content", {
											item,
											index,
											ui: ui.value
										}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(item.content), 1)])];
									}),
									_: 2
								}, _parent, _scopeId));
							});
							_push(`<!--]-->`);
						} else _push(`<!---->`);
					} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(TabsList_default), {
						"data-slot": "list",
						class: ui.value.list({ class: (0, vue_exports.unref)(props).ui?.list })
					}, {
						default: (0, vue_exports.withCtx)(() => [
							(0, vue_exports.createVNode)((0, vue_exports.unref)(TabsIndicator_default), {
								"data-slot": "indicator",
								class: ui.value.indicator({ class: (0, vue_exports.unref)(props).ui?.indicator })
							}, null, 8, ["class"]),
							(0, vue_exports.renderSlot)(_ctx.$slots, "list-leading"),
							((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).items, (item, index) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TabsTrigger_default), {
									key: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? index,
									ref_for: true,
									ref: (el) => setTriggerRef(index, el),
									value: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? String(index),
									disabled: item.disabled,
									"data-slot": "trigger",
									class: ui.value.trigger({ class: [(0, vue_exports.unref)(props).ui?.trigger, item.ui?.trigger] })
								}, {
									default: (0, vue_exports.withCtx)(() => [
										(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
											item,
											index,
											ui: ui.value
										}, () => [item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
											key: 0,
											name: item.icon,
											"data-slot": "leadingIcon",
											class: ui.value.leadingIcon({ class: [(0, vue_exports.unref)(props).ui?.leadingIcon, item.ui?.leadingIcon] })
										}, null, 8, ["name", "class"])) : item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
											key: 1,
											size: item.ui?.leadingAvatarSize || (0, vue_exports.unref)(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
										}, { ref_for: true }, item.avatar, {
											"data-slot": "leadingAvatar",
											class: ui.value.leadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.leadingAvatar, item.ui?.leadingAvatar] })
										}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
										(0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) || !!slots.default ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											"data-slot": "label",
											class: ui.value.label({ class: [(0, vue_exports.unref)(props).ui?.label, item.ui?.label] })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
											item,
											index
										}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
											item,
											index,
											ui: ui.value
										}, () => [item.badge || item.badge === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
											key: 0,
											color: "neutral",
											variant: "outline",
											size: item.ui?.trailingBadgeSize || (0, vue_exports.unref)(props).ui?.trailingBadgeSize || ui.value.trailingBadgeSize()
										}, { ref_for: true }, typeof item.badge === "string" || typeof item.badge === "number" ? { label: item.badge } : item.badge, {
											"data-slot": "trailingBadge",
											class: ui.value.trailingBadge({ class: [(0, vue_exports.unref)(props).ui?.trailingBadge, item.ui?.trailingBadge] })
										}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])
									]),
									_: 2
								}, 1032, [
									"value",
									"disabled",
									"class"
								]);
							}), 128)),
							(0, vue_exports.renderSlot)(_ctx.$slots, "list-trailing")
						]),
						_: 3
					}, 8, ["class"]), !!(0, vue_exports.unref)(props).content ? ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, (0, vue_exports.renderList)((0, vue_exports.unref)(props).items, (item, index) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(TabsContent_default), {
							key: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? index,
							value: (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) ?? String(index),
							"data-slot": "content",
							class: ui.value.content({ class: [
								(0, vue_exports.unref)(props).ui?.content,
								item.ui?.content,
								item.class
							] })
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, item.slot || "content", {
								item,
								index,
								ui: ui.value
							}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(item.content), 1)])]),
							_: 2
						}, 1032, ["value", "class"]);
					}), 128)) : (0, vue_exports.createCommentVNode)("", true)];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Tabs.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Tabs-IoX_0gzh.mjs.map
