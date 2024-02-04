"use client";

export default function HandleImgSelect(props: any) {

  // 画像アップローダーのパス取得
  const handleImgSelect = (e: any) => {
    const setImgPath = props;

    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    setImgPath(file);
  }

    return (
        <div className="input-wrapper mb-3p">
            <label htmlFor="img-fileup">3.画像ファイルを添付してください。(png、jpg形式のみ可能です)</label>
            <input type="file" id="img-fileup" accept="image/png, image/jpeg" onChange={handleImgSelect} />
        </div>
    )
}