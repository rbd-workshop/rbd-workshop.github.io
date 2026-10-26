const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 651px)').addEventListener('change', closeMenu);

const capabilities = {
  tools: { index: '01', title: 'Tools that act.', description: 'Find the right API for the next step.', point: '395 90' },
  skills: { index: '02', title: 'Skills that transfer.', description: 'Retrieve a reusable procedure for a new goal.', point: '105 90' },
  workflows: { index: '03', title: 'Workflows that connect.', description: 'Compose a sequence of compatible actions.', point: '430 210' },
  memories: { index: '04', title: 'Memories that matter.', description: 'Recall the experience a task needs now.', point: '70 210' },
  models: { index: '05', title: 'Models that fit.', description: 'Route to the right strengths and constraints.', point: '105 330' },
  agents: { index: '06', title: 'Agents that collaborate.', description: 'Select a specialist for the task at hand.', point: '395 330' }
};
document.querySelectorAll('[data-capability]').forEach(button => {
  button.addEventListener('click', () => {
    const item = capabilities[button.dataset.capability];
    document.querySelectorAll('[data-capability]').forEach(node => {
      const active = node === button;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    document.querySelector('#capability-title').textContent = item.title;
    document.querySelector('#capability-description').textContent = item.description;
    document.querySelector('.caption-index').textContent = `${item.index} / 06`;
    document.querySelector('.active-route').setAttribute('d', `M250 210L${item.point}`);
  });
});

const navLinks = [...nav.querySelectorAll('a')];
const sections = navLinks.map(link => document.querySelector(link.hash));
let scrollUpdatePending = false;
function updateActiveSection() {
  const marker = document.querySelector('.site-header').offsetHeight + 80;
  let active = null;
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) active = section.id;
  }
  if (document.querySelector('#contact').getBoundingClientRect().top <= marker) active = null;
  navLinks.forEach(link => {
    if (link.hash === `#${active}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollUpdatePending = false;
}
function scheduleSectionUpdate() {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  requestAnimationFrame(updateActiveSection);
}
addEventListener('scroll', scheduleSectionUpdate, { passive: true });
addEventListener('resize', scheduleSectionUpdate);
updateActiveSection();
