document.addEventListener("DOMContentLoaded", (event) => {
    const moreBtn = document.querySelector('.text-show-button');
    const moreText = document.querySelector('.text-show-button__content');
    const clickOutTextShow = (evt) => {
        if (!evt.target.closest('.text-show-button__content') && !evt.target.classList.contains('text-show-button__content')) {
            moreText.removeAttribute('data-open');
            document.removeEventListener('click', clickOutTextShow);
        }
    };
    if (moreBtn && moreText) {
        moreBtn.addEventListener('click', (evt) => {
            evt.stopImmediatePropagation();
            if (!moreText.hasAttribute('data-open')) {
                moreText.setAttribute('data-open', true);
                document.addEventListener('click', clickOutTextShow);
            }
        });
    }

});