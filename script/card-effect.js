let allImages = []; // 모든 이미지 데이터를 전역에 저장

// ✅ 카드 생성 함수
function createCard({ src, alt, caption, link, disabled }) {
  const card = document.createElement('div');
  card.className = 'card';
  if (disabled) card.classList.add('disabled');

  const contents = document.createElement('div');
  contents.className = 'card-contents';

  const anchor = document.createElement('a');
  anchor.href = link;
  anchor.className = 'card-link';
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';

  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner';

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;

  const glare = document.createElement('div');
  glare.className = 'glare';

  const captionEl = document.createElement('div');
  captionEl.className = 'caption';
  captionEl.innerHTML = caption.replace(/\n/g, '<br>');  // ✅ 줄바꿈 적용  

  cardInner.appendChild(img);
  cardInner.appendChild(glare);
  anchor.appendChild(cardInner);
  anchor.appendChild(captionEl);
  contents.appendChild(anchor);
  card.appendChild(contents);

  return card;
}

// ✅ 카드 렌더링 함수
function renderCards(imageDataList) {
  const grid = document.querySelector('.grid');
  grid.innerHTML = ''; // 기존 카드 제거

  imageDataList.forEach(data => {
    const card = createCard(data);
    grid.appendChild(card);
  });
}

// ✅ 3D Tilt + Glare + 효과 제거 처리
function setupInteractions() {
  document.querySelectorAll('.card').forEach((cardWrapper) => {
    const cardInner = cardWrapper.querySelector('.card-inner');
    const glare = cardWrapper.querySelector('.glare');

    if (!cardInner || cardWrapper.classList.contains('disabled')) return;

    cardWrapper.addEventListener('mousemove', (e) => {
      const rect = cardWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -(y - centerY) / 5;
      const rotateY = (x - centerX) / 5;
      cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.3), transparent 60%)`;
    });

    cardWrapper.addEventListener('mouseleave', () => {
      cardInner.style.transform = 'rotateX(0deg) rotateY(0deg)';
      glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0), transparent 60%)`;
    });
  });
}

// ✅ 검색 기능
function setupSearch() {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const keyword = input.value.toLowerCase();

    const filtered = allImages.filter(({ alt, caption }) =>
      (alt?.toLowerCase() || '').includes(keyword) ||
      (caption?.toLowerCase() || '').includes(keyword)
    );

    renderCards(filtered);      // 다시 그리기
    setupInteractions();        // 효과 재설정
  });
}

// ✅ 연도 자동 출력
function setYear() {
  const yearSpan = document.getElementById('footer-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ✅ 최초 실행
fetch('data/images.json')
  .then(res => {
    if (!res.ok) throw new Error('이미지 JSON 불러오기 실패');
    return res.json();
  })
  .then(images => {
    allImages = images;
    renderCards(allImages);
    setupInteractions();
    setupSearch();
    setYear();
  })
  .catch(err => {
    console.error('❌ 오류 발생:', err);
  });
