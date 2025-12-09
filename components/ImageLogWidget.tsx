import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ImageLogWidget.module.css";
import { WindowId } from "../helpers/portfolioData";

interface MediaItem {
  filename: string;
  url: string;
  type?: "image" | "video";
}

export const imageLogData: MediaItem[] = [
  {
    filename: "Me with my mentor, at Huynh De Nhu Nghia Support Center for the visually impaired.",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1765288904/z7229767349808_94688ac7f69c666301e56fa9bc346dae_ev2v6e.jpg",
    type: "image",
  },
  {
    filename: "We piloted an assistive tool I built.",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1765288509/z7229767437176_ebe97f7eb9981429deb0498984826fd9_bd4fhe.jpg",
    type: "image",
  },
  {
    filename: "Piloting TAVIS STEM Lens at Nguyen Dinh Chieu Specialized School for the visually impaired.",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1765288899/z7131564227583_86adaf3271c242448e5974da3de1ae0b_mwkwj4.jpg",
    type: "image",
  },
  {
    filename: "The kids were leading me to their home.",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1765288902/7131564576688_prxsoc.mp4",
    type: "video",
  },
  {
    filename: "I am amazed by their gifts in music, despite their visual impairment.",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1765288909/7131564557083_usyxpo.mp4",
    type: "video",
  },
  {
    filename: "Summer in Engineering and Applied Science!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299070/z7151076073018_8511a0e48b7ed3c97971a3e526a8dc07_lzg8yk.jpg",
    type: "image",
  },
  {
    filename: "AI Security team, converge!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299029/z7151117032964_1e736cc9f6e95e474e7c0033154292f4_xuqkqf.jpg",
    type: "image",
  },
  {
    filename: "I finally get it after 2 weeks!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761318729/z7152365281168_1fd3d14dd14bb539560f6f28f810407a_wi7j4s.jpg",
    type: "image",
  },
  {
    filename: "With my handsome mentor!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297170/z7151076068464_6786298054a7ade3e6722769d6e6c2a1_zil18r.jpg",
    type: "image",
  },
  {
    filename: "Beautiful beach!",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761316011/7151077512592_otwaec.mp4",
    type: "video",
  },
  {
    filename: "Cafe Study (left: me, right: my mentor)!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761316557/gin-00121_h2crqa.jpg",
    type: "image",
  },
  {
    filename: "Proposing my love to SEAS <3",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297184/z7151076087288_b24cba629210d80699999d513d8d2990_vmyasm.jpg",
    type: "image",
  },
  {
    filename: "'HEY DONT BUMP INTO ME!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299077/z7151076189576_6b1201dead989ddaa9170725842be830_qqmd0o.jpg",
    type: "image",
  },
  {
    filename: "Fatal accident X-X!",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761315985/7152243742919_fitlqe.mp4",
    type: "video",
  },
  {
    filename: "Last party!",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761315985/7151080097907_cbkbxz.mp4",
    type: "video",
  },
  {
    filename: "At the train station!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761318728/z7152365263776_f9e243a79c6780c66e587fd62c2258f9_lj7r4l.jpg",
    type: "image",
  },
  {
    filename: "Saying goodbye to the dorm teacher!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297137/z7151117014206_d252190b943db38619feb1edbcc60f47_v9305d.jpg",
    type: "image",
  },
  {
    filename: "12th Vietnam Summer School of Science!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761316554/527671514_1087034353528896_7036828231709013850_n_vmzery.jpg",
    type: "image",
  },
  {
    filename: "Team 1!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299071/z7151076092957_9a13cfa6b99ddba9caf30f01df916dff_hyyhxv.jpg",
    type: "image",
  },
  {
    filename: "Presentation!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761316554/529297507_1089231956642469_5344593272124220082_n_waniz7.jpg",
    type: "image",
  },
  {
    filename: "Team 1! (After presentation)",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761318710/z7152376776313_d9d5e3eb8170f7358f5c2282b7148f31_c4jskq.jpg",
    type: "image",
  },
  {
    filename: "Gala night! We sang (me in pink shirt)!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761316554/531726473_1091696329729365_9090688721908987778_n_ukelzg.jpg",
    type: "image",
  },
  {
    filename: "Cheers!",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761316886/7152280353964_isltvy.mp4",
    type: "video",
  },
  {
    filename: "Bonfire!",
    url: "https://res.cloudinary.com/ducrwqhit/video/upload/v1761316011/7151077487718_u360kc.mp4",
    type: "video",
  },
  {
    filename: "Saying goodbye!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761318710/z7152376804806_2283f4d188a5f4ef48f7c4f935b14b38_kwsbtz.jpg",
    type: "image",
  },
  {
    filename: "Cafe Study, 5 days a week",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297106/z7151117040684_6356fc5028eb11981d6776f63f22fc26_jyhaii.jpg",
    type: "image",
  },
  {
    filename: "Receiving Award!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297309/z7151076146244_888265f346e9c4c63ebdab74cbb14074_aghusr.jpg",
    type: "image",
  },
  {
    filename: "Gold Medal!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297321/z7151076164494_55e041ad8e31b19d2d8014bf63643113_dwptxy.jpg",
    type: "image",
  },
  {
    filename: "Shinyy!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299029/z7151076054325_61c96a73bce1ac40e22da69ad48f5051_ovlqfa.jpg",
    type: "image",
  },
  {
    filename: "Best competitive programmers in the area here!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761314864/z7152176150650_a063f1f1db5bd159663cbe1a7990ef91_vxgvm7.jpg",
    type: "image",
  },
  {
    filename: "Study corner!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297297/z7151076120111_5c38a9761bbe1c416bf8646989d2c9fa_j33lpr.jpg",
    type: "image",
  },
  {
    filename: "Heading to Ninh Thuan for Olympiad Training!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297307/z7151076129008_5c8a4517ddacf6415bd1610948ac6c83_k2lcbg.jpg",
    type: "image",
  },
  {
    filename: "My dream team Aura AI!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299062/z7151076066445_20114cf2a22fcdfe3e26ba54ba01b8e1_trkkfi.jpg",
    type: "image",
  },
  {
    filename: "First step in AI!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299062/z7151076064771_db887cdb53f2b67e9a7c13c0d62568cf_bb2ojk.jpg",
    type: "image",
  },
  {
    filename: "Harmless gang ^^!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298743/z7151076176619_dc358fbfef5a4519906cdf2db3cd7046_hprtze.jpg",
    type: "image",
  },
  {
    filename: "Volunteering for High School Entrance Exam",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297269/z7151076159784_52ec0ae26f80243efb737536536513d0_admmvz.jpg",
    type: "image",
  },
  {
    filename: "Volunteering for University Entrance Exam",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298163/z7151076116513_bb3bcdbe402c89be980e09b2c58076b1_yjhocq.jpg",
    type: "image",
  },
  {
    filename: "Too sunny! Bet you cant find me!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298476/z7151076133204_40dfdc07c8f5b517d817c2c3210ed3f6_unusnb.jpg",
    type: "image",
  },
  {
    filename: "Readyy..",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299029/z7151076058604_89486b9943ba30adaa119591c281b867_f1bsnh.jpg",
    type: "image",
  },
  {
    filename: "Pact!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299071/z7151076086027_e2beb1258d35bdd1ae54afe56cb61e4c_bu1n2k.jpg",
    type: "image",
  },
  {
    filename: "Student Council Executive Committee",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298837/z7151076094622_c0c6390ed565872eadb918b4aab40883_otqh5y.jpg",
    type: "image",
  },
  {
    filename: "Con Dao Trip with student council",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299076/z7151076104286_386fa50c32ef25009c67be3f8ea37f6e_p0ajkn.jpg",
    type: "image",
  },
  {
    filename: "Still at Con Dao",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761299076/z7151076104097_83cb5620096c32e6087f35f44ccb856f_ljz6ud.jpg",
    type: "image",
  },
  {
    filename: "Tag game at a hugeeee park! (Me in grey tee)",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298481/z7151076141840_74c2f435cd01ecca48308dae30509f11_qaylzk.jpg",
    type: "image",
  },
  {
    filename: "Tug of war (we lost TvT)",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298481/z7151076151445_b625ff2135eb71fd0632a8536a72cf72_ivtnx1.jpg",
    type: "image",
  },
  {
    filename: "We slept well!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298479/z7151076136639_4d454967e2d6049650bb51a1d3ef051a_k6yuqa.jpg",
    type: "image",
  },
  {
    filename: "24H ON THE STREET, to watch a military parade!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761298817/z7151076103089_cc11d7226a1cfe30a471747176e80341_fr0bxu.jpg",
    type: "image",
  },
  {
    filename: "To Quang Ninh! Youth Informatics Contest FINAL!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297228/z7151076138862_729eec26ab9599e7816290b2256e04ee_w8iz9z.jpg",
    type: "image",
  },
  {
    filename: "Embracing Lunar New Year, thus the blooming flower!",
    url: "https://res.cloudinary.com/ducrwqhit/image/upload/v1761297215/z7151076109496_16f988a59fe9ce715b8b6d7aaa52ec13_leatuh.jpg",
    type: "image",
  },
];

interface ImageLogWidgetProps {
  className?: string;
  openWindow?: (id: WindowId) => void;
}

export const ImageLogWidget: React.FC<ImageLogWidgetProps> = ({
  className,
  openWindow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const advanceSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageLogData.length);
    setImageKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const startInterval = () => {
      intervalRef.current = setInterval(advanceSlide, 4000);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isHovered) {
      startInterval();
    } else {
      stopInterval();
    }

    return () => stopInterval();
  }, [isHovered, advanceSlide]);

  const handleClick = () => {
    if (openWindow) {
      openWindow("IMAGE_LOG");
    }
  };

  if (imageLogData.length === 0) {
    return null;
  }

  const currentImage = imageLogData[currentIndex];

  return (
    <div
      className={`${styles.container} ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className={styles.title}>IMAGE LOG</h3>
      <div className={styles.header}>
        <span className={styles.filename}>{currentImage.filename}</span>
        <span className={styles.counter}>
          {currentIndex + 1}/{imageLogData.length}
        </span>
      </div>
      <div className={styles.imageWrapper} onClick={handleClick}>
        {currentImage.type === "video" ? (
          <video
            key={imageKey}
            src={currentImage.url}
            className={styles.image}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            key={imageKey}
            src={currentImage.url}
            alt={currentImage.filename}
            className={styles.image}
          />
        )}
      </div>
    </div>
  );
};
