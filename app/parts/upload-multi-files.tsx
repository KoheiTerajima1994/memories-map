"use client";

// 多分このファイルは没

import { useState } from "react";

export default function UploadMultiImages() {

    const [images, setImage] = useState([]);
    const [createObjectURL, setCreateObjectURL] = useState([]);

    const uploadToClient = (event: any) => {
        console.log('event.target.files', event.target.files[0]);
        if (event.target.files[0] ) {
            const file = event.target.files[0];
           
            const list = [...images];
            list.push({ image:file });
           
            setImage(list);
            console.log(list);
           
            const urlList = [...createObjectURL];
            urlList.push({url:URL.createObjectURL(file)})
           
            setCreateObjectURL(urlList);
            console.log(urlList); 
        }
    }
    return (
        <input type="file" onChange={uploadToClient} />
    )
}