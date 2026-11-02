(() => {
  'use strict';
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
  });
  document.querySelector('#year').textContent = String(new Date().getFullYear());

  const rooms = {
    living: { label:'LIVING SPACES', title:'Clear a path for everyday life.', description:'The routes you walk most often deserve a little extra attention.', tips:['Keep walking paths clear of furniture, cords, and clutter.','Remove loose rugs or secure them so they cannot slip.','Make sure rooms and hallways are well lit.'] },
    bedroom: { label:'BEDROOM', title:'Make the nighttime path easier.', description:'Think about the journey from your bed to the bathroom, especially after dark.', tips:['Keep a lamp within easy reach of the bed.','Use a nightlight along the route to the bathroom.','Keep the floor clear of shoes, clothing, and loose cords.'] },
    bathroom: { label:'BATHROOM', title:'A little support in the right place.', description:'Wet surfaces and everyday routines can make this room worth a closer look.', tips:['Use a non-slip mat or self-stick strips inside the tub or shower.','Discuss properly installed grab bars near the toilet and tub.','Keep the route to and through the bathroom clear.'] },
    steps: { label:'STEPS & ENTRY', title:'A welcoming, clearer way in.', description:'Look at the steps you take when you leave, return, or move between floors.', tips:['Keep steps clear of shoes, papers, and other objects.','Have loose or uneven steps repaired.','Check that stairs have secure handrails and good lighting.'] }
  };
  const tabs = Array.from(document.querySelectorAll('[data-room]'));
  function selectRoom(tab) {
    const room = rooms[tab.dataset.room];
    tabs.forEach(button => {
      const selected = button === tab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.querySelector('#room-panel').setAttribute('aria-labelledby', tab.id);
    document.querySelector('.room-label').textContent = room.label;
    document.querySelector('#room-title').textContent = room.title;
    document.querySelector('#room-description').textContent = room.description;
    document.querySelector('#room-tips').replaceChildren(...room.tips.map(tip => {
      const li = document.createElement('li'); li.textContent = tip; return li;
    }));
    document.querySelectorAll('.drawing-area').forEach(area => {
      const active = area.dataset.area === tab.dataset.room;
      area.style.fill = active ? '#dde6cf' : '#f2f1e6';
      area.style.stroke = active ? '#345943' : '#8c9c82';
    });
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => selectRoom(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = tabs[(index+1)%tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(index+tabs.length-1)%tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length-1];
      if (target) {event.preventDefault(); selectRoom(target); target.focus();}
    });
  });

  let guide = '';
  document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => {
    document.querySelector('#interest').value = link.dataset.interest;
  }));
  document.querySelector('#guide-form').addEventListener('submit', event => {
    event.preventDefault();
    const support = document.querySelector('#support-for').value;
    const interest = document.querySelector('#interest').value;
    const county = document.querySelector('#county').value;
    const assessment = interest === 'Home safety assessment';
    guide = [
      'MY CONVERSATION GUIDE', 'In Home Aging Solutions, PLLC', '',
      'Hello Robin and Bonney,', '',
      'I am exploring support for: ' + support.toLowerCase() + '.',
      'I would like to discuss: ' + interest.toLowerCase() + '.',
      'Location: ' + county + '.', '',
      'Questions I would like to ask:',
      '• Is this a good fit for my needs?',
      '• What availability do you have?',
      assessment ? '• Can we review the $295 assessment and its included follow-up?' : '• What support may be available, and what would it cost?',
      '• Would there be any additional costs or mileage?', '',
      'I would like to discuss a complimentary 30-minute introductory phone conversation.', '',
      'This note has not been sent. It is not an appointment confirmation.'
    ].join('\n');
    document.querySelector('#guide-text').textContent = guide;
    document.querySelector('#guide-result').hidden = false;
    document.querySelector('#copy-status').textContent = '';
    document.querySelector('#guide-result').focus({preventScroll:true});
    document.querySelector('#guide-result').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'nearest'});
  });
  document.querySelector('#copy-guide').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(guide); status.textContent = 'Copied. Your note is ready to share.'; }
    catch { status.textContent = 'Copy is unavailable here. Use Download note to save your guide.'; }
  });
  document.querySelector('#download-guide').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([guide], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href=url; link.download='In-Home-Conversation-Guide.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    document.querySelector('#copy-status').textContent = 'Your conversation guide is ready to save.';
  });
  const privacy = document.querySelector('#privacy-dialog');
  document.querySelector('#privacy-open').addEventListener('click', () => privacy.showModal());
  document.querySelector('#privacy-close').addEventListener('click', () => privacy.close());
  privacy.addEventListener('click', event => { if (event.target === privacy) { const bounds=privacy.getBoundingClientRect(); if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)privacy.close(); } });
})();
