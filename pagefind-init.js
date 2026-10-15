/* Add Pagefind's search UI after mdBook renders each page. */
(() => {
    const currentScript = document.currentScript;
    const main = document.querySelector("main");
    const toolbar = document.querySelector("#mdbook-menu-bar .left-buttons");
    if (!currentScript || !main || !toolbar || /(?:^|\/)(?:print|404|toc)\.html$/.test(location.pathname)) {
        return;
    }

    const scriptUrl = new URL(currentScript.src, location.href);
    const siteBase = new URL("./", scriptUrl);
    const pagefindBase = new URL("pagefind/", siteBase);
    const waitForIndex = async () => {
        for (let attempt = 0; attempt < 40; attempt += 1) {
            const response = await fetch(new URL("pagefind-entry.json", pagefindBase));
            if (response.ok) {
                return true;
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        return false;
    };

    waitForIndex()
        .then((indexAvailable) => {
            if (!indexAvailable || toolbar.querySelector("pagefind-modal-trigger")) {
                return;
            }

            main.setAttribute("data-pagefind-body", "");

            const config = document.createElement("pagefind-config");
            config.setAttribute("base-url", siteBase.pathname);
            const modal = document.createElement("pagefind-modal");
            const trigger = document.createElement("pagefind-modal-trigger");
            trigger.setAttribute("compact", "");
            trigger.setAttribute("hide-shortcut", "");
            trigger.setAttribute("shortcut", "/");
            trigger.setAttribute("placeholder", "全文検索");
            trigger.setAttribute("aria-label", "全文検索");
            trigger.setAttribute("title", "全文検索");
            toolbar.append(trigger);
            document.body.append(config, modal);

            const stylesheet = document.createElement("link");
            stylesheet.rel = "stylesheet";
            stylesheet.href = new URL("pagefind-component-ui.css", pagefindBase).href;
            document.head.append(stylesheet);

            const darkThemes = ["ayu", "coal", "navy"];
            const root = document.documentElement;
            const syncTheme = () => {
                if (darkThemes.some((theme) => root.classList.contains(theme))) {
                    root.setAttribute("data-pf-theme", "dark");
                } else {
                    root.removeAttribute("data-pf-theme");
                }
            };
            syncTheme();
            new MutationObserver(syncTheme).observe(root, { attributes: true, attributeFilter: ["class"] });

            const component = document.createElement("script");
            component.type = "module";
            component.src = new URL("pagefind-component-ui.js", pagefindBase).href;
            document.head.append(component);
        })
        .catch((error) => console.error("Could not initialize Pagefind search", error));
})();
