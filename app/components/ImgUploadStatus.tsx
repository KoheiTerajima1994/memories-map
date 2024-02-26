"use client";

import { useIsUpLoadingContext } from "../context/IsUploadedProvider";
import { useLoadingContext } from "../context/LoadingProvider";
import { useUploadStatusModalContext } from "../context/UploadStatusModalProvider";

export default function ImgUploadStatus() {
    // 画像アップローダーモーダルの開閉状態をコンテキストにて管理
    const { uploadStatusModal, setUploadStatusModal } = useUploadStatusModalContext();

    // ロード状態をコンテキストにて管理
    const { loading, setLoading } = useLoadingContext();

    // アップロード完了状態をコンテキストにて管理
    const { isUploaded, setIsUploaded } = useIsUpLoadingContext();

    const closeUploadStatusModal = () => {
      setUploadStatusModal(false);
    }

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