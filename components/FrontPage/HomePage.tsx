import React from 'react';
import HtmlFromTemplate from '../StaticPages/HtmlFromTemplate';
import Cookies from 'js-cookie';

function HomePage() {
  const lang = Cookies.get('i18nextLng') || 'en';

  return (
    <HtmlFromTemplate
      locale={lang}
      name="home"
      base="https://raw.githubusercontent.com/nczirjak-acdh/arche-react-static-test/refs/heads/main/arche-react"
    />
  );

  return (
    <div className="w-full flex justify-center">
      <div className="container">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4 col-start-2">
            <div className="w-full">
              <div className="my-12 text-center">
                <p className="section-header-title-small">TITLE</p>
              </div>
            </div>
          </div>

          <div className="col-span-4 col-start-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
              {/* Card 1 */}
              <div className="h-full rounded-2xl border bg-white p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-center">Card 1</h3>
                <p className="mt-2 text-sm text-neutral-600 text-center">
                  Some description…
                </p>
                <div className="mt-auto text-center">
                  <a className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50">
                    Show
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="h-full rounded-2xl border bg-white p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-center">Card 2</h3>
                <p className="mt-2 text-sm text-neutral-600 text-center">
                  Some description…
                </p>
                <div className="mt-auto text-center">
                  <a className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50">
                    Show
                  </a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="h-full rounded-2xl border bg-white p-6 shadow-sm flex flex-col">
                <h3 className="text-lg font-semibold text-center">Card 3</h3>
                <p className="mt-2 text-sm text-neutral-600 text-center">
                  Some description…
                </p>
                <div className="mt-auto text-center">
                  <a className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50">
                    Show
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full justify-center">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 col-start-2">
          <div className="w-full">
            <div className="my-12 text-center">
              <p className="section-header-title-small">
                element_1.title_small
              </p>
              <h2 className="section-header-title"> element_1.title </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 col-start-2">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3 ">
              <div className="text-center"> element_1.content_left </div>
            </div>
            <div className="col-span-3 ">
              <div className="my-12 xl:text-left"> element_1.content_right</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 col-start-2">
          <div className="w-full">
            <div className="my-12 text-center">
              <p className="section-header-title-small">
                element_2.title_small
              </p>
              <h2
                className="section-header-title"
                id="deposit-discover-and-reuse-data"
              >
                element_2.title
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 resources-container-home">
        <div className="col-span-4 col-start-2">
          <div className="w-full">
            <div className="grid grid-cols-9 gap-4">
              <div className="col-span-3 text-center">
                <div className="max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.2)] ring-1 ring-black/5">
                  <div className="mb-6 flex items-center justify-center">
                    <img
                      className="card-img-top home-resources-images w-full h-auto"
                      src="{{ element_2.card_1_image }}"
                      alt="{{ element_2.card_1_title }}"
                      width="165"
                      height="138"
                    />
                  </div>
                  <div className="card-body home-resources-body p-4">
                    <h5 className="card-title mb-3 text-center">
                      <a
                        className="home-resources-title"
                        href="{{ element_2.card_1_url }}"
                      >
                        element_2.card_1_title
                      </a>
                    </h5>
                    <p className="card-text home-resources-text">
                      element_2.card_1_text
                    </p>
                    <p className="mt-auto">
                      <a
                        className="btn basic-arche-btn home-resources-btn"
                        href="{{ element_2.card_1_url }}"
                      >
                        Show
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <div className="max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.2)] ring-1 ring-black/5">
                  <div className="mb-6 flex items-center justify-center">
                    <img
                      className="card-img-top home-resources-images w-full h-auto"
                      src="{{ element_2.card_2_image }}"
                      alt="{{ element_2.card_2_title }}"
                      width="165"
                      height="136"
                    />
                  </div>
                  <div className="card-body home-resources-body p-4">
                    <h5 className="card-title mb-3 text-center">
                      <a
                        className="home-resources-title"
                        href="{{ element_2.card_2_url }}"
                      >
                        {' '}
                        element_2.card_2_title{' '}
                      </a>
                    </h5>
                    <p className="card-text home-resources-text">
                      element_2.card_2_text
                    </p>
                    <p className="mt-auto">
                      <a
                        className="btn basic-arche-btn home-resources-btn"
                        href="{{ element_2.card_2_url }}"
                      >
                        Show
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <div className="max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_60px_-20px_rgba(2,6,23,0.2)] ring-1 ring-black/5">
                  <div className="mb-6 flex items-center justify-center">
                    <img
                      className="card-img-top home-resources-images w-full h-auto"
                      src="{{ element_2.card_3_image }}"
                      alt="{{ element_2.card_3_title }}"
                      width="165"
                      height="134"
                    />
                  </div>
                  <div className="card-body home-resources-body p-4">
                    <h5 className="card-title mb-3 text-center">
                      <a
                        className="home-resources-title"
                        href="{{ element_2.card_3_url }}"
                      >
                        element_2.card_3_title
                      </a>
                    </h5>
                    <p className="card-text home-resources-text">
                      element_2.card_3_text
                    </p>
                    <p className="mt-auto">
                      <a
                        className="btn basic-arche-btn home-resources-btn"
                        href="{{ element_2.card_3_url }}"
                      >
                        Show
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 ">
        <div className="col-span-4 col-start-2">
          <div className="w-full">
            <div className="my-12 text-center">
              <p className="section-header-title-small">
                element_3.title_small
              </p>
              <h2
                className="section-header-title"
                id="deposit-discover-and-reuse-data"
              >
                element_3.title
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 arche-home-collections-slider ">
        <div className="col-span-4 col-start-2">
          <div className="w-full">
            <div className="w-full collections-container">
              <div className="w-full">
                <div className="container">
                  <div className="loader" id="home-slider-loader">
                    &nbsp;
                  </div>

                  <div
                    className="carousel slide"
                    id="multi-item-carousel"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">&nbsp;</div>
                    <p className="mt-4">
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#multi-item-carousel"
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#multi-item-carousel"
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 arche-home-collections-slider ">
        <div className="col-span-4 col-start-2">
          <div className="w-full mission-container-home">
            <div className="container mission-container">
              <div className="grid grid-cols-12 gap-y-8">
                <div className="col-span-12 lg:col-span-6">
                  <div className="text-center xl:text-left">
                    <p className="section-header-title-small">
                      element_4.title_small
                    </p>
                    <h2 className="section-header-title text-[28px]">
                      element_4.title
                    </h2>
                    <p className="lead fw-normal acdh-grey-color">
                      element_4.content_left
                    </p>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-6 text-center">
                  element_4.content_right
                </div>
              </div>

              <div className="grid grid-cols-12 items-center mt-6">
                <div className="col-span-12 lg:col-span-6">
                  <a
                    className="btn btn-arche-blue"
                    href="{{ element_4.more_url }}"
                  >
                    More
                  </a>
                </div>
                <div className="col-span-12 lg:col-span-6">
                  <div className="container">
                    <div className="grid grid-cols-3 text-center items-center">
                      <div>
                        <img
                          className="img-fluid w-full h-auto"
                          src="/browser/themes/contrib/arche-theme-bs/images/logos/mission-acdh-logo.png"
                          alt="..."
                          width="56"
                          height="62"
                        />
                      </div>
                      <div>
                        <img
                          className="img-fluid w-full h-auto"
                          src="/browser/themes/contrib/arche-theme-bs/images/logos/mission-oaw-logo.png"
                          alt="..."
                          width="120"
                          height="59"
                        />
                      </div>
                      <div>
                        <img
                          className="img-fluid w-full h-auto"
                          src="/browser/themes/contrib/arche-theme-bs/images/logos/mission-arche-logo.png"
                          alt="..."
                          width="120"
                          height="39"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
