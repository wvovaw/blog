function toggleMenu() {
  document.querySelector('.nav').classList.toggle('expanded');
  document.querySelector('.hamburger').classList.toggle('hidden');
  document.querySelector('.cross').classList.toggle('hidden');
  document.querySelector('html').classList.toggle('prevent-scroll');
}

// open menu button
document.querySelector('.hamburger').addEventListener('click', toggleMenu);

// close menu button
document.querySelector('.cross').addEventListener('click', toggleMenu);
