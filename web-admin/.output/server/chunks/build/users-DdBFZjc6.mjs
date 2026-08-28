import { c as useHead$1, e as useAuthStore, a as useToast, v as vue_exports, b as useApiFetch, s as server_renderer_exports, _ as _sfc_main$2, d as _sfc_main$3, f as _sfc_main$3$1, $ as $api } from '../virtual/entry.mjs';
import { _ as _sfc_main$a } from './SelectMenu-dKLm1tmu.mjs';
import { _ as _sfc_main$7 } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$8 } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$9 } from './Input-Bk0TlYbs.mjs';
import { _ as _sfc_main$6 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$4 } from './Card-CTTrlgZc.mjs';
import { _ as _sfc_main$1 } from './Container-C4Y98Up-.mjs';
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
import './useFilter-BEMR7loY.mjs';
import './useId-D2M6x4XU.mjs';
import './useTypeahead-UAu5CRpq.mjs';
import './useFormControl-DR703Aa5.mjs';
import './PopperArrow-akPD5Wa6.mjs';
import './VisuallyHiddenInput-DjK2EyXI.mjs';
import './utils-Dj6yoN4y.mjs';
import './esm-DyCVLeOU.mjs';

//#region pages/admin/users.vue
var _sfc_main = {
	__name: "users",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Quản Lý Tài Khoản - GiaoLy" });
		useAuthStore();
		const toast = useToast();
		const columns = [
			{
				accessorKey: "userInfo",
				header: "Người Dùng"
			},
			{
				accessorKey: "role",
				header: "Vai Trò / Quyền"
			},
			{
				accessorKey: "branch",
				header: "Ngành Phụ Trách"
			},
			{
				accessorKey: "createdAt",
				header: "Ngày Tạo"
			},
			{
				accessorKey: "actions",
				header: ""
			}
		];
		const isModalOpen = (0, vue_exports.ref)(false);
		const isEditing = (0, vue_exports.ref)(false);
		const isSubmitting = (0, vue_exports.ref)(false);
		const currentUserId = (0, vue_exports.ref)(null);
		const userForm = (0, vue_exports.reactive)({
			username: "",
			fullName: "",
			holyName: "",
			role: "Viewer",
			roleId: null,
			branch: "0",
			password: ""
		});
		const roleOptions = (0, vue_exports.ref)([]);
		const branchOptions = [
			{
				value: "0",
				label: "Tất cả (Chung)"
			},
			{
				value: "1",
				label: "Ấu Nhi"
			},
			{
				value: "2",
				label: "Thiếu Nhi"
			},
			{
				value: "3",
				label: "Nghĩa Sĩ"
			},
			{
				value: "4",
				label: "Hiệp Sĩ"
			}
		];
		const { data: users, pending, refresh } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/User", { default: () => [] })), __temp = await __temp, __restore(), __temp);
		const totalUsers = (0, vue_exports.computed)(() => users.value.length || 0);
		const totalAdmins = (0, vue_exports.computed)(() => users.value.filter((u) => getRoleLabel(u.roleId, u.role).toLowerCase().includes("admin") || String(u.role) === "1").length || 0);
		const totalTeachers = (0, vue_exports.computed)(() => users.value.filter((u) => !getRoleLabel(u.roleId, u.role).toLowerCase().includes("admin") && String(u.role) !== "1").length || 0);
		const getRoleLabel = (roleId, roleCode) => {
			const roleOpt = roleOptions.value.find((r) => r.value === roleId || r.code === roleCode);
			if (roleOpt) return roleOpt.label;
			return {
				1: "Admin",
				2: "Thư ký",
				3: "Mod",
				Viewer: "Giáo Lý Viên"
			}[roleCode] || roleCode;
		};
		const getRoleColor = (role) => {
			return {
				1: "error",
				2: "primary",
				3: "warning",
				Viewer: "neutral"
			}[role] || "neutral";
		};
		const getBranchName = (b) => {
			return {
				0: "Chi Đoàn Chung",
				1: "Ấu Nhi",
				2: "Thiếu Nhi",
				3: "Nghĩa Sĩ",
				4: "Hiệp Sĩ"
			}[b] || "Chi Đoàn Chung";
		};
		const getBranchColor = (b) => {
			return {
				0: "neutral",
				1: "green",
				2: "blue",
				3: "yellow",
				4: "error"
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
		const getActionItems = (row) => [[{
			label: "Chỉnh sửa tài khoản",
			icon: "i-heroicons-pencil-square",
			click: () => openEditModal(row)
		}], ...row.username !== "admin" ? [[{
			label: "Xóa tài khoản",
			icon: "i-heroicons-trash",
			color: "red",
			click: () => deleteUser(row.id)
		}]] : []];
		const openCreateModal = () => {
			isEditing.value = false;
			currentUserId.value = null;
			Object.assign(userForm, {
				username: "",
				fullName: "",
				holyName: "",
				role: "Viewer",
				roleId: null,
				branch: "0",
				password: ""
			});
			isModalOpen.value = true;
		};
		const openEditModal = (user) => {
			isEditing.value = true;
			currentUserId.value = user.id;
			Object.assign(userForm, {
				username: user.username,
				fullName: user.fullName,
				holyName: user.holyName || "",
				role: user.role,
				roleId: user.roleId || user.role,
				branch: String(user.branch || 0),
				password: ""
			});
			isModalOpen.value = true;
		};
		const handleSubmit = async () => {
			isSubmitting.value = true;
			try {
				const payload = {
					fullName: userForm.fullName,
					holyName: userForm.holyName,
					role: "Viewer",
					roleId: userForm.roleId,
					branch: parseInt(userForm.branch),
					password: userForm.password || void 0
				};
				if (isEditing.value) {
					await $api(`/User/${currentUserId.value}`, {
						method: "PUT",
						body: payload
					});
					toast.add({
						title: "Cập nhật thành công!",
						color: "success"
					});
				} else {
					await $api("/User", {
						method: "POST",
						body: {
							username: userForm.username,
							fullName: userForm.fullName,
							holyName: userForm.holyName,
							role: "Viewer",
							roleId: userForm.roleId,
							branch: parseInt(userForm.branch),
							password: userForm.password
						}
					});
					toast.add({
						title: "Tạo tài khoản thành công!",
						color: "success"
					});
				}
				isModalOpen.value = false;
				await refresh();
			} catch (error) {
				toast.add({
					title: "Lỗi xử lý",
					description: error.data?.message || "Vui lòng kiểm tra lại.",
					color: "error"
				});
			} finally {
				isSubmitting.value = false;
			}
		};
		const deleteUser = async (id) => {
			if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này? Hành động không thể hoàn tác!")) return;
			try {
				await $api(`/User/${id}`, { method: "DELETE" });
				toast.add({
					title: "Đã xóa tài khoản",
					color: "success"
				});
				await refresh();
			} catch (error) {
				toast.add({
					title: "Lỗi khi xóa",
					description: error.data?.message,
					color: "error"
				});
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UContainer = _sfc_main$1;
			const _component_UIcon = _sfc_main$2;
			const _component_UButton = _sfc_main$3;
			const _component_UCard = _sfc_main$4;
			const _component_UTable = _sfc_main$5;
			const _component_UAvatar = _sfc_main$3$1;
			const _component_UBadge = _sfc_main$6;
			const _component_UDropdown = (0, vue_exports.resolveComponent)("UDropdown");
			const _component_UModal = _sfc_main$7;
			const _component_UFormField = _sfc_main$8;
			const _component_UInput = _sfc_main$9;
			const _component_USelectMenu = _sfc_main$a;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen bg-stone-50/50 dark:bg-stone-950/50 font-sans relative pb-24" }, _attrs))}><div class="fixed inset-0 overflow-hidden pointer-events-none z-0"><div class="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 dark:opacity-10 animate-blob bg-blue-100 dark:bg-blue-900"></div><div class="absolute top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-30 dark:opacity-10 animate-blob animation-delay-2000 bg-emerald-100 dark:bg-emerald-900"></div><div class="absolute -bottom-[20%] right-[20%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-4000 bg-amber-100 dark:bg-amber-900"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UContainer, { class: "relative z-10 py-10 space-y-8 animate-fade-in-up" }, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="flex flex-col md:flex-row md:items-end justify-between gap-6"${_scopeId}><div${_scopeId}><div class="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-shield-check",
							class: "w-4 h-4"
						}, null, _parent, _scopeId));
						_push(`<span${_scopeId}>Phân hệ Quản trị</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-900 dark:text-white flex items-center gap-3 drop-shadow-sm uppercase tracking-tight"${_scopeId}> Quản Lý <span class="text-primary-500"${_scopeId}>Tài Khoản</span></h1><p class="text-stone-500 text-sm mt-2 font-serif italic"${_scopeId}> Kiểm soát quyền truy cập và phân bổ nhân sự cho các Chi Đoàn. </p></div><div class="shrink-0 flex gap-3"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
							icon: "i-heroicons-user-plus",
							label: "Thêm Tài Khoản",
							color: "primary",
							variant: "solid",
							size: "lg",
							class: "rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform",
							onClick: openCreateModal
						}, null, _parent, _scopeId));
						_push(`</div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
							class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5",
							ui: { body: { padding: "p-6" } }
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="flex items-center gap-4"${_scopeId}><div class="p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl shadow-inner"${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
										name: "i-heroicons-users",
										class: "w-8 h-8"
									}, null, _parent, _scopeId));
									_push(`</div><div${_scopeId}><p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest"${_scopeId}>Tổng Tài Khoản</p><h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(totalUsers.value)}</h2></div></div>`);
								} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-users",
									class: "w-8 h-8"
								})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest" }, "Tổng Tài Khoản"), (0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(totalUsers.value), 1)])])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
							class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5",
							ui: { body: { padding: "p-6" } }
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="flex items-center gap-4"${_scopeId}><div class="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner"${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
										name: "i-heroicons-key",
										class: "w-8 h-8"
									}, null, _parent, _scopeId));
									_push(`</div><div${_scopeId}><p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest"${_scopeId}>Ban Quản Trị</p><h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(totalAdmins.value)}</h2></div></div>`);
								} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-key",
									class: "w-8 h-8"
								})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest" }, "Ban Quản Trị"), (0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(totalAdmins.value), 1)])])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, {
							class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5",
							ui: { body: { padding: "p-6" } }
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) {
									_push(`<div class="flex items-center gap-4"${_scopeId}><div class="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner"${_scopeId}>`);
									_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
										name: "i-heroicons-academic-cap",
										class: "w-8 h-8"
									}, null, _parent, _scopeId));
									_push(`</div><div${_scopeId}><p class="text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest"${_scopeId}>Giáo Lý Viên</p><h2 class="text-3xl font-black text-stone-800 dark:text-white mt-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(totalTeachers.value)}</h2></div></div>`);
								} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-academic-cap",
									class: "w-8 h-8"
								})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest" }, "Giáo Lý Viên"), (0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(totalTeachers.value), 1)])])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
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
										rows: (0, vue_exports.unref)(users),
										columns,
										loading: (0, vue_exports.unref)(pending),
										"empty-state": {
											icon: "i-heroicons-users",
											header: "Chưa có dữ liệu tài khoản"
										},
										ui: {
											th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50" },
											td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4" },
											tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group" }
										}
									}, {
										"userInfo-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="flex items-center gap-4 pl-2"${_scopeId}><div class="relative"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UAvatar, {
													alt: row.original.fullName || "User",
													ui: {
														background: "bg-primary-100 dark:bg-primary-900",
														text: "text-primary-600 dark:text-primary-300 font-bold"
													},
													size: "md",
													class: "shadow-sm border-2 border-white dark:border-stone-800"
												}, null, _parent, _scopeId));
												_push(`<span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full shadow-sm"${_scopeId}></span></div><div class="block py-1"${_scopeId}><p class="font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.fullName)}</p><div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400"${_scopeId}>`);
												if (row.original.holyName) _push(`<span${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(row.original.holyName)}</span>`);
												else _push(`<!---->`);
												if (row.original.holyName) _push(`<span${_scopeId}>•</span>`);
												else _push(`<!---->`);
												_push(`<span class="text-stone-500"${_scopeId}>@${(0, server_renderer_exports.ssrInterpolate)(row.original.username)}</span></div></div></div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4 pl-2" }, [(0, vue_exports.createVNode)("div", { class: "relative" }, [(0, vue_exports.createVNode)(_component_UAvatar, {
												alt: row.original.fullName || "User",
												ui: {
													background: "bg-primary-100 dark:bg-primary-900",
													text: "text-primary-600 dark:text-primary-300 font-bold"
												},
												size: "md",
												class: "shadow-sm border-2 border-white dark:border-stone-800"
											}, null, 8, ["alt"]), (0, vue_exports.createVNode)("span", { class: "absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full shadow-sm" })]), (0, vue_exports.createVNode)("div", { class: "block py-1" }, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" }, (0, vue_exports.toDisplayString)(row.original.fullName), 1), (0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400" }, [
												row.original.holyName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 0 }, (0, vue_exports.toDisplayString)(row.original.holyName), 1)) : (0, vue_exports.createCommentVNode)("", true),
												row.original.holyName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 1 }, "•")) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.createVNode)("span", { class: "text-stone-500" }, "@" + (0, vue_exports.toDisplayString)(row.original.username), 1)
											])])])];
										}),
										"role-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
												color: getRoleColor(row.original.role),
												variant: "subtle",
												size: "sm",
												class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
											}, {
												default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
													if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(getRoleLabel(row.original.roleId, row.original.role))}`);
													else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getRoleLabel(row.original.roleId, row.original.role)), 1)];
												}),
												_: 2
											}, _parent, _scopeId));
											else return [(0, vue_exports.createVNode)(_component_UBadge, {
												color: getRoleColor(row.original.role),
												variant: "subtle",
												size: "sm",
												class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getRoleLabel(row.original.roleId, row.original.role)), 1)]),
												_: 2
											}, 1032, ["color"])];
										}),
										"branch-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
												color: getBranchColor(row.original.branch),
												variant: "soft",
												size: "sm",
												class: "font-black uppercase tracking-widest px-3 rounded-xl"
											}, {
												default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
													if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)(getBranchName(row.original.branch))}`);
													else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)];
												}),
												_: 2
											}, _parent, _scopeId));
											else return [(0, vue_exports.createVNode)(_component_UBadge, {
												color: getBranchColor(row.original.branch),
												variant: "soft",
												size: "sm",
												class: "font-black uppercase tracking-widest px-3 rounded-xl"
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)]),
												_: 2
											}, 1032, ["color"])];
										}),
										"createdAt-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) _push(`<span class="text-sm font-semibold text-stone-500 dark:text-stone-400"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(formatDate(row.original.createdAt))}</span>`);
											else return [(0, vue_exports.createVNode)("span", { class: "text-sm font-semibold text-stone-500 dark:text-stone-400" }, (0, vue_exports.toDisplayString)(formatDate(row.original.createdAt)), 1)];
										}),
										"actions-cell": (0, vue_exports.withCtx)(({ row }, _push, _parent, _scopeId) => {
											if (_push) {
												_push(`<div class="flex justify-end pr-2"${_scopeId}>`);
												_push((0, server_renderer_exports.ssrRenderComponent)(_component_UDropdown, {
													items: getActionItems(row.original),
													popper: { placement: "bottom-end" }
												}, {
													default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
														if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
															color: "neutral",
															variant: "ghost",
															icon: "i-heroicons-ellipsis-horizontal",
															size: "md",
															class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
														}, null, _parent, _scopeId));
														else return [(0, vue_exports.createVNode)(_component_UButton, {
															color: "neutral",
															variant: "ghost",
															icon: "i-heroicons-ellipsis-horizontal",
															size: "md",
															class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
														})];
													}),
													_: 2
												}, _parent, _scopeId));
												_push(`</div>`);
											} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end pr-2" }, [(0, vue_exports.createVNode)(_component_UDropdown, {
												items: getActionItems(row.original),
												popper: { placement: "bottom-end" }
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UButton, {
													color: "neutral",
													variant: "ghost",
													icon: "i-heroicons-ellipsis-horizontal",
													size: "md",
													class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
												})]),
												_: 1
											}, 8, ["items"])])];
										}),
										_: 1
									}, _parent, _scopeId));
									_push(`<div class="flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md"${_scopeId}><span class="text-sm font-bold text-stone-500"${_scopeId}> Hiển thị <b class="text-primary-600 dark:text-primary-400 text-lg mx-1"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(users).length)}</b> tài khoản </span></div>`);
								} else return [(0, vue_exports.createVNode)(_component_UTable, {
									rows: (0, vue_exports.unref)(users),
									columns,
									loading: (0, vue_exports.unref)(pending),
									"empty-state": {
										icon: "i-heroicons-users",
										header: "Chưa có dữ liệu tài khoản"
									},
									ui: {
										th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50" },
										td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4" },
										tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group" }
									}
								}, {
									"userInfo-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4 pl-2" }, [(0, vue_exports.createVNode)("div", { class: "relative" }, [(0, vue_exports.createVNode)(_component_UAvatar, {
										alt: row.original.fullName || "User",
										ui: {
											background: "bg-primary-100 dark:bg-primary-900",
											text: "text-primary-600 dark:text-primary-300 font-bold"
										},
										size: "md",
										class: "shadow-sm border-2 border-white dark:border-stone-800"
									}, null, 8, ["alt"]), (0, vue_exports.createVNode)("span", { class: "absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full shadow-sm" })]), (0, vue_exports.createVNode)("div", { class: "block py-1" }, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" }, (0, vue_exports.toDisplayString)(row.original.fullName), 1), (0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400" }, [
										row.original.holyName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 0 }, (0, vue_exports.toDisplayString)(row.original.holyName), 1)) : (0, vue_exports.createCommentVNode)("", true),
										row.original.holyName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 1 }, "•")) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.createVNode)("span", { class: "text-stone-500" }, "@" + (0, vue_exports.toDisplayString)(row.original.username), 1)
									])])])]),
									"role-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
										color: getRoleColor(row.original.role),
										variant: "subtle",
										size: "sm",
										class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getRoleLabel(row.original.roleId, row.original.role)), 1)]),
										_: 2
									}, 1032, ["color"])]),
									"branch-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
										color: getBranchColor(row.original.branch),
										variant: "soft",
										size: "sm",
										class: "font-black uppercase tracking-widest px-3 rounded-xl"
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)]),
										_: 2
									}, 1032, ["color"])]),
									"createdAt-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("span", { class: "text-sm font-semibold text-stone-500 dark:text-stone-400" }, (0, vue_exports.toDisplayString)(formatDate(row.original.createdAt)), 1)]),
									"actions-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex justify-end pr-2" }, [(0, vue_exports.createVNode)(_component_UDropdown, {
										items: getActionItems(row.original),
										popper: { placement: "bottom-end" }
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UButton, {
											color: "neutral",
											variant: "ghost",
											icon: "i-heroicons-ellipsis-horizontal",
											size: "md",
											class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
										})]),
										_: 1
									}, 8, ["items"])])]),
									_: 1
								}, 8, ["rows", "loading"]), (0, vue_exports.createVNode)("div", { class: "flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md" }, [(0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-500" }, [
									(0, vue_exports.createTextVNode)(" Hiển thị "),
									(0, vue_exports.createVNode)("b", { class: "text-primary-600 dark:text-primary-400 text-lg mx-1" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(users).length), 1),
									(0, vue_exports.createTextVNode)(" tài khoản ")
								])])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)("div", { class: "flex flex-col md:flex-row md:items-end justify-between gap-6" }, [(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("div", { class: "inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-white/60 dark:bg-stone-900/40 backdrop-blur-md border border-white/40 dark:border-stone-700/50 shadow-sm text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-shield-check",
								class: "w-4 h-4"
							}), (0, vue_exports.createVNode)("span", null, "Phân hệ Quản trị")]),
							(0, vue_exports.createVNode)("h1", { class: "text-3xl md:text-4xl font-black text-stone-900 dark:text-white flex items-center gap-3 drop-shadow-sm uppercase tracking-tight" }, [(0, vue_exports.createTextVNode)(" Quản Lý "), (0, vue_exports.createVNode)("span", { class: "text-primary-500" }, "Tài Khoản")]),
							(0, vue_exports.createVNode)("p", { class: "text-stone-500 text-sm mt-2 font-serif italic" }, " Kiểm soát quyền truy cập và phân bổ nhân sự cho các Chi Đoàn. ")
						]), (0, vue_exports.createVNode)("div", { class: "shrink-0 flex gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-user-plus",
							label: "Thêm Tài Khoản",
							color: "primary",
							variant: "solid",
							size: "lg",
							class: "rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 bg-gradient-to-r from-primary-600 to-primary-500 hover:-translate-y-0.5 transition-transform",
							onClick: openCreateModal
						})])]),
						(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-100" }, [
							(0, vue_exports.createVNode)(_component_UCard, {
								class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5",
								ui: { body: { padding: "p-6" } }
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-users",
									class: "w-8 h-8"
								})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest" }, "Tổng Tài Khoản"), (0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(totalUsers.value), 1)])])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UCard, {
								class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5",
								ui: { body: { padding: "p-6" } }
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-key",
									class: "w-8 h-8"
								})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest" }, "Ban Quản Trị"), (0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(totalAdmins.value), 1)])])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UCard, {
								class: "bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/50 dark:border-stone-800 rounded-[2rem] shadow-xl shadow-black/5",
								ui: { body: { padding: "p-6" } }
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4" }, [(0, vue_exports.createVNode)("div", { class: "p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-academic-cap",
									class: "w-8 h-8"
								})]), (0, vue_exports.createVNode)("div", null, [(0, vue_exports.createVNode)("p", { class: "text-stone-500 dark:text-stone-400 text-sm font-bold uppercase tracking-widest" }, "Giáo Lý Viên"), (0, vue_exports.createVNode)("h2", { class: "text-3xl font-black text-stone-800 dark:text-white mt-1" }, (0, vue_exports.toDisplayString)(totalTeachers.value), 1)])])]),
								_: 1
							})
						]),
						(0, vue_exports.createVNode)(_component_UCard, {
							class: "bg-white/40 dark:bg-stone-900/40 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/40 border border-white/50 dark:border-stone-800 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200",
							ui: { body: {
								padding: "p-0",
								base: "overflow-x-auto"
							} }
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTable, {
								rows: (0, vue_exports.unref)(users),
								columns,
								loading: (0, vue_exports.unref)(pending),
								"empty-state": {
									icon: "i-heroicons-users",
									header: "Chưa có dữ liệu tài khoản"
								},
								ui: {
									th: { base: "bg-stone-100/50 dark:bg-stone-900/50 font-black uppercase tracking-widest text-[10px] text-stone-500 py-5 border-b border-white/40 dark:border-stone-800/50" },
									td: { base: "whitespace-nowrap border-b border-stone-200/20 dark:border-stone-800/20 py-4" },
									tr: { base: "hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group" }
								}
							}, {
								"userInfo-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-4 pl-2" }, [(0, vue_exports.createVNode)("div", { class: "relative" }, [(0, vue_exports.createVNode)(_component_UAvatar, {
									alt: row.original.fullName || "User",
									ui: {
										background: "bg-primary-100 dark:bg-primary-900",
										text: "text-primary-600 dark:text-primary-300 font-bold"
									},
									size: "md",
									class: "shadow-sm border-2 border-white dark:border-stone-800"
								}, null, 8, ["alt"]), (0, vue_exports.createVNode)("span", { class: "absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-stone-800 rounded-full shadow-sm" })]), (0, vue_exports.createVNode)("div", { class: "block py-1" }, [(0, vue_exports.createVNode)("p", { class: "font-black text-stone-800 dark:text-white text-base leading-none mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" }, (0, vue_exports.toDisplayString)(row.original.fullName), 1), (0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-stone-400" }, [
									row.original.holyName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 0 }, (0, vue_exports.toDisplayString)(row.original.holyName), 1)) : (0, vue_exports.createCommentVNode)("", true),
									row.original.holyName ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", { key: 1 }, "•")) : (0, vue_exports.createCommentVNode)("", true),
									(0, vue_exports.createVNode)("span", { class: "text-stone-500" }, "@" + (0, vue_exports.toDisplayString)(row.original.username), 1)
								])])])]),
								"role-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
									color: getRoleColor(row.original.role),
									variant: "subtle",
									size: "sm",
									class: "font-black uppercase tracking-widest px-3 rounded-xl shadow-inner"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getRoleLabel(row.original.roleId, row.original.role)), 1)]),
									_: 2
								}, 1032, ["color"])]),
								"branch-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)(_component_UBadge, {
									color: getBranchColor(row.original.branch),
									variant: "soft",
									size: "sm",
									class: "font-black uppercase tracking-widest px-3 rounded-xl"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(getBranchName(row.original.branch)), 1)]),
									_: 2
								}, 1032, ["color"])]),
								"createdAt-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("span", { class: "text-sm font-semibold text-stone-500 dark:text-stone-400" }, (0, vue_exports.toDisplayString)(formatDate(row.original.createdAt)), 1)]),
								"actions-cell": (0, vue_exports.withCtx)(({ row }) => [(0, vue_exports.createVNode)("div", { class: "flex justify-end pr-2" }, [(0, vue_exports.createVNode)(_component_UDropdown, {
									items: getActionItems(row.original),
									popper: { placement: "bottom-end" }
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UButton, {
										color: "neutral",
										variant: "ghost",
										icon: "i-heroicons-ellipsis-horizontal",
										size: "md",
										class: "rounded-xl opacity-50 group-hover:opacity-100 transition-opacity bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700"
									})]),
									_: 1
								}, 8, ["items"])])]),
								_: 1
							}, 8, ["rows", "loading"]), (0, vue_exports.createVNode)("div", { class: "flex justify-between items-center px-6 py-4 border-t border-white/30 dark:border-stone-800/50 bg-stone-100/30 dark:bg-stone-900/30 backdrop-blur-md" }, [(0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-stone-500" }, [
								(0, vue_exports.createTextVNode)(" Hiển thị "),
								(0, vue_exports.createVNode)("b", { class: "text-primary-600 dark:text-primary-400 text-lg mx-1" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(users).length), 1),
								(0, vue_exports.createTextVNode)(" tài khoản ")
							])])]),
							_: 1
						})
					];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: isModalOpen.value,
				"onUpdate:open": ($event) => isModalOpen.value = $event,
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
								_push(`<div class="bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: isEditing.value ? "i-heroicons-pencil-square" : "i-heroicons-user-plus",
									class: "w-6 h-6 text-white"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(isEditing.value ? "Cập Nhật Tài Khoản" : "Thêm Tài Khoản Mới")}</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isModalOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: isEditing.value ? "i-heroicons-pencil-square" : "i-heroicons-user-plus",
								class: "w-6 h-6 text-white"
							}, null, 8, ["name"])]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)(isEditing.value ? "Cập Nhật Tài Khoản" : "Thêm Tài Khoản Mới"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
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
									label: "Hủy bỏ",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isModalOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									type: "submit",
									form: "user-form",
									label: isEditing.value ? "Lưu Cập Nhật" : "Hoàn Tất Tạo",
									color: "primary",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider",
									loading: isSubmitting.value
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy bỏ",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isModalOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								type: "submit",
								form: "user-form",
								label: isEditing.value ? "Lưu Cập Nhật" : "Hoàn Tất Tạo",
								color: "primary",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider",
								loading: isSubmitting.value
							}, null, 8, ["label", "loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<form id="user-form" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8"${_scopeId}><div class="space-y-5"${_scopeId}><div class="flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-server-stack",
									class: "w-5 h-5 text-stone-400"
								}, null, _parent, _scopeId));
								_push(`<h4 class="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs"${_scopeId}>Hệ Thống</h4></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Tên đăng nhập",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: userForm.username,
											"onUpdate:modelValue": ($event) => userForm.username = $event,
											icon: "i-heroicons-at-symbol",
											placeholder: "nguyenvana",
											disabled: isEditing.value,
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: userForm.username,
											"onUpdate:modelValue": ($event) => userForm.username = $event,
											icon: "i-heroicons-at-symbol",
											placeholder: "nguyenvana",
											disabled: isEditing.value,
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"disabled"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: isEditing.value ? "Mật khẩu mới (Để trống nếu giữ nguyên)" : "Mật khẩu",
									required: !isEditing.value
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: userForm.password,
											"onUpdate:modelValue": ($event) => userForm.password = $event,
											type: "password",
											icon: "i-heroicons-key",
											placeholder: "••••••••",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: userForm.password,
											"onUpdate:modelValue": ($event) => userForm.password = $event,
											type: "password",
											icon: "i-heroicons-key",
											placeholder: "••••••••",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Quyền hạn / Chức vụ" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: userForm.roleId,
											"onUpdate:modelValue": ($event) => userForm.roleId = $event,
											options: roleOptions.value,
											"value-attribute": "value",
											"option-attribute": "label",
											icon: "i-heroicons-shield-check",
											placeholder: "Chọn quyền...",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: userForm.roleId,
											"onUpdate:modelValue": ($event) => userForm.roleId = $event,
											options: roleOptions.value,
											"value-attribute": "value",
											"option-attribute": "label",
											icon: "i-heroicons-shield-check",
											placeholder: "Chọn quyền...",
											size: "lg",
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
								_push(`</div><div class="space-y-5"${_scopeId}><div class="flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-identification",
									class: "w-5 h-5 text-stone-400"
								}, null, _parent, _scopeId));
								_push(`<h4 class="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs"${_scopeId}>Cá Nhân</h4></div><div class="grid grid-cols-3 gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Tên Thánh",
									class: "col-span-1"
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: userForm.holyName,
											"onUpdate:modelValue": ($event) => userForm.holyName = $event,
											placeholder: "Giuse...",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: userForm.holyName,
											"onUpdate:modelValue": ($event) => userForm.holyName = $event,
											placeholder: "Giuse...",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Họ và tên",
									required: "",
									class: "col-span-2"
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: userForm.fullName,
											"onUpdate:modelValue": ($event) => userForm.fullName = $event,
											placeholder: "Nguyễn Văn A",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: userForm.fullName,
											"onUpdate:modelValue": ($event) => userForm.fullName = $event,
											placeholder: "Nguyễn Văn A",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngành Phụ Trách" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: userForm.branch,
											"onUpdate:modelValue": ($event) => userForm.branch = $event,
											options: branchOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											icon: "i-heroicons-flag",
											placeholder: "Chọn ngành...",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: userForm.branch,
											"onUpdate:modelValue": ($event) => userForm.branch = $event,
											options: branchOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											icon: "i-heroicons-flag",
											placeholder: "Chọn ngành...",
											size: "lg",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div></form>`);
							} else return [(0, vue_exports.createVNode)("form", {
								id: "user-form",
								class: "p-6 grid grid-cols-1 md:grid-cols-2 gap-8",
								onSubmit: (0, vue_exports.withModifiers)(handleSubmit, ["prevent"])
							}, [(0, vue_exports.createVNode)("div", { class: "space-y-5" }, [
								(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-server-stack",
									class: "w-5 h-5 text-stone-400"
								}), (0, vue_exports.createVNode)("h4", { class: "font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs" }, "Hệ Thống")]),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Tên đăng nhập",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: userForm.username,
										"onUpdate:modelValue": ($event) => userForm.username = $event,
										icon: "i-heroicons-at-symbol",
										placeholder: "nguyenvana",
										disabled: isEditing.value,
										size: "lg",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"disabled"
									])]),
									_: 1
								}),
								(0, vue_exports.createVNode)(_component_UFormField, {
									label: isEditing.value ? "Mật khẩu mới (Để trống nếu giữ nguyên)" : "Mật khẩu",
									required: !isEditing.value
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: userForm.password,
										"onUpdate:modelValue": ($event) => userForm.password = $event,
										type: "password",
										icon: "i-heroicons-key",
										placeholder: "••••••••",
										size: "lg",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}, 8, ["label", "required"]),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Quyền hạn / Chức vụ" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: userForm.roleId,
										"onUpdate:modelValue": ($event) => userForm.roleId = $event,
										options: roleOptions.value,
										"value-attribute": "value",
										"option-attribute": "label",
										icon: "i-heroicons-shield-check",
										placeholder: "Chọn quyền...",
										size: "lg",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								})
							]), (0, vue_exports.createVNode)("div", { class: "space-y-5" }, [
								(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-identification",
									class: "w-5 h-5 text-stone-400"
								}), (0, vue_exports.createVNode)("h4", { class: "font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs" }, "Cá Nhân")]),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-3 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Tên Thánh",
									class: "col-span-1"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: userForm.holyName,
										"onUpdate:modelValue": ($event) => userForm.holyName = $event,
										placeholder: "Giuse...",
										size: "lg",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, {
									label: "Họ và tên",
									required: "",
									class: "col-span-2"
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: userForm.fullName,
										"onUpdate:modelValue": ($event) => userForm.fullName = $event,
										placeholder: "Nguyễn Văn A",
										size: "lg",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})]),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành Phụ Trách" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: userForm.branch,
										"onUpdate:modelValue": ($event) => userForm.branch = $event,
										options: branchOptions,
										"value-attribute": "value",
										"option-attribute": "label",
										icon: "i-heroicons-flag",
										placeholder: "Chọn ngành...",
										size: "lg",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							])], 32)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-primary-600 dark:bg-primary-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: isEditing.value ? "i-heroicons-pencil-square" : "i-heroicons-user-plus",
							class: "w-6 h-6 text-white"
						}, null, 8, ["name"])]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)(isEditing.value ? "Cập Nhật Tài Khoản" : "Thêm Tài Khoản Mới"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isModalOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy bỏ",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isModalOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							type: "submit",
							form: "user-form",
							label: isEditing.value ? "Lưu Cập Nhật" : "Hoàn Tất Tạo",
							color: "primary",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider",
							loading: isSubmitting.value
						}, null, 8, ["label", "loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("form", {
							id: "user-form",
							class: "p-6 grid grid-cols-1 md:grid-cols-2 gap-8",
							onSubmit: (0, vue_exports.withModifiers)(handleSubmit, ["prevent"])
						}, [(0, vue_exports.createVNode)("div", { class: "space-y-5" }, [
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-server-stack",
								class: "w-5 h-5 text-stone-400"
							}), (0, vue_exports.createVNode)("h4", { class: "font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs" }, "Hệ Thống")]),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Tên đăng nhập",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: userForm.username,
									"onUpdate:modelValue": ($event) => userForm.username = $event,
									icon: "i-heroicons-at-symbol",
									placeholder: "nguyenvana",
									disabled: isEditing.value,
									size: "lg",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"disabled"
								])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UFormField, {
								label: isEditing.value ? "Mật khẩu mới (Để trống nếu giữ nguyên)" : "Mật khẩu",
								required: !isEditing.value
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: userForm.password,
									"onUpdate:modelValue": ($event) => userForm.password = $event,
									type: "password",
									icon: "i-heroicons-key",
									placeholder: "••••••••",
									size: "lg",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}, 8, ["label", "required"]),
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Quyền hạn / Chức vụ" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: userForm.roleId,
									"onUpdate:modelValue": ($event) => userForm.roleId = $event,
									options: roleOptions.value,
									"value-attribute": "value",
									"option-attribute": "label",
									icon: "i-heroicons-shield-check",
									placeholder: "Chọn quyền...",
									size: "lg",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							})
						]), (0, vue_exports.createVNode)("div", { class: "space-y-5" }, [
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 mb-2 border-b border-stone-200 dark:border-stone-800 pb-2" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-identification",
								class: "w-5 h-5 text-stone-400"
							}), (0, vue_exports.createVNode)("h4", { class: "font-bold text-stone-800 dark:text-stone-200 uppercase tracking-widest text-xs" }, "Cá Nhân")]),
							(0, vue_exports.createVNode)("div", { class: "grid grid-cols-3 gap-3" }, [(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Tên Thánh",
								class: "col-span-1"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: userForm.holyName,
									"onUpdate:modelValue": ($event) => userForm.holyName = $event,
									placeholder: "Giuse...",
									size: "lg",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}), (0, vue_exports.createVNode)(_component_UFormField, {
								label: "Họ và tên",
								required: "",
								class: "col-span-2"
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: userForm.fullName,
									"onUpdate:modelValue": ($event) => userForm.fullName = $event,
									placeholder: "Nguyễn Văn A",
									size: "lg",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})]),
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành Phụ Trách" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: userForm.branch,
									"onUpdate:modelValue": ($event) => userForm.branch = $event,
									options: branchOptions,
									"value-attribute": "value",
									"option-attribute": "label",
									icon: "i-heroicons-flag",
									placeholder: "Chọn ngành...",
									size: "lg",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
						])], 32)]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=users-DdBFZjc6.mjs.map
