import { v as vue_exports } from '../virtual/entry.mjs';
import { unrefElement } from '@vueuse/core';

//#region node_modules/.pnpm/reka-ui@2.10.1_vue@3.5.40_typescript@6.0.3_/node_modules/reka-ui/dist/shared/useFormControl.js
function useFormControl(el) {
	return (0, vue_exports.computed)(() => (0, vue_exports.toValue)(el) ? Boolean(unrefElement(el)?.closest("form")) : true);
}

export { useFormControl as u };
//# sourceMappingURL=useFormControl-DR703Aa5.mjs.map
