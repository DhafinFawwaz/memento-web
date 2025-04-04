import Link from "next/link";
import Image from "next/image";
import BGPattern from "@/components/bg-pattern";

const imgs = [
  "/img/preview/memento-1.png",
  "/img/preview/memento-2.png",
  "/img/preview/memento-3.png",
  "/img/preview/memento-4.png",
]

export default function Home() {
  return <>
  <BGPattern/>
  <div>
    <div className="flex justify-center items-start lg:px-48 pt-16">
      <Image className="" width={1000} height={500} src={"/img/home-logo.png"} alt={"home logo"}></Image>
    </div>
    
    <div className="flex justify-center flex-col items-center w-screen mt-8">
      <div className="grid grid-cols-2 gap-4 px-4 sm:px-16 max-w-4xl">
          {imgs.map((img, idx) => {
            return <div key={idx} className="flex justify-center items-center">
                <Image className="rounded-lg" width={500} height={500} src={img} alt={`memento ${idx}`}></Image>
              </div>
          })}
      </div>
      <div className="text-slate-950 font-semibold px-4 mt-8 pb-16">
        Contact: memento.photobox@gmail.com
      </div>
    </div>

  </div>
  



</>
}
