import { v as vue_exports, g as useComponentProps, w as useLocale, h as useAppConfig, l as useForwardProps, x as usePortal, t as tv, s as server_renderer_exports, V as VisuallyHidden_default, d as _sfc_main$1, F as FieldGroupReset, M as useEmitAsProps, n as useForwardExpose, p as Presence_default, P as Primitive, T as Teleport_default, q as createContext } from '../virtual/entry.mjs';
import { a as useHideOthers, u as useBodyScrollLock, F as FocusScope_default, D as DismissableLayer_default, g as getOpenState } from './utils-SyRrd6Ur.mjs';
import { u as useId } from './useId-D2M6x4XU.mjs';
import { reactivePick, createReusableTemplate, useVModel } from '@vueuse/core';

//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogRoot.js
var [injectDialogRootContext, provideDialogRootContext] = /*#__PURE__*/ createContext("DialogRoot");
var DialogRoot_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	inheritAttrs: false,
	__name: "DialogRoot",
	props: {
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		defaultOpen: {
			type: Boolean,
			required: false,
			default: false
		},
		modal: {
			type: Boolean,
			required: false,
			default: true
		},
		unmountOnHide: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ["update:open"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const open = useVModel(props, "open", __emit, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		const triggerElement = (0, vue_exports.ref)();
		const contentElement = (0, vue_exports.ref)();
		const { modal, unmountOnHide } = (0, vue_exports.toRefs)(props);
		provideDialogRootContext({
			open,
			modal,
			unmountOnHide,
			openModal: () => {
				open.value = true;
			},
			onOpenChange: (value) => {
				open.value = value;
			},
			onOpenToggle: () => {
				open.value = !open.value;
			},
			contentId: "",
			titleId: "",
			descriptionId: "",
			triggerElement,
			contentElement
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.renderSlot)(_ctx.$slots, "default", {
				open: (0, vue_exports.unref)(open),
				close: () => open.value = false
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogClose.js
var DialogClose_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogClose",
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
		const rootContext = injectDialogRootContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				type: _ctx.as === "button" ? "button" : void 0,
				onClick: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(false))
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["type"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContentImpl.js
var DialogContentImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContentImpl",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
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
		},
		present: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectDialogRootContext();
		const { forwardRef} = useForwardExpose();
		rootContext.titleId ||= useId(void 0, "reka-dialog-title");
		rootContext.descriptionId ||= useId(void 0, "reka-dialog-description");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(FocusScope_default), {
				"as-child": "",
				loop: "",
				trapped: props.trapFocus,
				present: props.present,
				onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
				onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(DismissableLayer_default), (0, vue_exports.mergeProps)({
					id: (0, vue_exports.unref)(rootContext).contentId,
					ref: (0, vue_exports.unref)(forwardRef),
					as: _ctx.as,
					"as-child": _ctx.asChild,
					present: props.present,
					"disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
					role: "dialog",
					"aria-describedby": (0, vue_exports.unref)(rootContext).descriptionId,
					"aria-labelledby": (0, vue_exports.unref)(rootContext).titleId,
					"data-state": (0, vue_exports.unref)(getOpenState)((0, vue_exports.unref)(rootContext).open.value)
				}, _ctx.$attrs, {
					onDismiss: _cache[0] || (_cache[0] = ($event) => (0, vue_exports.unref)(rootContext).onOpenChange(false)),
					onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
					onFocusOutside: _cache[2] || (_cache[2] = ($event) => emits("focusOutside", $event)),
					onInteractOutside: _cache[3] || (_cache[3] = ($event) => emits("interactOutside", $event)),
					onPointerDownOutside: _cache[4] || (_cache[4] = ($event) => emits("pointerDownOutside", $event))
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"as",
					"as-child",
					"present",
					"disable-outside-pointer-events",
					"aria-describedby",
					"aria-labelledby",
					"data-state"
				])]),
				_: 3
			}, 8, ["trapped", "present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContentModal.js
var DialogContentModal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContentModal",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectDialogRootContext();
		const emitsAsProps = useEmitAsProps(emits);
		const { forwardRef, currentElement } = useForwardExpose();
		useHideOthers((0, vue_exports.computed)(() => props.present ? currentElement.value : void 0));
		const forwardedProps = (0, vue_exports.computed)(() => {
			const { present: _, ...rest } = props;
			return rest;
		});
		(0, vue_exports.watch)(() => props.present, (isPresent, wasPresent) => {
			if (!isPresent && wasPresent) rootContext.triggerElement.value?.focus();
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentImpl_default, (0, vue_exports.mergeProps)({
				...forwardedProps.value,
				...(0, vue_exports.unref)(emitsAsProps)
			}, {
				ref: (0, vue_exports.unref)(forwardRef),
				present: _ctx.present,
				"trap-focus": (0, vue_exports.unref)(rootContext).open.value,
				"disable-outside-pointer-events": props.disableOutsidePointerEvents,
				onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
					if (!event.defaultPrevented) {
						event.preventDefault();
						(0, vue_exports.unref)(rootContext).triggerElement.value?.focus();
					}
				}),
				onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
					const originalEvent = event.detail.originalEvent;
					const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
					if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
				}),
				onFocusOutside: _cache[2] || (_cache[2] = (event) => {
					event.preventDefault();
				})
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"present",
				"trap-focus",
				"disable-outside-pointer-events"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContentNonModal.js
var DialogContentNonModal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContentNonModal",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		trapFocus: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
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
		},
		present: {
			type: Boolean,
			required: true
		}
	},
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emitsAsProps = useEmitAsProps(__emit);
		useForwardExpose();
		const rootContext = injectDialogRootContext();
		const hasInteractedOutsideRef = (0, vue_exports.ref)(false);
		const hasPointerDownOutsideRef = (0, vue_exports.ref)(false);
		const forwardedProps = (0, vue_exports.computed)(() => {
			const { present: _, ...rest } = props;
			return rest;
		});
		(0, vue_exports.watch)(() => props.present, (isPresent, wasPresent) => {
			if (!isPresent && wasPresent) {
				if (!hasInteractedOutsideRef.value) rootContext.triggerElement.value?.focus();
				hasInteractedOutsideRef.value = false;
				hasPointerDownOutsideRef.value = false;
			}
		});
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentImpl_default, (0, vue_exports.mergeProps)({
				...forwardedProps.value,
				...(0, vue_exports.unref)(emitsAsProps)
			}, {
				present: _ctx.present,
				"trap-focus": false,
				"disable-outside-pointer-events": false,
				onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
					if (!event.defaultPrevented) {
						if (!hasInteractedOutsideRef.value) (0, vue_exports.unref)(rootContext).triggerElement.value?.focus();
						event.preventDefault();
					}
					hasInteractedOutsideRef.value = false;
					hasPointerDownOutsideRef.value = false;
				}),
				onInteractOutside: _cache[1] || (_cache[1] = (event) => {
					if (!event.defaultPrevented) {
						hasInteractedOutsideRef.value = true;
						if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
					}
					const target = event.target;
					if ((0, vue_exports.unref)(rootContext).triggerElement.value?.contains(target)) event.preventDefault();
					if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
				})
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogContent.js
var DialogContent_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogContent",
	props: {
		forceMount: {
			type: Boolean,
			required: false
		},
		disableOutsidePointerEvents: {
			type: Boolean,
			required: false,
			default: void 0
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
	emits: [
		"escapeKeyDown",
		"pointerDownOutside",
		"focusOutside",
		"interactOutside",
		"openAutoFocus",
		"closeAutoFocus"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const rootContext = injectDialogRootContext();
		const emitsAsProps = useEmitAsProps(emits);
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), {
				present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value,
				"force-mount": _ctx.forceMount || !(0, vue_exports.unref)(rootContext).unmountOnHide.value
			}, {
				default: (0, vue_exports.withCtx)(({ present }) => [(0, vue_exports.unref)(rootContext).modal.value ? (0, vue_exports.withDirectives)(((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentModal_default, (0, vue_exports.mergeProps)({
					key: 0,
					ref: (0, vue_exports.unref)(forwardRef),
					present: (0, vue_exports.unref)(rootContext).unmountOnHide.value || present
				}, {
					...props,
					...(0, vue_exports.unref)(emitsAsProps),
					..._ctx.$attrs
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 2
				}, 1040, ["present"])), [[vue_exports.vShow, (0, vue_exports.unref)(rootContext).unmountOnHide.value || present]]) : (0, vue_exports.withDirectives)(((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(DialogContentNonModal_default, (0, vue_exports.mergeProps)({
					key: 1,
					ref: (0, vue_exports.unref)(forwardRef),
					present: (0, vue_exports.unref)(rootContext).unmountOnHide.value || present
				}, {
					...props,
					...(0, vue_exports.unref)(emitsAsProps),
					..._ctx.$attrs
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 2
				}, 1040, ["present"])), [[vue_exports.vShow, (0, vue_exports.unref)(rootContext).unmountOnHide.value || present]])]),
				_: 3
			}, 8, ["present", "force-mount"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogDescription.js
var DialogDescription_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogDescription",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "p"
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		const rootContext = injectDialogRootContext();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { id: (0, vue_exports.unref)(rootContext).descriptionId }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogOverlayImpl.js
var DialogOverlayImpl_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogOverlayImpl",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		present: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectDialogRootContext();
		const scrollLocked = useBodyScrollLock(props.present);
		(0, vue_exports.watch)(() => props.present, (val) => scrollLocked.value = val);
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), {
				as: _ctx.as,
				"as-child": _ctx.asChild,
				"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
				style: { "pointer-events": "auto" },
				onPointerdown: _cache[0] || (_cache[0] = (0, vue_exports.withModifiers)(() => {}, [
					"left",
					"self",
					"prevent"
				]))
			}, {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"data-state"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogOverlay.js
var DialogOverlay_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogOverlay",
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
			required: false
		}
	},
	setup(__props) {
		const rootContext = injectDialogRootContext();
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.unref)(rootContext)?.modal.value ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Presence_default), {
				key: 0,
				present: _ctx.forceMount || (0, vue_exports.unref)(rootContext).open.value,
				"force-mount": _ctx.forceMount || !(0, vue_exports.unref)(rootContext).unmountOnHide.value
			}, {
				default: (0, vue_exports.withCtx)(({ present }) => [(0, vue_exports.withDirectives)((0, vue_exports.createVNode)(DialogOverlayImpl_default, (0, vue_exports.mergeProps)(_ctx.$attrs, {
					ref: (0, vue_exports.unref)(forwardRef),
					as: _ctx.as,
					"as-child": _ctx.asChild,
					present: (0, vue_exports.unref)(rootContext).unmountOnHide.value || present
				}), {
					default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
					_: 2
				}, 1040, [
					"as",
					"as-child",
					"present"
				]), [[vue_exports.vShow, (0, vue_exports.unref)(rootContext).unmountOnHide.value || present]])]),
				_: 3
			}, 8, ["present", "force-mount"])) : (0, vue_exports.createCommentVNode)("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogPortal.js
var DialogPortal_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogPortal",
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
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogTitle.js
var DialogTitle_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogTitle",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "h2"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectDialogRootContext();
		useForwardExpose();
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, { id: (0, vue_exports.unref)(rootContext).titleId }), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, ["id"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/Dialog/DialogTrigger.js
var DialogTrigger_default = /* @__PURE__ */ (0, vue_exports.defineComponent)({
	__name: "DialogTrigger",
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
		const rootContext = injectDialogRootContext();
		const { forwardRef} = useForwardExpose();
		rootContext.contentId ||= useId(void 0, "reka-dialog-content");
		return (_ctx, _cache) => {
			return (0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(Primitive), (0, vue_exports.mergeProps)(props, {
				ref: (0, vue_exports.unref)(forwardRef),
				type: _ctx.as === "button" ? "button" : void 0,
				"aria-haspopup": "dialog",
				"aria-expanded": (0, vue_exports.unref)(rootContext).open.value || false,
				"aria-controls": (0, vue_exports.unref)(rootContext).open.value ? (0, vue_exports.unref)(rootContext).contentId : void 0,
				"data-state": (0, vue_exports.unref)(rootContext).open.value ? "open" : "closed",
				onClick: (0, vue_exports.unref)(rootContext).onOpenToggle
			}), {
				default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"type",
				"aria-expanded",
				"aria-controls",
				"data-state",
				"onClick"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/utils/overlay.js
function pointerDownOutside(e, options = {}) {
	const originalEvent = e.detail.originalEvent;
	const target = originalEvent.target;
	if (!target?.isConnected) {
		e.preventDefault();
		return;
	}
	if (options.scrollable) {
		if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) e.preventDefault();
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fmodal.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fmodal_default = {
	"slots": {
		"overlay": "fixed inset-0",
		"content": "bg-default divide-y divide-default flex flex-col focus:outline-none",
		"header": "flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)",
		"wrapper": "",
		"body": "flex-1 p-4 sm:p-6",
		"footer": "flex items-center gap-1.5 p-4 sm:px-6",
		"title": "text-highlighted font-semibold",
		"description": "mt-1 text-muted text-sm",
		"close": "absolute top-4 end-4"
	},
	"variants": {
		"transition": { "true": {
			"overlay": "data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]",
			"content": "data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]"
		} },
		"fullscreen": {
			"true": { "content": "inset-0" },
			"false": { "content": "w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default" }
		},
		"overlay": { "true": { "overlay": "bg-elevated/75" } },
		"scrollable": {
			"true": {
				"overlay": "overflow-y-auto",
				"content": "relative"
			},
			"false": {
				"content": "fixed",
				"body": "overflow-y-auto"
			}
		}
	},
	"compoundVariants": [{
		"scrollable": true,
		"fullscreen": false,
		"class": { "overlay": "grid place-items-center p-4 sm:py-8" }
	}, {
		"scrollable": false,
		"fullscreen": false,
		"class": { "content": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden" }
	}]
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue
var _sfc_main = {
	__name: "UModal",
	__ssrInlineRender: true,
	props: {
		title: {
			type: String,
			required: false
		},
		description: {
			type: String,
			required: false
		},
		content: {
			type: Object,
			required: false
		},
		overlay: {
			type: Boolean,
			required: false,
			default: true
		},
		scrollable: {
			type: Boolean,
			required: false
		},
		transition: {
			type: Boolean,
			required: false,
			default: true
		},
		fullscreen: {
			type: Boolean,
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		close: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		closeIcon: {
			type: null,
			required: false
		},
		dismissible: {
			type: Boolean,
			required: false,
			default: true
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
		modal: {
			type: Boolean,
			required: false,
			default: true
		},
		unmountOnHide: {
			type: Boolean,
			required: false
		}
	},
	emits: [
		"leave",
		"after:leave",
		"enter",
		"after:enter",
		"close:prevent",
		"update:open"
	],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = (0, vue_exports.useSlots)();
		const props = useComponentProps("modal", _props);
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "open", "defaultOpen", "modal", "unmountOnHide"), emits);
		const portalProps = usePortal((0, vue_exports.toRef)(() => props.portal));
		const contentProps = (0, vue_exports.toRef)(() => props.content);
		const contentEvents = (0, vue_exports.computed)(() => {
			if (!props.dismissible) return ["interactOutside", "escapeKeyDown"].reduce((acc, curr) => {
				acc[curr] = (e) => {
					e.preventDefault();
					emits("close:prevent");
				};
				return acc;
			}, {});
			return { pointerDownOutside: (e) => pointerDownOutside(e, { scrollable: props.scrollable }) };
		});
		const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate();
		const ui = (0, vue_exports.computed)(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fmodal_default,
			...appConfig.ui?.modal || {}
		})({
			transition: props.transition,
			fullscreen: props.fullscreen,
			overlay: props.overlay,
			scrollable: props.scrollable
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogRoot_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(rootProps), _attrs), {
				default: (0, vue_exports.withCtx)(({ open, close }, _push, _parent, _scopeId) => {
					if (_push) {
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DefineContentTemplate), null, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
									"data-slot": "content",
									class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
								}, contentProps.value, {
									onEnter: ($event) => emits("enter"),
									onAfterEnter: ($event) => emits("after:enter"),
									onLeave: ($event) => emits("leave"),
									onAfterLeave: ($event) => emits("after:leave")
								}, (0, vue_exports.toHandlers)(contentEvents.value)), {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) {
											if (!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(VisuallyHidden_default), null, {
												default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
													if (_push) {
														if (!(0, vue_exports.unref)(props).title && !slots.title) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTitle_default), null, null, _parent, _scopeId));
														else if (!!slots.content) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTitle_default), null, {
															default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "title", {}, () => {
																	_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).title)}`);
																}, _push, _parent, _scopeId);
																else return [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else _push(`<!---->`);
														if (!(0, vue_exports.unref)(props).description && !slots.description) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogDescription_default), null, null, _parent, _scopeId));
														else if (!!slots.content) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogDescription_default), null, {
															default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", {}, () => {
																	_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
																}, _push, _parent, _scopeId);
																else return [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else _push(`<!---->`);
													} else return [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
														_: 3
													})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
														default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
														_: 3
													})) : (0, vue_exports.createCommentVNode)("", true)];
												}),
												_: 2
											}, _parent, _scopeId));
											else _push(`<!---->`);
											(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "content", { close }, () => {
												if (!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close) {
													_push(`<div data-slot="header" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "header", { close }, () => {
														if ((0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description) {
															_push(`<div data-slot="wrapper" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper }))}"${_scopeId}>`);
															if ((0, vue_exports.unref)(props).title || !!slots.title) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTitle_default), {
																"data-slot": "title",
																class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
															}, {
																default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																	if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "title", {}, () => {
																		_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).title)}`);
																	}, _push, _parent, _scopeId);
																	else return [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])];
																}),
																_: 2
															}, _parent, _scopeId));
															else _push(`<!---->`);
															if ((0, vue_exports.unref)(props).description || !!slots.description) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogDescription_default), {
																"data-slot": "description",
																class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
															}, {
																default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																	if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "description", {}, () => {
																		_push(`${(0, server_renderer_exports.ssrInterpolate)((0, vue_exports.unref)(props).description)}`);
																	}, _push, _parent, _scopeId);
																	else return [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])];
																}),
																_: 2
															}, _parent, _scopeId));
															else _push(`<!---->`);
															_push(`</div>`);
														} else _push(`<!---->`);
														(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "actions", {}, null, _push, _parent, _scopeId);
														if ((0, vue_exports.unref)(props).close || !!slots.close) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogClose_default), { "as-child": "" }, {
															default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
																if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => {
																	if ((0, vue_exports.unref)(props).close) _push((0, server_renderer_exports.ssrRenderComponent)(_sfc_main$1, (0, vue_exports.mergeProps)({
																		icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																		color: "neutral",
																		variant: "ghost",
																		"aria-label": (0, vue_exports.unref)(t)("modal.close")
																	}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
																		"data-slot": "close",
																		class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
																	}), null, _parent, _scopeId));
																	else _push(`<!---->`);
																}, _push, _parent, _scopeId);
																else return [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, (0, vue_exports.mergeProps)({
																	key: 0,
																	icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
																	color: "neutral",
																	variant: "ghost",
																	"aria-label": (0, vue_exports.unref)(t)("modal.close")
																}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
																	"data-slot": "close",
																	class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
																}), null, 16, [
																	"icon",
																	"aria-label",
																	"class"
																])) : (0, vue_exports.createCommentVNode)("", true)])];
															}),
															_: 2
														}, _parent, _scopeId));
														else _push(`<!---->`);
													}, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												if (!!slots.body) {
													_push(`<div data-slot="body" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "body", { close }, null, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
												if (!!slots.footer) {
													_push(`<div data-slot="footer" class="${(0, server_renderer_exports.ssrRenderClass)(ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer }))}"${_scopeId}>`);
													(0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "footer", { close }, null, _push, _parent, _scopeId);
													_push(`</div>`);
												} else _push(`<!---->`);
											}, _push, _parent, _scopeId);
										} else return [!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHidden_default), { key: 0 }, {
											default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
												_: 3
											})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
												_: 3
											})) : (0, vue_exports.createCommentVNode)("", true)]),
											_: 3
										})) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "content", { close }, () => [
											!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												"data-slot": "header",
												class: ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "header", { close }, () => [
												(0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
													key: 0,
													"data-slot": "wrapper",
													class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
												}, [(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), {
													key: 0,
													"data-slot": "title",
													class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
													_: 3
												}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), {
													key: 1,
													"data-slot": "description",
													class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
													_: 3
												}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true),
												(0, vue_exports.renderSlot)(_ctx.$slots, "actions"),
												(0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogClose_default), {
													key: 1,
													"as-child": ""
												}, {
													default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, (0, vue_exports.mergeProps)({
														key: 0,
														icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
														color: "neutral",
														variant: "ghost",
														"aria-label": (0, vue_exports.unref)(t)("modal.close")
													}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
														"data-slot": "close",
														class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
													}), null, 16, [
														"icon",
														"aria-label",
														"class"
													])) : (0, vue_exports.createCommentVNode)("", true)])]),
													_: 2
												}, 1024)) : (0, vue_exports.createCommentVNode)("", true)
											])], 2)) : (0, vue_exports.createCommentVNode)("", true),
											!!slots.body ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 1,
												"data-slot": "body",
												class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true),
											!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 2,
												"data-slot": "footer",
												class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
											}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
										])];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
									"data-slot": "content",
									class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
								}, contentProps.value, {
									onEnter: ($event) => emits("enter"),
									onAfterEnter: ($event) => emits("after:enter"),
									onLeave: ($event) => emits("leave"),
									onAfterLeave: ($event) => emits("after:leave")
								}, (0, vue_exports.toHandlers)(contentEvents.value)), {
									default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHidden_default), { key: 0 }, {
										default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
											_: 3
										})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
											_: 3
										})) : (0, vue_exports.createCommentVNode)("", true)]),
										_: 3
									})) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "content", { close }, () => [
										!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											"data-slot": "header",
											class: ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "header", { close }, () => [
											(0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
												key: 0,
												"data-slot": "wrapper",
												class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
											}, [(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), {
												key: 0,
												"data-slot": "title",
												class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
												_: 3
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), {
												key: 1,
												"data-slot": "description",
												class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
												_: 3
											}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true),
											(0, vue_exports.renderSlot)(_ctx.$slots, "actions"),
											(0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogClose_default), {
												key: 1,
												"as-child": ""
											}, {
												default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, (0, vue_exports.mergeProps)({
													key: 0,
													icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
													color: "neutral",
													variant: "ghost",
													"aria-label": (0, vue_exports.unref)(t)("modal.close")
												}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
													"data-slot": "close",
													class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
												}), null, 16, [
													"icon",
													"aria-label",
													"class"
												])) : (0, vue_exports.createCommentVNode)("", true)])]),
												_: 2
											}, 1024)) : (0, vue_exports.createCommentVNode)("", true)
										])], 2)) : (0, vue_exports.createCommentVNode)("", true),
										!!slots.body ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 1,
											"data-slot": "body",
											class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true),
										!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 2,
											"data-slot": "footer",
											class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
										}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
									])]),
									_: 2
								}, 1040, [
									"class",
									"onEnter",
									"onAfterEnter",
									"onLeave",
									"onAfterLeave"
								])];
							}),
							_: 2
						}, _parent, _scopeId));
						if (!!slots.default) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogTrigger_default), {
							"as-child": "",
							class: (0, vue_exports.unref)(props).class
						}, {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) (0, server_renderer_exports.ssrRenderSlot)(_ctx.$slots, "default", { open }, null, _push, _parent, _scopeId);
								else return [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
						_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogPortal_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(portalProps), { "force-mount": (0, vue_exports.unref)(portalProps).disabled && (0, vue_exports.unref)(props).unmountOnHide === false || void 0 }), {
							default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
								if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
										if (_push) if ((0, vue_exports.unref)(props).scrollable) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogOverlay_default), {
											"data-slot": "overlay",
											class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
										}, {
											default: (0, vue_exports.withCtx)((_, _push, _parent, _scopeId) => {
												if (_push) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseContentTemplate), null, null, _parent, _scopeId));
												else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))];
											}),
											_: 2
										}, _parent, _scopeId));
										else {
											_push(`<!--[-->`);
											if ((0, vue_exports.unref)(props).overlay) _push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(DialogOverlay_default), {
												"data-slot": "overlay",
												class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
											}, null, _parent, _scopeId));
											else _push(`<!---->`);
											_push((0, server_renderer_exports.ssrRenderComponent)((0, vue_exports.unref)(ReuseContentTemplate), null, null, _parent, _scopeId));
											_push(`<!--]-->`);
										}
										else return [(0, vue_exports.unref)(props).scrollable ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
											key: 0,
											"data-slot": "overlay",
											class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))]),
											_: 1
										}, 8, ["class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
											key: 0,
											"data-slot": "overlay",
											class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
										}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))], 64))];
									}),
									_: 2
								}, _parent, _scopeId));
								else return [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(props).scrollable ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
										key: 0,
										"data-slot": "overlay",
										class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
									}, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))]),
										_: 1
									}, 8, ["class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
										key: 0,
										"data-slot": "overlay",
										class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
									}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))], 64))]),
									_: 1
								})];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [
						(0, vue_exports.createVNode)((0, vue_exports.unref)(DefineContentTemplate), null, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(DialogContent_default), (0, vue_exports.mergeProps)({
								"data-slot": "content",
								class: ui.value.content({ class: [!slots.default && (0, vue_exports.unref)(props).class, (0, vue_exports.unref)(props).ui?.content] })
							}, contentProps.value, {
								onEnter: ($event) => emits("enter"),
								onAfterEnter: ($event) => emits("after:enter"),
								onLeave: ($event) => emits("leave"),
								onAfterLeave: ($event) => emits("after:leave")
							}, (0, vue_exports.toHandlers)(contentEvents.value)), {
								default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title || !(0, vue_exports.unref)(props).description && !slots.description || !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(VisuallyHidden_default), { key: 0 }, {
									default: (0, vue_exports.withCtx)(() => [!(0, vue_exports.unref)(props).title && !slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 0 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), { key: 1 }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
										_: 3
									})) : (0, vue_exports.createCommentVNode)("", true), !(0, vue_exports.unref)(props).description && !slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 2 })) : !!slots.content ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), { key: 3 }, {
										default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
										_: 3
									})) : (0, vue_exports.createCommentVNode)("", true)]),
									_: 3
								})) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.renderSlot)(_ctx.$slots, "content", { close }, () => [
									!!slots.header || (0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description || (0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 0,
										"data-slot": "header",
										class: ui.value.header({ class: (0, vue_exports.unref)(props).ui?.header })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "header", { close }, () => [
										(0, vue_exports.unref)(props).title || !!slots.title || (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
											key: 0,
											"data-slot": "wrapper",
											class: ui.value.wrapper({ class: (0, vue_exports.unref)(props).ui?.wrapper })
										}, [(0, vue_exports.unref)(props).title || !!slots.title ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTitle_default), {
											key: 0,
											"data-slot": "title",
											class: ui.value.title({ class: (0, vue_exports.unref)(props).ui?.title })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "title", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).title), 1)])]),
											_: 3
										}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.unref)(props).description || !!slots.description ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogDescription_default), {
											key: 1,
											"data-slot": "description",
											class: ui.value.description({ class: (0, vue_exports.unref)(props).ui?.description })
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "description", {}, () => [(0, vue_exports.createTextVNode)((0, vue_exports.toDisplayString)((0, vue_exports.unref)(props).description), 1)])]),
											_: 3
										}, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true)], 2)) : (0, vue_exports.createCommentVNode)("", true),
										(0, vue_exports.renderSlot)(_ctx.$slots, "actions"),
										(0, vue_exports.unref)(props).close || !!slots.close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogClose_default), {
											key: 1,
											"as-child": ""
										}, {
											default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "close", { ui: ui.value }, () => [(0, vue_exports.unref)(props).close ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(_sfc_main$1, (0, vue_exports.mergeProps)({
												key: 0,
												icon: (0, vue_exports.unref)(props).closeIcon || (0, vue_exports.unref)(appConfig).ui.icons.close,
												color: "neutral",
												variant: "ghost",
												"aria-label": (0, vue_exports.unref)(t)("modal.close")
											}, typeof (0, vue_exports.unref)(props).close === "object" ? (0, vue_exports.unref)(props).close : {}, {
												"data-slot": "close",
												class: ui.value.close({ class: (0, vue_exports.unref)(props).ui?.close })
											}), null, 16, [
												"icon",
												"aria-label",
												"class"
											])) : (0, vue_exports.createCommentVNode)("", true)])]),
											_: 2
										}, 1024)) : (0, vue_exports.createCommentVNode)("", true)
									])], 2)) : (0, vue_exports.createCommentVNode)("", true),
									!!slots.body ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 1,
										"data-slot": "body",
										class: ui.value.body({ class: (0, vue_exports.unref)(props).ui?.body })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "body", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true),
									!!slots.footer ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)("div", {
										key: 2,
										"data-slot": "footer",
										class: ui.value.footer({ class: (0, vue_exports.unref)(props).ui?.footer })
									}, [(0, vue_exports.renderSlot)(_ctx.$slots, "footer", { close })], 2)) : (0, vue_exports.createCommentVNode)("", true)
								])]),
								_: 2
							}, 1040, [
								"class",
								"onEnter",
								"onAfterEnter",
								"onLeave",
								"onAfterLeave"
							])]),
							_: 2
						}, 1024),
						!!slots.default ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogTrigger_default), {
							key: 0,
							"as-child": "",
							class: (0, vue_exports.unref)(props).class
						}, {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.renderSlot)(_ctx.$slots, "default", { open })]),
							_: 2
						}, 1032, ["class"])) : (0, vue_exports.createCommentVNode)("", true),
						(0, vue_exports.createVNode)((0, vue_exports.unref)(DialogPortal_default), (0, vue_exports.mergeProps)((0, vue_exports.unref)(portalProps), { "force-mount": (0, vue_exports.unref)(portalProps).disabled && (0, vue_exports.unref)(props).unmountOnHide === false || void 0 }), {
							default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(FieldGroupReset), null, {
								default: (0, vue_exports.withCtx)(() => [(0, vue_exports.unref)(props).scrollable ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
									key: 0,
									"data-slot": "overlay",
									class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
								}, {
									default: (0, vue_exports.withCtx)(() => [(0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))]),
									_: 1
								}, 8, ["class"])) : ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)(vue_exports.Fragment, { key: 1 }, [(0, vue_exports.unref)(props).overlay ? ((0, vue_exports.openBlock)(), (0, vue_exports.createBlock)((0, vue_exports.unref)(DialogOverlay_default), {
									key: 0,
									"data-slot": "overlay",
									class: ui.value.overlay({ class: (0, vue_exports.unref)(props).ui?.overlay })
								}, null, 8, ["class"])) : (0, vue_exports.createCommentVNode)("", true), (0, vue_exports.createVNode)((0, vue_exports.unref)(ReuseContentTemplate))], 64))]),
								_: 1
							})]),
							_: 1
						}, 16, ["force-mount"])
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = (0, vue_exports.useSSRContext)();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/.pnpm/@nuxt+ui@4.10.0_c78c26ed20a22aca550bd61cfba2c5eb/node_modules/@nuxt/ui/dist/runtime/components/Modal.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Modal-C5m9NkUq.mjs.map
