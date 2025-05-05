document.getElementById('saveTabs').addEventListener('click', async () => {
  const groupName = document.getElementById('groupName').value.trim();
  if (!groupName) return;

  chrome.tabs.query({}, async (tabs) => {
    const urls = tabs.map(tab => tab.url);
    await fetch('http://localhost:3000/save-group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupName, urls })
    });
    document.getElementById('groupName').value = '';
    loadGroups();
  });
});

async function loadGroups() {
  const res = await fetch('http://localhost:3000/groups');
  const groups = await res.json();
  const container = document.getElementById('groups');
  container.innerHTML = '';

  for (const name in groups) {
    const div = document.createElement('div');
    div.className = "flex justify-between items-center border rounded p-2 mb-2";

    const span = document.createElement('span');
    span.textContent = name;
    span.className = "font-medium";

    const actions = document.createElement('div');

    const openBtn = document.createElement('button');
    openBtn.textContent = "Open";
    openBtn.className = "text-blue-600 hover:underline";
    openBtn.addEventListener('click', () => openGroup(name));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "text-red-600 hover:underline ml-2";
    deleteBtn.addEventListener('click', () => deleteGroup(name));

    actions.appendChild(openBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(span);
    div.appendChild(actions);
    container.appendChild(div);
  }
}

async function openGroup(name) {
  const res = await fetch('http://localhost:3000/groups');
  const groups = await res.json();
  const urls = groups[name] || [];
  urls.forEach(url => chrome.tabs.create({ url }));
}

async function deleteGroup(name) {
  await fetch(`http://localhost:3000/groups/${name}`, { method: 'DELETE' });
  loadGroups();
}

loadGroups();
