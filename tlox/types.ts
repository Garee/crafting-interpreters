import Callable from "./callables/callable";
import Instance from "./instance";

export type LoxValue = string | number | boolean | Callable | Instance | null;
