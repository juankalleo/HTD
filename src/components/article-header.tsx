export function ArticleHeader({ title, data, cargo, area }: { title: string; data: string; cargo?: string; area: string }) {
  return (
    <header>
      <h1 className="title_jMzy">{title}</h1>
      {cargo && (
        <>
          <div className="container_y3Xj margin-vert--md">
            <time>{data}</time> · {area}
          </div>
          <div className="margin-top--md margin-bottom--sm row">
            <div className="col col--12 authorCol_UUDN">
              <div className="avatar margin-bottom--sm">
                <img
                  className="avatar__photo authorImage_Z0ds"
                  src="/img/icon/avatar_kalleo.png"
                  alt="Juan Kalleo"
                  style={{ objectFit: "cover", width: "40px", height: "40px", borderRadius: "50%", display: "block" }}
                />
                <div className="avatar__intro authorDetails_HoEW">
                  <div className="avatar__name">
                    <span className="authorName_go4W" translate="no">
                      Juan Kalleo
                    </span>
                  </div>
                  <small className="authorTitle_Yz8r" title={cargo}>
                    {cargo}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
