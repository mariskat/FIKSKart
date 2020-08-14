import { writable } from "svelte/store";

export const isLoggedIn = writable(false);
export const user = writable(undefined);
export const role = writable(sessionStorage.getItem("role") || undefined);
role.subscribe((val) => sessionStorage.setItem("role", val));

export const isMapDisabled = writable(true);
export const isSummaryDisabled = writable(true);
export const isFeedbackPageDisabled = writable(true);


export const comment = writable("");
export const polygons = writable([]);
export const storeCategory = writable(null);
export const addressToFirebase = writable(null);

//Case ID for case handlers
export const CID = writable(sessionStorage.getItem("caseID") || "");
CID.subscribe((val) => sessionStorage.setItem("caseID", val));