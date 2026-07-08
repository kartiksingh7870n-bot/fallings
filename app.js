const profiles = [
  {
    id: 1,
    name: 'Ananya',
    age: 27,
    location: 'दिल्ली',
    gender: 'female',
    bio: 'मैं संगीत, यात्रा और कोडींग के शौकीन हूँ। आइए एक नई कहानी बनाएं।',
    interests: ['music', 'travel', 'books'],
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Rohan',
    age: 30,
    location: 'मुंबई',
    gender: 'male',
    bio: 'फूड, फिटनेस और फील्म नाइट के लिए तैयार हूं। सबसे अच्छे दोस्त की तलाश है।',
    interests: ['food', 'fitness', 'movies'],
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Mira',
    age: 25,
    location: 'बेंगलुरु',
    gender: 'female',
    bio: 'किताबें और कैफे मेरी दुनिया हैं। चलो एक नई एडवेंचर योजना बनाएं।',
    interests: ['books', 'coffee', 'travel'],
    photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'Karan',
    age: 29,
    location: 'पुणे',
    gender: 'male',
    bio: 'टेक स्टार्टअप्स, ट्रेकिंग और गिटार। एक ईमानदार साथी चाहता हूं।',
    interests: ['travel', 'music', 'fitness'],
    photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Nisha',
    age: 28,
    location: 'कोलकाता',
    gender: 'female',
    bio: 'खाना बनाना और फ़िल्में देखना पसंद है। नए दोस्त ढूंढ़ रही हूँ।',
    interests: ['food', 'movies', 'books'],
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
];

const state = {
  filteredProfiles: [...profiles],
  currentIndex: 0,
  matches: [],
  selectedMatch: null,
};

const elements = {
  profileCard: document.getElementById('profile-card'),
  profilePhoto: document.getElementById('profile-photo'),
  profileName: document.getElementById('profile-name'),
  profileAgeLocation: document.getElementById('profile-age-location'),
  profileBio: document.getElementById('profile-bio'),
  profileTags: document.getElementById('profile-tags'),
  statusMessage: document.getElementById('status-message'),
  progress: document.getElementById('progress'),
  matchesList: document.getElementById('matches-list'),
  chatThread: document.getElementById('chat-thread'),
  genderFilter: document.getElementById('gender-filter'),
  interestFilter: document.getElementById('interest-filter'),
  resetBtn: document.getElementById('reset-btn'),
  likeBtn: document.getElementById('like-btn'),
  dislikeBtn: document.getElementById('dislike-btn'),
};

function renderProfile() {
  const profile = state.filteredProfiles[state.currentIndex];

  if (!profile) {
    elements.profilePhoto.style.backgroundImage = 'none';
    elements.profileName.textContent = 'कोई और प्रोफाइल नहीं';
    elements.profileAgeLocation.textContent = '';
    elements.profileBio.textContent = 'फ़िल्टर बदलें या रीसेट करें ताकि नए संभावित मिलान दिखें।';
    elements.profileTags.innerHTML = '';
    elements.statusMessage.textContent = 'कोई और प्रोफाइल उपलब्ध नहीं।';
    updateProgress();
    return;
  }

  elements.profilePhoto.style.backgroundImage = `url('${profile.photo}')`;
  elements.profileName.textContent = profile.name;
  elements.profileAgeLocation.textContent = `${profile.age} साल · ${profile.location}`;
  elements.profileBio.textContent = profile.bio;
  elements.profileTags.innerHTML = profile.interests
    .map((interest) => `<span class="tag">${interest}</span>`)
    .join('');
  elements.statusMessage.textContent = 'इस व्यक्ति को लाइक या डिसलाइक करें।';
  updateProgress();
}

function updateProgress() {
  const total = state.filteredProfiles.length;
  const gone = Math.min(state.currentIndex, total);
  const progressPercent = total === 0 ? 0 : Math.round((gone / total) * 100);

  if (!elements.progress.querySelector('.progress-fill')) {
    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    elements.progress.appendChild(fill);
  }

  const fill = elements.progress.querySelector('.progress-fill');
  fill.style.width = `${progressPercent}%`;
}

function showMessage(message) {
  elements.statusMessage.textContent = message;
}

function nextProfile() {
  state.currentIndex += 1;
  renderProfile();
}

function addMatch(profile) {
  if (state.matches.some((match) => match.id === profile.id)) {
    return;
  }
  state.matches.push(profile);
  renderMatches();
}

function renderMatches() {
  if (state.matches.length === 0) {
    elements.matchesList.innerHTML = '<p class="empty-state">यहाँ मैचेज़ दिखाई देंगी।</p>';
    elements.chatThread.innerHTML = '<p class="empty-state">मैच पर क्लिक करें और बातचीत देखें।</p>';
    return;
  }

  elements.matchesList.innerHTML = state.matches
    .map(
      (match) => `
      <button class="match-card" data-id="${match.id}">
        <strong>${match.name}</strong>
        <span>${match.location} · ${match.age}</span>
      </button>
    `
    )
    .join('');

  document.querySelectorAll('.match-card').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedId = Number(button.dataset.id);
      selectMatch(selectedId);
    });
  });
}

function selectMatch(id) {
  state.selectedMatch = state.matches.find((match) => match.id === id);
  if (!state.selectedMatch) return;
  const messages = [
    '👋 नमस्ते! आपकी प्रोफाइल बहुत बढ़िया है।',
    'आपकी पसंदीदा फिल्म क्या है?',
    'चलो जल्द ही मिलते हैं।',
  ];

  elements.chatThread.innerHTML = `
    <div class="chat-card">
      <strong>${state.selectedMatch.name}</strong>
      <p>${messages.join('<br>')}</p>
      <small>मैच हुआ: ${new Date().toLocaleDateString('hi-IN')}</small>
    </div>
  `;
}

function applyFilters() {
  const gender = elements.genderFilter.value;
  const interest = elements.interestFilter.value;

  state.filteredProfiles = profiles.filter((profile) => {
    const genderMatches = gender === 'any' || profile.gender === gender;
    const interestMatches =
      interest === 'any' || profile.interests.includes(interest);
    return genderMatches && interestMatches;
  });

  state.currentIndex = 0;
  if (state.filteredProfiles.length === 0) {
    showMessage('कोई प्रोफ़ाइल नहीं मिली। फ़िल्टर बदलें।');
  }
  renderProfile();
}

function resetFilters() {
  elements.genderFilter.value = 'any';
  elements.interestFilter.value = 'any';
  state.filteredProfiles = [...profiles];
  state.currentIndex = 0;
  renderProfile();
}

elements.likeBtn.addEventListener('click', () => {
  const profile = state.filteredProfiles[state.currentIndex];
  if (!profile) return;
  addMatch(profile);
  showMessage(`आपने ${profile.name} को लाइक किया!`);
  nextProfile();
});

elements.dislikeBtn.addEventListener('click', () => {
  const profile = state.filteredProfiles[state.currentIndex];
  if (!profile) return;
  showMessage(`ठीक है, ${profile.name} को छोड़ दिया गया।`);
  nextProfile();
});

elements.genderFilter.addEventListener('change', applyFilters);
elements.interestFilter.addEventListener('change', applyFilters);
elements.resetBtn.addEventListener('click', resetFilters);

renderProfile();
renderMatches();
