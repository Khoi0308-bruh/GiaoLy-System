import { Z as injectConfigProviderContext, v as vue_exports } from '../virtual/entry.mjs';

//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useDirection.js
/**
* The `useDirection` function provides a way to access the current direction in your application.
* @param {Ref<Direction | undefined>} [dir] - An optional ref containing the direction (ltr or rtl).
* @returns  computed value that combines with the resolved direction.
*/
function useDirection(dir) {
	const context = injectConfigProviderContext({ dir: (0, vue_exports.ref)("ltr") });
	return (0, vue_exports.computed)(() => dir?.value || context.dir?.value || "ltr");
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useId.js
var count = 0;
/**
* The `useId` function generates a unique identifier using a provided deterministic ID,
* a configured `<ConfigProvider>` ID source, Vue's native `useId`, or a fallback counter.
* @param {string | null | undefined} [deterministicId] - The `useId` function you provided takes an
* optional parameter `deterministicId`, which can be a string, null, or undefined. If
* `deterministicId` is provided, the function will return it. Otherwise, it will generate an id using
* the configured ID source.
*/
function useId(deterministicId, prefix = "reka") {
	let id;
	const configProviderContext = injectConfigProviderContext({ useId: void 0 });
	if (configProviderContext.useId) id = configProviderContext.useId();
	else if ("useId" in vue_exports) id = vue_exports.useId?.();
	else id = `${++count}`;
	return prefix ? `${prefix}-${id}` : id;
}

export { useDirection as a, useId as u };
//# sourceMappingURL=useId-D2M6x4XU.mjs.map
