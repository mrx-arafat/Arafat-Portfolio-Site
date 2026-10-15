/** Run in the head before body parsing, covering first visits while the home route streams. */
export const BOOT_SESSION_SCRIPT = '{let booted=location.pathname==="/"&&new URLSearchParams(location.search).get("boot")==="1";try{booted=booted||sessionStorage.getItem("arafat-booted")==="1"}catch(e){}if(booted)document.documentElement.setAttribute("data-booted","");else if(location.pathname==="/"){document.documentElement.setAttribute("data-boot-pending","");if(typeof setTimeout==="function")setTimeout(function(){document.documentElement.removeAttribute("data-boot-pending")},5000)}}';

/** The open server-rendered dialog sits above this cover; remembered visits hide it before paint. */
export const BOOT_FIRST_PAINT_CSS = 'html[data-boot-pending]{overflow:hidden}html[data-boot-pending]::before{content:"";position:fixed;inset:0;z-index:2147483646;background:#0F1116}html[data-booted] .oc-boot{display:none}';
