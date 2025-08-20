// utils/copy.js (예: 공용 유틸로 분리)
export function copyToClipboard(text) {
    const isSecure =
        window.isSecureContext ||
        location.protocol === "https:" ||
        location.hostname === "localhost";

    // 1) 보안 컨텍스트 + 지원 브라우저: 네이티브 Clipboard API
    if (isSecure && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }

    // 2) 폴백: 임시 textarea + execCommand('copy')
    return new Promise((resolve, reject) => {
        try {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.top = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            ta.setSelectionRange(0, ta.value.length);

            const ok = document.execCommand("copy");
            document.body.removeChild(ta);
            ok ? resolve() : reject(new Error("execCommand copy failed"));
        } catch (e) {
            reject(e);
        }
    });
}
