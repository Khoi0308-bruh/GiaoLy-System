import { e as useAuthStore, a as useToast, v as vue_exports, s as server_renderer_exports, _ as _sfc_main$1, N as NuxtLink, d as _sfc_main$4 } from '../virtual/entry.mjs';
import { _ as _sfc_main$2 } from './FormField-D5sDaAUw.mjs';
import { _ as _sfc_main$3 } from './Input-Bk0TlYbs.mjs';
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

//#region pages/login.vue
var _sfc_main = {
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		useAuthStore();
		useToast();
		const loading = (0, vue_exports.ref)(false);
		const form = (0, vue_exports.reactive)({
			username: "",
			password: ""
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UIcon = _sfc_main$1;
			const _component_NuxtLink = NuxtLink;
			const _component_UFormField = _sfc_main$2;
			const _component_UInput = _sfc_main$3;
			const _component_UButton = _sfc_main$4;
			_push(`<div${(0, server_renderer_exports.ssrRenderAttrs)((0, vue_exports.mergeProps)({ class: "min-h-screen flex flex-col md:flex-row bg-stone-50 dark:bg-stone-900" }, _attrs))}><div class="hidden md:flex md:w-1/2 lg:w-3/5 relative bg-stone-900 overflow-hidden items-center justify-center"><img src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&amp;w=2000&amp;auto=format&amp;fit=crop" class="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px] transition-all duration-1000" alt="Church Interior"><div class="absolute inset-0 bg-gradient-to-tr from-marian-blue-950/90 via-marian-blue-900/60 to-transparent"></div><div class="relative z-10 p-12 text-center animate-fade-in-up">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
				name: "i-heroicons-sparkles",
				class: "w-16 h-16 text-vatican-gold-400 mx-auto mb-6 drop-shadow-lg"
			}, null, _parent));
			_push(`<h1 class="font-serif text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-md"> Ánh Sáng <br><span class="text-vatican-gold-400">Tân Phúc Âm Hóa</span></h1><p class="text-stone-300 text-lg italic max-w-md mx-auto drop-shadow-md"> &quot;Cứ để trẻ em đến với Thầy, đừng ngăn cấm chúng, vì Nước Thiên Chúa là của những ai giống như chúng.&quot; </p></div></div><div class="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 lg:p-16 relative"><div class="absolute inset-0 bg-gradient-to-br from-marian-blue-50/50 to-white dark:from-stone-900 dark:to-stone-950 -z-10"></div><div class="w-full max-w-sm animate-fade-in-up" style="${(0, server_renderer_exports.ssrRenderStyle)({ "animation-delay": "0.2s" })}"><div class="text-center mb-10">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_NuxtLink, {
				to: "/",
				class: "inline-block p-2 rounded-xl bg-primary-50 dark:bg-stone-800 text-primary-600 mb-6 hover:scale-105 transition-transform"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UIcon, {
						name: "i-heroicons-home",
						class: "w-6 h-6"
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UIcon, {
						name: "i-heroicons-home",
						class: "w-6 h-6"
					})];
				}),
				_: 1
			}, _parent));
			_push(`<h2 class="text-3xl font-black text-stone-800 dark:text-white uppercase tracking-wider mb-2"> Đăng Nhập </h2><p class="text-stone-500 text-sm"> Cổng thông tin quản trị Sứ đoàn Thiếu Nhi Thánh Thể </p></div><form class="space-y-6">`);
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
				label: "Tên đăng nhập",
				name: "username"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: (0, vue_exports.unref)(form).username,
						"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).username = $event,
						icon: "i-heroicons-user",
						placeholder: "Nhập tài khoản",
						size: "xl",
						class: "w-full",
						variant: "soft",
						autofocus: "",
						ui: { base: "focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow" }
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UInput, {
						modelValue: (0, vue_exports.unref)(form).username,
						"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).username = $event,
						icon: "i-heroicons-user",
						placeholder: "Nhập tài khoản",
						size: "xl",
						class: "w-full",
						variant: "soft",
						autofocus: "",
						ui: { base: "focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow" }
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UFormField, {
				label: "Mật khẩu",
				name: "password"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_component_UInput, {
						modelValue: (0, vue_exports.unref)(form).password,
						"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password = $event,
						type: "password",
						icon: "i-heroicons-lock-closed",
						placeholder: "••••••••",
						size: "xl",
						class: "w-full",
						variant: "soft",
						ui: { base: "focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow" }
					}, null, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)(_component_UInput, {
						modelValue: (0, vue_exports.unref)(form).password,
						"onUpdate:modelValue": ($event) => (0, vue_exports.unref)(form).password = $event,
						type: "password",
						icon: "i-heroicons-lock-closed",
						placeholder: "••••••••",
						size: "xl",
						class: "w-full",
						variant: "soft",
						ui: { base: "focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-shadow" }
					}, null, 8, ["modelValue", "onUpdate:modelValue"])];
				}),
				_: 1
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)(_component_UButton, {
				type: "submit",
				block: "",
				color: "primary",
				size: "xl",
				loading: (0, vue_exports.unref)(loading),
				class: "mt-8 font-bold tracking-wide shadow-sm"
			}, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push(` Vào Hệ Thống `);
					else return [(0, vue_exports.createTextVNode)(" Vào Hệ Thống ")];
				}),
				_: 1
			}, _parent));
			_push(`</form><div class="mt-8 text-center text-xs text-stone-400"><p>© ${(0, server_renderer_exports.ssrInterpolate)((/* @__PURE__ */ new Date()).getFullYear())} GiaoLy Vision.</p></div></div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-BdLL3V6Q.mjs.map
