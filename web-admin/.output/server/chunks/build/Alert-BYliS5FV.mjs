import { v as vue_exports, g as useComponentProps, w as useLocale, h as useAppConfig, t as tv, s as server_renderer_exports, P as Primitive, f as _sfc_main$3, _ as _sfc_main$1, d as _sfc_main$2 } from '../virtual/entry.mjs';

//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Falert.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Falert_default = {
	"slots": {
		"root": "relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5",
		"wrapper": "min-w-0 flex-1 flex flex-col",
		"title": "text-sm font-medium",
		"description": "text-sm opacity-90",
		"icon": "shrink-0 size-5",
		"avatar": "shrink-0",
		"avatarSize": "2xl",
		"actions": "flex flex-wrap gap-1.5 shrink-0",
		"close": "p-0"
	},
	"variants": {
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"variant": {
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": ""
		},
		"orientation": {
			"horizontal": {
				"root": "items-center",
				"actions": "items-center"
			},
			"vertical": {
				"root": "items-start",
				"actions": "items-start mt-2.5"
			}
		},
		"title": { "true": { "description": "mt-1" } }
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": { "root": "bg-primary text-inverted" }
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": { "root": "bg-secondary text-inverted" }
		},
		{
			"color": "success",
			"variant": "solid",
			"class": { "root": "bg-success text-inverted" }
		},
		{
			"color": "info",
			"variant": "solid",
			"class": { "root": "bg-info text-inverted" }
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": { "root": "bg-warning text-inverted" }
		},
		{
			"color": "error",
			"variant": "solid",
			"class": { "root": "bg-error text-inverted" }
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": { "root": "text-primary ring ring-inset ring-primary/25" }
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": { "root": "text-secondary ring ring-inset ring-secondary/25" }
		},
		{
			"color": "success",
			"variant": "outline",
			"class": { "root": "text-success ring ring-inset ring-success/25" }
		},
		{
			"color": "info",
			"variant": "outline",
			"class": { "root": "text-info ring ring-inset ring-info/25" }
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": { "root": "text-warning ring ring-inset ring-warning/25" }
		},
		{
			"color": "error",
			"variant": "outline",
			"class": { "root": "text-error ring ring-inset ring-error/25" }
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": { "root": "bg-primary/10 text-primary" }
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": { "root": "bg-secondary/10 text-secondary" }
		},
		{
			"color": "success",
			"variant": "soft",
			"class": { "root": "bg-success/10 text-success" }
		},
		{
			"color": "info",
			"variant": "soft",
			"class": { "root": "bg-info/10 text-info" }
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": { "root": "bg-warning/10 text-warning" }
		},
		{
			"color": "error",
			"variant": "soft",
			"class": { "root": "bg-error/10 text-error" }
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": { "root": "bg-primary/10 text-primary ring ring-inset ring-primary/25" }
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": { "root": "bg-secondary/10 text-secondary ring ring-inset ring-secondary/25" }
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": { "root": "bg-success/10 text-success ring ring-inset ring-success/25" }
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": { "root": "bg-info/10 text-info ring ring-inset ring-info/25" }
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": { "root": "bg-warning/10 text-warning ring ring-inset ring-warning/25" }
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": { "root": "bg-error/10 text-error ring ring-inset ring-error/25" }
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": { "root": "text-inverted bg-inverted" }
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": { "root": "text-highlighted bg-default ring ring-inset ring-default" }
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": { "root": "text-highlighted bg-elevated/50" }
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": { "root": "text-highlighted bg-elevated/50 ring ring-inset ring-accented" }
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "solid"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue
var _sfc_main = {
	__name: "UAlert",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		title: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
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
		orientation: {
			type: null,
			required: false,
			default: "vertical"
		},
		actions: {
			type: Array,
			required: false
		},
		close: {
			type: [Boolean, Object],
			required: false
		},
		closeIcon: {
			type: null,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("alert", _props);
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Falert_default,
			...appConfig.ui?.alert || {}
		})({
			color: props.color,
			variant: props.variant,
			orientation: props.orientation,
			title: !!props.title || !!slots.title
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: (0, vue_exports.unref)(props).as,
				"data-orientation": (0, vue_exports.unref)(props).orientation,
				"data-slot": "root",
				class: ui.value.root({ class: [(0, vue_exports.unref)(props).ui?.root, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => {
							if ((0, vue_exports.unref)(props).avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: (0, vue_exports.unref)(props).ui?.avatarSize || ui.value.avatarSize() }, (0, vue_exports.unref)(props).avatar, {
								"data-slot": "avatar",
								class: ui.value.avatar({ class: (0, vue_exports.unref)(props).ui?.avatar })
							}), null, _parent, _scopeId));
							else if ((0, vue_exports.unref)(props).icon) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
								name: (0, vue_exports.unref)(props).icon,
								"data-slot": "icon",
								class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						_push(`<div data-slot="wrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper }))}"${_scopeId}>`);
						if ((0, vue_exports.unref)(props).title || !!slots.title) {
							_push(`<div data-slot="title" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title }))}"${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "title", {}, () => {
								_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).title)}`);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(props).description || !!slots.description) {
							_push(`<div data-slot="description" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description }))}"${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", {}, () => {
								_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
						} else _push(`<!---->`);
						if ((0, vue_exports.unref)(props).orientation === "vertical" && ((0, vue_exports.unref)(props).actions?.length || !!slots.actions)) {
							_push(`<div data-slot="actions" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.actions({ class: (0, vue_exports.unref)(props).ui?.actions }))}"${_scopeId}>`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "actions", {}, () => {
								_push(`<!--[-->`);
								(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(props).actions, (action, index) => {
									_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
										key: index,
										size: "xs"
									}, { ref_for: true }, action), null, _parent, _scopeId));
								});
								_push(`<!--]-->`);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if ((0, vue_exports.unref)(props).orientation === "horizontal" && ((0, vue_exports.unref)(props).actions?.length || !!slots.actions) || (0, vue_exports.unref)(props).close) {
							_push(`<div data-slot="actions" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.actions({
								class: (0, vue_exports.unref)(props).ui?.actions,
								orientation: "horizontal"
							}))}"${_scopeId}>`);
							if ((0, vue_exports.unref)(props).orientation === "horizontal" && ((0, vue_exports.unref)(props).actions?.length || !!slots.actions)) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "actions", {}, () => {
								_push(`<!--[-->`);
								(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(props).actions, (action, index) => {
									_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
										key: index,
										size: "xs"
									}, { ref_for: true }, action), null, _parent, _scopeId));
								});
								_push(`<!--]-->`);
							}, _push, _parent, _scopeId);
							else _push(`<!---->`);
							(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => {
								if ((0, vue_exports.unref)(props).close) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
									icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
									color: "neutral",
									variant: "link",
									"aria-label": (0, vue_exports.unref)(t)("alert.close")
								}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
									"data-slot": "close",
									class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close }),
									onClick: ($event) => emits("update:open", false)
								}), null, _parent, _scopeId));
								else _push(`<!---->`);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
						} else _push(`<!---->`);
					} else return [
						(0, vue_exports.renderSlot)(_ctx.$slots, "leading", { ui: ui.value }, () => [(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
							key: 0,
							size: (0, vue_exports.unref)(props).ui?.avatarSize || ui.value.avatarSize()
						}, (0, vue_exports.unref)(props).avatar, {
							"data-slot": "avatar",
							class: ui.value.avatar({ class: (0, vue_exports.unref)(props).ui?.avatar })
						}), null, 16, ["size", "class"])) : (0, vue_exports.unref)(props).icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
							key: 1,
							name: (0, vue_exports.unref)(props).icon,
							"data-slot": "icon",
							class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
						}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.createVNode)("div", {
							"data-slot": "wrapper",
							class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
						}, [
							(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								"data-slot": "title",
								class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								"data-slot": "description",
								class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
							(0, vue_exports.unref)(props).orientation === "vertical" && ((0, vue_exports.unref)(props).actions?.length || !!slots.actions) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								"data-slot": "actions",
								class: ui.value.actions({ class: (0, vue_exports.unref)(props).ui?.actions })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "actions", {}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).actions, (action, index) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
									key: index,
									size: "xs"
								}, { ref_for: true }, action), null, 16);
							}), 128))])], 2)) : (0, vue_exports.createCommentVNode)("", true)
						], 2),
						(0, vue_exports.unref)(props).orientation === "horizontal" && ((0, vue_exports.unref)(props).actions?.length || !!slots.actions) || (0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							"data-slot": "actions",
							class: ui.value.actions({
								class: (0, vue_exports.unref)(props).ui?.actions,
								orientation: "horizontal"
							})
						}, [(0, vue_exports.unref)(props).orientation === "horizontal" && ((0, vue_exports.unref)(props).actions?.length || !!slots.actions) ? (0, vue_exports.renderSlot)(_ctx.$slots, "actions", {}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(props).actions, (action, index) => {
							return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
								key: index,
								size: "xs"
							}, { ref_for: true }, action), null, 16);
						}), 128))], void 0, 0) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$2, (0, vue_exports.mergeProps)({
							key: 0,
							icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
							color: "neutral",
							variant: "link",
							"aria-label": (0, vue_exports.unref)(t)("alert.close")
						}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
							"data-slot": "close",
							class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close }),
							onClick: ($event) => emits("update:open", false)
						}), null, 16, [
							"icon",
							"aria-label",
							"class",
							"onClick"
						])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Alert.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Alert-BYliS5FV.mjs.map
