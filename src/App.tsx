/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Activity, Calendar, LayoutGrid, List, Languages, Filter, 
  Menu, X, TrendingUp, Scissors, ChevronRight, ChevronLeft,
  PieChart as PieChartIcon, BarChart as BarChartIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { translations } from './translations';
import { generateMockData, filterData, getSpecialtyName } from './dataService';
import { SurgeryRecord, Language, DesignMode, SurgeryType } from './types';

// Utility for cleaner tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [mode, setMode] = useState<DesignMode>('bento');
  const [theme, setTheme] = useState<'indigo' | 'emerald' | 'rose' | 'amber'>('indigo');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    year: 'all',
    month: 'all',
    type: 'all'
  });

  const t = translations[lang];
  const allData = useMemo(() => generateMockData(), []);
  const filteredData = useMemo(() => filterData(allData, filters), [allData, filters]);

  // Derived stats
  const totalCount = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.count, 0), [filteredData]);
  const successCount = useMemo(() => filteredData.filter(d => d.outcome === 'Success').reduce((acc, curr) => acc + curr.count, 0), [filteredData]);
  const successRate = totalCount > 0 ? (successCount / totalCount * 100).toFixed(1) : '0';

  const monthNames = [
    t.january, t.february, t.march, t.april, t.may, t.june,
    t.july, t.august, t.september, t.october, t.november, t.december
  ];

  const years = ['all', '2022', '2023', '2024', '2025'];
  const montOptions = ['all', ...Array.from({ length: 12 }, (_, i) => (i + 1).toString())];

  const toggleLanguage = () => setLang(prev => prev === 'ar' ? 'en' : 'ar');
  const toggleMode = () => setMode(prev => prev === 'bento' ? 'density' : 'bento');

  const pages = [
    { title: t.summary, icon: <Activity className="w-5 h-5" /> },
    { title: t.majorSurgeries, icon: <TrendingUp className="w-5 h-5" /> },
    { title: t.minorSurgeries, icon: <Scissors className="w-5 h-5" /> },
    { title: t.monthlyAnalysis, icon: <BarChartIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // Apply theme class to document element
    const themes = ['theme-indigo', 'theme-emerald', 'theme-rose', 'theme-amber'];
    document.documentElement.classList.remove(...themes);
    if (theme !== 'indigo') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  // Page Components
  const SummaryPage = () => {
    const surgeryTypeData = [
      { name: t.major, value: filteredData.filter(d => d.type === 'Major').reduce((acc, curr) => acc + curr.count, 0) },
      { name: t.minor, value: filteredData.filter(d => d.type === 'Minor').reduce((acc, curr) => acc + curr.count, 0) },
    ];

    const monthlyTrendData = useMemo(() => {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      return months.map(m => {
        const monthData = filteredData.filter(d => d.month === m);
        return {
          name: monthNames[m - 1],
          count: monthData.reduce((acc, curr) => acc + curr.count, 0)
        };
      });
    }, [filteredData]);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.totalSurgeries} 
          value={totalCount.toLocaleString()} 
          icon={<Activity className="w-6 h-6 text-[var(--accent)]" />} 
          trend="+12.4%"
          color="accent"
          lang={lang}
        />
        <StatCard 
          title={t.majorSurgeries} 
          value={surgeryTypeData[0].value.toLocaleString()} 
          icon={<Scissors className="w-6 h-6 text-orange-400" />} 
          trend="+18.1%"
          color="orange"
          lang={lang}
        />
        <StatCard 
          title={t.minorSurgeries} 
          value={surgeryTypeData[1].value.toLocaleString()} 
          icon={<List className="w-6 h-6 text-emerald-400" />} 
          trend="+8.5%"
          color="emerald"
          lang={lang}
        />
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-all group relative overflow-hidden shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">{t.highestMonth}</h4>
          <p className="text-xl font-extrabold mt-2 text-slate-900 relative z-10 font-mono">
            {filteredData.length > 0 ? monthNames[filteredData.reduce((prev, current) => (prev.count > current.count) ? prev : current).month - 1] : 'MAR'}
          </p>
          <p className="text-[10px] text-[var(--accent)] mt-1 font-bold relative z-10 uppercase font-mono">
            {filteredData.length > 0 ? Math.max(...filteredData.map(d => d.count)).toLocaleString() : '1,420'} UNITS
          </p>
        </div>
        
        <ChartCard title={t.surgeryDistribution} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={surgeryTypeData} innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none">
                <Cell fill="var(--accent)" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#0f172a', fontSize: '10px', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t.monthlyAnalysis} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tick={{ fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#0f172a', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  };

  const SurgeryTypeAnalysis = ({ type }: { type: SurgeryType }) => {
    const data = allData.filter(d => d.type === type);
    
    const yearlyBreakdown = useMemo(() => {
      const years = [2022, 2023, 2024, 2025];
      return years.map(y => {
        const yearData = data.filter(d => d.year === y);
        return {
          year: y.toString(),
          total: yearData.reduce((acc, curr) => acc + curr.count, 0)
        };
      });
    }, [data]);

    const monthlyHeatmap = useMemo(() => {
      return Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
        const monthData = filteredData.filter(d => d.month === m && d.type === type);
        return {
          name: monthNames[m - 1],
          value: monthData.reduce((acc, curr) => acc + curr.count, 0)
        };
      });
    }, [filteredData, type]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title={t.yearlyAnalysis}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={yearlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="total" fill={type === 'Major' ? '#f97316' : 'var(--accent)'} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title={t.monthlyAnalysis}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyHeatmap}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="value" stroke={type === 'Major' ? '#f97316' : 'var(--accent)'} fill={type === 'Major' ? '#f97316' : 'var(--accent)'} fillOpacity={0.1} strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    );
  };

  const MonthlyAnalysis = () => {
    const dataByMonth = Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
      const monthData = filteredData.filter(d => d.month === month);
      return {
        name: monthNames[month - 1],
        total: monthData.reduce((acc, curr) => acc + curr.count, 0)
      };
    });

    return (
      <div className="space-y-6">
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
           {(['all', 'Major', 'Minor'] as const).map(type => (
             <button
               key={type}
               onClick={() => setFilters(prev => ({ ...prev, type }))}
               className={cn(
                 "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                 filters.type === type ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
               )}
             >
               {type === 'all' ? t.all : (type === 'Major' ? t.major : t.minor)}
             </button>
           ))}
        </div>

        <ChartCard title={t.monthlyAnalysis}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dataByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} fontSize={10} tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Line type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={4} dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8, stroke: 'var(--accent)', strokeWidth: 2, fill: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case 0: return <SummaryPage />;
      case 1: return <SurgeryTypeAnalysis type="Major" />;
      case 2: return <SurgeryTypeAnalysis type="Minor" />;
      case 3: return <MonthlyAnalysis />;
      default: return <SummaryPage />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen p-4 lg:p-8 flex flex-col transition-all duration-700",
      "font-sans text-slate-900 bg-slate-50"
    )}>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white shadow-2xl shadow-slate-200 border border-slate-200 rounded-[2.5rem]">
        {/* Navigation Sidebar */}
        <aside className={cn(
          "w-full lg:w-72 border-b lg:border-b-0 lg:border-e border-slate-100 flex flex-col shrink-0",
          "lg:h-full overflow-y-auto bg-slate-50/50"
        )}>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent)]/30 transition-all duration-300">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight leading-none text-slate-900">{t.appName}</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{lang === 'ar' ? 'نظام التحليلات' : 'Analytics Cloud'}</p>
              </div>
            </div>

            <nav className="space-y-2">
              {pages.map((page, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={cn(
                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                    currentPage === idx 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <span className={cn(
                    "transition-transform",
                    currentPage === idx ? "scale-110" : "group-hover:scale-110"
                  )}>
                    {page.icon}
                  </span>
                  <span className="text-sm font-bold">{page.title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 space-y-8">
            {/* Theme Selector */}
            <div className="space-y-4">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">{lang === 'ar' ? 'نمط الألوان' : 'Color Scheme'}</span>
               <div className="grid grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  {(['indigo', 'emerald', 'rose', 'amber'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "w-full aspect-square rounded-xl transition-all border-2",
                        t === 'indigo' ? "bg-blue-600" : t === 'emerald' ? "bg-emerald-600" : t === 'rose' ? "bg-rose-600" : "bg-amber-500",
                        theme === t ? "border-slate-900 scale-110 shadow-lg" : "border-transparent opacity-40 hover:opacity-100"
                      )}
                    />
                  ))}
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t.language}</span>
              </div>
              <button 
                onClick={toggleLanguage}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all text-slate-700"
              >
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Top Bar */}
          <header className="h-24 px-10 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{pages[currentPage].title}</h2>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex bg-slate-50 rounded-2xl p-1 border border-slate-200">
                {years.slice(1).map(y => (
                  <button
                    key={y}
                    onClick={() => setFilters(prev => ({ ...prev, year: y }))}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                      filters.year === y ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    {y}
                  </button>
                ))}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, year: 'all' }))}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                    filters.year === 'all' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {t.all}
                </button>
              </div>
              
              <button className="w-12 h-12 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Area View */}
          <div className="p-10 overflow-y-auto flex-1 bg-slate-50/30">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + lang}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {mode === 'density' ? (
                  <DensityView data={filteredData} lang={lang} t={t} />
                ) : (
                  renderContent()
                )}
              </motion.div>
            </AnimatePresence>

            <footer className="mt-20 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] pb-10">
               <div className="flex gap-8">
                 <span className="hover:text-slate-900 cursor-pointer transition-colors">Safety</span>
                 <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy</span>
                 <span className="hover:text-slate-900 cursor-pointer transition-colors">System v.5.0</span>
               </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = 'indigo', lang }: { title: string, value: string, icon: React.ReactNode, trend?: string, color?: string, lang: Language }) {
  const accentColor = color === 'emerald' ? 'text-emerald-600' : color === 'orange' ? 'text-orange-600' : color === 'accent' ? 'text-[var(--accent)]' : 'text-blue-600';
  const barColor = color === 'emerald' ? 'bg-emerald-500' : color === 'orange' ? 'bg-orange-500' : color === 'accent' ? 'bg-[var(--accent)]' : 'bg-blue-600';
  
  return (
    <div className="professional-card p-8 flex flex-col justify-between group overflow-hidden relative">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={cn("p-4 rounded-2xl bg-white border border-slate-200 group-hover:scale-110 transition-transform", accentColor)}>
          {icon}
        </div>
        {trend && (
          <div className="flex flex-col items-end">
             <span className={cn("text-xs font-black", accentColor)}>{trend}</span>
             <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">{lang === 'ar' ? 'مقارنة' : 'COMPARISON'}</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-4xl font-extrabold tracking-tighter mb-2 text-slate-900">{value}</h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{title}</p>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
           <span>{lang === 'ar' ? 'مستوى الدقة' : 'Accuracy Level'}</span>
           <span className="text-slate-700">99.4%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: '85%' }}
             className={cn("h-full rounded-full", barColor)}
           />
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("professional-card p-8 flex flex-col", className)}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[var(--accent)] rounded-full transition-all duration-500" />
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">{title}</h3>
        </div>
        <div className="flex gap-1.5">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 bg-slate-100 rounded-full" />
           ))}
        </div>
      </div>
      <div className="flex-1 w-full min-h-[300px]">
        {children}
      </div>
    </div>
  );
}

function DensityView({ data, lang, t }: { data: SurgeryRecord[], lang: Language, t: any }) {
  return (
    <div className="professional-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-start">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-8 py-6 text-start text-[var(--accent)] font-bold uppercase tracking-widest font-mono">REF_ID</th>
              <th className="px-8 py-6 text-start text-slate-400 font-bold uppercase tracking-widest">{t.year}</th>
              <th className="px-8 py-6 text-start text-slate-400 font-bold uppercase tracking-widest">{t.month}</th>
              <th className="px-8 py-6 text-start text-slate-400 font-bold uppercase tracking-widest">{t.surgeryType}</th>
              <th className="px-8 py-6 text-start text-slate-400 font-bold uppercase tracking-widest">{t.totalSurgeries}</th>
              <th className="px-8 py-6 text-start text-slate-400 font-bold uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-5 font-mono text-slate-400 text-[10px]">#{row.id}</td>
                <td className="px-8 py-5 text-slate-600 font-bold">{row.year}</td>
                <td className="px-8 py-5 text-slate-500">0{row.month}</td>
                <td className="px-8 py-5 font-bold text-slate-900 uppercase tracking-tight">
                  {row.type === 'Major' ? t.major : t.minor}
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[var(--accent)] font-mono">{row.count}</span>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'ar' ? 'مؤرشف' : 'Verified'}</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

