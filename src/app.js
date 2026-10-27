// Every page and navigation link works without JavaScript.
const header = document.querySelector('.site-header');
function updateAnchorOffset() {
  const sticky = getComputedStyle(header).position === 'sticky';
  const offset = `${sticky ? header.offsetHeight + 28 : 20}px`;
  if (document.documentElement.style.getPropertyValue('--anchor-offset') !== offset) {
    document.documentElement.style.setProperty('--anchor-offset', offset);
  }
}
addEventListener('resize', updateAnchorOffset);
if ('ResizeObserver' in window) new ResizeObserver(updateAnchorOffset).observe(header);
updateAnchorOffset();

// Fragments are not sent to the server. Forward old section bookmarks here;
// matching visible fallback links support visitors with JavaScript disabled.
const routeData = document.querySelector('#legacy-routes');
if (routeData) {
  const routes = JSON.parse(routeData.textContent);
  function forwardLegacyLink() {
    const fragment = location.hash.slice(1);
    if (!Object.hasOwn(routes, fragment)) return;
    const route = routes[fragment];
    const destination = new URL(route, new URL('.', location.href));
    destination.search = location.search;
    location.replace(destination.href);
  }
  addEventListener('hashchange', forwardLegacyLink);
  forwardLegacyLink();
}
