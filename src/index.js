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

const handleSearchSuccess = data => {
  if (data.totalHits === 0) {
    galleryListEl.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  if (data.totalHits > PixabayAPI.perPage) {
    galleryObserver.observe(observerdEl);
  }

  galleryListEl.innerHTML = createGalleryCards(data.hits);
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  lightbox.refresh();
};

const handleSearchSubmit = async event => {
  event.preventDefault();

  pixabayAPI.page = 1;
  pixabayAPI.query = event.target.elements.searchQuery.value.trim();

  try {
    const data = await pixabayAPI.fetchPhotosByQuery();
    handleSearchSuccess(data);
  } catch (err) {
    console.log('Error:', error);
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
          galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));

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
    rootMargin: '0px',
    threshold: 0.5,
  }
);


searchFormEl.addEventListener('submit', handleSearchSubmit);


