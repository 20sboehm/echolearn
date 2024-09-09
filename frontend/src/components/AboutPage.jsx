import echoLearnImg from "../assets/EchoLearn.jpg"
import logoImg from "../assets/echolearn-logo-white.png"

const story = "EchoLearn is our project for the 2024 Senior Capstone. \
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
    email: "***@gmail.com",
  },
  {
    name: "Seth Boehm",
    roles: ["API Design", "UI Design", "Deployment and DevOps"],
    email: "20sboehm@gmail.com",
  },
  {
    name: "Wilson Pan",
    roles: ["Frontend logic", "UI Design"],
    email: "***@gmail.com",
  },
  {
    name: "Zengzheng Jiang",
    roles: ["Database Design", "Testing"],
    email: "***@gmail.com",
  }
]
function AboutPage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full bg-gradient-to-t from-customBlue to-featureBackground">
        <h1 className="text-4xl font-bold text-white">Team Echolearn</h1>
        <img src={logoImg} className="w-16 h-auto mb-4"></img>
        <div className="flex flex-row w-4/5 mx-auto">

          <div className="w-1/4 h-[80vh] overflow-y-auto">
            <h2 className="text-3xl text-green-300 font-bold mb-4">Team Members</h2>
            {teamInfo.map((member, index) => (
              <div key={index} className="text-blue-800">
                <h3 className="text-xl font-bold mb-2 text-white">{member.name}</h3>
                <ul className="list-disc ml-4">
                  {member.roles.map((role, roleIndex) => (
                    <li key={roleIndex} className="text-sm">{role}</li>
                  ))}
                </ul>
                <p className="mb-6">Email: <a href={`mailto:${member.email}`} className="text-blue-500">{member.email}</a></p>
              </div>
            ))}
          </div>

          <div className="flex flex-col w-3/4">
            <div className="flex flex-row">
              <img src={echoLearnImg} alt="Echolearn Image" className="w-1/3 h-auto mb-4 rounded-md" />
              <p className="text-xl text-black m-2">
                Team Members from left to right:<br /> Wilson Pan, Di Zhou, Zengzheng Jiang, Seth Boehm
              </p>
            </div>
            <p className="text-lg text-gray-700 mt-4">
              {story}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutPage