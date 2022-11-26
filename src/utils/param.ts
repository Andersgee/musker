export type Param = string | string[] | undefined;

/**
 * grab param[0] if its an array, else just param or undefined
 * */
export function stringFromParam(param: Param) {
  return typeof param === "string" ? param : param?.[0];
}
