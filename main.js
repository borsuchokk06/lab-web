const API_BASE = 'https://rickandmortyapi.com/api/character';
// Set your GitHub profile URL here
const AUTHOR_GITHUB = 'https://github.com/your-github';

/** App State */
let currentQuery = '';
let currentGender = 'all';
let currentPage = 1;
let hasMore = false;
let isLoading = false;

/** DOM */
const searchForm = document.getElementById('searchForm');
const genderSelect = document.getElementById('genderSelect');
const searchInput = document.getElementById('searchInput');
const clearInputBtn = document.getElementById('clearInputBtn');
const cardsContainer = document.getElementById('cardsContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');

function setBusy(busy) {
    const section = cardsContainer.parentElement;
    section.setAttribute('aria-busy', busy ? 'true' : 'false');
}

function buildQueryParams(page) {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (currentQuery.trim() !== '') params.set('name', currentQuery.trim());
    if (currentGender !== 'all') params.set('gender', currentGender);
    return params.toString();
}

async function fetchCharacters(page) {
    const query = buildQueryParams(page);
    const url = `${API_BASE}?${query}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
    }
    return res.json();
}

function createCard(character) {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
        <img class="card__image" src="${character.image}" alt="${character.name}">
        <div class="card__body">
            <h3 class="card__title">${character.name}</h3>
            <p class="card__meta">${character.species} • ${character.gender}</p>
        </div>
    `;
    return card;
}

function showEmpty(message) {
    const el = document.createElement('div');
    el.className = 'empty';
    el.textContent = message;
    cardsContainer.appendChild(el);
}

function showError(message) {
    const el = document.createElement('div');
    el.className = 'error';
    el.textContent = message;
    cardsContainer.appendChild(el);
}

function updateClearButtonVisibility() {
    clearInputBtn.style.display = searchInput.value ? 'inline-flex' : 'none';
}

function updateLoadMoreVisibility() {
    loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
    loadMoreBtn.disabled = !hasMore || isLoading;
}

async function loadPage(page, { append } = { append: false }) {
    if (isLoading) return;
    isLoading = true;
    setBusy(true);
    updateLoadMoreVisibility();
    try {
        const data = await fetchCharacters(page);
        const results = data.results || [];
        hasMore = Boolean(data.info && data.info.next);

        if (!append) {
            cardsContainer.innerHTML = '';
        }

        if (results.length === 0) {
            showEmpty('No characters found.');
        } else {
            for (const item of results) {
                cardsContainer.appendChild(createCard(item));
            }
        }
    } catch (err) {
        if (!append) cardsContainer.innerHTML = '';
        showError('Failed to load characters. Please try again.');
        hasMore = false;
        // eslint-disable-next-line no-console
        console.error(err);
    } finally {
        isLoading = false;
        setBusy(false);
        updateLoadMoreVisibility();
    }
}

function startNewSearch() {
    currentQuery = searchInput.value || '';
    currentPage = 1;
    hasMore = false;
    loadPage(currentPage, { append: false });
}

// Event wiring
document.addEventListener('DOMContentLoaded', () => {
    // Ensure focus on input at app start
    searchInput.focus();
    updateClearButtonVisibility();
    startNewSearch(); // initial load (first 20, all genders)

    // Footer setup
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    const authorLink = document.getElementById('authorLink');
    if (authorLink && AUTHOR_GITHUB) authorLink.href = AUTHOR_GITHUB;
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    startNewSearch();
});

genderSelect.addEventListener('change', () => {
    currentGender = genderSelect.value;
    startNewSearch();
});

searchInput.addEventListener('input', () => {
    updateClearButtonVisibility();
});

clearInputBtn.addEventListener('click', () => {
    searchInput.value = '';
    updateClearButtonVisibility();
    searchInput.focus();
});

loadMoreBtn.addEventListener('click', () => {
    if (isLoading || !hasMore) return;
    currentPage += 1;
    loadPage(currentPage, { append: true });
});


