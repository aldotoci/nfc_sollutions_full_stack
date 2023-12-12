import base_preview from '@/images/base_previews/artigiano.jpg'

export const viewport = {
  themeColor: '#171717',
}

export default function Home({links, storeName}) {
  const tiktokLink = links['tiktok']
  const instagramLink = links['instagram']

  const trip_advisor_link = links['tripadvisor']
  const google_review_link = links['googlereview']
  
  function onClickLink(link_clicked, link_type) {
    const searchParams = new URLSearchParams(window.location.search);
    const card_id = searchParams.get('card_id');
    fetch('/api/onClickLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        card_id,
        link_clicked, 
        link_type,
      }),
      }).then(response => {
      }).catch((error) => {});

    window.open(link_clicked, '_blank');
  }

  return (
    <>
      <div className="store__container">
        <div className="store-layout">
          <div
            data-v-7578ada4=""
            id="fixed-background"
            className="d-none"
            bis_skin_checked="1"
          ></div>
          <div className="store-header">
            <div className="store-header__content">
              <div className="store-header__image">
                <img
                  src={base_preview?.src}
                  alt="user image"
                  className="base-preview-image"
                />
              </div>
              <div className="store-header__profile">
                <div className="store-header__name-bio">
                  <div className="store-header__names">
                    <div className="store-header__fullname">{storeName}</div>
                  </div>
                </div>
                <div className="social-icons">
                  <div
                    href={tiktokLink}
                    target="_blank"
                    className="social-icons__icon"
                    onClick={() => onClickLink(tiktokLink, 'tiktok')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      alt="social icon"
                    >
                      <path d="M22.81,5.78v4.09c-2.12,0-4.09-.68-5.7-1.82v8.34c0,4.17-3.38,7.56-7.56,7.56-1.56,0-3-.47-4.21-1.28-2.02-1.36-3.35-3.66-3.35-6.28,0-4.17,3.38-7.56,7.56-7.56,.35,0,.69,.02,1.04,.07v4.18c-.33-.1-.68-.16-1.05-.16-1.91,0-3.46,1.55-3.46,3.46,0,1.35,.77,2.52,1.9,3.09,.47,.24,1,.37,1.56,.37,1.91,0,3.45-1.54,3.46-3.44V.06h4.11V.58c.02,.16,.04,.31,.06,.47,.29,1.63,1.26,3.02,2.61,3.86,.91,.57,1.96,.87,3.03,.86Z"></path>
                    </svg>
                  </div>
                  <div
                    href={instagramLink}
                    target="_blank"
                    className="social-icons__icon"
                    onClick={() => onClickLink(instagramLink, 'instagram')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      alt="social icon"
                    >
                      <path d="M12.06,.06c-3.24,0-3.65,.01-4.92,.07-1.27,.06-2.14,.26-2.9,.55-.79,.3-1.45,.71-2.11,1.38-.66,.66-1.07,1.33-1.38,2.11-.3,.76-.5,1.63-.55,2.9-.06,1.27-.07,1.68-.07,4.92s.01,3.65,.07,4.92c.06,1.27,.26,2.14,.55,2.9,.31,.79,.71,1.45,1.38,2.11,.66,.66,1.33,1.07,2.11,1.38,.76,.3,1.63,.5,2.9,.55,1.27,.06,1.68,.07,4.92,.07s3.65-.01,4.92-.07c1.27-.06,2.14-.26,2.9-.55,.78-.3,1.45-.71,2.11-1.38,.66-.66,1.07-1.33,1.38-2.11,.29-.76,.49-1.63,.55-2.9,.06-1.27,.07-1.68,.07-4.92s-.01-3.65-.07-4.92c-.06-1.27-.26-2.14-.55-2.9-.31-.79-.71-1.45-1.38-2.11-.66-.66-1.33-1.07-2.11-1.38-.76-.3-1.63-.5-2.9-.55-1.27-.06-1.68-.07-4.92-.07h0Zm-1.07,2.15c.32,0,.67,0,1.07,0,3.19,0,3.56,.01,4.82,.07,1.16,.05,1.8,.25,2.22,.41,.56,.22,.95,.47,1.37,.89,.42,.42,.68,.82,.89,1.37,.16,.42,.36,1.05,.41,2.22,.06,1.26,.07,1.64,.07,4.82s-.01,3.56-.07,4.82c-.05,1.16-.25,1.8-.41,2.22-.22,.56-.48,.95-.89,1.37-.42,.42-.81,.68-1.37,.89-.42,.16-1.05,.36-2.22,.41-1.26,.06-1.64,.07-4.82,.07s-3.56-.01-4.82-.07c-1.16-.05-1.8-.25-2.22-.41-.56-.22-.95-.47-1.37-.89-.42-.42-.68-.81-.89-1.37-.16-.42-.36-1.05-.41-2.22-.06-1.26-.07-1.64-.07-4.82s.01-3.56,.07-4.82c.05-1.16,.25-1.8,.41-2.22,.22-.56,.48-.95,.89-1.37,.42-.42,.82-.68,1.37-.89,.42-.16,1.05-.36,2.22-.41,1.1-.05,1.53-.06,3.75-.07h0Zm7.44,1.98c-.79,0-1.43,.64-1.43,1.43s.64,1.43,1.43,1.43,1.43-.64,1.43-1.43-.64-1.43-1.43-1.43h0Zm-6.37,1.67c-3.38,0-6.13,2.74-6.13,6.13s2.74,6.13,6.13,6.13c3.38,0,6.13-2.74,6.13-6.13s-2.74-6.13-6.13-6.13h0Zm0,2.15c2.2,0,3.98,1.78,3.98,3.98s-1.78,3.98-3.98,3.98-3.98-1.78-3.98-3.98,1.78-3.98,3.98-3.98Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="store-content">
            <div className="store-link">
              <div className="store-link-info">
                <div className="block-image">
                  <img
                    className=""
                    src="./images/tripadv_logo.jpeg"
                    alt="Tripadvisor Logo"
                  />
                </div>
                <div className="description">
                  <div className="block__heading">Tripadvisor</div>
                  <div className="block__subheading">Review our restaurant</div>
                </div>
              </div>
              <button onClick={() => onClickLink(trip_advisor_link, 'tripadvisor')} className="click-link-button">
                <div>Review</div>
              </button>
            </div>
            <div className="store-link">
              <div className="store-link-info">
                <div className="block-image">
                  <img
                    className=""
                    src="./images/google_logo.jpeg"
                    alt="Tripadvisor Logo"
                  />
                </div>
                <div className="description">
                  <div className="block__heading">Google Review</div>
                  <div className="block__subheading">Review our restaurant</div>
                </div>
              </div>
              <button onClick={() => onClickLink(google_review_link, 'googlereview')} className="click-link-button">
                <div>Review</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
