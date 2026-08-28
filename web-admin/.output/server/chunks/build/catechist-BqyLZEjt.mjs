import { v as vue_exports, s as server_renderer_exports, O as navigateTo, _ as _sfc_main$1 } from '../virtual/entry.mjs';
import { _ as _sfc_main } from './Card-CTTrlgZc.mjs';
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

//#region pages/catechist/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const tools = [
			{
				title: "Sổ Hoa Thiêng",
				desc: "Chấm điểm thi đua, viếng Chúa, làm việc thiện cho các em.",
				icon: "i-lucide-flower-2",
				link: "/catechist/spiritual-bouquets",
				bgColor: "bg-rose-500"
			},
			{
				title: "Tiến Trình Bí Tích",
				desc: "Theo dõi điều kiện Rước Lễ, Thêm Sức (Giấy tờ, Tĩnh tâm).",
				icon: "i-lucide-scroll",
				link: "/catechist/sacraments",
				bgColor: "bg-marian-blue-500"
			},
			{
				title: "Thư Viện Giáo Án",
				desc: "Soạn thảo và chia sẻ giáo án điện tử giữa các lớp.",
				icon: "i-lucide-book-open",
				link: "/catechist/lesson-plans",
				bgColor: "bg-vatican-gold-600"
			},
			{
				title: "Phân Công Phụng Vụ",
				desc: "Lên lịch trực, phân công giảng dạy cho Huynh trưởng.",
				icon: "i-lucide-calendar-clock",
				link: "/catechist/duty-roster",
				bgColor: "bg-emerald-600"
			},
			{
				title: "Quản Lý Hội Trại",
				desc: "Danh sách đi Sa mạc, đóng phí, chia đội nhóm.",
				icon: "i-lucide-tent",
				link: "/catechist/camps",
				bgColor: "bg-orange-500"
			}
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UCard = _sfc_main;
			const _component_UIcon = _sfc_main$1;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "max-w-6xl mx-auto p-4 md:p-8" }, _attrs))}><div class="mb-8"><h1 class="text-3xl font-bold font-serif text-marian-blue-900 dark:text-white">Góc Giáo Lý Viên</h1><p class="text-stone-600 dark:text-stone-400 mt-2">Công cụ quản lý nội bộ dành riêng cho Giáo Lý Viên và Huynh Trưởng.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(tools, (tool) => {
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
					key: tool.title,
					class: "hover-lift cursor-pointer bg-white/80 dark:bg-stone-900 border-none shadow-md",
					onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : (0, vue_exports.unref)(navigateTo))(tool.link)
				}, {
					default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex items-start space-x-4"${_scopeId}><div class="${(0, server_renderer_exports.ssrRenderClass)(["p-3 rounded-md", tool.bgColor])}"${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
								name: tool.icon,
								class: "w-6 h-6 text-white"
							}, null, _parent, _scopeId));
							_push(`</div><div${_scopeId}><h3 class="font-semibold text-lg text-marian-blue-800 dark:text-stone-200"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tool.title)}</h3><p class="text-sm text-stone-500 mt-1 line-clamp-2"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(tool.desc)}</p></div></div>`);
						} else return [(0, vue_exports.createVNode)("div", { class: "flex items-start space-x-4" }, [(0, vue_exports.createVNode)("div", { class: ["p-3 rounded-md", tool.bgColor] }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: tool.icon,
							class: "w-6 h-6 text-white"
						}, null, 8, ["name"])], 2), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h3", { class: "font-semibold text-lg text-marian-blue-800 dark:text-stone-200" }, (0, vue_exports.toDisplayString)(tool.title), 1), (0, vue_exports.createVNode)("p", { class: "text-sm text-stone-500 mt-1 line-clamp-2" }, (0, vue_exports.toDisplayString)(tool.desc), 1)])])];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></div></div>`);
		};
	}
});
//#endregion
//#region pages/catechist/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catechist/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var catechist_default = index_vue_vue_type_script_setup_true_lang_default;

export { catechist_default as default };
//# sourceMappingURL=catechist-BqyLZEjt.mjs.map
