// Navigation stays visible at every screen size, including without JavaScript.
const navLinks = [...document.querySelectorAll('#main-nav a')];
const sections = navLinks.map(link => document.querySelector(link.hash)).filter(Boolean);
let scheduled = false;

function updateActiveSection() {
  const header = document.querySelector('.site-header');
  const sticky = getComputedStyle(header).position === 'sticky';
  const marker = (sticky ? header.offsetHeight : 0) + 90;
  const candidates = sections
    .map(section => ({ id: section.id, top: section.getBoundingClientRect().top }))
    .filter(section => section.top <= marker)
    .sort((a, b) => b.top - a.top);
  let active = candidates[0]?.id || 'about';
  if (document.querySelector('#contact').getBoundingClientRect().top <= marker) active = null;
  // The dates sidebar shares a row with the overview; an explicit anchor takes precedence.
  if (location.hash === '#dates' && Math.abs(document.querySelector('#dates').getBoundingClientRect().top - marker) < 130) active = 'dates';
  navLinks.forEach(link => {
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
function scheduleUpdate() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(updateActiveSection);
}
addEventListener('scroll', scheduleUpdate, { passive: true });
addEventListener('resize', scheduleUpdate);
addEventListener('hashchange', scheduleUpdate);
updateActiveSection();
