import { g as useComponentProps, h as useAppConfig, v as vue_exports, t as tv, s as server_renderer_exports, P as Primitive } from '../virtual/entry.mjs';

//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fcontainer.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fcontainer_default = { "base": "w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8" };
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Container.vue
var _sfc_main = {
	__name: "UContainer",
	__ssrInlineRender: true,
	props: {
		as: {
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
	setup(__props) {
		const props = useComponentProps("container", __props);
		const appConfig = useAppConfig();
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fcontainer_default,
			...appConfig.ui?.container || {}
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: (0, vue_exports.unref)(props).as,
				class: ui.value({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Container.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Container-C4Y98Up-.mjs.map
