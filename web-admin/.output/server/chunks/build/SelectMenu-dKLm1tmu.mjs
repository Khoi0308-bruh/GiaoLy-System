import { v as vue_exports, g as useComponentProps, w as useLocale, h as useAppConfig, l as useForwardProps, x as usePortal, m as useFormField, y as useFieldGroup, z as useComponentIcons, t as tv, A as isArrayOfArray, B as compare$1, s as server_renderer_exports, C as get, _ as _sfc_main$1, f as _sfc_main$3, D as _sfc_main$4, d as _sfc_main$2, F as FieldGroupReset, E as usePrimitiveElement, n as useForwardExpose, P as Primitive, G as looseToNumber, H as getDisplayValue, T as Teleport_default, p as Presence_default, q as createContext, I as useCollection, J as useForwardProps$1, K as refAutoReset, L as getActiveElement } from '../virtual/entry.mjs';
import { F as FocusScope_default, u as useBodyScrollLock, a as useHideOthers, D as DismissableLayer_default, h as handleAndDispatchCustomEvent } from './utils-SyRrd6Ur.mjs';
import { u as useFilter, a as useFilter$1, b as useComposing } from './useFilter-BEMR7loY.mjs';
import { u as useId, a as useDirection } from './useId-D2M6x4XU.mjs';
import { u as useTypeahead, a as useFocusGuards, g as getNextMatch } from './useTypeahead-UAu5CRpq.mjs';
import { u as useFormControl } from './useFormControl-DR703Aa5.mjs';
import { P as PopperRoot_default, a as PopperAnchor_default, u as useForwardPropsEmits, b as PopperArrow_default, c as PopperContent_default } from './PopperArrow-akPD5Wa6.mjs';
import { V as VisuallyHiddenInput_default } from './VisuallyHiddenInput-DjK2EyXI.mjs';
import { M as MAP_KEY_TO_FOCUS_INTENT, g as getFocusIntent } from './utils-Dj6yoN4y.mjs';
import { u as useVirtualizer } from './esm-DyCVLeOU.mjs';
import { _ as _sfc_main$5 } from './Input-Bk0TlYbs.mjs';
import { y as defu, E as isEqual } from '../_/nitro.mjs';
import { reactivePick, createReusableTemplate, useVModel, createEventHook, useParentElement } from '@vueuse/core';

//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/shared/arrays.js
/**
* The function `findValuesBetween` takes an array and two values, then returns a subarray containing
* elements between the first occurrence of the start value and the first occurrence of the end value
* in the array.
* @param {T[]} array - The `array` parameter is an array of values of type `T`.
* @param {T} start - The `start` parameter is the value that marks the beginning of the range you want
* to find in the array.
* @param {T} end - The `end` parameter in the `findValuesBetween` function represents the end value
* that you want to find in the array. This function will return a subarray of values that are between
* the `start` and `end` values in the original array.
* @returns The `findValuesBetween` function returns an array of values from the input array that are
* between the `start` and `end` values (inclusive). If either the `start` or `end` values are not
* found in the input array, an empty array is returned.
*/
function findValuesBetween(array, start, end) {
	const startIndex = array.findIndex((i) => isEqual(i, start));
	const endIndex = array.findIndex((i) => isEqual(i, end));
	if (startIndex === -1 || endIndex === -1) return [];
	const [minIndex, maxIndex] = [startIndex, endIndex].sort((a, b) => a - b);
	return array.slice(minIndex, maxIndex + 1);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useKbd.js
function useKbd() {
	return {
		ALT: "Alt",
		ARROW_DOWN: "ArrowDown",
		ARROW_LEFT: "ArrowLeft",
		ARROW_RIGHT: "ArrowRight",
		ARROW_UP: "ArrowUp",
		BACKSPACE: "Backspace",
		CAPS_LOCK: "CapsLock",
		CONTROL: "Control",
		DELETE: "Delete",
		END: "End",
		ENTER: "Enter",
		ESCAPE: "Escape",
		F1: "F1",
		F10: "F10",
		F11: "F11",
		F12: "F12",
		F2: "F2",
		F3: "F3",
		F4: "F4",
		F5: "F5",
		F6: "F6",
		F7: "F7",
		F8: "F8",
		F9: "F9",
		HOME: "Home",
		META: "Meta",
		PAGE_DOWN: "PageDown",
		PAGE_UP: "PageUp",
		SHIFT: "Shift",
		SPACE: " ",
		TAB: "Tab",
		CTRL: "Control",
		ASTERISK: "*",
		SPACE_CODE: "Space"
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/utils.js
function queryCheckedElement(parentEl) {
	return parentEl?.querySelector("[data-state=checked]");
}
function valueComparator(value, currentValue, comparator) {
	if (value === void 0) return false;
	else if (Array.isArray(value)) return value.some((val) => compare(val, currentValue, comparator));
	else return compare(value, currentValue, comparator);
}
function compare(value, currentValue, comparator) {
	if (value === void 0 || currentValue === void 0) return false;
	if (typeof value === "string") return value === currentValue;
	if (typeof comparator === "function") return comparator(value, currentValue);
	if (typeof comparator === "string") return value?.[comparator] === currentValue?.[comparator];
	return isEqual(value, currentValue);
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxRoot.js
var [injectListboxRootContext, provideListboxRootContext] = /*#__PURE__*/ createContext("ListboxRoot");
var ListboxRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxRoot",
	props: {
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		orientation: {
			type: String,
			required: false,
			default: "vertical"
		},
		dir: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		selectionBehavior: {
			type: String,
			required: false,
			default: "toggle"
		},
		highlightOnHover: {
			type: Boolean,
			required: false
		},
		by: {
			type: [String, Function],
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
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
	emits: [
		"update:modelValue",
		"highlight",
		"entryFocus",
		"leave"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { multiple, highlightOnHover, orientation, disabled, selectionBehavior, dir: propDir } = (0, vue_exports.toRefs)(props);
		const { getItems } = useCollection({ isProvider: true });
		const { handleTypeaheadSearch } = useTypeahead();
		const { primitiveElement, currentElement } = usePrimitiveElement();
		const kbd = useKbd();
		const dir = useDirection(propDir);
		const isFormControl = useFormControl(currentElement);
		const firstValue = (0, vue_exports.ref)();
		const isUserAction = (0, vue_exports.ref)(false);
		const focusable = (0, vue_exports.ref)(true);
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
			passive: props.modelValue === void 0,
			deep: true
		});
		function onValueChange(val) {
			isUserAction.value = true;
			if (props.multiple) {
				const modelArray = Array.isArray(modelValue.value) ? [...modelValue.value] : [];
				const index = modelArray.findIndex((i) => compare(i, val, props.by));
				if (props.selectionBehavior === "toggle") {
					index === -1 ? modelArray.push(val) : modelArray.splice(index, 1);
					modelValue.value = modelArray;
				} else {
					modelValue.value = [val];
					firstValue.value = val;
				}
			} else if (props.selectionBehavior === "toggle") if (compare(modelValue.value, val, props.by)) modelValue.value = void 0;
			else modelValue.value = val;
			else modelValue.value = val;
			setTimeout(() => {
				isUserAction.value = false;
			}, 1);
		}
		const highlightedElement = (0, vue_exports.ref)(null);
		const previousElement = (0, vue_exports.ref)(null);
		const isVirtual = (0, vue_exports.ref)(false);
		const isComposing = (0, vue_exports.ref)(false);
		const virtualFocusHook = createEventHook();
		const virtualKeydownHook = createEventHook();
		const virtualHighlightHook = createEventHook();
		function getCollectionItem() {
			return getItems().map((i) => i.ref).filter((i) => i.dataset.disabled !== "");
		}
		function changeHighlight(el, scrollIntoView = true, focus) {
			if (!el) return;
			highlightedElement.value = el;
			if (focus ?? focusable.value) highlightedElement.value.focus();
			if (scrollIntoView) highlightedElement.value.scrollIntoView({ block: "nearest" });
			const highlightedItem = getItems().find((i) => i.ref === el);
			emits("highlight", highlightedItem);
		}
		function highlightItem(value) {
			if (isVirtual.value) virtualHighlightHook.trigger(value);
			else {
				const item = getItems().find((i) => compare(i.value, value, props.by));
				if (item) {
					highlightedElement.value = item.ref;
					changeHighlight(item.ref);
				}
			}
		}
		function onKeydownEnter(event) {
			if (highlightedElement.value && highlightedElement.value.isConnected) {
				if (event.ctrlKey || event.metaKey || event.altKey) return;
				event.preventDefault();
				event.stopPropagation();
				if (!isComposing.value) highlightedElement.value.click();
			}
		}
		function onKeydownTypeAhead(event) {
			if (!focusable.value) return;
			isUserAction.value = true;
			if (isVirtual.value) virtualKeydownHook.trigger(event);
			else {
				const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
				if (isMetaKey && event.key === "a" && multiple.value) {
					const collection = getItems();
					const values = collection.map((i) => i.value);
					modelValue.value = [...values];
					event.preventDefault();
					const lastItem = collection.at(-1);
					if (lastItem) changeHighlight(lastItem.ref);
				} else if (!isMetaKey) {
					const el = handleTypeaheadSearch(event.key, getItems());
					if (el) changeHighlight(el);
				}
			}
			setTimeout(() => {
				isUserAction.value = false;
			}, 1);
		}
		function onCompositionStart() {
			isComposing.value = true;
		}
		function onCompositionEnd() {
			(0, vue_exports.nextTick)(() => {
				isComposing.value = false;
			});
		}
		function highlightFirstItem() {
			(0, vue_exports.nextTick)(() => {
				onKeydownNavigation(new KeyboardEvent("keydown", { key: "PageUp" }));
			});
		}
		function onLeave(event) {
			const el = highlightedElement.value;
			if (el?.isConnected) previousElement.value = el;
			highlightedElement.value = null;
			emits("leave", event);
		}
		function onEnter(event) {
			const entryFocusEvent = new CustomEvent("listbox.entryFocus", {
				bubbles: false,
				cancelable: true
			});
			event.currentTarget?.dispatchEvent(entryFocusEvent);
			emits("entryFocus", entryFocusEvent);
			if (entryFocusEvent.defaultPrevented) return;
			if (previousElement.value) changeHighlight(previousElement.value);
			else {
				const el = getCollectionItem()?.[0];
				changeHighlight(el);
			}
		}
		function onKeydownNavigation(event) {
			const intent = getFocusIntent(event, orientation.value, dir.value);
			if (!intent) return;
			let collection = getCollectionItem();
			if (highlightedElement.value) {
				if (intent === "last") collection.reverse();
				else if (intent === "prev" || intent === "next") {
					if (intent === "prev") collection.reverse();
					const currentIndex = collection.indexOf(highlightedElement.value);
					collection = collection.slice(currentIndex + 1);
				}
				handleMultipleReplace(event, collection[0]);
			}
			if (collection.length) {
				const index = !highlightedElement.value && intent === "prev" ? collection.length - 1 : 0;
				changeHighlight(collection[index]);
			}
			if (isVirtual.value) return virtualKeydownHook.trigger(event);
		}
		function handleMultipleReplace(event, targetEl) {
			if (isVirtual.value || props.selectionBehavior !== "replace" || !multiple.value || !Array.isArray(modelValue.value)) return;
			if ((event.altKey || event.ctrlKey || event.metaKey) && !event.shiftKey) return;
			if (event.shiftKey) {
				const collection = getItems().filter((i) => i.ref.dataset.disabled !== "");
				let lastValue = collection.find((i) => i.ref === targetEl)?.value;
				if (event.key === kbd.END) lastValue = collection.at(-1)?.value;
				else if (event.key === kbd.HOME) lastValue = collection[0]?.value;
				if (!lastValue || !firstValue.value) return;
				const values = findValuesBetween(collection.map((i) => i.value), firstValue.value, lastValue);
				modelValue.value = values;
			}
		}
		async function highlightSelected(event, scroll = true) {}
		let hasHighlightedOnMount = false;
		(0, vue_exports.watch)(modelValue, () => {
			if (!isUserAction.value) {
				const scroll = hasHighlightedOnMount;
				hasHighlightedOnMount = true;
				(0, vue_exports.nextTick)(() => {
					highlightSelected(void 0, scroll);
				});
			}
		}, {
			immediate: true,
			deep: true
		});
		__expose({
			highlightedElement,
			highlightItem,
			highlightFirstItem,
			highlightSelected,
			getItems
		});
		provideListboxRootContext({
			modelValue,
			onValueChange,
			multiple,
			orientation,
			dir,
			disabled,
			highlightOnHover,
			highlightedElement,
			isVirtual,
			virtualFocusHook,
			virtualKeydownHook,
			virtualHighlightHook,
			by: props.by,
			firstValue,
			selectionBehavior,
			focusable,
			onLeave,
			onEnter,
			changeHighlight,
			onKeydownEnter,
			onKeydownNavigation,
			onKeydownTypeAhead,
			onCompositionStart,
			onCompositionEnd,
			highlightFirstItem
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				as: _ctx.as,
				"as-child": _ctx.asChild,
				dir: (0, vue_exports.unref)(dir),
				"data-disabled": (0, vue_exports.unref)(disabled) ? "" : void 0,
				onPointerleave: onLeave,
				onFocusout: _cache[0] || (_cache[0] = async (event) => {
					const target = event.relatedTarget || event.target;
					await (0, vue_exports.nextTick)();
					if (highlightedElement.value && (0, vue_exports.unref)(currentElement) && !(0, vue_exports.unref)(currentElement).contains(target)) onLeave(event);
				})
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { modelValue: (0, vue_exports.unref)(modelValue) }), (0, vue_exports.unref)(isFormControl) && _ctx.name ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHiddenInput_default), {
					key: 0,
					name: _ctx.name,
					value: (0, vue_exports.unref)(modelValue),
					disabled: (0, vue_exports.unref)(disabled),
					required: _ctx.required
				}, null, 8, [
					"name",
					"value",
					"disabled",
					"required"
				])) : (0, vue_exports.createCommentVNode)("v-if", true)]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"dir",
				"data-disabled"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxContent.js
var ListboxContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxContent",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const { CollectionSlot } = useCollection();
		const rootContext = injectListboxRootContext();
		const isClickFocus = refAutoReset(false, 10);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(CollectionSlot), null, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), {
					role: "listbox",
					as: _ctx.as,
					"as-child": _ctx.asChild,
					tabindex: (0, vue_exports.unref)(rootContext).focusable.value ? (0, vue_exports.unref)(rootContext).highlightedElement.value ? "-1" : "0" : "-1",
					"aria-orientation": (0, vue_exports.unref)(rootContext).orientation.value,
					"aria-multiselectable": !!(0, vue_exports.unref)(rootContext).multiple.value,
					"data-orientation": (0, vue_exports.unref)(rootContext).orientation.value,
					onMousedown: _cache[0] || (_cache[0] = (0, vue_exports.withModifiers)(($event) => isClickFocus.value = true, ["left"])),
					onFocus: _cache[1] || (_cache[1] = (ev) => {
						if ((0, vue_exports.unref)(isClickFocus)) return;
						(0, vue_exports.unref)(rootContext).onEnter(ev);
					}),
					onKeydown: [
						_cache[2] || (_cache[2] = (0, vue_exports.withKeys)((event) => {
							if ((0, vue_exports.unref)(rootContext).orientation.value === "vertical" && (event.key === "ArrowLeft" || event.key === "ArrowRight") || (0, vue_exports.unref)(rootContext).orientation.value === "horizontal" && (event.key === "ArrowUp" || event.key === "ArrowDown")) return;
							event.preventDefault();
							(0, vue_exports.unref)(rootContext).focusable.value && (0, vue_exports.unref)(rootContext).onKeydownNavigation(event);
						}, [
							"down",
							"up",
							"left",
							"right",
							"home",
							"end"
						])),
						(0, vue_exports.withKeys)((0, vue_exports.unref)(rootContext).onKeydownEnter, ["enter"]),
						(0, vue_exports.unref)(rootContext).onKeydownTypeAhead
					]
				}, {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"tabindex",
					"aria-orientation",
					"aria-multiselectable",
					"data-orientation",
					"onKeydown"
				])]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxFilter.js
var ListboxFilter_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxFilter",
	props: {
		modelValue: {
			type: String,
			required: false
		},
		autoFocus: {
			type: Boolean,
			required: false
		},
		disabled: {
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
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const modelValue = useVModel(props, "modelValue", __emit, {
			defaultValue: "",
			passive: props.modelValue === void 0
		});
		const rootContext = injectListboxRootContext();
		const { primitiveElement} = usePrimitiveElement();
		const disabled = (0, vue_exports.computed)(() => props.disabled || rootContext.disabled.value || false);
		const activedescendant = (0, vue_exports.ref)();
		(0, vue_exports.watchSyncEffect)(() => activedescendant.value = rootContext.highlightedElement.value?.id);
		const { isComposing, handleCompositionStart, handleCompositionEnd } = useComposing((event) => {
			modelValue.value = event.target.value;
			rootContext.onCompositionEnd();
			rootContext.highlightFirstItem();
		});
		function onCompositionStart() {
			rootContext.onCompositionStart();
			handleCompositionStart();
		}
		function handleInput(event) {
			if (isComposing.value) return;
			modelValue.value = event.target.value;
			rootContext.highlightFirstItem();
		}
		function handleKeydownNavigation(event) {
			if (isComposing.value) return;
			event.preventDefault();
			rootContext.onKeydownNavigation(event);
		}
		function handleKeydownEnter(event) {
			if (isComposing.value) return;
			rootContext.onKeydownEnter(event);
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				as: _ctx.as,
				"as-child": _ctx.asChild,
				value: (0, vue_exports.unref)(modelValue),
				disabled: disabled.value ? "" : void 0,
				"data-disabled": disabled.value ? "" : void 0,
				"aria-disabled": disabled.value ?? void 0,
				"aria-activedescendant": activedescendant.value,
				type: "text",
				onKeydown: [(0, vue_exports.withKeys)(handleKeydownNavigation, [
					"down",
					"up",
					"home",
					"end"
				]), (0, vue_exports.withKeys)(handleKeydownEnter, ["enter"])],
				onInput: handleInput,
				onCompositionstart: onCompositionStart,
				onCompositionend: (0, vue_exports.unref)(handleCompositionEnd)
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { modelValue: (0, vue_exports.unref)(modelValue) })]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"value",
				"disabled",
				"data-disabled",
				"aria-disabled",
				"aria-activedescendant",
				"onCompositionend"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxGroup.js
var [injectListboxGroupContext, provideListboxGroupContext] = /*#__PURE__*/ createContext("ListboxGroup");
var ListboxGroup_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const id = useId(void 0, "reka-listbox-group");
		provideListboxGroupContext({ id });
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ role: "group" }, props, { "aria-labelledby": (0, vue_exports.unref)(id) }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["aria-labelledby"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxItem.js
var LISTBOX_SELECT = "listbox.select";
var [injectListboxItemContext, provideListboxItemContext] = /*#__PURE__*/ createContext("ListboxItem");
var ListboxItem_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxItem",
	props: {
		value: {
			type: null,
			required: true
		},
		disabled: {
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
			default: "div"
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const id = useId(void 0, "reka-listbox-item");
		const { CollectionItem } = useCollection();
		const { forwardRef, currentElement } = useForwardExpose();
		const rootContext = injectListboxRootContext();
		const isHighlighted = (0, vue_exports.computed)(() => currentElement.value != null && currentElement.value === rootContext.highlightedElement.value);
		const isSelected = (0, vue_exports.computed)(() => valueComparator(rootContext.modelValue.value, props.value, rootContext.by));
		const disabled = (0, vue_exports.computed)(() => rootContext.disabled.value || props.disabled);
		async function handleSelect(ev) {
			emits("select", ev);
			if (ev?.defaultPrevented) return;
			if (!disabled.value && ev) {
				rootContext.onValueChange(props.value);
				rootContext.changeHighlight(currentElement.value);
			}
		}
		function handleSelectCustomEvent(ev) {
			handleAndDispatchCustomEvent(LISTBOX_SELECT, handleSelect, {
				originalEvent: ev,
				value: props.value
			});
		}
		provideListboxItemContext({ isSelected });
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(CollectionItem), { value: _ctx.value }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.withMemo)([
					isHighlighted.value,
					isSelected.value,
					disabled.value,
					(0, vue_exports.unref)(rootContext).focusable.value
				], () => (0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ id: (0, vue_exports.unref)(id) }, _ctx.$attrs, {
					ref: (0, vue_exports.unref)(forwardRef),
					role: "option",
					tabindex: (0, vue_exports.unref)(rootContext).focusable.value ? isHighlighted.value ? "0" : "-1" : -1,
					"aria-selected": isSelected.value,
					as: _ctx.as,
					"as-child": _ctx.asChild,
					disabled: disabled.value ? "" : void 0,
					"data-disabled": disabled.value ? "" : void 0,
					"data-highlighted": isHighlighted.value ? "" : void 0,
					"data-state": isSelected.value ? "checked" : "unchecked",
					onClick: handleSelectCustomEvent,
					onKeydown: (0, vue_exports.withKeys)((0, vue_exports.withModifiers)(handleSelectCustomEvent, ["prevent"]), ["space"]),
					onPointermove: _cache[0] || (_cache[0] = () => {
						if ((0, vue_exports.unref)(rootContext).highlightedElement.value === (0, vue_exports.unref)(currentElement)) return;
						if ((0, vue_exports.unref)(rootContext).highlightOnHover.value) (0, vue_exports.unref)(rootContext).changeHighlight((0, vue_exports.unref)(currentElement), false, false);
					})
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"tabindex",
					"aria-selected",
					"as",
					"as-child",
					"disabled",
					"data-disabled",
					"data-highlighted",
					"data-state",
					"onKeydown"
				]), _cache, 1)]),
				_: 3
			}, 8, ["value"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxItemIndicator.js
var ListboxItemIndicator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxItemIndicator",
	props: {
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
		const props = __props;
		useForwardExpose();
		const itemContext = injectListboxItemContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(itemContext).isSelected.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
				key: 0,
				"aria-hidden": "true"
			}, props), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Listbox/ListboxVirtualizer.js
var ListboxVirtualizer_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ListboxVirtualizer",
	props: {
		options: {
			type: Array,
			required: true
		},
		overscan: {
			type: Number,
			required: false
		},
		estimateSize: {
			type: [Number, Function],
			required: false
		},
		textContent: {
			type: Function,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const slots = (0, vue_exports.useSlots)();
		const rootContext = injectListboxRootContext();
		const parentEl = useParentElement();
		const { getItems } = useCollection();
		rootContext.isVirtual.value = true;
		const padding = (0, vue_exports.computed)(() => {
			const el = parentEl.value;
			if (!el) return {
				start: 0,
				end: 0
			};
			else {
				const styles = (void 0).getComputedStyle(el);
				return {
					start: Number.parseFloat(styles.paddingBlockStart || styles.paddingTop),
					end: Number.parseFloat(styles.paddingBlockEnd || styles.paddingBottom)
				};
			}
		});
		const virtualizer = useVirtualizer({
			get scrollPaddingStart() {
				return padding.value.start;
			},
			get scrollPaddingEnd() {
				return padding.value.end;
			},
			get count() {
				return props.options.length;
			},
			get horizontal() {
				return rootContext.orientation.value === "horizontal";
			},
			estimateSize(index) {
				if (typeof props.estimateSize === "function") return props.estimateSize(index);
				return props.estimateSize ?? 28;
			},
			getScrollElement() {
				return parentEl.value;
			},
			overscan: props.overscan ?? 12
		});
		const virtualizedItems = (0, vue_exports.computed)(() => virtualizer.value.getVirtualItems().map((item) => {
			const defaultNode = slots.default({
				option: props.options[item.index],
				virtualizer: virtualizer.value,
				virtualItem: item
			})[0];
			return {
				item,
				is: (0, vue_exports.cloneVNode)(defaultNode.type === vue_exports.Fragment && Array.isArray(defaultNode.children) ? defaultNode.children.find((child) => typeof child.type !== "symbol") : defaultNode, {
					"key": `${item.key}`,
					"data-index": item.index,
					"aria-setsize": props.options.length,
					"aria-posinset": item.index + 1,
					"style": {
						position: "absolute",
						top: 0,
						left: 0,
						transform: `translateY(${item.start}px)`,
						overflowAnchor: "none"
					}
				})
			};
		}));
		rootContext.virtualFocusHook.on(({ event, scroll }) => {
			const index = props.options.findIndex((option) => {
				if (Array.isArray(rootContext.modelValue.value)) return compare(option, rootContext.modelValue.value[0], rootContext.by);
				else return compare(option, rootContext.modelValue.value, rootContext.by);
			});
			if (index !== -1) {
				event?.preventDefault();
				virtualizer.value.scrollToIndex(index, { align: "start" });
				requestAnimationFrame(() => {
					const item = queryCheckedElement(parentEl.value);
					if (item) {
						rootContext.changeHighlight(item, scroll, scroll ? void 0 : false);
						if (event) item?.focus();
					}
				});
			} else if (scroll) rootContext.highlightFirstItem();
			else requestAnimationFrame(() => {
				const item = getItems().find((i) => i.ref.dataset.disabled !== "")?.ref;
				if (item) rootContext.changeHighlight(item, false, false);
			});
		});
		rootContext.virtualHighlightHook.on((value) => {
			const index = props.options.findIndex((option) => {
				return compare(option, value, rootContext.by);
			});
			virtualizer.value.scrollToIndex(index, { align: "start" });
			requestAnimationFrame(() => {
				const item = queryCheckedElement(parentEl.value);
				if (item) rootContext.changeHighlight(item);
			});
		});
		const search = refAutoReset("", 1e3);
		const optionsWithMetadata = (0, vue_exports.computed)(() => {
			const parseTextContent = (option) => {
				if (props.textContent) return props.textContent(option);
				else return option?.toString().toLowerCase();
			};
			return props.options.map((option, index) => ({
				index,
				textContent: parseTextContent(option)
			}));
		});
		function handleMultipleReplace(event, intent) {
			if (!rootContext.firstValue?.value || !rootContext.multiple.value || !Array.isArray(rootContext.modelValue.value)) return;
			const lastValue = getItems().filter((i) => i.ref.dataset.disabled !== "").find((i) => i.ref === rootContext.highlightedElement.value)?.value;
			if (!lastValue) return;
			let value = null;
			switch (intent) {
				case "prev":
				case "next":
					value = findValuesBetween(props.options, rootContext.firstValue.value, lastValue);
					break;
				case "first":
					value = findValuesBetween(props.options, rootContext.firstValue.value, props.options?.[0]);
					break;
				case "last":
					value = findValuesBetween(props.options, rootContext.firstValue.value, props.options.at(-1));
					break;
			}
			rootContext.modelValue.value = value;
		}
		rootContext.virtualKeydownHook.on((event) => {
			const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
			if (event.key === "Tab" && !isMetaKey) return;
			let intent = MAP_KEY_TO_FOCUS_INTENT[event.key];
			if (isMetaKey && event.key === "a" && rootContext.multiple.value) {
				event.preventDefault();
				rootContext.modelValue.value = [...props.options];
				intent = "last";
			} else if (event.shiftKey && intent) handleMultipleReplace(event, intent);
			if (["first", "last"].includes(intent)) {
				event.preventDefault();
				const index = intent === "first" ? 0 : props.options.length - 1;
				virtualizer.value.scrollToIndex(index);
				requestAnimationFrame(() => {
					const items = getItems();
					const item = intent === "first" ? items[0] : items.at(-1);
					if (item) rootContext.changeHighlight(item.ref);
				});
			} else if (!intent && !isMetaKey) {
				search.value += event.key;
				const currentIndex = Number(getActiveElement()?.getAttribute("data-index"));
				const currentMatch = optionsWithMetadata.value[currentIndex].textContent;
				const next = getNextMatch(optionsWithMetadata.value.map((i) => i.textContent ?? ""), search.value, currentMatch);
				const nextMatch = optionsWithMetadata.value.find((option) => option.textContent === next);
				if (nextMatch) {
					virtualizer.value.scrollToIndex(nextMatch.index, { align: "start" });
					requestAnimationFrame(() => {
						const item = parentEl.value.querySelector(`[data-index="${nextMatch.index}"]`);
						if (item instanceof HTMLElement) rootContext.changeHighlight(item);
					});
				}
			}
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createElementBlock)("div", {
				"data-reka-virtualizer": "",
				style: (0, vue_exports.normalizeStyle)({
					position: "relative",
					width: "100%",
					height: `${(0, vue_exports.unref)(virtualizer).getTotalSize()}px`
				})
			}, [((0, vue_exports.openBlock)(true), (0, vue_exports.createElementBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(virtualizedItems.value, ({ is, item }) => {
				return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)(is), { key: item.index });
			}), 128))], 4);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxRoot.js
var [injectComboboxRootContext, provideComboboxRootContext] = /*#__PURE__*/ createContext("ComboboxRoot");
var ComboboxRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxRoot",
	props: {
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		resetSearchTermOnBlur: {
			type: Boolean,
			required: false,
			default: true
		},
		resetSearchTermOnSelect: {
			type: Boolean,
			required: false,
			default: true
		},
		openOnFocus: {
			type: Boolean,
			required: false,
			default: false
		},
		openOnClick: {
			type: Boolean,
			required: false,
			default: false
		},
		ignoreFilter: {
			type: Boolean,
			required: false
		},
		resetModelValueOnClear: {
			type: Boolean,
			required: false,
			default: false
		},
		modelValue: {
			type: null,
			required: false
		},
		defaultValue: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		highlightOnHover: {
			type: Boolean,
			required: false,
			default: true
		},
		by: {
			type: [String, Function],
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
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
	emits: [
		"update:modelValue",
		"highlight",
		"update:open"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { primitiveElement, currentElement: parentElement } = usePrimitiveElement();
		const { multiple, disabled, ignoreFilter, resetSearchTermOnSelect, openOnFocus, openOnClick, dir: propDir, resetModelValueOnClear, highlightOnHover } = (0, vue_exports.toRefs)(props);
		const dir = useDirection(propDir);
		const modelValue = useVModel(props, "modelValue", emits, {
			defaultValue: props.defaultValue ?? (multiple.value ? [] : void 0),
			passive: props.modelValue === void 0,
			deep: true
		});
		const open = useVModel(props, "open", emits, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		async function onOpenChange(val) {
			open.value = val;
			filterSearch.value = "";
			if (val) {
				await (0, vue_exports.nextTick)();
				primitiveElement.value?.highlightSelected();
				isUserInputted.value = true;
				inputElement.value?.focus();
			} else {
				isUserInputted.value = false;
				setTimeout(() => {
					if (!val && props.resetSearchTermOnBlur) resetSearchTerm.trigger();
				}, 1);
			}
		}
		const resetSearchTerm = createEventHook();
		const isUserInputted = (0, vue_exports.ref)(false);
		const isVirtual = (0, vue_exports.ref)(false);
		const inputElement = (0, vue_exports.ref)();
		const triggerElement = (0, vue_exports.ref)();
		const highlightedElement = (0, vue_exports.computed)(() => primitiveElement.value?.highlightedElement ?? void 0);
		const allItems = (0, vue_exports.ref)(/* @__PURE__ */ new Map());
		const allGroups = (0, vue_exports.ref)(/* @__PURE__ */ new Map());
		const { contains } = useFilter$1({ sensitivity: "base" });
		const filterSearch = (0, vue_exports.ref)("");
		const filterState = (0, vue_exports.computed)((oldValue) => {
			if (!filterSearch.value || props.ignoreFilter || isVirtual.value) return {
				count: allItems.value.size,
				items: oldValue?.items ?? /* @__PURE__ */ new Map(),
				groups: oldValue?.groups ?? new Set(allGroups.value.keys())
			};
			let itemCount = 0;
			const filteredItems = /* @__PURE__ */ new Map();
			const filteredGroups = /* @__PURE__ */ new Set();
			for (const [id, value] of allItems.value) {
				const score = contains(value, filterSearch.value);
				filteredItems.set(id, score ? 1 : 0);
				if (score) itemCount++;
			}
			for (const [groupId, group] of allGroups.value) for (const itemId of group) if (filteredItems.get(itemId) > 0) {
				filteredGroups.add(groupId);
				break;
			}
			return {
				count: itemCount,
				items: filteredItems,
				groups: filteredGroups
			};
		});
		(0, vue_exports.getCurrentInstance)();
		__expose({
			filtered: filterState,
			highlightedElement,
			highlightItem: primitiveElement.value?.highlightItem,
			highlightFirstItem: primitiveElement.value?.highlightFirstItem,
			highlightSelected: primitiveElement.value?.highlightSelected
		});
		provideComboboxRootContext({
			modelValue,
			multiple,
			disabled,
			open,
			onOpenChange,
			contentId: "",
			isUserInputted,
			isVirtual,
			inputElement,
			highlightedElement,
			onInputElementChange: (val) => inputElement.value = val,
			triggerElement,
			onTriggerElementChange: (val) => triggerElement.value = val,
			parentElement,
			resetSearchTermOnSelect,
			onResetSearchTerm: resetSearchTerm.on,
			allItems,
			allGroups,
			filterSearch,
			filterState,
			ignoreFilter,
			openOnFocus,
			openOnClick,
			resetModelValueOnClear
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperRoot_default), null, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ListboxRoot_default), (0, vue_exports.mergeProps)({
					ref_key: "primitiveElement",
					ref: primitiveElement
				}, _ctx.$attrs, {
					modelValue: (0, vue_exports.unref)(modelValue),
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => (0, vue_exports.isRef)(modelValue) ? modelValue.value = $event : null),
					style: { pointerEvents: (0, vue_exports.unref)(open) ? "auto" : void 0 },
					as: _ctx.as,
					"as-child": _ctx.asChild,
					dir: (0, vue_exports.unref)(dir),
					multiple: (0, vue_exports.unref)(multiple),
					name: _ctx.name,
					required: _ctx.required,
					disabled: (0, vue_exports.unref)(disabled),
					"highlight-on-hover": (0, vue_exports.unref)(highlightOnHover),
					by: props.by,
					onHighlight: _cache[1] || (_cache[1] = ($event) => emits("highlight", $event))
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
						open: (0, vue_exports.unref)(open),
						modelValue: (0, vue_exports.unref)(modelValue)
					})]),
					_: 3
				}, 16, [
					"modelValue",
					"style",
					"as",
					"as-child",
					"dir",
					"multiple",
					"name",
					"required",
					"disabled",
					"highlight-on-hover",
					"by"
				])]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxAnchor.js
var ComboboxAnchor_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxAnchor",
	props: {
		reference: {
			type: null,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperAnchor_default), {
				"as-child": "",
				reference: _ctx.reference
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({
					ref: (0, vue_exports.unref)(forwardRef),
					"as-child": _ctx.asChild,
					as: _ctx.as
				}, _ctx.$attrs), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["as-child", "as"])]),
				_: 3
			}, 8, ["reference"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxContentImpl.js
var [injectComboboxContentContext, provideComboboxContentContext] = /*#__PURE__*/ createContext("ComboboxContent");
var ComboboxContentImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxContentImpl",
	props: {
		position: {
			type: String,
			required: false,
			default: "inline"
		},
		bodyLock: {
			type: Boolean,
			required: false
		},
		hideWhenEmpty: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { position } = (0, vue_exports.toRefs)(props);
		const rootContext = injectComboboxRootContext();
		const isEmpty = (0, vue_exports.computed)(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
		const { forwardRef} = useForwardExpose();
		useBodyScrollLock(props.bodyLock);
		useFocusGuards();
		useHideOthers(rootContext.parentElement);
		const forwardedProps = useForwardProps$1((0, vue_exports.computed)(() => {
			if (props.position === "popper") return props;
			else return {};
		}).value);
		const popperStyle = {
			"boxSizing": "border-box",
			"--reka-combobox-content-transform-origin": "var(--reka-popper-transform-origin)",
			"--reka-combobox-content-available-width": "var(--reka-popper-available-width)",
			"--reka-combobox-content-available-height": "var(--reka-popper-available-height)",
			"--reka-combobox-trigger-width": "var(--reka-popper-anchor-width)",
			"--reka-combobox-trigger-height": "var(--reka-popper-anchor-height)"
		};
		provideComboboxContentContext({ position });
		(0, vue_exports.ref)(false);
		function isEventTargetWithinCombobox(target) {
			if (rootContext.parentElement.value?.contains(target)) return true;
			const control = (target instanceof Element ? target.closest("label") : null)?.control;
			return !!control && !!rootContext.parentElement.value?.contains(control);
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxContent_default), { "as-child": "" }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
					"as-child": "",
					onMountAutoFocus: _cache[5] || (_cache[5] = (0, vue_exports.withModifiers)(() => {}, ["prevent"])),
					onUnmountAutoFocus: _cache[6] || (_cache[6] = (0, vue_exports.withModifiers)(() => {}, ["prevent"]))
				}, {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(DismissableLayer_default), {
						"as-child": "",
						"disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
						onDismiss: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(false)),
						onFocusOutside: _cache[1] || (_cache[1] = (ev) => {
							if (isEventTargetWithinCombobox(ev.target)) ev.preventDefault();
							emits("focusOutside", ev);
						}),
						onInteractOutside: _cache[2] || (_cache[2] = ($event) => emits("interactOutside", $event)),
						onEscapeKeyDown: _cache[3] || (_cache[3] = ($event) => emits("escapeKeyDown", $event)),
						onPointerDownOutside: _cache[4] || (_cache[4] = (ev) => {
							if (isEventTargetWithinCombobox(ev.target)) ev.preventDefault();
							emits("pointerDownOutside", ev);
						})
					}, {
						default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.resolveDynamicComponent)((0, vue_exports.unref)(position) === "popper" ? (0, vue_exports.unref)(PopperContent_default) : (0, vue_exports.unref)(Primitive)), (0, vue_exports.mergeProps)({
							..._ctx.$attrs,
							...(0, vue_exports.unref)(forwardedProps)
						}, {
							id: (0, vue_exports.unref)(rootContext).contentId,
							ref: (0, vue_exports.unref)(forwardRef),
							"memo-dependencies": (0, vue_exports.unref)(position) === "popper" ? [(0, vue_exports.unref)(rootContext).filterSearch.value, (0, vue_exports.unref)(rootContext).filterState.value] : void 0,
							"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
							"data-empty": isEmpty.value ? "" : void 0,
							style: {
								display: props.hideWhenEmpty && isEmpty.value ? "none" : "flex",
								flexDirection: "column",
								outline: "none",
								...(0, vue_exports.unref)(position) === "popper" ? popperStyle : {}
							}
						}), {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
							_: 3
						}, 16, [
							"id",
							"memo-dependencies",
							"data-state",
							"data-empty",
							"style"
						]))]),
						_: 3
					}, 8, ["disable-outside-pointer-events"])]),
					_: 3
				})]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxArrow.js
var ComboboxArrow_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxArrow",
	props: {
		width: {
			type: Number,
			required: false,
			default: 10
		},
		height: {
			type: Number,
			required: false,
			default: 5
		},
		rounded: {
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
			default: "svg"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectComboboxRootContext();
		const contentContext = injectComboboxContentContext();
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(rootContext).open.value && (0, vue_exports.unref)(contentContext).position.value === "popper" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(PopperArrow_default), (0, vue_exports.normalizeProps)((0, vue_exports.mergeProps)({ key: 0 }, props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16)) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxCancel.js
var ComboboxCancel_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxCancel",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const rootContext = injectComboboxRootContext();
		function handleClick() {
			rootContext.filterSearch.value = "";
			if (rootContext.inputElement.value) {
				rootContext.inputElement.value.value = "";
				rootContext.inputElement.value.focus();
			}
			if (rootContext.resetModelValueOnClear?.value) rootContext.modelValue.value = rootContext.multiple.value ? [] : null;
		}
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)({ type: _ctx.as === "button" ? "button" : void 0 }, props, {
				tabindex: "-1",
				onClick: handleClick
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxContent.js
var ComboboxContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		position: {
			type: String,
			required: false
		},
		bodyLock: {
			type: Boolean,
			required: false
		},
		hideWhenEmpty: {
			type: Boolean,
			required: false
		},
		memoDependencies: {
			type: Array,
			required: false
		},
		side: {
			type: null,
			required: false
		},
		sideOffset: {
			type: Number,
			required: false
		},
		sideFlip: {
			type: Boolean,
			required: false
		},
		align: {
			type: null,
			required: false
		},
		alignOffset: {
			type: Number,
			required: false
		},
		alignFlip: {
			type: Boolean,
			required: false
		},
		avoidCollisions: {
			type: Boolean,
			required: false
		},
		collisionBoundary: {
			type: null,
			required: false
		},
		collisionPadding: {
			type: [Number, Object],
			required: false
		},
		arrowPadding: {
			type: Number,
			required: false
		},
		hideShiftedArrow: {
			type: Boolean,
			required: false
		},
		sticky: {
			type: String,
			required: false
		},
		hideWhenDetached: {
			type: Boolean,
			required: false
		},
		positionStrategy: {
			type: String,
			required: false
		},
		updatePositionStrategy: {
			type: String,
			required: false
		},
		disableUpdateOnLayoutShift: {
			type: Boolean,
			required: false
		},
		prioritizePosition: {
			type: Boolean,
			required: false
		},
		reference: {
			type: null,
			required: false
		},
		dir: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside"
	],
	setup(__props, { emit: __emit }) {
		const forwarded = useForwardPropsEmits(__props, __emit);
		const { forwardRef } = useForwardExpose();
		const rootContext = injectComboboxRootContext();
		rootContext.contentId ||= useId(void 0, "reka-combobox-content");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), { present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value }, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(ComboboxContentImpl_default, (0, vue_exports.mergeProps)({
					...(0, vue_exports.unref)(forwarded),
					..._ctx.$attrs
				}, { ref: (0, vue_exports.unref)(forwardRef) }), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16)]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxEmpty.js
var ComboboxEmpty_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxEmpty",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectComboboxRootContext();
		const isRender = (0, vue_exports.computed)(() => rootContext.ignoreFilter.value ? rootContext.allItems.value.size === 0 : rootContext.filterState.value.count === 0);
		return (_ctx, _cache) => {
			return isRender.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.normalizeProps)((0, vue_exports.mergeProps)({ key: 0 }, props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [_cache[0] || (_cache[0] = (0, vue_exports.createTextVNode)("No options"))])]),
				_: 3
			}, 16)) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxGroup.js
var [injectComboboxGroupContext, provideComboboxGroupContext] = /*#__PURE__*/ createContext("ComboboxGroup");
var ComboboxGroup_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxGroup",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const id = useId(void 0, "reka-combobox-group");
		const rootContext = injectComboboxRootContext();
		const isRender = (0, vue_exports.computed)(() => rootContext.ignoreFilter.value ? true : !rootContext.filterSearch.value ? true : rootContext.filterState.value.groups.has(id));
		const context = provideComboboxGroupContext({
			id,
			labelId: ""
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxGroup_default), (0, vue_exports.mergeProps)({
				id: (0, vue_exports.unref)(id),
				"aria-labelledby": (0, vue_exports.unref)(context).labelId
			}, props, { hidden: isRender.value ? void 0 : true }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"id",
				"aria-labelledby",
				"hidden"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxInput.js
var ComboboxInput_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxInput",
	props: {
		displayValue: {
			type: Function,
			required: false
		},
		modelValue: {
			type: String,
			required: false
		},
		autoFocus: {
			type: Boolean,
			required: false
		},
		disabled: {
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
			default: "input"
		}
	},
	emits: ["update:modelValue"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectComboboxRootContext();
		const listboxContext = injectListboxRootContext();
		const { primitiveElement} = usePrimitiveElement();
		const modelValue = useVModel(props, "modelValue", emits, { passive: props.modelValue === void 0 });
		const { isComposing, handleCompositionStart, handleCompositionEnd } = useComposing((event) => {
			const el = event.target;
			if (el) processInputValue(el.value);
		});
		function handleKeyDown(ev) {
			if (isComposing.value) return;
			ev.preventDefault();
			if (!rootContext.open.value) rootContext.onOpenChange(true);
		}
		function processInputValue(value) {
			if (!rootContext.open.value) {
				rootContext.onOpenChange(true);
				(0, vue_exports.nextTick)(() => {
					if (value) {
						rootContext.filterSearch.value = value;
						listboxContext.highlightFirstItem();
					}
				});
			} else rootContext.filterSearch.value = value;
		}
		function handleInput(event) {
			if (isComposing.value) return;
			processInputValue(event.target.value);
		}
		function handleFocus() {
			if (rootContext.openOnFocus.value && !rootContext.open.value) rootContext.onOpenChange(true);
		}
		function handleBlur(ev) {
			if (!rootContext.open.value) return;
			const nextFocus = ev.relatedTarget;
			if (!nextFocus) return;
			const isInsideRoot = rootContext.parentElement.value?.contains(nextFocus);
			const isInsideContent = (void 0).getElementById(rootContext.contentId)?.contains(nextFocus);
			if (!isInsideRoot && !isInsideContent) requestAnimationFrame(() => {
				if (!rootContext.open.value) return;
				const active = (void 0).activeElement;
				if (!rootContext.parentElement.value?.contains(active) && !(void 0).getElementById(rootContext.contentId)?.contains(active)) rootContext.onOpenChange(false);
			});
		}
		function handleClick() {
			if (rootContext.openOnClick.value && !rootContext.open.value) rootContext.onOpenChange(true);
		}
		function resetSearchTerm() {
			const rootModelValue = rootContext.modelValue.value;
			if (props.displayValue) modelValue.value = props.displayValue(rootModelValue);
			else if (!rootContext.multiple.value && rootModelValue && !Array.isArray(rootModelValue)) if (typeof rootModelValue !== "object") modelValue.value = rootModelValue.toString();
			else modelValue.value = "";
			else modelValue.value = "";
			(0, vue_exports.nextTick)(() => {
				modelValue.value = modelValue.value;
			});
		}
		rootContext.onResetSearchTerm(() => {
			resetSearchTerm();
		});
		(0, vue_exports.watch)(rootContext.modelValue, async () => {
			if (!rootContext.isUserInputted.value && rootContext.resetSearchTermOnSelect.value) resetSearchTerm();
		}, {
			immediate: true,
			deep: true
		});
		(0, vue_exports.watch)(rootContext.filterState, (_newValue, oldValue) => {
			if (!rootContext.isVirtual.value && oldValue.count === 0) listboxContext.highlightFirstItem();
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxFilter_default), {
				ref_key: "primitiveElement",
				ref: primitiveElement,
				modelValue: (0, vue_exports.unref)(modelValue),
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => (0, vue_exports.isRef)(modelValue) ? modelValue.value = $event : null),
				as: _ctx.as,
				"as-child": _ctx.asChild,
				"auto-focus": _ctx.autoFocus,
				disabled: _ctx.disabled,
				"aria-expanded": (0, vue_exports.unref)(rootContext).open.value,
				"aria-controls": (0, vue_exports.unref)(rootContext).contentId,
				"aria-autocomplete": "list",
				role: "combobox",
				autocomplete: "off",
				onClick: handleClick,
				onInput: handleInput,
				onKeydown: (0, vue_exports.withKeys)(handleKeyDown, ["down", "up"]),
				onFocus: handleFocus,
				onBlur: handleBlur,
				onCompositionstart: (0, vue_exports.unref)(handleCompositionStart),
				onCompositionend: (0, vue_exports.unref)(handleCompositionEnd)
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"modelValue",
				"as",
				"as-child",
				"auto-focus",
				"disabled",
				"aria-expanded",
				"aria-controls",
				"onCompositionstart",
				"onCompositionend"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxItem.js
var ComboboxItem_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxItem",
	props: {
		textValue: {
			type: String,
			required: false
		},
		value: {
			type: null,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["select"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const id = useId(void 0, "reka-combobox-item");
		const rootContext = injectComboboxRootContext();
		injectComboboxGroupContext(null);
		const { primitiveElement} = usePrimitiveElement();
		if (props.value === "") throw new Error("A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.");
		const isRender = (0, vue_exports.computed)(() => {
			if (rootContext.isVirtual.value || rootContext.ignoreFilter.value || !rootContext.filterSearch.value) return true;
			else {
				const filteredCurrentItem = rootContext.filterState.value.items.get(id);
				if (filteredCurrentItem === void 0) return true;
				return filteredCurrentItem > 0;
			}
		});
		return (_ctx, _cache) => {
			return isRender.value ? (0, vue_exports.withMemo)([
				isRender.value,
				(0, vue_exports.unref)(rootContext).filterSearch.value,
				(0, vue_exports.unref)(rootContext).disabled.value,
				_ctx.disabled,
				props.value,
				props.as,
				props.asChild,
				...Object.values(_ctx.$attrs)
			], () => ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxItem_default), (0, vue_exports.mergeProps)({ key: 0 }, props, {
				id: (0, vue_exports.unref)(id),
				ref_key: "primitiveElement",
				ref: primitiveElement,
				disabled: (0, vue_exports.unref)(rootContext).disabled.value || _ctx.disabled,
				onSelect: _cache[0] || (_cache[0] = (event) => {
					emits("select", event);
					if (event.defaultPrevented) return;
					if (!(0, vue_exports.unref)(rootContext).multiple.value && !_ctx.disabled && !(0, vue_exports.unref)(rootContext).disabled.value) {
						event.preventDefault();
						(0, vue_exports.unref)(rootContext).onOpenChange(false);
						(0, vue_exports.unref)(rootContext).modelValue.value = props.value;
					} else if ((0, vue_exports.unref)(rootContext).multiple.value) (0, vue_exports.unref)(rootContext).inputElement.value?.focus();
				})
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(_ctx.value), 1)])]),
				_: 3
			}, 16, ["id", "disabled"])), _cache, 1) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxItemIndicator.js
var ComboboxItemIndicator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxItemIndicator",
	props: {
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
		const props = __props;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ListboxItemIndicator_default), (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxLabel.js
var ComboboxLabel_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxLabel",
	props: {
		for: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "div"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const groupContext = injectComboboxGroupContext({
			id: "",
			labelId: ""
		});
		groupContext.labelId ||= useId(void 0, "reka-combobox-group-label");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { id: (0, vue_exports.unref)(groupContext).labelId }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxPortal.js
var ComboboxPortal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Teleport_default), (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxSeparator.js
var ComboboxSeparator_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxSeparator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { "aria-hidden": "true" }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxTrigger.js
var ComboboxTrigger_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxTrigger",
	props: {
		disabled: {
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
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef} = useForwardExpose();
		const rootContext = injectComboboxRootContext();
		const disabled = (0, vue_exports.computed)(() => props.disabled || rootContext.disabled.value || false);
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				ref: (0, vue_exports.unref)(forwardRef),
				type: _ctx.as === "button" ? "button" : void 0,
				tabindex: "-1",
				"aria-label": "Show popup",
				"aria-haspopup": "listbox",
				"aria-expanded": (0, vue_exports.unref)(rootContext).open.value,
				"aria-controls": (0, vue_exports.unref)(rootContext).contentId,
				"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
				disabled: disabled.value,
				"data-disabled": disabled.value ? "" : void 0,
				"aria-disabled": disabled.value ?? void 0,
				onClick: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(!(0, vue_exports.unref)(rootContext).open.value))
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"type",
				"aria-expanded",
				"aria-controls",
				"data-state",
				"disabled",
				"data-disabled",
				"aria-disabled"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Combobox/ComboboxVirtualizer.js
var ComboboxVirtualizer_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "ComboboxVirtualizer",
	props: {
		options: {
			type: Array,
			required: true
		},
		overscan: {
			type: Number,
			required: false
		},
		estimateSize: {
			type: [Number, Function],
			required: false
		},
		textContent: {
			type: Function,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectComboboxRootContext();
		rootContext.isVirtual.value = true;
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(ListboxVirtualizer_default, (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(props)), {
				default: (0, vue_exports.withCtx)((slotProps) => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", (0, vue_exports.normalizeProps)((0, vue_exports.guardReactiveProps)(slotProps)))]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/utils/virtualizer.js
function itemHasDescription(item, descriptionKey) {
	if (typeof item !== "object" || item === null) return false;
	const value = get(item, descriptionKey);
	return value !== void 0 && value !== null && value !== "";
}
function getSize(size, hasDescription) {
	if (hasDescription) return {
		xs: 44,
		sm: 48,
		md: 52,
		lg: 56,
		xl: 60
	}[size];
	return {
		xs: 24,
		sm: 28,
		md: 32,
		lg: 36,
		xl: 40
	}[size];
}
function getEstimateSize(items, size, descriptionKey, hasDescriptionSlot) {
	const sizeWithDescription = getSize(size, true);
	const sizeWithoutDescription = getSize(size, false);
	if (hasDescriptionSlot) return () => sizeWithDescription;
	if (!descriptionKey) return () => sizeWithoutDescription;
	return (index) => {
		return itemHasDescription(items[index], descriptionKey) ? sizeWithDescription : sizeWithoutDescription;
	};
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fselect-menu.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_menu_default = {
	"slots": {
		"base": ["relative group rounded-md inline-flex items-center disabled:cursor-not-allowed disabled:opacity-75", "transition-colors"],
		"leading": "absolute inset-y-0 start-0 flex items-center",
		"leadingIcon": "shrink-0 text-dimmed",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailing": "absolute inset-y-0 end-0 flex items-center",
		"trailingIcon": "shrink-0 text-dimmed",
		"value": "truncate pointer-events-none",
		"placeholder": "truncate text-dimmed",
		"arrow": "fill-bg stroke-default",
		"content": ["max-h-[min(15rem,var(--reka-select-content-available-height,15rem))] w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md ring ring-default overflow-hidden origin-(--reka-select-content-transform-origin) pointer-events-auto flex flex-col", "max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)"],
		"viewport": "relative scroll-py-1 overflow-y-auto flex-1",
		"group": "p-1 isolate",
		"empty": "text-center text-muted",
		"label": "font-semibold text-highlighted",
		"separator": "-mx-1 my-1 h-px bg-border",
		"item": ["group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50", "transition-colors before:transition-colors"],
		"itemLeadingIcon": ["shrink-0 text-dimmed group-data-highlighted:not-group-data-disabled:text-default", "transition-colors"],
		"itemLeadingAvatar": "shrink-0",
		"itemLeadingAvatarSize": "",
		"itemLeadingChip": "shrink-0",
		"itemLeadingChipSize": "",
		"itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
		"itemTrailingIcon": "shrink-0",
		"itemWrapper": "flex-1 flex flex-col min-w-0",
		"itemLabel": "truncate",
		"itemDescription": "truncate text-muted",
		"input": "border-b border-default",
		"focusScope": "flex flex-col min-h-0",
		"trailingClear": "p-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-xs gap-1",
				"leading": "ps-2",
				"trailing": "pe-2",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4",
				"label": "p-1 text-[10px]/3 gap-1",
				"item": "p-1 text-xs gap-1",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemLeadingChip": "size-4",
				"itemLeadingChipSize": "sm",
				"itemTrailingIcon": "size-4",
				"empty": "p-2 text-xs"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-xs gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4",
				"label": "p-1.5 text-[10px]/3 gap-1.5",
				"item": "p-1.5 text-xs gap-1.5",
				"itemLeadingIcon": "size-4",
				"itemLeadingAvatarSize": "3xs",
				"itemLeadingChip": "size-4",
				"itemLeadingChipSize": "sm",
				"itemTrailingIcon": "size-4",
				"empty": "p-2.5 text-xs"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-sm gap-1.5",
				"leading": "ps-2.5",
				"trailing": "pe-2.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5",
				"label": "p-1.5 text-xs gap-1.5",
				"item": "p-1.5 text-sm gap-1.5",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemLeadingChip": "size-5",
				"itemLeadingChipSize": "md",
				"itemTrailingIcon": "size-5",
				"empty": "p-2.5 text-sm"
			},
			"lg": {
				"base": "px-3 py-2 text-sm gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5",
				"label": "p-2 text-xs gap-2",
				"item": "p-2 text-sm gap-2",
				"itemLeadingIcon": "size-5",
				"itemLeadingAvatarSize": "2xs",
				"itemLeadingChip": "size-5",
				"itemLeadingChipSize": "md",
				"itemTrailingIcon": "size-5",
				"empty": "p-3 text-sm"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leading": "ps-3",
				"trailing": "pe-3",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6",
				"label": "p-2 text-sm gap-2",
				"item": "p-2 text-base gap-2",
				"itemLeadingIcon": "size-6",
				"itemLeadingAvatarSize": "xs",
				"itemLeadingChip": "size-6",
				"itemLeadingChipSize": "lg",
				"itemTrailingIcon": "size-6",
				"empty": "p-3 text-base"
			}
		},
		"variant": {
			"outline": "text-highlighted bg-default ring ring-inset ring-accented hover:bg-elevated disabled:bg-default",
			"soft": "text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50",
			"subtle": "text-highlighted bg-elevated ring ring-inset ring-accented hover:bg-accented/75 disabled:bg-elevated",
			"ghost": "text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent",
			"none": "text-highlighted bg-transparent focus:outline-none"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"highlight": { "true": "" },
		"fixed": { "false": "" },
		"type": { "file": "file:me-1.5 file:font-medium file:text-muted file:outline-none" },
		"position": {
			"popper": { "content": "data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]" },
			"item-aligned": { "content": "" }
		},
		"multiple": { "true": "" },
		"virtualize": {
			"true": { "viewport": "p-1 isolate" },
			"false": { "viewport": "divide-y divide-default" }
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": ["outline", "subtle"],
			"class": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": ["outline", "subtle"],
			"class": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": ["outline", "subtle"],
			"class": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": ["outline", "subtle"],
			"class": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": ["outline", "subtle"],
			"class": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": ["outline", "subtle"],
			"class": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": ["soft", "ghost"],
			"class": "outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": ["soft", "ghost"],
			"class": "outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": ["soft", "ghost"],
			"class": "outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": ["soft", "ghost"],
			"class": "outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": ["soft", "ghost"],
			"class": "outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": ["soft", "ghost"],
			"class": "outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"highlight": true,
			"class": "ring ring-inset ring-primary"
		},
		{
			"color": "secondary",
			"highlight": true,
			"class": "ring ring-inset ring-secondary"
		},
		{
			"color": "success",
			"highlight": true,
			"class": "ring ring-inset ring-success"
		},
		{
			"color": "info",
			"highlight": true,
			"class": "ring ring-inset ring-info"
		},
		{
			"color": "warning",
			"highlight": true,
			"class": "ring ring-inset ring-warning"
		},
		{
			"color": "error",
			"highlight": true,
			"class": "ring ring-inset ring-error"
		},
		{
			"color": "neutral",
			"variant": ["outline", "subtle"],
			"class": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": ["soft", "ghost"],
			"class": "outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"highlight": true,
			"class": "ring ring-inset ring-inverted"
		},
		{
			"leading": true,
			"size": "xs",
			"class": "ps-7"
		},
		{
			"leading": true,
			"size": "sm",
			"class": "ps-8"
		},
		{
			"leading": true,
			"size": "md",
			"class": "ps-9"
		},
		{
			"leading": true,
			"size": "lg",
			"class": "ps-10"
		},
		{
			"leading": true,
			"size": "xl",
			"class": "ps-11"
		},
		{
			"trailing": true,
			"size": "xs",
			"class": "pe-7"
		},
		{
			"trailing": true,
			"size": "sm",
			"class": "pe-8"
		},
		{
			"trailing": true,
			"size": "md",
			"class": "pe-9"
		},
		{
			"trailing": true,
			"size": "lg",
			"class": "pe-10"
		},
		{
			"trailing": true,
			"size": "xl",
			"class": "pe-11"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		},
		{
			"fixed": false,
			"size": "xs",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "sm",
			"class": "md:text-xs"
		},
		{
			"fixed": false,
			"size": "md",
			"class": "md:text-sm"
		},
		{
			"fixed": false,
			"size": "lg",
			"class": "md:text-sm"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"variant": "outline",
		"position": "popper"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "USelectMenu",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ (0, vue_exports.mergeModels)({
		id: {
			type: String,
			required: false
		},
		placeholder: {
			type: String,
			required: false
		},
		searchInput: {
			type: [Boolean, Object],
			required: false,
			default: true
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
		required: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		selectedIcon: {
			type: null,
			required: false
		},
		clear: {
			type: [Boolean, Object],
			required: false
		},
		clearIcon: {
			type: null,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		arrow: {
			type: [Boolean, Object],
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		virtualize: {
			type: [Boolean, Object],
			required: false,
			default: false
		},
		valueKey: {
			type: null,
			required: false
		},
		labelKey: {
			type: null,
			required: false,
			default: "label"
		},
		descriptionKey: {
			type: null,
			required: false,
			default: "description"
		},
		items: {
			type: null,
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
		modelModifiers: {
			type: null,
			required: false
		},
		multiple: {
			type: Boolean,
			required: false
		},
		highlight: {
			type: Boolean,
			required: false
		},
		createItem: {
			type: [
				Boolean,
				String,
				Object
			],
			required: false
		},
		filterFields: {
			type: Array,
			required: false
		},
		ignoreFilter: {
			type: Boolean,
			required: false
		},
		autofocus: {
			type: Boolean,
			required: false
		},
		autofocusDelay: {
			type: Number,
			required: false,
			default: 0
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		name: {
			type: String,
			required: false
		},
		resetSearchTermOnBlur: {
			type: Boolean,
			required: false,
			default: true
		},
		resetSearchTermOnSelect: {
			type: Boolean,
			required: false,
			default: true
		},
		resetModelValueOnClear: {
			type: Boolean,
			required: false,
			default: true
		},
		highlightOnHover: {
			type: Boolean,
			required: false
		},
		by: {
			type: [String, Function],
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		}
	}, {
		"searchTerm": {
			type: String,
			default: ""
		},
		"searchTermModifiers": {}
	}),
	emits: /*@__PURE__*/ (0, vue_exports.mergeModels)([
		"change",
		"blur",
		"focus",
		"create",
		"clear",
		"highlight",
		"update:modelValue",
		"update:open"
	], ["update:searchTerm"]),
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("selectMenu", _props);
		const searchTerm = (0, vue_exports.useModel)(__props, "searchTerm", {
			type: String,
			default: ""
		});
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const { filterGroups } = useFilter();
		const rootProps = useForwardProps(reactivePick(props, "modelValue", "defaultValue", "open", "defaultOpen", "required", "multiple", "resetSearchTermOnBlur", "resetSearchTermOnSelect", "resetModelValueOnClear", "highlightOnHover", "by"), emits);
		const portalProps = usePortal((0, vue_exports.toRef)(() => props.portal));
		const contentProps = (0, vue_exports.toRef)(() => defu(props.content, {
			side: "bottom",
			sideOffset: 8,
			collisionPadding: 8,
			position: "popper"
		}));
		const arrowProps = (0, vue_exports.toRef)(() => defu(props.arrow, { rounded: true }));
		const clearProps = (0, vue_exports.computed)(() => typeof props.clear === "object" ? props.clear : {});
		const virtualizerProps = (0, vue_exports.toRef)(() => {
			if (!props.virtualize) return false;
			return defu(typeof props.virtualize === "boolean" ? {} : props.virtualize, { estimateSize: getEstimateSize(filteredItems.value, selectSize.value || "md", props.descriptionKey, !!slots["item-description"]) });
		});
		const searchInputProps = (0, vue_exports.toRef)(() => defu(props.searchInput, {
			placeholder: t("selectMenu.search"),
			variant: "none"
		}));
		const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formFieldSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField(_props);
		const { orientation, size: fieldGroupSize } = useFieldGroup(_props);
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons((0, vue_exports.toRef)(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })));
		const selectSize = (0, vue_exports.computed)(() => fieldGroupSize.value || formFieldSize.value);
		const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate();
		const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate({ props: {
			item: {
				type: [
					Object,
					String,
					Number,
					Boolean
				],
				required: true
			},
			index: {
				type: Number,
				required: false
			}
		} });
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fselect_menu_default,
			...appConfig.ui?.selectMenu || {}
		})({
			color: color.value ?? props.color,
			variant: props.variant,
			size: selectSize?.value ?? props.size,
			loading: props.loading,
			highlight: highlight.value ?? props.highlight,
			leading: isLeading.value || !!props.avatar || !!slots.leading,
			trailing: isTrailing.value || !!slots.trailing,
			fieldGroup: orientation.value,
			virtualize: !!props.virtualize,
			multiple: props.multiple
		}));
		function displayValue(value) {
			if (props.multiple && Array.isArray(value)) {
				const displayedValues = value.map((item) => getDisplayValue(items.value, item, {
					labelKey: props.labelKey,
					valueKey: props.valueKey,
					by: props.by
				})).filter((v) => v != null && v !== "");
				return displayedValues.length > 0 ? displayedValues.join(", ") : void 0;
			}
			return getDisplayValue(items.value, value, {
				labelKey: props.labelKey,
				valueKey: props.valueKey,
				by: props.by
			});
		}
		const groups = (0, vue_exports.computed)(() => props.items?.length ? isArrayOfArray(props.items) ? props.items : [props.items] : []);
		const items = (0, vue_exports.computed)(() => groups.value.flatMap((group) => group));
		const filteredGroups = (0, vue_exports.computed)(() => {
			if (props.ignoreFilter || !searchTerm.value) return groups.value;
			const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey];
			return filterGroups(groups.value, searchTerm.value, {
				fields,
				isStructural: (item) => isSelectItem(item) && !!item.type && ["label", "separator"].includes(item.type)
			});
		});
		const filteredItems = (0, vue_exports.computed)(() => filteredGroups.value.flatMap((group) => group));
		const createItem = (0, vue_exports.computed)(() => {
			if (!props.createItem || !searchTerm.value) return false;
			const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } : searchTerm.value;
			if (typeof props.createItem === "object" && props.createItem.when === "always" || props.createItem === "always") return !filteredItems.value.find((item) => compare$1(item, newItem, props.by ?? props.valueKey));
			return !filteredItems.value.length;
		});
		const createItemPosition = (0, vue_exports.computed)(() => typeof props.createItem === "object" ? props.createItem.position : "bottom");
		const triggerRef = (0, vue_exports.useTemplateRef)("triggerRef");
		function onUpdate(value) {
			if ((0, vue_exports.toRaw)(props.modelValue) === value) return;
			if (props.modelModifiers?.trim && (typeof value === "string" || value === null || value === void 0)) value = value?.trim() ?? null;
			if (props.modelModifiers?.number) value = looseToNumber(value);
			if (props.modelModifiers?.nullable) value ??= null;
			if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) value ??= void 0;
			const event = new Event("change", { target: { value } });
			emits("change", event);
			emitFormChange();
			emitFormInput();
			if (props.resetSearchTermOnSelect) searchTerm.value = "";
		}
		const isOpen = (0, vue_exports.ref)(false);
		function onUpdateOpen(value) {
			isOpen.value = value;
			let timeoutId;
			if (!value) {
				const event = new FocusEvent("blur");
				emits("blur", event);
				emitFormBlur();
				if (props.resetSearchTermOnBlur) timeoutId = setTimeout(() => {
					searchTerm.value = "";
				}, 100);
			} else {
				const event = new FocusEvent("focus");
				emits("focus", event);
				emitFormFocus();
				clearTimeout(timeoutId);
			}
		}
		function onCreate(e) {
			e.preventDefault();
			e.stopPropagation();
			emits("create", searchTerm.value);
		}
		function onSelect(e, item) {
			if (!isSelectItem(item)) return;
			if (item.disabled) {
				e.preventDefault();
				return;
			}
			item.onSelect?.(e);
		}
		function isSelectItem(item) {
			return typeof item === "object" && item !== null;
		}
		function isModelValueEmpty(modelValue) {
			if (props.multiple && Array.isArray(modelValue)) return modelValue.length === 0;
			return modelValue === void 0 || modelValue === null || modelValue === "";
		}
		function onClear() {
			emits("clear");
		}
		const viewportRef = (0, vue_exports.useTemplateRef)("viewportRef");
		const comboboxRootRef = (0, vue_exports.useTemplateRef)("comboboxRootRef");
		(0, vue_exports.watch)(() => props.items, async () => {
			if (!isOpen.value || !props.createItem) return;
			await (0, vue_exports.nextTick)();
			comboboxRootRef.value?.highlightFirstItem?.();
		}, { flush: "post" });
		__expose({
			triggerRef: (0, vue_exports.toRef)(() => triggerRef.value?.$el),
			viewportRef: (0, vue_exports.toRef)(() => viewportRef.value)
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineCreateItemTemplate), null, {
				default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
					if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxItem_default), {
						"data-slot": "item",
						class: ui.value.item({ class: (0, vue_exports.unref)(props).ui?.item }),
						value: searchTerm.value,
						onSelect: onCreate
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) {
								_push(`<span data-slot="itemLabel" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemLabel({ class: (0, vue_exports.unref)(props).ui?.itemLabel }))}"${_scopeId}>`);
								(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => {
									_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(t)("selectMenu.create", { label: searchTerm.value }))}`);
								}, _push, _parent, _scopeId);
								_push(`</span>`);
							} else return [(0, vue_exports.createVNode)("span", {
								"data-slot": "itemLabel",
								class: ui.value.itemLabel({ class: (0, vue_exports.unref)(props).ui?.itemLabel })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(t)("selectMenu.create", { label: searchTerm.value })), 1)])], 2)];
						}),
						_: 3
					}, _parent, _scopeId));
					else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxItem_default), {
						"data-slot": "item",
						class: ui.value.item({ class: (0, vue_exports.unref)(props).ui?.item }),
						value: searchTerm.value,
						onSelect: onCreate
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)("span", {
							"data-slot": "itemLabel",
							class: ui.value.itemLabel({ class: (0, vue_exports.unref)(props).ui?.itemLabel })
						}, [(0, vue_exports.renderSlot)(_ctx.$slots, "create-item-label", { item: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(t)("selectMenu.create", { label: searchTerm.value })), 1)])], 2)]),
						_: 3
					}, 8, ["class", "value"])];
				}),
				_: 3
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineItemTemplate), null, {
				default: (0, vue_exports.withCtx)(({ item, index }, _push, _parent, _scopeId) => {
					if (_push) if (isSelectItem(item) && item.type === "label") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxLabel_default), {
						"data-slot": "label",
						class: ui.value.label({ class: [
							(0, vue_exports.unref)(props).ui?.label,
							item.ui?.label,
							item.class
						] })
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey))}`);
							else return [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)];
						}),
						_: 2
					}, _parent, _scopeId));
					else if (isSelectItem(item) && item.type === "separator") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxSeparator_default), {
						"data-slot": "separator",
						class: ui.value.separator({ class: [
							(0, vue_exports.unref)(props).ui?.separator,
							item.ui?.separator,
							item.class
						] })
					}, null, _parent, _scopeId));
					else _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxItem_default), {
						"data-slot": "item",
						class: ui.value.item({ class: [
							(0, vue_exports.unref)(props).ui?.item,
							isSelectItem(item) && item.ui?.item,
							isSelectItem(item) && item.class
						] }),
						disabled: isSelectItem(item) && item.disabled,
						value: (0, vue_exports.unref)(props).valueKey && isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) : item,
						onSelect: ($event) => onSelect($event, item)
					}, {
						default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
							if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item", {
								item,
								index,
								ui: ui.value
							}, () => {
								(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-leading", {
									item,
									index,
									ui: ui.value
								}, () => {
									if (isSelectItem(item) && item.icon) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
										name: item.icon,
										"data-slot": "itemLeadingIcon",
										class: ui.value.itemLeadingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
									}, null, _parent, _scopeId));
									else if (isSelectItem(item) && item.avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: item.ui?.itemLeadingAvatarSize || (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize() }, item.avatar, {
										"data-slot": "itemLeadingAvatar",
										class: ui.value.itemLeadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
									}), null, _parent, _scopeId));
									else if (isSelectItem(item) && item.chip) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$4, (0, vue_exports.mergeProps)({
										size: item.ui?.itemLeadingChipSize || (0, vue_exports.unref)(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
										inset: "",
										standalone: ""
									}, item.chip, {
										"data-slot": "itemLeadingChip",
										class: ui.value.itemLeadingChip({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
									}), null, _parent, _scopeId));
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
								_push(`<span data-slot="itemWrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemWrapper({ class: [(0, vue_exports.unref)(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] }))}"${_scopeId}><span data-slot="itemLabel" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemLabel({ class: [(0, vue_exports.unref)(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] }))}"${_scopeId}>`);
								(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-label", {
									item,
									index
								}, () => {
									_push(`${(0, server_renderer_exports.ssrInterpolate)(isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) : item)}`);
								}, _push, _parent, _scopeId);
								_push(`</span>`);
								if (isSelectItem(item) && ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey) || !!slots["item-description"])) {
									_push(`<span data-slot="itemDescription" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemDescription({ class: [(0, vue_exports.unref)(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] }))}"${_scopeId}>`);
									(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-description", {
										item,
										index
									}, () => {
										_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey))}`);
									}, _push, _parent, _scopeId);
									_push(`</span>`);
								} else _push(`<!---->`);
								_push(`</span><span data-slot="itemTrailing" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.itemTrailing({ class: [(0, vue_exports.unref)(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] }))}"${_scopeId}>`);
								(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "item-trailing", {
									item,
									index,
									ui: ui.value
								}, null, _push, _parent, _scopeId);
								_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxItemIndicator_default), { "as-child": "" }, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
											name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
											"data-slot": "itemTrailingIcon",
											class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
										}, null, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)(_sfc_main$1, {
											name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
											"data-slot": "itemTrailingIcon",
											class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
										}, null, 8, ["name", "class"])];
									}),
									_: 2
								}, _parent, _scopeId));
								_push(`</span>`);
							}, _push, _parent, _scopeId);
							else return [(0, vue_exports.renderSlot)(_ctx.$slots, "item", {
								item,
								index,
								ui: ui.value
							}, () => [
								(0, vue_exports.renderSlot)(_ctx.$slots, "item-leading", {
									item,
									index,
									ui: ui.value
								}, () => [isSelectItem(item) && item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
									key: 0,
									name: item.icon,
									"data-slot": "itemLeadingIcon",
									class: ui.value.itemLeadingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
								}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
									key: 1,
									size: item.ui?.itemLeadingAvatarSize || (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
								}, item.avatar, {
									"data-slot": "itemLeadingAvatar",
									class: ui.value.itemLeadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
								}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$4, (0, vue_exports.mergeProps)({
									key: 2,
									size: item.ui?.itemLeadingChipSize || (0, vue_exports.unref)(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
									inset: "",
									standalone: ""
								}, item.chip, {
									"data-slot": "itemLeadingChip",
									class: ui.value.itemLeadingChip({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
								}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
								(0, vue_exports.createVNode)("span", {
									"data-slot": "itemWrapper",
									class: ui.value.itemWrapper({ class: [(0, vue_exports.unref)(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
								}, [(0, vue_exports.createVNode)("span", {
									"data-slot": "itemLabel",
									class: ui.value.itemLabel({ class: [(0, vue_exports.unref)(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-label", {
									item,
									index
								}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) : item), 1)])], 2), isSelectItem(item) && ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey) || !!slots["item-description"]) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									"data-slot": "itemDescription",
									class: ui.value.itemDescription({ class: [(0, vue_exports.unref)(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-description", {
									item,
									index
								}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true)], 2),
								(0, vue_exports.createVNode)("span", {
									"data-slot": "itemTrailing",
									class: ui.value.itemTrailing({ class: [(0, vue_exports.unref)(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-trailing", {
									item,
									index,
									ui: ui.value
								}), (0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxItemIndicator_default), { "as-child": "" }, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, {
										name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
										"data-slot": "itemTrailingIcon",
										class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
									}, null, 8, ["name", "class"])]),
									_: 2
								}, 1024)], 2)
							])];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [isSelectItem(item) && item.type === "label" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxLabel_default), {
						key: 0,
						"data-slot": "label",
						class: ui.value.label({ class: [
							(0, vue_exports.unref)(props).ui?.label,
							item.ui?.label,
							item.class
						] })
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey)), 1)]),
						_: 2
					}, 1032, ["class"])) : isSelectItem(item) && item.type === "separator" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxSeparator_default), {
						key: 1,
						"data-slot": "separator",
						class: ui.value.separator({ class: [
							(0, vue_exports.unref)(props).ui?.separator,
							item.ui?.separator,
							item.class
						] })
					}, null, 8, ["class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxItem_default), {
						key: 2,
						"data-slot": "item",
						class: ui.value.item({ class: [
							(0, vue_exports.unref)(props).ui?.item,
							isSelectItem(item) && item.ui?.item,
							isSelectItem(item) && item.class
						] }),
						disabled: isSelectItem(item) && item.disabled,
						value: (0, vue_exports.unref)(props).valueKey && isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).valueKey) : item,
						onSelect: ($event) => onSelect($event, item)
					}, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "item", {
							item,
							index,
							ui: ui.value
						}, () => [
							(0, vue_exports.renderSlot)(_ctx.$slots, "item-leading", {
								item,
								index,
								ui: ui.value
							}, () => [isSelectItem(item) && item.icon ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
								key: 0,
								name: item.icon,
								"data-slot": "itemLeadingIcon",
								class: ui.value.itemLeadingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })
							}, null, 8, ["name", "class"])) : isSelectItem(item) && item.avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
								key: 1,
								size: item.ui?.itemLeadingAvatarSize || (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
							}, item.avatar, {
								"data-slot": "itemLeadingAvatar",
								class: ui.value.itemLeadingAvatar({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })
							}), null, 16, ["size", "class"])) : isSelectItem(item) && item.chip ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$4, (0, vue_exports.mergeProps)({
								key: 2,
								size: item.ui?.itemLeadingChipSize || (0, vue_exports.unref)(props).ui?.itemLeadingChipSize || ui.value.itemLeadingChipSize(),
								inset: "",
								standalone: ""
							}, item.chip, {
								"data-slot": "itemLeadingChip",
								class: ui.value.itemLeadingChip({ class: [(0, vue_exports.unref)(props).ui?.itemLeadingChip, item.ui?.itemLeadingChip] })
							}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)]),
							(0, vue_exports.createVNode)("span", {
								"data-slot": "itemWrapper",
								class: ui.value.itemWrapper({ class: [(0, vue_exports.unref)(props).ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })
							}, [(0, vue_exports.createVNode)("span", {
								"data-slot": "itemLabel",
								class: ui.value.itemLabel({ class: [(0, vue_exports.unref)(props).ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-label", {
								item,
								index
							}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(isSelectItem(item) ? (0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).labelKey) : item), 1)])], 2), isSelectItem(item) && ((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey) || !!slots["item-description"]) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
								key: 0,
								"data-slot": "itemDescription",
								class: ui.value.itemDescription({ class: [(0, vue_exports.unref)(props).ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-description", {
								item,
								index
							}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(get)(item, (0, vue_exports.unref)(props).descriptionKey)), 1)])], 2)) : (0, vue_exports.createCommentVNode)("", true)], 2),
							(0, vue_exports.createVNode)("span", {
								"data-slot": "itemTrailing",
								class: ui.value.itemTrailing({ class: [(0, vue_exports.unref)(props).ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })
							}, [(0, vue_exports.renderSlot)(_ctx.$slots, "item-trailing", {
								item,
								index,
								ui: ui.value
							}), (0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxItemIndicator_default), { "as-child": "" }, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$1, {
									name: (0, vue_exports.unref)(props).selectedIcon || (0, vue_exports.unref)(appConfig).ui.icons.check,
									"data-slot": "itemTrailingIcon",
									class: ui.value.itemTrailingIcon({ class: [(0, vue_exports.unref)(props).ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })
								}, null, 8, ["name", "class"])]),
								_: 2
							}, 1024)], 2)
						])]),
						_: 2
					}, 1032, [
						"class",
						"disabled",
						"value",
						"onSelect"
					]))];
				}),
				_: 3
			}, _parent));
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxRoot_default), (0, vue_exports.mergeProps)({
				ref_key: "comboboxRootRef",
				ref: comboboxRootRef
			}, (0, vue_exports.unref)(rootProps), {
				"ignore-filter": "",
				"as-child": "",
				name: (0, vue_exports.unref)(name),
				disabled: (0, vue_exports.unref)(disabled),
				"onUpdate:modelValue": onUpdate,
				"onUpdate:open": onUpdateOpen
			}), {
				default: (0, vue_exports.withCtx)(({ modelValue, open }, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxAnchor_default), { "as-child": "" }, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxTrigger_default), (0, vue_exports.mergeProps)({
									id: (0, vue_exports.unref)(id),
									ref_key: "triggerRef",
									ref: triggerRef,
									"data-slot": "base",
									class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] }),
									tabindex: "0"
								}, {
									..._ctx.$attrs,
									...(0, vue_exports.unref)(ariaAttrs)
								}), {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											if ((0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading) {
												_push(`<span data-slot="leading" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading }))}"${_scopeId}>`);
												(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "leading", {
													modelValue,
													open,
													ui: ui.value
												}, () => {
													if ((0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
														name: (0, vue_exports.unref)(leadingIconName),
														"data-slot": "leadingIcon",
														class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
													}, null, _parent, _scopeId));
													else if (!!(0, vue_exports.unref)(props).avatar) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$3, (0, vue_exports.mergeProps)({ size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize() }, (0, vue_exports.unref)(props).avatar, {
														"data-slot": "itemLeadingAvatar",
														class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
													}), null, _parent, _scopeId));
													else _push(`<!---->`);
												}, _push, _parent, _scopeId);
												_push(`</span>`);
											} else _push(`<!---->`);
											(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", {
												modelValue,
												open,
												ui: ui.value
											}, () => {
												_push(`<!--[-->`);
												(0, server_renderer_exports.ssrRenderList)([displayValue(modelValue)], (displayedModelValue) => {
													_push(`<!--[-->`);
													if (displayedModelValue !== void 0 && displayedModelValue !== null) _push(`<span data-slot="value" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value }))}"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)(displayedModelValue)}</span>`);
													else _push(`<span data-slot="placeholder" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder }))}"${_scopeId}>${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).placeholder ?? "\xA0")}</span>`);
													_push(`<!--]-->`);
												});
												_push(`<!--]-->`);
											}, _push, _parent, _scopeId);
											if ((0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear) {
												_push(`<span data-slot="trailing" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing }))}"${_scopeId}>`);
												(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "trailing", {
													modelValue,
													open,
													ui: ui.value
												}, () => {
													if (!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue)) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxCancel_default), { "as-child": "" }, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$2, (0, vue_exports.mergeProps)({
																as: "span",
																icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																size: selectSize.value,
																variant: "link",
																color: "neutral",
																tabindex: "-1"
															}, clearProps.value, {
																"data-slot": "trailingClear",
																class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
																onClick: onClear
															}), null, _parent, _scopeId));
															else return [(0, vue_exports.createVNode)(_sfc_main$2, (0, vue_exports.mergeProps)({
																as: "span",
																icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																size: selectSize.value,
																variant: "link",
																color: "neutral",
																tabindex: "-1"
															}, clearProps.value, {
																"data-slot": "trailingClear",
																class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
																onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
															}), null, 16, [
																"icon",
																"size",
																"class"
															])];
														}),
														_: 2
													}, _parent, _scopeId));
													else if ((0, vue_exports.unref)(trailingIconName)) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, {
														name: (0, vue_exports.unref)(trailingIconName),
														"data-slot": "trailingIcon",
														class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
													}, null, _parent, _scopeId));
													else _push(`<!---->`);
												}, _push, _parent, _scopeId);
												_push(`</span>`);
											} else _push(`<!---->`);
										} else return [
											(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												"data-slot": "leading",
												class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
												modelValue,
												open,
												ui: ui.value
											}, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
												key: 0,
												name: (0, vue_exports.unref)(leadingIconName),
												"data-slot": "leadingIcon",
												class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
											}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
												key: 1,
												size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
											}, (0, vue_exports.unref)(props).avatar, {
												"data-slot": "itemLeadingAvatar",
												class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
											}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
												modelValue,
												open,
												ui: ui.value
											}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)([displayValue(modelValue)], (displayedModelValue) => {
												return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 0,
													"data-slot": "value",
													class: ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value })
												}, (0, vue_exports.toDisplayString)(displayedModelValue), 3)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
													key: 1,
													"data-slot": "placeholder",
													class: ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder })
												}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).placeholder ?? "\xA0"), 3))], 64);
											}), 128))]),
											(0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 1,
												"data-slot": "trailing",
												class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
												modelValue,
												open,
												ui: ui.value
											}, () => [!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxCancel_default), {
												key: 0,
												"as-child": ""
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$2, (0, vue_exports.mergeProps)({
													as: "span",
													icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
													size: selectSize.value,
													variant: "link",
													color: "neutral",
													tabindex: "-1"
												}, clearProps.value, {
													"data-slot": "trailingClear",
													class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
													onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
												}), null, 16, [
													"icon",
													"size",
													"class"
												])]),
												_: 1
											})) : (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
												key: 1,
												name: (0, vue_exports.unref)(trailingIconName),
												"data-slot": "trailingIcon",
												class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
											}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
										];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxTrigger_default), (0, vue_exports.mergeProps)({
									id: (0, vue_exports.unref)(id),
									ref_key: "triggerRef",
									ref: triggerRef,
									"data-slot": "base",
									class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] }),
									tabindex: "0"
								}, {
									..._ctx.$attrs,
									...(0, vue_exports.unref)(ariaAttrs)
								}), {
									default: (0, vue_exports.withCtx)(() => [
										(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 0,
											"data-slot": "leading",
											class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
											modelValue,
											open,
											ui: ui.value
										}, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
											key: 0,
											name: (0, vue_exports.unref)(leadingIconName),
											"data-slot": "leadingIcon",
											class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
										}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
											key: 1,
											size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
										}, (0, vue_exports.unref)(props).avatar, {
											"data-slot": "itemLeadingAvatar",
											class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
										}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
											modelValue,
											open,
											ui: ui.value
										}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)([displayValue(modelValue)], (displayedModelValue) => {
											return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 0,
												"data-slot": "value",
												class: ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value })
											}, (0, vue_exports.toDisplayString)(displayedModelValue), 3)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
												key: 1,
												"data-slot": "placeholder",
												class: ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder })
											}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).placeholder ?? "\xA0"), 3))], 64);
										}), 128))]),
										(0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
											key: 1,
											"data-slot": "trailing",
											class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
											modelValue,
											open,
											ui: ui.value
										}, () => [!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxCancel_default), {
											key: 0,
											"as-child": ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$2, (0, vue_exports.mergeProps)({
												as: "span",
												icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
												size: selectSize.value,
												variant: "link",
												color: "neutral",
												tabindex: "-1"
											}, clearProps.value, {
												"data-slot": "trailingClear",
												class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
												onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
											}), null, 16, [
												"icon",
												"size",
												"class"
											])]),
											_: 1
										})) : (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
											key: 1,
											name: (0, vue_exports.unref)(trailingIconName),
											"data-slot": "trailingIcon",
											class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
										}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
									]),
									_: 2
								}, 1040, ["id", "class"])];
							}),
							_: 2
						}, _parent, _scopeId));
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxPortal_default), (0, vue_exports.unref)(portalProps), {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
											"data-slot": "content",
											class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
										}, contentProps.value), {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) {
													_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FocusScope_default), {
														trapped: "",
														"data-slot": "focusScope",
														class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope })
													}, {
														default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
															if (_push) {
																(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content-top", {}, null, _push, _parent, _scopeId);
																if (!!(0, vue_exports.unref)(props).searchInput) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxInput_default), {
																	modelValue: searchTerm.value,
																	"onUpdate:modelValue": ($event) => searchTerm.value = $event,
																	"display-value": () => searchTerm.value,
																	"as-child": ""
																}, {
																	default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																		if (_push) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$5, (0, vue_exports.mergeProps)({
																			autofocus: "",
																			autocomplete: "off",
																			size: selectSize.value
																		}, searchInputProps.value, {
																			"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																			"data-slot": "input",
																			class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																			onChange: () => {}
																		}), null, _parent, _scopeId));
																		else return [(0, vue_exports.createVNode)(_sfc_main$5, (0, vue_exports.mergeProps)({
																			autofocus: "",
																			autocomplete: "off",
																			size: selectSize.value
																		}, searchInputProps.value, {
																			"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																			"data-slot": "input",
																			class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																			onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
																		}), null, 16, [
																			"size",
																			"model-modifiers",
																			"class",
																			"onChange"
																		])];
																	}),
																	_: 2
																}, _parent, _scopeId));
																else _push(`<!---->`);
																_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxEmpty_default), {
																	"data-slot": "empty",
																	class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
																}, {
																	default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																		if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => {
																			_push(`${(0, server_renderer_exports.ssrInterpolate)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData"))}`);
																		}, _push, _parent, _scopeId);
																		else return [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])];
																	}),
																	_: 2
																}, _parent, _scopeId));
																_push(`<div role="presentation" data-slot="viewport" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport }))}"${_scopeId}>`);
																if (!!(0, vue_exports.unref)(props).virtualize) {
																	_push(`<!--[-->`);
																	if (createItem.value && createItemPosition.value === "top") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
																		options: filteredItems.value,
																		"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
																	}, virtualizerProps.value), {
																		default: (0, vue_exports.withCtx)(({ option: item, virtualItem }, _push, _parent, _scopeId) => {
																			if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseItemTemplate), {
																				item,
																				index: virtualItem.index
																			}, null, _parent, _scopeId));
																			else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																				item,
																				index: virtualItem.index
																			}, null, 8, ["item", "index"])];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	if (createItem.value && createItemPosition.value === "bottom") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<!--]-->`);
																} else {
																	_push(`<!--[-->`);
																	if (createItem.value && createItemPosition.value === "top") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxGroup_default), {
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																			if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																			else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<!--[-->`);
																	(0, server_renderer_exports.ssrRenderList)(filteredGroups.value, (group, groupIndex) => {
																		_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxGroup_default), {
																			key: `group-${groupIndex}`,
																			"data-slot": "group",
																			class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																		}, {
																			default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																				if (_push) {
																					_push(`<!--[-->`);
																					(0, server_renderer_exports.ssrRenderList)(group, (item, index) => {
																						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseItemTemplate), {
																							key: `group-${groupIndex}-${index}`,
																							item,
																							index
																						}, null, _parent, _scopeId));
																					});
																					_push(`<!--]-->`);
																				} else return [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																					return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																						key: `group-${groupIndex}-${index}`,
																						item,
																						index
																					}, null, 8, ["item", "index"]);
																				}), 128))];
																			}),
																			_: 2
																		}, _parent, _scopeId));
																	});
																	_push(`<!--]-->`);
																	if (createItem.value && createItemPosition.value === "bottom") _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxGroup_default), {
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																			if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseCreateItemTemplate), null, null, _parent, _scopeId));
																			else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))];
																		}),
																		_: 2
																	}, _parent, _scopeId));
																	else _push(`<!---->`);
																	_push(`<!--]-->`);
																}
																_push(`</div>`);
																(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content-bottom", {}, null, _push, _parent, _scopeId);
															} else return [
																(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
																!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
																	key: 0,
																	modelValue: searchTerm.value,
																	"onUpdate:modelValue": ($event) => searchTerm.value = $event,
																	"display-value": () => searchTerm.value,
																	"as-child": ""
																}, {
																	default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, (0, vue_exports.mergeProps)({
																		autofocus: "",
																		autocomplete: "off",
																		size: selectSize.value
																	}, searchInputProps.value, {
																		"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																		"data-slot": "input",
																		class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																		onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
																	}), null, 16, [
																		"size",
																		"model-modifiers",
																		"class",
																		"onChange"
																	])]),
																	_: 1
																}, 8, [
																	"modelValue",
																	"onUpdate:modelValue",
																	"display-value"
																])) : (0, vue_exports.createCommentVNode)("", true),
																(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
																	"data-slot": "empty",
																	class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
																}, {
																	default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
																	_: 3
																}, 8, ["class"]),
																(0, vue_exports.createVNode)("div", {
																	ref_key: "viewportRef",
																	ref: viewportRef,
																	role: "presentation",
																	"data-slot": "viewport",
																	class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
																}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
																	createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
																	(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
																		options: filteredItems.value,
																		"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
																	}, virtualizerProps.value), {
																		default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																			item,
																			index: virtualItem.index
																		}, null, 8, ["item", "index"])]),
																		_: 1
																	}, 16, ["options", "text-content"]),
																	createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
																], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
																	createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																		key: 0,
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																		_: 1
																	}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
																	((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
																		return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																			key: `group-${groupIndex}`,
																			"data-slot": "group",
																			class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																		}, {
																			default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																				return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																					key: `group-${groupIndex}-${index}`,
																					item,
																					index
																				}, null, 8, ["item", "index"]);
																			}), 128))]),
																			_: 2
																		}, 1032, ["class"]);
																	}), 128)),
																	createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																		key: 1,
																		"data-slot": "group",
																		class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																	}, {
																		default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																		_: 1
																	}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
																], 64))], 2),
																(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
															];
														}),
														_: 2
													}, _parent, _scopeId));
													if (!!(0, vue_exports.unref)(props).arrow) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)(arrowProps.value, {
														"data-slot": "arrow",
														class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
													}), null, _parent, _scopeId));
													else _push(`<!---->`);
												} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
													trapped: "",
													"data-slot": "focusScope",
													class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope })
												}, {
													default: (0, vue_exports.withCtx)(() => [
														(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
														!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
															key: 0,
															modelValue: searchTerm.value,
															"onUpdate:modelValue": ($event) => searchTerm.value = $event,
															"display-value": () => searchTerm.value,
															"as-child": ""
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, (0, vue_exports.mergeProps)({
																autofocus: "",
																autocomplete: "off",
																size: selectSize.value
															}, searchInputProps.value, {
																"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
																"data-slot": "input",
																class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
																onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
															}), null, 16, [
																"size",
																"model-modifiers",
																"class",
																"onChange"
															])]),
															_: 1
														}, 8, [
															"modelValue",
															"onUpdate:modelValue",
															"display-value"
														])) : (0, vue_exports.createCommentVNode)("", true),
														(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
															"data-slot": "empty",
															class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
															_: 3
														}, 8, ["class"]),
														(0, vue_exports.createVNode)("div", {
															ref_key: "viewportRef",
															ref: viewportRef,
															role: "presentation",
															"data-slot": "viewport",
															class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
														}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
															createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
															(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
																options: filteredItems.value,
																"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
															}, virtualizerProps.value), {
																default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																	item,
																	index: virtualItem.index
																}, null, 8, ["item", "index"])]),
																_: 1
															}, 16, ["options", "text-content"]),
															createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
														], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
															createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																key: 0,
																"data-slot": "group",
																class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
															}, {
																default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																_: 1
															}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
															((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
																return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																	key: `group-${groupIndex}`,
																	"data-slot": "group",
																	class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
																}, {
																	default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																		return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																			key: `group-${groupIndex}-${index}`,
																			item,
																			index
																		}, null, 8, ["item", "index"]);
																	}), 128))]),
																	_: 2
																}, 1032, ["class"]);
															}), 128)),
															createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																key: 1,
																"data-slot": "group",
																class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
															}, {
																default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
																_: 1
															}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
														], 64))], 2),
														(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
													]),
													_: 3
												}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
													"data-slot": "arrow",
													class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
												}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)];
											}),
											_: 2
										}, _parent, _scopeId));
										else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
											"data-slot": "content",
											class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
										}, contentProps.value), {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
												trapped: "",
												"data-slot": "focusScope",
												class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope })
											}, {
												default: (0, vue_exports.withCtx)(() => [
													(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
													!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
														key: 0,
														modelValue: searchTerm.value,
														"onUpdate:modelValue": ($event) => searchTerm.value = $event,
														"display-value": () => searchTerm.value,
														"as-child": ""
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, (0, vue_exports.mergeProps)({
															autofocus: "",
															autocomplete: "off",
															size: selectSize.value
														}, searchInputProps.value, {
															"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
															"data-slot": "input",
															class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
															onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
														}), null, 16, [
															"size",
															"model-modifiers",
															"class",
															"onChange"
														])]),
														_: 1
													}, 8, [
														"modelValue",
														"onUpdate:modelValue",
														"display-value"
													])) : (0, vue_exports.createCommentVNode)("", true),
													(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
														"data-slot": "empty",
														class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
														_: 3
													}, 8, ["class"]),
													(0, vue_exports.createVNode)("div", {
														ref_key: "viewportRef",
														ref: viewportRef,
														role: "presentation",
														"data-slot": "viewport",
														class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
													}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
														createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
														(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
															options: filteredItems.value,
															"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
														}, virtualizerProps.value), {
															default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
																item,
																index: virtualItem.index
															}, null, 8, ["item", "index"])]),
															_: 1
														}, 16, ["options", "text-content"]),
														createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
													], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
														createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
															key: 0,
															"data-slot": "group",
															class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
															_: 1
														}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
														((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
															return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
																key: `group-${groupIndex}`,
																"data-slot": "group",
																class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
															}, {
																default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																	return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																		key: `group-${groupIndex}-${index}`,
																		item,
																		index
																	}, null, 8, ["item", "index"]);
																}), 128))]),
																_: 2
															}, 1032, ["class"]);
														}), 128)),
														createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
															key: 1,
															"data-slot": "group",
															class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
														}, {
															default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
															_: 1
														}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
													], 64))], 2),
													(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
												]),
												_: 3
											}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
												"data-slot": "arrow",
												class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
											}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
											_: 3
										}, 16, ["class"])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
										"data-slot": "content",
										class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
									}, contentProps.value), {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
											trapped: "",
											"data-slot": "focusScope",
											class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope })
										}, {
											default: (0, vue_exports.withCtx)(() => [
												(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
												!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
													key: 0,
													modelValue: searchTerm.value,
													"onUpdate:modelValue": ($event) => searchTerm.value = $event,
													"display-value": () => searchTerm.value,
													"as-child": ""
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, (0, vue_exports.mergeProps)({
														autofocus: "",
														autocomplete: "off",
														size: selectSize.value
													}, searchInputProps.value, {
														"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
														"data-slot": "input",
														class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
														onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
													}), null, 16, [
														"size",
														"model-modifiers",
														"class",
														"onChange"
													])]),
													_: 1
												}, 8, [
													"modelValue",
													"onUpdate:modelValue",
													"display-value"
												])) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
													"data-slot": "empty",
													class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
													_: 3
												}, 8, ["class"]),
												(0, vue_exports.createVNode)("div", {
													ref_key: "viewportRef",
													ref: viewportRef,
													role: "presentation",
													"data-slot": "viewport",
													class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
												}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
													createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
													(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
														options: filteredItems.value,
														"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
													}, virtualizerProps.value), {
														default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
															item,
															index: virtualItem.index
														}, null, 8, ["item", "index"])]),
														_: 1
													}, 16, ["options", "text-content"]),
													createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
												], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
													createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
														key: 0,
														"data-slot": "group",
														class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
														_: 1
													}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
													((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
														return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
															key: `group-${groupIndex}`,
															"data-slot": "group",
															class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
														}, {
															default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
																return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
																	key: `group-${groupIndex}-${index}`,
																	item,
																	index
																}, null, 8, ["item", "index"]);
															}), 128))]),
															_: 2
														}, 1032, ["class"]);
													}), 128)),
													createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
														key: 1,
														"data-slot": "group",
														class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
													}, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
														_: 1
													}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
												], 64))], 2),
												(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
											]),
											_: 3
										}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
											"data-slot": "arrow",
											class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
										}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
										_: 3
									}, 16, ["class"])]),
									_: 3
								})];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxAnchor_default), { "as-child": "" }, {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxTrigger_default), (0, vue_exports.mergeProps)({
							id: (0, vue_exports.unref)(id),
							ref_key: "triggerRef",
							ref: triggerRef,
							"data-slot": "base",
							class: ui.value.base({ class: [(0, vue_exports.unref)(props).ui?.base, (0, vue_exports.unref)(props).class] }),
							tabindex: "0"
						}, {
							..._ctx.$attrs,
							...(0, vue_exports.unref)(ariaAttrs)
						}), {
							default: (0, vue_exports.withCtx)(() => [
								(0, vue_exports.unref)(isLeading) || !!(0, vue_exports.unref)(props).avatar || !!slots.leading ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 0,
									"data-slot": "leading",
									class: ui.value.leading({ class: (0, vue_exports.unref)(props).ui?.leading })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "leading", {
									modelValue,
									open,
									ui: ui.value
								}, () => [(0, vue_exports.unref)(isLeading) && (0, vue_exports.unref)(leadingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
									key: 0,
									name: (0, vue_exports.unref)(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({ class: (0, vue_exports.unref)(props).ui?.leadingIcon })
								}, null, 8, ["name", "class"])) : !!(0, vue_exports.unref)(props).avatar ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$3, (0, vue_exports.mergeProps)({
									key: 1,
									size: (0, vue_exports.unref)(props).ui?.itemLeadingAvatarSize || ui.value.itemLeadingAvatarSize()
								}, (0, vue_exports.unref)(props).avatar, {
									"data-slot": "itemLeadingAvatar",
									class: ui.value.itemLeadingAvatar({ class: (0, vue_exports.unref)(props).ui?.itemLeadingAvatar })
								}), null, 16, ["size", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true),
								(0, vue_exports.renderSlot)(_ctx.$slots, "default", {
									modelValue,
									open,
									ui: ui.value
								}, () => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)([displayValue(modelValue)], (displayedModelValue) => {
									return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: displayedModelValue }, [displayedModelValue !== void 0 && displayedModelValue !== null ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 0,
										"data-slot": "value",
										class: ui.value.value({ class: (0, vue_exports.unref)(props).ui?.value })
									}, (0, vue_exports.toDisplayString)(displayedModelValue), 3)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
										key: 1,
										"data-slot": "placeholder",
										class: ui.value.placeholder({ class: (0, vue_exports.unref)(props).ui?.placeholder })
									}, (0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).placeholder ?? "\xA0"), 3))], 64);
								}), 128))]),
								(0, vue_exports.unref)(isTrailing) || !!slots.trailing || !!(0, vue_exports.unref)(props).clear ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("span", {
									key: 1,
									"data-slot": "trailing",
									class: ui.value.trailing({ class: (0, vue_exports.unref)(props).ui?.trailing })
								}, [(0, vue_exports.renderSlot)(_ctx.$slots, "trailing", {
									modelValue,
									open,
									ui: ui.value
								}, () => [!!(0, vue_exports.unref)(props).clear && !isModelValueEmpty(modelValue) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxCancel_default), {
									key: 0,
									"as-child": ""
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$2, (0, vue_exports.mergeProps)({
										as: "span",
										icon: (0, vue_exports.unref)(props).clearIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
										size: selectSize.value,
										variant: "link",
										color: "neutral",
										tabindex: "-1"
									}, clearProps.value, {
										"data-slot": "trailingClear",
										class: ui.value.trailingClear({ class: (0, vue_exports.unref)(props).ui?.trailingClear }),
										onClick: (0, vue_exports.withModifiers)(onClear, ["stop"])
									}), null, 16, [
										"icon",
										"size",
										"class"
									])]),
									_: 1
								})) : (0, vue_exports.unref)(trailingIconName) ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, {
									key: 1,
									name: (0, vue_exports.unref)(trailingIconName),
									"data-slot": "trailingIcon",
									class: ui.value.trailingIcon({ class: (0, vue_exports.unref)(props).ui?.trailingIcon })
								}, null, 8, ["name", "class"])) : (0, vue_exports.createCommentVNode)("", true)])], 2)) : (0, vue_exports.createCommentVNode)("", true)
							]),
							_: 2
						}, 1040, ["id", "class"])]),
						_: 2
					}, 1024), (0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxPortal_default), (0, vue_exports.unref)(portalProps), {
						default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxContent_default), (0, vue_exports.mergeProps)({
								"data-slot": "content",
								class: ui.value.content({ class: (0, vue_exports.unref)(props).ui?.content })
							}, contentProps.value), {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FocusScope_default), {
									trapped: "",
									"data-slot": "focusScope",
									class: ui.value.focusScope({ class: (0, vue_exports.unref)(props).ui?.focusScope })
								}, {
									default: (0, vue_exports.withCtx)(() => [
										(0, vue_exports.renderSlot)(_ctx.$slots, "content-top"),
										!!(0, vue_exports.unref)(props).searchInput ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxInput_default), {
											key: 0,
											modelValue: searchTerm.value,
											"onUpdate:modelValue": ($event) => searchTerm.value = $event,
											"display-value": () => searchTerm.value,
											"as-child": ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)(_sfc_main$5, (0, vue_exports.mergeProps)({
												autofocus: "",
												autocomplete: "off",
												size: selectSize.value
											}, searchInputProps.value, {
												"model-modifiers": { trim: (0, vue_exports.unref)(props).modelModifiers?.trim },
												"data-slot": "input",
												class: ui.value.input({ class: (0, vue_exports.unref)(props).ui?.input }),
												onChange: (0, vue_exports.withModifiers)(() => {}, ["stop"])
											}), null, 16, [
												"size",
												"model-modifiers",
												"class",
												"onChange"
											])]),
											_: 1
										}, 8, [
											"modelValue",
											"onUpdate:modelValue",
											"display-value"
										])) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxEmpty_default), {
											"data-slot": "empty",
											class: ui.value.empty({ class: (0, vue_exports.unref)(props).ui?.empty })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "empty", { searchTerm: searchTerm.value }, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)(searchTerm.value ? (0, vue_exports.unref)(t)("selectMenu.noMatch", { searchTerm: searchTerm.value }) : (0, vue_exports.unref)(t)("selectMenu.noData")), 1)])]),
											_: 3
										}, 8, ["class"]),
										(0, vue_exports.createVNode)("div", {
											ref_key: "viewportRef",
											ref: viewportRef,
											role: "presentation",
											"data-slot": "viewport",
											class: ui.value.viewport({ class: (0, vue_exports.unref)(props).ui?.viewport })
										}, [!!(0, vue_exports.unref)(props).virtualize ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 0 }, [
											createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 0 })) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.createVNode)((0, vue_exports.unref)(ComboboxVirtualizer_default), (0, vue_exports.mergeProps)({
												options: filteredItems.value,
												"text-content": (item2) => isSelectItem(item2) ? (0, vue_exports.unref)(get)(item2, (0, vue_exports.unref)(props).labelKey) : String(item2)
											}, virtualizerProps.value), {
												default: (0, vue_exports.withCtx)(({ option: item, virtualItem }) => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseItemTemplate), {
													item,
													index: virtualItem.index
												}, null, 8, ["item", "index"])]),
												_: 1
											}, 16, ["options", "text-content"]),
											createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseCreateItemTemplate), { key: 1 })) : (0, vue_exports.createCommentVNode)("", true)
										], 64)) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [
											createItem.value && createItemPosition.value === "top" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
												key: 0,
												"data-slot": "group",
												class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
												_: 1
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
											((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(filteredGroups.value, (group, groupIndex) => {
												return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
													key: `group-${groupIndex}`,
													"data-slot": "group",
													class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
												}, {
													default: (0, vue_exports.withCtx)(() => [((0, vue_exports.openBlock)(true), (0, vue_exports.createBlock)(vue_exports.Fragment, null, (0, vue_exports.renderList)(group, (item, index) => {
														return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ReuseItemTemplate), {
															key: `group-${groupIndex}-${index}`,
															item,
															index
														}, null, 8, ["item", "index"]);
													}), 128))]),
													_: 2
												}, 1032, ["class"]);
											}), 128)),
											createItem.value && createItemPosition.value === "bottom" ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxGroup_default), {
												key: 1,
												"data-slot": "group",
												class: ui.value.group({ class: (0, vue_exports.unref)(props).ui?.group })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseCreateItemTemplate))]),
												_: 1
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)
										], 64))], 2),
										(0, vue_exports.renderSlot)(_ctx.$slots, "content-bottom")
									]),
									_: 3
								}, 8, ["class"]), !!(0, vue_exports.unref)(props).arrow ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(ComboboxArrow_default), (0, vue_exports.mergeProps)({ key: 0 }, arrowProps.value, {
									"data-slot": "arrow",
									class: ui.value.arrow({ class: (0, vue_exports.unref)(props).ui?.arrow })
								}), null, 16, ["class"])) : (0, vue_exports.createCommentVNode)("", true)]),
								_: 3
							}, 16, ["class"])]),
							_: 3
						})]),
						_: 3
					}, 16)];
				}),
				_: 3
			}, _parent));
			_push(`<!--]-->`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/SelectMenu.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SelectMenu-dKLm1tmu.mjs.map
