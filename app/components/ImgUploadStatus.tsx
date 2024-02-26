"use client";

export default function ImgUploadStatus() {

    return (
        <>
          {/* アップロード状況 */}
          <div className={`grey-filter ${uploadStatusModal ? 'active' : ''}`}></div>
          <div className={`uploadStatusModal ${uploadStatusModal ? 'active' : ''}`}>
            {loading ? (
              <p className="fz-xl">アップロード中です…</p>
            ) : (
              isUploaded ? (
                <div>
                  <p className="fz-xl">アップロードが完了しました。</p>
                  <div className="img-uploader-blue-btn mx-a w-20 py-1p" onClick={closeUploadStatusModal}>OK</div>
                </div>
              ) : (
                null
              )
            )}
          </div>
        </>
    )
}