import { c as useHead$1, a as useToast, e as useAuthStore, v as vue_exports, b as useApiFetch, s as server_renderer_exports, _ as _sfc_main$1, d as _sfc_main$2, $ as $api } from '../virtual/entry.mjs';
import { _ as _sfc_main$a } from './SelectMenu-dKLm1tmu.mjs';
import { _ as _sfc_main$4 } from './Modal-C5m9NkUq.mjs';
import { _ as _sfc_main$7 } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$8 } from './Input-Bk0TlYbs.mjs';
import { _ as _sfc_main$3 } from './Badge-DNHUbyj-.mjs';
import { _ as _sfc_main$5 } from './Card-CTTrlgZc.mjs';
import { _ as _sfc_main$6 } from './Alert-BYliS5FV.mjs';
import { _ as _sfc_main$9 } from './Textarea-Cw0MtPiI.mjs';
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

//#region pages/admin/announcements.vue
var _sfc_main = {
	__name: "announcements",
	__ssrInlineRender: true,
	async setup(__props) {
		let __temp, __restore;
		useHead$1({ title: "Quản Lý Thông Báo - GiaoLy Admin" });
		const toast = useToast();
		const auth = useAuthStore();
		const { data: allAnnouncements, pending, refresh } = ([__temp, __restore] = (0, vue_exports.withAsyncContext)(() => useApiFetch("/Announcement", { default: () => [] })), __temp = await __temp, __restore(), __temp);
		const activeType = (0, vue_exports.ref)("all");
		const typeFilters = [
			{
				label: "Tất Cả",
				value: "all"
			},
			{
				label: "Thông Thường",
				value: "Normal"
			},
			{
				label: "Khẩn Cấp",
				value: "Urgent"
			},
			{
				label: "Sự Kiện",
				value: "Event"
			}
		];
		const filtered = (0, vue_exports.computed)(() => {
			const list = allAnnouncements.value || [];
			if (activeType.value === "all") return list;
			return list.filter((a) => a.type === activeType.value);
		});
		const isFormOpen = (0, vue_exports.ref)(false);
		const submitting = (0, vue_exports.ref)(false);
		const formError = (0, vue_exports.ref)("");
		const editingId = (0, vue_exports.ref)(null);
		const defaultForm = () => ({
			title: "",
			content: "",
			type: "Normal",
			targetAudience: "All",
			expiryDate: ""
		});
		const form = (0, vue_exports.ref)(defaultForm());
		const typeOptions = [
			{
				label: "Thông Thường 📢",
				value: "Normal"
			},
			{
				label: "Khẩn Cấp 🚨",
				value: "Urgent"
			},
			{
				label: "Sự Kiện 📅",
				value: "Event"
			}
		];
		const audienceOptions = [
			{
				label: "Tất Cả",
				value: "All"
			},
			{
				label: "Trưởng đoàn",
				value: "LeadersOnly"
			},
			{
				label: "Theo Ngành",
				value: "BranchSpecific"
			}
		];
		const openCreate = () => {
			editingId.value = null;
			form.value = defaultForm();
			formError.value = "";
			isFormOpen.value = true;
		};
		const editItem = (item) => {
			editingId.value = item.id;
			form.value = {
				title: item.title,
				content: item.content,
				type: item.type,
				targetAudience: item.targetAudience,
				expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().slice(0, 16) : ""
			};
			formError.value = "";
			isFormOpen.value = true;
		};
		const submitForm = async () => {
			if (!form.value.title.trim() || !form.value.content.trim()) {
				formError.value = "Vui lòng điền đầy đủ tiêu đề và nội dung.";
				return;
			}
			submitting.value = true;
			formError.value = "";
			try {
				const payload = {
					...form.value,
					expiryDate: form.value.expiryDate ? new Date(form.value.expiryDate).toISOString() : null
				};
				if (editingId.value) {
					await $api(`/Announcement/${editingId.value}`, {
						method: "PUT",
						body: payload
					});
					toast.add({
						title: "Đã cập nhật",
						color: "success"
					});
				} else {
					await $api("/Announcement", {
						method: "POST",
						body: payload
					});
					toast.add({
						title: "Đã đăng thông báo",
						color: "success"
					});
				}
				isFormOpen.value = false;
				await refresh();
			} catch (err) {
				formError.value = err?.data?.message || "Lỗi hệ thống.";
			} finally {
				submitting.value = false;
			}
		};
		const isViewOpen = (0, vue_exports.ref)(false);
		const viewingItem = (0, vue_exports.ref)(null);
		const viewItem = (item) => {
			viewingItem.value = item;
			isViewOpen.value = true;
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
				await $api(`/Announcement/${deletingItem.value.id}`, { method: "DELETE" });
				toast.add({
					title: "Đã xóa",
					color: "success"
				});
				isDeleteOpen.value = false;
				await refresh();
			} catch {
				toast.add({
					title: "Lỗi xóa",
					color: "error"
				});
			} finally {
				deleting.value = false;
			}
		};
		const formatDate = (d) => d ? new Date(d).toLocaleDateString("vi-VN", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		}) : "";
		const isExpired = (d) => d && new Date(d) < /* @__PURE__ */ new Date();
		const typeBadge = (type) => ({
			Normal: {
				label: "Thông Thường",
				color: "purple"
			},
			Urgent: {
				label: "Khẩn Cấp",
				color: "error"
			},
			Event: {
				label: "Sự Kiện",
				color: "warning"
			}
		})[type] || {
			label: type || "Thông Thường",
			color: "neutral"
		};
		const typeIcon = (type) => ({
			Urgent: "i-heroicons-bell-alert",
			Event: "i-heroicons-calendar-days"
		})[type] || "i-heroicons-megaphone";
		const typeIconBg = (type) => ({
			Urgent: "bg-red-100 dark:bg-red-900/50",
			Event: "bg-amber-100 dark:bg-amber-900/50"
		})[type] || "bg-purple-100 dark:bg-purple-900/50";
		const typeIconColor = (type) => ({
			Urgent: "text-red-600 dark:text-red-400",
			Event: "text-amber-600 dark:text-amber-400"
		})[type] || "text-purple-600 dark:text-purple-400";
		const audienceLabel = (a) => ({
			All: "Tất Cả",
			LeadersOnly: "Trưởng Đoàn",
			BranchSpecific: "Theo Ngành"
		})[a] || a;
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_UButton = _sfc_main$2;
			const _component_UBadge = _sfc_main$3;
			const _component_UModal = _sfc_main$4;
			const _component_UCard = _sfc_main$5;
			const _component_UAlert = _sfc_main$6;
			const _component_UFormField = _sfc_main$7;
			const _component_UInput = _sfc_main$8;
			const _component_UTextarea = _sfc_main$9;
			const _component_USelectMenu = _sfc_main$a;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen font-sans relative pb-24 overflow-hidden" }, _attrs))}><div class="fixed inset-0 pointer-events-none z-0"><div class="absolute top-0 -left-32 w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob bg-purple-200 dark:bg-purple-900"></div><div class="absolute -bottom-32 right-0 w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-blob animation-delay-2000 bg-orange-200 dark:bg-orange-900"></div><div class="absolute inset-0 bg-[url(&#39;https://grainy-gradients.vercel.app/noise.svg&#39;)] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div></div><div class="relative z-10 space-y-6 animate-fade-in-up px-4 md:px-8 pt-8 max-w-7xl mx-auto"><div class="bg-white/40 dark:bg-stone-900/40 backdrop-blur-2xl border border-white/60 dark:border-stone-800 shadow-xl rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"><div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div><div class="z-10 text-center md:text-left"><div class="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-widest border border-purple-200 dark:border-purple-800 shadow-inner">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-megaphone",
				class: "w-4 h-4"
			}, null, _parent));
			_push(`<span>Phân Hệ Nội Dung</span></div><h1 class="text-3xl md:text-4xl font-black text-stone-800 dark:text-white tracking-tight"> Quản Lý <span class="text-purple-500">Thông Báo</span></h1><p class="text-stone-500 text-sm mt-2 max-w-lg"> Khởi tạo, phát sóng và quản lý các thông báo quan trọng đến toàn thể đoàn sinh và phụ huynh. </p></div><div class="flex flex-wrap items-center justify-center gap-3 z-10">`);
			if ((0, vue_exports.unref)(auth)?.hasPermission("announcements.create")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				label: "Đăng Thông Báo Mới",
				icon: "i-heroicons-plus",
				color: "purple",
				variant: "solid",
				size: "lg",
				class: "rounded-2xl shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-transform font-bold uppercase tracking-wider",
				onClick: openCreate
			}, null, _parent));
			else _push(`<!---->`);
			_push(`</div></div><div class="flex justify-center md:justify-start"><div class="bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 dark:border-stone-800 shadow-sm inline-flex"><!--[-->`);
			(0, server_renderer_exports.ssrRenderList)(typeFilters, (f) => {
				_push(`<button class="${(0, server_renderer_exports.ssrRenderClass)([(0, vue_exports.unref)(activeType) === f.value ? "bg-purple-500 text-white shadow-md" : "text-stone-500 hover:text-purple-600 hover:bg-white dark:hover:bg-stone-800", "px-6 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 uppercase tracking-widest"])}">${(0, server_renderer_exports.ssrInterpolate)(f.label)}</button>`);
			});
			_push(`<!--]--></div></div>`);
			if ((0, vue_exports.unref)(pending)) {
				_push(`<div class="flex flex-col items-center justify-center py-24">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-arrow-path",
					class: "w-12 h-12 animate-spin text-purple-400 mb-4"
				}, null, _parent));
				_push(`<p class="text-stone-500 font-bold uppercase tracking-widest text-sm">Đang tải thông báo...</p></div>`);
			} else if (!(0, vue_exports.unref)(filtered).length) {
				_push(`<div class="text-center py-24 bg-white/40 dark:bg-stone-900/40 backdrop-blur-xl rounded-[2rem] border border-white/50 dark:border-stone-800 shadow-sm">`);
				_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
					name: "i-heroicons-megaphone",
					class: "w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4"
				}, null, _parent));
				_push(`<p class="text-stone-500 font-bold text-lg">Chưa có thông báo nào trong mục này.</p>`);
				if ((0, vue_exports.unref)(auth)?.hasPermission("announcements.create")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
					label: "Tạo thông báo đầu tiên",
					variant: "soft",
					color: "purple",
					class: "mt-4 rounded-xl font-bold",
					onClick: openCreate
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div>`);
			} else {
				_push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
				(0, server_renderer_exports.ssrRenderList)((0, vue_exports.unref)(filtered), (item) => {
					_push(`<div class="${(0, server_renderer_exports.ssrRenderClass)([[item.type === "Urgent" ? "border-red-400/50 hover:border-red-500 shadow-red-500/10 hover:shadow-red-500/20" : item.type === "Event" ? "border-amber-400/50 hover:border-amber-500 shadow-amber-500/10 hover:shadow-amber-500/20" : "border-white/60 dark:border-stone-800 hover:border-purple-400 hover:shadow-purple-500/10 hover:-translate-y-1"], "group bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl border rounded-[2rem] p-6 shadow-xl shadow-black/5 flex flex-col transition-all relative overflow-hidden"])}">`);
					if (item.type === "Urgent") _push(`<div class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>`);
					else _push(`<!---->`);
					_push(`<div class="relative z-10 flex-1"><div class="flex justify-between items-start mb-4"><div class="${(0, server_renderer_exports.ssrRenderClass)([
						"w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
						typeIconBg(item.type),
						typeIconColor(item.type)
					])}">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: typeIcon(item.type),
						class: "w-6 h-6"
					}, null, _parent));
					_push(`</div><div class="flex flex-col items-end gap-2">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						label: typeBadge(item.type).label,
						color: typeBadge(item.type).color,
						variant: "soft",
						size: "xs",
						class: "font-black uppercase tracking-widest rounded-lg"
					}, null, _parent));
					if (item.expiryDate && isExpired(item.expiryDate)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
						label: "HẾT HẠN",
						color: "neutral",
						variant: "solid",
						size: "xs",
						class: "font-black tracking-widest rounded-lg"
					}, null, _parent));
					else _push(`<!---->`);
					_push(`</div></div><h3 class="font-black text-xl text-stone-800 dark:text-white leading-tight mb-2 group-hover:text-purple-600 transition-colors">${(0, server_renderer_exports.ssrInterpolate)(item.title)}</h3><p class="text-xs font-bold text-stone-500 mt-4 space-y-1"><span class="flex items-center gap-2">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-user",
						class: "w-4 h-4"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(item.author)}</span><span class="flex items-center gap-2">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-clock",
						class: "w-4 h-4"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(formatDate(item.createdDate))}</span><span class="flex items-center gap-2 text-purple-600 dark:text-purple-400">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-users",
						class: "w-4 h-4"
					}, null, _parent));
					_push(` ${(0, server_renderer_exports.ssrInterpolate)(audienceLabel(item.targetAudience))}</span></p></div><div class="relative z-10 mt-6 pt-4 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-end gap-2">`);
					_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						icon: "i-heroicons-eye",
						color: "neutral",
						variant: "soft",
						size: "sm",
						class: "rounded-xl font-bold",
						onClick: ($event) => viewItem(item)
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`Xem`);
							else return [(0, vue_exports.createTextVNode)("Xem")];
						}),
						_: 2
					}, _parent));
					if ((0, vue_exports.unref)(auth)?.hasPermission("announcements.update")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						icon: "i-heroicons-pencil-square",
						color: "primary",
						variant: "ghost",
						size: "sm",
						class: "rounded-xl",
						onClick: ($event) => editItem(item)
					}, null, _parent));
					else _push(`<!---->`);
					if ((0, vue_exports.unref)(auth)?.hasPermission("announcements.delete")) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
						icon: "i-heroicons-trash",
						color: "error",
						variant: "ghost",
						size: "sm",
						class: "rounded-xl",
						onClick: ($event) => confirmDelete(item)
					}, null, _parent));
					else _push(`<!---->`);
					_push(`</div></div>`);
				});
				_push(`<!--]--></div>`);
			}
			_push(`</div>`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isFormOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isFormOpen) ? isFormOpen.value = $event : null,
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
								_push(`<div class="bg-purple-600 dark:bg-purple-900 p-6 flex justify-between items-center text-white"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-megaphone",
									class: "w-6 h-6"
								}, null, _parent, _scopeId));
								_push(`</div><h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(editingId) ? "Chỉnh Sửa Thông Báo" : "Đăng Thông Báo Mới")}</h3></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "white",
									variant: "ghost",
									class: "hover:bg-white/10 rounded-full",
									onClick: ($event) => isFormOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "bg-purple-600 dark:bg-purple-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-megaphone",
								class: "w-6 h-6"
							})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(editingId) ? "Chỉnh Sửa Thông Báo" : "Đăng Thông Báo Mới"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
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
									label: (0, vue_exports.unref)(editingId) ? "Lưu Thay Đổi" : "Phát Sóng Thông Báo",
									color: "purple",
									variant: "solid",
									size: "lg",
									class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-purple-500/20",
									loading: (0, vue_exports.unref)(submitting),
									icon: "i-heroicons-paper-airplane",
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
								label: (0, vue_exports.unref)(editingId) ? "Lưu Thay Đổi" : "Phát Sóng Thông Báo",
								color: "purple",
								variant: "solid",
								size: "lg",
								class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-purple-500/20",
								loading: (0, vue_exports.unref)(submitting),
								icon: "i-heroicons-paper-airplane",
								onClick: submitForm
							}, null, 8, ["label", "loading"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="p-6"${_scopeId}>`);
								if ((0, vue_exports.unref)(formError)) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UAlert, {
									color: "error",
									variant: "soft",
									description: (0, vue_exports.unref)(formError),
									icon: "i-heroicons-exclamation-circle",
									class: "mb-6 rounded-2xl"
								}, null, _parent, _scopeId));
								else _push(`<!---->`);
								_push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-6"${_scopeId}><div class="lg:col-span-2 space-y-6"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Tiêu đề thông báo",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).title,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
											placeholder: "Hôm nay nghỉ học...",
											class: "w-full text-lg font-bold",
											size: "lg",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).title,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
											placeholder: "Hôm nay nghỉ học...",
											class: "w-full text-lg font-bold",
											size: "lg",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
									label: "Nội dung",
									required: ""
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UTextarea, {
											modelValue: (0, vue_exports.unref)(form).content,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).content = $event,
											placeholder: "Nhập nội dung chi tiết (hỗ trợ HTML cơ bản)...",
											rows: 12,
											class: "w-full font-sans text-sm",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_UTextarea, {
											modelValue: (0, vue_exports.unref)(form).content,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).content = $event,
											placeholder: "Nhập nội dung chi tiết (hỗ trợ HTML cơ bản)...",
											rows: 12,
											class: "w-full font-sans text-sm",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div><div class="space-y-6 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 h-fit"${_scopeId}><h3 class="font-black text-purple-800 dark:text-purple-300 flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, { name: "i-heroicons-cog-6-tooth" }, null, _parent, _scopeId));
								_push(` Phân Loại</h3>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Mức độ quan trọng" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).type,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).type = $event,
											options: typeOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).type,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).type = $event,
											options: typeOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Đối tượng hiển thị" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).targetAudience,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).targetAudience = $event,
											options: audienceOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_component_USelectMenu, {
											modelValue: (0, vue_exports.unref)(form).targetAudience,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).targetAudience = $event,
											options: audienceOptions,
											"value-attribute": "value",
											"option-attribute": "label",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"])];
									}),
									_: 1
								}, _parent, _scopeId));
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, { label: "Ngày hết hạn (tùy chọn)" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											_push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
												modelValue: (0, vue_exports.unref)(form).expiryDate,
												"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).expiryDate = $event,
												type: "datetime-local",
												class: "w-full",
												ui: { base: "rounded-xl" }
											}, null, _parent, _scopeId));
											_push(`<p class="text-[10px] text-stone-500 font-bold mt-2 leading-tight"${_scopeId}>Nếu để trống, thông báo sẽ tồn tại vĩnh viễn cho đến khi bị xóa.</p>`);
										} else return [(0, vue_exports.createVNode)(_component_UInput, {
											modelValue: (0, vue_exports.unref)(form).expiryDate,
											"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).expiryDate = $event,
											type: "datetime-local",
											class: "w-full",
											ui: { base: "rounded-xl" }
										}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("p", { class: "text-[10px] text-stone-500 font-bold mt-2 leading-tight" }, "Nếu để trống, thông báo sẽ tồn tại vĩnh viễn cho đến khi bị xóa.")];
									}),
									_: 1
								}, _parent, _scopeId));
								_push(`</div></div></div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "p-6" }, [(0, vue_exports.unref)(formError) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UAlert, {
								key: 0,
								color: "error",
								variant: "soft",
								description: (0, vue_exports.unref)(formError),
								icon: "i-heroicons-exclamation-circle",
								class: "mb-6 rounded-2xl"
							}, null, 8, ["description"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, [(0, vue_exports.createVNode)("div", { class: "lg:col-span-2 space-y-6" }, [(0, vue_exports.createVNode)(_component_UFormField, {
								label: "Tiêu đề thông báo",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(form).title,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
									placeholder: "Hôm nay nghỉ học...",
									class: "w-full text-lg font-bold",
									size: "lg",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}), (0, vue_exports.createVNode)(_component_UFormField, {
								label: "Nội dung",
								required: ""
							}, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
									modelValue: (0, vue_exports.unref)(form).content,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).content = $event,
									placeholder: "Nhập nội dung chi tiết (hỗ trợ HTML cơ bản)...",
									rows: 12,
									class: "w-full font-sans text-sm",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							})]), (0, vue_exports.createVNode)("div", { class: "space-y-6 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 h-fit" }, [
								(0, vue_exports.createVNode)("h3", { class: "font-black text-purple-800 dark:text-purple-300 flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-cog-6-tooth" }), (0, vue_exports.createTextVNode)(" Phân Loại")]),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Mức độ quan trọng" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: (0, vue_exports.unref)(form).type,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).type = $event,
										options: typeOptions,
										"value-attribute": "value",
										"option-attribute": "label",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Đối tượng hiển thị" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
										modelValue: (0, vue_exports.unref)(form).targetAudience,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).targetAudience = $event,
										options: audienceOptions,
										"value-attribute": "value",
										"option-attribute": "label",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
									_: 1
								}),
								(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày hết hạn (tùy chọn)" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
										modelValue: (0, vue_exports.unref)(form).expiryDate,
										"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).expiryDate = $event,
										type: "datetime-local",
										class: "w-full",
										ui: { base: "rounded-xl" }
									}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("p", { class: "text-[10px] text-stone-500 font-bold mt-2 leading-tight" }, "Nếu để trống, thông báo sẽ tồn tại vĩnh viễn cho đến khi bị xóa.")]),
									_: 1
								})
							])])])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-0" },
						footer: { padding: "p-6 bg-stone-50 dark:bg-stone-900" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "bg-purple-600 dark:bg-purple-900 p-6 flex justify-between items-center text-white" }, [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3" }, [(0, vue_exports.createVNode)("div", { class: "p-2 bg-white/20 rounded-xl backdrop-blur-sm" }, [(0, vue_exports.createVNode)(_component_UIcon, {
							name: "i-heroicons-megaphone",
							class: "w-6 h-6"
						})]), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(editingId) ? "Chỉnh Sửa Thông Báo" : "Đăng Thông Báo Mới"), 1)]), (0, vue_exports.createVNode)(_component_UButton, {
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
							label: (0, vue_exports.unref)(editingId) ? "Lưu Thay Đổi" : "Phát Sóng Thông Báo",
							color: "purple",
							variant: "solid",
							size: "lg",
							class: "rounded-xl font-black uppercase tracking-wider shadow-lg shadow-purple-500/20",
							loading: (0, vue_exports.unref)(submitting),
							icon: "i-heroicons-paper-airplane",
							onClick: submitForm
						}, null, 8, ["label", "loading"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-6" }, [(0, vue_exports.unref)(formError) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_component_UAlert, {
							key: 0,
							color: "error",
							variant: "soft",
							description: (0, vue_exports.unref)(formError),
							icon: "i-heroicons-exclamation-circle",
							class: "mb-6 rounded-2xl"
						}, null, 8, ["description"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)("div", { class: "grid grid-cols-1 lg:grid-cols-3 gap-6" }, [(0, vue_exports.createVNode)("div", { class: "lg:col-span-2 space-y-6" }, [(0, vue_exports.createVNode)(_component_UFormField, {
							label: "Tiêu đề thông báo",
							required: ""
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
								modelValue: (0, vue_exports.unref)(form).title,
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).title = $event,
								placeholder: "Hôm nay nghỉ học...",
								class: "w-full text-lg font-bold",
								size: "lg",
								ui: { base: "rounded-xl" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						}), (0, vue_exports.createVNode)(_component_UFormField, {
							label: "Nội dung",
							required: ""
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UTextarea, {
								modelValue: (0, vue_exports.unref)(form).content,
								"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).content = $event,
								placeholder: "Nhập nội dung chi tiết (hỗ trợ HTML cơ bản)...",
								rows: 12,
								class: "w-full font-sans text-sm",
								ui: { base: "rounded-xl" }
							}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
							_: 1
						})]), (0, vue_exports.createVNode)("div", { class: "space-y-6 bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/50 h-fit" }, [
							(0, vue_exports.createVNode)("h3", { class: "font-black text-purple-800 dark:text-purple-300 flex items-center gap-2 pb-2 border-b border-purple-200 dark:border-purple-800" }, [(0, vue_exports.createVNode)(_component_UIcon, { name: "i-heroicons-cog-6-tooth" }), (0, vue_exports.createTextVNode)(" Phân Loại")]),
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Mức độ quan trọng" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: (0, vue_exports.unref)(form).type,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).type = $event,
									options: typeOptions,
									"value-attribute": "value",
									"option-attribute": "label",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Đối tượng hiển thị" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_USelectMenu, {
									modelValue: (0, vue_exports.unref)(form).targetAudience,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).targetAudience = $event,
									options: audienceOptions,
									"value-attribute": "value",
									"option-attribute": "label",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
								_: 1
							}),
							(0, vue_exports.createVNode)(_component_UFormField, { label: "Ngày hết hạn (tùy chọn)" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_component_UInput, {
									modelValue: (0, vue_exports.unref)(form).expiryDate,
									"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).expiryDate = $event,
									type: "datetime-local",
									class: "w-full",
									ui: { base: "rounded-xl" }
								}, null, 8, ["modelValue", "onUpdate:modelValue"]), (0, vue_exports.createVNode)("p", { class: "text-[10px] text-stone-500 font-bold mt-2 leading-tight" }, "Nếu để trống, thông báo sẽ tồn tại vĩnh viễn cho đến khi bị xóa.")]),
								_: 1
							})
						])])])]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UModal, {
				open: (0, vue_exports.unref)(isViewOpen),
				"onUpdate:open": ($event) => (0, vue_exports.isRef)(isViewOpen) ? isViewOpen.value = $event : null,
				ui: { base: "rounded-[2rem] overflow-hidden sm:max-w-3xl" }
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-between items-start gap-4"${_scopeId}><div${_scopeId}><div class="flex items-center gap-2 mb-3"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UBadge, {
									label: typeBadge((0, vue_exports.unref)(viewingItem)?.type).label,
									color: typeBadge((0, vue_exports.unref)(viewingItem)?.type).color,
									variant: "soft",
									class: "font-black uppercase tracking-widest rounded-lg"
								}, null, _parent, _scopeId));
								_push(`<span class="text-xs font-bold text-stone-400"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
									name: "i-heroicons-clock",
									class: "inline-block mr-1"
								}, null, _parent, _scopeId));
								_push(` ${(0, server_renderer_exports.ssrInterpolate)(formatDate((0, vue_exports.unref)(viewingItem)?.createdDate))}</span></div><h3 class="text-2xl font-black text-stone-800 dark:text-white leading-tight"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(viewingItem)?.title)}</h3><p class="text-sm font-bold text-purple-600 mt-2"${_scopeId}>Đăng bởi: ${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(viewingItem)?.author)}</p></div>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									icon: "i-heroicons-x-mark",
									color: "neutral",
									variant: "ghost",
									class: "rounded-full",
									onClick: ($event) => isViewOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-between items-start gap-4" }, [(0, vue_exports.createVNode)("div", null, [
								(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 mb-3" }, [(0, vue_exports.createVNode)(_component_UBadge, {
									label: typeBadge((0, vue_exports.unref)(viewingItem)?.type).label,
									color: typeBadge((0, vue_exports.unref)(viewingItem)?.type).color,
									variant: "soft",
									class: "font-black uppercase tracking-widest rounded-lg"
								}, null, 8, ["label", "color"]), (0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-400" }, [(0, vue_exports.createVNode)(_component_UIcon, {
									name: "i-heroicons-clock",
									class: "inline-block mr-1"
								}), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(formatDate((0, vue_exports.unref)(viewingItem)?.createdDate)), 1)])]),
								(0, vue_exports.createVNode)("h3", { class: "text-2xl font-black text-stone-800 dark:text-white leading-tight" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(viewingItem)?.title), 1),
								(0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-purple-600 mt-2" }, "Đăng bởi: " + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(viewingItem)?.author), 1)
							]), (0, vue_exports.createVNode)(_component_UButton, {
								icon: "i-heroicons-x-mark",
								color: "neutral",
								variant: "ghost",
								class: "rounded-full",
								onClick: ($event) => isViewOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						footer: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<div class="flex justify-end p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800"${_scopeId}>`);
								_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
									label: "Đóng",
									color: "neutral",
									variant: "soft",
									size: "lg",
									class: "rounded-xl font-bold",
									onClick: ($event) => isViewOpen.value = false
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex justify-end p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800" }, [(0, vue_exports.createVNode)(_component_UButton, {
								label: "Đóng",
								color: "neutral",
								variant: "soft",
								size: "lg",
								class: "rounded-xl font-bold",
								onClick: ($event) => isViewOpen.value = false
							}, null, 8, ["onClick"])])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`<div class="p-8 bg-white dark:bg-stone-950"${_scopeId}><div class="prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-purple-600 text-stone-700 dark:text-stone-300"${_scopeId}>${(0, vue_exports.unref)(viewingItem)?.content ?? ""}</div></div>`);
							else return [(0, vue_exports.createVNode)("div", { class: "p-8 bg-white dark:bg-stone-950" }, [(0, vue_exports.createVNode)("div", {
								class: "prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-purple-600 text-stone-700 dark:text-stone-300",
								innerHTML: (0, vue_exports.unref)(viewingItem)?.content
							}, null, 8, ["innerHTML"])])];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UCard, { ui: {
						body: { padding: "p-0" },
						header: { padding: "p-6 bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800" }
					} }, {
						header: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-between items-start gap-4" }, [(0, vue_exports.createVNode)("div", null, [
							(0, vue_exports.createVNode)("div", { class: "flex items-center gap-2 mb-3" }, [(0, vue_exports.createVNode)(_component_UBadge, {
								label: typeBadge((0, vue_exports.unref)(viewingItem)?.type).label,
								color: typeBadge((0, vue_exports.unref)(viewingItem)?.type).color,
								variant: "soft",
								class: "font-black uppercase tracking-widest rounded-lg"
							}, null, 8, ["label", "color"]), (0, vue_exports.createVNode)("span", { class: "text-xs font-bold text-stone-400" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-clock",
								class: "inline-block mr-1"
							}), (0, vue_exports.createTextVNode)(" " + (0, vue_exports.toDisplayString)(formatDate((0, vue_exports.unref)(viewingItem)?.createdDate)), 1)])]),
							(0, vue_exports.createVNode)("h3", { class: "text-2xl font-black text-stone-800 dark:text-white leading-tight" }, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(viewingItem)?.title), 1),
							(0, vue_exports.createVNode)("p", { class: "text-sm font-bold text-purple-600 mt-2" }, "Đăng bởi: " + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(viewingItem)?.author), 1)
						]), (0, vue_exports.createVNode)(_component_UButton, {
							icon: "i-heroicons-x-mark",
							color: "neutral",
							variant: "ghost",
							class: "rounded-full",
							onClick: ($event) => isViewOpen.value = false
						}, null, 8, ["onClick"])])]),
						footer: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "flex justify-end p-4 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800" }, [(0, vue_exports.createVNode)(_component_UButton, {
							label: "Đóng",
							color: "neutral",
							variant: "soft",
							size: "lg",
							class: "rounded-xl font-bold",
							onClick: ($event) => isViewOpen.value = false
						}, null, 8, ["onClick"])])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("div", { class: "p-8 bg-white dark:bg-stone-950" }, [(0, vue_exports.createVNode)("div", {
							class: "prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-purple-600 text-stone-700 dark:text-stone-300",
							innerHTML: (0, vue_exports.unref)(viewingItem)?.content
						}, null, 8, ["innerHTML"])])]),
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
								_push(`<h3 class="text-xl font-black uppercase tracking-wide"${_scopeId}>Xác Nhận Xóa</h3></div>`);
							} else return [(0, vue_exports.createVNode)("div", { class: "flex items-center gap-3 text-red-600 dark:text-red-400" }, [(0, vue_exports.createVNode)(_component_UIcon, {
								name: "i-heroicons-exclamation-triangle",
								class: "w-8 h-8"
							}), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Xác Nhận Xóa")])];
						}),
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<p class="text-stone-600 dark:text-stone-300 mb-6"${_scopeId}>Bạn có chắc chắn muốn xóa thông báo <b${_scopeId}>&quot;${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(deletingItem)?.title)}&quot;</b>? Hành động này không thể hoàn tác.</p><div class="flex justify-end gap-3"${_scopeId}>`);
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
									icon: "i-heroicons-trash",
									loading: (0, vue_exports.unref)(deleting),
									onClick: executeDelete
								}, null, _parent, _scopeId));
								_push(`</div>`);
							} else return [(0, vue_exports.createVNode)("p", { class: "text-stone-600 dark:text-stone-300 mb-6" }, [
								(0, vue_exports.createTextVNode)("Bạn có chắc chắn muốn xóa thông báo "),
								(0, vue_exports.createVNode)("b", null, "\"" + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(deletingItem)?.title) + "\"", 1),
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
								icon: "i-heroicons-trash",
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
						}), (0, vue_exports.createVNode)("h3", { class: "text-xl font-black uppercase tracking-wide" }, "Xác Nhận Xóa")])]),
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("p", { class: "text-stone-600 dark:text-stone-300 mb-6" }, [
							(0, vue_exports.createTextVNode)("Bạn có chắc chắn muốn xóa thông báo "),
							(0, vue_exports.createVNode)("b", null, "\"" + (0, vue_exports.toDisplayString)((0, vue_exports.unref)(deletingItem)?.title) + "\"", 1),
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
							icon: "i-heroicons-trash",
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/announcements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=announcements-DYKihLy-.mjs.map
