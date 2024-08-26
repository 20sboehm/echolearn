import echoLearnImg from "../assets/EchoLearn.jpg"
import logoImg from "../assets/echolearn-logo-white.png"

function AboutPage() {
  return (
    <>
      <div className="flex justify-between w-full">
        <div className="h-[50vh] w-2/3 bg-customBlue text-black p-8 flex flex-col">
          <h3 className="ml-28 text-4xl font-bold mb-4 mt-8">We are Echolearn</h3>
          <p className="ml-28 text-2xl">Our goal is to help everyone effectively retain key knowledge and turn learning into long-term memory</p>
        </div>
        <img src={echoLearnImg} alt="Echolearn PNG" className="w-1/3 h-[50vh]"></img>
      </div>
      <div className="flex flex-row items-center w-full h-[50vh]">
        <img src={logoImg} alt="Echolearn logo" className="m-4 h-[20vh] w-auto"></img>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-2">Any Questions? Contact Us</h1>
          <p className="text-xl text-blue-600">echolearn@gmail.com</p>
        </div>
      </div>
    </>
  )
}

export default AboutPage