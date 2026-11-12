const menu = document.querySelector('#mega');
const toggles = [document.querySelector('#menu-toggle'), document.querySelector('#mobile-toggle')];
function setMenu(open) {
  menu.hidden = !open;
  toggles.forEach(button => button.setAttribute('aria-expanded', String(open)));
}
 toggles.forEach(button => button.addEventListener('click', () => setMenu(menu.hidden)));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => { if (!event.target.closest('header')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
document.querySelector('#year').textContent = new Date().getFullYear();
const dialog = document.querySelector('#dialog');
const content = document.querySelector('#dialog-content');
document.querySelector('.close').addEventListener('click', () => dialog.close());
function showDialog() { setMenu(false); if (!dialog.open) dialog.showModal(); }
function createInvite() {
  content.innerHTML = '<p class="eyebrow">TRY THE INVITE DEMO</p><h2>MAKE IT HAPPEN.</h2><p>Start with a plan. Get a link to send to your friends.</p><form id="create-form"><label>What’s the plan?<input name="title" required maxlength="100" placeholder="Friday dinner with the crew"></label><label>When?<input name="date" type="datetime-local" required></label><label>Where?<input name="place" required maxlength="150" placeholder="Your favourite spot"></label><button class="button" type="submit">Create invite link ↗</button></form><small>Demo only. Details are stored in the link and readable by anyone you share it with. Accounts and saved RSVPs are coming later.</small>';
  showDialog();
  document.querySelector('#create-form').addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const url = new URL(location.href);
    url.hash = '';
    url.search = '';
    url.searchParams.set('invite', JSON.stringify(data));
    content.innerHTML = '<p class="eyebrow">THE PLAN IS ON</p><h2>PASS IT ON.</h2><p>Your demo invite is ready. Send the link to your crew.</p><label>Invite link<input id="share-url" readonly></label><button class="button" id="copy-link">Copy invite link ↗</button><small>This demo link includes your event details. Share it with people you want to invite.</small>';
    document.querySelector('#share-url').value = url.href;
    document.querySelector('#copy-link').addEventListener('click', async event => {
      try { await navigator.clipboard.writeText(url.href); event.target.textContent = 'Copied ✓'; }
      catch { document.querySelector('#share-url').select(); event.target.textContent = 'Select and copy the link above'; }
    });
  });
}
document.querySelectorAll('[data-create]').forEach(button => button.addEventListener('click', createInvite));
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
  content.innerHTML = '<p class="eyebrow">A LITTLE MORE TOGETHER</p><h2 id="plan-name"></h2><p>We’re shaping our paid plans. Prices and features are proposals. Subscriptions aren’t available yet. Try the free invite demo in the meantime.</p><button class="button" id="try-demo">Try a free invite ↗</button>';
  document.querySelector('#plan-name').textContent = button.dataset.plan;
  document.querySelector('#try-demo').addEventListener('click', createInvite);
  showDialog();
}));
const rawInvite = new URL(location.href).searchParams.get('invite');
if (rawInvite) {
  try {
    const invite = JSON.parse(rawInvite);
    if (typeof invite.title !== 'string' || typeof invite.place !== 'string' || typeof invite.date !== 'string' || !Number.isFinite(new Date(invite.date).getTime())) throw new Error('Invalid invite');
    content.innerHTML = '<p class="eyebrow">YOU’RE INVITED</p><h2 id="event-title"></h2><p id="event-date"></p><p id="event-place"></p><p>This is a demo invite. Google and email sign-in, saved RSVPs, and guest lists will be available when the full app launches.</p><button class="button" id="new-invite">Make your own invite ↗</button>';
    document.querySelector('#event-title').textContent = invite.title.slice(0, 100);
    document.querySelector('#event-place').textContent = invite.place.slice(0, 150);
    document.querySelector('#event-date').textContent = new Date(invite.date).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' });
    document.querySelector('#new-invite').addEventListener('click', createInvite);
    showDialog();
  } catch {
    content.innerHTML = '<h2>LINK LOST ITS WAY.</h2><p>This invite link is incomplete. Ask your friend to send it again.</p>';
    showDialog();
  }
}
