import { c as useHead$1, a as useToast, v as vue_exports, s as server_renderer_exports, _ as _sfc_main$1, d as _sfc_main$5, $ as $api } from '../virtual/entry.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-dKLm1tmu.mjs';
import { _ as _sfc_main$6 } from './Tooltip-DVWTuUpa.mjs';
import { _ as _sfc_main$7 } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$2 } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$3 } from './Input-Bk0TlYbs.mjs';
import { _ as _sfc_main$4 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$8 } from './Card-CTTrlgZc.mjs';
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
import './useFilter-BEMR7loY.mjs';
import './useId-D2M6x4XU.mjs';
import './useTypeahead-UAu5CRpq.mjs';
import './useFormControl-DR703Aa5.mjs';
import './PopperArrow-akPD5Wa6.mjs';
import './VisuallyHiddenInput-DjK2EyXI.mjs';
import './utils-Dj6yoN4y.mjs';
import './esm-DyCVLeOU.mjs';

//#region pages/admin/liturgical.vue
var _sfc_main = {
	__name: "liturgical",
	__ssrInlineRender: true,
	setup(__props) {
		useHead$1({ title: "Quản Lý Lịch Phụng Vụ - GiaoLy Admin" });
		const toast = useToast();
		const today = /* @__PURE__ */ new Date();
		const selectedDate = (0, vue_exports.ref)(today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0"));
		const dayData = (0, vue_exports.ref)(null);
		const isModalOpen = (0, vue_exports.ref)(false);
		const saving = (0, vue_exports.ref)(false);
		const form = (0, vue_exports.reactive)({
			title: "",
			color: "White",
			level: "Thường"
		});
		const colorOptions = [
			{
				value: "Green",
				label: "Xanh Lá"
			},
			{
				value: "White",
				label: "Trắng"
			},
			{
				value: "Red",
				label: "Đỏ"
			},
			{
				value: "Purple",
				label: "Tím"
			},
			{
				value: "Rose",
				label: "Hồng"
			},
			{
				value: "Black",
				label: "Đen"
			}
		];
		const levelOptions = [
			{
				value: "Thường",
				label: "Thường"
			},
			{
				value: "Nhớ",
				label: "Lễ Nhớ"
			},
			{
				value: "Kính",
				label: "Lễ Kính"
			},
			{
				value: "Trọng",
				label: "Lễ Trọng"
			}
		];
		const fetchDay = async () => {
			if (!selectedDate.value) return;
			try {
				const data = await $api(`/Liturgical/${selectedDate.value}`);
				dayData.value = data;
			} catch {
				toast.add({
					title: "Lỗi tra cứu",
					color: "error"
				});
			}
		};
		const openOverrideModal = () => {
			form.title = dayData.value.feastName.replace(" (Tùy chỉnh)", "");
			const matchedOpt = colorOptions.find((o) => o.value.toLowerCase() === dayData.value.liturgicalColor.toLowerCase());
			form.color = matchedOpt ? matchedOpt.value : "White";
			form.level = "Thường";
			isModalOpen.value = true;
		};
		const submitOverride = async () => {
			saving.value = true;
			try {
				await $api("/Liturgical/override", {
					method: "POST",
					body: {
						date: selectedDate.value,
						title: form.title,
						color: form.color,
						level: form.level
					}
				});
				toast.add({
					title: "Đã lưu tùy chỉnh",
					color: "success"
				});
				isModalOpen.value = false;
				await fetchDay();
			} catch {
				toast.add({
					title: "Lỗi ghi đè",
					color: "error"
				});
			} finally {
				saving.value = false;
			}
		};
		const deleteOverride = async () => {
			if (!confirm("Bạn có chắc muốn xóa tùy chỉnh và khôi phục Lịch Phụng Vụ gốc tự động?")) return;
			try {
				await $api(`/Liturgical/override/${selectedDate.value}`, { method: "DELETE" });
				toast.add({
					title: "Đã xóa tùy chỉnh, khôi phục gốc",
					color: "success"
				});
				await fetchDay();
			} catch {
				toast.add({
					title: "Lỗi xóa",
					color: "error"
				});
			}
		};
		const getColorText = (color) => {
			const c = color.toLowerCase();
			if (c === "red") return "text-red-600 dark:text-red-400";
			if (c === "purple") return "text-purple-600 dark:text-purple-400";
			if (c === "white") return "text-amber-500 dark:text-amber-400";
			if (c === "rose") return "text-pink-500";
			if (c === "black") return "text-stone-800 dark:text-stone-300";
			return "text-green-600 dark:text-green-400";
		};
		const getColorBg = (color) => {
			const c = color.toLowerCase();
			if (c === "red") return "bg-red-500";
			if (c === "purple") return "bg-purple-500";
			if (c === "white") return "bg-amber-400";
			if (c === "rose") return "bg-pink-500";
			if (c === "black") return "bg-stone-800";
			return "bg-green-500";
		};
		const getColorBorder = (color) => {
			const c = color.toLowerCase();
			if (c === "red") return "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20";
			if (c === "purple") return "border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20";
			if (c === "white") return "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20";
			if (c === "rose") return "border-pink-200 dark:border-pink-900/50 bg-pink-50/50 dark:bg-pink-950/20";
			if (c === "black") return "border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/20";
			return "border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/20";
		};
		const formatDate = (dateStr) => {
			if (!dateStr) return "";
			const parts = dateStr.split("-");
			return `${parts[2]}/${parts[1]}/${parts[0]}`;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_UFormField = _sfc_main$2;
			const _component_UInput = _sfc_main$3;
			const _component_UBadge = _sfc_main$4;
			const _component_UButton = _sfc_main$5;
			const _component_UTooltip = _sfc_main$6;
			const _component_UModal = _sfc_main$7;
			const _component_UCard = _sfc_main$8;
			const _component_USelectMenu = _sfc_main$9;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen font-sans relative pb-24 overflow-hidden" }, _attrs))}><div class="fixed inset-0 pointer-events-none z-0"><div class="absolute -top-32 left-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-rose-200 dark:bg-rose-900"></div><div class="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div><div class="relative z-10 space-y-8 animate-fade-in-up px-4 md:px-8 pt-8 max-w-5xl mx-auto"><div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"><div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rose-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div><div class="z-10 text-center md:text-left"><div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-black uppercase tracking-widest border border-rose-200 dark:border-rose-800 shadow-inner">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-calendar-days",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`<span>Phân Hệ Phụng Vụ</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight"> Quản Lý <span class="text-rose-500">Lịch Phụng Vụ</span></h1><p class="text-stone-500 text-sm mt-2 max-w-lg"> Tra cứu, thiết lập và ghi đè ngày lễ (Override) chuẩn của Giáo phận để áp dụng riêng cho Giáo xứ. </p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-rose-100/30 to-transparent dark:from-rose-900/10 pointer-events-none"></div><h3 class="font-black text-xl text-stone-800 dark:text-white mb-6 flex items-center gap-2 relative z-10">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-magnifying-glass-circle",
				class: "text-rose-500 w-7 h-7"
			}, null, _parent));
			_push(` Tra cứu &amp; Tùy chỉnh (Override)</h3><div class="relative z-10 space-y-6"><div class="p-5 bg-white/70 dark:bg-stone-950/70 backdrop-blur-md rounded-2xl border border-white/50 dark:border-stone-800 shadow-sm">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
				label: "Chọn ngày cần tra cứu",
				required: ""
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: (0, vue_exports.unref)(selectedDate),
						"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedDate) ? selectedDate.value = $event : null,
						type: "date",
						size: "lg",
						ui: { base: "rounded-xl shadow-inner font-bold" },
						onChange: fetchDay
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UInput, {
						modelValue: (0, vue_exports.unref)(selectedDate),
						"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedDate) ? selectedDate.value = $event : null,
						type: "date",
						size: "lg",
						ui: { base: "rounded-xl shadow-inner font-bold" },
						onChange: fetchDay
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
			if ((0, vue_exports.unref)(dayData)) {
				_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([getColorBorder((0, vue_exports.unref)(dayData).liturgicalColor), "p-6 rounded-2xl border-2 shadow-lg relative overflow-hidden transition-all duration-300"])}"><div class="${(0, server_renderer_exports.ssrRenderClass)([getColorBg((0, vue_exports.unref)(dayData).liturgicalColor), "absolute top-0 right-0 px-3 py-1 rounded-bl-xl font-bold text-[10px] uppercase tracking-widest text-white shadow-sm"])}">${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(dayData).liturgicalColorVi)}</div>`);
				if ((0, vue_exports.unref)(dayData).feastName.includes("Tùy chỉnh")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
					label: "ĐÃ GHI ĐÈ",
					color: "amber",
					variant: "solid",
					class: "absolute top-3 right-24 animate-pulse shadow-md font-black uppercase tracking-widest text-[10px]"
				}, null, _parent));
				else _push(`<!---->`);
				_push(`<div class="pr-12"><p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Ngày ${(0, server_renderer_exports.ssrInterpolate)(formatDate((0, vue_exports.unref)(selectedDate)))}</p><h4 class="${(0, server_renderer_exports.ssrRenderClass)([getColorText((0, vue_exports.unref)(dayData).liturgicalColor), "font-black text-2xl leading-tight mb-4"])}">${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(dayData).feastName)}</h4></div><div class="flex gap-2 border-t border-stone-200 dark:border-stone-800 pt-4 mt-2">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Tùy chỉnh ngày này",
					color: "rose",
					variant: "solid",
					icon: "i-heroicons-pencil-square",
					class: "rounded-xl shadow-md font-bold text-xs",
					onClick: openOverrideModal
				}, null, _parent));
				if ((0, vue_exports.unref)(dayData).feastName.includes("Tùy chỉnh")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Khôi phục",
					color: "error",
					variant: "ghost",
					icon: "i-heroicons-arrow-uturn-left",
					class: "rounded-xl font-bold text-xs",
					onClick: deleteOverride
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div></div><div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center items-center text-center"><div class="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white dark:ring-stone-900">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-arrow-up-tray",
				class: "w-10 h-10 text-stone-400"
			}, null, _parent));
			_push(`</div><h3 class="font-black text-xl text-stone-800 dark:text-white mb-3">Nhập Dữ Liệu (Import JSON)</h3><p class="text-stone-500 text-sm mb-6 max-w-xs">Tính năng đang được phát triển để hỗ trợ nhập hàng loạt danh sách các ngày lễ từ file JSON chuẩn của Giáo phận.</p>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Tính năng đang được bảo trì / phát triển" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						label: "Tải lên File JSON",
						icon: "i-heroicons-lock-closed",
						color: "neutral",
						variant: "soft",
						size: "lg",
						class: "rounded-xl font-bold cursor-not-allowed opacity-50",
						disabled: ""
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UButton, {
						label: "Tải lên File JSON",
						icon: "i-heroicons-lock-closed",
						color: "neutral",
						variant: "soft",
						size: "lg",
						class: "rounded-xl font-bold cursor-not-allowed opacity-50",
						disabled: ""
					})];
				}),
				_: 1
			}, _parent));
			_push(`</div></div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isModalOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isModalOpen) ? isModalOpen.value = $event : null,
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
								_push(`<div class="bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-pencil-square",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Tùy Chỉnh Ngày Lễ</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isModalOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-pencil-square",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Tùy Chỉnh Ngày Lễ")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isModalOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Hủy Bỏ",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isModalOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Lưu Tùy Chỉnh",
									color: "rose",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20",
									loading: (0, vue_exports.unref)(saving),
									onClick: submitOverride
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy Bỏ",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isModalOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Lưu Tùy Chỉnh",
								color: "rose",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20",
								loading: (0, vue_exports.unref)(saving),
								onClick: submitOverride
							}, null, 8, ["loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<form class="p-8 space-y-6"${_scopeId}><div class="text-center pb-4 border-b border-stone-200 dark:border-stone-800"${_scopeId}><p class="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1"${_scopeId}>Áp dụng cho ngày</p><p class="text-xl font-black text-rose-600 dark:text-rose-400"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate((0, vue_exports.unref)(selectedDate)))}</p></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Tên ngày lễ (Hiển thị)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).title,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
											placeholder: "VD: Lễ Thánh Đaminh, Bổn mạng xứ...",
											required: "",
											size: "lg",
											ui: { base: "rounded-xl shadow-inner font-bold" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).title,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
											placeholder: "VD: Lễ Thánh Đaminh, Bổn mạng xứ...",
											required: "",
											size: "lg",
											ui: { base: "rounded-xl shadow-inner font-bold" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`<div class="grid grid-cols-2 gap-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Màu áo lễ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).color,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).color = $event,
											options: colorOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl shadow-inner font-bold" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).color,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).color = $event,
											options: colorOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl shadow-inner font-bold" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Bậc lễ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).level,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
											options: levelOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl shadow-inner font-bold" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).level,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
											options: levelOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl shadow-inner font-bold" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div></form>`);
							} else return [(0, vue_exports.createVNode)("form", {
								class: "p-8 space-y-6",
								onSubmit: (0, vue_exports.withModifiers)(submitOverride, ["prevent"])
							}, [
								(0, vue_exports.createVNode)("div", { class: "text-center pb-4 border-b border-stone-200 dark:border-stone-800" }, [(0, vue_exports.createVNode)("p", { class: "text-xs font-bold text-stone-500 uppercase tracking-widest mb-1" }, "Áp dụng cho ngày"), (0, vue_exports.createVNode)("p", { class: "text-xl font-black text-rose-600 dark:text-rose-400" }, (0, vue_exports.toDisplayString)(formatDate((0, vue_exports.unref)(selectedDate))), 1)]),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Tên ngày lễ (Hiển thị)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).title,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
										placeholder: "VD: Lễ Thánh Đaminh, Bổn mạng xứ...",
										required: "",
										size: "lg",
										ui: { base: "rounded-xl shadow-inner font-bold" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Màu áo lễ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: (0, vue_exports.unref)(form).color,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).color = $event,
										options: colorOptions,
										"value-attribute": "value",
										"option-attribute": "label",
										class: "w-full",
										ui: { base: "rounded-xl shadow-inner font-bold" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, {
									label: "Bậc lễ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: (0, vue_exports.unref)(form).level,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
										options: levelOptions,
										"value-attribute": "value",
										"option-attribute": "label",
										class: "w-full",
										ui: { base: "rounded-xl shadow-inner font-bold" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})])
							], 32)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-rose-600 dark:bg-rose-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-pencil-square",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Tùy Chỉnh Ngày Lễ")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isModalOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy Bỏ",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isModalOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: "Lưu Tùy Chỉnh",
							color: "rose",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-rose-500/20",
							loading: (0, vue_exports.unref)(saving),
							onClick: submitOverride
						}, null, 8, ["loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("form", {
							class: "p-8 space-y-6",
							onSubmit: (0, vue_exports.withModifiers)(submitOverride, ["prevent"])
						}, [
							(0, vue_exports.createVNode)("div", { class: "text-center pb-4 border-b border-stone-200 dark:border-stone-800" }, [(0, vue_exports.createVNode)("p", { class: "text-xs font-bold text-stone-500 uppercase tracking-widest mb-1" }, "Áp dụng cho ngày"), (0, vue_exports.createVNode)("p", { class: "text-xl font-black text-rose-600 dark:text-rose-400" }, (0, vue_exports.toDisplayString)(formatDate((0, vue_exports.unref)(selectedDate))), 1)]),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Tên ngày lễ (Hiển thị)",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(form).title,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
									placeholder: "VD: Lễ Thánh Đaminh, Bổn mạng xứ...",
									required: "",
									size: "lg",
									ui: { base: "rounded-xl shadow-inner font-bold" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Màu áo lễ",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: (0, vue_exports.unref)(form).color,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).color = $event,
									options: colorOptions,
									"value-attribute": "value",
									"option-attribute": "label",
									class: "w-full",
									ui: { base: "rounded-xl shadow-inner font-bold" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}), (0, vue_exports.createVNode)(_component_UFormField, {
								label: "Bậc lễ",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: (0, vue_exports.unref)(form).level,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
									options: levelOptions,
									"value-attribute": "value",
									"option-attribute": "label",
									class: "w-full",
									ui: { base: "rounded-xl shadow-inner font-bold" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})])
						], 32)]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/liturgical.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=liturgical-C4abGZ9G.mjs.map
