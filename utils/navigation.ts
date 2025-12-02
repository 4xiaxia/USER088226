
/**
 * Navigation Utility (White Label / No-Install Version)
 * 
 * Core Philosophy:
 * 1. ZERO App Install Prompts: Never try to wake up the native App via Scheme (amap://), preventing annoying popups.
 * 2. Pure Web Experience: In browsers, strictly use Amap Web Mobile version.
 * 3. WeChat Friendly: In WeChat, guide users to the Mini Program (since external links are blocked).
 * 4. No Alipay Dependencies: Removed all Alipay-specific logic.
 */

export const getEnv = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('micromessenger')) return 'wechat';
    return 'other';
};

export const openNavigationApp = (lat: number, lng: number, name: string) => {
    const env = getEnv();
    const encodedName = encodeURIComponent(name);
    
    // Amap Web Navigation URL (Mobile Web Version)
    // Using strict 'lng,lat' format for destination.
    // hideRouteIcon=1 attempts to hide the "Open in App" button on the web page.
    const amapWeb = `https://m.amap.com/navi/?dest=${lng},${lat}&destName=${encodedName}&hideRouteIcon=1&key=c3fc05f6fa3ffe0a8e5c47409d6ae474`;

    if (env === 'wechat') {
        // WeChat environment: External links are blocked.
        // Solution: Guide user to search in the "Amap Mini Program".
        const text = `微信内无法直接导航。\n\n已为您复制景点名称「${name}」。\n请在微信“发现-小程序”中搜索“高德地图”，粘贴名称即可导航。`;
        
        // Attempt to copy the spot name to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
             navigator.clipboard.writeText(name)
                .then(() => alert(text))
                .catch(() => alert(text));
        } else {
             // Fallback if clipboard fails
             alert(`请在微信小程序搜索“高德地图”，输入「${name}」导航`);
        }
    } else {
        // External Browser: Direct to Amap Web Page.
        // We do NOT use 'amap://' scheme here to avoid "Open in App?" system dialogs.
        window.location.href = amapWeb;
    }
};
