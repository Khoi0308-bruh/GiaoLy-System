import { c as useHead$1, a as useToast, e as useAuthStore, v as vue_exports, b as useApiFetch, s as server_renderer_exports, _ as _sfc_main$2, d as _sfc_main$3, N as NuxtLink, f as _sfc_main$3$1, $ as $api, i as $fetch$2, j as useRuntimeConfig } from '../virtual/entry.mjs';
import { _ as _sfc_main$6 } from './SelectMenu-dKLm1tmu.mjs';
import { _ as _sfc_main$f } from './Select-lIWGJVCH.mjs';
import { _ as _sfc_main$h } from './Checkbox-Cp-D5Mep.mjs';
import { _ as _sfc_main$9 } from './Tooltip-DVWTuUpa.mjs';
import { _ as _sfc_main$c } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$e } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$b } from './Pagination-C_E636aW.mjs';
import { _ as _sfc_main$5 } from './Tabs-IoX_0gzh.mjs';
import { _ as _sfc_main$7 } from './Input-Bk0TlYbs.mjs';
import { _ as _sfc_main$a } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$4 } from './Card-CTTrlgZc.mjs';
import { _ as _sfc_main$i } from './Alert-BYliS5FV.mjs';
import { _ as _sfc_main$g } from './Textarea-Cw0MtPiI.mjs';
import { _ as _sfc_main$8 } from './Table-TpQjMDac.mjs';
import { _ as _sfc_main$d } from './Form-BLI47pA7.mjs';
import { refDebounced } from '@vueuse/core';
import { z } from 'zod';
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
import './useForwardScopeId-eoFSsZ85.mjs';
import './RovingFocusItem-ClXCvEdi.mjs';
import './RovingFocusGroup-CkUp22zh.mjs';

//#region components/ImportWizard.vue
var _sfc_main$1 = {
	__name: "ImportWizard",
	__ssrInlineRender: true,
	props: { onSuccess: Function },
	emits: ["imported"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const toast = useToast();
		useAuthStore();
		const fileInputRef = (0, vue_exports.ref)(null);
		const parsedData = (0, vue_exports.ref)([]);
		const isSaving = (0, vue_exports.ref)(false);
		const currentStep = (0, vue_exports.ref)(1);
		const resetData = () => {
			parsedData.value = [];
			currentStep.value = 1;
			if (fileInputRef.value) fileInputRef.value.value = "";
		};
		const finishImport = () => {
			resetData();
			if (props.onSuccess) props.onSuccess();
			emit("imported");
		};
		const rowSchema = z.object({
			fullName: z.string().min(2, "Thiếu tên"),
			birthDateStr: z.string().optional()
		});
		const validateRow = (row) => {
			row.errors = {};
			try {
				rowSchema.parse(row);
			} catch (err) {
				err.errors.forEach((e) => {
					row.errors[e.path[0]] = e.message;
				});
			}
		};
		const errorCount = (0, vue_exports.computed)(() => parsedData.value.filter((r) => Object.keys(r.errors).length > 0).length);
		const duplicateCount = (0, vue_exports.computed)(() => parsedData.value.filter((r) => r.isDuplicate).length);
		const validCount = (0, vue_exports.computed)(() => parsedData.value.length - errorCount.value);
		const getRowClass = (row) => {
			if (Object.keys(row.errors).length > 0) return "bg-red-50/50 dark:bg-red-900/10";
			if (row.isDuplicate) return "bg-amber-50/50 dark:bg-amber-900/10";
			return "";
		};
		const saveData = async () => {
			if (errorCount.value > 0) return toast.add({
				title: "Vui lòng sửa các dòng lỗi trước khi lưu",
				color: "amber"
			});
			isSaving.value = true;
			try {
				await $api("/Student/bulk", {
					method: "POST",
					body: parsedData.value.map((r) => ({
						id: r.existingId || void 0,
						holyName: r.holyName,
						fullName: r.fullName,
						birthDate: r.birthDateStr || null,
						branch: r.branch,
						className: r.className,
						parentPhone: r.parentPhone,
						bloodType: r.bloodType,
						allergies: r.allergies,
						baptismDate: r.baptismDateStr || null,
						communionDate: r.communionDateStr || null,
						confirmationDate: r.confirmationDateStr || null
					}))
				});
				toast.add({
					title: "Đã lưu danh sách thành công!",
					color: "success"
				});
				currentStep.value = 3;
			} catch (err) {
				toast.add({
					title: "Lỗi lưu dữ liệu",
					description: err.data?.message || err.message,
					color: "error"
				});
			} finally {
				isSaving.value = false;
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$2;
			const _component_UButton = _sfc_main$3;
			const _component_UInput = _sfc_main$7;
			const _component_USelect = _sfc_main$f;
			const _component_UBadge = _sfc_main$a;
			const _component_UAlert = _sfc_main$i;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "space-y-6" }, _attrs))}><div class="flex items-center justify-between relative max-w-lg mx-auto mb-8 mt-2"><div class="absolute left-0 top-5 -translate-y-1/2 w-full h-1 bg-stone-200 dark:bg-stone-800 -z-10 rounded-full"></div><div class="absolute left-0 top-5 -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-500" style="${(0, server_renderer_exports.ssrRenderStyle)(`width: ${(currentStep.value - 1) * 50}%`)}"></div><div class="flex flex-col items-center gap-2"><div class="${(0, server_renderer_exports.ssrRenderClass)([currentStep.value >= 1 ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110" : "bg-stone-100 dark:bg-stone-800 text-stone-400", "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500"])}"> 1 </div><span class="${(0, server_renderer_exports.ssrRenderClass)([currentStep.value >= 1 ? "text-primary-600 dark:text-primary-400" : "text-stone-400", "text-xs font-bold"])}">Tải Lên</span></div><div class="flex flex-col items-center gap-2"><div class="${(0, server_renderer_exports.ssrRenderClass)([currentStep.value >= 2 ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110" : "bg-stone-100 dark:bg-stone-800 text-stone-400", "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500"])}"> 2 </div><span class="${(0, server_renderer_exports.ssrRenderClass)([currentStep.value >= 2 ? "text-primary-600 dark:text-primary-400" : "text-stone-400", "text-xs font-bold"])}">Xác Thực</span></div><div class="flex flex-col items-center gap-2"><div class="${(0, server_renderer_exports.ssrRenderClass)([currentStep.value >= 3 ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110" : "bg-stone-100 dark:bg-stone-800 text-stone-400", "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500"])}"> 3 </div><span class="${(0, server_renderer_exports.ssrRenderClass)([currentStep.value >= 3 ? "text-primary-600 dark:text-primary-400" : "text-stone-400", "text-xs font-bold"])}">Đồng Bộ</span></div></div>`);
			if (currentStep.value === 1) {
				_push(`<div class="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-12 text-center transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer animate-fade-in-up"><input type="file" accept=".xlsx, .xls, .docx" class="hidden"><div class="w-20 h-20 mx-auto mb-4 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-cloud-arrow-up",
					class: "w-10 h-10 text-primary-500"
				}, null, _parent));
				_push(`</div><h3 class="font-bold text-xl text-stone-800 dark:text-stone-200">Kéo thả file hoặc Click để tải lên</h3><p class="text-sm text-stone-500 mt-2">Hỗ trợ định dạng: Excel (.xlsx, .xls) hoặc Word (.docx)</p><div class="mt-8 flex justify-center">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					color: "primary",
					variant: "soft",
					icon: "i-heroicons-document-arrow-down",
					label: "Tải File Excel Mẫu",
					to: "/api/Student/export-template",
					external: "",
					target: "_blank"
				}, null, _parent));
				_push(`</div></div>`);
			} else if (currentStep.value === 2) {
				_push(`<div class="space-y-4 animate-fade-in-up"><div class="flex items-center justify-between bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800"><div><h3 class="font-bold text-lg text-stone-800 dark:text-white">Kiểm tra dữ liệu</h3><p class="text-sm text-stone-500 mt-1"> Tổng cộng: <span class="font-bold text-primary-600">${(0, server_renderer_exports.ssrInterpolate)(parsedData.value.length)}</span> dòng. Hợp lệ: <span class="font-bold text-emerald-600">${(0, server_renderer_exports.ssrInterpolate)(validCount.value)}</span> | Trùng lặp: <span class="font-bold text-amber-600">${(0, server_renderer_exports.ssrInterpolate)(duplicateCount.value)}</span> | Lỗi: <span class="font-bold text-red-600">${(0, server_renderer_exports.ssrInterpolate)(errorCount.value)}</span></p></div><div class="flex gap-3">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Hủy & Tải Lại",
					color: "neutral",
					variant: "soft",
					icon: "i-heroicons-arrow-path",
					onClick: resetData
				}, null, _parent));
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Tiến Hành Đồng Bộ",
					color: "primary",
					icon: "i-heroicons-arrow-right",
					disabled: errorCount.value > 0,
					loading: isSaving.value,
					onClick: saveData
				}, null, _parent));
				_push(`</div></div><div class="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden bg-white dark:bg-stone-900 shadow-sm"><div class="overflow-x-auto max-h-[50vh]"><table class="w-full text-sm text-left"><thead class="text-xs text-stone-500 uppercase bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm"><tr><th class="px-4 py-4 font-black">STT</th><th class="px-4 py-4 font-black">Tên Thánh</th><th class="px-4 py-4 font-black min-w-[180px]">Họ và Tên *</th><th class="px-4 py-4 font-black min-w-[130px]">Ngày Sinh</th><th class="px-4 py-4 font-black">Ngành</th><th class="px-4 py-4 font-black">Lớp</th><th class="px-4 py-4 font-black">Trạng thái</th></tr></thead><tbody class="divide-y divide-stone-100 dark:divide-stone-800"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)(parsedData.value, (row, idx) => {
					_push(`<tr class="${(0, server_renderer_exports.ssrRenderClass)([getRowClass(row), "hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"])}"><td class="px-4 py-3 font-medium text-stone-500">${(0, server_renderer_exports.ssrInterpolate)(idx + 1)}</td><td class="px-4 py-3">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: row.holyName,
						"onUpdate:modelValue": ($event) => row.holyName = $event,
						size: "xs",
						variant: "none",
						class: "bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded",
						onBlur: ($event) => validateRow(row)
					}, null, _parent));
					_push(`</td><td class="px-4 py-3 relative">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: row.fullName,
						"onUpdate:modelValue": ($event) => row.fullName = $event,
						size: "xs",
						variant: "none",
						class: ["bg-transparent font-bold focus:bg-white dark:focus:bg-stone-900 rounded", { "text-red-500": row.errors.fullName }],
						onBlur: ($event) => validateRow(row)
					}, null, _parent));
					if (row.errors.fullName) _push(`<div class="text-[10px] text-red-500 absolute bottom-0 left-4 font-bold">${(0, server_renderer_exports.ssrInterpolate)(row.errors.fullName)}</div>`);
					else _push(`<!---->`);
					_push(`</td><td class="px-4 py-3 relative">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: row.birthDateStr,
						"onUpdate:modelValue": ($event) => row.birthDateStr = $event,
						type: "date",
						size: "xs",
						variant: "none",
						class: ["bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded", { "text-red-500": row.errors.birthDate }],
						onBlur: ($event) => validateRow(row)
					}, null, _parent));
					if (row.errors.birthDate) _push(`<div class="text-[10px] text-red-500 absolute bottom-0 left-4 font-bold">${(0, server_renderer_exports.ssrInterpolate)(row.errors.birthDate)}</div>`);
					else _push(`<!---->`);
					_push(`</td><td class="px-4 py-3">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
						modelValue: row.branch,
						"onUpdate:modelValue": ($event) => row.branch = $event,
						options: [
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
						size: "xs",
						variant: "none",
						"value-attribute": "value",
						"option-attribute": "label",
						class: "focus:bg-white dark:focus:bg-stone-900 rounded",
						onChange: ($event) => validateRow(row)
					}, null, _parent));
					_push(`</td><td class="px-4 py-3">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: row.className,
						"onUpdate:modelValue": ($event) => row.className = $event,
						size: "xs",
						variant: "none",
						class: "bg-transparent focus:bg-white dark:focus:bg-stone-900 rounded",
						onBlur: ($event) => validateRow(row)
					}, null, _parent));
					_push(`</td><td class="px-4 py-3">`);
					if (row.isDuplicate) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						color: "amber",
						variant: "subtle",
						size: "xs",
						class: "font-bold"
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Trùng lặp`);
							else return [(0, vue_exports.createTextVNode)("Trùng lặp")];
						}),
						_: 2
					}, _parent));
					else if (Object.keys(row.errors).length > 0) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						color: "red",
						variant: "subtle",
						size: "xs",
						class: "font-bold"
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Lỗi`);
							else return [(0, vue_exports.createTextVNode)("Lỗi")];
						}),
						_: 2
					}, _parent));
					else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						color: "emerald",
						variant: "subtle",
						size: "xs",
						class: "font-bold"
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Hợp lệ`);
							else return [(0, vue_exports.createTextVNode)("Hợp lệ")];
						}),
						_: 2
					}, _parent));
					_push(`</td></tr>`);
				});
				_push(`<!--]--></tbody></table></div></div>`);
				if (duplicateCount.value > 0) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UAlert, {
					title: "Phát hiện hồ sơ trùng lặp",
					icon: "i-heroicons-exclamation-triangle",
					color: "amber",
					variant: "soft",
					description: "Có một số hồ sơ bị trùng tên và ngày sinh với dữ liệu trên hệ thống. Hệ thống sẽ tự động cập nhật đè lên thay vì tạo mới. Bạn có thể tự do sửa đổi trực tiếp ở bảng trên."
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div>`);
			} else if (currentStep.value === 3) {
				_push(`<div class="text-center py-16 space-y-6 animate-fade-in-up"><div class="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-check-circle",
					class: "w-14 h-14 text-emerald-500"
				}, null, _parent));
				_push(`</div><div><h3 class="text-3xl font-black text-stone-800 dark:text-white mb-2">Đồng Bộ Thành Công!</h3><p class="text-stone-500 text-lg">Toàn bộ dữ liệu đoàn sinh đã được lưu vào hệ thống an toàn.</p></div><div class="pt-6">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Hoàn Tất & Đóng",
					color: "primary",
					size: "xl",
					class: "px-10 shadow-lg shadow-primary-500/20",
					onClick: finishImport
				}, null, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImportWizard.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region pages/admin/students.vue
var _sfc_main = {
	__name: "students",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Quản Lý Đoàn Sinh - GiaoLy Admin" });
		const toast = useToast();
		const auth = useAuthStore();
		const activeBranch = (0, vue_exports.ref)(1);
		const activeClass = (0, vue_exports.ref)(null);
		const availableClasses = (0, vue_exports.ref)([]);
		const fetchClasses = async () => {
			try {
				availableClasses.value = await $api(`/Student/classes/${activeBranch.value}`) || [];
			} catch (err) {
				console.error("Lỗi tải danh sách lớp", err);
			}
		};
		(0, vue_exports.watch)(activeBranch, () => {
			activeClass.value = null;
			fetchClasses();
		}, { immediate: true });
		const isGradebookOpen = (0, vue_exports.ref)(false);
		const gradebookData = (0, vue_exports.ref)([]);
		const gradebookPending = (0, vue_exports.ref)(false);
		const isSavingGradebook = (0, vue_exports.ref)(false);
		const openGradebook = async () => {
			if (!activeClass.value || activeClass.value === "UNASSIGNED") return;
			isGradebookOpen.value = true;
			await fetchGradebook();
		};
		const fetchGradebook = async () => {
			gradebookPending.value = true;
			try {
				gradebookData.value = await $api(`/StudentScore/class/${encodeURIComponent(activeClass.value)}`);
			} catch (err) {
				toast.add({
					title: "Lỗi tải bảng điểm",
					description: err.data?.message || err.message,
					color: "error"
				});
			} finally {
				gradebookPending.value = false;
			}
		};
		const saveGradebook = async () => {
			isSavingGradebook.value = true;
			try {
				await $fetch$2(`${useRuntimeConfig().public.apiBase}/StudentScore/save`, {
					method: "POST",
					body: gradebookData.value,
					headers: { Authorization: `Bearer ${auth.token}` }
				});
				toast.add({
					title: "Đã lưu điểm thành công",
					color: "success"
				});
			} catch (err) {
				toast.add({
					title: "Lỗi lưu điểm",
					description: err.data?.message || err.message,
					color: "error"
				});
			} finally {
				isSavingGradebook.value = false;
			}
		};
		const page = (0, vue_exports.ref)(1);
		const pageSize = (0, vue_exports.ref)(20);
		const searchQuery = (0, vue_exports.ref)("");
		const debouncedSearchQuery = refDebounced(searchQuery, 500);
		const filterBaptism = (0, vue_exports.ref)("");
		const filterCommunion = (0, vue_exports.ref)("");
		const filterConfirmation = (0, vue_exports.ref)("");
		const { data: pagedData, pending, refresh } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/Student/paged", {
			query: (0, vue_exports.computed)(() => ({
				page: page.value,
				pageSize: pageSize.value,
				search: debouncedSearchQuery.value,
				branch: activeBranch.value,
				className: activeClass.value === "UNASSIGNED" ? "UNASSIGNED" : activeClass.value,
				hasBaptism: filterBaptism.value !== "" ? filterBaptism.value === "true" : void 0,
				hasCommunion: filterCommunion.value !== "" ? filterCommunion.value === "true" : void 0,
				hasConfirmation: filterConfirmation.value !== "" ? filterConfirmation.value === "true" : void 0
			})),
			watch: [
				page,
				pageSize,
				debouncedSearchQuery,
				activeBranch,
				activeClass,
				filterBaptism,
				filterCommunion,
				filterConfirmation
			]
		})), __temp = await __temp, __restore(), __temp);
		const columns = [
			{
				accessorKey: "fullName",
				header: "Đoàn Sinh"
			},
			{
				accessorKey: "branch",
				header: "Ngành"
			},
			{
				accessorKey: "sacraments",
				header: "Bí Tích"
			},
			{
				accessorKey: "actions",
				header: ""
			}
		];
		const getStudentActions = (student) => [
			[{
				label: "Chi tiết / In Chứng Chỉ",
				icon: "i-heroicons-qr-code",
				click: () => {
					(void 0).location.href = `/admin/students/${student.id}`;
				}
			}],
			[{
				label: "Cấp Bí Tích",
				icon: "i-heroicons-sparkles",
				click: () => openCertModal(student)
			}, {
				label: "Sửa Hồ Sơ",
				icon: "i-heroicons-pencil-square",
				click: () => openEditModal(student)
			}],
			[{
				label: "Xóa Hồ Sơ",
				icon: "i-heroicons-trash",
				color: "red",
				click: () => deleteStudent(student.id)
			}]
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
			2: "success",
			3: "primary",
			4: "warning",
			5: "error"
		})[b] || "neutral";
		const getBranchTailwindColor = (b) => ({
			1: "pink",
			2: "emerald",
			3: "blue",
			4: "amber",
			5: "red"
		})[b] || "stone";
		const getCertName = (t) => ({
			Baptism: "Rửa Tội",
			Communion: "Rước Lễ",
			Confirmation: "Thêm Sức"
		})[t] || t;
		const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "---";
		const toDateInput = (d) => d ? new Date(d).toISOString().split("T")[0] : "";
		const isAddModalOpen = (0, vue_exports.ref)(false);
		const isEditing = (0, vue_exports.ref)(false);
		const isSubmitting = (0, vue_exports.ref)(false);
		const editingId = (0, vue_exports.ref)(null);
		const defaultStudent = () => ({
			holyName: "",
			fullName: "",
			birthDate: "",
			gender: "Nam",
			area: "",
			className: "",
			branch: activeBranch.value,
			isActive: true,
			baptismDate: "",
			baptismPlace: "",
			baptismPriest: "",
			baptismGodparent: "",
			communionDate: "",
			communionPlace: "",
			communionPriest: "",
			confirmationDate: "",
			confirmationPlace: "",
			confirmationBishop: "",
			confirmationGodparent: "",
			fatherHolyName: "",
			fatherName: "",
			fatherJob: "",
			fatherReligion: "",
			motherHolyName: "",
			motherName: "",
			motherJob: "",
			motherReligion: "",
			parentPhone: "",
			address: "",
			marriageStatus: "",
			notes: "",
			bloodType: "",
			allergies: ""
		});
		const studentForm = (0, vue_exports.ref)(defaultStudent());
		const studentSchema = z.object({
			holyName: z.string().max(50).optional().or(z.literal("")),
			fullName: z.string().min(2, "Họ tên quá ngắn").max(100),
			birthDate: z.string().optional().or(z.literal("")),
			gender: z.string().optional().or(z.literal("")),
			area: z.string().max(100).optional().or(z.literal("")),
			className: z.string().max(50).optional().or(z.literal("")),
			branch: z.number(),
			isActive: z.boolean().optional(),
			baptismDate: z.string().optional().or(z.literal("")),
			communionDate: z.string().optional().or(z.literal("")),
			confirmationDate: z.string().optional().or(z.literal("")),
			parentPhone: z.string().optional().or(z.literal(""))
		});
		const openAddModal = () => {
			isEditing.value = false;
			studentForm.value = defaultStudent();
			isAddModalOpen.value = true;
		};
		const openEditModal = (s) => {
			isEditing.value = true;
			editingId.value = s.id;
			studentForm.value = {
				...s,
				birthDate: toDateInput(s.birthDate),
				baptismDate: toDateInput(s.baptismDate),
				communionDate: toDateInput(s.communionDate),
				confirmationDate: toDateInput(s.confirmationDate)
			};
			isAddModalOpen.value = true;
		};
		const profileTabs = [
			{
				label: "Cá nhân",
				slot: "personal"
			},
			{
				label: "Gia đình",
				slot: "family"
			},
			{
				label: "Bí tích",
				slot: "sacraments"
			},
			{
				label: "Y tế",
				slot: "medical"
			},
			{
				label: "Học vụ",
				slot: "academic"
			}
		];
		const submitStudent = async () => {
			isSubmitting.value = true;
			try {
				const payload = { ...studentForm.value };
				if (!payload.baptismDate) payload.baptismDate = null;
				if (!payload.communionDate) payload.communionDate = null;
				if (!payload.confirmationDate) payload.confirmationDate = null;
				if (!payload.birthDate) payload.birthDate = null;
				if (isEditing.value) {
					await $api(`/Student/${editingId.value}`, {
						method: "PUT",
						body: payload
					});
					toast.add({
						title: "Đã cập nhật",
						color: "success"
					});
				} else {
					await $api("/Student", {
						method: "POST",
						body: payload
					});
					toast.add({
						title: "Đã thêm hồ sơ",
						color: "success"
					});
				}
				isAddModalOpen.value = false;
				await refresh();
			} catch (err) {
				toast.add({
					title: "Lỗi",
					description: err.message,
					color: "error"
				});
			}
			isSubmitting.value = false;
		};
		const deleteStudent = async (id) => {
			if (!confirm("Bạn có chắc muốn xóa đoàn sinh này? Dữ liệu không thể phục hồi.")) return;
			try {
				await $api(`/Student/${id}`, { method: "DELETE" });
				toast.add({
					title: "Đã xóa hồ sơ",
					color: "success"
				});
				await refresh();
			} catch {
				toast.add({
					title: "Lỗi xóa",
					color: "error"
				});
			}
		};
		const isAssignModalOpen = (0, vue_exports.ref)(false);
		const assignForm = (0, vue_exports.ref)({
			numClasses: 3,
			method: "Random"
		});
		const openAssignWizard = () => isAssignModalOpen.value = true;
		const submitAssignClasses = async () => {
			if (!pagedData.value?.items?.length) return toast.add({
				title: "Không có đoàn sinh để xếp lớp",
				color: "error"
			});
			try {
				const studentIds = pagedData.value.items.map((s) => s.id);
				const branchPrefix = getBranchName(activeBranch.value).split(" ")[0];
				await $api("/Student/assign-classes", {
					method: "POST",
					body: {
						studentIds,
						numberOfClasses: assignForm.value.numClasses,
						branchPrefix,
						method: assignForm.value.method
					}
				});
				toast.add({
					title: "Đã xếp lớp thành công",
					color: "success"
				});
				isAssignModalOpen.value = false;
				activeClass.value = null;
				await fetchClasses();
				await refresh();
			} catch (err) {
				toast.add({
					title: "Lỗi xếp lớp",
					description: err.message,
					color: "error"
				});
			}
		};
		const isCertModalOpen = (0, vue_exports.ref)(false);
		const selectedStudent = (0, vue_exports.ref)(null);
		const certificates = (0, vue_exports.ref)([]);
		const certForm = (0, vue_exports.ref)({
			certificateType: "Baptism",
			celebrant: "",
			godparent: "",
			signedBy: "Cha Chánh Xứ"
		});
		const loadCerts = async (id) => {
			try {
				certificates.value = await $api(`/Certificate/student/${id}`) || [];
			} catch {
				certificates.value = [];
			}
		};
		const openCertModal = async (student) => {
			selectedStudent.value = student;
			certForm.value = {
				certificateType: "Baptism",
				celebrant: "",
				godparent: "",
				signedBy: "Cha Chánh Xứ"
			};
			await loadCerts(student.id);
			isCertModalOpen.value = true;
		};
		const issueCert = async () => {
			try {
				await $api("/Certificate/issue", {
					method: "POST",
					body: {
						studentId: selectedStudent.value.id,
						...certForm.value
					}
				});
				toast.add({
					title: "Đã cấp chứng chỉ",
					color: "success"
				});
				await loadCerts(selectedStudent.value.id);
			} catch (err) {
				toast.add({
					title: "Lỗi",
					description: err.data?.message || err.message,
					color: "error"
				});
			}
		};
		const revokeCert = async (id) => {
			if (!confirm("Thu hồi chứng chỉ này?")) return;
			try {
				await $api(`/Certificate/${id}`, { method: "DELETE" });
				toast.add({
					title: "Đã thu hồi",
					color: "success"
				});
				await loadCerts(selectedStudent.value.id);
			} catch {
				toast.add({
					title: "Lỗi",
					color: "error"
				});
			}
		};
		const isImportOpen = (0, vue_exports.ref)(false);
		const exportExcel = async () => {
			try {
				const params = new URLSearchParams();
				if (activeBranch.value > 0) params.append("branch", activeBranch.value);
				if (filterBaptism.value !== "") params.append("hasBaptism", filterBaptism.value === "true");
				if (filterCommunion.value !== "") params.append("hasCommunion", filterCommunion.value === "true");
				if (filterConfirmation.value !== "") params.append("hasConfirmation", filterConfirmation.value === "true");
				const res = await $fetch$2(`${useRuntimeConfig().public.apiBase}/Student/export-excel?${params.toString()}`, {
					method: "GET",
					headers: { Authorization: `Bearer ${auth.token}` },
					responseType: "blob"
				});
				const url = (void 0).URL.createObjectURL(new Blob([res]));
				const link = (void 0).createElement("a");
				link.href = url;
				link.setAttribute("download", `DanhSachDoanSinh_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.xlsx`);
				(void 0).body.appendChild(link);
				link.click();
				link.remove();
			} catch (err) {
				toast.add({
					title: "Lỗi xuất Excel",
					description: err.message,
					color: "error"
				});
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$2;
			const _component_UButton = _sfc_main$3;
			const _component_UCard = _sfc_main$4;
			const _component_UTabs = _sfc_main$5;
			const _component_USelectMenu = _sfc_main$6;
			const _component_UInput = _sfc_main$7;
			const _component_UTable = _sfc_main$8;
			const _component_NuxtLink = NuxtLink;
			const _component_UAvatar = _sfc_main$3$1;
			const _component_UBadge = _sfc_main$a;
			const _component_UTooltip = _sfc_main$9;
			const _component_UDropdown = (0, vue_exports.resolveComponent)("UDropdown");
			const _component_UPagination = _sfc_main$b;
			const _component_UModal = _sfc_main$c;
			const _component_UForm = _sfc_main$d;
			const _component_UFormField = _sfc_main$e;
			const _component_USelect = _sfc_main$f;
			const _component_UToggle = (0, vue_exports.resolveComponent)("UToggle");
			const _component_UCheckbox = _sfc_main$h;
			const _component_UTextarea = _sfc_main$g;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen font-sans relative pb-24 overflow-hidden" }, _attrs))}><div class="fixed inset-0 pointer-events-none z-0"><div class="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 animate-blob bg-primary-200 dark:bg-primary-900"></div><div class="absolute -bottom-32 -left-32 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-blue-200 dark:bg-blue-900"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div><div class="relative z-10 space-y-6 animate-fade-in-up"><div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"><div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div><div class="z-10 text-center md:text-left"><div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 text-xs font-black uppercase tracking-widest border border-primary-200 dark:border-primary-800 shadow-inner">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-academic-cap",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`<span>Phân Hệ Học Vụ</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight"> Quản Lý <span class="text-primary-500">Đoàn Sinh</span></h1><p class="text-stone-500 text-sm mt-2 max-w-lg"> Trung tâm lưu trữ hồ sơ, cấp chứng chỉ bí tích, xếp lớp và quản lý bảng điểm toàn diện. </p></div><div class="flex flex-wrap items-center justify-center gap-3 z-10">`);
			if ((0, vue_exports.unref)(auth)?.hasPermission("students.export")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Xuất Excel",
				icon: "i-heroicons-arrow-down-tray",
				color: "white",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform",
				onClick: exportExcel
			}, null, _parent));
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(auth)?.hasPermission("students.manage")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Nạp Excel",
				icon: "i-heroicons-cloud-arrow-up",
				color: "primary",
				variant: "soft",
				size: "lg",
				class: "rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform",
				onClick: ($event) => isImportOpen.value = true
			}, null, _parent));
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(auth)?.hasPermission("students.manage")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Thêm Mới",
				icon: "i-heroicons-plus",
				color: "primary",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-lg hover:-translate-y-0.5 transition-transform font-bold",
				onClick: openAddModal
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
				class: "bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/50 dark:border-stone-800 rounded-3xl shadow-lg shadow-black/5",
				ui: { body: { padding: "p-2" } }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTabs, {
						"model-value": (0, vue_exports.unref)(activeBranch) - 1,
						items: [
							{
								label: "Chiên Con",
								value: 1,
								icon: "i-heroicons-heart"
							},
							{
								label: "Ấu Nhi",
								value: 2,
								icon: "i-heroicons-face-smile"
							},
							{
								label: "Thiếu Nhi",
								value: 3,
								icon: "i-heroicons-academic-cap"
							},
							{
								label: "Nghĩa Sĩ",
								value: 4,
								icon: "i-heroicons-fire"
							},
							{
								label: "Hiệp Sĩ",
								value: 5,
								icon: "i-heroicons-shield-check"
							}
						],
						ui: { list: {
							rounded: "rounded-2xl",
							background: "bg-transparent"
						} },
						class: "w-full",
						"onUpdate:modelValue": (index) => {
							activeBranch.value = index + 1;
						}
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UTabs, {
						"model-value": (0, vue_exports.unref)(activeBranch) - 1,
						items: [
							{
								label: "Chiên Con",
								value: 1,
								icon: "i-heroicons-heart"
							},
							{
								label: "Ấu Nhi",
								value: 2,
								icon: "i-heroicons-face-smile"
							},
							{
								label: "Thiếu Nhi",
								value: 3,
								icon: "i-heroicons-academic-cap"
							},
							{
								label: "Nghĩa Sĩ",
								value: 4,
								icon: "i-heroicons-fire"
							},
							{
								label: "Hiệp Sĩ",
								value: 5,
								icon: "i-heroicons-shield-check"
							}
						],
						ui: { list: {
							rounded: "rounded-2xl",
							background: "bg-transparent"
						} },
						class: "w-full",
						"onUpdate:modelValue": (index) => {
							activeBranch.value = index + 1;
						}
					}, null, 8, ["model-value", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			if (!(0, vue_exports.unref)(activeClass)) {
				_push(`<div class="animate-fade-in-up"><div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6"><div class="group cursor-pointer bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-500 transition-all text-center relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><div class="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-folder-minus",
					class: "w-8 h-8 text-amber-500"
				}, null, _parent));
				_push(`</div><h3 class="font-black text-stone-800 dark:text-white text-lg relative z-10">Chưa xếp lớp</h3><p class="text-xs text-stone-500 mt-1 font-bold tracking-widest uppercase relative z-10">Cần phân bổ</p></div><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(availableClasses), (cls) => {
					_push(`<div class="group cursor-pointer bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary-400 transition-all text-center relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><div class="w-16 h-16 mx-auto bg-stone-100 dark:bg-stone-800/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 shadow-inner">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-folder",
						class: "w-8 h-8 text-stone-400 group-hover:text-primary-500 transition-colors"
					}, null, _parent));
					_push(`</div><h3 class="font-black text-stone-800 dark:text-white text-lg relative z-10">${(0, server_renderer_exports.ssrInterpolate)(cls)}</h3></div>`);
				});
				_push(`<!--]--></div></div>`);
			} else {
				_push(`<div class="animate-fade-in-up space-y-4"><div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border border-white/50 dark:border-stone-800 rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm"><div class="flex items-center gap-3">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					icon: "i-heroicons-arrow-uturn-left",
					color: "neutral",
					variant: "soft",
					class: "rounded-xl shadow-inner hover:bg-stone-200 dark:hover:bg-stone-800",
					onClick: ($event) => activeClass.value = null
				}, null, _parent));
				_push(`<div class="flex items-center gap-2"><span class="text-stone-400 font-bold text-sm">Ngành ${(0, server_renderer_exports.ssrInterpolate)(getBranchName((0, vue_exports.unref)(activeBranch)))}</span>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-chevron-right",
					class: "w-4 h-4 text-stone-400"
				}, null, _parent));
				_push(`<span class="font-black text-primary-600 dark:text-primary-400 text-lg uppercase tracking-wide">${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(activeClass) === "UNASSIGNED" ? "Chưa xếp lớp" : (0, vue_exports.unref)(activeClass))}</span></div></div><div class="flex flex-wrap items-center gap-3">`);
				if ((0, vue_exports.unref)(activeClass) === "UNASSIGNED" && (0, vue_exports.unref)(auth)?.hasPermission("students.manage")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Xếp Lớp Nhanh (Wizard)",
					icon: "i-heroicons-sparkles",
					color: "amber",
					variant: "solid",
					class: "rounded-xl shadow-md font-bold",
					onClick: openAssignWizard
				}, null, _parent));
				else _push(`<!---->`);
				if ((0, vue_exports.unref)(activeClass) !== "UNASSIGNED") _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Bảng Điểm (Gradebook)",
					icon: "i-heroicons-clipboard-document-list",
					color: "primary",
					variant: "soft",
					class: "rounded-xl shadow-inner font-bold",
					onClick: openGradebook
				}, null, _parent));
				else _push(`<!---->`);
				_push(`<div class="hidden lg:flex gap-2 mx-2 pl-4 border-l border-stone-200 dark:border-stone-700">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
					modelValue: (0, vue_exports.unref)(filterBaptism),
					"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(filterBaptism) ? filterBaptism.value = $event : null,
					options: [
						{
							label: "Lọc Rửa Tội",
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
					class: "w-32",
					ui: { base: "rounded-xl shadow-sm" }
				}, null, _parent));
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
					modelValue: (0, vue_exports.unref)(filterCommunion),
					"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(filterCommunion) ? filterCommunion.value = $event : null,
					options: [
						{
							label: "Lọc Rước Lễ",
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
					class: "w-32",
					ui: { base: "rounded-xl shadow-sm" }
				}, null, _parent));
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
					modelValue: (0, vue_exports.unref)(filterConfirmation),
					"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(filterConfirmation) ? filterConfirmation.value = $event : null,
					options: [
						{
							label: "Lọc Thêm Sức",
							value: ""
						},
						{
							label: "Đã Thêm Sức",
							value: "true"
						},
						{
							label: "Chưa Thêm Sức",
							value: "false"
						}
					],
					"value-attribute": "value",
					"option-attribute": "label",
					class: "w-32",
					ui: { base: "rounded-xl shadow-sm" }
				}, null, _parent));
				_push(`</div>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
					modelValue: (0, vue_exports.unref)(searchQuery),
					"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(searchQuery) ? searchQuery.value = $event : null,
					icon: "i-heroicons-magnifying-glass",
					placeholder: "Tên thánh, Họ tên...",
					class: "w-56 lg:w-64",
					ui: { base: "rounded-xl shadow-inner" }
				}, null, _parent));
				_push(`</div></div>`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
					class: "bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden",
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
									header: "Lớp trống hoặc không tìm thấy"
								},
								ui: {
									th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-4 border-b border-white/40 dark:border-stone-800/50" },
									td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-3" },
									tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors group" }
								}
							}, {
								"fullName-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
									if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_NuxtLink, {
										to: `/admin/students/${row.original.id}`,
										class: "flex items-center gap-3 pl-2 group/link cursor-pointer"
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UAvatar, {
													alt: row.original.fullName,
													size: "sm",
													ui: {
														background: `bg-${getBranchTailwindColor(row.original.branch)}-100 dark:bg-${getBranchTailwindColor(row.original.branch)}-900`,
														text: `text-${getBranchTailwindColor(row.original.branch)}-600 dark:text-${getBranchTailwindColor(row.original.branch)}-300 font-bold`
													},
													class: "shadow-sm ring-2 ring-white dark:ring-stone-800 group-hover/link:scale-105 transition-transform"
												}, null, _parent, _scopeId));
												_push(`<div${_scopeId}><p class="font-black text-stone-800 dark:text-white text-sm leading-none mb-1 group-hover/link:text-primary-600 transition-colors"${_scopeId}><span class="text-primary-500 mr-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.holyName)}</span> ${(0, server_renderer_exports.ssrInterpolate)(row.original.fullName)}</p><p class="text-[10px] font-bold text-stone-400 uppercase tracking-widest"${_scopeId}> Sinh: ${(0, server_renderer_exports.ssrInterpolate)(formatDate(row.original.birthDate))}</p></div>`);
											} else return [(0, vue_exports.createVNode)(_component_UAvatar, {
												alt: row.original.fullName,
												size: "sm",
												ui: {
													background: `bg-${getBranchTailwindColor(row.original.branch)}-100 dark:bg-${getBranchTailwindColor(row.original.branch)}-900`,
													text: `text-${getBranchTailwindColor(row.original.branch)}-600 dark:text-${getBranchTailwindColor(row.original.branch)}-300 font-bold`
												},
												class: "shadow-sm ring-2 ring-white dark:ring-stone-800 group-hover/link:scale-105 transition-transform"
											}, null, 8, ["alt", "ui"]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white text-sm leading-none mb-1 group-hover/link:text-primary-600 transition-colors" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 mr-1" }, (0, vue_exports.toDisplayString)(row.original.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(row.original.fullName), 1)]), (0, vue_exports.createVNode)("p", { class: "text-[10px] font-bold text-stone-400 uppercase tracking-widest" }, " Sinh: " + (0, vue_exports.toDisplayString)(formatDate(row.original.birthDate)), 1)])];
										}),
										_: 2
									}, _parent, _scopeId));
									else return [(0, vue_exports.createVNode)(_component_NuxtLink, {
										to: `/admin/students/${row.original.id}`,
										class: "flex items-center gap-3 pl-2 group/link cursor-pointer"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UAvatar, {
											alt: row.original.fullName,
											size: "sm",
											ui: {
												background: `bg-${getBranchTailwindColor(row.original.branch)}-100 dark:bg-${getBranchTailwindColor(row.original.branch)}-900`,
												text: `text-${getBranchTailwindColor(row.original.branch)}-600 dark:text-${getBranchTailwindColor(row.original.branch)}-300 font-bold`
											},
											class: "shadow-sm ring-2 ring-white dark:ring-stone-800 group-hover/link:scale-105 transition-transform"
										}, null, 8, ["alt", "ui"]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white text-sm leading-none mb-1 group-hover/link:text-primary-600 transition-colors" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 mr-1" }, (0, vue_exports.toDisplayString)(row.original.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(row.original.fullName), 1)]), (0, vue_exports.createVNode)("p", { class: "text-[10px] font-bold text-stone-400 uppercase tracking-widest" }, " Sinh: " + (0, vue_exports.toDisplayString)(formatDate(row.original.birthDate)), 1)])]),
										_: 2
									}, 1032, ["to"])];
								}),
								"branch-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
									if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
										color: getBranchColor(row.original.branch),
										variant: "subtle",
										size: "sm",
										class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(getBranchName(row.original.branch))}`);
											else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)];
										}),
										_: 2
									}, _parent, _scopeId));
									else return [(0, vue_exports.createVNode)(_component_UBadge, {
										color: getBranchColor(row.original.branch),
										variant: "subtle",
										size: "sm",
										class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)]),
										_: 2
									}, 1032, ["color"])];
								}),
								"sacraments-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div class="flex gap-2"${_scopeId}>`);
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Rửa Tội" }, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
													name: "i-heroicons-beaker",
													class: row.original.baptismDate ? "text-blue-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
												}, null, _parent, _scopeId));
												else return [(0, vue_exports.createVNode)(_component_UIcon, {
													name: "i-heroicons-beaker",
													class: row.original.baptismDate ? "text-blue-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
												}, null, 8, ["class"])];
											}),
											_: 2
										}, _parent, _scopeId));
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Rước Lễ" }, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
													name: "i-heroicons-cake",
													class: row.original.communionDate ? "text-amber-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
												}, null, _parent, _scopeId));
												else return [(0, vue_exports.createVNode)(_component_UIcon, {
													name: "i-heroicons-cake",
													class: row.original.communionDate ? "text-amber-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
												}, null, 8, ["class"])];
											}),
											_: 2
										}, _parent, _scopeId));
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, { text: "Thêm Sức" }, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
													name: "i-heroicons-fire",
													class: row.original.confirmationDate ? "text-red-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
												}, null, _parent, _scopeId));
												else return [(0, vue_exports.createVNode)(_component_UIcon, {
													name: "i-heroicons-fire",
													class: row.original.confirmationDate ? "text-red-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
												}, null, 8, ["class"])];
											}),
											_: 2
										}, _parent, _scopeId));
										_push(`</div>`);
									} else return [(0, vue_exports.createVNode)("div", { class: "flex gap-2" }, [
										(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rửa Tội" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UIcon, {
												name: "i-heroicons-beaker",
												class: row.original.baptismDate ? "text-blue-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
											}, null, 8, ["class"])]),
											_: 2
										}, 1024),
										(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rước Lễ" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UIcon, {
												name: "i-heroicons-cake",
												class: row.original.communionDate ? "text-amber-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
											}, null, 8, ["class"])]),
											_: 2
										}, 1024),
										(0, vue_exports.createVNode)(_component_UTooltip, { text: "Thêm Sức" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UIcon, {
												name: "i-heroicons-fire",
												class: row.original.confirmationDate ? "text-red-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
											}, null, 8, ["class"])]),
											_: 2
										}, 1024)
									])];
								}),
								"actions-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div class="flex justify-end pr-2"${_scopeId}>`);
										if ((0, vue_exports.unref)(auth)?.hasPermission("students.manage")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UDropdown, {
											items: getStudentActions(row.original),
											popper: { placement: "bottom-end" }
										}, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
													color: "neutral",
													variant: "ghost",
													icon: "i-heroicons-ellipsis-horizontal",
													size: "sm",
													class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm"
												}, null, _parent, _scopeId));
												else return [(0, vue_exports.createVNode)(_component_UButton, {
													color: "neutral",
													variant: "ghost",
													icon: "i-heroicons-ellipsis-horizontal",
													size: "sm",
													class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm"
												})];
											}),
											_: 2
										}, _parent, _scopeId));
										else _push(`<!---->`);
										_push(`</div>`);
									} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end pr-2" }, [(0, vue_exports.unref)(auth)?.hasPermission("students.manage") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UDropdown, {
										key: 0,
										items: getStudentActions(row.original),
										popper: { placement: "bottom-end" }
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UButton, {
											color: "neutral",
											variant: "ghost",
											icon: "i-heroicons-ellipsis-horizontal",
											size: "sm",
											class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm"
										})]),
										_: 1
									}, 8, ["items"])) : (0, vue_exports.createCommentVNode)("", true)])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`<div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30"${_scopeId}><span class="text-xs font-bold text-stone-500"${_scopeId}>Tổng cộng: <b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(pagedData)?.total || 0)}</b> hồ sơ</span>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UPagination, {
								modelValue: (0, vue_exports.unref)(page),
								"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(page) ? page.value = $event : null,
								"page-count": (0, vue_exports.unref)(pageSize),
								total: (0, vue_exports.unref)(pagedData)?.total || 0,
								ui: {
									wrapper: "shadow-inner rounded-xl",
									base: "rounded-lg"
								}
							}, null, _parent, _scopeId));
							_push(`</div>`);
						} else return [(0, vue_exports.createVNode)(_component_UTable, {
							rows: (0, vue_exports.unref)(pagedData)?.items || [],
							columns,
							loading: (0, vue_exports.unref)(pending),
							"empty-state": {
								icon: "i-heroicons-users",
								header: "Lớp trống hoặc không tìm thấy"
							},
							ui: {
								th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-4 border-b border-white/40 dark:border-stone-800/50" },
								td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-3" },
								tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors group" }
							}
						}, {
							"fullName-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_NuxtLink, {
								to: `/admin/students/${row.original.id}`,
								class: "flex items-center gap-3 pl-2 group/link cursor-pointer"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UAvatar, {
									alt: row.original.fullName,
									size: "sm",
									ui: {
										background: `bg-${getBranchTailwindColor(row.original.branch)}-100 dark:bg-${getBranchTailwindColor(row.original.branch)}-900`,
										text: `text-${getBranchTailwindColor(row.original.branch)}-600 dark:text-${getBranchTailwindColor(row.original.branch)}-300 font-bold`
									},
									class: "shadow-sm ring-2 ring-white dark:ring-stone-800 group-hover/link:scale-105 transition-transform"
								}, null, 8, ["alt", "ui"]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white text-sm leading-none mb-1 group-hover/link:text-primary-600 transition-colors" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 mr-1" }, (0, vue_exports.toDisplayString)(row.original.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(row.original.fullName), 1)]), (0, vue_exports.createVNode)("p", { class: "text-[10px] font-bold text-stone-400 uppercase tracking-widest" }, " Sinh: " + (0, vue_exports.toDisplayString)(formatDate(row.original.birthDate)), 1)])]),
								_: 2
							}, 1032, ["to"])]),
							"branch-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
								color: getBranchColor(row.original.branch),
								variant: "subtle",
								size: "sm",
								class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)]),
								_: 2
							}, 1032, ["color"])]),
							"sacraments-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex gap-2" }, [
								(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rửa Tội" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UIcon, {
										name: "i-heroicons-beaker",
										class: row.original.baptismDate ? "text-blue-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
									}, null, 8, ["class"])]),
									_: 2
								}, 1024),
								(0, vue_exports.createVNode)(_component_UTooltip, { text: "Rước Lễ" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UIcon, {
										name: "i-heroicons-cake",
										class: row.original.communionDate ? "text-amber-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
									}, null, 8, ["class"])]),
									_: 2
								}, 1024),
								(0, vue_exports.createVNode)(_component_UTooltip, { text: "Thêm Sức" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UIcon, {
										name: "i-heroicons-fire",
										class: row.original.confirmationDate ? "text-red-500 w-5 h-5 drop-shadow" : "text-stone-300 dark:text-stone-700 w-5 h-5 opacity-50"
									}, null, 8, ["class"])]),
									_: 2
								}, 1024)
							])]),
							"actions-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex justify-end pr-2" }, [(0, vue_exports.unref)(auth)?.hasPermission("students.manage") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UDropdown, {
								key: 0,
								items: getStudentActions(row.original),
								popper: { placement: "bottom-end" }
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UButton, {
									color: "neutral",
									variant: "ghost",
									icon: "i-heroicons-ellipsis-horizontal",
									size: "sm",
									class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 shadow-sm"
								})]),
								_: 1
							}, 8, ["items"])) : (0, vue_exports.createCommentVNode)("", true)])]),
							_: 1
						}, 8, ["rows", "loading"]), (0, vue_exports.createVNode)("div", { class: "flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30" }, [(0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-500" }, [
							(0, vue_exports.createTextVNode)("Tổng cộng: "),
							(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(pagedData)?.total || 0), 1),
							(0, vue_exports.createTextVNode)(" hồ sơ")
						]), (0, vue_exports.createVNode)(_component_UPagination, {
							modelValue: (0, vue_exports.unref)(page),
							"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(page) ? page.value = $event : null,
							"page-count": (0, vue_exports.unref)(pageSize),
							total: (0, vue_exports.unref)(pagedData)?.total || 0,
							ui: {
								wrapper: "shadow-inner rounded-xl",
								base: "rounded-lg"
							}
						}, null, 8, [
							"modelValue",
							"onUpdate:modelValue",
							"page-count",
							"total"
						])])];
					}),
					_: 1
				}, _parent));
				_push(`</div>`);
			}
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isAddModalOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isAddModalOpen) ? isAddModalOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden sm:max-w-4xl" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-user-plus",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(isEditing) ? "Cập Nhật Hồ Sơ Đoàn Sinh" : "Tạo Hồ Sơ Đoàn Sinh Mới")}</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isAddModalOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-user-plus",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(isEditing) ? "Cập Nhật Hồ Sơ Đoàn Sinh" : "Tạo Hồ Sơ Đoàn Sinh Mới"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isAddModalOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Hủy bỏ",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isAddModalOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									type: "submit",
									form: "studentForm",
									label: (0, vue_exports.unref)(isEditing) ? "Lưu Thay Đổi" : "Tạo Hồ Sơ Mới",
									color: "primary",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg",
									loading: (0, vue_exports.unref)(isSubmitting)
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy bỏ",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isAddModalOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								type: "submit",
								form: "studentForm",
								label: (0, vue_exports.unref)(isEditing) ? "Lưu Thay Đổi" : "Tạo Hồ Sơ Mới",
								color: "primary",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider shadow-lg",
								loading: (0, vue_exports.unref)(isSubmitting)
							}, null, 8, ["label", "loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UForm, {
								schema: (0, vue_exports.unref)(studentSchema),
								state: (0, vue_exports.unref)(studentForm),
								id: "studentForm",
								onSubmit: submitStudent,
								class: "p-6"
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTabs, {
										items: profileTabs,
										ui: { list: { rounded: "rounded-2xl bg-stone-100 dark:bg-stone-800" } },
										class: "w-full"
									}, {
										personal: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Tên Thánh",
													name: "holyName"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).holyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).holyName = $event,
															placeholder: "Giuse",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).holyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).holyName = $event,
															placeholder: "Giuse",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Họ và Tên",
													name: "fullName",
													required: ""
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fullName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fullName = $event,
															placeholder: "Nguyễn Văn A",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fullName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fullName = $event,
															placeholder: "Nguyễn Văn A",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Ngày Sinh",
													name: "birthDate"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).birthDate,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).birthDate = $event,
															type: "date",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).birthDate,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).birthDate = $event,
															type: "date",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Giới tính",
													name: "gender"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
															modelValue: (0, vue_exports.unref)(studentForm).gender,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).gender = $event,
															options: ["Nam", "Nữ"],
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_USelect, {
															modelValue: (0, vue_exports.unref)(studentForm).gender,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).gender = $event,
															options: ["Nam", "Nữ"],
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Trạng thái",
													name: "isActive"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) {
															_push(`<div class="flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700"${_scopeId}>`);
															_push((0, server_renderer_exports.ssrRenderComponent)(_component_UToggle, {
																modelValue: (0, vue_exports.unref)(studentForm).isActive,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).isActive = $event,
																color: "emerald"
															}, null, _parent, _scopeId));
															_push(`<span class="text-sm font-bold text-stone-600 dark:text-stone-300"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(studentForm).isActive ? "Đang hoạt động" : "Đã nghỉ học")}</span></div>`);
														} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700" }, [(0, vue_exports.createVNode)(_component_UToggle, {
															modelValue: (0, vue_exports.unref)(studentForm).isActive,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).isActive = $event,
															color: "emerald"
														}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-600 dark:text-stone-300" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(studentForm).isActive ? "Đang hoạt động" : "Đã nghỉ học"), 1)])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Khu/Xóm",
													name: "area"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).area,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).area = $event,
															placeholder: "Khu Mân Côi...",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).area,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).area = $event,
															placeholder: "Khu Mân Côi...",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Tên Thánh",
													name: "holyName"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).holyName,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).holyName = $event,
														placeholder: "Giuse",
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Họ và Tên",
													name: "fullName",
													required: ""
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).fullName,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fullName = $event,
														placeholder: "Nguyễn Văn A",
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Ngày Sinh",
													name: "birthDate"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).birthDate,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).birthDate = $event,
														type: "date",
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Giới tính",
													name: "gender"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
														modelValue: (0, vue_exports.unref)(studentForm).gender,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).gender = $event,
														options: ["Nam", "Nữ"],
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Trạng thái",
													name: "isActive"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700" }, [(0, vue_exports.createVNode)(_component_UToggle, {
														modelValue: (0, vue_exports.unref)(studentForm).isActive,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).isActive = $event,
														color: "emerald"
													}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-600 dark:text-stone-300" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(studentForm).isActive ? "Đang hoạt động" : "Đã nghỉ học"), 1)])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Khu/Xóm",
													name: "area"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).area,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).area = $event,
														placeholder: "Khu Mân Côi...",
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											])];
										}),
										family: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"${_scopeId}><div class="space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10"${_scopeId}><h4 class="font-black text-primary-600 flex items-center gap-2"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, { name: "i-heroicons-user" }, null, _parent, _scopeId));
												_push(` Thông tin Cha</h4><div class="grid grid-cols-2 gap-3"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Tên Thánh",
													name: "fatherHolyName"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherHolyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherHolyName = $event,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherHolyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherHolyName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Họ Tên",
													name: "fatherName"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherName = $event,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Nghề nghiệp",
													name: "fatherJob"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherJob,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherJob = $event,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherJob,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherJob = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div><div class="space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10"${_scopeId}><h4 class="font-black text-pink-600 flex items-center gap-2"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, { name: "i-heroicons-user" }, null, _parent, _scopeId));
												_push(` Thông tin Mẹ</h4><div class="grid grid-cols-2 gap-3"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Tên Thánh",
													name: "motherHolyName"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherHolyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherHolyName = $event,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherHolyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherHolyName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Họ Tên",
													name: "motherName"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherName = $event,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Nghề nghiệp",
													name: "motherJob"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherJob,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherJob = $event,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherJob,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherJob = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Số Điện Thoại Liên Lạc",
													name: "parentPhone",
													class: "md:col-span-2"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).parentPhone,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).parentPhone = $event,
															placeholder: "090...",
															icon: "i-heroicons-phone",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).parentPhone,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).parentPhone = $event,
															placeholder: "090...",
															icon: "i-heroicons-phone",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Địa chỉ nhà",
													name: "address",
													class: "md:col-span-2"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).address,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).address = $event,
															placeholder: "Tổ, Đường, Phường...",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).address,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).address = $event,
															placeholder: "Tổ, Đường, Phường...",
															class: "w-full",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
												(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10" }, [
													(0, vue_exports.createVNode)("h4", { class: "font-black text-primary-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Cha")]),
													(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
														label: "Tên Thánh",
														name: "fatherHolyName"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherHolyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherHolyName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}), (0, vue_exports.createVNode)(_component_UFormField, {
														label: "Họ Tên",
														name: "fatherName"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})]),
													(0, vue_exports.createVNode)(_component_UFormField, {
														label: "Nghề nghiệp",
														name: "fatherJob"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).fatherJob,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherJob = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})
												]),
												(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10" }, [
													(0, vue_exports.createVNode)("h4", { class: "font-black text-pink-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Mẹ")]),
													(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
														label: "Tên Thánh",
														name: "motherHolyName"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherHolyName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherHolyName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}), (0, vue_exports.createVNode)(_component_UFormField, {
														label: "Họ Tên",
														name: "motherName"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherName,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherName = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})]),
													(0, vue_exports.createVNode)(_component_UFormField, {
														label: "Nghề nghiệp",
														name: "motherJob"
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).motherJob,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherJob = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})
												]),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Số Điện Thoại Liên Lạc",
													name: "parentPhone",
													class: "md:col-span-2"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).parentPhone,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).parentPhone = $event,
														placeholder: "090...",
														icon: "i-heroicons-phone",
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Địa chỉ nhà",
													name: "address",
													class: "md:col-span-2"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).address,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).address = $event,
														placeholder: "Tổ, Đường, Phường...",
														class: "w-full",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											])];
										}),
										sacraments: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="space-y-4 mt-6"${_scopeId}><div class="p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCheckbox, {
													"model-value": !!(0, vue_exports.unref)(studentForm).baptismDate,
													"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).baptismDate = val ? (0, vue_exports.unref)(studentForm).baptismDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
													label: "Đã Rửa Tội",
													ui: { label: "font-bold text-blue-700 dark:text-blue-400" }
												}, null, _parent, _scopeId));
												if ((0, vue_exports.unref)(studentForm).baptismDate) {
													_push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"${_scopeId}>`);
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngày nhận" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).baptismDate,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismDate = $event,
																type: "date",
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).baptismDate,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismDate = $event,
																type: "date",
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Nơi nhận" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).baptismPlace,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPlace = $event,
																placeholder: "Giáo xứ...",
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).baptismPlace,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPlace = $event,
																placeholder: "Giáo xứ...",
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Linh mục" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).baptismPriest,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPriest = $event,
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).baptismPriest,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPriest = $event,
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(`</div>`);
												} else _push(`<!---->`);
												_push(`</div><div class="p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCheckbox, {
													"model-value": !!(0, vue_exports.unref)(studentForm).communionDate,
													"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).communionDate = val ? (0, vue_exports.unref)(studentForm).communionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
													label: "Đã Rước Lễ",
													ui: { label: "font-bold text-amber-700 dark:text-amber-400" }
												}, null, _parent, _scopeId));
												if ((0, vue_exports.unref)(studentForm).communionDate) {
													_push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"${_scopeId}>`);
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngày nhận" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).communionDate,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionDate = $event,
																type: "date",
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).communionDate,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionDate = $event,
																type: "date",
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Nơi nhận" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).communionPlace,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPlace = $event,
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).communionPlace,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPlace = $event,
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Linh mục" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).communionPriest,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPriest = $event,
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).communionPriest,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPriest = $event,
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(`</div>`);
												} else _push(`<!---->`);
												_push(`</div><div class="p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCheckbox, {
													"model-value": !!(0, vue_exports.unref)(studentForm).confirmationDate,
													"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).confirmationDate = val ? (0, vue_exports.unref)(studentForm).confirmationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
													label: "Đã Thêm Sức",
													ui: { label: "font-bold text-red-700 dark:text-red-400" }
												}, null, _parent, _scopeId));
												if ((0, vue_exports.unref)(studentForm).confirmationDate) {
													_push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"${_scopeId}>`);
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngày nhận" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).confirmationDate,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationDate = $event,
																type: "date",
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).confirmationDate,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationDate = $event,
																type: "date",
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Nơi nhận" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).confirmationPlace,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationPlace = $event,
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).confirmationPlace,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationPlace = $event,
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Người đỡ đầu" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).confirmationGodparent,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationGodparent = $event,
																ui: { base: "rounded-xl" }
															}, null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_component_UInput, {
																modelValue: (0, vue_exports.unref)(studentForm).confirmationGodparent,
																"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationGodparent = $event,
																ui: { base: "rounded-xl" }
															}, null, 8, ["modelValue", "onUpdate:modelValue"])];
														}),
														_: 1
													}, _parent, _scopeId));
													_push(`</div>`);
												} else _push(`<!---->`);
												_push(`</div></div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "space-y-4 mt-6" }, [
												(0, vue_exports.createVNode)("div", { class: "p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
													"model-value": !!(0, vue_exports.unref)(studentForm).baptismDate,
													"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).baptismDate = val ? (0, vue_exports.unref)(studentForm).baptismDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
													label: "Đã Rửa Tội",
													ui: { label: "font-bold text-blue-700 dark:text-blue-400" }
												}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).baptismDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
													key: 0,
													class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
												}, [
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).baptismDate,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismDate = $event,
															type: "date",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}),
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).baptismPlace,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPlace = $event,
															placeholder: "Giáo xứ...",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}),
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).baptismPriest,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPriest = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})
												])) : (0, vue_exports.createCommentVNode)("", true)]),
												(0, vue_exports.createVNode)("div", { class: "p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
													"model-value": !!(0, vue_exports.unref)(studentForm).communionDate,
													"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).communionDate = val ? (0, vue_exports.unref)(studentForm).communionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
													label: "Đã Rước Lễ",
													ui: { label: "font-bold text-amber-700 dark:text-amber-400" }
												}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).communionDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
													key: 0,
													class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
												}, [
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).communionDate,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionDate = $event,
															type: "date",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}),
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).communionPlace,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPlace = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}),
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).communionPriest,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPriest = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})
												])) : (0, vue_exports.createCommentVNode)("", true)]),
												(0, vue_exports.createVNode)("div", { class: "p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
													"model-value": !!(0, vue_exports.unref)(studentForm).confirmationDate,
													"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).confirmationDate = val ? (0, vue_exports.unref)(studentForm).confirmationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
													label: "Đã Thêm Sức",
													ui: { label: "font-bold text-red-700 dark:text-red-400" }
												}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).confirmationDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
													key: 0,
													class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
												}, [
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).confirmationDate,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationDate = $event,
															type: "date",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}),
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).confirmationPlace,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationPlace = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													}),
													(0, vue_exports.createVNode)(_component_UFormField, { label: "Người đỡ đầu" }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).confirmationGodparent,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationGodparent = $event,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
														_: 1
													})
												])) : (0, vue_exports.createCommentVNode)("", true)])
											])];
										}),
										medical: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Nhóm máu" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
															modelValue: (0, vue_exports.unref)(studentForm).bloodType,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).bloodType = $event,
															options: [
																"A+",
																"A-",
																"B+",
																"B-",
																"AB+",
																"AB-",
																"O+",
																"O-",
																"Chưa rõ"
															],
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_USelect, {
															modelValue: (0, vue_exports.unref)(studentForm).bloodType,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).bloodType = $event,
															options: [
																"A+",
																"A-",
																"B+",
																"B-",
																"AB+",
																"AB-",
																"O+",
																"O-",
																"Chưa rõ"
															],
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Tiền sử dị ứng" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).allergies,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).allergies = $event,
															placeholder: "Ví dụ: Hải sản...",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).allergies,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).allergies = $event,
															placeholder: "Ví dụ: Hải sản...",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Nhóm máu" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
													modelValue: (0, vue_exports.unref)(studentForm).bloodType,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).bloodType = $event,
													options: [
														"A+",
														"A-",
														"B+",
														"B-",
														"AB+",
														"AB-",
														"O+",
														"O-",
														"Chưa rõ"
													],
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Tiền sử dị ứng" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).allergies,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).allergies = $event,
													placeholder: "Ví dụ: Hải sản...",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})])];
										}),
										academic: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngành" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
															modelValue: (0, vue_exports.unref)(studentForm).branch,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).branch = $event,
															options: [
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
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_USelect, {
															modelValue: (0, vue_exports.unref)(studentForm).branch,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).branch = $event,
															options: [
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
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Lớp (để trống nếu xếp tự động)" }, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).className,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).className = $event,
															placeholder: "Ấu 1",
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UInput, {
															modelValue: (0, vue_exports.unref)(studentForm).className,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).className = $event,
															placeholder: "Ấu 1",
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
													label: "Ghi chú đặc biệt",
													class: "md:col-span-2"
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTextarea, {
															modelValue: (0, vue_exports.unref)(studentForm).notes,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).notes = $event,
															rows: 3,
															ui: { base: "rounded-xl" }
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UTextarea, {
															modelValue: (0, vue_exports.unref)(studentForm).notes,
															"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).notes = $event,
															rows: 3,
															ui: { base: "rounded-xl" }
														}, null, 8, ["modelValue", "onUpdate:modelValue"])];
													}),
													_: 1
												}, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
														modelValue: (0, vue_exports.unref)(studentForm).branch,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).branch = $event,
														options: [
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
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Lớp (để trống nếu xếp tự động)" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).className,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).className = $event,
														placeholder: "Ấu 1",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Ghi chú đặc biệt",
													class: "md:col-span-2"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
														modelValue: (0, vue_exports.unref)(studentForm).notes,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).notes = $event,
														rows: 3,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											])];
										}),
										_: 1
									}, _parent, _scopeId));
									else return [(0, vue_exports.createVNode)(_component_UTabs, {
										items: profileTabs,
										ui: { list: { rounded: "rounded-2xl bg-stone-100 dark:bg-stone-800" } },
										class: "w-full"
									}, {
										personal: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Tên Thánh",
												name: "holyName"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).holyName,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).holyName = $event,
													placeholder: "Giuse",
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Họ và Tên",
												name: "fullName",
												required: ""
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).fullName,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fullName = $event,
													placeholder: "Nguyễn Văn A",
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Ngày Sinh",
												name: "birthDate"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).birthDate,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).birthDate = $event,
													type: "date",
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Giới tính",
												name: "gender"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
													modelValue: (0, vue_exports.unref)(studentForm).gender,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).gender = $event,
													options: ["Nam", "Nữ"],
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Trạng thái",
												name: "isActive"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700" }, [(0, vue_exports.createVNode)(_component_UToggle, {
													modelValue: (0, vue_exports.unref)(studentForm).isActive,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).isActive = $event,
													color: "emerald"
												}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-600 dark:text-stone-300" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(studentForm).isActive ? "Đang hoạt động" : "Đã nghỉ học"), 1)])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Khu/Xóm",
												name: "area"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).area,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).area = $event,
													placeholder: "Khu Mân Côi...",
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										])]),
										family: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
											(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10" }, [
												(0, vue_exports.createVNode)("h4", { class: "font-black text-primary-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Cha")]),
												(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Tên Thánh",
													name: "fatherHolyName"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).fatherHolyName,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherHolyName = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}), (0, vue_exports.createVNode)(_component_UFormField, {
													label: "Họ Tên",
													name: "fatherName"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).fatherName,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherName = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})]),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Nghề nghiệp",
													name: "fatherJob"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).fatherJob,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherJob = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											]),
											(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10" }, [
												(0, vue_exports.createVNode)("h4", { class: "font-black text-pink-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Mẹ")]),
												(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Tên Thánh",
													name: "motherHolyName"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).motherHolyName,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherHolyName = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}), (0, vue_exports.createVNode)(_component_UFormField, {
													label: "Họ Tên",
													name: "motherName"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).motherName,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherName = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})]),
												(0, vue_exports.createVNode)(_component_UFormField, {
													label: "Nghề nghiệp",
													name: "motherJob"
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).motherJob,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherJob = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											]),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Số Điện Thoại Liên Lạc",
												name: "parentPhone",
												class: "md:col-span-2"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).parentPhone,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).parentPhone = $event,
													placeholder: "090...",
													icon: "i-heroicons-phone",
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Địa chỉ nhà",
												name: "address",
												class: "md:col-span-2"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).address,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).address = $event,
													placeholder: "Tổ, Đường, Phường...",
													class: "w-full",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										])]),
										sacraments: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "space-y-4 mt-6" }, [
											(0, vue_exports.createVNode)("div", { class: "p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
												"model-value": !!(0, vue_exports.unref)(studentForm).baptismDate,
												"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).baptismDate = val ? (0, vue_exports.unref)(studentForm).baptismDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
												label: "Đã Rửa Tội",
												ui: { label: "font-bold text-blue-700 dark:text-blue-400" }
											}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).baptismDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
											}, [
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).baptismDate,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismDate = $event,
														type: "date",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).baptismPlace,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPlace = $event,
														placeholder: "Giáo xứ...",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).baptismPriest,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPriest = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											])) : (0, vue_exports.createCommentVNode)("", true)]),
											(0, vue_exports.createVNode)("div", { class: "p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
												"model-value": !!(0, vue_exports.unref)(studentForm).communionDate,
												"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).communionDate = val ? (0, vue_exports.unref)(studentForm).communionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
												label: "Đã Rước Lễ",
												ui: { label: "font-bold text-amber-700 dark:text-amber-400" }
											}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).communionDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
											}, [
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).communionDate,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionDate = $event,
														type: "date",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).communionPlace,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPlace = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).communionPriest,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPriest = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											])) : (0, vue_exports.createCommentVNode)("", true)]),
											(0, vue_exports.createVNode)("div", { class: "p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
												"model-value": !!(0, vue_exports.unref)(studentForm).confirmationDate,
												"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).confirmationDate = val ? (0, vue_exports.unref)(studentForm).confirmationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
												label: "Đã Thêm Sức",
												ui: { label: "font-bold text-red-700 dark:text-red-400" }
											}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).confirmationDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
											}, [
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).confirmationDate,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationDate = $event,
														type: "date",
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).confirmationPlace,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationPlace = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												}),
												(0, vue_exports.createVNode)(_component_UFormField, { label: "Người đỡ đầu" }, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
														modelValue: (0, vue_exports.unref)(studentForm).confirmationGodparent,
														"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationGodparent = $event,
														ui: { base: "rounded-xl" }
													}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
													_: 1
												})
											])) : (0, vue_exports.createCommentVNode)("", true)])
										])]),
										medical: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Nhóm máu" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
												modelValue: (0, vue_exports.unref)(studentForm).bloodType,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).bloodType = $event,
												options: [
													"A+",
													"A-",
													"B+",
													"B-",
													"AB+",
													"AB-",
													"O+",
													"O-",
													"Chưa rõ"
												],
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Tiền sử dị ứng" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).allergies,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).allergies = $event,
												placeholder: "Ví dụ: Hải sản...",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})])]),
										academic: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
													modelValue: (0, vue_exports.unref)(studentForm).branch,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).branch = $event,
													options: [
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
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Lớp (để trống nếu xếp tự động)" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).className,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).className = $event,
													placeholder: "Ấu 1",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Ghi chú đặc biệt",
												class: "md:col-span-2"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
													modelValue: (0, vue_exports.unref)(studentForm).notes,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).notes = $event,
													rows: 3,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										])]),
										_: 1
									})];
								}),
								_: 1
							}, _parent, _scopeId));
							else return [(0, vue_exports.createVNode)(_component_UForm, {
								schema: (0, vue_exports.unref)(studentSchema),
								state: (0, vue_exports.unref)(studentForm),
								id: "studentForm",
								onSubmit: submitStudent,
								class: "p-6"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTabs, {
									items: profileTabs,
									ui: { list: { rounded: "rounded-2xl bg-stone-100 dark:bg-stone-800" } },
									class: "w-full"
								}, {
									personal: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Tên Thánh",
											name: "holyName"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).holyName,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).holyName = $event,
												placeholder: "Giuse",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Họ và Tên",
											name: "fullName",
											required: ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).fullName,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fullName = $event,
												placeholder: "Nguyễn Văn A",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Ngày Sinh",
											name: "birthDate"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).birthDate,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).birthDate = $event,
												type: "date",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Giới tính",
											name: "gender"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
												modelValue: (0, vue_exports.unref)(studentForm).gender,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).gender = $event,
												options: ["Nam", "Nữ"],
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Trạng thái",
											name: "isActive"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700" }, [(0, vue_exports.createVNode)(_component_UToggle, {
												modelValue: (0, vue_exports.unref)(studentForm).isActive,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).isActive = $event,
												color: "emerald"
											}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-600 dark:text-stone-300" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(studentForm).isActive ? "Đang hoạt động" : "Đã nghỉ học"), 1)])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Khu/Xóm",
											name: "area"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).area,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).area = $event,
												placeholder: "Khu Mân Côi...",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									])]),
									family: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
										(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10" }, [
											(0, vue_exports.createVNode)("h4", { class: "font-black text-primary-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Cha")]),
											(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Tên Thánh",
												name: "fatherHolyName"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).fatherHolyName,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherHolyName = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}), (0, vue_exports.createVNode)(_component_UFormField, {
												label: "Họ Tên",
												name: "fatherName"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).fatherName,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherName = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})]),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Nghề nghiệp",
												name: "fatherJob"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).fatherJob,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherJob = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										]),
										(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10" }, [
											(0, vue_exports.createVNode)("h4", { class: "font-black text-pink-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Mẹ")]),
											(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Tên Thánh",
												name: "motherHolyName"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).motherHolyName,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherHolyName = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}), (0, vue_exports.createVNode)(_component_UFormField, {
												label: "Họ Tên",
												name: "motherName"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).motherName,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherName = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})]),
											(0, vue_exports.createVNode)(_component_UFormField, {
												label: "Nghề nghiệp",
												name: "motherJob"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).motherJob,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherJob = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										]),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Số Điện Thoại Liên Lạc",
											name: "parentPhone",
											class: "md:col-span-2"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).parentPhone,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).parentPhone = $event,
												placeholder: "090...",
												icon: "i-heroicons-phone",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Địa chỉ nhà",
											name: "address",
											class: "md:col-span-2"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).address,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).address = $event,
												placeholder: "Tổ, Đường, Phường...",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									])]),
									sacraments: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "space-y-4 mt-6" }, [
										(0, vue_exports.createVNode)("div", { class: "p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
											"model-value": !!(0, vue_exports.unref)(studentForm).baptismDate,
											"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).baptismDate = val ? (0, vue_exports.unref)(studentForm).baptismDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
											label: "Đã Rửa Tội",
											ui: { label: "font-bold text-blue-700 dark:text-blue-400" }
										}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).baptismDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
										}, [
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).baptismDate,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismDate = $event,
													type: "date",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).baptismPlace,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPlace = $event,
													placeholder: "Giáo xứ...",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).baptismPriest,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPriest = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										])) : (0, vue_exports.createCommentVNode)("", true)]),
										(0, vue_exports.createVNode)("div", { class: "p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
											"model-value": !!(0, vue_exports.unref)(studentForm).communionDate,
											"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).communionDate = val ? (0, vue_exports.unref)(studentForm).communionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
											label: "Đã Rước Lễ",
											ui: { label: "font-bold text-amber-700 dark:text-amber-400" }
										}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).communionDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
										}, [
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).communionDate,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionDate = $event,
													type: "date",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).communionPlace,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPlace = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).communionPriest,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPriest = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										])) : (0, vue_exports.createCommentVNode)("", true)]),
										(0, vue_exports.createVNode)("div", { class: "p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
											"model-value": !!(0, vue_exports.unref)(studentForm).confirmationDate,
											"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).confirmationDate = val ? (0, vue_exports.unref)(studentForm).confirmationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
											label: "Đã Thêm Sức",
											ui: { label: "font-bold text-red-700 dark:text-red-400" }
										}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).confirmationDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
										}, [
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).confirmationDate,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationDate = $event,
													type: "date",
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).confirmationPlace,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationPlace = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											}),
											(0, vue_exports.createVNode)(_component_UFormField, { label: "Người đỡ đầu" }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
													modelValue: (0, vue_exports.unref)(studentForm).confirmationGodparent,
													"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationGodparent = $event,
													ui: { base: "rounded-xl" }
												}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
												_: 1
											})
										])) : (0, vue_exports.createCommentVNode)("", true)])
									])]),
									medical: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Nhóm máu" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(studentForm).bloodType,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).bloodType = $event,
											options: [
												"A+",
												"A-",
												"B+",
												"B-",
												"AB+",
												"AB-",
												"O+",
												"O-",
												"Chưa rõ"
											],
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Tiền sử dị ứng" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).allergies,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).allergies = $event,
											placeholder: "Ví dụ: Hải sản...",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})])]),
									academic: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
												modelValue: (0, vue_exports.unref)(studentForm).branch,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).branch = $event,
												options: [
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
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Lớp (để trống nếu xếp tự động)" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).className,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).className = $event,
												placeholder: "Ấu 1",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Ghi chú đặc biệt",
											class: "md:col-span-2"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
												modelValue: (0, vue_exports.unref)(studentForm).notes,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).notes = $event,
												rows: 3,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									])]),
									_: 1
								})]),
								_: 1
							}, 8, ["schema", "state"])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-user-plus",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(isEditing) ? "Cập Nhật Hồ Sơ Đoàn Sinh" : "Tạo Hồ Sơ Đoàn Sinh Mới"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isAddModalOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy bỏ",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isAddModalOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							type: "submit",
							form: "studentForm",
							label: (0, vue_exports.unref)(isEditing) ? "Lưu Thay Đổi" : "Tạo Hồ Sơ Mới",
							color: "primary",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider shadow-lg",
							loading: (0, vue_exports.unref)(isSubmitting)
						}, null, 8, ["label", "loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UForm, {
							schema: (0, vue_exports.unref)(studentSchema),
							state: (0, vue_exports.unref)(studentForm),
							id: "studentForm",
							onSubmit: submitStudent,
							class: "p-6"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTabs, {
								items: profileTabs,
								ui: { list: { rounded: "rounded-2xl bg-stone-100 dark:bg-stone-800" } },
								class: "w-full"
							}, {
								personal: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Tên Thánh",
										name: "holyName"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).holyName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).holyName = $event,
											placeholder: "Giuse",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Họ và Tên",
										name: "fullName",
										required: ""
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).fullName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fullName = $event,
											placeholder: "Nguyễn Văn A",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Ngày Sinh",
										name: "birthDate"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).birthDate,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).birthDate = $event,
											type: "date",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Giới tính",
										name: "gender"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(studentForm).gender,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).gender = $event,
											options: ["Nam", "Nữ"],
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Trạng thái",
										name: "isActive"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 mt-1 p-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700" }, [(0, vue_exports.createVNode)(_component_UToggle, {
											modelValue: (0, vue_exports.unref)(studentForm).isActive,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).isActive = $event,
											color: "emerald"
										}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-600 dark:text-stone-300" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(studentForm).isActive ? "Đang hoạt động" : "Đã nghỉ học"), 1)])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Khu/Xóm",
										name: "area"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).area,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).area = $event,
											placeholder: "Khu Mân Côi...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})
								])]),
								family: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
									(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-primary-200 dark:border-primary-800 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10" }, [
										(0, vue_exports.createVNode)("h4", { class: "font-black text-primary-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Cha")]),
										(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Tên Thánh",
											name: "fatherHolyName"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).fatherHolyName,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherHolyName = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}), (0, vue_exports.createVNode)(_component_UFormField, {
											label: "Họ Tên",
											name: "fatherName"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).fatherName,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherName = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})]),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Nghề nghiệp",
											name: "fatherJob"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).fatherJob,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).fatherJob = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									]),
									(0, vue_exports.createVNode)("div", { class: "space-y-4 p-5 border border-pink-200 dark:border-pink-800 rounded-2xl bg-pink-50/30 dark:bg-pink-900/10" }, [
										(0, vue_exports.createVNode)("h4", { class: "font-black text-pink-600 flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-user" }), (0, vue_exports.createTextVNode)(" Thông tin Mẹ")]),
										(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Tên Thánh",
											name: "motherHolyName"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).motherHolyName,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherHolyName = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}), (0, vue_exports.createVNode)(_component_UFormField, {
											label: "Họ Tên",
											name: "motherName"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).motherName,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherName = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})]),
										(0, vue_exports.createVNode)(_component_UFormField, {
											label: "Nghề nghiệp",
											name: "motherJob"
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).motherJob,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).motherJob = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									]),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Số Điện Thoại Liên Lạc",
										name: "parentPhone",
										class: "md:col-span-2"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).parentPhone,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).parentPhone = $event,
											placeholder: "090...",
											icon: "i-heroicons-phone",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Địa chỉ nhà",
										name: "address",
										class: "md:col-span-2"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).address,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).address = $event,
											placeholder: "Tổ, Đường, Phường...",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})
								])]),
								sacraments: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "space-y-4 mt-6" }, [
									(0, vue_exports.createVNode)("div", { class: "p-5 border border-blue-200 dark:border-blue-800 rounded-2xl bg-blue-50/30 dark:bg-blue-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
										"model-value": !!(0, vue_exports.unref)(studentForm).baptismDate,
										"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).baptismDate = val ? (0, vue_exports.unref)(studentForm).baptismDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
										label: "Đã Rửa Tội",
										ui: { label: "font-bold text-blue-700 dark:text-blue-400" }
									}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).baptismDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
									}, [
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).baptismDate,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismDate = $event,
												type: "date",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).baptismPlace,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPlace = $event,
												placeholder: "Giáo xứ...",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).baptismPriest,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).baptismPriest = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									])) : (0, vue_exports.createCommentVNode)("", true)]),
									(0, vue_exports.createVNode)("div", { class: "p-5 border border-amber-200 dark:border-amber-800 rounded-2xl bg-amber-50/30 dark:bg-amber-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
										"model-value": !!(0, vue_exports.unref)(studentForm).communionDate,
										"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).communionDate = val ? (0, vue_exports.unref)(studentForm).communionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
										label: "Đã Rước Lễ",
										ui: { label: "font-bold text-amber-700 dark:text-amber-400" }
									}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).communionDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
									}, [
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).communionDate,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionDate = $event,
												type: "date",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).communionPlace,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPlace = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh mục" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).communionPriest,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).communionPriest = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									])) : (0, vue_exports.createCommentVNode)("", true)]),
									(0, vue_exports.createVNode)("div", { class: "p-5 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50/30 dark:bg-red-900/10" }, [(0, vue_exports.createVNode)(_component_UCheckbox, {
										"model-value": !!(0, vue_exports.unref)(studentForm).confirmationDate,
										"onUpdate:modelValue": (val) => (0, vue_exports.unref)(studentForm).confirmationDate = val ? (0, vue_exports.unref)(studentForm).confirmationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : "",
										label: "Đã Thêm Sức",
										ui: { label: "font-bold text-red-700 dark:text-red-400" }
									}, null, 8, ["model-value", "onUpdate:modelValue"]), (0, vue_exports.unref)(studentForm).confirmationDate ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
									}, [
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày nhận" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).confirmationDate,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationDate = $event,
												type: "date",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Nơi nhận" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).confirmationPlace,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationPlace = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Người đỡ đầu" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(studentForm).confirmationGodparent,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).confirmationGodparent = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									])) : (0, vue_exports.createCommentVNode)("", true)])
								])]),
								medical: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Nhóm máu" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
										modelValue: (0, vue_exports.unref)(studentForm).bloodType,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).bloodType = $event,
										options: [
											"A+",
											"A-",
											"B+",
											"B-",
											"AB+",
											"AB-",
											"O+",
											"O-",
											"Chưa rõ"
										],
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Tiền sử dị ứng" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(studentForm).allergies,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).allergies = $event,
										placeholder: "Ví dụ: Hải sản...",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})])]),
								academic: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" }, [
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(studentForm).branch,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).branch = $event,
											options: [
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
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Lớp (để trống nếu xếp tự động)" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(studentForm).className,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).className = $event,
											placeholder: "Ấu 1",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Ghi chú đặc biệt",
										class: "md:col-span-2"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
											modelValue: (0, vue_exports.unref)(studentForm).notes,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(studentForm).notes = $event,
											rows: 3,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})
								])]),
								_: 1
							})]),
							_: 1
						}, 8, ["schema", "state"])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isCertModalOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isCertModalOpen) ? isCertModalOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-6" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex items-center gap-4"${_scopeId}><div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-academic-cap",
									class: "w-8 h-8"
								}, null, _parent, _scopeId));
								_push(`</div><div${_scopeId}><h3 class="text-xl font-black text-stone-800 dark:text-white uppercase"${_scopeId}>Chứng Chỉ Bí Tích</h3><p class="text-sm font-bold text-primary-600 mt-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(selectedStudent)?.holyName)} ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(selectedStudent)?.fullName)}</p></div></div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-academic-cap",
								class: "w-8 h-8"
							})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-black text-stone-800 dark:text-white uppercase" }, "Chứng Chỉ Bí Tích"), (0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-primary-600 mt-1" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(selectedStudent)?.holyName) + " " + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(selectedStudent)?.fullName), 1)])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-6"${_scopeId}><div class="space-y-2"${_scopeId}><h4 class="font-black text-xs uppercase tracking-widest text-stone-500"${_scopeId}>Đã Cấp Phát</h4>`);
								if (!(0, vue_exports.unref)(certificates).length) _push(`<div class="text-sm text-stone-400 italic p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl text-center border border-dashed border-stone-200 dark:border-stone-800"${_scopeId}>Chưa có chứng chỉ nào.</div>`);
								else _push(`<!---->`);
								_push(`<!--[-->`);
								(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(certificates), (cert) => {
									_push(`<div class="flex justify-between items-center p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl"${_scopeId}><div${_scopeId}><p class="font-black text-stone-800 dark:text-white"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(getCertName(cert.certificateType))}</p><p class="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1"${_scopeId}>Mã: ${(0, server_renderer_exports.ssrInterpolate)(cert.verificationCode)}</p></div><div class="flex gap-2"${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
										icon: "i-heroicons-arrow-down-tray",
										color: "primary",
										variant: "soft",
										size: "sm",
										class: "rounded-xl",
										to: `/api/Certificate/download/${cert.id}`,
										target: "_blank",
										external: ""
									}, null, _parent, _scopeId));
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
										icon: "i-heroicons-trash",
										color: "error",
										variant: "ghost",
										size: "sm",
										class: "rounded-xl",
										onClick: ($event) => revokeCert(cert.id)
									}, null, _parent, _scopeId));
									_push(`</div></div>`);
								});
								_push(`<!--]--></div><hr class="border-stone-200 dark:border-stone-800"${_scopeId}><div class="space-y-4"${_scopeId}><h4 class="font-black text-xs uppercase tracking-widest text-stone-500"${_scopeId}>Cấp Mới</h4><div class="grid grid-cols-2 gap-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Loại Bí Tích" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(certForm).certificateType,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).certificateType = $event,
											options: [
												{
													label: "Rửa Tội",
													value: "Baptism"
												},
												{
													label: "Rước Lễ",
													value: "Communion"
												},
												{
													label: "Thêm Sức",
													value: "Confirmation"
												}
											],
											"value-attribute": "value",
											"option-attribute": "label",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(certForm).certificateType,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).certificateType = $event,
											options: [
												{
													label: "Rửa Tội",
													value: "Baptism"
												},
												{
													label: "Rước Lễ",
													value: "Communion"
												},
												{
													label: "Thêm Sức",
													value: "Confirmation"
												}
											],
											"value-attribute": "value",
											"option-attribute": "label",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Linh Mục Chủ Sự" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).celebrant,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).celebrant = $event,
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).celebrant,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).celebrant = $event,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Người Đỡ Đầu" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).godparent,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).godparent = $event,
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).godparent,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).godparent = $event,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ký tên (Cha Xứ)" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).signedBy,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).signedBy = $event,
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).signedBy,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).signedBy = $event,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Tiến Hành Cấp Phát",
									color: "amber",
									block: "",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-md",
									onClick: issueCert
								}, null, _parent, _scopeId));
								_push(`</div></div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "space-y-6" }, [
								(0, vue_exports.createVNode)("div", { class: "space-y-2" }, [
									(0, vue_exports.createVNode)("h4", { class: "font-black text-xs uppercase tracking-widest text-stone-500" }, "Đã Cấp Phát"),
									!(0, vue_exports.unref)(certificates).length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "text-sm text-stone-400 italic p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl text-center border border-dashed border-stone-200 dark:border-stone-800"
									}, "Chưa có chứng chỉ nào.")) : (0, vue_exports.createCommentVNode)("", true),
									((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(certificates), (cert) => {
										return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: cert.id,
											class: "flex justify-between items-center p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl"
										}, [(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white" }, (0, vue_exports.toDisplayString)(getCertName(cert.certificateType)), 1), (0, vue_exports.createVNode)("p", { class: "text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1" }, "Mã: " + (0, vue_exports.toDisplayString)(cert.verificationCode), 1)]), (0, vue_exports.createVNode)("div", { class: "flex gap-2" }, [(0, vue_exports.createVNode)(_component_UButton, {
											icon: "i-heroicons-arrow-down-tray",
											color: "primary",
											variant: "soft",
											size: "sm",
											class: "rounded-xl",
											to: `/api/Certificate/download/${cert.id}`,
											target: "_blank",
											external: ""
										}, null, 8, ["to"]), (0, vue_exports.createVNode)(_component_UButton, {
											icon: "i-heroicons-trash",
											color: "error",
											variant: "ghost",
											size: "sm",
											class: "rounded-xl",
											onClick: ($event) => revokeCert(cert.id)
										}, null, 8, ["onClick"])])]);
									}), 128))
								]),
								(0, vue_exports.createVNode)("hr", { class: "border-stone-200 dark:border-stone-800" }),
								(0, vue_exports.createVNode)("div", { class: "space-y-4" }, [
									(0, vue_exports.createVNode)("h4", { class: "font-black text-xs uppercase tracking-widest text-stone-500" }, "Cấp Mới"),
									(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Loại Bí Tích" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
												modelValue: (0, vue_exports.unref)(certForm).certificateType,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).certificateType = $event,
												options: [
													{
														label: "Rửa Tội",
														value: "Baptism"
													},
													{
														label: "Rước Lễ",
														value: "Communion"
													},
													{
														label: "Thêm Sức",
														value: "Confirmation"
													}
												],
												"value-attribute": "value",
												"option-attribute": "label",
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh Mục Chủ Sự" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(certForm).celebrant,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).celebrant = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Người Đỡ Đầu" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(certForm).godparent,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).godparent = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										}),
										(0, vue_exports.createVNode)(_component_UFormField, { label: "Ký tên (Cha Xứ)" }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(certForm).signedBy,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).signedBy = $event,
												ui: { base: "rounded-xl" }
											}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
											_: 1
										})
									]),
									(0, vue_exports.createVNode)(_component_UButton, {
										label: "Tiến Hành Cấp Phát",
										color: "amber",
										block: "",
										size: "lg",
										class: "rounded-xl font-black uppercase tracking-wider shadow-md",
										onClick: issueCert
									})
								])
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-6" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-academic-cap",
							class: "w-8 h-8"
						})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-black text-stone-800 dark:text-white uppercase" }, "Chứng Chỉ Bí Tích"), (0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-primary-600 mt-1" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(selectedStudent)?.holyName) + " " + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(selectedStudent)?.fullName), 1)])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "space-y-6" }, [
							(0, vue_exports.createVNode)("div", { class: "space-y-2" }, [
								(0, vue_exports.createVNode)("h4", { class: "font-black text-xs uppercase tracking-widest text-stone-500" }, "Đã Cấp Phát"),
								!(0, vue_exports.unref)(certificates).length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 0,
									class: "text-sm text-stone-400 italic p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl text-center border border-dashed border-stone-200 dark:border-stone-800"
								}, "Chưa có chứng chỉ nào.")) : (0, vue_exports.createCommentVNode)("", true),
								((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)((0, vue_exports.unref)(certificates), (cert) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: cert.id,
										class: "flex justify-between items-center p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl"
									}, [(0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white" }, (0, vue_exports.toDisplayString)(getCertName(cert.certificateType)), 1), (0, vue_exports.createVNode)("p", { class: "text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-1" }, "Mã: " + (0, vue_exports.toDisplayString)(cert.verificationCode), 1)]), (0, vue_exports.createVNode)("div", { class: "flex gap-2" }, [(0, vue_exports.createVNode)(_component_UButton, {
										icon: "i-heroicons-arrow-down-tray",
										color: "primary",
										variant: "soft",
										size: "sm",
										class: "rounded-xl",
										to: `/api/Certificate/download/${cert.id}`,
										target: "_blank",
										external: ""
									}, null, 8, ["to"]), (0, vue_exports.createVNode)(_component_UButton, {
										icon: "i-heroicons-trash",
										color: "error",
										variant: "ghost",
										size: "sm",
										class: "rounded-xl",
										onClick: ($event) => revokeCert(cert.id)
									}, null, 8, ["onClick"])])]);
								}), 128))
							]),
							(0, vue_exports.createVNode)("hr", { class: "border-stone-200 dark:border-stone-800" }),
							(0, vue_exports.createVNode)("div", { class: "space-y-4" }, [
								(0, vue_exports.createVNode)("h4", { class: "font-black text-xs uppercase tracking-widest text-stone-500" }, "Cấp Mới"),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Loại Bí Tích" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(certForm).certificateType,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).certificateType = $event,
											options: [
												{
													label: "Rửa Tội",
													value: "Baptism"
												},
												{
													label: "Rước Lễ",
													value: "Communion"
												},
												{
													label: "Thêm Sức",
													value: "Confirmation"
												}
											],
											"value-attribute": "value",
											"option-attribute": "label",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Linh Mục Chủ Sự" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).celebrant,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).celebrant = $event,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Người Đỡ Đầu" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).godparent,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).godparent = $event,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Ký tên (Cha Xứ)" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(certForm).signedBy,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(certForm).signedBy = $event,
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})
								]),
								(0, vue_exports.createVNode)(_component_UButton, {
									label: "Tiến Hành Cấp Phát",
									color: "amber",
									block: "",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-md",
									onClick: issueCert
								})
							])
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isAssignModalOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isAssignModalOpen) ? isAssignModalOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-6" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex items-center gap-4"${_scopeId}><div class="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-sparkles",
									class: "w-8 h-8"
								}, null, _parent, _scopeId));
								_push(`</div><div${_scopeId}><h3 class="text-xl font-black text-stone-800 dark:text-white uppercase"${_scopeId}>Xếp Lớp Tự Động</h3><p class="text-sm font-bold text-stone-500 mt-1"${_scopeId}>Phân bổ đều học sinh vào các lớp</p></div></div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-sparkles",
								class: "w-8 h-8"
							})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-black text-stone-800 dark:text-white uppercase" }, "Xếp Lớp Tự Động"), (0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-stone-500 mt-1" }, "Phân bổ đều học sinh vào các lớp")])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="space-y-6"${_scopeId}><div class="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl flex items-start gap-3 text-primary-700 dark:text-primary-300 text-sm font-medium"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-information-circle",
									class: "w-6 h-6 shrink-0"
								}, null, _parent, _scopeId));
								_push(`<p${_scopeId}>Hệ thống sẽ lấy toàn bộ <b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(pagedData)?.total || 0)}</b> đoàn sinh chưa xếp lớp của ngành <b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(getBranchName((0, vue_exports.unref)(activeBranch)))}</b> và chia đều vào số lượng lớp bạn chọn.</p></div><div class="grid grid-cols-2 gap-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Số lượng Lớp" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(assignForm).numClasses,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).numClasses = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "1",
											max: "20",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(assignForm).numClasses,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).numClasses = $event,
											modelModifiers: { number: true },
											type: "number",
											min: "1",
											max: "20",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Phương pháp" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(assignForm).method,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).method = $event,
											options: [{
												label: "Trộn Ngẫu Nhiên",
												value: "Random"
											}, {
												label: "Chia Theo Giáo Khu",
												value: "Area"
											}],
											"value-attribute": "value",
											"option-attribute": "label",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelect, {
											modelValue: (0, vue_exports.unref)(assignForm).method,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).method = $event,
											options: [{
												label: "Trộn Ngẫu Nhiên",
												value: "Random"
											}, {
												label: "Chia Theo Giáo Khu",
												value: "Area"
											}],
											"value-attribute": "value",
											"option-attribute": "label",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Khởi Chạy Xếp Lớp",
									color: "amber",
									block: "",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg",
									onClick: submitAssignClasses
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "space-y-6" }, [
								(0, vue_exports.createVNode)("div", { class: "p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl flex items-start gap-3 text-primary-700 dark:text-primary-300 text-sm font-medium" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-information-circle",
									class: "w-6 h-6 shrink-0"
								}), (0, vue_exports.createVNode)("p", null, [
									(0, vue_exports.createTextVNode)("Hệ thống sẽ lấy toàn bộ "),
									(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(pagedData)?.total || 0), 1),
									(0, vue_exports.createTextVNode)(" đoàn sinh chưa xếp lớp của ngành "),
									(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)(getBranchName((0, vue_exports.unref)(activeBranch))), 1),
									(0, vue_exports.createTextVNode)(" và chia đều vào số lượng lớp bạn chọn.")
								])]),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Số lượng Lớp" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(assignForm).numClasses,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).numClasses = $event,
										modelModifiers: { number: true },
										type: "number",
										min: "1",
										max: "20",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Phương pháp" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
										modelValue: (0, vue_exports.unref)(assignForm).method,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).method = $event,
										options: [{
											label: "Trộn Ngẫu Nhiên",
											value: "Random"
										}, {
											label: "Chia Theo Giáo Khu",
											value: "Area"
										}],
										"value-attribute": "value",
										"option-attribute": "label",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})]),
								(0, vue_exports.createVNode)(_component_UButton, {
									label: "Khởi Chạy Xếp Lớp",
									color: "amber",
									block: "",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg",
									onClick: submitAssignClasses
								})
							])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-6" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-sparkles",
							class: "w-8 h-8"
						})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-black text-stone-800 dark:text-white uppercase" }, "Xếp Lớp Tự Động"), (0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-stone-500 mt-1" }, "Phân bổ đều học sinh vào các lớp")])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "space-y-6" }, [
							(0, vue_exports.createVNode)("div", { class: "p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl flex items-start gap-3 text-primary-700 dark:text-primary-300 text-sm font-medium" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-information-circle",
								class: "w-6 h-6 shrink-0"
							}), (0, vue_exports.createVNode)("p", null, [
								(0, vue_exports.createTextVNode)("Hệ thống sẽ lấy toàn bộ "),
								(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(pagedData)?.total || 0), 1),
								(0, vue_exports.createTextVNode)(" đoàn sinh chưa xếp lớp của ngành "),
								(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)(getBranchName((0, vue_exports.unref)(activeBranch))), 1),
								(0, vue_exports.createTextVNode)(" và chia đều vào số lượng lớp bạn chọn.")
							])]),
							(0, vue_exports.createVNode)("div", { class: "grid grid-cols-2 gap-4" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Số lượng Lớp" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(assignForm).numClasses,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).numClasses = $event,
									modelModifiers: { number: true },
									type: "number",
									min: "1",
									max: "20",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Phương pháp" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelect, {
									modelValue: (0, vue_exports.unref)(assignForm).method,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(assignForm).method = $event,
									options: [{
										label: "Trộn Ngẫu Nhiên",
										value: "Random"
									}, {
										label: "Chia Theo Giáo Khu",
										value: "Area"
									}],
									"value-attribute": "value",
									"option-attribute": "label",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})]),
							(0, vue_exports.createVNode)(_component_UButton, {
								label: "Khởi Chạy Xếp Lớp",
								color: "amber",
								block: "",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider shadow-lg",
								onClick: submitAssignClasses
							})
						])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isGradebookOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isGradebookOpen) ? isGradebookOpen.value = $event : null,
				fullscreen: "",
				ui: { base: "bg-white/95 dark:bg-stone-950/95 backdrop-blur-3xl" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="h-full flex flex-col p-6 max-w-7xl mx-auto w-full"${_scopeId}><div class="flex items-center justify-between mb-6 pb-6 border-b border-stone-200 dark:border-stone-800"${_scopeId}><div class="flex items-center gap-4"${_scopeId}><div class="p-4 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-2xl"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-clipboard-document-list",
							class: "w-8 h-8"
						}, null, _parent, _scopeId));
						_push(`</div><div${_scopeId}><h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-tight"${_scopeId}>Sổ Điểm Danh &amp; Kết Quả</h2><p class="text-sm font-bold text-stone-500 uppercase tracking-widest mt-1"${_scopeId}>Lớp: <span class="text-primary-600"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(activeClass))}</span></p></div></div><div class="flex gap-3"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Đóng",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-2xl font-bold",
							onClick: ($event) => isGradebookOpen.value = false
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							label: "Lưu Bảng Điểm",
							color: "primary",
							variant: "solid",
							size: "lg",
							class: "rounded-2xl font-black uppercase shadow-lg",
							icon: "i-heroicons-check",
							loading: (0, vue_exports.unref)(isSavingGradebook),
							onClick: saveGradebook
						}, null, _parent, _scopeId));
						_push(`</div></div><div class="flex-1 overflow-auto rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl relative"${_scopeId}><table class="w-full text-sm text-left"${_scopeId}><thead class="text-xs font-black text-stone-500 uppercase tracking-widest bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm"${_scopeId}><tr${_scopeId}><th class="px-6 py-5 w-16"${_scopeId}>STT</th><th class="px-6 py-5 min-w-[200px]"${_scopeId}>Họ và Tên Đoàn Sinh</th><th class="px-6 py-5 w-32 text-center"${_scopeId}>Học Kỳ 1</th><th class="px-6 py-5 w-32 text-center"${_scopeId}>Học Kỳ 2</th><th class="px-6 py-5 w-32 text-center text-primary-600"${_scopeId}>Tổng Kết</th><th class="px-6 py-5 min-w-[300px]"${_scopeId}>Nhận Xét Của GLV</th></tr></thead><tbody class="divide-y divide-stone-100 dark:divide-stone-800/50"${_scopeId}>`);
						if ((0, vue_exports.unref)(gradebookPending)) {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)(5, (i) => {
								_push(`<tr class="animate-pulse"${_scopeId}><td colspan="6" class="px-6 py-6 bg-stone-50 dark:bg-stone-900/50"${_scopeId}>Đang tải dữ liệu...</td></tr>`);
							});
							_push(`<!--]-->`);
						} else if (!(0, vue_exports.unref)(gradebookData).length) _push(`<tr${_scopeId}><td colspan="6" class="px-6 py-12 text-center text-stone-500 font-bold"${_scopeId}>Chưa có đoàn sinh nào trong lớp.</td></tr>`);
						else {
							_push(`<!--[-->`);
							(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(gradebookData), (row, idx) => {
								_push(`<tr class="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"${_scopeId}><td class="px-6 py-4 font-black text-stone-400"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(idx + 1)}</td><td class="px-6 py-4"${_scopeId}><div class="font-black text-stone-800 dark:text-stone-200 text-base"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.fullName)}</div><div class="text-[10px] text-stone-400 font-bold uppercase tracking-widest"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.holyName)}</div></td><td class="px-6 py-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
									modelValue: row.semester1,
									"onUpdate:modelValue": ($event) => row.semester1 = $event,
									type: "number",
									step: "0.1",
									size: "lg",
									placeholder: "-",
									class: "w-24 mx-auto",
									ui: { base: "text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner" }
								}, null, _parent, _scopeId));
								_push(`</td><td class="px-6 py-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
									modelValue: row.semester2,
									"onUpdate:modelValue": ($event) => row.semester2 = $event,
									type: "number",
									step: "0.1",
									size: "lg",
									placeholder: "-",
									class: "w-24 mx-auto",
									ui: { base: "text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner" }
								}, null, _parent, _scopeId));
								_push(`</td><td class="px-6 py-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
									modelValue: row.finalScore,
									"onUpdate:modelValue": ($event) => row.finalScore = $event,
									type: "number",
									step: "0.1",
									size: "lg",
									placeholder: "Auto",
									class: "w-24 mx-auto",
									ui: { base: "text-center font-black text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl shadow-inner border-primary-200 dark:border-primary-800" }
								}, null, _parent, _scopeId));
								_push(`</td><td class="px-6 py-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
									modelValue: row.remarks,
									"onUpdate:modelValue": ($event) => row.remarks = $event,
									size: "lg",
									placeholder: "Nhập nhận xét...",
									ui: { base: "rounded-xl shadow-inner" }
								}, null, _parent, _scopeId));
								_push(`</td></tr>`);
							});
							_push(`<!--]-->`);
						}
						_push(`</tbody></table></div></div>`);
					} else return [(0, vue_exports.createVNode)("div", { class: "h-full flex flex-col p-6 max-w-7xl mx-auto w-full" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center justify-between mb-6 pb-6 border-b border-stone-200 dark:border-stone-800" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-2xl" }, [(0, vue_exports.createVNode)(_component_UIcon, {
						name: "i-heroicons-clipboard-document-list",
						class: "w-8 h-8"
					})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white uppercase tracking-tight" }, "Sổ Điểm Danh & Kết Quả"), (0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-stone-500 uppercase tracking-widest mt-1" }, [(0, vue_exports.createTextVNode)("Lớp: "), (0, vue_exports.createVNode)("span", { class: "text-primary-600" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(activeClass)), 1)])])]), (0, vue_exports.createVNode)("div", { class: "flex gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
						label: "Đóng",
						color: "neutral",
						variant: "soft",
						size: "lg",
						class: "rounded-2xl font-bold",
						onClick: ($event) => isGradebookOpen.value = false
					}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
						label: "Lưu Bảng Điểm",
						color: "primary",
						variant: "solid",
						size: "lg",
						class: "rounded-2xl font-black uppercase shadow-lg",
						icon: "i-heroicons-check",
						loading: (0, vue_exports.unref)(isSavingGradebook),
						onClick: saveGradebook
					}, null, 8, ["loading"])])]), (0, vue_exports.createVNode)("div", { class: "flex-1 overflow-auto rounded-[2rem] border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl relative" }, [(0, vue_exports.createVNode)("table", { class: "w-full text-sm text-left" }, [(0, vue_exports.createVNode)("thead", { class: "text-xs font-black text-stone-500 uppercase tracking-widest bg-stone-100 dark:bg-stone-950 sticky top-0 z-10 shadow-sm" }, [(0, vue_exports.createVNode)("tr", null, [
						(0, vue_exports.createVNode)("th", { class: "px-6 py-5 w-16" }, "STT"),
						(0, vue_exports.createVNode)("th", { class: "px-6 py-5 min-w-[200px]" }, "Họ và Tên Đoàn Sinh"),
						(0, vue_exports.createVNode)("th", { class: "px-6 py-5 w-32 text-center" }, "Học Kỳ 1"),
						(0, vue_exports.createVNode)("th", { class: "px-6 py-5 w-32 text-center" }, "Học Kỳ 2"),
						(0, vue_exports.createVNode)("th", { class: "px-6 py-5 w-32 text-center text-primary-600" }, "Tổng Kết"),
						(0, vue_exports.createVNode)("th", { class: "px-6 py-5 min-w-[300px]" }, "Nhận Xét Của GLV")
					])]), (0, vue_exports.createVNode)("tbody", { class: "divide-y divide-stone-100 dark:divide-stone-800/50" }, [(0, vue_exports.unref)(gradebookPending) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, (0, vue_exports.renderList)(5, (i) => {
						return (0, vue_exports.createVNode)("tr", {
							key: `skeleton-${i}`,
							class: "animate-pulse"
						}, [(0, vue_exports.createVNode)("td", {
							colspan: "6",
							class: "px-6 py-6 bg-stone-50 dark:bg-stone-900/50"
						}, "Đang tải dữ liệu...")]);
					}), 64)) : !(0, vue_exports.unref)(gradebookData).length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("tr", { key: 1 }, [(0, vue_exports.createVNode)("td", {
						colspan: "6",
						class: "px-6 py-12 text-center text-stone-500 font-bold"
					}, "Chưa có đoàn sinh nào trong lớp.")])) : ((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 2 }, (0, vue_exports.renderList)((0, vue_exports.unref)(gradebookData), (row, idx) => {
						return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("tr", {
							key: row.studentId,
							class: "hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
						}, [
							(0, vue_exports.createVNode)("td", { class: "px-6 py-4 font-black text-stone-400" }, (0, vue_exports.toDisplayString)(idx + 1), 1),
							(0, vue_exports.createVNode)("td", { class: "px-6 py-4" }, [(0, vue_exports.createVNode)("div", { class: "font-black text-stone-800 dark:text-stone-200 text-base" }, (0, vue_exports.toDisplayString)(row.fullName), 1), (0, vue_exports.createVNode)("div", { class: "text-[10px] text-stone-400 font-bold uppercase tracking-widest" }, (0, vue_exports.toDisplayString)(row.holyName), 1)]),
							(0, vue_exports.createVNode)("td", { class: "px-6 py-4" }, [(0, vue_exports.createVNode)(_component_UInput, {
								modelValue: row.semester1,
								"onUpdate:modelValue": ($event) => row.semester1 = $event,
								type: "number",
								step: "0.1",
								size: "lg",
								placeholder: "-",
								class: "w-24 mx-auto",
								ui: { base: "text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							(0, vue_exports.createVNode)("td", { class: "px-6 py-4" }, [(0, vue_exports.createVNode)(_component_UInput, {
								modelValue: row.semester2,
								"onUpdate:modelValue": ($event) => row.semester2 = $event,
								type: "number",
								step: "0.1",
								size: "lg",
								placeholder: "-",
								class: "w-24 mx-auto",
								ui: { base: "text-center font-bold rounded-xl bg-white dark:bg-stone-900 shadow-inner" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							(0, vue_exports.createVNode)("td", { class: "px-6 py-4" }, [(0, vue_exports.createVNode)(_component_UInput, {
								modelValue: row.finalScore,
								"onUpdate:modelValue": ($event) => row.finalScore = $event,
								type: "number",
								step: "0.1",
								size: "lg",
								placeholder: "Auto",
								class: "w-24 mx-auto",
								ui: { base: "text-center font-black text-primary-600 bg-primary-50 dark:bg-primary-900/20 rounded-xl shadow-inner border-primary-200 dark:border-primary-800" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							(0, vue_exports.createVNode)("td", { class: "px-6 py-4" }, [(0, vue_exports.createVNode)(_component_UInput, {
								modelValue: row.remarks,
								"onUpdate:modelValue": ($event) => row.remarks = $event,
								size: "lg",
								placeholder: "Nhập nhận xét...",
								ui: { base: "rounded-xl shadow-inner" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])])
						]);
					}), 128))])])])])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isImportOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isImportOpen) ? isImportOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden sm:max-w-3xl" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-between items-center"${_scopeId}><h3 class="text-xl font-black text-stone-800 dark:text-white uppercase flex items-center gap-2"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-cloud-arrow-up",
									class: "text-primary-500 w-6 h-6"
								}, null, _parent, _scopeId));
								_push(` Nạp Dữ Liệu Hàng Loạt </h3>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "neutral",
									variant: "ghost",
									onClick: ($event) => isImportOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-between items-center" }, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-black text-stone-800 dark:text-white uppercase flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-cloud-arrow-up",
								class: "text-primary-500 w-6 h-6"
							}), (0, vue_exports.createTextVNode)(" Nạp Dữ Liệu Hàng Loạt ")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "neutral",
								variant: "ghost",
								onClick: ($event) => isImportOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="p-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, { onImported: ($event) => {
									isImportOpen.value = false;
									(0, vue_exports.unref)(refresh)();
								} }, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "p-6" }, [(0, vue_exports.createVNode)(_sfc_main$1, { onImported: ($event) => {
								isImportOpen.value = false;
								(0, vue_exports.unref)(refresh)();
							} }, null, 8, ["onImported"])])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-between items-center" }, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-black text-stone-800 dark:text-white uppercase flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-cloud-arrow-up",
							class: "text-primary-500 w-6 h-6"
						}), (0, vue_exports.createTextVNode)(" Nạp Dữ Liệu Hàng Loạt ")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isImportOpen.value = false
						}, null, 8, ["onClick"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-6" }, [(0, vue_exports.createVNode)(_sfc_main$1, { onImported: ($event) => {
							isImportOpen.value = false;
							(0, vue_exports.unref)(refresh)();
						} }, null, 8, ["onImported"])])]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/students.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=students-B5Xe0iCd.mjs.map
