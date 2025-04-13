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
    
    <div className="flex justify-center flex-col items-center mt-8">
      <div className="grid grid-cols-2 gap-4 max-w-4xl sm:mx-8 mx-4">
          {imgs.map((img, idx) => {
            return <div key={idx} className="flex justify-center items-center">
                <Image className="rounded-lg" width={500} height={500} src={img} alt={`memento ${idx}`}></Image>
              </div>
          })}
      </div>

      <br />
      <div className="text-slate-950 grid lg:grid-cols-[65%_35%] grid-cols-1 max-w-4xl sm:mx-8 mx-4">
          <div>
            <p className="text-justify bg-slate-50 p-6">Memento Photobooth is a premier provider of automated photo booth services, specializing in delivering high-quality, interactive experiences for various events. Our state-of-the-art, user-friendly photo booths are designed to operate seamlessly without the need for an attendant, allowing guests to capture their special moments effortlessly.
            </p>
            <div className="bg-rose-950 text-slate-50 p-8">
              <div>For IDR 38.000 <b>You'll Get</b></div>
              <div className="grid grid-cols-2 w-full gap-4">
                <div className="w-full flex flex-col">
                  <img className="h-52 w-auto object-contain" src="/img/preview/memento-left.png" alt="" />
                  <div className="font-bold">
                    Customized Self Photostrips (2 pcs)
                  </div>
                  <div className="text-sm">
                  <div className="flex text-justify"><div className="mr-2">-</div> 📸 2 Pieces of Photostrips (4x6 inch each)</div>
                  <div className="flex text-justify"><div className="mr-2">-</div>Each photostrip is sized 4x6 inches, similar to a standard photo print.</div>
                  <div className="flex text-justify"><div className="mr-2">-</div>You'll get two copies of your custom design — perfect for sharing with a friend or keeping one as a backup!</div>
                  </div>
                </div>
                <div className="w-full flex flex-col">
                  <img className="h-52 w-auto object-contain" src="/img/preview/memento-right.png" alt="" />
                  <div className="font-bold">
                    Free Keychain for our beloved customers
                  </div>
                  <div className="text-sm">
                    <div className="flex text-justify"><div className="mr-2">-</div>Get a FREE exclusive keychain with every purchase —plus another one just by following us on social media!</div>
                  </div>
                </div>
              </div>

              <br />
              <div>Jl. Bukit Jarian No.17, HEGARMANAH | memento.photobox@gmail.com | 087837441682</div>
            </div>
          </div>

          <div className="h-full w-full p-8" style={{backgroundColor: "#111111"}}>
            <video autoPlay loop src="/video/preview/memento-preview.mp4"></video>
          </div>

      </div>


      <Link href={"/term"} className="text-blue-600 hover:text-blue-800 font-semibold mt-8">
        Syarat dan Ketentuan
      </Link>
      <div className="text-slate-950 font-semibold px-4 pb-16">
        Contact: memento.photobox@gmail.com
      </div>
    </div>

  </div>
  



</>
}
