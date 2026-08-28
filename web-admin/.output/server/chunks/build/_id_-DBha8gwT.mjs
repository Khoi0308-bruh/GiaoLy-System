import { u as useRoute, a as useToast, v as vue_exports, b as useApiFetch, c as useHead$1, $ as $api, s as server_renderer_exports, N as NuxtLink, _ as _sfc_main$2, d as _sfc_main$4 } from '../virtual/entry.mjs';
import { _ as _sfc_main$c } from './Checkbox-Cp-D5Mep.mjs';
import { _ as _sfc_main$9 } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$a } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$b } from './Input-Bk0TlYbs.mjs';
import { _ as _plugin_vue_export_helper_default } from './_plugin-vue_export-helper-BOaGB7Aw.mjs';
import { _ as _sfc_main$3 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$6 } from './Card-CTTrlgZc.mjs';
import { _ as _sfc_main$1 } from './Container-C4Y98Up-.mjs';
import { _ as _sfc_main$8 } from './Textarea-Cw0MtPiI.mjs';
import { _ as _sfc_main$5 } from './Skeleton-B2HCfpHA.mjs';
import { _ as _sfc_main$7 } from './Table-TpQjMDac.mjs';
import { useDebounceFn } from '@vueuse/core';
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
import './useFormControl-DR703Aa5.mjs';
import './useForwardScopeId-eoFSsZ85.mjs';
import './VisuallyHiddenInput-DjK2EyXI.mjs';
import './RovingFocusItem-ClXCvEdi.mjs';
import './useId-D2M6x4XU.mjs';
import './utils-Dj6yoN4y.mjs';
import './RovingFocusGroup-CkUp22zh.mjs';
import './utils-SyRrd6Ur.mjs';
import './esm-DyCVLeOU.mjs';

//#region pages/admin/classrooms/[id].vue
var _sfc_main = {
	__name: "[id]",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		const route = useRoute();
		const toast = useToast();
		const classRoomId = route.params.id;
		const { data: allYears } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/AcademicYear")), __temp = await __temp, __restore(), __temp);
		const classRoom = (0, vue_exports.ref)(null);
		useHead$1({ title: (0, vue_exports.computed)(() => `${classRoom.value?.className ?? "Chi tiết lớp học"} | GiaoLy`) });
		const { data: enrollments, pending: pendingEnrollments, refresh: refreshEnrollments } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch(`/Enrollment/classroom/${classRoomId}`, { default: () => [] })), __temp = await __temp, __restore(), __temp);
		const unassignedStudents = (0, vue_exports.ref)([]);
		const pendingUnassigned = (0, vue_exports.ref)(false);
		const selectedStudentIds = (0, vue_exports.ref)([]);
		const isEnrollModalOpen = (0, vue_exports.ref)(false);
		const isEnrolling = (0, vue_exports.ref)(false);
		const searchQuery = (0, vue_exports.ref)("");
		const openEnrollModal = async () => {
			if (!classRoom.value) return;
			selectedStudentIds.value = [];
			searchQuery.value = "";
			pendingUnassigned.value = true;
			isEnrollModalOpen.value = true;
			try {
				const res = await $api(`/Enrollment/unassigned/${classRoom.value.academicYearId}`);
				unassignedStudents.value = res;
			} catch {
				toast.add({
					title: "Lỗi tải đoàn sinh tự do",
					color: "error"
				});
			} finally {
				pendingUnassigned.value = false;
			}
		};
		const toggleSelectStudent = (id) => {
			const index = selectedStudentIds.value.indexOf(id);
			if (index === -1) selectedStudentIds.value.push(id);
			else selectedStudentIds.value.splice(index, 1);
		};
		const filteredUnassigned = (0, vue_exports.computed)(() => {
			if (!searchQuery.value) return unassignedStudents.value;
			const q = searchQuery.value.toLowerCase();
			return unassignedStudents.value.filter((s) => (s.fullName || "").toLowerCase().includes(q) || (s.holyName || "").toLowerCase().includes(q));
		});
		const submitEnrollment = async () => {
			isEnrolling.value = true;
			try {
				await $api("/Enrollment", {
					method: "POST",
					body: {
						classRoomId,
						studentIds: selectedStudentIds.value
					}
				});
				isEnrollModalOpen.value = false;
				await refreshEnrollments();
				toast.add({
					title: "Xếp lớp thành công!",
					color: "success"
				});
			} catch {
				toast.add({
					title: "Lỗi xếp lớp",
					color: "error"
				});
			} finally {
				isEnrolling.value = false;
			}
		};
		const unenrollStudent = async (enrollmentId) => {
			if (!confirm("Rút học sinh này khỏi lớp?")) return;
			try {
				await $api(`/Enrollment/${enrollmentId}`, { method: "DELETE" });
				await refreshEnrollments();
				toast.add({
					title: "Đã rút đoàn sinh ra khỏi lớp",
					color: "success"
				});
			} catch {
				toast.add({
					title: "Lỗi khi rút",
					color: "error"
				});
			}
		};
		const columns = [
			{
				accessorKey: "fullName",
				header: "Học Sinh"
			},
			{
				accessorKey: "birthDate",
				header: "Ngày Sinh"
			},
			{
				accessorKey: "sacraments",
				header: "Bí Tích Đức Tin"
			},
			{
				accessorKey: "actions",
				header: ""
			}
		];
		const activeTab = (0, vue_exports.ref)("students");
		const gradesList = (0, vue_exports.ref)([]);
		const isSavingGrades = (0, vue_exports.ref)(false);
		const loadGrades = async () => {
			try {
				const res = await $api(`/Grade/classroom/${classRoomId}`);
				gradesList.value = res.map((g) => ({
					...g,
					oral: g.oral || 0,
					smallTest: g.smallTest || 0,
					bigTest: g.bigTest || 0,
					finalExam: g.finalExam || 0,
					absences: g.absences || 0,
					totalSessions: g.totalSessions || 30
				}));
			} catch (error) {
				console.error("Error fetching grades:", error);
				toast.add({
					title: "Lỗi tải sổ điểm",
					color: "error"
				});
			}
		};
		(0, vue_exports.watch)(activeTab, async (newTab) => {
			if (newTab === "grades" || newTab === "contacts") {
				if (!gradesList.value.length) await loadGrades();
			} else if (newTab === "log") {
				if (!classLogs.value.length) await loadLogs();
			}
		});
		const exportContactBookPdf = async () => {};
		const classLogs = (0, vue_exports.ref)([]);
		const pendingLogs = (0, vue_exports.ref)(false);
		const newLogEntry = (0, vue_exports.ref)("");
		const isSavingLog = (0, vue_exports.ref)(false);
		const loadLogs = async () => {
			pendingLogs.value = true;
			try {
				classLogs.value = await $api(`/ClassroomLog/classroom/${classRoomId}`);
			} catch (error) {
				console.error("Error fetching logs:", error);
			} finally {
				pendingLogs.value = false;
			}
		};
		const saveLogEntry = async () => {
			if (!newLogEntry.value.trim()) return;
			isSavingLog.value = true;
			try {
				await $api(`/ClassroomLog/classroom/${classRoomId}`, {
					method: "POST",
					body: { content: newLogEntry.value }
				});
				toast.add({
					title: "Đã lưu ghi chú",
					color: "success"
				});
				newLogEntry.value = "";
				await loadLogs();
			} catch (error) {
				console.error("Error saving log:", error);
				toast.add({
					title: "Lỗi lưu ghi chú",
					color: "error"
				});
			} finally {
				isSavingLog.value = false;
			}
		};
		const calculateGPA = (row) => {
			const sum = (parseFloat(row.oral) || 0) + (parseFloat(row.smallTest) || 0) + (parseFloat(row.bigTest) || 0) * 2 + (parseFloat(row.finalExam) || 0) * 3;
			return Math.round(sum / 7 * 10) / 10;
		};
		const checkQualified = (row) => {
			const gpa = calculateGPA(row);
			const total = parseInt(row.totalSessions) || 30;
			const abs = parseInt(row.absences) || 0;
			const attendanceRate = total > 0 ? (total - abs) / total : 0;
			return gpa >= 5 && attendanceRate >= .8;
		};
		const saveStatus = (0, vue_exports.ref)("idle");
		const debouncedSave = useDebounceFn(async () => {
			await saveGrades(true);
		}, 1e3);
		const onGradeInput = () => {
			saveStatus.value = "saving";
			debouncedSave();
		};
		const saveGrades = async (isAuto = false) => {
			if (!isAuto) isSavingGrades.value = true;
			try {
				const payload = gradesList.value.map((g) => ({
					studentId: g.studentId,
					classRoomId,
					oral: parseFloat(g.oral) || 0,
					smallTest: parseFloat(g.smallTest) || 0,
					bigTest: parseFloat(g.bigTest) || 0,
					finalExam: parseFloat(g.finalExam) || 0,
					absences: parseInt(g.absences) || 0,
					totalSessions: parseInt(g.totalSessions) || 30
				}));
				await $api(`/Grade/save/${classRoomId}`, {
					method: "POST",
					body: payload
				});
				if (!isAuto) toast.add({
					title: "Bảng điểm đã được lưu thành công!",
					color: "success"
				});
				saveStatus.value = "saved";
				setTimeout(() => {
					if (saveStatus.value === "saved") saveStatus.value = "idle";
				}, 2e3);
			} catch (error) {
				console.error("Error saving grades:", error);
				if (!isAuto) toast.add({
					title: "Lỗi lưu sổ điểm",
					color: "error"
				});
				saveStatus.value = "error";
			} finally {
				if (!isAuto) isSavingGrades.value = false;
			}
		};
		const exportGrades = async () => {};
		const exportGradesPdf = async () => {};
		const getBranchName = (b) => {
			return {
				0: "Chung",
				1: "Chiên Con",
				2: "Ấu Nhi",
				3: "Thiếu Nhi",
				4: "Nghĩa Sĩ",
				5: "Hiệp Sĩ"
			}[b] || "Chung";
		};
		const getBranchColor = (b) => {
			return {
				0: "neutral",
				1: "pink",
				2: "success",
				3: "primary",
				4: "warning",
				5: "error"
			}[b] || "neutral";
		};
		const formatDate = (dateStr) => {
			if (!dateStr) return "";
			return new Date(dateStr).toLocaleDateString("vi-VN", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric"
			});
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UContainer = _sfc_main$1;
			const _component_NuxtLink = NuxtLink;
			const _component_UIcon = _sfc_main$2;
			const _component_UBadge = _sfc_main$3;
			const _component_UButton = _sfc_main$4;
			const _component_USkeleton = _sfc_main$5;
			const _component_UCard = _sfc_main$6;
			const _component_UTable = _sfc_main$7;
			const _component_UTextarea = _sfc_main$8;
			const _component_UModal = _sfc_main$9;
			const _component_UFormField = _sfc_main$a;
			const _component_UInput = _sfc_main$b;
			const _component_UCheckbox = _sfc_main$c;
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UContainer, (0, vue_exports.mergeProps)({ class: "py-10 space-y-8" }, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex items-center gap-2 text-sm text-stone-500" data-v-a6de758d${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_NuxtLink, {
							to: "/admin/academic-years",
							class: "hover:text-primary-500 transition-colors"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Niên Khóa `);
								else return [(0, vue_exports.createTextVNode)(" Niên Khóa ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-chevron-right",
							class: "w-4 h-4"
						}, null, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_NuxtLink, {
							to: `/admin/academic-years/${classRoom.value?.academicYearId}`,
							class: "hover:text-primary-500 transition-colors"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Lớp Học `);
								else return [(0, vue_exports.createTextVNode)(" Lớp Học ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-chevron-right",
							class: "w-4 h-4"
						}, null, _parent, _scopeId));
						_push(`<span class="font-semibold text-stone-800 dark:text-white" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(classRoom.value?.className ?? "Lớp học")}</span></div><div class="glass-card rounded-2xl p-6 border border-white/20 dark:border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6" data-v-a6de758d${_scopeId}><div class="space-y-2 relative z-10" data-v-a6de758d${_scopeId}><div class="flex items-center gap-3 flex-wrap" data-v-a6de758d${_scopeId}><span class="text-xs font-bold text-stone-400 uppercase tracking-widest" data-v-a6de758d${_scopeId}>Chi tiết lớp học</span>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
							label: `Ngành ${getBranchName(classRoom.value?.branch)}`,
							color: getBranchColor(classRoom.value?.branch),
							variant: "solid",
							size: "xs"
						}, null, _parent, _scopeId));
						_push(`</div><h1 class="text-3xl font-black text-stone-800 dark:text-white" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(classRoom.value?.className)}</h1><div class="flex items-center gap-6 text-sm text-stone-500 flex-wrap" data-v-a6de758d${_scopeId}><span class="flex items-center gap-1.5" data-v-a6de758d${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-user",
							class: "text-primary-500 w-4 h-4"
						}, null, _parent, _scopeId));
						_push(` GLV Chủ nhiệm: <strong class="text-stone-700 dark:text-stone-300" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(classRoom.value?.mainTeacher || "Chưa phân công")}</strong></span>`);
						if (classRoom.value?.roomName) {
							_push(`<span class="flex items-center gap-1.5" data-v-a6de758d${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
								name: "i-heroicons-map-pin",
								class: "text-amber-500 w-4 h-4"
							}, null, _parent, _scopeId));
							_push(` Phòng học: <strong class="text-stone-700 dark:text-stone-300" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(classRoom.value?.roomName)}</strong></span>`);
						} else _push(`<!---->`);
						_push(`</div></div><div class="flex gap-2 flex-shrink-0 relative z-10" data-v-a6de758d${_scopeId}>`);
						if (activeTab.value === "students") _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							icon: "i-heroicons-user-plus",
							label: "Xếp Lớp Hàng Loạt",
							color: "primary",
							onClick: openEnrollModal
						}, null, _parent, _scopeId));
						else {
							_push(`<div class="flex gap-2" data-v-a6de758d${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								icon: "i-heroicons-document-arrow-down",
								label: "Xuất Excel",
								color: "neutral",
								variant: "soft",
								onClick: exportGrades
							}, null, _parent, _scopeId));
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								icon: "i-heroicons-printer",
								label: "In PDF",
								color: "rose",
								variant: "soft",
								onClick: exportGradesPdf
							}, null, _parent, _scopeId));
							_push(`<div class="flex items-center justify-end px-2" data-v-a6de758d${_scopeId}>`);
							if (saveStatus.value === "saving") {
								_push(`<span class="text-xs font-bold text-amber-500 flex items-center gap-1" data-v-a6de758d${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-arrow-path",
									class: "w-4 h-4 animate-spin"
								}, null, _parent, _scopeId));
								_push(` Đang lưu...</span>`);
							} else if (saveStatus.value === "saved") {
								_push(`<span class="text-xs font-bold text-emerald-500 flex items-center gap-1" data-v-a6de758d${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-check-circle",
									class: "w-4 h-4"
								}, null, _parent, _scopeId));
								_push(` Đã lưu tự động</span>`);
							} else if (saveStatus.value === "error") {
								_push(`<span class="text-xs font-bold text-red-500 flex items-center gap-1" data-v-a6de758d${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-x-circle",
									class: "w-4 h-4"
								}, null, _parent, _scopeId));
								_push(` Lỗi lưu</span>`);
							} else _push(`<!---->`);
							_push(`</div>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								icon: "i-heroicons-check-circle",
								label: "Force Save",
								color: "primary",
								variant: "outline",
								loading: isSavingGrades.value,
								onClick: saveGrades
							}, null, _parent, _scopeId));
							_push(`</div>`);
						}
						_push(`</div></div><div class="flex border-b border-stone-200 dark:border-stone-850 gap-6 overflow-x-auto" data-v-a6de758d${_scopeId}><button class="${(0, server_renderer_exports.ssrRenderClass)([activeTab.value === "students" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600", "pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"])}" data-v-a6de758d${_scopeId}> Danh Sách Đoàn Sinh </button><button class="${(0, server_renderer_exports.ssrRenderClass)([activeTab.value === "grades" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600", "pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"])}" data-v-a6de758d${_scopeId}> Sổ Điểm &amp; Chuyên Cần </button><button class="${(0, server_renderer_exports.ssrRenderClass)([activeTab.value === "contacts" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600", "pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"])}" data-v-a6de758d${_scopeId}> Sổ Liên Lạc </button><button class="${(0, server_renderer_exports.ssrRenderClass)([activeTab.value === "log" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600", "pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap"])}" data-v-a6de758d${_scopeId}> Nhật Ký Lớp </button></div><div class="space-y-6" data-v-a6de758d${_scopeId}>`);
						if (activeTab.value === "students") {
							_push(`<div class="space-y-4" data-v-a6de758d${_scopeId}><h3 class="text-xl font-bold flex items-center gap-2" data-v-a6de758d${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
								name: "i-heroicons-users",
								class: "text-primary-500"
							}, null, _parent, _scopeId));
							_push(` Danh Sách Đoàn Sinh (${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(enrollments).length)} em) </h3>`);
							if ((0, vue_exports.unref)(pendingEnrollments)) {
								_push(`<div class="flex flex-col gap-4 py-8 max-w-2xl mx-auto" data-v-a6de758d${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(5, (i) => {
									_push(`<div class="flex items-center gap-4 animate-pulse" data-v-a6de758d${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-12 w-12 rounded-full" }, null, _parent, _scopeId));
									_push(`<div class="space-y-2 flex-1" data-v-a6de758d${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-4 w-1/3" }, null, _parent, _scopeId));
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-3 w-1/4" }, null, _parent, _scopeId));
									_push(`</div>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-8 w-24 rounded-lg" }, null, _parent, _scopeId));
									_push(`</div>`);
								});
								_push(`<!--]--></div>`);
							} else if ((0, vue_exports.unref)(enrollments).length === 0) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { class: "text-center py-16 glass-card" }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
											name: "i-heroicons-user-minus",
											class: "w-12 h-12 mx-auto mb-3 text-stone-300 dark:text-stone-700"
										}, null, _parent, _scopeId));
										_push(`<p class="text-stone-400" data-v-a6de758d${_scopeId}> Lớp học này chưa có đoàn sinh nào được xếp vào. </p>`);
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
											label: "Xếp đoàn sinh ngay",
											color: "primary",
											variant: "soft",
											class: "mt-4",
											onClick: openEnrollModal
										}, null, _parent, _scopeId));
									} else return [
										(0, vue_exports.createVNode)(_component_UIcon, {
											name: "i-heroicons-user-minus",
											class: "w-12 h-12 mx-auto mb-3 text-stone-300 dark:text-stone-700"
										}),
										(0, vue_exports.createVNode)("p", { class: "text-stone-400" }, " Lớp học này chưa có đoàn sinh nào được xếp vào. "),
										(0, vue_exports.createVNode)(_component_UButton, {
											label: "Xếp đoàn sinh ngay",
											color: "primary",
											variant: "soft",
											class: "mt-4",
											onClick: openEnrollModal
										})
									];
								}),
								_: 1
							}, _parent, _scopeId));
							else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { class: "glass-card overflow-hidden" }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTable, {
										data: (0, vue_exports.unref)(enrollments),
										columns
									}, {
										"fullName-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push(`<div class="font-bold text-stone-800 dark:text-white" data-v-a6de758d${_scopeId}><span class="text-primary-500 font-semibold mr-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.student?.holyName)}</span> ${(0, server_renderer_exports.ssrInterpolate)(row.original.student?.fullName)}</div>`);
											else return [(0, vue_exports.createVNode)("div", { class: "font-bold text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(row.original.student?.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(row.original.student?.fullName), 1)])];
										}),
										"birthDate-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(formatDate(row.original.student?.birthDate))}`);
											else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatDate(row.original.student?.birthDate)), 1)];
										}),
										"sacraments-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="flex gap-1" data-v-a6de758d${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
													label: "Rửa Tội",
													color: row.original.student?.baptismDate ? "success" : "neutral",
													variant: "subtle",
													size: "xs"
												}, null, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
													label: "Rước Lễ",
													color: row.original.student?.communionDate ? "success" : "neutral",
													variant: "subtle",
													size: "xs"
												}, null, _parent, _scopeId));
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
													label: "Thêm Sức",
													color: row.original.student?.confirmationDate ? "success" : "neutral",
													variant: "subtle",
													size: "xs"
												}, null, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "flex gap-1" }, [
												(0, vue_exports.createVNode)(_component_UBadge, {
													label: "Rửa Tội",
													color: row.original.student?.baptismDate ? "success" : "neutral",
													variant: "subtle",
													size: "xs"
												}, null, 8, ["color"]),
												(0, vue_exports.createVNode)(_component_UBadge, {
													label: "Rước Lễ",
													color: row.original.student?.communionDate ? "success" : "neutral",
													variant: "subtle",
													size: "xs"
												}, null, 8, ["color"]),
												(0, vue_exports.createVNode)(_component_UBadge, {
													label: "Thêm Sức",
													color: row.original.student?.confirmationDate ? "success" : "neutral",
													variant: "subtle",
													size: "xs"
												}, null, 8, ["color"])
											])];
										}),
										"actions-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
												icon: "i-heroicons-user-minus",
												color: "red",
												variant: "ghost",
												size: "xs",
												label: "Rút khỏi lớp",
												onClick: ($event) => unenrollStudent(row.original.id)
											}, null, _parent, _scopeId));
											else return [(0, vue_exports.createVNode)(_component_UButton, {
												icon: "i-heroicons-user-minus",
												color: "red",
												variant: "ghost",
												size: "xs",
												label: "Rút khỏi lớp",
												onClick: ($event) => unenrollStudent(row.original.id)
											}, null, 8, ["onClick"])];
										}),
										_: 1
									}, _parent, _scopeId));
									else return [(0, vue_exports.createVNode)(_component_UTable, {
										data: (0, vue_exports.unref)(enrollments),
										columns
									}, {
										"fullName-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "font-bold text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(row.original.student?.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(row.original.student?.fullName), 1)])]),
										"birthDate-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatDate(row.original.student?.birthDate)), 1)]),
										"sacraments-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex gap-1" }, [
											(0, vue_exports.createVNode)(_component_UBadge, {
												label: "Rửa Tội",
												color: row.original.student?.baptismDate ? "success" : "neutral",
												variant: "subtle",
												size: "xs"
											}, null, 8, ["color"]),
											(0, vue_exports.createVNode)(_component_UBadge, {
												label: "Rước Lễ",
												color: row.original.student?.communionDate ? "success" : "neutral",
												variant: "subtle",
												size: "xs"
											}, null, 8, ["color"]),
											(0, vue_exports.createVNode)(_component_UBadge, {
												label: "Thêm Sức",
												color: row.original.student?.confirmationDate ? "success" : "neutral",
												variant: "subtle",
												size: "xs"
											}, null, 8, ["color"])
										])]),
										"actions-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UButton, {
											icon: "i-heroicons-user-minus",
											color: "red",
											variant: "ghost",
											size: "xs",
											label: "Rút khỏi lớp",
											onClick: ($event) => unenrollStudent(row.original.id)
										}, null, 8, ["onClick"])]),
										_: 1
									}, 8, ["data"])];
								}),
								_: 1
							}, _parent, _scopeId));
							_push(`</div>`);
						} else if (activeTab.value === "grades") {
							_push(`<div class="space-y-4" data-v-a6de758d${_scopeId}><h3 class="text-xl font-bold flex items-center gap-2" data-v-a6de758d${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
								name: "i-heroicons-academic-cap",
								class: "text-primary-500"
							}, null, _parent, _scopeId));
							_push(` Sổ Điểm Điện Tử Lớp Học </h3>`);
							if (gradesList.value.length) _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-4" data-v-a6de758d${_scopeId}><div class="glass-card rounded-xl p-4 text-center" data-v-a6de758d${_scopeId}><p class="text-xs text-stone-400 font-bold uppercase" data-v-a6de758d${_scopeId}> Tổng Học Sinh </p><p class="text-3xl font-black text-stone-800 dark:text-white mt-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(gradesList.value.length)}</p></div><div class="glass-card rounded-xl p-4 text-center" data-v-a6de758d${_scopeId}><p class="text-xs text-emerald-500 font-bold uppercase" data-v-a6de758d${_scopeId}> Đạt / Lên Lớp </p><p class="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(gradesList.value.filter((g) => checkQualified(g)).length)}</p></div><div class="glass-card rounded-xl p-4 text-center" data-v-a6de758d${_scopeId}><p class="text-xs text-red-400 font-bold uppercase" data-v-a6de758d${_scopeId}> Học Lại </p><p class="text-3xl font-black text-red-500 mt-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(gradesList.value.filter((g) => !checkQualified(g)).length)}</p></div><div class="glass-card rounded-xl p-4 text-center" data-v-a6de758d${_scopeId}><p class="text-xs text-amber-500 font-bold uppercase" data-v-a6de758d${_scopeId}> ĐTB Trung Bình Lớp </p><p class="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(gradesList.value.length ? (gradesList.value.reduce((sum, g) => sum + calculateGPA(g), 0) / gradesList.value.length).toFixed(1) : "0.0")}</p></div></div>`);
							else _push(`<!---->`);
							if (!gradesList.value.length) {
								_push(`<div class="text-center py-20 glass-card rounded-2xl" data-v-a6de758d${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-inbox",
									class: "w-12 h-12 mx-auto mb-2 text-stone-300"
								}, null, _parent, _scopeId));
								_push(`<p class="text-stone-400 italic" data-v-a6de758d${_scopeId}> Lớp học chưa có đoàn sinh nào để nhập điểm. </p></div>`);
							} else {
								_push(`<div class="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl" data-v-a6de758d${_scopeId}><table class="w-full text-left border-collapse bg-white dark:bg-stone-900" data-v-a6de758d${_scopeId}><thead data-v-a6de758d${_scopeId}><tr class="bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850" data-v-a6de758d${_scopeId}><th class="p-4" data-v-a6de758d${_scopeId}> Đoàn Sinh </th><th class="p-4 text-center w-20" data-v-a6de758d${_scopeId}> Miệng </th><th class="p-4 text-center w-20" data-v-a6de758d${_scopeId}> 15 Phút </th><th class="p-4 text-center w-20" data-v-a6de758d${_scopeId}> 1 Tiết (x2) </th><th class="p-4 text-center w-20" data-v-a6de758d${_scopeId}> Học Kỳ (x3) </th><th class="p-4 text-center w-24" data-v-a6de758d${_scopeId}> Vắng </th><th class="p-4 text-center w-24" data-v-a6de758d${_scopeId}> Tổng Buổi </th><th class="p-4 text-center w-20" data-v-a6de758d${_scopeId}> ĐTB </th><th class="p-4 text-center w-28" data-v-a6de758d${_scopeId}> Trạng Thái </th></tr></thead><tbody class="divide-y divide-stone-100 dark:divide-stone-850 text-sm" data-v-a6de758d${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(gradesList.value, (grade) => {
									_push(`<tr class="${(0, server_renderer_exports.ssrRenderClass)(["transition-colors", checkQualified(grade) ? "hover:bg-stone-50/50 dark:hover:bg-stone-850/30" : "bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/60"])}" data-v-a6de758d${_scopeId}><td class="p-4" data-v-a6de758d${_scopeId}><div class="font-bold text-stone-800 dark:text-white" data-v-a6de758d${_scopeId}><span class="text-primary-500 font-semibold mr-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(grade.studentHolyName)}</span> ${(0, server_renderer_exports.ssrInterpolate)(grade.studentFullName)}</div></td><td class="p-2 text-center" data-v-a6de758d${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", grade.oral)} type="number" min="0" max="10" step="0.5" class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}></td><td class="p-2 text-center" data-v-a6de758d${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", grade.smallTest)} type="number" min="0" max="10" step="0.5" class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}></td><td class="p-2 text-center" data-v-a6de758d${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", grade.bigTest)} type="number" min="0" max="10" step="0.5" class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}></td><td class="p-2 text-center" data-v-a6de758d${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", grade.finalExam)} type="number" min="0" max="10" step="0.5" class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}></td><td class="p-2 text-center" data-v-a6de758d${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", grade.absences)} type="number" min="0" max="50" class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}></td><td class="p-2 text-center" data-v-a6de758d${_scopeId}><input${(0, server_renderer_exports.ssrRenderAttr)("value", grade.totalSessions)} type="number" min="1" max="100" class="w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}></td><td class="${(0, server_renderer_exports.ssrRenderClass)([calculateGPA(grade) >= 5 ? "text-emerald-500" : "text-red-500", "p-4 text-center font-black text-sm"])}" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(calculateGPA(grade))}</td><td class="p-4 text-center" data-v-a6de758d${_scopeId}>`);
									if (checkQualified(grade)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
										label: "LÊN LỚP",
										color: "success",
										variant: "solid",
										size: "xs",
										class: "font-black tracking-wider"
									}, null, _parent, _scopeId));
									else _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
										label: "HỌC LẠI",
										color: "error",
										variant: "solid",
										size: "xs",
										class: "font-black tracking-wider animate-pulse"
									}, null, _parent, _scopeId));
									_push(`</td></tr>`);
								});
								_push(`<!--]--></tbody></table></div>`);
							}
							_push(`</div>`);
						} else if (activeTab.value === "contacts") {
							_push(`<div class="space-y-4" data-v-a6de758d${_scopeId}><div class="flex items-center justify-between" data-v-a6de758d${_scopeId}><h3 class="text-xl font-bold flex items-center gap-2" data-v-a6de758d${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
								name: "i-heroicons-envelope",
								class: "text-primary-500"
							}, null, _parent, _scopeId));
							_push(` Sổ Liên Lạc Điện Tử </h3>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
								icon: "i-heroicons-document-arrow-down",
								label: "Xuất PDF Toàn Lớp",
								color: "rose",
								variant: "soft",
								onClick: exportContactBookPdf
							}, null, _parent, _scopeId));
							_push(`</div><p class="text-xs text-stone-400 italic" data-v-a6de758d${_scopeId}>Nhập nhận xét cuối kỳ và xếp loại Hạnh kiểm cho từng đoàn sinh. Dữ liệu sẽ tự động lưu khi bạn rời khỏi ô nhập.</p>`);
							if (!gradesList.value.length) {
								_push(`<div class="text-center py-16 glass-card rounded-2xl" data-v-a6de758d${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-inbox",
									class: "w-12 h-12 mx-auto mb-2 text-stone-300"
								}, null, _parent, _scopeId));
								_push(`<p class="text-stone-400 italic" data-v-a6de758d${_scopeId}>Lớp học chưa có đoàn sinh nào để viết sổ liên lạc.</p></div>`);
							} else {
								_push(`<div class="overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl" data-v-a6de758d${_scopeId}><table class="w-full text-left border-collapse bg-white dark:bg-stone-900" data-v-a6de758d${_scopeId}><thead data-v-a6de758d${_scopeId}><tr class="bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850" data-v-a6de758d${_scopeId}><th class="p-4" data-v-a6de758d${_scopeId}>Đoàn Sinh</th><th class="p-4 text-center w-32" data-v-a6de758d${_scopeId}>ĐTB Học Tập</th><th class="p-4 text-center w-36" data-v-a6de758d${_scopeId}>Hạnh Kiểm</th><th class="p-4" data-v-a6de758d${_scopeId}>Nhận Xét của Huynh Trưởng</th></tr></thead><tbody class="divide-y divide-stone-100 dark:divide-stone-850 text-sm" data-v-a6de758d${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(gradesList.value, (grade) => {
									_push(`<tr class="hover:bg-stone-50/50 dark:hover:bg-stone-850/30 transition-colors" data-v-a6de758d${_scopeId}><td class="p-4" data-v-a6de758d${_scopeId}><div class="font-bold text-stone-800 dark:text-white" data-v-a6de758d${_scopeId}><span class="text-primary-500 font-semibold mr-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(grade.studentHolyName)}</span> ${(0, server_renderer_exports.ssrInterpolate)(grade.studentFullName)}</div></td><td class="p-4 text-center" data-v-a6de758d${_scopeId}><span class="${(0, server_renderer_exports.ssrRenderClass)(["text-xl font-black", calculateGPA(grade) >= 8 ? "text-emerald-500" : calculateGPA(grade) >= 5 ? "text-amber-500" : "text-red-500"])}" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(calculateGPA(grade))}</span></td><td class="p-3 text-center" data-v-a6de758d${_scopeId}><select class="w-full p-1.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}><option value="" data-v-a6de758d${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(grade.conduct) ? (0, server_renderer_exports.ssrLooseContain)(grade.conduct, "") : (0, server_renderer_exports.ssrLooseEqual)(grade.conduct, "")) ? " selected" : ""}${_scopeId}>-- Chọn --</option><option value="excellent" data-v-a6de758d${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(grade.conduct) ? (0, server_renderer_exports.ssrLooseContain)(grade.conduct, "excellent") : (0, server_renderer_exports.ssrLooseEqual)(grade.conduct, "excellent")) ? " selected" : ""}${_scopeId}>Tốt</option><option value="good" data-v-a6de758d${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(grade.conduct) ? (0, server_renderer_exports.ssrLooseContain)(grade.conduct, "good") : (0, server_renderer_exports.ssrLooseEqual)(grade.conduct, "good")) ? " selected" : ""}${_scopeId}>Khá</option><option value="average" data-v-a6de758d${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(grade.conduct) ? (0, server_renderer_exports.ssrLooseContain)(grade.conduct, "average") : (0, server_renderer_exports.ssrLooseEqual)(grade.conduct, "average")) ? " selected" : ""}${_scopeId}>Trung Bình</option><option value="poor" data-v-a6de758d${(0, server_renderer_exports.ssrIncludeBooleanAttr)(Array.isArray(grade.conduct) ? (0, server_renderer_exports.ssrLooseContain)(grade.conduct, "poor") : (0, server_renderer_exports.ssrLooseEqual)(grade.conduct, "poor")) ? " selected" : ""}${_scopeId}>Yếu</option></select></td><td class="p-3" data-v-a6de758d${_scopeId}><textarea rows="2" placeholder="Nhận xét cá nhân..." class="w-full p-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(grade.teacherRemark)}</textarea></td></tr>`);
								});
								_push(`<!--]--></tbody></table></div>`);
							}
							_push(`</div>`);
						} else if (activeTab.value === "log") {
							_push(`<div class="space-y-4" data-v-a6de758d${_scopeId}><h3 class="text-xl font-bold flex items-center gap-2" data-v-a6de758d${_scopeId}>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
								name: "i-heroicons-clipboard-document-list",
								class: "text-primary-500"
							}, null, _parent, _scopeId));
							_push(` Nhật Ký Lớp </h3><p class="text-xs text-stone-400 italic" data-v-a6de758d${_scopeId}>Ghi chép nội bộ cho lớp học — dùng làm tư liệu khi viết nhận xét Sổ Liên Lạc cuối kỳ.</p>`);
							_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { class: "glass-card" }, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) {
										_push(`<div class="space-y-3" data-v-a6de758d${_scopeId}>`);
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTextarea, {
											modelValue: newLogEntry.value,
											"onUpdate:modelValue": ($event) => newLogEntry.value = $event,
											rows: 3,
											placeholder: "Ghi chép sự kiện, nhận xét về buổi học, hạnh kiểm đoàn sinh...",
											class: "w-full"
										}, null, _parent, _scopeId));
										_push(`<div class="flex justify-end" data-v-a6de758d${_scopeId}>`);
										_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
											icon: "i-heroicons-plus",
											label: "Lưu Ghi Chú",
											color: "primary",
											loading: isSavingLog.value,
											disabled: !newLogEntry.value.trim(),
											onClick: saveLogEntry
										}, null, _parent, _scopeId));
										_push(`</div></div>`);
									} else return [(0, vue_exports.createVNode)("div", { class: "space-y-3" }, [(0, vue_exports.createVNode)(_component_UTextarea, {
										modelValue: newLogEntry.value,
										"onUpdate:modelValue": ($event) => newLogEntry.value = $event,
										rows: 3,
										placeholder: "Ghi chép sự kiện, nhận xét về buổi học, hạnh kiểm đoàn sinh...",
										class: "w-full"
									}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("div", { class: "flex justify-end" }, [(0, vue_exports.createVNode)(_component_UButton, {
										icon: "i-heroicons-plus",
										label: "Lưu Ghi Chú",
										color: "primary",
										loading: isSavingLog.value,
										disabled: !newLogEntry.value.trim(),
										onClick: saveLogEntry
									}, null, 8, ["loading", "disabled"])])])];
								}),
								_: 1
							}, _parent, _scopeId));
							if (pendingLogs.value) {
								_push(`<div class="space-y-4 py-8 max-w-3xl" data-v-a6de758d${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(3, (i) => {
									_push(`<div class="flex gap-4" data-v-a6de758d${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-10 w-10 rounded-full flex-shrink-0" }, null, _parent, _scopeId));
									_push(`<div class="space-y-2 flex-1" data-v-a6de758d${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-4 w-1/4" }, null, _parent, _scopeId));
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-16 w-full rounded-xl" }, null, _parent, _scopeId));
									_push(`</div></div>`);
								});
								_push(`<!--]--></div>`);
							} else if (!classLogs.value.length) {
								_push(`<div class="text-center py-12 glass-card rounded-2xl" data-v-a6de758d${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-document-text",
									class: "w-12 h-12 mx-auto mb-2 text-stone-300"
								}, null, _parent, _scopeId));
								_push(`<p class="text-stone-400 italic" data-v-a6de758d${_scopeId}>Chưa có ghi chú nào trong nhật ký lớp.</p></div>`);
							} else {
								_push(`<div class="space-y-3" data-v-a6de758d${_scopeId}><!--[-->`);
								(0, server_renderer_exports.ssrRenderList)(classLogs.value, (log) => {
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
										key: log.id,
										class: "glass-card border-l-4 border-primary-200 dark:border-primary-800"
									}, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="flex items-start gap-3" data-v-a6de758d${_scopeId}><div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 mt-0.5" data-v-a6de758d${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
													name: "i-heroicons-pencil-square",
													class: "w-4 h-4 text-primary-500"
												}, null, _parent, _scopeId));
												_push(`</div><div class="flex-1 min-w-0" data-v-a6de758d${_scopeId}><div class="flex items-center justify-between gap-2 mb-1" data-v-a6de758d${_scopeId}><span class="text-xs font-bold text-stone-500" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(log.authorName || "GLV")}</span><span class="text-[10px] text-stone-400" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(log.createdAt))}</span></div><p class="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(log.content)}</p></div></div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "flex items-start gap-3" }, [(0, vue_exports.createVNode)("div", { class: "w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 mt-0.5" }, [(0, vue_exports.createVNode)(_component_UIcon, {
												name: "i-heroicons-pencil-square",
												class: "w-4 h-4 text-primary-500"
											})]), (0, vue_exports.createVNode)("div", { class: "flex-1 min-w-0" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center justify-between gap-2 mb-1" }, [(0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-500" }, (0, vue_exports.toDisplayString)(log.authorName || "GLV"), 1), (0, vue_exports.createVNode)("span", { class: "text-[10px] text-stone-400" }, (0, vue_exports.toDisplayString)(formatDate(log.createdAt)), 1)]), (0, vue_exports.createVNode)("p", { class: "text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line" }, (0, vue_exports.toDisplayString)(log.content), 1)])])];
										}),
										_: 2
									}, _parent, _scopeId));
								});
								_push(`<!--]--></div>`);
							}
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
							open: isEnrollModalOpen.value,
							"onUpdate:open": ($event) => isEnrollModalOpen.value = $event,
							title: "Xếp Đoàn Sinh Vào Lớp Hàng Loạt",
							size: "lg"
						}, {
							body: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="p-4 space-y-4" data-v-a6de758d${_scopeId}><p class="text-xs text-stone-500 italic" data-v-a6de758d${_scopeId}> Hiển thị danh sách đoàn sinh tự do thuộc Ngành hoặc Toàn đoàn chưa có lớp học trong niên khóa hiện tại. </p>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Tìm kiếm đoàn sinh" }, {
										default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
											if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
												modelValue: searchQuery.value,
												"onUpdate:modelValue": ($event) => searchQuery.value = $event,
												icon: "i-heroicons-magnifying-glass",
												placeholder: "Nhập tên Thánh, Họ tên học sinh...",
												class: "w-full"
											}, null, _parent, _scopeId));
											else return [(0, vue_exports.createVNode)(_component_UInput, {
												modelValue: searchQuery.value,
												"onUpdate:modelValue": ($event) => searchQuery.value = $event,
												icon: "i-heroicons-magnifying-glass",
												placeholder: "Nhập tên Thánh, Họ tên học sinh...",
												class: "w-full"
											}, null, 8, ["modelValue", "onUpdate:modelValue"])];
										}),
										_: 1
									}, _parent, _scopeId));
									if (pendingUnassigned.value) {
										_push(`<div class="space-y-4 py-8" data-v-a6de758d${_scopeId}><!--[-->`);
										(0, server_renderer_exports.ssrRenderList)(4, (i) => {
											_push(`<div class="flex items-center gap-3" data-v-a6de758d${_scopeId}>`);
											_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-5 w-5 rounded flex-shrink-0" }, null, _parent, _scopeId));
											_push(`<div class="space-y-2 flex-1" data-v-a6de758d${_scopeId}>`);
											_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-4 w-1/3" }, null, _parent, _scopeId));
											_push((0, server_renderer_exports.ssrRenderComponent)(_component_USkeleton, { class: "h-3 w-1/2" }, null, _parent, _scopeId));
											_push(`</div></div>`);
										});
										_push(`<!--]--></div>`);
									} else if (filteredUnassigned.value.length === 0) _push(`<div class="text-center py-10 text-stone-400 italic text-sm" data-v-a6de758d${_scopeId}> Không tìm thấy đoàn sinh tự do nào phù hợp. </div>`);
									else {
										_push(`<div class="max-h-[300px] overflow-y-auto border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800" data-v-a6de758d${_scopeId}><!--[-->`);
										(0, server_renderer_exports.ssrRenderList)(filteredUnassigned.value, (student) => {
											_push(`<div class="flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer" data-v-a6de758d${_scopeId}>`);
											_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCheckbox, {
												checked: selectedStudentIds.value.includes(student.id),
												onChange: ($event) => toggleSelectStudent(student.id)
											}, null, _parent, _scopeId));
											_push(`<div class="min-w-0 flex-1" data-v-a6de758d${_scopeId}><p class="font-bold text-sm text-stone-800 dark:text-white" data-v-a6de758d${_scopeId}><span class="text-primary-500 font-semibold mr-1" data-v-a6de758d${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(student.holyName)}</span> ${(0, server_renderer_exports.ssrInterpolate)(student.fullName)}</p><p class="text-xs text-stone-400" data-v-a6de758d${_scopeId}> Ngày sinh: ${(0, server_renderer_exports.ssrInterpolate)(formatDate(student.birthDate))} | Phân loại: Ngành ${(0, server_renderer_exports.ssrInterpolate)(getBranchName(student.branch))}</p></div></div>`);
										});
										_push(`<!--]--></div>`);
									}
									_push(`</div>`);
								} else return [(0, vue_exports.createVNode)("div", { class: "p-4 space-y-4" }, [
									(0, vue_exports.createVNode)("p", { class: "text-xs text-stone-500 italic" }, " Hiển thị danh sách đoàn sinh tự do thuộc Ngành hoặc Toàn đoàn chưa có lớp học trong niên khóa hiện tại. "),
									(0, vue_exports.createVNode)(_component_UFormField, { label: "Tìm kiếm đoàn sinh" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: searchQuery.value,
											"onUpdate:modelValue": ($event) => searchQuery.value = $event,
											icon: "i-heroicons-magnifying-glass",
											placeholder: "Nhập tên Thánh, Họ tên học sinh...",
											class: "w-full"
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}),
									pendingUnassigned.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										class: "space-y-4 py-8"
									}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(4, (i) => {
										return (0, vue_exports.createVNode)("div", {
											key: i,
											class: "flex items-center gap-3"
										}, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-5 w-5 rounded flex-shrink-0" }), (0, vue_exports.createVNode)("div", { class: "space-y-2 flex-1" }, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-4 w-1/3" }), (0, vue_exports.createVNode)(_component_USkeleton, { class: "h-3 w-1/2" })])]);
									}), 64))])) : filteredUnassigned.value.length === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										class: "text-center py-10 text-stone-400 italic text-sm"
									}, " Không tìm thấy đoàn sinh tự do nào phù hợp. ")) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 2,
										class: "max-h-[300px] overflow-y-auto border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800"
									}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredUnassigned.value, (student) => {
										return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: student.id,
											class: "flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer",
											onClick: ($event) => toggleSelectStudent(student.id)
										}, [(0, vue_exports.createVNode)(_component_UCheckbox, {
											checked: selectedStudentIds.value.includes(student.id),
											onChange: ($event) => toggleSelectStudent(student.id)
										}, null, 8, ["checked", "onChange"]), (0, vue_exports.createVNode)("div", { class: "min-w-0 flex-1" }, [(0, vue_exports.createVNode)("p", { class: "font-bold text-sm text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(student.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(student.fullName), 1)]), (0, vue_exports.createVNode)("p", { class: "text-xs text-stone-400" }, " Ngày sinh: " + (0, vue_exports.toDisplayString)(formatDate(student.birthDate)) + " | Phân loại: Ngành " + (0, vue_exports.toDisplayString)(getBranchName(student.branch)), 1)])], 8, ["onClick"]);
									}), 128))]))
								])];
							}),
							footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="flex justify-between items-center w-full" data-v-a6de758d${_scopeId}><span class="text-xs font-semibold text-stone-500" data-v-a6de758d${_scopeId}> Đã chọn: ${(0, server_renderer_exports.ssrInterpolate)(selectedStudentIds.value.length)} em </span><div class="flex gap-2" data-v-a6de758d${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
										label: "Hủy",
										color: "neutral",
										variant: "ghost",
										onClick: ($event) => isEnrollModalOpen.value = false
									}, null, _parent, _scopeId));
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
										label: "Xếp vào lớp",
										color: "primary",
										loading: isEnrolling.value,
										disabled: selectedStudentIds.value.length === 0,
										onClick: submitEnrollment
									}, null, _parent, _scopeId));
									_push(`</div></div>`);
								} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-between items-center w-full" }, [(0, vue_exports.createVNode)("span", { class: "text-xs font-semibold text-stone-500" }, " Đã chọn: " + (0, vue_exports.toDisplayString)(selectedStudentIds.value.length) + " em ", 1), (0, vue_exports.createVNode)("div", { class: "flex gap-2" }, [(0, vue_exports.createVNode)(_component_UButton, {
									label: "Hủy",
									color: "neutral",
									variant: "ghost",
									onClick: ($event) => isEnrollModalOpen.value = false
								}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
									label: "Xếp vào lớp",
									color: "primary",
									loading: isEnrolling.value,
									disabled: selectedStudentIds.value.length === 0,
									onClick: submitEnrollment
								}, null, 8, ["loading", "disabled"])])])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-sm text-stone-500" }, [
							(0, vue_exports.createVNode)(_component_NuxtLink, {
								to: "/admin/academic-years",
								class: "hover:text-primary-500 transition-colors"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)(" Niên Khóa ")]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-chevron-right",
								class: "w-4 h-4"
							}),
							(0, vue_exports.createVNode)(_component_NuxtLink, {
								to: `/admin/academic-years/${classRoom.value?.academicYearId}`,
								class: "hover:text-primary-500 transition-colors"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)(" Lớp Học ")]),
								_: 1
							}, 8, ["to"]),
							(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-chevron-right",
								class: "w-4 h-4"
							}),
							(0, vue_exports.createVNode)("span", { class: "font-semibold text-stone-800 dark:text-white" }, (0, vue_exports.toDisplayString)(classRoom.value?.className ?? "Lớp học"), 1)
						]),
						(0, vue_exports.createVNode)("div", { class: "glass-card rounded-2xl p-6 border border-white/20 dark:border-stone-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6" }, [(0, vue_exports.createVNode)("div", { class: "space-y-2 relative z-10" }, [
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 flex-wrap" }, [(0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-400 uppercase tracking-widest" }, "Chi tiết lớp học"), (0, vue_exports.createVNode)(_component_UBadge, {
								label: `Ngành ${getBranchName(classRoom.value?.branch)}`,
								color: getBranchColor(classRoom.value?.branch),
								variant: "solid",
								size: "xs"
							}, null, 8, ["label", "color"])]),
							(0, vue_exports.createVNode)("h1", { class: "text-3xl font-black text-stone-800 dark:text-white" }, (0, vue_exports.toDisplayString)(classRoom.value?.className), 1),
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-6 text-sm text-stone-500 flex-wrap" }, [(0, vue_exports.createVNode)("span", { class: "flex items-center gap-1.5" }, [
								(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-user",
									class: "text-primary-500 w-4 h-4"
								}),
								(0, vue_exports.createTextVNode)(" GLV Chủ nhiệm: "),
								(0, vue_exports.createVNode)("strong", { class: "text-stone-700 dark:text-stone-300" }, (0, vue_exports.toDisplayString)(classRoom.value?.mainTeacher || "Chưa phân công"), 1)
							]), classRoom.value?.roomName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								class: "flex items-center gap-1.5"
							}, [
								(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-map-pin",
									class: "text-amber-500 w-4 h-4"
								}),
								(0, vue_exports.createTextVNode)(" Phòng học: "),
								(0, vue_exports.createVNode)("strong", { class: "text-stone-700 dark:text-stone-300" }, (0, vue_exports.toDisplayString)(classRoom.value?.roomName), 1)
							])) : (0, vue_exports.createCommentVNode)("", true)])
						]), (0, vue_exports.createVNode)("div", { class: "flex gap-2 flex-shrink-0 relative z-10" }, [activeTab.value === "students" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UButton, {
							key: 0,
							icon: "i-heroicons-user-plus",
							label: "Xếp Lớp Hàng Loạt",
							color: "primary",
							onClick: openEnrollModal
						})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							class: "flex gap-2"
						}, [
							(0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-document-arrow-down",
								label: "Xuất Excel",
								color: "neutral",
								variant: "soft",
								onClick: exportGrades
							}),
							(0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-printer",
								label: "In PDF",
								color: "rose",
								variant: "soft",
								onClick: exportGradesPdf
							}),
							(0, vue_exports.createVNode)("div", { class: "flex items-center justify-end px-2" }, [saveStatus.value === "saving" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								class: "text-xs font-bold text-amber-500 flex items-center gap-1"
							}, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-arrow-path",
								class: "w-4 h-4 animate-spin"
							}), (0, vue_exports.createTextVNode)(" Đang lưu...")])) : saveStatus.value === "saved" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 1,
								class: "text-xs font-bold text-emerald-500 flex items-center gap-1"
							}, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-check-circle",
								class: "w-4 h-4"
							}), (0, vue_exports.createTextVNode)(" Đã lưu tự động")])) : saveStatus.value === "error" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 2,
								class: "text-xs font-bold text-red-500 flex items-center gap-1"
							}, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-x-circle",
								class: "w-4 h-4"
							}), (0, vue_exports.createTextVNode)(" Lỗi lưu")])) : (0, vue_exports.createCommentVNode)("", true)]),
							(0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-check-circle",
								label: "Force Save",
								color: "primary",
								variant: "outline",
								loading: isSavingGrades.value,
								onClick: saveGrades
							}, null, 8, ["loading"])
						]))])]),
						(0, vue_exports.createVNode)("div", { class: "flex border-b border-stone-200 dark:border-stone-850 gap-6 overflow-x-auto" }, [
							(0, vue_exports.createVNode)("button", {
								class: ["pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap", activeTab.value === "students" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600"],
								onClick: ($event) => activeTab.value = "students"
							}, " Danh Sách Đoàn Sinh ", 10, ["onClick"]),
							(0, vue_exports.createVNode)("button", {
								class: ["pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap", activeTab.value === "grades" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600"],
								onClick: ($event) => activeTab.value = "grades"
							}, " Sổ Điểm & Chuyên Cần ", 10, ["onClick"]),
							(0, vue_exports.createVNode)("button", {
								class: ["pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap", activeTab.value === "contacts" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600"],
								onClick: ($event) => activeTab.value = "contacts"
							}, " Sổ Liên Lạc ", 10, ["onClick"]),
							(0, vue_exports.createVNode)("button", {
								class: ["pb-3 text-sm font-extrabold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap", activeTab.value === "log" ? "border-primary-500 text-primary-500" : "border-transparent text-stone-400 hover:text-stone-600"],
								onClick: ($event) => activeTab.value = "log"
							}, " Nhật Ký Lớp ", 10, ["onClick"])
						]),
						(0, vue_exports.createVNode)("div", { class: "space-y-6" }, [activeTab.value === "students" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "space-y-4"
						}, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-bold flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-users",
							class: "text-primary-500"
						}), (0, vue_exports.createTextVNode)(" Danh Sách Đoàn Sinh (" + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(enrollments).length) + " em) ", 1)]), (0, vue_exports.unref)(pendingEnrollments) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 0,
							class: "flex flex-col gap-4 py-8 max-w-2xl mx-auto"
						}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(5, (i) => {
							return (0, vue_exports.createVNode)("div", {
								key: i,
								class: "flex items-center gap-4 animate-pulse"
							}, [
								(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-12 w-12 rounded-full" }),
								(0, vue_exports.createVNode)("div", { class: "space-y-2 flex-1" }, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-4 w-1/3" }), (0, vue_exports.createVNode)(_component_USkeleton, { class: "h-3 w-1/4" })]),
								(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-8 w-24 rounded-lg" })
							]);
						}), 64))])) : (0, vue_exports.unref)(enrollments).length === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UCard, {
							key: 1,
							class: "text-center py-16 glass-card"
						}, {
							default: (0, vue_exports.withCtx)(() => [
								(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-user-minus",
									class: "w-12 h-12 mx-auto mb-3 text-stone-300 dark:text-stone-700"
								}),
								(0, vue_exports.createVNode)("p", { class: "text-stone-400" }, " Lớp học này chưa có đoàn sinh nào được xếp vào. "),
								(0, vue_exports.createVNode)(_component_UButton, {
									label: "Xếp đoàn sinh ngay",
									color: "primary",
									variant: "soft",
									class: "mt-4",
									onClick: openEnrollModal
								})
							]),
							_: 1
						})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UCard, {
							key: 2,
							class: "glass-card overflow-hidden"
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTable, {
								data: (0, vue_exports.unref)(enrollments),
								columns
							}, {
								"fullName-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "font-bold text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(row.original.student?.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(row.original.student?.fullName), 1)])]),
								"birthDate-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(formatDate(row.original.student?.birthDate)), 1)]),
								"sacraments-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex gap-1" }, [
									(0, vue_exports.createVNode)(_component_UBadge, {
										label: "Rửa Tội",
										color: row.original.student?.baptismDate ? "success" : "neutral",
										variant: "subtle",
										size: "xs"
									}, null, 8, ["color"]),
									(0, vue_exports.createVNode)(_component_UBadge, {
										label: "Rước Lễ",
										color: row.original.student?.communionDate ? "success" : "neutral",
										variant: "subtle",
										size: "xs"
									}, null, 8, ["color"]),
									(0, vue_exports.createVNode)(_component_UBadge, {
										label: "Thêm Sức",
										color: row.original.student?.confirmationDate ? "success" : "neutral",
										variant: "subtle",
										size: "xs"
									}, null, 8, ["color"])
								])]),
								"actions-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UButton, {
									icon: "i-heroicons-user-minus",
									color: "red",
									variant: "ghost",
									size: "xs",
									label: "Rút khỏi lớp",
									onClick: ($event) => unenrollStudent(row.original.id)
								}, null, 8, ["onClick"])]),
								_: 1
							}, 8, ["data"])]),
							_: 1
						}))])) : activeTab.value === "grades" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 1,
							class: "space-y-4"
						}, [
							(0, vue_exports.createVNode)("h3", { class: "text-xl font-bold flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-academic-cap",
								class: "text-primary-500"
							}), (0, vue_exports.createTextVNode)(" Sổ Điểm Điện Tử Lớp Học ")]),
							gradesList.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "grid grid-cols-2 md:grid-cols-4 gap-4"
							}, [
								(0, vue_exports.createVNode)("div", { class: "glass-card rounded-xl p-4 text-center" }, [(0, vue_exports.createVNode)("p", { class: "text-xs text-stone-400 font-bold uppercase" }, " Tổng Học Sinh "), (0, vue_exports.createVNode)("p", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(gradesList.value.length), 1)]),
								(0, vue_exports.createVNode)("div", { class: "glass-card rounded-xl p-4 text-center" }, [(0, vue_exports.createVNode)("p", { class: "text-xs text-emerald-500 font-bold uppercase" }, " Đạt / Lên Lớp "), (0, vue_exports.createVNode)("p", { class: "text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1" }, (0, vue_exports.toDisplayString)(gradesList.value.filter((g) => checkQualified(g)).length), 1)]),
								(0, vue_exports.createVNode)("div", { class: "glass-card rounded-xl p-4 text-center" }, [(0, vue_exports.createVNode)("p", { class: "text-xs text-red-400 font-bold uppercase" }, " Học Lại "), (0, vue_exports.createVNode)("p", { class: "text-3xl font-black text-red-500 mt-1" }, (0, vue_exports.toDisplayString)(gradesList.value.filter((g) => !checkQualified(g)).length), 1)]),
								(0, vue_exports.createVNode)("div", { class: "glass-card rounded-xl p-4 text-center" }, [(0, vue_exports.createVNode)("p", { class: "text-xs text-amber-500 font-bold uppercase" }, " ĐTB Trung Bình Lớp "), (0, vue_exports.createVNode)("p", { class: "text-3xl font-black text-amber-600 dark:text-amber-400 mt-1" }, (0, vue_exports.toDisplayString)(gradesList.value.length ? (gradesList.value.reduce((sum, g) => sum + calculateGPA(g), 0) / gradesList.value.length).toFixed(1) : "0.0"), 1)])
							])) : (0, vue_exports.createCommentVNode)("", true),
							!gradesList.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "text-center py-20 glass-card rounded-2xl"
							}, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-inbox",
								class: "w-12 h-12 mx-auto mb-2 text-stone-300"
							}), (0, vue_exports.createVNode)("p", { class: "text-stone-400 italic" }, " Lớp học chưa có đoàn sinh nào để nhập điểm. ")])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								class: "overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl"
							}, [(0, vue_exports.createVNode)("table", { class: "w-full text-left border-collapse bg-white dark:bg-stone-900" }, [(0, vue_exports.createVNode)("thead", null, [(0, vue_exports.createVNode)("tr", { class: "bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850" }, [
								(0, vue_exports.createVNode)("th", { class: "p-4" }, " Đoàn Sinh "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-20" }, " Miệng "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-20" }, " 15 Phút "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-20" }, " 1 Tiết (x2) "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-20" }, " Học Kỳ (x3) "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-24" }, " Vắng "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-24" }, " Tổng Buổi "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-20" }, " ĐTB "),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-28" }, " Trạng Thái ")
							])]), (0, vue_exports.createVNode)("tbody", { class: "divide-y divide-stone-100 dark:divide-stone-850 text-sm" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(gradesList.value, (grade) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("tr", {
									key: grade.studentId,
									class: ["transition-colors", checkQualified(grade) ? "hover:bg-stone-50/50 dark:hover:bg-stone-850/30" : "bg-red-50/40 dark:bg-red-950/10 hover:bg-red-50/60"]
								}, [
									(0, vue_exports.createVNode)("td", { class: "p-4" }, [(0, vue_exports.createVNode)("div", { class: "font-bold text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(grade.studentHolyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(grade.studentFullName), 1)])]),
									(0, vue_exports.createVNode)("td", { class: "p-2 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
										"onUpdate:modelValue": ($event) => grade.oral = $event,
										type: "number",
										min: "0",
										max: "10",
										step: "0.5",
										class: "w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[
										vue_exports.vModelText,
										grade.oral,
										void 0,
										{ number: true }
									]])]),
									(0, vue_exports.createVNode)("td", { class: "p-2 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
										"onUpdate:modelValue": ($event) => grade.smallTest = $event,
										type: "number",
										min: "0",
										max: "10",
										step: "0.5",
										class: "w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[
										vue_exports.vModelText,
										grade.smallTest,
										void 0,
										{ number: true }
									]])]),
									(0, vue_exports.createVNode)("td", { class: "p-2 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
										"onUpdate:modelValue": ($event) => grade.bigTest = $event,
										type: "number",
										min: "0",
										max: "10",
										step: "0.5",
										class: "w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[
										vue_exports.vModelText,
										grade.bigTest,
										void 0,
										{ number: true }
									]])]),
									(0, vue_exports.createVNode)("td", { class: "p-2 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
										"onUpdate:modelValue": ($event) => grade.finalExam = $event,
										type: "number",
										min: "0",
										max: "10",
										step: "0.5",
										class: "w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[
										vue_exports.vModelText,
										grade.finalExam,
										void 0,
										{ number: true }
									]])]),
									(0, vue_exports.createVNode)("td", { class: "p-2 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
										"onUpdate:modelValue": ($event) => grade.absences = $event,
										type: "number",
										min: "0",
										max: "50",
										class: "w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[
										vue_exports.vModelText,
										grade.absences,
										void 0,
										{ number: true }
									]])]),
									(0, vue_exports.createVNode)("td", { class: "p-2 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("input", {
										"onUpdate:modelValue": ($event) => grade.totalSessions = $event,
										type: "number",
										min: "1",
										max: "100",
										class: "w-16 p-1 text-center bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[
										vue_exports.vModelText,
										grade.totalSessions,
										void 0,
										{ number: true }
									]])]),
									(0, vue_exports.createVNode)("td", { class: ["p-4 text-center font-black text-sm", calculateGPA(grade) >= 5 ? "text-emerald-500" : "text-red-500"] }, (0, vue_exports.toDisplayString)(calculateGPA(grade)), 3),
									(0, vue_exports.createVNode)("td", { class: "p-4 text-center" }, [checkQualified(grade) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UBadge, {
										key: 0,
										label: "LÊN LỚP",
										color: "success",
										variant: "solid",
										size: "xs",
										class: "font-black tracking-wider"
									})) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UBadge, {
										key: 1,
										label: "HỌC LẠI",
										color: "error",
										variant: "solid",
										size: "xs",
										class: "font-black tracking-wider animate-pulse"
									}))])
								], 2);
							}), 128))])])]))
						])) : activeTab.value === "contacts" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 2,
							class: "space-y-4"
						}, [
							(0, vue_exports.createVNode)("div", { class: "flex items-center justify-between" }, [(0, vue_exports.createVNode)("h3", { class: "text-xl font-bold flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-envelope",
								class: "text-primary-500"
							}), (0, vue_exports.createTextVNode)(" Sổ Liên Lạc Điện Tử ")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-document-arrow-down",
								label: "Xuất PDF Toàn Lớp",
								color: "rose",
								variant: "soft",
								onClick: exportContactBookPdf
							})]),
							(0, vue_exports.createVNode)("p", { class: "text-xs text-stone-400 italic" }, "Nhập nhận xét cuối kỳ và xếp loại Hạnh kiểm cho từng đoàn sinh. Dữ liệu sẽ tự động lưu khi bạn rời khỏi ô nhập."),
							!gradesList.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "text-center py-16 glass-card rounded-2xl"
							}, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-inbox",
								class: "w-12 h-12 mx-auto mb-2 text-stone-300"
							}), (0, vue_exports.createVNode)("p", { class: "text-stone-400 italic" }, "Lớp học chưa có đoàn sinh nào để viết sổ liên lạc.")])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "overflow-x-auto border border-stone-200 dark:border-stone-850 rounded-2xl shadow-xl"
							}, [(0, vue_exports.createVNode)("table", { class: "w-full text-left border-collapse bg-white dark:bg-stone-900" }, [(0, vue_exports.createVNode)("thead", null, [(0, vue_exports.createVNode)("tr", { class: "bg-stone-50 dark:bg-stone-950 text-xs font-black uppercase text-stone-500 tracking-wider border-b border-stone-200 dark:border-stone-850" }, [
								(0, vue_exports.createVNode)("th", { class: "p-4" }, "Đoàn Sinh"),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-32" }, "ĐTB Học Tập"),
								(0, vue_exports.createVNode)("th", { class: "p-4 text-center w-36" }, "Hạnh Kiểm"),
								(0, vue_exports.createVNode)("th", { class: "p-4" }, "Nhận Xét của Huynh Trưởng")
							])]), (0, vue_exports.createVNode)("tbody", { class: "divide-y divide-stone-100 dark:divide-stone-850 text-sm" }, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(gradesList.value, (grade) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("tr", {
									key: grade.studentId,
									class: "hover:bg-stone-50/50 dark:hover:bg-stone-850/30 transition-colors"
								}, [
									(0, vue_exports.createVNode)("td", { class: "p-4" }, [(0, vue_exports.createVNode)("div", { class: "font-bold text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(grade.studentHolyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(grade.studentFullName), 1)])]),
									(0, vue_exports.createVNode)("td", { class: "p-4 text-center" }, [(0, vue_exports.createVNode)("span", { class: ["text-xl font-black", calculateGPA(grade) >= 8 ? "text-emerald-500" : calculateGPA(grade) >= 5 ? "text-amber-500" : "text-red-500"] }, (0, vue_exports.toDisplayString)(calculateGPA(grade)), 3)]),
									(0, vue_exports.createVNode)("td", { class: "p-3 text-center" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("select", {
										"onUpdate:modelValue": ($event) => grade.conduct = $event,
										class: "w-full p-1.5 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white font-semibold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onChange: onGradeInput
									}, [
										(0, vue_exports.createVNode)("option", { value: "" }, "-- Chọn --"),
										(0, vue_exports.createVNode)("option", { value: "excellent" }, "Tốt"),
										(0, vue_exports.createVNode)("option", { value: "good" }, "Khá"),
										(0, vue_exports.createVNode)("option", { value: "average" }, "Trung Bình"),
										(0, vue_exports.createVNode)("option", { value: "poor" }, "Yếu")
									], 40, ["onUpdate:modelValue"]), [[vue_exports.vModelSelect, grade.conduct]])]),
									(0, vue_exports.createVNode)("td", { class: "p-3" }, [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)("textarea", {
										"onUpdate:modelValue": ($event) => grade.teacherRemark = $event,
										rows: "2",
										placeholder: "Nhận xét cá nhân...",
										class: "w-full p-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-white resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none",
										onInput: onGradeInput
									}, null, 40, ["onUpdate:modelValue"]), [[vue_exports.vModelText, grade.teacherRemark]])])
								]);
							}), 128))])])]))
						])) : activeTab.value === "log" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
							key: 3,
							class: "space-y-4"
						}, [
							(0, vue_exports.createVNode)("h3", { class: "text-xl font-bold flex items-center gap-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-clipboard-document-list",
								class: "text-primary-500"
							}), (0, vue_exports.createTextVNode)(" Nhật Ký Lớp ")]),
							(0, vue_exports.createVNode)("p", { class: "text-xs text-stone-400 italic" }, "Ghi chép nội bộ cho lớp học — dùng làm tư liệu khi viết nhận xét Sổ Liên Lạc cuối kỳ."),
							(0, vue_exports.createVNode)(_component_UCard, { class: "glass-card" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "space-y-3" }, [(0, vue_exports.createVNode)(_component_UTextarea, {
									modelValue: newLogEntry.value,
									"onUpdate:modelValue": ($event) => newLogEntry.value = $event,
									rows: 3,
									placeholder: "Ghi chép sự kiện, nhận xét về buổi học, hạnh kiểm đoàn sinh...",
									class: "w-full"
								}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("div", { class: "flex justify-end" }, [(0, vue_exports.createVNode)(_component_UButton, {
									icon: "i-heroicons-plus",
									label: "Lưu Ghi Chú",
									color: "primary",
									loading: isSavingLog.value,
									disabled: !newLogEntry.value.trim(),
									onClick: saveLogEntry
								}, null, 8, ["loading", "disabled"])])])]),
								_: 1
							}),
							pendingLogs.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 0,
								class: "space-y-4 py-8 max-w-3xl"
							}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(3, (i) => {
								return (0, vue_exports.createVNode)("div", {
									key: i,
									class: "flex gap-4"
								}, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-10 w-10 rounded-full flex-shrink-0" }), (0, vue_exports.createVNode)("div", { class: "space-y-2 flex-1" }, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-4 w-1/4" }), (0, vue_exports.createVNode)(_component_USkeleton, { class: "h-16 w-full rounded-xl" })])]);
							}), 64))])) : !classLogs.value.length ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 1,
								class: "text-center py-12 glass-card rounded-2xl"
							}, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-document-text",
								class: "w-12 h-12 mx-auto mb-2 text-stone-300"
							}), (0, vue_exports.createVNode)("p", { class: "text-stone-400 italic" }, "Chưa có ghi chú nào trong nhật ký lớp.")])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
								key: 2,
								class: "space-y-3"
							}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(classLogs.value, (log) => {
								return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UCard, {
									key: log.id,
									class: "glass-card border-l-4 border-primary-200 dark:border-primary-800"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-start gap-3" }, [(0, vue_exports.createVNode)("div", { class: "w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0 mt-0.5" }, [(0, vue_exports.createVNode)(_component_UIcon, {
										name: "i-heroicons-pencil-square",
										class: "w-4 h-4 text-primary-500"
									})]), (0, vue_exports.createVNode)("div", { class: "flex-1 min-w-0" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center justify-between gap-2 mb-1" }, [(0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-500" }, (0, vue_exports.toDisplayString)(log.authorName || "GLV"), 1), (0, vue_exports.createVNode)("span", { class: "text-[10px] text-stone-400" }, (0, vue_exports.toDisplayString)(formatDate(log.createdAt)), 1)]), (0, vue_exports.createVNode)("p", { class: "text-sm text-stone-700 dark:text-stone-300 whitespace-pre-line" }, (0, vue_exports.toDisplayString)(log.content), 1)])])]),
									_: 2
								}, 1024);
							}), 128))]))
						])) : (0, vue_exports.createCommentVNode)("", true)]),
						(0, vue_exports.createVNode)(_component_UModal, {
							open: isEnrollModalOpen.value,
							"onUpdate:open": ($event) => isEnrollModalOpen.value = $event,
							title: "Xếp Đoàn Sinh Vào Lớp Hàng Loạt",
							size: "lg"
						}, {
							body: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-4 space-y-4" }, [
								(0, vue_exports.createVNode)("p", { class: "text-xs text-stone-500 italic" }, " Hiển thị danh sách đoàn sinh tự do thuộc Ngành hoặc Toàn đoàn chưa có lớp học trong niên khóa hiện tại. "),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Tìm kiếm đoàn sinh" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: searchQuery.value,
										"onUpdate:modelValue": ($event) => searchQuery.value = $event,
										icon: "i-heroicons-magnifying-glass",
										placeholder: "Nhập tên Thánh, Họ tên học sinh...",
										class: "w-full"
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								pendingUnassigned.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 0,
									class: "space-y-4 py-8"
								}, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(4, (i) => {
									return (0, vue_exports.createVNode)("div", {
										key: i,
										class: "flex items-center gap-3"
									}, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-5 w-5 rounded flex-shrink-0" }), (0, vue_exports.createVNode)("div", { class: "space-y-2 flex-1" }, [(0, vue_exports.createVNode)(_component_USkeleton, { class: "h-4 w-1/3" }), (0, vue_exports.createVNode)(_component_USkeleton, { class: "h-3 w-1/2" })])]);
								}), 64))])) : filteredUnassigned.value.length === 0 ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 1,
									class: "text-center py-10 text-stone-400 italic text-sm"
								}, " Không tìm thấy đoàn sinh tự do nào phù hợp. ")) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
									key: 2,
									class: "max-h-[300px] overflow-y-auto border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800"
								}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredUnassigned.value, (student) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: student.id,
										class: "flex items-center gap-3 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer",
										onClick: ($event) => toggleSelectStudent(student.id)
									}, [(0, vue_exports.createVNode)(_component_UCheckbox, {
										checked: selectedStudentIds.value.includes(student.id),
										onChange: ($event) => toggleSelectStudent(student.id)
									}, null, 8, ["checked", "onChange"]), (0, vue_exports.createVNode)("div", { class: "min-w-0 flex-1" }, [(0, vue_exports.createVNode)("p", { class: "font-bold text-sm text-stone-800 dark:text-white" }, [(0, vue_exports.createVNode)("span", { class: "text-primary-500 font-semibold mr-1" }, (0, vue_exports.toDisplayString)(student.holyName), 1), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(student.fullName), 1)]), (0, vue_exports.createVNode)("p", { class: "text-xs text-stone-400" }, " Ngày sinh: " + (0, vue_exports.toDisplayString)(formatDate(student.birthDate)) + " | Phân loại: Ngành " + (0, vue_exports.toDisplayString)(getBranchName(student.branch)), 1)])], 8, ["onClick"]);
								}), 128))]))
							])]),
							footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-between items-center w-full" }, [(0, vue_exports.createVNode)("span", { class: "text-xs font-semibold text-stone-500" }, " Đã chọn: " + (0, vue_exports.toDisplayString)(selectedStudentIds.value.length) + " em ", 1), (0, vue_exports.createVNode)("div", { class: "flex gap-2" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "ghost",
								onClick: ($event) => isEnrollModalOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Xếp vào lớp",
								color: "primary",
								loading: isEnrolling.value,
								disabled: selectedStudentIds.value.length === 0,
								onClick: submitEnrollment
							}, null, 8, ["loading", "disabled"])])])]),
							_: 1
						}, 8, ["open", "onUpdate:open"])
					];
				}),
				_: 1
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/classrooms/[id].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var _id__default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-a6de758d"]]);

export { _id__default as default };
//# sourceMappingURL=_id_-DBha8gwT.mjs.map
