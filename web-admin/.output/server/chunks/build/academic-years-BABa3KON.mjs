import { c as useHead$1, a as useToast, v as vue_exports, b as useApiFetch, s as server_renderer_exports, _ as _sfc_main$1, d as _sfc_main$2, $ as $api } from '../virtual/entry.mjs';
import { _ as _sfc_main$8 } from './Select-lIWGJVCH.mjs';
import { _ as _sfc_main$4 } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$6 } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$7 } from './Input-Bk0TlYbs.mjs';
import { _ as _sfc_main$3 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$5 } from './Card-CTTrlgZc.mjs';
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

//#region pages/admin/academic-years.vue
var _sfc_main = {
	__name: "academic-years",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Quản Lý Niên Khóa - GiaoLy Admin" });
		const toast = useToast();
		const { data: years, pending, refresh } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/AcademicYear")), __temp = await __temp, __restore(), __temp);
		const activeYear = (0, vue_exports.computed)(() => years.value?.find((y) => y.isActive));
		const yearOptions = (0, vue_exports.computed)(() => {
			return years.value?.map((y) => ({
				value: y.id,
				label: y.name
			})) ?? [];
		});
		const formatDate = (d) => {
			if (!d) return "---";
			return new Date(d).toLocaleDateString("vi-VN");
		};
		const isCreateOpen = (0, vue_exports.ref)(false);
		const isSubmitting = (0, vue_exports.ref)(false);
		const yearForm = (0, vue_exports.reactive)({
			name: "",
			startDate: "",
			endDate: "",
			isActive: false
		});
		const createYear = async () => {
			isSubmitting.value = true;
			try {
				await $api("/AcademicYear", {
					method: "POST",
					body: { ...yearForm }
				});
				isCreateOpen.value = false;
				Object.assign(yearForm, {
					name: "",
					startDate: "",
					endDate: "",
					isActive: false
				});
				await refresh();
				toast.add({
					title: "Đã tạo niên khóa mới!",
					color: "success"
				});
			} catch {
				toast.add({
					title: "Lỗi khởi tạo",
					color: "error"
				});
			} finally {
				isSubmitting.value = false;
			}
		};
		const activating = (0, vue_exports.ref)(null);
		const activateYear = async (id) => {
			activating.value = id;
			try {
				await $api("/AcademicYear/activate-new-year", {
					method: "POST",
					body: id
				});
				await refresh();
				toast.add({
					title: "Đã chuyển đổi niên khóa hoạt động!",
					color: "success"
				});
			} catch {
				toast.add({
					title: "Lỗi kích hoạt",
					color: "error"
				});
			} finally {
				activating.value = null;
			}
		};
		const isPromoteOpen = (0, vue_exports.ref)(false);
		const isPromoting = (0, vue_exports.ref)(false);
		const promoteForm = (0, vue_exports.reactive)({
			sourceYearId: "",
			targetYearId: ""
		});
		const openPromoteModal = () => {
			promoteForm.sourceYearId = "";
			promoteForm.targetYearId = activeYear.value?.id || "";
			isPromoteOpen.value = true;
		};
		const executePromotion = async () => {
			if (!promoteForm.sourceYearId || !promoteForm.targetYearId) return toast.add({
				title: "Thiếu thông tin",
				description: "Vui lòng chọn đủ 2 niên khóa.",
				color: "error"
			});
			isPromoting.value = true;
			try {
				const res = await $api("/Enrollment/promote", {
					method: "POST",
					body: promoteForm
				});
				isPromoteOpen.value = false;
				toast.add({
					title: "Thăng lớp thành công!",
					description: `Đã tạo Bản Nháp (Draft) cho ${res.count} đoàn sinh.`,
					color: "success"
				});
			} catch (err) {
				toast.add({
					title: "Lỗi thăng lớp",
					description: err.data?.message || err.message,
					color: "error"
				});
			} finally {
				isPromoting.value = false;
			}
		};
		const isCloneOpen = (0, vue_exports.ref)(false);
		const isCloning = (0, vue_exports.ref)(false);
		const cloneForm = (0, vue_exports.reactive)({
			oldYearId: "",
			newYearId: ""
		});
		const openCloneModal = () => {
			cloneForm.oldYearId = "";
			cloneForm.newYearId = activeYear.value?.id || "";
			isCloneOpen.value = true;
		};
		const executeClone = async () => {
			if (!cloneForm.oldYearId || !cloneForm.newYearId) return toast.add({
				title: "Thiếu thông tin",
				description: "Vui lòng chọn đủ 2 niên khóa.",
				color: "error"
			});
			isCloning.value = true;
			try {
				const res = await $api("/AcademicYear/clone", {
					method: "POST",
					body: cloneForm
				});
				isCloneOpen.value = false;
				toast.add({
					title: "Sao chép thành công!",
					description: res.message || "Cấu trúc lớp đã được sao chép.",
					color: "success"
				});
			} catch (err) {
				toast.add({
					title: "Lỗi sao chép",
					description: err.data?.message || err.message,
					color: "error"
				});
			} finally {
				isCloning.value = false;
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_UBadge = _sfc_main$3;
			const _component_UModal = _sfc_main$4;
			const _component_UCard = _sfc_main$5;
			const _component_UFormField = _sfc_main$6;
			const _component_UInput = _sfc_main$7;
			const _component_UToggle = (0, vue_exports.resolveComponent)("UToggle");
			const _component_USelect = _sfc_main$8;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen font-sans relative pb-24 overflow-hidden" }, _attrs))}><div class="fixed inset-0 pointer-events-none z-0"><div class="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-fuchsia-200 dark:bg-fuchsia-900"></div><div class="absolute -bottom-32 left-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-emerald-200 dark:bg-emerald-900"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div><div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto"><div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"><div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-fuchsia-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div><div class="z-10 text-center md:text-left"><div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-300 text-xs font-black uppercase tracking-widest border border-fuchsia-200 dark:border-fuchsia-800 shadow-inner">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-calendar-days",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`<span>Phân Hệ Học Vụ</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight"> Quản Lý <span class="text-fuchsia-500">Niên Khóa</span></h1><p class="text-stone-500 text-sm mt-2 max-w-lg"> Thiết lập năm học, lên lớp tự động và sao chép cấu trúc dữ liệu qua các năm. </p></div><div class="flex flex-wrap items-center justify-center gap-3 z-10">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				icon: "i-heroicons-document-duplicate",
				label: "Sao chép từ năm cũ",
				color: "white",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold",
				onClick: openCloneModal
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				icon: "i-heroicons-sparkles",
				label: "Lên Lớp Tự Động",
				color: "emerald",
				variant: "soft",
				size: "lg",
				class: "rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold",
				onClick: openPromoteModal
			}, null, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				icon: "i-heroicons-plus",
				label: "Tạo Niên Khóa",
				color: "fuchsia",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-lg shadow-fuchsia-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider",
				onClick: ($event) => isCreateOpen.value = true
			}, null, _parent));
			_push(`</div></div>`);
			if ((0, vue_exports.unref)(activeYear)) {
				_push(`<div class="bg-gradient-to-r from-emerald-500 to-teal-400 p-1 rounded-3xl shadow-xl shadow-emerald-500/20 animate-fade-in-up"><div class="bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center justify-between gap-4"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-check-badge",
					class: "w-7 h-7"
				}, null, _parent));
				_push(`</div><div><p class="text-xs font-bold text-stone-500 uppercase tracking-widest">Niên khóa đang hoạt động</p><h2 class="text-2xl font-black text-stone-800 dark:text-white">${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(activeYear).name)}</h2></div></div><div class="text-right"><p class="text-sm font-bold text-stone-500">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-calendar",
					class: "inline-block mr-1"
				}, null, _parent));
				_push(` ${(0, server_renderer_exports.ssrInterpolate)(formatDate((0, vue_exports.unref)(activeYear).startDate))} — ${(0, server_renderer_exports.ssrInterpolate)(formatDate((0, vue_exports.unref)(activeYear).endDate))}</p></div></div></div>`);
			} else _push(`<!---->`);
			_push(`<div class="flex justify-end">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				icon: "i-heroicons-clipboard-document-check",
				label: "Chuyển đến: Xét Duyệt Bản Nháp Lên Lớp",
				color: "amber",
				variant: "soft",
				size: "lg",
				class: "rounded-2xl font-bold uppercase tracking-wider shadow-sm",
				to: "/admin/draft-actions"
			}, null, _parent));
			_push(`</div>`);
			if (!(0, vue_exports.unref)(pending) && !(0, vue_exports.unref)(years)?.length) {
				_push(`<div class="text-center py-24 text-stone-400 bg-white/40 dark:bg-stone-900/40 rounded-[2rem] border border-white/50 dark:border-stone-800">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-calendar",
					class: "w-16 h-16 mx-auto mb-4 opacity-30"
				}, null, _parent));
				_push(`<p class="text-lg font-bold">Chưa có niên khóa nào. Hãy tạo niên khóa đầu tiên!</p></div>`);
			} else {
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(years), (year) => {
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([year.isActive ? "ring-2 ring-emerald-500 shadow-emerald-500/10" : "hover:border-fuchsia-300 dark:hover:border-fuchsia-700/50 hover:-translate-y-1", "group bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/60 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"])}">`);
					if (year.isActive) _push(`<div class="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-transparent dark:from-emerald-900/10 pointer-events-none"></div>`);
					else _push(`<!---->`);
					_push(`<div class="relative z-10 flex-1"><div class="flex justify-between items-start mb-4"><div class="flex items-center gap-3"><div class="${(0, server_renderer_exports.ssrRenderClass)(["w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner", year.isActive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" : "bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500"])}">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-academic-cap",
						class: "w-5 h-5"
					}, null, _parent));
					_push(`</div><div><h3 class="font-black text-xl text-stone-800 dark:text-white leading-none">${(0, server_renderer_exports.ssrInterpolate)(year.name)}</h3></div></div>`);
					if (year.isActive) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						label: "ACTIVE",
						color: "emerald",
						variant: "soft",
						size: "xs",
						class: "font-black uppercase tracking-widest rounded-lg animate-pulse"
					}, null, _parent));
					else _push(`<!---->`);
					_push(`</div><p class="text-sm font-bold text-stone-500 mb-6 bg-stone-100/50 dark:bg-stone-800/50 p-2 rounded-xl text-center">${(0, server_renderer_exports.ssrInterpolate)(formatDate(year.startDate))} — ${(0, server_renderer_exports.ssrInterpolate)(formatDate(year.endDate))}</p></div><div class="relative z-10 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between gap-2">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						icon: "i-heroicons-squares-2x2",
						color: "neutral",
						variant: "ghost",
						size: "sm",
						class: "rounded-xl flex-1 justify-center bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 font-bold",
						to: `/admin/academic-years/${year.id}`,
						label: "Xem Lớp Học"
					}, null, _parent));
					if (!year.isActive) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						label: "Kích hoạt",
						icon: "i-heroicons-bolt",
						color: "fuchsia",
						variant: "soft",
						size: "sm",
						class: "rounded-xl font-bold uppercase tracking-wider",
						loading: (0, vue_exports.unref)(activating) === year.id,
						onClick: ($event) => activateYear(year.id)
					}, null, _parent));
					else _push(`<!---->`);
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isCreateOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isCreateOpen) ? isCreateOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="bg-fuchsia-600 dark:bg-fuchsia-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-calendar-days",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Tạo Niên Khóa Mới</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isCreateOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-fuchsia-600 dark:bg-fuchsia-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-calendar-days",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Tạo Niên Khóa Mới")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isCreateOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Hủy",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isCreateOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									type: "submit",
									form: "year-form",
									label: "Khởi Tạo",
									color: "fuchsia",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase shadow-lg shadow-fuchsia-500/20",
									loading: (0, vue_exports.unref)(isSubmitting)
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isCreateOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								type: "submit",
								form: "year-form",
								label: "Khởi Tạo",
								color: "fuchsia",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase shadow-lg shadow-fuchsia-500/20",
								loading: (0, vue_exports.unref)(isSubmitting)
							}, null, 8, ["loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<form id="year-form" class="p-6 space-y-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Tên niên khóa",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(yearForm).name,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).name = $event,
											placeholder: "Ví dụ: 2025-2026",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(yearForm).name,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).name = $event,
											placeholder: "Ví dụ: 2025-2026",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngày bắt đầu" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(yearForm).startDate,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).startDate = $event,
											type: "date",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(yearForm).startDate,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).startDate = $event,
											type: "date",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngày kết thúc" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(yearForm).endDate,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).endDate = $event,
											type: "date",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(yearForm).endDate,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).endDate = $event,
											type: "date",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div><div class="flex items-center gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800 mt-2"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UToggle, {
									modelValue: (0, vue_exports.unref)(yearForm).isActive,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).isActive = $event,
									color: "fuchsia"
								}, null, _parent, _scopeId));
								_push(`<span class="text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300"${_scopeId}>Đặt làm niên khóa hoạt động ngay</span></div></form>`);
							} else return [(0, vue_exports.createVNode)("form", {
								id: "year-form",
								class: "p-6 space-y-6",
								onSubmit: (0, vue_exports.withModifiers)(createYear, ["prevent"])
							}, [
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Tên niên khóa",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(yearForm).name,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).name = $event,
										placeholder: "Ví dụ: 2025-2026",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày bắt đầu" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(yearForm).startDate,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).startDate = $event,
										type: "date",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày kết thúc" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(yearForm).endDate,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).endDate = $event,
										type: "date",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})]),
								(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800 mt-2" }, [(0, vue_exports.createVNode)(_component_UToggle, {
									modelValue: (0, vue_exports.unref)(yearForm).isActive,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).isActive = $event,
									color: "fuchsia"
								}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300" }, "Đặt làm niên khóa hoạt động ngay")])
							], 32)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-fuchsia-600 dark:bg-fuchsia-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-calendar-days",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Tạo Niên Khóa Mới")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isCreateOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isCreateOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							type: "submit",
							form: "year-form",
							label: "Khởi Tạo",
							color: "fuchsia",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase shadow-lg shadow-fuchsia-500/20",
							loading: (0, vue_exports.unref)(isSubmitting)
						}, null, 8, ["loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("form", {
							id: "year-form",
							class: "p-6 space-y-6",
							onSubmit: (0, vue_exports.withModifiers)(createYear, ["prevent"])
						}, [
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Tên niên khóa",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(yearForm).name,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).name = $event,
									placeholder: "Ví dụ: 2025-2026",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày bắt đầu" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(yearForm).startDate,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).startDate = $event,
									type: "date",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày kết thúc" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(yearForm).endDate,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).endDate = $event,
									type: "date",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})]),
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 p-4 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-xl border border-fuchsia-100 dark:border-fuchsia-800 mt-2" }, [(0, vue_exports.createVNode)(_component_UToggle, {
								modelValue: (0, vue_exports.unref)(yearForm).isActive,
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(yearForm).isActive = $event,
								color: "fuchsia"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-fuchsia-700 dark:text-fuchsia-300" }, "Đặt làm niên khóa hoạt động ngay")])
						], 32)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isPromoteOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isPromoteOpen) ? isPromoteOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="bg-emerald-600 dark:bg-emerald-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-sparkles",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Lên Lớp Tự Động</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isPromoteOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-emerald-600 dark:bg-emerald-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-sparkles",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Lên Lớp Tự Động")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isPromoteOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Hủy",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isPromoteOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Tiến Hành Thăng Lớp",
									color: "emerald",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase shadow-lg shadow-emerald-500/20",
									loading: (0, vue_exports.unref)(isPromoting),
									onClick: executePromotion
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isPromoteOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Tiến Hành Thăng Lớp",
								color: "emerald",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase shadow-lg shadow-emerald-500/20",
								loading: (0, vue_exports.unref)(isPromoting),
								onClick: executePromotion
							}, null, 8, ["loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="p-6 space-y-6"${_scopeId}><div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-medium"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-information-circle",
									class: "w-6 h-6 shrink-0"
								}, null, _parent, _scopeId));
								_push(`<p${_scopeId}>Hệ thống sẽ quét toàn bộ danh sách lớp học của Niên Khóa Nguồn và tự động thăng hạng học sinh (ví dụ: Ấu 1 -&gt; Ấu 2) sang Niên Khóa Đích. Dữ liệu sẽ lưu ở dạng <b${_scopeId}>Bản Nháp (Draft)</b> để bạn kiểm duyệt trước khi chính thức áp dụng.</p></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Niên Khóa Nguồn (Năm cũ)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(promoteForm).sourceYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).sourceYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa nguồn...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(promoteForm).sourceYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).sourceYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa nguồn...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"options"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Niên Khóa Đích (Năm mới)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(promoteForm).targetYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).targetYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa đích...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(promoteForm).targetYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).targetYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa đích...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"options"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "p-6 space-y-6" }, [
								(0, vue_exports.createVNode)("div", { class: "p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-medium" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-information-circle",
									class: "w-6 h-6 shrink-0"
								}), (0, vue_exports.createVNode)("p", null, [
									(0, vue_exports.createTextVNode)("Hệ thống sẽ quét toàn bộ danh sách lớp học của Niên Khóa Nguồn và tự động thăng hạng học sinh (ví dụ: Ấu 1 -> Ấu 2) sang Niên Khóa Đích. Dữ liệu sẽ lưu ở dạng "),
									(0, vue_exports.createVNode)("b", null, "Bản Nháp (Draft)"),
									(0, vue_exports.createTextVNode)(" để bạn kiểm duyệt trước khi chính thức áp dụng.")
								])]),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Niên Khóa Nguồn (Năm cũ)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
										modelValue: (0, vue_exports.unref)(promoteForm).sourceYearId,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).sourceYearId = $event,
										options: (0, vue_exports.unref)(yearOptions),
										placeholder: "Chọn niên khóa nguồn...",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								}),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Niên Khóa Đích (Năm mới)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
										modelValue: (0, vue_exports.unref)(promoteForm).targetYearId,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).targetYearId = $event,
										options: (0, vue_exports.unref)(yearOptions),
										placeholder: "Chọn niên khóa đích...",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-emerald-600 dark:bg-emerald-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-sparkles",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Lên Lớp Tự Động")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isPromoteOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isPromoteOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: "Tiến Hành Thăng Lớp",
							color: "emerald",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase shadow-lg shadow-emerald-500/20",
							loading: (0, vue_exports.unref)(isPromoting),
							onClick: executePromotion
						}, null, 8, ["loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-6 space-y-6" }, [
							(0, vue_exports.createVNode)("div", { class: "p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm font-medium" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-information-circle",
								class: "w-6 h-6 shrink-0"
							}), (0, vue_exports.createVNode)("p", null, [
								(0, vue_exports.createTextVNode)("Hệ thống sẽ quét toàn bộ danh sách lớp học của Niên Khóa Nguồn và tự động thăng hạng học sinh (ví dụ: Ấu 1 -> Ấu 2) sang Niên Khóa Đích. Dữ liệu sẽ lưu ở dạng "),
								(0, vue_exports.createVNode)("b", null, "Bản Nháp (Draft)"),
								(0, vue_exports.createTextVNode)(" để bạn kiểm duyệt trước khi chính thức áp dụng.")
							])]),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Niên Khóa Nguồn (Năm cũ)",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
									modelValue: (0, vue_exports.unref)(promoteForm).sourceYearId,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).sourceYearId = $event,
									options: (0, vue_exports.unref)(yearOptions),
									placeholder: "Chọn niên khóa nguồn...",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Niên Khóa Đích (Năm mới)",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
									modelValue: (0, vue_exports.unref)(promoteForm).targetYearId,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(promoteForm).targetYearId = $event,
									options: (0, vue_exports.unref)(yearOptions),
									placeholder: "Chọn niên khóa đích...",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							})
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isCloneOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isCloneOpen) ? isCloneOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-document-duplicate",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Sao Chép Dữ Liệu</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isCloneOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-document-duplicate",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Sao Chép Dữ Liệu")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isCloneOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Hủy",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isCloneOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Thực Hiện Sao Chép",
									color: "blue",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase shadow-lg shadow-blue-500/20",
									loading: (0, vue_exports.unref)(isCloning),
									onClick: executeClone
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isCloneOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Thực Hiện Sao Chép",
								color: "blue",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase shadow-lg shadow-blue-500/20",
								loading: (0, vue_exports.unref)(isCloning),
								onClick: executeClone
							}, null, 8, ["loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="p-6 space-y-6"${_scopeId}><div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3 text-blue-700 dark:text-blue-300 text-sm font-medium"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-information-circle",
									class: "w-6 h-6 shrink-0"
								}, null, _parent, _scopeId));
								_push(`<p${_scopeId}>Hệ thống sẽ sao chép cấu trúc Lớp học (Tên lớp, ngành) từ Niên Khóa Cũ sang Niên Khóa Mới. (Không sao chép học sinh, chỉ sao chép cấu trúc &quot;Vỏ&quot;).</p></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Từ Niên Khóa Cũ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(cloneForm).oldYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).oldYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa nguồn...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(cloneForm).oldYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).oldYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa nguồn...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"options"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Đến Niên Khóa Mới",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(cloneForm).newYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).newYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa đích...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(cloneForm).newYearId,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).newYearId = $event,
											options: (0, vue_exports.unref)(yearOptions),
											placeholder: "Chọn niên khóa đích...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"options"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "p-6 space-y-6" }, [
								(0, vue_exports.createVNode)("div", { class: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3 text-blue-700 dark:text-blue-300 text-sm font-medium" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-information-circle",
									class: "w-6 h-6 shrink-0"
								}), (0, vue_exports.createVNode)("p", null, "Hệ thống sẽ sao chép cấu trúc Lớp học (Tên lớp, ngành) từ Niên Khóa Cũ sang Niên Khóa Mới. (Không sao chép học sinh, chỉ sao chép cấu trúc \"Vỏ\").")]),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Từ Niên Khóa Cũ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
										modelValue: (0, vue_exports.unref)(cloneForm).oldYearId,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).oldYearId = $event,
										options: (0, vue_exports.unref)(yearOptions),
										placeholder: "Chọn niên khóa nguồn...",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								}),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Đến Niên Khóa Mới",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
										modelValue: (0, vue_exports.unref)(cloneForm).newYearId,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).newYearId = $event,
										options: (0, vue_exports.unref)(yearOptions),
										placeholder: "Chọn niên khóa đích...",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-document-duplicate",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Sao Chép Dữ Liệu")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isCloneOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isCloneOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: "Thực Hiện Sao Chép",
							color: "blue",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase shadow-lg shadow-blue-500/20",
							loading: (0, vue_exports.unref)(isCloning),
							onClick: executeClone
						}, null, 8, ["loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-6 space-y-6" }, [
							(0, vue_exports.createVNode)("div", { class: "p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-start gap-3 text-blue-700 dark:text-blue-300 text-sm font-medium" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-information-circle",
								class: "w-6 h-6 shrink-0"
							}), (0, vue_exports.createVNode)("p", null, "Hệ thống sẽ sao chép cấu trúc Lớp học (Tên lớp, ngành) từ Niên Khóa Cũ sang Niên Khóa Mới. (Không sao chép học sinh, chỉ sao chép cấu trúc \"Vỏ\").")]),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Từ Niên Khóa Cũ",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
									modelValue: (0, vue_exports.unref)(cloneForm).oldYearId,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).oldYearId = $event,
									options: (0, vue_exports.unref)(yearOptions),
									placeholder: "Chọn niên khóa nguồn...",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Đến Niên Khóa Mới",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
									modelValue: (0, vue_exports.unref)(cloneForm).newYearId,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(cloneForm).newYearId = $event,
									options: (0, vue_exports.unref)(yearOptions),
									placeholder: "Chọn niên khóa đích...",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							})
						])]),
						_: 1
					})];
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/academic-years.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=academic-years-BABa3KON.mjs.map
