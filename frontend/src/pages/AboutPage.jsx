import echoLearnImg from "../assets/EchoLearn.jpg"
import logoImg from "../assets/echolearn-logo-white.png"

const storyText = "EchoLearn is our project for the 2024 Senior Capstone. \
Memory retention is often a challenge when learning new information. \
One of our teammates, Seth, enjoys using flashcards to review materials, \
which inspired an idea: a web-based flashcard system \
that uses the spaced repetition memorization technique to help users \
retain knowledge. Our goal is to create a user-friendly \
and easily accessible tool to make memorization easy.";

const teamInfo = [
  {
    name: "Di Zhou",
    roles: ["Backend logic", "Frontend logic"],
    email: "2279538596@qq.com",
  },
  {
    name: "Seth Boehm",
    roles: ["API Design", "UI Design", "Deployment and DevOps"],
    email: "20sboehm@gmail.com",
  },
  {
    name: "Wilson Pan",
    roles: ["Frontend logic", "UI Design", "Mobile Design"],
    email: "w1252801556@gmail.com",
  },
  {
    name: "Zengzheng Jiang",
    roles: ["Database Design", "Testing"],
    email: "jzzconstantine@gmail.com",
  }
]

function AboutPage() {
  return (
    <>
      <div className="flex flex-col items-center w-full h-screen bg-gradient-to-t from-customBlue to-featureBackground">
        <div className="flex flex-row h-24 items-center mt-4 mb-8">
          <h1 className="text-4xl font-bold text-white mr-4">Team Echolearn</h1>
          <img src={logoImg} className="w-16 h-16"></img>
        </div>
        <div className="flex flex-row w-4/5 mx-auto">

          <div className="w-[20%] h-full overflow-y-auto border-r border-black mr-4">
            <h2 className="text-3xl text-green-300 font-bold mb-10">Team Members</h2>
            {teamInfo.map((member, index) => (
              <div key={index} className="text-blue-800">
                <h3 className="text-xl font-bold mb-2 text-white">{member.name}</h3>
                <ul className="list-disc ml-5">
                  {member.roles.map((role, roleIndex) => (
                    <li key={roleIndex} className="text-sm">{role}</li>
                  ))}
                </ul>
                <p className="mb-6">Email: <a href={`mailto:${member.email}`} className="text-blue-500">{member.email}</a></p>
              </div>
            ))}
          </div>

          <div className="flex flex-col w-[50%] ml-16">
            <div className="flex flex-row">
              <img src={echoLearnImg} alt="Echolearn Image" className="w-[75%] h-auto mb-4 rounded-md" />
              <p className="text-base text-gray-700 m-2">
                Team members from left to right:
                <ul className="list-disc text-gray-700 ml-6">
                  <li>Wilson Pan</li>
                  <li>Di Zhou</li>
                  <li>Zengzheng Jiang</li>
                  <li>Seth Boehm</li>
                </ul>
              </p>
            </div>
            <p className="text-lg text-black mt-4">
              {storyText}
            </p>
          </div>
        </div>
      </div >
    </>
  )
}

export default AboutPage