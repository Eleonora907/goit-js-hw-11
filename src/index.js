import { PixabayAPI } from './pixabay-api';
import { createGalleryCards } from './gallery-cards';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const observerdEl = document.querySelector('.observerd-element');

const pixabayAPI = new PixabayAPI();
const lightbox = new SimpleLightbox('.gallery a');

const handleSearchSubmit = async event => {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  pixabayAPI.page = 1;
  pixabayAPI.query = searchQuery;

  try {
    const data = await pixabayAPI.fetchPhotosByQuery();

    if (data.totalHits === 0) {
      galleryListEl.innerHTML = '';
      return Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      
    }

    if (data.total_pages !== 1) {
      setTimeout(() => {
        galleryObserver.observe(observerdEl);
      }, 1000);
    }

    else galleryListEl.innerHTML = createGalleryCards(data.hits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(`Something went wrong: ${error.message}`);
  }
};

const galleryObserver = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting) {
      pixabayAPI.page += 1;

      pixabayAPI
        .fetchPhotosByQuery()
        .then(data => {
          galleryListEl.insertAdjacentHTML(
            'beforeend',
            createGalleryCards(data.hits)
          );

          if (pixabayAPI.page === data.totalPages) {
            observer.unobserve(observerdEl);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  {
    root: null,
    rootMargin: '0px 0px 400px 0px',
    threshold: 0.5,
  }
);


searchFormEl.addEventListener('submit', handleSearchSubmit);

