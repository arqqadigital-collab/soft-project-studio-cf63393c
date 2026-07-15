
(globalThis as any).localStorage = { getItem:()=>null, setItem:()=>{}, removeItem:()=>{}, key:()=>null, length:0, clear:()=>{} };
import Comp, { __TOP } from "./LIS";
try { Comp(); } catch (e) {}
export const __EXTRACTED = { ...__TOP, ...((globalThis as any).__PAGE_LOCALS_LIS || {}) };
