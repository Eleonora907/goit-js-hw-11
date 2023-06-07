import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '37050387-e4c3f855052e73f889b68f3e3';
  static perPage = 40;

  constructor() {
    this.page = 1;
    this.query = '';
  }

  fetchPhotosByQuery = async () => {
    const { page, query } = this;
    const searchParams = new URLSearchParams({
      key: PixabayAPI.API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: PixabayAPI.perPage,
      page,
    });

    try {
      const response = await axios.get(`${PixabayAPI.BASE_URL}?${searchParams}`);
      return response.data;
    } catch (error) {
      console.log('Error:', error);
      Notiflix.Notify.failure(`Something went wrong: ${error.message}`);
    }
  };
}
