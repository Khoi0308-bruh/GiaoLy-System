import { v as vue_exports, s as server_renderer_exports, d as _sfc_main, _ as _sfc_main$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$1 } from './Card-CTTrlgZc.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';
import 'unhead/utils';
import 'vue';
import '../routes/renderer.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'devalue';
import 'pinia';
import '@vueuse/core';
import 'tailwindcss/colors';

//#region pages/catechist/camps.vue?vue&type=script&setup=true&lang.ts
var camps_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "camps",
	__ssrInlineRender: true,
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UButton = _sfc_main;
			const _component_UCard = _sfc_main$1;
			const _component_UIcon = _sfc_main$2;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "max-w-6xl mx-auto p-4 md:p-8" }, _attrs))}><div class="flex items-center justify-between mb-8"><div><h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Quản Lý Hội Trại</h1><p class="text-stone-600 dark:text-stone-400 mt-2">Theo dõi đăng ký, thu phí và phân đội cho các kỳ Sa mạc.</p></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				icon: "i-lucide-arrow-left",
				variant: "soft",
				color: "gray",
				to: "/catechist"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Trở về`);
					else return [(0, vue_exports.createTextVNode)("Trở về")];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { class: "bg-white/80 dark:bg-stone-900" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-8 text-center text-stone-500"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-lucide-tent",
							class: "w-12 h-12 mx-auto mb-4 text-stone-300"
						}, null, _parent, _scopeId));
						_push(`<p${_scopeId}>Giao diện danh sách Hội trại đang được tích hợp...</p></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "p-8 text-center text-stone-500" }, [(0, vue_exports.createVNode)(_component_UIcon, {
						name: "i-lucide-tent",
						class: "w-12 h-12 mx-auto mb-4 text-stone-300"
					}), (0, vue_exports.createVNode)("p", null, "Giao diện danh sách Hội trại đang được tích hợp...")])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region pages/catechist/camps.vue
var _sfc_setup = camps_vue_vue_type_script_setup_true_lang_default.setup;
camps_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catechist/camps.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var camps_default = camps_vue_vue_type_script_setup_true_lang_default;

export { camps_default as default };
//# sourceMappingURL=camps-B29I_idv.mjs.map
