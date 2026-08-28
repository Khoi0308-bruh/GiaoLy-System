import { v as vue_exports, c as useHead$1, a as useToast, j as useRuntimeConfig, k as useFetch, s as server_renderer_exports, _ as _sfc_main, d as _sfc_main$2, i as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$3 } from './Select-lIWGJVCH.mjs';
import { _ as _sfc_main$6 } from './Pagination-C_E636aW.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { _ as _sfc_main$1 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$4 } from './Alert-BYliS5FV.mjs';
import { _ as _sfc_main$5 } from './Table-TpQjMDac.mjs';
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
import './utils-SyRrd6Ur.mjs';
import './useId-D2M6x4XU.mjs';
import './useTypeahead-UAu5CRpq.mjs';
import './useFormControl-DR703Aa5.mjs';
import './PopperArrow-akPD5Wa6.mjs';
import './esm-DyCVLeOU.mjs';

//#region pages/admin/news/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ (0, vue_exports.defineComponent)({
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Quan Ly Tin Tuc RSS - GiaoLy Admin" });
		const toast = useToast();
		const apiBase = useRuntimeConfig().public.apiBase;
		const selectedSource = (0, vue_exports.ref)("");
		const currentPage = (0, vue_exports.ref)(1);
		const perPage = (0, vue_exports.ref)(15);
		const syncing = (0, vue_exports.ref)(false);
		const perPageOptions = [
			{
				label: "10 / trang",
				value: 10
			},
			{
				label: "15 / trang",
				value: 15
			},
			{
				label: "25 / trang",
				value: 25
			},
			{
				label: "50 / trang",
				value: 50
			}
		];
		const { data: rawArticles, pending, error, refresh } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useFetch(() => `${apiBase}/api/news/catholic`, {
			default: () => [],
			server: false
		}, "$sf1-NkMQEZ")), __temp = await __temp, __restore(), __temp);
		const sourceOptions = (0, vue_exports.computed)(() => {
			return [{
				label: "Tat Ca Nguon",
				value: ""
			}, ...[...new Set((rawArticles.value ?? []).map((a) => a.source).filter(Boolean))].map((s) => ({
				label: s,
				value: s
			}))];
		});
		const filteredArticles = (0, vue_exports.computed)(() => {
			const list = rawArticles.value ?? [];
			if (!selectedSource.value) return list;
			return list.filter((a) => a.source === selectedSource.value);
		});
		const total = (0, vue_exports.computed)(() => filteredArticles.value.length);
		const rangeStart = (0, vue_exports.computed)(() => total.value === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
		const rangeEnd = (0, vue_exports.computed)(() => Math.min(currentPage.value * perPage.value, total.value));
		const paginatedArticles = (0, vue_exports.computed)(() => {
			const start = (currentPage.value - 1) * perPage.value;
			return filteredArticles.value.slice(start, start + perPage.value);
		});
		(0, vue_exports.watch)([selectedSource, perPage], () => {
			currentPage.value = 1;
		});
		const columns = [
			{
				key: "title",
				label: "Tieu De"
			},
			{
				key: "source",
				label: "Nguon"
			},
			{
				key: "category",
				label: "Danh Muc"
			},
			{
				key: "publishedAt",
				label: "Ngay Dang"
			},
			{
				key: "isActive",
				label: "Trang Thai"
			},
			{
				key: "actions",
				label: ""
			}
		];
		const syncNow = async () => {
			syncing.value = true;
			try {
				await $fetch$2(`${apiBase}/api/news/sync`, { method: "POST" });
				toast.add({
					title: "Dong bo thanh cong",
					description: "Da cap nhat tin tuc moi nhat.",
					color: "success"
				});
				await refresh();
			} catch {
				toast.add({
					title: "Loi dong bo",
					description: "Khong the ket noi toi may chu.",
					color: "error"
				});
			} finally {
				syncing.value = false;
			}
		};
		const toggleActive = async (article) => {
			try {
				await $fetch$2(`${apiBase}/api/news/${article.id}/toggle`, { method: "PATCH" });
				article.isActive = !article.isActive;
				toast.add({
					title: article.isActive ? "Da hien bai viet" : "Da an bai viet",
					color: "success"
				});
			} catch {
				toast.add({
					title: "Loi cap nhat",
					color: "error"
				});
			}
		};
		const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}) : "—";
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main;
			const _component_UBadge = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_USelect = _sfc_main$3;
			const _component_UAlert = _sfc_main$4;
			const _component_UTable = _sfc_main$5;
			const _component_UPagination = _sfc_main$6;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen font-sans relative pb-24 overflow-hidden" }, _attrs))} data-v-210ae6fd><div class="fixed inset-0 pointer-events-none z-0" data-v-210ae6fd><div class="absolute top-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-sky-200 dark:bg-sky-900" data-v-210ae6fd></div><div class="absolute -bottom-32 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-indigo-200 dark:bg-indigo-900" data-v-210ae6fd></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" data-v-210ae6fd></div></div><div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto" data-v-210ae6fd><div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden" data-v-210ae6fd><div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-400/20 to-transparent rounded-full blur-3xl pointer-events-none" data-v-210ae6fd></div><div class="z-10 text-center md:text-left" data-v-210ae6fd><div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 text-xs font-black uppercase tracking-widest border border-sky-200 dark:border-sky-800 shadow-inner" data-v-210ae6fd>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-newspaper",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`<span data-v-210ae6fd>Phan He Noi Dung</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight" data-v-210ae6fd> Quan Ly <span class="text-sky-500" data-v-210ae6fd>Tin Tuc RSS</span></h1><p class="text-stone-500 text-sm mt-2 max-w-lg" data-v-210ae6fd> Theo doi va quan ly cac bai viet tin tuc Cong Giao duoc tong hop tu dong tu cac nguon RSS. </p></div><div class="flex flex-wrap items-center justify-center gap-3 z-10" data-v-210ae6fd>`);
			if ((0, vue_exports.unref)(total) > 0) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
				label: `${(0, vue_exports.unref)(total)} bai viet`,
				color: "sky",
				variant: "soft",
				size: "lg",
				class: "rounded-2xl font-black text-sm px-4"
			}, null, _parent));
			else _push(`<!---->`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Dong bo ngay",
				icon: "i-heroicons-arrow-path",
				color: "sky",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider",
				loading: (0, vue_exports.unref)(syncing),
				onClick: syncNow
			}, null, _parent));
			_push(`</div></div><div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" data-v-210ae6fd><div class="flex items-center gap-2 flex-shrink-0" data-v-210ae6fd>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-funnel",
				class: "w-4 h-4 text-stone-400"
			}, null, _parent));
			_push(`<span class="text-xs font-black text-stone-500 uppercase tracking-widest" data-v-210ae6fd>Loc theo nguon:</span></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
				modelValue: (0, vue_exports.unref)(selectedSource),
				"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedSource) ? selectedSource.value = $event : null,
				options: (0, vue_exports.unref)(sourceOptions),
				"value-attribute": "value",
				"label-attribute": "label",
				placeholder: "Tat ca nguon",
				class: "w-full sm:w-56",
				ui: { base: "rounded-xl" }
			}, null, _parent));
			_push(`<div class="sm:ml-auto flex items-center gap-2" data-v-210ae6fd><span class="text-xs font-bold text-stone-400" data-v-210ae6fd>Hien thi:</span>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
				modelValue: (0, vue_exports.unref)(perPage),
				"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(perPage) ? perPage.value = $event : null,
				options: perPageOptions,
				"value-attribute": "value",
				"label-attribute": "label",
				class: "w-28",
				ui: { base: "rounded-xl" }
			}, null, _parent));
			_push(`</div></div>`);
			if ((0, vue_exports.unref)(pending)) {
				_push(`<div class="flex flex-col items-center justify-center py-24" data-v-210ae6fd>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-arrow-path",
					class: "w-12 h-12 animate-spin text-sky-400 mb-4"
				}, null, _parent));
				_push(`<p class="text-stone-500 font-bold uppercase tracking-widest text-sm" data-v-210ae6fd>Dang tai tin tuc...</p></div>`);
			} else if ((0, vue_exports.unref)(error)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UAlert, {
				color: "error",
				variant: "soft",
				icon: "i-heroicons-exclamation-circle",
				title: "Khong the tai tin tuc",
				description: (0, vue_exports.unref)(error)?.message || "Da xay ra loi khi ket noi API.",
				class: "rounded-2xl"
			}, null, _parent));
			else if (!(0, vue_exports.unref)(paginatedArticles).length) {
				_push(`<div class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm" data-v-210ae6fd>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-newspaper",
					class: "w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4"
				}, null, _parent));
				_push(`<p class="text-stone-500 font-bold text-lg" data-v-210ae6fd>Chua co bai viet nao.</p><p class="text-stone-400 text-sm mt-1" data-v-210ae6fd>Thu dong bo de lay tin tuc moi nhat.</p>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Dong bo ngay",
					icon: "i-heroicons-arrow-path",
					variant: "soft",
					color: "sky",
					class: "mt-4 rounded-xl font-bold",
					onClick: syncNow
				}, null, _parent));
				_push(`</div>`);
			} else {
				_push(`<div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] overflow-hidden" data-v-210ae6fd>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTable, {
					rows: (0, vue_exports.unref)(paginatedArticles),
					columns,
					ui: {
						wrapper: "overflow-x-auto",
						thead: "bg-stone-50/80 dark:bg-stone-800/50",
						th: { base: "text-[10px] font-black text-stone-500 uppercase tracking-widest py-3 px-4 whitespace-nowrap" },
						td: { base: "py-3 px-4 align-middle" },
						tr: { base: "hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors border-b border-stone-100 dark:border-stone-800 last:border-0" }
					}
				}, {
					"title-data": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="max-w-sm" data-v-210ae6fd${_scopeId}>`);
							if (row.url) _push(`<a${(0, server_renderer_exports.ssrRenderAttr)("href", row.url)} target="_blank" rel="noopener" class="font-bold text-stone-800 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2 leading-snug" data-v-210ae6fd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.title)}</a>`);
							else _push(`<p class="font-bold text-stone-800 dark:text-white line-clamp-2 leading-snug" data-v-210ae6fd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.title)}</p>`);
							_push(`</div>`);
						} else return [(0, vue_exports.createVNode)("div", { class: "max-w-sm" }, [row.url ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("a", {
							key: 0,
							href: row.url,
							target: "_blank",
							rel: "noopener",
							class: "font-bold text-stone-800 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors line-clamp-2 leading-snug"
						}, (0, vue_exports.toDisplayString)(row.title), 9, ["href"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
							key: 1,
							class: "font-bold text-stone-800 dark:text-white line-clamp-2 leading-snug"
						}, (0, vue_exports.toDisplayString)(row.title), 1))])];
					}),
					"source-data": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
						if (_push) _push(`<div class="flex items-center gap-2" data-v-210ae6fd${_scopeId}><div class="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" data-v-210ae6fd${_scopeId}></div><span class="text-xs font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap" data-v-210ae6fd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.source || "—")}</span></div>`);
						else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2" }, [(0, vue_exports.createVNode)("div", { class: "w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" }), (0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap" }, (0, vue_exports.toDisplayString)(row.source || "—"), 1)])];
					}),
					"category-data": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
						if (_push) if (row.category) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
							label: row.category,
							color: "indigo",
							variant: "soft",
							size: "xs",
							class: "font-bold uppercase tracking-wide rounded-lg whitespace-nowrap"
						}, null, _parent, _scopeId));
						else _push(`<span class="text-xs text-stone-400" data-v-210ae6fd${_scopeId}>—</span>`);
						else return [row.category ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UBadge, {
							key: 0,
							label: row.category,
							color: "indigo",
							variant: "soft",
							size: "xs",
							class: "font-bold uppercase tracking-wide rounded-lg whitespace-nowrap"
						}, null, 8, ["label"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
							key: 1,
							class: "text-xs text-stone-400"
						}, "—"))];
					}),
					"publishedAt-data": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
						if (_push) _push(`<span class="text-xs font-bold text-stone-500 whitespace-nowrap" data-v-210ae6fd${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(row.publishedAt))}</span>`);
						else return [(0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-500 whitespace-nowrap" }, (0, vue_exports.toDisplayString)(formatDate(row.publishedAt)), 1)];
					}),
					"isActive-data": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
						if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
							label: row.isActive ? "Hien" : "An",
							color: row.isActive ? "success" : "neutral",
							variant: "soft",
							size: "xs",
							class: "font-black uppercase tracking-widest rounded-lg"
						}, null, _parent, _scopeId));
						else return [(0, vue_exports.createVNode)(_component_UBadge, {
							label: row.isActive ? "Hien" : "An",
							color: row.isActive ? "success" : "neutral",
							variant: "soft",
							size: "xs",
							class: "font-black uppercase tracking-widest rounded-lg"
						}, null, 8, ["label", "color"])];
					}),
					"actions-data": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<div class="flex items-center gap-1" data-v-210ae6fd${_scopeId}>`);
							if (row.url) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								icon: "i-heroicons-arrow-top-right-on-square",
								color: "neutral",
								variant: "ghost",
								size: "xs",
								class: "rounded-lg",
								to: row.url,
								target: "_blank"
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								icon: row.isActive ? "i-heroicons-eye-slash" : "i-heroicons-eye",
								color: row.isActive ? "warning" : "success",
								variant: "ghost",
								size: "xs",
								class: "rounded-lg",
								onClick: ($event) => toggleActive(row)
							}, null, _parent, _scopeId));
							_push(`</div>`);
						} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-1" }, [row.url ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UButton, {
							key: 0,
							icon: "i-heroicons-arrow-top-right-on-square",
							color: "neutral",
							variant: "ghost",
							size: "xs",
							class: "rounded-lg",
							to: row.url,
							target: "_blank"
						}, null, 8, ["to"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)(_component_UButton, {
							icon: row.isActive ? "i-heroicons-eye-slash" : "i-heroicons-eye",
							color: row.isActive ? "warning" : "success",
							variant: "ghost",
							size: "xs",
							class: "rounded-lg",
							onClick: ($event) => toggleActive(row)
						}, null, 8, [
							"icon",
							"color",
							"onClick"
						])])];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			}
			if (!(0, vue_exports.unref)(pending) && !(0, vue_exports.unref)(error) && (0, vue_exports.unref)(total) > 0) {
				_push(`<div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl border border-white/60 dark:border-stone-800 rounded-2xl px-6 py-4" data-v-210ae6fd><p class="text-xs font-bold text-stone-500" data-v-210ae6fd> Hien thi <span class="text-sky-600" data-v-210ae6fd>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeStart))}${(0, server_renderer_exports.ssrInterpolate)("–")}${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(rangeEnd))}</span> trong tong so <span class="text-sky-600" data-v-210ae6fd>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(total))}</span> bai viet </p>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UPagination, {
					page: (0, vue_exports.unref)(currentPage),
					"onUpdate:page": ($event) => (0, vue_exports.isRef)(currentPage) ? currentPage.value = $event : null,
					total: (0, vue_exports.unref)(total),
					"items-per-page": (0, vue_exports.unref)(perPage),
					ui: {
						list: "gap-1",
						item: { base: "rounded-xl font-bold" },
						active: "bg-sky-500 text-white shadow-md"
					}
				}, null, _parent));
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region pages/admin/news/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var news_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-210ae6fd"]]);

export { news_default as default };
//# sourceMappingURL=news-C9Sw3pWn.mjs.map
