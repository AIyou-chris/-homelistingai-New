import React from 'react';
import { Phone, Mail, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';

interface RealtorCardProps {
  name: string;
  subtitle: string;
  phone: string;
  email: string;
  website: string;
  tagline?: string;
  imageUrl: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

const RealtorCard: React.FC<RealtorCardProps> = ({
  name,
  subtitle,
  phone,
  email,
  website,
  tagline,
  imageUrl,
  socials = {}
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-blue-50 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center border border-blue-100">
      <img
        src={imageUrl}
        alt={name}
        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-4"
        style={{ background: '#f3f4f6' }}
      />
      <div className="text-3xl font-bold text-blue-800 mb-1 whitespace-normal break-words w-full">{name}</div>
      <div className="uppercase tracking-widest text-blue-400 font-semibold text-base mb-4 whitespace-normal break-words w-full">{subtitle}</div>
      <div className="flex justify-center gap-6 mb-4">
        <a href={`tel:${phone}`} className="bg-blue-50 hover:bg-blue-100 rounded-full p-3 transition"><Phone className="w-6 h-6 text-blue-700" /></a>
        <a href={`mailto:${email}`} className="bg-blue-50 hover:bg-blue-100 rounded-full p-3 transition"><Mail className="w-6 h-6 text-blue-700" /></a>
        <a href={`sms:${phone}`} className="bg-blue-50 hover:bg-blue-100 rounded-full p-3 transition"><MessageCircle className="w-6 h-6 text-blue-700" /></a>
      </div>
      <div className="text-xl font-semibold text-blue-900 mb-1 whitespace-normal break-words w-full">{phone}</div>
      <div className="text-blue-700 mb-1 whitespace-normal break-words w-full">{email}</div>
      <div className="text-blue-700 mb-4 whitespace-normal break-words w-full"><a href={website} target="_blank" rel="noopener noreferrer" className="hover:underline">{website}</a></div>
      {tagline && <div className="italic text-gray-500 mb-4">“{tagline}”</div>}
      <div className="flex justify-center gap-4 mt-2">
        {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 rounded-full p-2"><Facebook className="w-5 h-5 text-blue-700" /></a>}
        {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 rounded-full p-2"><Instagram className="w-5 h-5 text-blue-700" /></a>}
        {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="bg-blue-50 hover:bg-blue-100 rounded-full p-2"><Twitter className="w-5 h-5 text-blue-700" /></a>}
      </div>
    </div>
  );
};

export default RealtorCard; 