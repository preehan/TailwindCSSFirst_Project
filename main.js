import './style.css';

// IMAGE SLIDER //
const slideBtns = document.querySelectorAll('[data-slideBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides = [...document.querySelectorAll('[data-slide]')];
let currentIndex = 0; 
let isMoving = false;

// btn handle function
function handleSlideBtnClick(e){
  if(isMoving) return;
  isMoving = true;
  e.currentTarget.id === "prev" 
    ? currentIndex--
    : currentIndex++;
  slideContainer.dispatchEvent(new Event("sliderMove"));
}

// remove/add attribute function
const removeDisabledAttribute = (els) => els.forEach(el =>el.removeAttribute('disabled'));
const addDisabledAttribute = (els) => els.forEach(el =>el.setAttribute('disabled', 'true'));

// event listeners
slideBtns.forEach(btn => btn.addEventListener('click', handleSlideBtnClick));

slideContainer.addEventListener('sliderMove', () =>{
  // 1. translate the container to the right/left
  slideContainer.style.transform = `translateX(-${currentIndex * slides[0].clientWidth}px)`;
  // 2. remove  disabled attributes
  removeDisabledAttribute(slideBtns);
  // 3. renable disabled attribute if needed 
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
})

// transition end event
slideContainer.addEventListener('transitionend', () => isMoving = false);

// disable image drag events
document.querySelectorAll('[data-slide] img').forEach(img => img.ondragstart = () => false);

// intersection observer for slider
const slideObserver = new IntersectionObserver((slide) => {
  if(slide[0].isIntersecting){
    addDisabledAttribute([slideBtns[1]]); 
  }
} , {threshold: .75});

slideObserver.observe(slides[slides.length - 1]);

// FORM HANDLE //
const contactForm = document.querySelector('#contact-form');
const contactBtn = document.querySelector('#contact-btn');
const contactInput = document.querySelector('#email');

// fake sending email to api endpoint
function postEmailToDatabase(email){
  console.info(`Your email is ${email}`);
  return new Promise(resolve => setTimeout(resolve, 2000));
}

// option for submit button
const contactBtnOptions = { 
  pending: `
  <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M140,32V64a12,12,0,0,1-24,0V32a12,12,0,0,1,24,0Zm84,84H192a12,12,0,0,0,0,24h32a12,12,0,0,0,0-24Zm-42.26,48.77a12,12,0,1,0-17,17l22.63,22.63a12,12,0,0,0,17-17ZM128,180a12,12,0,0,0-12,12v32a12,12,0,0,0,24,0V192A12,12,0,0,0,128,180ZM74.26,164.77,51.63,187.4a12,12,0,0,0,17,17l22.63-22.63a12,12,0,1,0-17-17ZM76,128a12,12,0,0,0-12-12H32a12,12,0,0,0,0,24H64A12,12,0,0,0,76,128ZM68.6,51.63a12,12,0,1,0-17,17L74.26,91.23a12,12,0,0,0,17-17Z"></path></svg>
    <span class="uppercase tracking-wide animate-pulse">
    Sending...
    </span>
  `,
  success: `
  <span class="uppercase tracking-wide">
  Thank you!
  </span>
  `,
}

async function handleFormSubmit(e){
  e.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]);
  contactBtn.innerHTML = contactBtnOptions.pending;
  const userEmail = contactInput.value;
  contactInput.style.display = 'none'; 
  await postEmailToDatabase(userEmail); 
  contactBtn.innerHTML = contactBtnOptions.success;
}

// event listener form submit
contactForm.addEventListener('submit', handleFormSubmit);

// FADE UP OBSERVER //
function fadeUpObserverCallback(elsToWatch){
  elsToWatch.forEach((el) => {
    if(el.isIntersecting){
      el.target.classList.add('faded');
      fadeUpObserver.unobserve(el.target);
      el.target.addEventListener("transitionend", () => {
        el.target.classList.remove('fade-up', 'faded');
      }, { once: true })
    }
  })
}

const fadeUpObserverOptions = {
  threshold: .6,
}

const fadeUpObserver = new IntersectionObserver(fadeUpObserverCallback, fadeUpObserverOptions)

document.querySelectorAll('.fade-up').forEach((item) => {
  fadeUpObserver.observe(item);
})

