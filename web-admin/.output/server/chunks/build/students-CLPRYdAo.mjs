import { c as useHead$1, e as useAuthStore, v as vue_exports, b as useApiFetch, s as server_renderer_exports, _ as _sfc_main$2, d as _sfc_main$3 } from '../virtual/entry.mjs';
import { _ as _sfc_main$4 } from './Select-lIWGJVCH.mjs';
import { _ as _sfc_main$7 } from './Tooltip-DVWTuUpa.mjs';
import { _ as _sfc_main$9 } from './Pagination-C_E636aW.mjs';
import { _ as _sfc_main$8 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$5 } from './Card-CTTrlgZc.mjs';
import { _ as _sfc_main$1 } from './Container-C4Y98Up-.mjs';
import { _ as _sfc_main$6 } from './Table-TpQjMDac.mjs';
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

//#region pages/students/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Danh Sách Đoàn Sinh - GiaoLy" });
		const authStore = useAuthStore();
		const page = (0, vue_exports.ref)(1);
		const pageSize = (0, vue_exports.ref)(20);
		const searchQuery = (0, vue_exports.ref)("");
		const filterBranch = (0, vue_exports.ref)(0);
		const filterBaptism = (0, vue_exports.ref)("");
		const filterCommunion = (0, vue_exports.ref)("");
		const { data: pagedData, pending } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/Student/paged", {
			query: (0, vue_exports.computed)(() => ({
				page: page.value,
				pageSize: pageSize.value,
				search: searchQuery.value,
				branch: filterBranch.value,
				hasBaptism: filterBaptism.value !== "" ? filterBaptism.value === "true" : void 0,
				hasCommunion: filterCommunion.value !== "" ? filterCommunion.value === "true" : void 0
			})),
			watch: [
				page,
				pageSize,
				searchQuery,
				filterBranch,
				filterBaptism,
				filterCommunion
			]
		})), __temp = await __temp, __restore(), __temp);
		const columns = [
			{
				accessorKey: "fullName",
				header: "Hồ Sơ Đoàn Sinh"
			},
			{
				accessorKey: "className",
				header: "Phân Lớp"
			},
			{
				accessorKey: "branch",
				header: "Ngành"
			},
			{
				accessorKey: "sacraments",
				header: "Trạng Thái Bí Tích"
			}
		];
		const getBranchName = (b) => ({
			1: "Chiên con",
			2: "Ấu nhi",
			3: "Thiếu nhi",
			4: "Nghĩa sĩ",
			5: "Hiệp sĩ"
		})[b] || "Khác";
		const getBranchColor = (b) => ({
			1: "pink",
			2: "green",
			3: "blue",
			4: "yellow",
			5: "red"
		})[b] || "gray";
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UContainer = _sfc_main$1;
			const _component_UIcon = _sfc_main$2;
			const _component_UButton = _sfc_main$3;
			const _component_USelect = _sfc_main$4;
			const _component_UCard = _sfc_main$5;
			const _component_UTable = _sfc_main$6;
			const _component_UBadge = _sfc_main$8;
			const _component_UTooltip = _sfc_main$7;
			const _component_UPagination = _sfc_main$9;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen bg-stone-50 dark:bg-stone-950 font-sans selection:bg-primary-500/30 relative pb-24" }, _attrs))}><div class="fixed inset-0 overflow-hidden pointer-events-none z-0"><div class="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-400"></div><div class="absolute -bottom-[20%] right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-sky-400"></div><div class="absolute top-[30%] right-[30%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-15 dark:opacity-5 animate-blob animation-delay-4000 bg-amber-400"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UContainer, { class: "relative z-10 pt-12 space-y-8 animate-fade-in-up" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-col md:flex-row md:items-end justify-between gap-4"${_scopeId}><div${_scopeId}><div class="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-user-group",
							class: "w-4 h-4"
						}, null, _parent, _scopeId));
						_push(`<span${_scopeId}>Hồ Sơ Sứ Đoàn</span></div><h1 class="text-4xl md:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight drop-shadow-sm"${_scopeId}> Danh Sách <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400"${_scopeId}>Đoàn Sinh</span></h1><p class="text-stone-500 text-lg mt-2 font-serif italic"${_scopeId}> Hiển thị danh sách đoàn sinh hiện tại (Chế độ xem) </p></div>`);
						if ((0, vue_exports.unref)(authStore).isLoggedIn) {
							_push(`<div class="shrink-0 mb-2"${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								to: "/admin/students",
								label: "Quản lý Dữ liệu",
								icon: "i-heroicons-pencil-square",
								color: "primary",
								variant: "solid",
								size: "lg",
								class: "rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform"
							}, null, _parent, _scopeId));
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div><div class="bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] p-3 shadow-xl shadow-black/5 animate-fade-in-up delay-100"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"${_scopeId}><div class="md:col-span-1 relative"${_scopeId}><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-magnifying-glass",
							class: "w-5 h-5 text-stone-400"
						}, null, _parent, _scopeId));
						_push(`</div><input${(0, server_renderer_exports.ssrRenderAttr)("value", searchQuery.value)} type="text" placeholder="Tên, Tên Thánh..." class="w-full pl-10 pr-4 py-2.5 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-stone-900 dark:text-white placeholder-stone-400 font-medium transition-all"${_scopeId}></div><div class="md:col-span-1"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
							modelValue: filterBranch.value,
							"onUpdate:modelValue": ($event) => filterBranch.value = $event,
							options: [
								{
									label: "Tất cả Ngành",
									value: 0
								},
								{
									label: "Chiên con",
									value: 1
								},
								{
									label: "Ấu nhi",
									value: 2
								},
								{
									label: "Thiếu nhi",
									value: 3
								},
								{
									label: "Nghĩa sĩ",
									value: 4
								},
								{
									label: "Hiệp sĩ",
									value: 5
								}
							],
							"value-attribute": "value",
							"option-attribute": "label",
							size: "lg",
							variant: "none",
							class: "w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
						}, null, _parent, _scopeId));
						_push(`</div><div class="md:col-span-1"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
							modelValue: filterBaptism.value,
							"onUpdate:modelValue": ($event) => filterBaptism.value = $event,
							options: [
								{
									label: "Rửa Tội: Tất cả",
									value: ""
								},
								{
									label: "Đã Rửa Tội",
									value: "true"
								},
								{
									label: "Chưa Rửa Tội",
									value: "false"
								}
							],
							"value-attribute": "value",
							"option-attribute": "label",
							size: "lg",
							variant: "none",
							class: "w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
						}, null, _parent, _scopeId));
						_push(`</div><div class="md:col-span-1"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
							modelValue: filterCommunion.value,
							"onUpdate:modelValue": ($event) => filterCommunion.value = $event,
							options: [
								{
									label: "Rước Lễ: Tất cả",
									value: ""
								},
								{
									label: "Đã Rước Lễ",
									value: "true"
								},
								{
									label: "Chưa Rước Lễ",
									value: "false"
								}
							],
							"value-attribute": "value",
							"option-attribute": "label",
							size: "lg",
							variant: "none",
							class: "w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
						}, null, _parent, _scopeId));
						_push(`</div></div></div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
							class: "bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200",
							ui: { body: {
								padding: "p-0",
								base: "overflow-x-auto"
							} }
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTable, {
										rows: (0, vue_exports.unref)(pagedData)?.items || [],
										columns,
										loading: (0, vue_exports.unref)(pending),
										"empty-state": {
											icon: "i-heroicons-users",
											header: "Không tìm thấy hồ sơ",
											label: "Vui lòng thay đổi bộ lọc hoặc từ khóa."
										},
										ui: {
											th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50" },
											td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4" },
											tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors" }
										}
									}, {
										"fullName-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push(`<div class="block py-1 pl-2"${_scopeId}><p class="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.holyName)}</p><p class="font-black font-serif text-stone-800 dark:text-white text-lg"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.fullName)}</p></div>`);
											else return [(0, vue_exports.createVNode)("div", { class: "block py-1 pl-2" }, [(0, vue_exports.createVNode)("p", { class: "text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5" }, (0, vue_exports.toDisplayString)(row.original.holyName), 1), (0, vue_exports.createVNode)("p", { class: "font-black font-serif text-stone-800 dark:text-white text-lg" }, (0, vue_exports.toDisplayString)(row.original.fullName), 1)])];
										}),
										"className-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="flex items-center gap-2 text-stone-600 dark:text-stone-300"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
													name: "i-heroicons-academic-cap",
													class: "w-4 h-4 text-stone-400"
												}, null, _parent, _scopeId));
												_push(`<span class="font-bold"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.className || "Chưa xếp")}</span></div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-stone-600 dark:text-stone-300" }, [(0, vue_exports.createVNode)(_component_UIcon, {
												name: "i-heroicons-academic-cap",
												class: "w-4 h-4 text-stone-400"
											}), (0, vue_exports.createVNode)("span", { class: "font-bold" }, (0, vue_exports.toDisplayString)(row.original.className || "Chưa xếp"), 1)])];
										}),
										"branch-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
												label: getBranchName(row.original.branch),
												color: getBranchColor(row.original.branch),
												variant: "soft",
												size: "sm",
												class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
											}, null, _parent, _scopeId));
											else return [(0, vue_exports.createVNode)(_component_UBadge, {
												label: getBranchName(row.original.branch),
												color: getBranchColor(row.original.branch),
												variant: "soft",
												size: "sm",
												class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
											}, null, 8, ["label", "color"])];
										}),
										"sacraments-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="flex items-center gap-2"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Rửa Tội" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<div class="${(0, server_renderer_exports.ssrRenderClass)(["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.baptismDate ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"])}"${_scopeId}> R </div>`);
														else return [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.baptismDate ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " R ", 2)];
													}),
													_: 2
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Rước Lễ" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<div class="${(0, server_renderer_exports.ssrRenderClass)(["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.communionDate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"])}"${_scopeId}> L </div>`);
														else return [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.communionDate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " L ", 2)];
													}),
													_: 2
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Thêm Sức" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push(`<div class="${(0, server_renderer_exports.ssrRenderClass)(["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.confirmationDate ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"])}"${_scopeId}> S </div>`);
														else return [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.confirmationDate ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " S ", 2)];
													}),
													_: 2
												}, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2" }, [
												(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rửa Tội" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.baptismDate ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " R ", 2)]),
													_: 2
												}, 1024),
												(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rước Lễ" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.communionDate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " L ", 2)]),
													_: 2
												}, 1024),
												(0, vue_exports.createVNode)(_component_UTooltip, { text: "Thêm Sức" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.confirmationDate ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " S ", 2)]),
													_: 2
												}, 1024)
											])];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(`<div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md"${_scopeId}><span class="text-sm font-bold text-stone-500"${_scopeId}> Tổng cộng: <b class="text-primary-600 dark:text-primary-400 text-lg ml-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(pagedData)?.total || 0)}</b></span>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UPagination, {
										modelValue: page.value,
										"onUpdate:modelValue": ($event) => page.value = $event,
										"page-count": pageSize.value,
										total: (0, vue_exports.unref)(pagedData)?.total || 0
									}, null, _parent, _scopeId));
									_push(`</div>`);
								} else return [(0, vue_exports.createVNode)(_component_UTable, {
									rows: (0, vue_exports.unref)(pagedData)?.items || [],
									columns,
									loading: (0, vue_exports.unref)(pending),
									"empty-state": {
										icon: "i-heroicons-users",
										header: "Không tìm thấy hồ sơ",
										label: "Vui lòng thay đổi bộ lọc hoặc từ khóa."
									},
									ui: {
										th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50" },
										td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4" },
										tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors" }
									}
								}, {
									"fullName-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "block py-1 pl-2" }, [(0, vue_exports.createVNode)("p", { class: "text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5" }, (0, vue_exports.toDisplayString)(row.original.holyName), 1), (0, vue_exports.createVNode)("p", { class: "font-black font-serif text-stone-800 dark:text-white text-lg" }, (0, vue_exports.toDisplayString)(row.original.fullName), 1)])]),
									"className-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-stone-600 dark:text-stone-300" }, [(0, vue_exports.createVNode)(_component_UIcon, {
										name: "i-heroicons-academic-cap",
										class: "w-4 h-4 text-stone-400"
									}), (0, vue_exports.createVNode)("span", { class: "font-bold" }, (0, vue_exports.toDisplayString)(row.original.className || "Chưa xếp"), 1)])]),
									"branch-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
										label: getBranchName(row.original.branch),
										color: getBranchColor(row.original.branch),
										variant: "soft",
										size: "sm",
										class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
									}, null, 8, ["label", "color"])]),
									"sacraments-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2" }, [
										(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rửa Tội" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.baptismDate ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " R ", 2)]),
											_: 2
										}, 1024),
										(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rước Lễ" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.communionDate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " L ", 2)]),
											_: 2
										}, 1024),
										(0, vue_exports.createVNode)(_component_UTooltip, { text: "Thêm Sức" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.confirmationDate ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " S ", 2)]),
											_: 2
										}, 1024)
									])]),
									_: 1
								}, 8, ["rows", "loading"]), (0, vue_exports.createVNode)("div", { class: "flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md" }, [(0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-500" }, [(0, vue_exports.createTextVNode)(" Tổng cộng: "), (0, vue_exports.createVNode)("b", { class: "text-primary-600 dark:text-primary-400 text-lg ml-1" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(pagedData)?.total || 0), 1)]), (0, vue_exports.createVNode)(_component_UPagination, {
									modelValue: page.value,
									"onUpdate:modelValue": ($event) => page.value = $event,
									"page-count": pageSize.value,
									total: (0, vue_exports.unref)(pagedData)?.total || 0
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"page-count",
									"total"
								])])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)("div", { class: "flex flex-col md:flex-row md:items-end justify-between gap-4" }, [(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("div", { class: "inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-user-group",
								class: "w-4 h-4"
							}), (0, vue_exports.createVNode)("span", null, "Hồ Sơ Sứ Đoàn")]),
							(0, vue_exports.createVNode)("h1", { class: "text-4xl md:text-5xl font-black text-stone-900 dark:text-white uppercase tracking-tight leading-tight drop-shadow-sm" }, [(0, vue_exports.createTextVNode)(" Danh Sách "), (0, vue_exports.createVNode)("span", { class: "text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400" }, "Đoàn Sinh")]),
							(0, vue_exports.createVNode)("p", { class: "text-stone-500 text-lg mt-2 font-serif italic" }, " Hiển thị danh sách đoàn sinh hiện tại (Chế độ xem) ")
						]), (0, vue_exports.unref)(authStore).isLoggedIn ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "shrink-0 mb-2"
						}, [(0, vue_exports.createVNode)(_component_UButton, {
							to: "/admin/students",
							label: "Quản lý Dữ liệu",
							icon: "i-heroicons-pencil-square",
							color: "primary",
							variant: "solid",
							size: "lg",
							class: "rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform"
						})])) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.createVNode)("div", { class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] p-3 shadow-xl shadow-black/5 animate-fade-in-up delay-100" }, [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-4 gap-3 items-center" }, [
							(0, vue_exports.createVNode)("div", { class: "md:col-span-1 relative" }, [(0, vue_exports.createVNode)("div", { class: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-magnifying-glass",
								class: "w-5 h-5 text-stone-400"
							})]), (0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
								"onUpdate:modelValue": ($event) => searchQuery.value = $event,
								type: "text",
								placeholder: "Tên, Tên Thánh...",
								class: "w-full pl-10 pr-4 py-2.5 bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-stone-900 dark:text-white placeholder-stone-400 font-medium transition-all"
							}, null, 8, ["onUpdate:modelValue"]), [[vue_exports.vModelText, searchQuery.value]])]),
							(0, vue_exports.createVNode)("div", { class: "md:col-span-1" }, [(0, vue_exports.createVNode)(_component_USelect, {
								modelValue: filterBranch.value,
								"onUpdate:modelValue": ($event) => filterBranch.value = $event,
								options: [
									{
										label: "Tất cả Ngành",
										value: 0
									},
									{
										label: "Chiên con",
										value: 1
									},
									{
										label: "Ấu nhi",
										value: 2
									},
									{
										label: "Thiếu nhi",
										value: 3
									},
									{
										label: "Nghĩa sĩ",
										value: 4
									},
									{
										label: "Hiệp sĩ",
										value: 5
									}
								],
								"value-attribute": "value",
								"option-attribute": "label",
								size: "lg",
								variant: "none",
								class: "w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							(0, vue_exports.createVNode)("div", { class: "md:col-span-1" }, [(0, vue_exports.createVNode)(_component_USelect, {
								modelValue: filterBaptism.value,
								"onUpdate:modelValue": ($event) => filterBaptism.value = $event,
								options: [
									{
										label: "Rửa Tội: Tất cả",
										value: ""
									},
									{
										label: "Đã Rửa Tội",
										value: "true"
									},
									{
										label: "Chưa Rửa Tội",
										value: "false"
									}
								],
								"value-attribute": "value",
								"option-attribute": "label",
								size: "lg",
								variant: "none",
								class: "w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							(0, vue_exports.createVNode)("div", { class: "md:col-span-1" }, [(0, vue_exports.createVNode)(_component_USelect, {
								modelValue: filterCommunion.value,
								"onUpdate:modelValue": ($event) => filterCommunion.value = $event,
								options: [
									{
										label: "Rước Lễ: Tất cả",
										value: ""
									},
									{
										label: "Đã Rước Lễ",
										value: "true"
									},
									{
										label: "Chưa Rước Lễ",
										value: "false"
									}
								],
								"value-attribute": "value",
								"option-attribute": "label",
								size: "lg",
								variant: "none",
								class: "w-full bg-stone-100/50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50 font-medium text-stone-700 dark:text-stone-300"
							}, null, 8, ["modelValue", "onUpdate:modelValue"])])
						])]),
						(0, vue_exports.createVNode)(_component_UCard, {
							class: "bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200",
							ui: { body: {
								padding: "p-0",
								base: "overflow-x-auto"
							} }
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTable, {
								rows: (0, vue_exports.unref)(pagedData)?.items || [],
								columns,
								loading: (0, vue_exports.unref)(pending),
								"empty-state": {
									icon: "i-heroicons-users",
									header: "Không tìm thấy hồ sơ",
									label: "Vui lòng thay đổi bộ lọc hoặc từ khóa."
								},
								ui: {
									th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50" },
									td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4" },
									tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors" }
								}
							}, {
								"fullName-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "block py-1 pl-2" }, [(0, vue_exports.createVNode)("p", { class: "text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5" }, (0, vue_exports.toDisplayString)(row.original.holyName), 1), (0, vue_exports.createVNode)("p", { class: "font-black font-serif text-stone-800 dark:text-white text-lg" }, (0, vue_exports.toDisplayString)(row.original.fullName), 1)])]),
								"className-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-stone-600 dark:text-stone-300" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-academic-cap",
									class: "w-4 h-4 text-stone-400"
								}), (0, vue_exports.createVNode)("span", { class: "font-bold" }, (0, vue_exports.toDisplayString)(row.original.className || "Chưa xếp"), 1)])]),
								"branch-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
									label: getBranchName(row.original.branch),
									color: getBranchColor(row.original.branch),
									variant: "soft",
									size: "sm",
									class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
								}, null, 8, ["label", "color"])]),
								"sacraments-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2" }, [
									(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rửa Tội" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.baptismDate ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-blue-500/20 drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " R ", 2)]),
										_: 2
									}, 1024),
									(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rước Lễ" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.communionDate ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-amber-500/20 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " L ", 2)]),
										_: 2
									}, 1024),
									(0, vue_exports.createVNode)(_component_UTooltip, { text: "Thêm Sức" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: ["w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm transition-all", row.original.confirmationDate ? "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-rose-500/20 drop-shadow-[0_0_4px_rgba(225,29,72,0.5)]" : "bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200/50 dark:border-stone-700"] }, " S ", 2)]),
										_: 2
									}, 1024)
								])]),
								_: 1
							}, 8, ["rows", "loading"]), (0, vue_exports.createVNode)("div", { class: "flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md" }, [(0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-500" }, [(0, vue_exports.createTextVNode)(" Tổng cộng: "), (0, vue_exports.createVNode)("b", { class: "text-primary-600 dark:text-primary-400 text-lg ml-1" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(pagedData)?.total || 0), 1)]), (0, vue_exports.createVNode)(_component_UPagination, {
								modelValue: page.value,
								"onUpdate:modelValue": ($event) => page.value = $event,
								"page-count": pageSize.value,
								total: (0, vue_exports.unref)(pagedData)?.total || 0
							}, null, 8, [
								"modelValue",
								"onUpdate:modelValue",
								"page-count",
								"total"
							])])]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/students/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=students-CLPRYdAo.mjs.map
