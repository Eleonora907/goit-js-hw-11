export const createGalleryCards = imagesInfo => {
  const imagesArr = imagesInfo.map(imgInfo => {
    return `
      <a href="${imgInfo.largeImageURL}">
        <div class="photo-card">
          <img src="${imgInfo.webformatURL}" alt="${imgInfo.tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${imgInfo.likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${imgInfo.views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${imgInfo.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${imgInfo.downloads}
            </p>
          </div>
        </div>
      </a>
    `;
  });

  return imagesArr.join('');
};
  