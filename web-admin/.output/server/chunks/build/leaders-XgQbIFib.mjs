import { c as useHead$1, a as useToast, e as useAuthStore, v as vue_exports, b as useApiFetch, s as server_renderer_exports, _ as _sfc_main$1, d as _sfc_main$2, f as _sfc_main$3, j as useRuntimeConfig, $ as $api, i as $fetch$2 } from '../virtual/entry.mjs';
import { _ as _sfc_main$9 } from './SelectMenu-dKLm1tmu.mjs';
import { _ as _sfc_main$5 } from './Tooltip-DVWTuUpa.mjs';
import { _ as _sfc_main$6 } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$8 } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$a } from './Input-Bk0TlYbs.mjs';
import { _ as _sfc_main$4 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$7 } from './Card-CTTrlgZc.mjs';
import { _ as _sfc_main$b } from './Textarea-Cw0MtPiI.mjs';
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

//#region pages/admin/leaders.vue
var _sfc_main = {
	__name: "leaders",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Quản Lý Ban Trưởng - GiaoLy Admin" });
		const toast = useToast();
		const auth = useAuthStore();
		const config = useRuntimeConfig();
		const activeTab = (0, vue_exports.ref)("active");
		const pending = (0, vue_exports.ref)(false);
		const activeLeaders = (0, vue_exports.ref)([]);
		const historyLeaders = (0, vue_exports.ref)([]);
		const { data: systemUsers } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/User", { default: () => [] })), __temp = await __temp, __restore(), __temp);
		const userOptions = (0, vue_exports.computed)(() => {
			return (systemUsers.value || []).map((u) => ({
				label: `${u.fullName} (${u.username})`,
				fullName: u.fullName,
				holyName: u.holyName || ""
			}));
		});
		const selectedUser = (0, vue_exports.ref)(null);
		(0, vue_exports.watch)(selectedUser, (val) => {
			if (val) {
				form.value.fullName = val.fullName;
				if (val.holyName) form.value.holyName = val.holyName;
			}
		});
		const currentList = (0, vue_exports.computed)(() => activeTab.value === "active" ? activeLeaders.value : historyLeaders.value);
		const fetchData = async () => {
			pending.value = true;
			try {
				const [act, hist] = await Promise.all([$api("/Leader"), $api("/Leader/history")]);
				activeLeaders.value = act || [];
				historyLeaders.value = hist || [];
			} catch {
				toast.add({
					title: "Lỗi tải dữ liệu",
					color: "error"
				});
			} finally {
				pending.value = false;
			}
		};
		const isFormOpen = (0, vue_exports.ref)(false);
		const submitting = (0, vue_exports.ref)(false);
		const editingId = (0, vue_exports.ref)(null);
		const defaultForm = () => ({
			holyName: "",
			fullName: "",
			position: "",
			level: 1,
			term: "2024-2027",
			description: "",
			branch: 0,
			isActive: true
		});
		const form = (0, vue_exports.ref)(defaultForm());
		const openCreate = () => {
			editingId.value = null;
			form.value = defaultForm();
			isFormOpen.value = true;
		};
		const editItem = (item) => {
			editingId.value = item.id;
			form.value = { ...item };
			isFormOpen.value = true;
		};
		const submitForm = async () => {
			if (!form.value.fullName || !form.value.position) return toast.add({
				title: "Thiếu thông tin bắt buộc",
				color: "error"
			});
			submitting.value = true;
			try {
				if (editingId.value) {
					await $api(`/Leader/${editingId.value}`, {
						method: "PUT",
						body: form.value
					});
					toast.add({
						title: "Đã cập nhật",
						color: "success"
					});
				} else {
					await $api("/Leader", {
						method: "POST",
						body: form.value
					});
					toast.add({
						title: "Đã thêm mới",
						color: "success"
					});
				}
				isFormOpen.value = false;
				await fetchData();
			} catch (err) {
				toast.add({
					title: "Lỗi",
					description: err.message,
					color: "error"
				});
			} finally {
				submitting.value = false;
			}
		};
		const isAvatarOpen = (0, vue_exports.ref)(false);
		const uploadingAvatar = (0, vue_exports.ref)(false);
		const avatarInput = (0, vue_exports.ref)(null);
		const targetLeader = (0, vue_exports.ref)(null);
		const submitAvatar = async () => {
			const file = avatarInput.value?.files[0];
			if (!file) return;
			uploadingAvatar.value = true;
			try {
				const formData = new FormData();
				formData.append("file", file);
				await $fetch$2(`${config.public.apiBase}/Leader/${targetLeader.value.id}/avatar`, {
					method: "POST",
					body: formData,
					headers: { Authorization: `Bearer ${auth.token}` }
				});
				toast.add({
					title: "Cập nhật ảnh thành công",
					color: "success"
				});
				isAvatarOpen.value = false;
				await fetchData();
			} catch {
				toast.add({
					title: "Lỗi tải ảnh",
					color: "error"
				});
			} finally {
				uploadingAvatar.value = false;
			}
		};
		const isRotateOpen = (0, vue_exports.ref)(false);
		const rotating = (0, vue_exports.ref)(false);
		const newTerm = (0, vue_exports.ref)("2024-2027");
		const executeRotate = async () => {
			if (!newTerm.value.trim()) return;
			rotating.value = true;
			try {
				const res = await $api("/Leader/rotate-term", {
					method: "POST",
					body: `"${newTerm.value.trim()}"`,
					headers: { "Content-Type": "application/json" }
				});
				toast.add({
					title: "Xoay vòng thành công",
					description: res.message,
					color: "success"
				});
				isRotateOpen.value = false;
				await fetchData();
			} catch {
				toast.add({
					title: "Lỗi xoay vòng",
					color: "error"
				});
			} finally {
				rotating.value = false;
			}
		};
		const isDeleteOpen = (0, vue_exports.ref)(false);
		const deleting = (0, vue_exports.ref)(false);
		const deletingItem = (0, vue_exports.ref)(null);
		const confirmDelete = (item) => {
			deletingItem.value = item;
			isDeleteOpen.value = true;
		};
		const executeDelete = async () => {
			deleting.value = true;
			try {
				await $api(`/Leader/${deletingItem.value.id}`, { method: "DELETE" });
				toast.add({
					title: "Xóa thành công",
					color: "success"
				});
				isDeleteOpen.value = false;
				await fetchData();
			} catch {
				toast.add({
					title: "Lỗi xóa",
					color: "error"
				});
			} finally {
				deleting.value = false;
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_UAvatar = _sfc_main$3;
			const _component_UBadge = _sfc_main$4;
			const _component_UTooltip = _sfc_main$5;
			const _component_UModal = _sfc_main$6;
			const _component_UCard = _sfc_main$7;
			const _component_UFormField = _sfc_main$8;
			const _component_USelectMenu = _sfc_main$9;
			const _component_UInput = _sfc_main$a;
			const _component_UToggle = (0, vue_exports.resolveComponent)("UToggle");
			const _component_UTextarea = _sfc_main$b;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen font-sans relative pb-24 overflow-hidden" }, _attrs))}><div class="fixed inset-0 pointer-events-none z-0"><div class="absolute -top-40 -left-40 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-blue-200 dark:bg-blue-900"></div><div class="absolute -bottom-40 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-amber-200 dark:bg-amber-900"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div><div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto"><div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden"><div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div><div class="z-10 text-center lg:text-left"><div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800 shadow-inner">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-users",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`<span>Phân Hệ Nội Dung</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight"> Ban Điều Hành <span class="text-blue-500">Xứ Đoàn</span></h1><p class="text-stone-500 text-sm mt-2 max-w-xl"> Quản lý hồ sơ Huynh Trưởng, Ban Điều Hành, và cơ chế chuyển giao thế hệ (Xoay vòng nhiệm kỳ). </p></div><div class="flex flex-wrap items-center justify-center gap-3 z-10">`);
			if ((0, vue_exports.unref)(auth)?.hasPermission("leaders.update")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Xoay Vòng Nhiệm Kỳ",
				icon: "i-heroicons-arrow-path-rounded-square",
				color: "white",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-sm hover:-translate-y-0.5 transition-transform font-bold text-amber-600",
				onClick: ($event) => isRotateOpen.value = true
			}, null, _parent));
			else _push(`<!---->`);
			if ((0, vue_exports.unref)(auth)?.hasPermission("leaders.create")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Thêm Huynh Trưởng",
				icon: "i-heroicons-user-plus",
				color: "blue",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider",
				onClick: openCreate
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div></div><div class="flex justify-center md:justify-start"><div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 dark:border-stone-800 shadow-sm inline-flex"><button class="${(0, server_renderer_exports.ssrRenderClass)([(0, vue_exports.unref)(activeTab) === "active" ? "bg-blue-500 text-white shadow-md" : "text-stone-500 hover:text-blue-600 hover:bg-white dark:hover:bg-stone-800", "px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest"])}"> Đang Hoạt Động </button><button class="${(0, server_renderer_exports.ssrRenderClass)([(0, vue_exports.unref)(activeTab) === "history" ? "bg-stone-800 text-white shadow-md" : "text-stone-500 hover:text-stone-800 hover:bg-white dark:hover:bg-stone-800", "px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest flex items-center gap-2"])}"> Cựu Trào `);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-clock",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`</button></div></div>`);
			if ((0, vue_exports.unref)(pending)) {
				_push(`<div class="flex flex-col items-center justify-center py-24 bg-white/20 dark:bg-stone-900/20 backdrop-blur-xl rounded-[2rem]">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-arrow-path",
					class: "w-12 h-12 animate-spin text-blue-400 mb-4"
				}, null, _parent));
				_push(`<p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải hồ sơ nhân sự...</p></div>`);
			} else if (!(0, vue_exports.unref)(currentList).length) {
				_push(`<div class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-user-group",
					class: "w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4"
				}, null, _parent));
				_push(`<p class="text-stone-500 font-bold text-lg">Chưa có hồ sơ nhân sự nào trong mục này.</p></div>`);
			} else {
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(currentList), (leader) => {
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([(0, vue_exports.unref)(activeTab) === "active" ? "hover:border-blue-400 hover:shadow-blue-500/10 hover:-translate-y-1" : "hover:border-stone-400 opacity-80 hover:opacity-100", "group bg-white/60 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/80 dark:border-stone-800 rounded-3xl p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"])}">`);
					if ((0, vue_exports.unref)(activeTab) === "active") _push(`<div class="absolute inset-0 bg-gradient-to-b from-blue-100/30 to-transparent dark:from-blue-900/10 pointer-events-none"></div>`);
					else _push(`<!---->`);
					_push(`<div class="relative z-10 flex flex-col items-center text-center"><div class="relative mb-4">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UAvatar, {
						src: leader.avatarPath ? `${(0, vue_exports.unref)(config).public.apiBase}${leader.avatarPath}` : void 0,
						alt: leader.fullName,
						size: "3xl",
						class: "w-24 h-24 shadow-xl ring-4 ring-white dark:ring-stone-800 bg-stone-100 dark:bg-stone-800",
						ui: { placeholder: "font-black text-2xl text-stone-400" }
					}, null, _parent));
					if ((0, vue_exports.unref)(auth)?.hasPermission("leaders.update")) {
						_push(`<button class="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:scale-110" title="Cập nhật ảnh thẻ">`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
							name: "i-heroicons-camera",
							class: "w-4 h-4"
						}, null, _parent));
						_push(`</button>`);
					} else _push(`<!---->`);
					_push(`</div><div class="space-y-1 w-full"><p class="text-[10px] font-black text-stone-400 uppercase tracking-widest">${(0, server_renderer_exports.ssrInterpolate)(leader.holyName || "---")}</p><h3 class="font-black text-stone-800 dark:text-white text-lg leading-tight group-hover:text-blue-600 transition-colors">${(0, server_renderer_exports.ssrInterpolate)(leader.fullName)}</h3><div class="pt-2">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						label: leader.position,
						color: (0, vue_exports.unref)(activeTab) === "active" ? "blue" : "neutral",
						variant: "soft",
						size: "sm",
						class: "font-bold tracking-wide rounded-lg"
					}, null, _parent));
					_push(`</div></div><p class="text-xs text-stone-500 italic mt-4 min-h-[2rem] line-clamp-2"> &quot;${(0, server_renderer_exports.ssrInterpolate)(leader.description || "Sống Đạo yêu thương...")}&quot; </p><div class="w-full mt-4 p-3 bg-white/50 dark:bg-stone-900/50 rounded-2xl flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-widest"><span class="flex flex-col items-center gap-1">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-calendar",
						class: "w-4 h-4 text-blue-400"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(leader.term || "---")}</span><span class="flex flex-col items-center gap-1">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-star",
						class: "w-4 h-4 text-amber-400"
					}, null, _parent));
					_push(` CẤP ${(0, server_renderer_exports.ssrInterpolate)(leader.level)}</span></div></div>`);
					if ((0, vue_exports.unref)(auth)?.hasPermission("leaders.update") || (0, vue_exports.unref)(auth)?.hasPermission("leaders.delete")) {
						_push(`<div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 z-20">`);
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, {
							text: "Chỉnh sửa hồ sơ",
							placement: "left"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-pencil-square",
									color: "primary",
									variant: "solid",
									size: "xs",
									class: "rounded-xl shadow-md",
									onClick: ($event) => editItem(leader)
								}, null, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)(_component_UButton, {
									icon: "i-heroicons-pencil-square",
									color: "primary",
									variant: "solid",
									size: "xs",
									class: "rounded-xl shadow-md",
									onClick: ($event) => editItem(leader)
								}, null, 8, ["onClick"])];
							}),
							_: 2
						}, _parent));
						_push((0, server_renderer_exports.ssrRenderComponent)(_component_UTooltip, {
							text: "Xóa hồ sơ",
							placement: "left"
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) if ((0, vue_exports.unref)(auth)?.hasPermission("leaders.delete")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-trash",
									color: "error",
									variant: "solid",
									size: "xs",
									class: "rounded-xl shadow-md",
									onClick: ($event) => confirmDelete(leader)
								}, null, _parent, _scopeId));
								else _push(`<!---->`);
								else return [(0, vue_exports.unref)(auth)?.hasPermission("leaders.delete") ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UButton, {
									key: 0,
									icon: "i-heroicons-trash",
									color: "error",
									variant: "solid",
									size: "xs",
									class: "rounded-xl shadow-md",
									onClick: ($event) => confirmDelete(leader)
								}, null, 8, ["onClick"])) : (0, vue_exports.createCommentVNode)("", true)];
							}),
							_: 2
						}, _parent));
						_push(`</div>`);
					} else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isFormOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isFormOpen) ? isFormOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden sm:max-w-3xl" }
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
									name: "i-heroicons-identification",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(editingId) ? "Sửa Hồ Sơ" : "Thêm Nhân Sự")}</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isFormOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-identification",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(editingId) ? "Sửa Hồ Sơ" : "Thêm Nhân Sự"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isFormOpen.value = false
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
									onClick: ($event) => isFormOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: (0, vue_exports.unref)(editingId) ? "Lưu Thay Đổi" : "Xác Nhận Thêm",
									color: "blue",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/20",
									loading: (0, vue_exports.unref)(submitting),
									onClick: submitForm
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isFormOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: (0, vue_exports.unref)(editingId) ? "Lưu Thay Đổi" : "Xác Nhận Thêm",
								color: "blue",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/20",
								loading: (0, vue_exports.unref)(submitting),
								onClick: submitForm
							}, null, 8, ["label", "loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<form class="p-8 space-y-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Đồng bộ từ tài khoản hệ thống (Tùy chọn)" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(selectedUser),
											"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedUser) ? selectedUser.value = $event : null,
											options: (0, vue_exports.unref)(userOptions),
											searchable: "",
											"searchable-placeholder": "Tìm kiếm tài khoản...",
											placeholder: "Chọn tài khoản để tự động điền tên...",
											class: "w-full",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(selectedUser),
											"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedUser) ? selectedUser.value = $event : null,
											options: (0, vue_exports.unref)(userOptions),
											searchable: "",
											"searchable-placeholder": "Tìm kiếm tài khoản...",
											placeholder: "Chọn tài khoản để tự động điền tên...",
											class: "w-full",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"options"
										])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`<div class="p-5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4"${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Tên Thánh" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).holyName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).holyName = $event,
											placeholder: "Giuse...",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).holyName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).holyName = $event,
											placeholder: "Giuse...",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Họ và Tên",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).fullName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).fullName = $event,
											placeholder: "Nguyễn Văn A",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).fullName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).fullName = $event,
											placeholder: "Nguyễn Văn A",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Chức vụ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).position,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).position = $event,
											placeholder: "Xứ đoàn trưởng...",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).position,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).position = $event,
											placeholder: "Xứ đoàn trưởng...",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Cấp độ (Priority)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).level,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
											type: "number",
											placeholder: "1",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).level,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
											type: "number",
											placeholder: "1",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Nhiệm kỳ" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).term,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).term = $event,
											placeholder: "2024-2027",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).term,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).term = $event,
											placeholder: "2024-2027",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngành (0: Chung, 1: Ấu...)" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).branch,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).branch = $event,
											type: "number",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).branch,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).branch = $event,
											type: "number",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div></div><div class="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UToggle, {
									modelValue: (0, vue_exports.unref)(form).isActive,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).isActive = $event,
									color: "blue"
								}, null, _parent, _scopeId));
								_push(`<span class="text-sm font-bold text-blue-700 dark:text-blue-300"${_scopeId}>Nhân sự này đang hoạt động trong nhiệm kỳ hiện tại.</span></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Mô tả / Châm ngôn sống" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTextarea, {
											modelValue: (0, vue_exports.unref)(form).description,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).description = $event,
											rows: 3,
											placeholder: "Nhập châm ngôn hoặc tóm tắt...",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UTextarea, {
											modelValue: (0, vue_exports.unref)(form).description,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).description = $event,
											rows: 3,
											placeholder: "Nhập châm ngôn hoặc tóm tắt...",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</form>`);
							} else return [(0, vue_exports.createVNode)("form", {
								class: "p-8 space-y-6",
								onSubmit: (0, vue_exports.withModifiers)(submitForm, ["prevent"])
							}, [
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Đồng bộ từ tài khoản hệ thống (Tùy chọn)" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: (0, vue_exports.unref)(selectedUser),
										"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedUser) ? selectedUser.value = $event : null,
										options: (0, vue_exports.unref)(userOptions),
										searchable: "",
										"searchable-placeholder": "Tìm kiếm tài khoản...",
										placeholder: "Chọn tài khoản để tự động điền tên...",
										class: "w-full",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, [
										"modelValue",
										"onUpdate:modelValue",
										"options"
									])]),
									_: 1
								}),
								(0, vue_exports.createVNode)("div", { class: "p-5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4" }, [
									(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Tên Thánh" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).holyName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).holyName = $event,
											placeholder: "Giuse...",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}), (0, vue_exports.createVNode)(_component_UFormField, {
										label: "Họ và Tên",
										required: ""
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).fullName,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).fullName = $event,
											placeholder: "Nguyễn Văn A",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})]),
									(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [(0, vue_exports.createVNode)(_component_UFormField, {
										label: "Chức vụ",
										required: ""
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).position,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).position = $event,
											placeholder: "Xứ đoàn trưởng...",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}), (0, vue_exports.createVNode)(_component_UFormField, {
										label: "Cấp độ (Priority)",
										required: ""
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).level,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
											type: "number",
											placeholder: "1",
											required: "",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})]),
									(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Nhiệm kỳ" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).term,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).term = $event,
											placeholder: "2024-2027",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành (0: Chung, 1: Ấu...)" }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).branch,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).branch = $event,
											type: "number",
											ui: { base: "rounded-xl shadow-inner" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
										_: 1
									})])
								]),
								(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800" }, [(0, vue_exports.createVNode)(_component_UToggle, {
									modelValue: (0, vue_exports.unref)(form).isActive,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).isActive = $event,
									color: "blue"
								}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-blue-700 dark:text-blue-300" }, "Nhân sự này đang hoạt động trong nhiệm kỳ hiện tại.")]),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Mô tả / Châm ngôn sống" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
										modelValue: (0, vue_exports.unref)(form).description,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).description = $event,
										rows: 3,
										placeholder: "Nhập châm ngôn hoặc tóm tắt...",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})
							], 32)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-identification",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(editingId) ? "Sửa Hồ Sơ" : "Thêm Nhân Sự"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isFormOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isFormOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: (0, vue_exports.unref)(editingId) ? "Lưu Thay Đổi" : "Xác Nhận Thêm",
							color: "blue",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-blue-500/20",
							loading: (0, vue_exports.unref)(submitting),
							onClick: submitForm
						}, null, 8, ["label", "loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("form", {
							class: "p-8 space-y-6",
							onSubmit: (0, vue_exports.withModifiers)(submitForm, ["prevent"])
						}, [
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Đồng bộ từ tài khoản hệ thống (Tùy chọn)" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: (0, vue_exports.unref)(selectedUser),
									"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(selectedUser) ? selectedUser.value = $event : null,
									options: (0, vue_exports.unref)(userOptions),
									searchable: "",
									"searchable-placeholder": "Tìm kiếm tài khoản...",
									placeholder: "Chọn tài khoản để tự động điền tên...",
									class: "w-full",
									ui: { base: "rounded-xl shadow-inner" }
								}, null, 8, [
									"modelValue",
									"onUpdate:modelValue",
									"options"
								])]),
								_: 1
							}),
							(0, vue_exports.createVNode)("div", { class: "p-5 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 space-y-4" }, [
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Tên Thánh" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).holyName,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).holyName = $event,
										placeholder: "Giuse...",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, {
									label: "Họ và Tên",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).fullName,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).fullName = $event,
										placeholder: "Nguyễn Văn A",
										required: "",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})]),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [(0, vue_exports.createVNode)(_component_UFormField, {
									label: "Chức vụ",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).position,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).position = $event,
										placeholder: "Xứ đoàn trưởng...",
										required: "",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, {
									label: "Cấp độ (Priority)",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).level,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).level = $event,
										type: "number",
										placeholder: "1",
										required: "",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})]),
								(0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6" }, [(0, vue_exports.createVNode)(_component_UFormField, { label: "Nhiệm kỳ" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).term,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).term = $event,
										placeholder: "2024-2027",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}), (0, vue_exports.createVNode)(_component_UFormField, { label: "Ngành (0: Chung, 1: Ấu...)" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).branch,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).branch = $event,
										type: "number",
										ui: { base: "rounded-xl shadow-inner" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								})])
							]),
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800" }, [(0, vue_exports.createVNode)(_component_UToggle, {
								modelValue: (0, vue_exports.unref)(form).isActive,
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).isActive = $event,
								color: "blue"
							}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("span", { class: "text-sm font-bold text-blue-700 dark:text-blue-300" }, "Nhân sự này đang hoạt động trong nhiệm kỳ hiện tại.")]),
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Mô tả / Châm ngôn sống" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
									modelValue: (0, vue_exports.unref)(form).description,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).description = $event,
									rows: 3,
									placeholder: "Nhập châm ngôn hoặc tóm tắt...",
									ui: { base: "rounded-xl shadow-inner" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})
						], 32)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isAvatarOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isAvatarOpen) ? isAvatarOpen.value = $event : null,
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
									name: "i-heroicons-camera",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Đổi Ảnh Thẻ</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isAvatarOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-camera",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Đổi Ảnh Thẻ")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isAvatarOpen.value = false
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
									onClick: ($event) => isAvatarOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Tải Ảnh Lên",
									color: "blue",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider",
									loading: (0, vue_exports.unref)(uploadingAvatar),
									onClick: submitAvatar
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isAvatarOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Tải Ảnh Lên",
								color: "blue",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider",
								loading: (0, vue_exports.unref)(uploadingAvatar),
								onClick: submitAvatar
							}, null, 8, ["loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<div class="p-8 text-center"${_scopeId}><p class="text-sm font-bold text-stone-500 uppercase tracking-widest mb-6"${_scopeId}>Thành viên: <span class="text-blue-600"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(targetLeader)?.fullName)}</span></p><div class="p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors"${_scopeId}><input type="file" accept="image/*" class="block w-full text-sm text-stone-500 file:mx-auto file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-blue-200 file:text-blue-800 dark:file:bg-blue-800 dark:file:text-blue-200 hover:file:bg-blue-300 cursor-pointer transition-colors"${_scopeId}></div></div>`);
							else return [(0, vue_exports.createVNode)("div", { class: "p-8 text-center" }, [(0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-stone-500 uppercase tracking-widest mb-6" }, [(0, vue_exports.createTextVNode)("Thành viên: "), (0, vue_exports.createVNode)("span", { class: "text-blue-600" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(targetLeader)?.fullName), 1)]), (0, vue_exports.createVNode)("div", { class: "p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors" }, [(0, vue_exports.createVNode)("input", {
								ref_key: "avatarInput",
								ref: avatarInput,
								type: "file",
								accept: "image/*",
								class: "block w-full text-sm text-stone-500 file:mx-auto file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-blue-200 file:text-blue-800 dark:file:bg-blue-800 dark:file:text-blue-200 hover:file:bg-blue-300 cursor-pointer transition-colors"
							}, null, 512)])])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-blue-600 dark:bg-blue-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-camera",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Đổi Ảnh Thẻ")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isAvatarOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isAvatarOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: "Tải Ảnh Lên",
							color: "blue",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider",
							loading: (0, vue_exports.unref)(uploadingAvatar),
							onClick: submitAvatar
						}, null, 8, ["loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-8 text-center" }, [(0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-stone-500 uppercase tracking-widest mb-6" }, [(0, vue_exports.createTextVNode)("Thành viên: "), (0, vue_exports.createVNode)("span", { class: "text-blue-600" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(targetLeader)?.fullName), 1)]), (0, vue_exports.createVNode)("div", { class: "p-6 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors" }, [(0, vue_exports.createVNode)("input", {
							ref_key: "avatarInput",
							ref: avatarInput,
							type: "file",
							accept: "image/*",
							class: "block w-full text-sm text-stone-500 file:mx-auto file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-blue-200 file:text-blue-800 dark:file:bg-blue-800 dark:file:text-blue-200 hover:file:bg-blue-300 cursor-pointer transition-colors"
						}, null, 512)])])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isRotateOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isRotateOpen) ? isRotateOpen.value = $event : null,
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
								_push(`<div class="bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-arrow-path-rounded-square",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Xoay Vòng Nhiệm Kỳ</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isRotateOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-arrow-path-rounded-square",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Xoay Vòng Nhiệm Kỳ")]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "white",
								variant: "ghost",
								class: "hover:bg-white/10 rounded-full",
								onClick: ($event) => isRotateOpen.value = false
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
									onClick: ($event) => isRotateOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Thực Hiện Xoay Vòng",
									color: "amber",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-amber-500/20",
									loading: (0, vue_exports.unref)(rotating),
									onClick: executeRotate
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy Bỏ",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isRotateOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Thực Hiện Xoay Vòng",
								color: "amber",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-amber-500/20",
								loading: (0, vue_exports.unref)(rotating),
								onClick: executeRotate
							}, null, 8, ["loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="p-8 space-y-6"${_scopeId}><div class="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-exclamation-triangle",
									class: "w-8 h-8 text-amber-500 shrink-0"
								}, null, _parent, _scopeId));
								_push(`<div class="text-amber-800 dark:text-amber-200 text-sm font-medium"${_scopeId}><p class="mb-2 font-bold uppercase tracking-widest text-xs"${_scopeId}>⚠️ Cơ chế chuyển giao thế hệ</p><p${_scopeId}>Tất cả thành viên đang hoạt động hiện tại sẽ bị chuyển thành <b${_scopeId}>Cựu Trào</b>. Hệ thống sẽ quét toàn bộ danh sách, và tự động kích hoạt những người có &quot;Nhiệm kỳ&quot; khớp với nhiệm kỳ mới mà bạn sắp nhập bên dưới.</p></div></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Nhiệm kỳ mới sẽ kích hoạt" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(newTerm),
											"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(newTerm) ? newTerm.value = $event : null,
											placeholder: "VD: 2024-2027",
											size: "xl",
											class: "font-bold text-center",
											ui: { base: "rounded-xl shadow-inner text-center" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(newTerm),
											"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(newTerm) ? newTerm.value = $event : null,
											placeholder: "VD: 2024-2027",
											size: "xl",
											class: "font-bold text-center",
											ui: { base: "rounded-xl shadow-inner text-center" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "p-8 space-y-6" }, [(0, vue_exports.createVNode)("div", { class: "p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-exclamation-triangle",
								class: "w-8 h-8 text-amber-500 shrink-0"
							}), (0, vue_exports.createVNode)("div", { class: "text-amber-800 dark:text-amber-200 text-sm font-medium" }, [(0, vue_exports.createVNode)("p", { class: "mb-2 font-bold uppercase tracking-widest text-xs" }, "⚠️ Cơ chế chuyển giao thế hệ"), (0, vue_exports.createVNode)("p", null, [
								(0, vue_exports.createTextVNode)("Tất cả thành viên đang hoạt động hiện tại sẽ bị chuyển thành "),
								(0, vue_exports.createVNode)("b", null, "Cựu Trào"),
								(0, vue_exports.createTextVNode)(". Hệ thống sẽ quét toàn bộ danh sách, và tự động kích hoạt những người có \"Nhiệm kỳ\" khớp với nhiệm kỳ mới mà bạn sắp nhập bên dưới.")
							])])]), (0, vue_exports.createVNode)(_component_UFormField, { label: "Nhiệm kỳ mới sẽ kích hoạt" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(newTerm),
									"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(newTerm) ? newTerm.value = $event : null,
									placeholder: "VD: 2024-2027",
									size: "xl",
									class: "font-bold text-center",
									ui: { base: "rounded-xl shadow-inner text-center" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-gradient-to-r from-amber-500 to-orange-500 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-arrow-path-rounded-square",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Xoay Vòng Nhiệm Kỳ")]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "white",
							variant: "ghost",
							class: "hover:bg-white/10 rounded-full",
							onClick: ($event) => isRotateOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy Bỏ",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isRotateOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: "Thực Hiện Xoay Vòng",
							color: "amber",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-amber-500/20",
							loading: (0, vue_exports.unref)(rotating),
							onClick: executeRotate
						}, null, 8, ["loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-8 space-y-6" }, [(0, vue_exports.createVNode)("div", { class: "p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-4" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-exclamation-triangle",
							class: "w-8 h-8 text-amber-500 shrink-0"
						}), (0, vue_exports.createVNode)("div", { class: "text-amber-800 dark:text-amber-200 text-sm font-medium" }, [(0, vue_exports.createVNode)("p", { class: "mb-2 font-bold uppercase tracking-widest text-xs" }, "⚠️ Cơ chế chuyển giao thế hệ"), (0, vue_exports.createVNode)("p", null, [
							(0, vue_exports.createTextVNode)("Tất cả thành viên đang hoạt động hiện tại sẽ bị chuyển thành "),
							(0, vue_exports.createVNode)("b", null, "Cựu Trào"),
							(0, vue_exports.createTextVNode)(". Hệ thống sẽ quét toàn bộ danh sách, và tự động kích hoạt những người có \"Nhiệm kỳ\" khớp với nhiệm kỳ mới mà bạn sắp nhập bên dưới.")
						])])]), (0, vue_exports.createVNode)(_component_UFormField, { label: "Nhiệm kỳ mới sẽ kích hoạt" }, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
								modelValue: (0, vue_exports.unref)(newTerm),
								"onUpdate:modelValue": ($event) => (0, vue_exports.isRef)(newTerm) ? newTerm.value = $event : null,
								placeholder: "VD: 2024-2027",
								size: "xl",
								class: "font-bold text-center",
								ui: { base: "rounded-xl shadow-inner text-center" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isDeleteOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isDeleteOpen) ? isDeleteOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-6" },
						header: { padding: "p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex items-center gap-3 text-red-600 dark:text-red-400"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-exclamation-triangle",
									class: "w-8 h-8"
								}, null, _parent, _scopeId));
								_push(`<h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Xóa Hồ Sơ</h3></div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 text-red-600 dark:text-red-400" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-exclamation-triangle",
								class: "w-8 h-8"
							}), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Xóa Hồ Sơ")])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<p class="text-stone-600 dark:text-stone-300 mb-6"${_scopeId}>Bạn có chắc muốn xóa vĩnh viễn hồ sơ của <b${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(deletingItem)?.fullName)}</b>? Hành động này không thể hoàn tác.</p><div class="flex justify-end gap-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Hủy",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isDeleteOpen.value = false
								}, null, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Xóa Vĩnh Viễn",
									color: "error",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider",
									loading: (0, vue_exports.unref)(deleting),
									onClick: executeDelete
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("p", { class: "text-stone-600 dark:text-stone-300 mb-6" }, [
								(0, vue_exports.createTextVNode)("Bạn có chắc muốn xóa vĩnh viễn hồ sơ của "),
								(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(deletingItem)?.fullName), 1),
								(0, vue_exports.createTextVNode)("? Hành động này không thể hoàn tác.")
							]), (0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Hủy",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isDeleteOpen.value = false
							}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
								label: "Xóa Vĩnh Viễn",
								color: "error",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider",
								loading: (0, vue_exports.unref)(deleting),
								onClick: executeDelete
							}, null, 8, ["loading"])])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-6" },
						header: { padding: "p-6 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 text-red-600 dark:text-red-400" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-exclamation-triangle",
							class: "w-8 h-8"
						}), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Xóa Hồ Sơ")])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("p", { class: "text-stone-600 dark:text-stone-300 mb-6" }, [
							(0, vue_exports.createTextVNode)("Bạn có chắc muốn xóa vĩnh viễn hồ sơ của "),
							(0, vue_exports.createVNode)("b", null, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(deletingItem)?.fullName), 1),
							(0, vue_exports.createTextVNode)("? Hành động này không thể hoàn tác.")
						]), (0, vue_exports.createVNode)("div", { class: "flex justify-end gap-3" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Hủy",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isDeleteOpen.value = false
						}, null, 8, ["onClick"]), (0, vue_exports.createVNode)(_component_UButton, {
							label: "Xóa Vĩnh Viễn",
							color: "error",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider",
							loading: (0, vue_exports.unref)(deleting),
							onClick: executeDelete
						}, null, 8, ["loading"])])]),
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/leaders.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=leaders-XgQbIFib.mjs.map
