import { v as vue_exports, g as useComponentProps, h as useAppConfig, l as useForwardProps, m as useFormField, t as tv, s as server_renderer_exports, P as Primitive, _ as _sfc_main$1, n as useForwardExpose, o as isNullish, p as Presence_default, q as createContext } from '../virtual/entry.mjs';
import { u as useFormControl } from './useFormControl-DR703Aa5.mjs';
import { u as useForwardScopeId } from './useForwardScopeId-eoFSsZ85.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-DjK2EyXI.mjs';
import { R as RovingFocusItem_default } from './RovingFocusItem-ClXCvEdi.mjs';
import { L as Label_default } from './FormField-D5sDaAUw.mjs';
import { reactivePick, useVModel } from '@vueuse/core';
import { E as isEqual } from '../_/nitro.mjs';

//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/shared/isValueEqualOrExist.js
/**
* The function `isValueEqualOrExist` checks if a value is equal to or exists in another value or
* array.
* @param {T | T[] | undefined} base - It represents the base value that you want to compare with the `current` value.
* @param {T | T[] | undefined} current - The `current` parameter represents the current value that you want to compare with the `base` value or values.
* @returns The `isValueEqualOrExist` function returns a boolean value. It checks if the `base` value
* is equal to the `current` value or if the `current` value exists within the `base` value. The
* function handles cases where `base` can be a single value, an array of values, or undefined.
*/
function isValueEqualOrExist(base, current) {
	if (isNullish(base)) return false;
	if (Array.isArray(base)) return base.some((val) => isEqual(val, current));
	else return isEqual(base, current);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Checkbox/CheckboxGroupRoot.js
var [injectCheckboxGroupRootContext] = /*#__PURE__*/ createContext("CheckboxGroupRoot");
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Checkbox/utils.js
function isIndeterminate(checked) {
	return checked === "indeterminate";
}
function getState(checked) {
	return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Checkbox/CheckboxRoot.js
var [injectCheckboxRootContext, provideCheckboxRootContext] = /*#__PURE__*/ createContext("CheckboxRoot");
var CheckboxRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "CheckboxRoot",
	props: {
		defaultValue: {
			type: null,
			required: false
		},
		modelValue: {
			type: null,
			required: false,
			default: void 0
		},
		disabled: {
			type: Boolean,
			required: false
		},
		value: {
			type: null,
			required: false,
			default: "on"
		},
		id: {
			type: String,
			required: false
		},
		trueValue: {
			type: null,
			required: false,
			default: () => true
		},
		falseValue: {
			type: null,
			required: false,
			default: () => false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		},
		name: {
			type: String,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef, currentElement } = useForwardExpose();
		const checkboxGroupContext = injectCheckboxGroupRootContext(null);
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue ?? props.falseValue,
			passive: props.modelValue === void 0
		});
		const disabled = (0, vue_exports.computed)(() => checkboxGroupContext?.disabled.value || props.disabled);
		const isChecked = (0, vue_exports.computed)(() => isEqual(modelValue.value, props.trueValue));
		const checkboxState = (0, vue_exports.computed)(() => {
			if (!isNullish(checkboxGroupContext?.modelValue.value)) return isValueEqualOrExist(checkboxGroupContext.modelValue.value, props.value);
			else {
				if (modelValue.value === "indeterminate") return "indeterminate";
				return isChecked.value;
			}
		});
		function handleClick() {
			if (!isNullish(checkboxGroupContext?.modelValue.value)) {
				const modelValueArray = [...checkboxGroupContext.modelValue.value || []];
				if (isValueEqualOrExist(modelValueArray, props.value)) {
					const index = modelValueArray.findIndex((i) => isEqual(i, props.value));
					modelValueArray.splice(index, 1);
				} else modelValueArray.push(props.value);
				checkboxGroupContext.modelValue.value = modelValueArray;
			} else if (modelValue.value === "indeterminate") modelValue.value = props.trueValue;
			else modelValue.value = isChecked.value ? props.falseValue : props.trueValue;
		}
		const isFormControl = useFormControl(currentElement);
		const scopeIdAttrs = useForwardScopeId();
		const attrs = (0, vue_exports.useAttrs)();
		const ariaLabel = (0, vue_exports.computed)(() => {
			if (attrs["aria-label"]) return void 0;
			return props.id && currentElement.value ? (void 0).querySelector(`[for="${props.id}"]`)?.innerText : void 0;
		});
		provideCheckboxRootContext({
			disabled,
			state: checkboxState
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)(vue_exports.Fragment, null, [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)((0, vue_exports.unref)(checkboxGroupContext)?.rovingFocus.value ? (0, vue_exports.unref)(RovingFocusItem_default) : (0, vue_exports.unref)(Primitive)), (0, vue_exports.mergeProps)({
				..._ctx.$attrs,
				...(0, vue_exports.unref)(scopeIdAttrs)
			}, {
				id: _ctx.id,
				ref: (0, vue_exports.unref)(forwardRef),
				role: "checkbox",
				"as-child": _ctx.asChild,
				as: _ctx.as,
				type: _ctx.as === "button" ? "button" : void 0,
				"aria-checked": (0, vue_exports.unref)(isIndeterminate)(checkboxState.value) ? "mixed" : checkboxState.value,
				"aria-required": _ctx.required,
				"aria-label": _ctx.$attrs["aria-label"] || ariaLabel.value,
				"data-state": (0, vue_exports.unref)(getState)(checkboxState.value),
				"data-disabled": disabled.value ? "" : void 0,
				disabled: disabled.value,
				focusable: (0, vue_exports.unref)(checkboxGroupContext)?.rovingFocus.value ? !disabled.value : void 0,
				onKeydown: (0, vue_exports.withKeys)((0, vue_exports.withModifiers)(() => {}, ["prevent"]), ["enter"]),
				onClick: handleClick
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
					modelValue: (0, vue_exports.unref)(modelValue),
					state: checkboxState.value
				})]),
				_: 3
			}, 16, [
				"id",
				"as-child",
				"as",
				"type",
				"aria-checked",
				"aria-required",
				"aria-label",
				"data-state",
				"data-disabled",
				"disabled",
				"focusable",
				"onKeydown"
			])), (0, vue_exports.unref)(isFormControl) && _ctx.name && !(0, vue_exports.unref)(checkboxGroupContext) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHiddenInput_default), (0, vue_exports.mergeProps)({
				key: 0,
				type: "checkbox",
				checked: !!checkboxState.value,
				name: _ctx.name,
				value: _ctx.value,
				disabled: disabled.value,
				required: _ctx.required
			}, (0, vue_exports.unref)(scopeIdAttrs)), null, 16, [
				"checked",
				"name",
				"value",
				"disabled",
				"required"
			])) : (0, vue_exports.createCommentVNode)("v-if", true)], 64);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Checkbox/CheckboxIndicator.js
var CheckboxIndicator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "CheckboxIndicator",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		const { forwardRef } = useForwardExpose();
		const rootContext = injectCheckboxRootContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), { present: _ctx.forceMount || (0, vue_exports.unref)(isIndeterminate)((0, vue_exports.unref)(rootContext).state.value) || (0, vue_exports.unref)(rootContext).state.value === true }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
					ref: (0, vue_exports.unref)(forwardRef),
					"data-state": (0, vue_exports.unref)(getState)((0, vue_exports.unref)(rootContext).state.value),
					"data-disabled": (0, vue_exports.unref)(rootContext).disabled.value ? "" : void 0,
					style: { pointerEvents: "none" },
					"as-child": _ctx.asChild,
					as: _ctx.as
				}, _ctx.$attrs), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"data-state",
					"data-disabled",
					"as-child",
					"as"
				])]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fcheckbox.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fcheckbox_default = {
	"slots": {
		"root": "relative flex items-start",
		"container": "flex items-center",
		"base": "rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-3",
		"indicator": "flex items-center justify-center size-full text-inverted",
		"icon": "shrink-0 size-full",
		"wrapper": "w-full",
		"label": "block font-medium text-default",
		"description": "text-muted"
	},
	"variants": {
		"color": {
			"primary": {
				"base": "outline-primary/25 focus-visible:ring-primary",
				"indicator": "bg-primary"
			},
			"secondary": {
				"base": "outline-secondary/25 focus-visible:ring-secondary",
				"indicator": "bg-secondary"
			},
			"success": {
				"base": "outline-success/25 focus-visible:ring-success",
				"indicator": "bg-success"
			},
			"info": {
				"base": "outline-info/25 focus-visible:ring-info",
				"indicator": "bg-info"
			},
			"warning": {
				"base": "outline-warning/25 focus-visible:ring-warning",
				"indicator": "bg-warning"
			},
			"error": {
				"base": "outline-error/25 focus-visible:ring-error",
				"indicator": "bg-error"
			},
			"neutral": {
				"base": "outline-inverted/25 focus-visible:ring-inverted",
				"indicator": "bg-inverted"
			}
		},
		"variant": {
			"list": { "root": "" },
			"card": { "root": "border border-muted rounded-lg" }
		},
		"indicator": {
			"start": {
				"root": "flex-row",
				"wrapper": "ms-2"
			},
			"end": {
				"root": "flex-row-reverse",
				"wrapper": "me-2"
			},
			"hidden": {
				"base": "sr-only",
				"wrapper": "text-center"
			}
		},
		"size": {
			"xs": {
				"base": "size-3",
				"container": "h-4",
				"wrapper": "text-xs"
			},
			"sm": {
				"base": "size-3.5",
				"container": "h-4",
				"wrapper": "text-xs"
			},
			"md": {
				"base": "size-4",
				"container": "h-5",
				"wrapper": "text-sm"
			},
			"lg": {
				"base": "size-4.5",
				"container": "h-5",
				"wrapper": "text-sm"
			},
			"xl": {
				"base": "size-5",
				"container": "h-6",
				"wrapper": "text-base"
			}
		},
		"required": { "true": { "label": "after:content-['*'] after:ms-0.5 after:text-error" } },
		"disabled": { "true": {
			"root": "opacity-75",
			"base": "cursor-not-allowed",
			"label": "cursor-not-allowed",
			"description": "cursor-not-allowed"
		} },
		"highlight": { "true": "" },
		"checked": { "true": "" }
	},
	"compoundVariants": [
		{
			"size": "xs",
			"variant": "card",
			"class": { "root": "p-2.5" }
		},
		{
			"size": "sm",
			"variant": "card",
			"class": { "root": "p-3" }
		},
		{
			"size": "md",
			"variant": "card",
			"class": { "root": "p-3.5" }
		},
		{
			"size": "lg",
			"variant": "card",
			"class": { "root": "p-4" }
		},
		{
			"size": "xl",
			"variant": "card",
			"class": { "root": "p-4.5" }
		},
		{
			"color": "primary",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-primary" }
		},
		{
			"color": "secondary",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-secondary" }
		},
		{
			"color": "success",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-success" }
		},
		{
			"color": "info",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-info" }
		},
		{
			"color": "warning",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-warning" }
		},
		{
			"color": "error",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-error" }
		},
		{
			"color": "neutral",
			"variant": "card",
			"class": { "root": "has-data-[state=checked]:border-inverted" }
		},
		{
			"variant": "card",
			"disabled": true,
			"class": { "root": "cursor-not-allowed" }
		},
		{
			"color": "primary",
			"highlight": true,
			"class": { "base": "ring-primary" }
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": { "base": "ring-secondary" }
		},
		{
			"color": "success",
			"highlight": true,
			"class": { "base": "ring-success" }
		},
		{
			"color": "info",
			"highlight": true,
			"class": { "base": "ring-info" }
		},
		{
			"color": "warning",
			"highlight": true,
			"class": { "base": "ring-warning" }
		},
		{
			"color": "error",
			"highlight": true,
			"class": { "base": "ring-error" }
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": { "base": "ring-inverted" }
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"variant": "list",
		"indicator": "start"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UCheckbox",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		indicator: {
			type: null,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		indeterminateIcon: {
			type: null,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		required: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		value: {
			type: null,
			required: false
		},
		id: {
			type: String,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		modelValue: {
			type: null,
			required: false
		},
		trueValue: {
			type: null,
			required: false
		},
		falseValue: {
			type: null,
			required: false
		}
	},
	emits: ["change", "update:modelValue"],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const slots = (0, vue_exports.useSlots)();
		const emits = __emit;
		const props = useComponentProps("checkbox", _props);
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "required", "value", "defaultValue", "modelValue", "trueValue", "falseValue"), emits);
		const { id: _id, emitFormChange, emitFormInput, size, color, highlight, name, disabled, ariaAttrs } = useFormField(_props);
		const id = _id.value ?? (0, vue_exports.useId)();
		const attrs = (0, vue_exports.useAttrs)();
		const forwardedAttrs = (0, vue_exports.computed)(() => {
			const { "data-state": _, ...rest } = attrs;
			return rest;
		});
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fcheckbox_default,
			...appConfig.ui?.checkbox || {}
		})({
			size: size.value ?? props.size,
			color: color.value ?? props.color,
			variant: props.variant,
			indicator: props.indicator,
			highlight: highlight.value ?? props.highlight,
			required: props.required,
			disabled: disabled.value
		}));
		function onUpdate(value) {
			const event = new Event("change", { target: { value } });
			emits("change", event);
			emitFormChange();
			emitFormInput();
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				as: !(0, vue_exports.unref)(props).variant || (0, vue_exports.unref)(props).variant === "list" ? (0, vue_exports.unref)(props).as : (0, vue_exports.unref)(Label_default),
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [(0, vue_exports.unref)(props).ui?.root, (0, vue_exports.unref)(props).class] })
			}, _attrs), {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div data-slot="container" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.container({ class: (0, vue_exports.unref)(props).ui?.container }))}"${_scopeId}>`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(CheckboxRoot_default), (0, vue_exports.mergeProps)({ id: (0, vue_exports.unref)(id) }, {
							...(0, vue_exports.unref)(rootProps),
							...forwardedAttrs.value,
							...(0, vue_exports.unref)(ariaAttrs)
						}, {
							name: (0, vue_exports.unref)(name),
							disabled: (0, vue_exports.unref)(disabled),
							"data-slot": "base",
							class: ui.value.base({ class: (0, vue_exports.unref)(props).ui?.base }),
							"onUpdate:modelValue": onUpdate
						}), {
							default: (0, vue_exports.withCtx)(({ state }, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(CheckboxIndicator_default), {
									"data-slot": "indicator",
									class: ui.value.indicator({ class: (0, vue_exports.unref)(props).ui?.indicator })
								}, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) if (state === "indeterminate") _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
											name: (0, vue_exports.unref)(props).indeterminateIcon || (0, vue_exports.unref)(appConfig).ui.icons.minus,
											"data-slot": "icon",
											class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
										}, null, _parent, _scopeId));
										else _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
											name: (0, vue_exports.unref)(props).icon || (0, vue_exports.unref)(appConfig).ui.icons.check,
											"data-slot": "icon",
											class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
										}, null, _parent, _scopeId));
										else return [state === "indeterminate" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
											key: 0,
											name: (0, vue_exports.unref)(props).indeterminateIcon || (0, vue_exports.unref)(appConfig).ui.icons.minus,
											"data-slot": "icon",
											class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
										}, null, 8, ["name", "class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
											key: 1,
											name: (0, vue_exports.unref)(props).icon || (0, vue_exports.unref)(appConfig).ui.icons.check,
											"data-slot": "icon",
											class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
										}, null, 8, ["name", "class"]))];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(CheckboxIndicator_default), {
									"data-slot": "indicator",
									class: ui.value.indicator({ class: (0, vue_exports.unref)(props).ui?.indicator })
								}, {
									default: (0, vue_exports.withCtx)(() => [state === "indeterminate" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
										key: 0,
										name: (0, vue_exports.unref)(props).indeterminateIcon || (0, vue_exports.unref)(appConfig).ui.icons.minus,
										"data-slot": "icon",
										class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
									}, null, 8, ["name", "class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
										key: 1,
										name: (0, vue_exports.unref)(props).icon || (0, vue_exports.unref)(appConfig).ui.icons.check,
										"data-slot": "icon",
										class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
									}, null, 8, ["name", "class"]))]),
									_: 2
								}, 1032, ["class"])];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div>`);
						if ((0, vue_exports.unref)(props).label || !!slots.label || (0, vue_exports.unref)(props).description || !!slots.description) {
							_push(`<div data-slot="wrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper }))}"${_scopeId}>`);
							if ((0, vue_exports.unref)(props).label || !!slots.label) (0, server_renderer_exports.ssrRenderVNode)(_push, (0, vue_exports.createVNode)((0, vue_exports.resolveDynamicComponent)(!(0, vue_exports.unref)(props).variant || (0, vue_exports.unref)(props).variant === "list" ? (0, vue_exports.unref)(Label_default) : "p"), {
								for: (0, vue_exports.unref)(id),
								"data-slot": "label",
								class: ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label })
							}, {
								default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
									if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "label", { label: (0, vue_exports.unref)(props).label }, () => {
										_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).label)}`);
									}, _push, _parent, _scopeId);
									else return [(0, vue_exports.renderSlot)(_ctx.$slots, "label", { label: (0, vue_exports.unref)(props).label }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).label), 1)])];
								}),
								_: 3
							}), _parent, _scopeId);
							else _push(`<!---->`);
							if ((0, vue_exports.unref)(props).description || !!slots.description) {
								_push(`<p data-slot="description" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description }))}"${_scopeId}>`);
								(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", { description: (0, vue_exports.unref)(props).description }, () => {
									_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
								}, _push, _parent, _scopeId);
								_push(`</p>`);
							} else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
					} else return [(0, vue_exports.createVNode)("div", {
						"data-slot": "container",
						class: ui.value.container({ class: (0, vue_exports.unref)(props).ui?.container })
					}, [(0, vue_exports.createVNode)((0, vue_exports.unref)(CheckboxRoot_default), (0, vue_exports.mergeProps)({ id: (0, vue_exports.unref)(id) }, {
						...(0, vue_exports.unref)(rootProps),
						...forwardedAttrs.value,
						...(0, vue_exports.unref)(ariaAttrs)
					}, {
						name: (0, vue_exports.unref)(name),
						disabled: (0, vue_exports.unref)(disabled),
						"data-slot": "base",
						class: ui.value.base({ class: (0, vue_exports.unref)(props).ui?.base }),
						"onUpdate:modelValue": onUpdate
					}), {
						default: (0, vue_exports.withCtx)(({ state }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(CheckboxIndicator_default), {
							"data-slot": "indicator",
							class: ui.value.indicator({ class: (0, vue_exports.unref)(props).ui?.indicator })
						}, {
							default: (0, vue_exports.withCtx)(() => [state === "indeterminate" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
								key: 0,
								name: (0, vue_exports.unref)(props).indeterminateIcon || (0, vue_exports.unref)(appConfig).ui.icons.minus,
								"data-slot": "icon",
								class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
							}, null, 8, ["name", "class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
								key: 1,
								name: (0, vue_exports.unref)(props).icon || (0, vue_exports.unref)(appConfig).ui.icons.check,
								"data-slot": "icon",
								class: ui.value.icon({ class: (0, vue_exports.unref)(props).ui?.icon })
							}, null, 8, ["name", "class"]))]),
							_: 2
						}, 1032, ["class"])]),
						_: 1
					}, 16, [
						"id",
						"name",
						"disabled",
						"class"
					])], 2), (0, vue_exports.unref)(props).label || !!slots.label || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
						key: 0,
						"data-slot": "wrapper",
						class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
					}, [(0, vue_exports.unref)(props).label || !!slots.label ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(!(0, vue_exports.unref)(props).variant || (0, vue_exports.unref)(props).variant === "list" ? (0, vue_exports.unref)(Label_default) : "p"), {
						key: 0,
						for: (0, vue_exports.unref)(id),
						"data-slot": "label",
						class: ui.value.label({ class: (0, vue_exports.unref)(props).ui?.label })
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "label", { label: (0, vue_exports.unref)(props).label }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).label), 1)])]),
						_: 3
					}, 8, ["for", "class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("p", {
						key: 1,
						"data-slot": "description",
						class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
					}, [(0, vue_exports.renderSlot)(_ctx.$slots, "description", { description: (0, vue_exports.unref)(props).description }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true)];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Checkbox.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Checkbox-Cp-D5Mep.mjs.map
