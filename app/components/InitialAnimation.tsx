"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';

export default function InitialAnimation() {
    // 初回読み込み時、表示画面
    const [initialAnm, setInitialAnm] = useState<boolean>(false);
    useEffect(() => {
        setInitialAnm(true);
    },[]);

    return (
        <div className={`initial-anm ${initialAnm ? 'active' : ''}`}>
            <div>
                <div className="mapIcon">
                <Image src="/images/map-icon.png" className="swing" alt="Map Icon" width={100} height={100} />
                </div>
                <p className="initial-anm-title fz-xl sp-fz-ml">みんなの<br/>思い出MAP</p>
                <p className="initial-anm-subtitle fz-s sp-fz-s">消えゆく景色を残したい。</p>
            </div>
        </div>
    )
}