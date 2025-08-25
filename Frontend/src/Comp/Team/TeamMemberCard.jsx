import React from "react";
import SocialLinks from "./SocialLinks";

const TeamMemberCard = ({ name, role, description, image, bgColor, social }) => {
  return (
    <article className="flex overflow-hidden flex-col bg-white rounded border border-gray-200 border-solid">
      <div className={`overflow-hidden relative w-full h-[230px] ${bgColor}`}>
        <img
          src={image}
          alt={`${name} - ${role}`}
          className="object-cover size-full"
        />
      </div>
      <div className="flex flex-col grow p-4">
        <h3 className="mb-1 text-lg font-bold text-zinc-800">{name}</h3>
        <p className="mb-2 text-sm text-gray-700">{role}</p>
        <p className="mb-5 text-sm leading-6 text-gray-500">{description}</p>
        <SocialLinks social={social} />
      </div>
    </article>
  );
};

export default TeamMemberCard;
