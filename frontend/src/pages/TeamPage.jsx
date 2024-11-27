import logoImg from "../assets/echolearn-logo-white.png"
import Di from "../assets/Di.png"
import Seth from "../assets/Seth.png"
import Wilson from "../assets/Wilson.png"
import Zeng from "../assets/Zengzheng.png"

function TeamPage() {
  return (
    <>
      <div className="flex flex-col items-center w-full min-h-screen bg-featureBackground">
        <div className="flex flex-row h-24 items-center mt-4 mb-8">
          <h1 className="text-4xl font-bold text-white mr-4">Team Echolearn</h1>
          <img src={logoImg} className="w-16 h-16"></img>
        </div>
        {/* Di */}
        <div className="flex flex-row items-center justify-center w-[90vw] p-6 border-2 mb-6">
          <img src={Di} alt="Di" className="w-64 h-64 mr-6" />
          <div className="text-white">
            <h2 className="text-2xl font-bold border-b">Di Zhou</h2>
            <p className="text-lg mt-2">
              I am Di, and my major is Computer Science at the Kahler School of Computing at the University of Utah.
              I am interested in software engineering and web development.
              One of the projects I participated in developing is a repository management system based on Spring Boot.
              In the last semester, I mainly focused on my capstone project: EchoLearn.
              I mainly focus on the connection between the front-end and back-end.
              We used many technologies in this project, such as Django Ninja and React.
              For me, this was a great experience that allowed me to develop more skills related to web development.
              Besides studying, I also enjoy cycling and playing video games.
            </p>
            <p className="mt-2">
              2279538596@qq.com | <a href="https://www.linkedin.com/in/di-zhou-8b845a293/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">LinkedIn</a>
            </p>
          </div>
        </div>

        {/* Seth */}
        <div className="flex flex-row items-center justify-center w-[90vw] p-6 border-2 mb-6">
          <div className="text-white text-left">
            <h2 className="text-2xl font-bold border-b">Seth Boehm</h2>
            <p className="text-lg mt-2">
              I’m Seth, a Software Development major here at the University of Utah.
              My biggest interest is web development, but I also have experience with AWS through internships and personal projects.
              My biggest focus these last few months has been our Capstone project where we built a web application using React, Tailwind, Django Ninja, as well as AWS services such as EC2 and S3.
              This capstone project was a great intersection between web development and cloud infrastructure; I hope to work on similar projects in the future.
              Outside of my degree, I enjoy rock climbing and watching movies.
            </p>
            <p className="mt-2">
              20sboehm@gmail.com | <a href="https://www.linkedin.com/in/sethboehm" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">LinkedIn</a>
            </p>
          </div>
          <img src={Seth} alt="Seth" className="w-64 h-64 ml-6" />
        </div>

        {/* Wilson */}
        <div className="flex flex-row items-center justify-center w-[90vw] p-6 border-2 mb-6">
          <img src={Wilson} alt="Wilson" className="w-64 h-64 mr-6" />
          <div className="text-white">
            <h2 className="text-2xl font-bold border-b">Wilson Pan</h2>
            <p className="text-lg mt-2">
              Hi, I'm Wilson, a Computer Science major at the University of Utah.
              I'm passionate about software engineering, web development, and mobile design.
              For our Capstone project, I am responsible for the frontend, focusing on designing the pages using React and Tailwind CSS.
              Additionally, I developed a simple mobile app that connects to our backend server, allowing users to study on their phones.
              I thoroughly enjoy seeing animations flow smoothly and watching a page evolve from scratch into a well-designed user interface.
              Outside of school, I love going to the gym and spending time with my friends.
            </p>
            <p className="mt-2">
              w1252801556@gmail.com | <a href="https://www.linkedin.com/in/wilson-pan-961099339/" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">LinkedIn</a>
            </p>
          </div>
        </div>

        {/* Zengzheng */}
        <div className="flex flex-row items-center justify-center w-[90vw] p-6 border-2 mb-6">
          <div className="text-white text-left">
            <h2 className="text-2xl font-bold border-b">Zengzheng Jiang</h2>
            <p className="text-lg mt-2">
              I’m Zengzheng Jiang, an undergraduate student studying Computer Science at the Kahlert School of Computing, University of Utah.
              I was worked on several projects, including "Real-Time Prediction and Big Data Analysis in NBA" (2023), Echolearn (2024), and "Logging Identification Method for Reservoir Facies in Fractured-Vuggy Dolomite Reservoirs Based on AI" (2024).
              These projects focused on machine learning, big data, and AI applications in different fields.
              My interests include machine learning, software development, and video games. I enjoy applying what I learn to practical problems, whether in research or development projects.
            </p>
            <p className="mt-2">
              jzzconstantine@gmail.com | <a href="https://www.linkedin.com/in/zengzhengjiang" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">LinkedIn</a>
            </p>
          </div>
          <img src={Zeng} alt="Zengzheng" className="w-64 h-64 ml-6" />
        </div>
      </div>
    </>
  );
}

export default TeamPage