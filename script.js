'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const navContainer = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// -----------------------
// -- LEARN MORE BUTTON --
// -----------------------

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// ---------------------
// -- PAGE NAVIGATION --
// ---------------------

// using event delegation
// 1. add event listener to common parent element
// 2. determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // need this to prevent jumping to the link (from href in html)
  e.preventDefault();
  // MATCHING STRATEGY (handles clicks between links)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// -----------------------
// -- TABBED OPERATIONS --
// -----------------------

// tabs.forEach((t) => t.addEventListener('click', () => console.log('Tab')));

// event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // ignore any clicks where target is null
  // Guard clause
  // if clicked is null, it doesnt do anything
  if (!clicked) return;

  // remove all active tabs
  tabs.forEach((t) => t.classList.remove('operations__tab--active'));

  // set clicked tab to active
  clicked.classList.add('operations__tab--active');

  // set all other tabs to not active
  // [...this.children].forEach(function (t) {
  //   if (t !== clicked) t.classList.remove('operations__tab--active');
  // });

  // set operations__content active
  tabsContent.forEach((c) => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// --------------------------
// -- Menu Fade Animations --
// --------------------------

const handleHover = function (e /*, opacity */) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//mouseenter does not bubble, mouseover does
// Passing "argument" into handler
navContainer.addEventListener('mouseover', handleHover.bind(0.5));
navContainer.addEventListener('mouseout', handleHover.bind(1));

// -----------------------
// -- Sticky Navigation --
// -----------------------

// Intersection Observer API

const header = document.querySelector('.header');
const navHeight = navContainer.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  entry.isIntersecting === false
    ? navContainer.classList.add('sticky')
    : navContainer.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// ---------------------
// -- Reveal Sections --
// ---------------------
const allSections = document.querySelectorAll('section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// ----------------------
// -- IMG Lazy Loading --
// ----------------------
// const featureImgs = document.querySelectorAll('.features__img');
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // guard clause
  if (!entry.isIntersecting) return;

  // replace src attribute with data-src
  const newImg = entry.target.dataset.src;
  entry.target.src = newImg;

  // this makes it so the blur effect isnt removed until the image fully load
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // after scrolling past the imgs, no reason to observe them
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach((img) => imgObserver.observe(img));

// --------------
// --- Slider ---
// --------------

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach((dot) => dot.classList.remove('dots__dot--active'));

    const curDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);

    curDot.classList.add('dots__dot--active');
  };

  // go to slide
  const goToSlide = function (slide = 0) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );

    activeDot(slide);
  };

  // go to next slide
  const nextSlide = () => {
    curSlide === maxSlide ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
  };

  const prevSlide = () => {
    curSlide === 0 ? (curSlide = maxSlide) : curSlide--;
    goToSlide(curSlide);
  };

  // init
  const init = function () {
    createDots();
    goToSlide();
  };
  init();
  // event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); // short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    const { slide } = e.target.dataset;
    curSlide = slide;
    goToSlide(slide);
  });
};
slider();
