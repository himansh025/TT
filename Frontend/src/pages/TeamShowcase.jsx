"use client";
import React from "react";
import TeamHeader from "../Comp/TeamHeader";
import TeamMemberCard from "../Comp/TeamMemberCard";

const TeamShowcase = () => {
  const teamMembers = [
    {
      name: "Yogesh Kashyap",
      role: "Backend Developer",
      description:
        "Ensures seamless functionality with robust backend solutions.",
      image:
        "../src/assets/yogesh.png",
      bgColor: "bg-cyan-200",
      social: {
        github: "https://github.com/yogeshkashyap-github/",
        linkedin: "https://linkedin.com/in/yogesh-kashyap",
        instagram: "https://instagram.com/yogesh.kashyap"
      }
    },
    {
      name: "Karanvir Singh",
      role: "Designer & Developer",
      description:
        "Blends creativity and code to craft stunning user experiences.",
      image:
        "../src/assets/karanvir.png",
      bgColor: "bg-green-300",
      social: {
        github: "https://github.com/yogeshkashyap-github/",
        // linkedin: "https://linkedin.com/in/karanvir-singh",
        instagram: "https://instagram.com/karanvir.singh"
      }
    },
    {
      name: "Vansh Bhatia",
      role: "Frontend Developer",
      description: "Builds interactive and engaging web interfaces.",
      image:
        "../src/assets/bhatia.png",
      bgColor: "bg-red-500",
      social: {
        github: "https://github.com/Vanshprocoder",
        linkedin: "https://linkedin.com/in/vansh-bhatia",
        instagram: "https://www.instagram.com/mastersofweb"
      }
    },
    {
      name: "Himanshu",
      role: "Frontend Developer",
      description: "Enhances user experience with smooth and dynamic designs.",
      image:
        "../src/assets/himanshu.png",
      bgColor: "bg-rose-300",
      social: {
        github: "https://github.com/himanshu",
        linkedin: "https://linkedin.com/in/himanshu",
        instagram: "https://instagram.com/himanshu"
      }
    },
    {
      name: "Nitish Kumar",
      role: "Backend Developer",
      description:
        "Develops efficient server-side architectures for reliability.",
      image:
        "../src/assets/nitish.png",
      bgColor: "bg-fuchsia-300",
      social: {
        github: "https://github.com/nitish-kumar",
        linkedin: "https://linkedin.com/in/nitish-kumar",
        instagram: "https://instagram.com/nitish.kumar"
      }
    },
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <main className="px-5 py-10 mx-auto my-0 max-w-[1440px] max-sm:px-4 max-sm:py-5">
        <TeamHeader />
        <section className="grid gap-8 mx-auto my-0 grid-cols-[repeat(5,1fr)] max-w-[1678px] max-md:grid-cols-[repeat(3,1fr)] max-sm:grid-cols-[1fr]">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} {...member} />
          ))}
        </section>
      </main>
    </>
  );
};

export default TeamShowcase;
