import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/shared/Button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { CalendarIcon, UserGroupIcon, ClipboardDocumentCheckIcon, BoltIcon, ChartBarIcon, ArrowTrendingUpIcon, Bars3Icon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Listings', href: '/listings' },
  { name: 'Upload', href: '/listings/new' },
  { name: 'Settings', href: '/settings' },
];

// Demo data
const kpiCards = [
  { label: 'Total Listings', value: 24, icon: <ChartBarIcon className="h-6 w-6 text-primary" />, color: 'primary' },
  { label: 'New Leads', value: 9, icon: <UserGroupIcon className="h-6 w-6 text-accent" />, color: 'accent' },
  { label: 'Revenue', value: '$12,500', icon: <ArrowTrendingUpIcon className="h-6 w-6 text-secondary" />, color: 'secondary' },
  { label: 'Conversion Rate', value: '18%', icon: <BoltIcon className="h-6 w-6 text-muted-foreground" />, color: 'muted' },
];
const salesFunnel = [
  { stage: 'Leads', value: 120 },
  { stage: 'Contacted', value: 80 },
  { stage: 'Qualified', value: 40 },
  { stage: 'Closed', value: 12 },
];
const leadSources = [
  { name: 'Website', value: 60 },
  { name: 'Referral', value: 25 },
  { name: 'Social', value: 10 },
  { name: 'Other', value: 5 },
];
const appointments = [
  { date: '2025-06-16', time: '10:00 AM', client: 'Jane Smith', type: 'Showing', address: '123 Main St' },
  { date: '2025-06-17', time: '2:00 PM', client: 'John Doe', type: 'Call', address: '' },
];

const activityFeed = [
  { type: 'lead', text: 'New lead: Sarah Lee (website form)', time: '2h ago' },
  { type: 'listing', text: 'Listing updated: 123 Main St', time: '4h ago' },
  { type: 'interaction', text: 'Called John Doe', time: 'Yesterday' },
];
const listingsTrend = [
  { month: 'Jan', listings: 4 },
  { month: 'Feb', listings: 6 },
  { month: 'Mar', listings: 8 },
  { month: 'Apr', listings: 5 },
  { month: 'May', listings: 9 },
  { month: 'Jun', listings: 7 },
];
const COLORS = ['#2563eb', '#f59e42', '#10b981', '#a78bfa'];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      <div className="flex items-center bg-white p-4 pb-2 justify-between">
        <div className="text-[#111418] flex size-12 shrink-0 items-center" data-icon="ArrowLeft" data-size="24px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
          </svg>
        </div>
      </div>
      <div className="@container">
        <div className="@[480px]:px-4 @[480px]:py-3">
          <div
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-white @[480px]:rounded-xl min-h-[218px]"
            style={{ backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://cdn.usegalileo.ai/sdxl10/9bafd848-89f9-4eec-b888-9b1ad55fd5c3.png")' }}
          >
            <div className="flex p-4"></div>
          </div>
        </div>
      </div>
      <h1 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-center pb-3 pt-5">Upload photos of your property</h1>
      <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">You can upload up to 10 photos. The first photo will be used as a cover.</p>
      <div className="flex w-full grow bg-white @container p-4">
        <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-xl grid grid-cols-[2fr_1fr_1fr]">
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none row-span-2"
            style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/ff3049d5-907c-4575-bc25-6c0bf266761a.png")' }}
          ></div>
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none"
            style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/5c57eb58-cec0-4169-a13b-97e9f3b8aef7.png")' }}
          ></div>
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none"
            style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/566a2dd1-4d95-4094-b459-5e5653919d3d.png")' }}
          ></div>
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none"
            style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/e3c7e6c8-615f-45ef-af49-75ada4582716.png")' }}
          ></div>
          <div
            className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none"
            style={{ backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/8eca6e2c-4c2d-47ba-9d4b-98082330a31e.png")' }}
          ></div>
        </div>
      </div>
      <div className="flex justify-stretch">
        <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Add photo</span>
          </button>
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#3086e8] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Continue</span>
          </button>
        </div>
      </div>
      <div className="h-5 bg-white"></div>
    </div>
  );
};

export default DashboardPage;
